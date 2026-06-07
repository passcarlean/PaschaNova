import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  signInWithPopup, 
  GoogleAuthProvider,
  updateProfile,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc
} from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';
import { AppUser } from '../types';

// Structured Firestore error management as outlined in the Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// --------------------------------------------------
// Firebase SDK Initialization with Fallback detection
// --------------------------------------------------
export const isLocalOnly = !firebaseConfig || firebaseConfig.apiKey === 'LOCAL_MOCK_API_KEY' || !firebaseConfig.apiKey;

let firebaseApp;
let firebaseDb: any = null;
let firebaseAuth: any = null;

if (!isLocalOnly) {
  try {
    firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    firebaseDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    firebaseAuth = getAuth(firebaseApp);
    console.log('[Firebase Engine] Live credentials recognized. Cloud services initialized.');
  } catch (err: any) {
    console.error('[Firebase Engine] Failed to initialize live SDK. Reverting to Offline Mode.', err instanceof Error ? err.message : String(err));
  }
} else {
  console.log('[Firebase Engine] Running Sandbox Fallback Mode (No live Firebase Terms Accepted yet).');
}

export const db = firebaseDb;
export const auth = firebaseAuth;

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth?.currentUser?.uid || 'anonymous-local',
      email: auth?.currentUser?.email || null,
      emailVerified: auth?.currentUser?.emailVerified || false,
      isAnonymous: auth?.currentUser?.isAnonymous || false,
      tenantId: auth?.currentUser?.tenantId || null,
      providerInfo: auth?.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Hardened Error Raised: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --------------------------------------------------
// Internal Mock User Store Helpers for Isomorphic fallback
// --------------------------------------------------
const STORAGE_USERS_KEY = 'pascha_mock_auth_users';
const STORAGE_SESSION_KEY = 'pascha_mock_session_user';

const mockAuthListeners: (() => void)[] = [];

function notifyMockAuthListeners() {
  mockAuthListeners.forEach(listener => {
    try {
      listener();
    } catch (e: any) {
      console.error('[Mock Auth Observer] Callback failed', e instanceof Error ? e.message : String(e));
    }
  });
}

interface MockUserRecord {
  uid: string;
  email: string;
  passwordHash: string; // Plaintext representation for simulation simplicity
  displayName: string;
  role: 'student' | 'maker' | 'admin';
  createdAt: string;
  updatedAt: string;
}

function getLocalUsersList(): MockUserRecord[] {
  try {
    const list = localStorage.getItem(STORAGE_USERS_KEY);
    return list && list !== 'undefined' && list.trim() !== '' ? JSON.parse(list) : [];
  } catch {
    return [];
  }
}

function saveLocalUsersList(users: MockUserRecord[]) {
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (err: any) {
    console.error('[Mock DB] Local storage writing failed.', err instanceof Error ? err.message : String(err));
  }
}

// --------------------------------------------------
// Consolidated Authentication API
// --------------------------------------------------
export const AuthService = {
  /**
   * Monitor auth status changes (supports both Firebase listeners and mock emissions)
   */
  onAuthChange(callback: (user: AppUser | null) => void): () => void {
    if (!isLocalOnly && auth) {
      // Direct Firebase binding
      return firebaseOnAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
        if (!fbUser) {
          callback(null);
          return;
        }

        try {
          // Read full roles database document
          const docRef = doc(db, 'users', fbUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            callback(docSnap.data() as AppUser);
          } else {
            // Document does not exist yet (e.g. standard Google sign in on first touch)
            const newUserProfile: AppUser = {
              uid: fbUser.uid,
              email: fbUser.email,
              displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Inventor Maker',
              role: 'student',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              isLocal: false,
            };

            // Attempt setting doc
            await setDoc(doc(db, 'users', fbUser.uid), newUserProfile);
            callback(newUserProfile);
          }
        } catch (error) {
          // Fallback read with limited features if read permissions are denied
          callback({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Maker Student',
            role: 'student',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLocal: false,
          });
        }
      });
    } else {
      // Mock triggers
      const syncWithLocalStorage = () => {
        try {
          const userStr = sessionStorage.getItem(STORAGE_SESSION_KEY) || localStorage.getItem(STORAGE_SESSION_KEY);
          if (userStr && userStr !== 'undefined' && userStr.trim() !== '') {
            callback(JSON.parse(userStr));
          } else {
            callback(null);
          }
        } catch {
          callback(null);
        }
      };

      // Set initial state check
      syncWithLocalStorage();

      // Listen for local tab changes/broadcasts triggers
      const listener = () => syncWithLocalStorage();
      window.addEventListener('storage', listener);
      mockAuthListeners.push(listener);

      return () => {
        window.removeEventListener('storage', listener);
        const idx = mockAuthListeners.indexOf(listener);
        if (idx !== -1) {
          mockAuthListeners.splice(idx, 1);
        }
      };
    }
  },

  /**
   * Register a new user using email & password
   */
  async signUp(email: string, password: string, displayName: string): Promise<AppUser> {
    const cleanEmail = email.trim().toLowerCase();
    
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    if (isLocalOnly || !auth) {
      // Local fallback execution
      const existingUsers = getLocalUsersList();
      const duplicate = existingUsers.find(u => u.email === cleanEmail);
      if (duplicate) {
        throw new Error('auth/email-already-in-use: This email is already registered.');
      }

      const uid = 'usr_lcl_' + Math.random().toString(36).substring(2, 10);
      const nowStr = new Date().toISOString();
      const newLocalRecord: MockUserRecord = {
        uid,
        email: cleanEmail,
        passwordHash: password, // For simulation purposes
        displayName: displayName.trim() || 'Excited Innovator',
        role: 'student',
        createdAt: nowStr,
        updatedAt: nowStr,
      };

      existingUsers.push(newLocalRecord);
      saveLocalUsersList(existingUsers);

      const returnedProfile: AppUser = {
        uid,
        email: cleanEmail,
        displayName: newLocalRecord.displayName,
        role: newLocalRecord.role,
        createdAt: nowStr,
        updatedAt: nowStr,
        isLocal: true,
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(returnedProfile));
      notifyMockAuthListeners();
      return returnedProfile;
    } else {
      // Firebase standard registration
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      await updateProfile(fbUser, { displayName: displayName.trim() });

      const nowStr = new Date().toISOString();
      const newUserProfile: AppUser = {
        uid: fbUser.uid,
        email: cleanEmail,
        displayName: displayName.trim(),
        role: 'student',
        createdAt: nowStr,
        updatedAt: nowStr,
        isLocal: false,
      };

      try {
        await setDoc(doc(db, 'users', fbUser.uid), newUserProfile);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, `users/${fbUser.uid}`);
      }

      return newUserProfile;
    }
  },

  /**
   * Sign in user with registered email & password combination
   */
  async signIn(email: string, password: string): Promise<AppUser> {
    const cleanEmail = email.trim().toLowerCase();

    if (isLocalOnly || !auth) {
      const existingUsers = getLocalUsersList();
      const match = existingUsers.find(u => u.email === cleanEmail);
      
      if (!match) {
        throw new Error('auth/user-not-found: No user found with this email.');
      }
      if (match.passwordHash !== password) {
        throw new Error('auth/wrong-password: Passcode coordinates do not match records.');
      }

      const loggedProfile: AppUser = {
        uid: match.uid,
        email: match.email,
        displayName: match.displayName,
        role: match.role,
        createdAt: match.createdAt,
        updatedAt: match.updatedAt,
        isLocal: true,
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(loggedProfile));
      notifyMockAuthListeners();
      return loggedProfile;
    } else {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const fbUser = userCredential.user;

      // Retrieve full profiles doc
      try {
        const docRef = doc(db, 'users', fbUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data() as AppUser;
        } else {
          // Make sure doc is synced if missing
          const defaultProf: AppUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Maker Scholar',
            role: 'student',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLocal: false,
          };
          await setDoc(doc(db, 'users', fbUser.uid), defaultProf);
          return defaultProf;
        }
      } catch (error) {
        return {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Maker Peer',
          role: 'student',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isLocal: false,
        };
      }
    }
  },

  /**
   * Universal one-tap Google login provider
   */
  async signInWithGoogle(): Promise<AppUser> {
    if (isLocalOnly || !auth) {
      // Mock dynamic Google Login
      const mockGId = 'usr_g_lcl_' + Math.random().toString(36).substring(2, 10);
      const nowStr = new Date().toISOString();
      const mockGoogleProfile: AppUser = {
        uid: mockGId,
        email: 'google.student@paschanova.edu',
        displayName: 'Google Scholar Maker',
        role: 'maker',
        createdAt: nowStr,
        updatedAt: nowStr,
        isLocal: true,
      };

      localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(mockGoogleProfile));
      notifyMockAuthListeners();
      return mockGoogleProfile;
    } else {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const fbUser = userCredential.user;

      try {
        const docRef = doc(db, 'users', fbUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          return docSnap.data() as AppUser;
        } else {
          const nowStr = new Date().toISOString();
          const newGoogleProfile: AppUser = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Global Scholar',
            role: 'maker',
            createdAt: nowStr,
            updatedAt: nowStr,
            isLocal: false,
          };
          await setDoc(doc(db, 'users', fbUser.uid), newGoogleProfile);
          return newGoogleProfile;
        }
      } catch (error) {
        return {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Authorized Scholar',
          role: 'maker',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isLocal: false,
        };
      }
    }
  },

  /**
   * Log out active account session
   */
  async signOut(): Promise<void> {
    if (isLocalOnly || !auth) {
      localStorage.removeItem(STORAGE_SESSION_KEY);
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      notifyMockAuthListeners();
      return;
    } else {
      await firebaseSignOut(auth);
    }
  },

  /**
   * Update active user displayName (respecting security rules which only permit changing this field)
   */
  async updateProfileName(uid: string, newName: string): Promise<void> {
    const trimmed = newName.trim();
    if (!trimmed) throw new Error('Display Moniker cannot be blank!');

    if (isLocalOnly || !auth) {
      const activeUserStr = localStorage.getItem(STORAGE_SESSION_KEY);
      if (activeUserStr && activeUserStr !== 'undefined' && activeUserStr.trim() !== '') {
        const u = JSON.parse(activeUserStr) as AppUser;
        u.displayName = trimmed;
        u.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(u));

        // Update list
        const usersList = getLocalUsersList();
        const idx = usersList.findIndex(usr => usr.uid === uid);
        if (idx !== -1) {
          usersList[idx].displayName = trimmed;
          usersList[idx].updatedAt = u.updatedAt;
          saveLocalUsersList(usersList);
        }

        notifyMockAuthListeners();
      }
    } else {
      // Live Firebase updates
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: trimmed });
      }
      try {
        await updateDoc(doc(db, 'users', uid), {
          displayName: trimmed,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
      }
    }
  }
};
