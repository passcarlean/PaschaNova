import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import HomePanel from './components/HomePanel';
import BlocklyPanel from './components/BlocklyPanel';
import CircuitPanel from './components/CircuitPanel';
import RoboticsPanel from './components/RoboticsPanel';
import IotPanel from './components/IotPanel';
import AiPanel from './components/AiPanel';
import TemplatesPanel from './components/TemplatesPanel';
import LessonsPanel from './components/LessonsPanel';

import { WorkspaceBlock, CircuitComponent, WireConnection, Lesson, AppUser, SavedProject } from './types';
import { PROJECT_TEMPLATES } from './data/templates';
import { 
  Save, Download, CheckCircle, Copy, AlertCircle, X, Code, Play
} from 'lucide-react';
import { AuthService } from './lib/firebase';
import AuthModal from './components/AuthModal';
import UserProfileModal from './components/UserProfileModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  const [currentTab, setTab] = useState<string>('home');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Design Sandboxes States
  const [blocks, setBlocks] = useState<WorkspaceBlock[]>([]);
  const [components, setComponents] = useState<CircuitComponent[]>([]);
  const [wires, setWires] = useState<WireConnection[]>([]);
  const [consoleLines, setConsoleLines] = useState<string[]>([
    '[System] Welcome to PaschaNova Labs STEM Study! 🚀',
    '[System] Click "Parts Drawer" to start dragging electronic components onto your breadboard.'
  ]);

  // Modals & Action overlays
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [saveTitle, setSaveTitle] = useState<string>('');
  const [saveDesc, setSaveDesc] = useState<string>('');
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Sync dark mode class stylesheet
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Load from local storage persistence on startup & register Auth subscription
  useEffect(() => {
    const unsubscribe = AuthService.onAuthChange((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    try {
      const savedBlocks = localStorage.getItem('paschanova_blocks');
      if (savedBlocks && savedBlocks !== 'undefined' && savedBlocks.trim() !== '') {
        try {
          setBlocks(JSON.parse(savedBlocks) || []);
        } catch (e) {
          console.error('Error parsing paschanova_blocks:', e);
        }
      }

      const savedComps = localStorage.getItem('paschanova_components');
      if (savedComps && savedComps !== 'undefined' && savedComps.trim() !== '') {
        try {
          setComponents(JSON.parse(savedComps) || []);
        } catch (e) {
          console.error('Error parsing paschanova_components:', e);
        }
      }

      const savedWires = localStorage.getItem('paschanova_wires');
      if (savedWires && savedWires !== 'undefined' && savedWires.trim() !== '') {
        try {
          setWires(JSON.parse(savedWires) || []);
        } catch (e) {
          console.error('Error parsing paschanova_wires:', e);
        }
      }

      const savedProjList = localStorage.getItem('paschanova_saved_projects');
      if (savedProjList && savedProjList !== 'undefined' && savedProjList.trim() !== '') {
        try {
          setSavedProjects(JSON.parse(savedProjList) || []);
        } catch (e) {
          console.error('Error parsing paschanova_saved_projects:', e);
        }
      }
    } catch (e: any) {
      console.error('Local Storage fetch error', e instanceof Error ? e.message : String(e));
    }
  }, []);

  const addConsoleLine = (line: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setConsoleLines(prev => [`[${timestamp}] ${line}`, ...prev.slice(0, 40)]);
  };

  const notifyUser = (message: string) => {
    setLastNotification(message);
    setTimeout(() => {
      setLastNotification(null);
    }, 3500);
  };

  // Toggles simulator power supply
  const handleToggleRun = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (nextState) {
      addConsoleLine('[Simulator] ⚡ Visual simulator powered ON! Voltage lines activated.');
      notifyUser('Simulation running successfully!');
    } else {
      addConsoleLine('[Simulator] 🔌 Power supply down. Simulator standby.');
    }
  };

  // resets sandboxes
  const handleResetWorkspace = () => {
    setBlocks([]);
    setComponents([]);
    setWires([]);
    setIsRunning(false);
    addConsoleLine('[System] Complete workspace reset. Wiped drag canvas coordinates.');
    notifyUser('Workspace layout reset.');
  };

  // Opens Save modal for the Gallery and Quick Save
  const handleSaveWorkspace = () => {
    setShowSaveModal(true);
  };

  const handleSaveProjectToGallery = (title: string, desc: string) => {
    try {
      const newProj: SavedProject = {
        id: `proj_${Date.now()}`,
        title: title.trim() || `Design on ${new Date().toLocaleDateString()}`,
        description: desc.trim() || `Contains ${components.length} parts and ${blocks.length} blocks.`,
        blocks,
        components,
        wires,
        savedAt: new Date().toLocaleDateString(undefined, {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      };

      const updatedList = [newProj, ...savedProjects];
      setSavedProjects(updatedList);
      localStorage.setItem('paschanova_saved_projects', JSON.stringify(updatedList));

      // Standard background save as fallback
      localStorage.setItem('paschanova_blocks', JSON.stringify(blocks));
      localStorage.setItem('paschanova_components', JSON.stringify(components));
      localStorage.setItem('paschanova_wires', JSON.stringify(wires));

      addConsoleLine(`[Gallery Engine] Saved current design: "${newProj.title}" to your permanent portfolio 💾`);
      notifyUser(`Saved "${newProj.title}" to Gallery!`);
      setShowSaveModal(false);
      setSaveTitle('');
      setSaveDesc('');
    } catch (e: any) {
      console.error(e);
      notifyUser('Error compiling project payload.');
    }
  };

  const handleLoadSavedProject = (project: SavedProject) => {
    setBlocks(project.blocks || []);
    setComponents(project.components || []);
    setWires(project.wires || []);
    setIsRunning(false);
    addConsoleLine(`[Gallery Engine] Successfully loaded project workspace: "${project.title}" 🚀`);
    notifyUser(`Loaded "${project.title}"`);
    setTab('circuit');
  };

  const handleDeleteSavedProject = (id: string) => {
    try {
      const updatedList = savedProjects.filter(p => p.id !== id);
      setSavedProjects(updatedList);
      localStorage.setItem('paschanova_saved_projects', JSON.stringify(updatedList));
      addConsoleLine('[Gallery Engine] Removed project from saved gallery index.');
      notifyUser('Project deleted from Gallery.');
    } catch (e) {
      notifyUser('Error deleting project.');
    }
  };

  // Launch Code export modal overlay
  const handleExportCodeClick = () => {
    setShowExportModal(true);
    addConsoleLine('[Export] Generated Arduino & ESP32 sketch code templates.');
  };

  // Loading Predefined Guided Templates
  const handleLoadTemplate = (templateId: string) => {
    const found = PROJECT_TEMPLATES.find(t => t.id === templateId);
    if (found) {
      setBlocks(found.blocks);
      setComponents(found.components);
      setWires(found.wires);
      setIsRunning(false); // reset simulation run on new load
      setTab('circuit'); // Take them immediately to circuit board to inspect loaded parts
      addConsoleLine(`[Template Engine] Instantly pre-loaded project blueprint: "${found.title}"`);
      notifyUser(`Loaded "${found.title}" template.`);
    }
  };

  // Loading Lesson preset guidelines
  const handleLoadLessonPreset = (lesson: Lesson) => {
    setBlocks(lesson.preFilledBlocks || []);
    setComponents(lesson.preFilledComponents || []);
    setWires([]);
    setIsRunning(false);
    addConsoleLine(`[Education Engine] Reset canvas blocks to load objective tasks for mission: "${lesson.title}"`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 transition-colors flex flex-col font-sans text-gray-800 dark:text-gray-100 pb-12">
      
      {/* Universal header Navigation deck */}
      <Navigation
        currentTab={currentTab}
        setTab={setTab}
        isRunning={isRunning}
        onToggleRun={handleToggleRun}
        onReset={handleResetWorkspace}
        onExport={handleExportCodeClick}
        onSave={handleSaveWorkspace}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        currentUser={currentUser}
        onAuthClick={() => setShowAuthModal(true)}
        onProfileClick={() => setShowProfileModal(true)}
      />

      {/* Floating notification banners */}
      {lastNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-gray-700/60 text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-2xl animate-bounce text-xs font-bold font-mono">
          <CheckCircle className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{lastNotification}</span>
        </div>
      )}

      {/* Main active Sandbox display panel container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-1">
        {currentTab === 'home' && (
          <HomePanel
            setTab={setTab}
            onLoadTemplate={handleLoadTemplate}
            savedProjects={savedProjects}
            onLoadProject={handleLoadSavedProject}
            onDeleteProject={handleDeleteSavedProject}
          />
        )}
        
        {currentTab === 'blockly' && (
          <BlocklyPanel
            blocks={blocks}
            setBlocks={setBlocks}
            addConsoleLine={addConsoleLine}
            consoleLines={consoleLines}
          />
        )}

        {currentTab === 'circuit' && (
          <CircuitPanel
            components={components}
            setComponents={setComponents}
            wires={wires}
            setWires={setWires}
            isRunning={isRunning}
            addConsoleLine={addConsoleLine}
          />
        )}

        {currentTab === 'robotics' && (
          <RoboticsPanel isRunning={isRunning} addConsoleLine={addConsoleLine} />
        )}

        {currentTab === 'iot' && (
          <IotPanel isRunning={isRunning} addConsoleLine={addConsoleLine} />
        )}

        {currentTab === 'ai' && (
          <AiPanel isRunning={isRunning} addConsoleLine={addConsoleLine} />
        )}

        {currentTab === 'templates' && (
          <TemplatesPanel onLoadTemplate={handleLoadTemplate} />
        )}

        {currentTab === 'lessons' && (
          <LessonsPanel
            onLoadLessonPreset={handleLoadLessonPreset}
            blocksCount={blocks.length}
            componentsCount={components.length}
            isRunning={isRunning}
            addConsoleLine={addConsoleLine}
          />
        )}
      </main>

      {/* MODAL OVERLAY: EXPORT CODE TO REAL ARDUINO OR ESP32 IDE */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full border border-gray-100 dark:border-gray-700 overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-orange-500" />
                <h3 className="text-sm font-black uppercase dark:text-white tracking-wider">
                  Export Studio Sketch
                </h3>
              </div>
              <button 
                onClick={() => setShowExportModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Info box */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                Take your innovations mobile! Copy or download the compiled sketch files to paste them straight into standard Arduino IDE or Espressif IoT builders to power real hardware.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-150 p-4 rounded-2xl space-y-2 text-center">
                  <h4 className="font-extrabold text-xs text-cyan-700">Arduino Sketch (.ino)</h4>
                  <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Ideal for Uno R3 boards, Nano modules, and general motors layouts.</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(localStorage.getItem('paschanova_blocks') || '// No layout blocks compiled.');
                      notifyUser('Arduino code copied to clipboard!');
                    }}
                    className="mt-2 py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white font-extrabold rounded-xl text-[10px] uppercase w-full cursor-pointer"
                  >
                    Copy Arduino .ino
                  </button>
                </div>

                <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-150 p-4 rounded-2xl space-y-2 text-center">
                  <h4 className="font-extrabold text-xs text-rose-700">ESP32 IoT Script (.cpp)</h4>
                  <p className="text-[10px] text-gray-400 font-semibold leading-relaxed">Fits ESP32 Wi-Fi NodeMCUs, cloud telemetry servers and network relays.</p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(localStorage.getItem('paschanova_blocks') || '// No layout blocks compiled.');
                      notifyUser('ESP32 script copied to clipboard!');
                    }}
                    className="mt-2 py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-extrabold rounded-xl text-[10px] uppercase w-full cursor-pointer"
                  >
                    Copy ESP32 C++
                  </button>
                </div>
              </div>
            </div>

            {/* Modal actions close */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-150 dark:border-gray-700 text-right">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-5 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-xl text-xs font-black cursor-pointer"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL OVERLAY: SAVE PROJECT TO THE GALLERY */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-md w-full border border-gray-150 dark:border-gray-700 overflow-hidden shadow-2xl">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-150 dark:border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-black uppercase dark:text-white tracking-wider">
                  Save Project Blueprint
                </h3>
              </div>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                id="close-save-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <p className="text-xs text-gray-400 font-bold leading-relaxed">
                Save your blocks and custom components to your personal Lab Gallery, keeping your STEM innovations organized!
              </p>

              {/* Elements Summary Card */}
              <div className="p-3.5 bg-gray-50 dark:bg-gray-900/60 rounded-2xl border border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-2 text-center text-xs font-bold text-gray-600 dark:text-gray-300">
                <div>
                  <span className="block text-lg font-black text-blue-500">{components.length}</span>
                  Circuit Parts
                </div>
                <div>
                  <span className="block text-lg font-black text-orange-500">{blocks.length}</span>
                  Logic Blocks
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    id="save-project-title-input"
                    placeholder="e.g. My Smart Beacon, Rover Controller"
                    value={saveTitle}
                    onChange={(e) => setSaveTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1">
                    Short Description (Optional)
                  </label>
                  <textarea
                    id="save-project-desc-input"
                    placeholder="Describe how your design logic behaves..."
                    value={saveDesc}
                    rows={3}
                    onChange={(e) => setSaveDesc(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-150 dark:border-gray-700 flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-650 text-gray-800 dark:text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-save-gallery"
                onClick={() => handleSaveProjectToGallery(saveTitle, saveDesc)}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-xs transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Save to Gallery Portfolio 💾
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL OVERLAY: AUTHENTICATION SIGN UP / LOGIN */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user, greeting) => {
          setCurrentUser(user);
          addConsoleLine(`[Auth] Identity verified successfully: "${user.displayName}" signed in. 🔒`);
          notifyUser(greeting);
        }}
      />

      {/* MODAL OVERLAY: USER ACCOUNT LOGGED PROFILE SETTINGS SCREEN */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        currentUser={currentUser}
        notify={notifyUser}
        onSignOut={async () => {
          try {
            await AuthService.signOut();
            setCurrentUser(null);
            addConsoleLine('[Auth] Signed out of current workspace environment session.');
            notifyUser('Signed out successfully.');
          } catch (err: any) {
            notifyUser('Err during sign out processing.');
          }
        }}
        onUpdateProfileName={async (uid, updatedName) => {
          await AuthService.updateProfileName(uid, updatedName);
          if (currentUser) {
            setCurrentUser({ ...currentUser, displayName: updatedName });
          }
        }}
      />

    </div>
  );
}
