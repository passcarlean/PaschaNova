import React, { useState, useEffect } from 'react';
import { AppUser } from '../types';
import { 
  X, User, Mail, Calendar, Shield, Save, LogOut, Check, RefreshCw, 
  Settings, Award, Volume2, Grid, Sparkles, CheckSquare
} from 'lucide-react';

export interface UserSettings {
  difficultyLevel: 'student' | 'maker' | 'admin';
  gridSnapping: number; // 0, 5, 10, 20
  soundEnabled: boolean;
  autoSaveEnabled: boolean;
  userCertificates: string[];
}

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  onSignOut: () => void;
  onUpdateProfileName: (uid: string, newName: string) => Promise<void>;
  onUpdateRole: (uid: string, newRole: 'student' | 'maker' | 'admin') => Promise<void>;
  notify: (msg: string) => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: Partial<UserSettings>) => void;
}

export default function UserProfileModal({
  isOpen,
  onClose,
  currentUser,
  onSignOut,
  onUpdateProfileName,
  onUpdateRole,
  notify,
  userSettings,
  onUpdateSettings,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'badges'>('profile');
  const [newName, setNewName] = useState<string>(currentUser?.displayName || '');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Sync state name with prop on open
  useEffect(() => {
    if (currentUser?.displayName) {
      setNewName(currentUser.displayName);
    }
  }, [currentUser]);

  if (!isOpen || !currentUser) return null;

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName.trim() === currentUser.displayName) return;

    setIsUpdating(true);
    try {
      await onUpdateProfileName(currentUser.uid, newName);
      notify('Display name synchronized!');
    } catch (err: any) {
      notify(err.message || 'Error updating profile.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = async (role: 'student' | 'maker' | 'admin') => {
    try {
      await onUpdateRole(currentUser.uid, role);
      onUpdateSettings({ difficultyLevel: role });
      notify(`Difficulty focus configured to: ${role.toUpperCase()}`);
    } catch (err: any) {
      notify('Error updating classroom role.');
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200 dark:border-rose-900/45 text-[10px] font-black';
      case 'maker':
        return 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200 dark:border-emerald-900/45 text-[10px] font-black';
      default:
        return 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 border border-blue-200 dark:border-blue-900/45 text-[10px] font-black';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in animate-[duration_0.2s]">
      <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full border border-gray-150 dark:border-gray-800 overflow-hidden shadow-2xl relative">
        
        {/* Colorful progress header line */}
        <div className="h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-emerald-500 w-full" />

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-gray-800 text-gray-500 cursor-pointer transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tab Selection Header */}
        <div className="px-6 pt-6 flex border-b border-gray-100 dark:border-gray-800 gap-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile' 
                ? 'border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings' 
                ? 'border-orange-500 text-orange-600 dark:text-orange-400' 
                : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Lab Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('badges')}
            className={`pb-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'badges' 
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                : 'border-transparent text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Certificates ({userSettings.userCertificates.length})</span>
          </button>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          
          {/* ========================================== */}
          {/* TAB 1: PROFILE MANAGEMENT */}
          {/* ========================================== */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-lg font-extrabold text-2xl select-none">
                  {newName ? newName[0].toUpperCase() : 'M'}
                </div>
                
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black text-gray-950 dark:text-white tracking-tight leading-none">
                    {currentUser.displayName || 'Inventor Maker'}
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold font-mono">
                    {currentUser.isLocal ? 'Sandbox Session Profile' : 'Synced Cloud Profile'}
                  </p>
                </div>

                <span className={`inline-block px-3 py-1 rounded-full uppercase tracking-widest text-[8.5px] ${getRoleBadgeColor(currentUser.role)}`}>
                  ✦ {currentUser.role} Lab Focus ✦
                </span>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800" />

              <div className="space-y-3 text-xs text-gray-650 dark:text-gray-300">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase font-black text-gray-400 tracking-wider">Email Address</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">{currentUser.email || 'offline-sandbox@paschanova.edu'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase font-black text-gray-450 tracking-wider">Joined Date</span>
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {new Date(currentUser.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-gray-400 shrink-0" />
                  <div>
                    <span className="block text-[8px] uppercase font-black text-gray-450 tracking-wider">Security Trust Group</span>
                    <span className="font-bold text-gray-950 dark:text-white uppercase">
                      {currentUser.role === 'admin' ? 'Total Root Controller' : (currentUser.role === 'maker' ? 'Verified Builder Collaborator' : 'Standard Student Cadet')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800" />

              {/* Edit display name form */}
              <form onSubmit={handleUpdateName} className="space-y-1.5">
                <label className="text-[9.5px] uppercase font-black text-gray-400 tracking-wider block">
                  Modify Display Name
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      maxLength={30}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter new display name"
                      className="w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-150 dark:border-gray-750 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 text-gray-800 dark:text-gray-150"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isUpdating || newName.trim() === currentUser.displayName}
                    className="px-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center transition-all disabled:opacity-40"
                  >
                    {isUpdating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 2: ADVANCED LAB SETTINGS */}
          {/* ========================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-5 text-xs">
              
              {/* Maker Level Selection */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-wider block">
                  Select Classroom Target Experience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['student', 'maker', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => handleRoleChange(r)}
                      className={`py-2 px-1 text-center font-bold capitalize rounded-xl border text-[10px] transition-all cursor-pointer ${
                        currentUser.role === r
                          ? 'bg-orange-500 text-white border-orange-400 font-extrabold shadow-sm'
                          : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700/80 hover:bg-gray-100'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-gray-400 italic">
                  * Changes which Blockly drawers and robotics simulations unlock by default!
                </p>
              </div>

              {/* Grid Snapping */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-gray-400 tracking-wider flex justify-between items-center">
                  <span>Grid Snapping Alignment</span>
                  <span className="font-mono text-orange-500 font-bold">
                    {userSettings.gridSnapping === 0 ? 'Disabled' : `${userSettings.gridSnapping}px`}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 5, 10, 20].map((step) => (
                    <button
                      key={step}
                      onClick={() => onUpdateSettings({ gridSnapping: step })}
                      className={`py-1.5 px-2 rounded-lg border font-mono font-bold text-center text-[10.5px] cursor-pointer ${
                        userSettings.gridSnapping === step
                          ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 font-black'
                          : 'bg-white dark:bg-gray-850 border-gray-150 dark:border-gray-750 text-gray-500'
                      }`}
                    >
                      {step === 0 ? 'None' : `${step}px`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggle Switches */}
              <div className="space-y-3.5 pt-2 border-t border-gray-100 dark:border-gray-800">
                
                {/* Auto Save Toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block font-black text-gray-800 dark:text-gray-200">Auto Save Blueprints</span>
                    <span className="block text-[10px] text-gray-400">Silently backup projects into Sandbox index</span>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ autoSaveEnabled: !userSettings.autoSaveEnabled })}
                    className={`w-10 h-6 p-1 rounded-full transition-colors cursor-pointer ${
                      userSettings.autoSaveEnabled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-750'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform transform ${
                      userSettings.autoSaveEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Sound Alerts toggle */}
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="block font-black text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-orange-500" /> Smart Audio Indicators
                    </span>
                    <span className="block text-[10px] text-gray-400">Play alert sirens and buzzer alarms during simulate</span>
                  </div>
                  <button
                    onClick={() => onUpdateSettings({ soundEnabled: !userSettings.soundEnabled })}
                    className={`w-10 h-6 p-1 rounded-full transition-colors cursor-pointer ${
                      userSettings.soundEnabled ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-750'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform transform ${
                      userSettings.soundEnabled ? 'translate-x-4' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

              </div>

            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: EARNED CERTIFICATES & TRAINING BADGES */}
          {/* ========================================== */}
          {activeTab === 'badges' && (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-250 dark:bg-emerald-950/20 dark:border-emerald-900">
                  <Award className="w-6 h-6 animate-pulse" />
                </div>
                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Academic Achievement Portfolio
                </h4>
                <p className="text-[10.5px] text-gray-400 font-bold max-w-xs mx-auto">
                  Finish the interactive onboarding guides on the Home page to retrieve certifications here.
                </p>
              </div>

              <div className="border-t border-gray-100 dark:border-gray-800" />

              {userSettings.userCertificates.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-950/40 border border-dashed rounded-2xl">
                  <p className="text-xs text-gray-400 font-bold">No academic badges unlocked yet.</p>
                  <p className="text-[10px] text-gray-400/80 mt-1">Head to the Home Lab and start any guide to earn badges!</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {userSettings.userCertificates.map((certTitle, index) => (
                    <div 
                      key={index}
                      className="p-3 bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-250 rounded-2xl flex justify-between items-center"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow">
                          ★
                        </div>
                        <div>
                          <span className="block text-[11.5px] font-black text-gray-800 dark:text-gray-200 leading-tight">
                            {certTitle}
                          </span>
                          <span className="block text-[8px] uppercase tracking-wider font-extrabold text-emerald-500">
                            Verified inventor
                          </span>
                        </div>
                      </div>
                      <button 
                        onClick={() => notify(`Downloaded PDF Certificate for ${certTitle}!`)}
                        className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm shrink-0"
                      >
                        Print PDF
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          <div className="border-t border-gray-100 dark:border-gray-800" />

          {/* Log Out option */}
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="w-full py-2.5 border border-rose-250 hover:bg-rose-50 dark:border-rose-900/60 dark:hover:bg-rose-955/10 text-rose-600 dark:text-rose-450 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Abandon session (Log Out)</span>
          </button>

        </div>

      </div>
    </div>
  );
}
