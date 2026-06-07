import React from 'react';
import { Play, RotateCcw, Share2, Save, Code, Sun, Moon, Cpu, Layout, Bot, Wifi, Sparkles, BookOpen, Layers } from 'lucide-react';
import { AppUser } from '../types';

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
  isRunning: boolean;
  onToggleRun: () => void;
  onReset: () => void;
  onExport: () => void;
  onSave: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  currentUser: AppUser | null;
  onAuthClick: () => void;
  onProfileClick: () => void;
}

export default function Navigation({
  currentTab,
  setTab,
  isRunning,
  onToggleRun,
  onReset,
  onExport,
  onSave,
  isDarkMode,
  toggleDarkMode,
  currentUser,
  onAuthClick,
  onProfileClick,
}: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Layout, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/40' },
    { id: 'blockly', label: 'Blockly Studio', icon: Code, color: 'text-orange-500 bg-orange-50 dark:bg-orange-950/40' },
    { id: 'circuit', label: 'Circuit Builder', icon: Cpu, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40' },
    { id: 'robotics', label: 'Robotics Lab', icon: Bot, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40' },
    { id: 'iot', label: 'IoT Lab', icon: Wifi, color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/40' },
    { id: 'ai', label: 'AI Lab', icon: Sparkles, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' },
    { id: 'templates', label: 'Templates', icon: Layers, color: 'text-cyan-500 bg-cyan-50 dark:bg-cyan-950/40' },
    { id: 'lessons', label: 'Lessons', icon: BookOpen, color: 'text-pink-500 bg-pink-50 dark:bg-pink-950/40' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-3 transition-colors shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo and Brand */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 via-orange-500 to-emerald-500 flex items-center justify-center shadow-md shadow-blue-500/10 hover:rotate-12 transition-transform">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-orange-500 to-emerald-600 bg-clip-text text-transparent">
              PaschaNova <span className="text-gray-900 dark:text-white font-medium">Labs</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">
              ★ Digital STEM Playground ★
            </p>
          </div>
        </div>

        {/* Labs Navigator Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-${tab.id}`}
                onClick={() => setTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 select-none ${
                  isActive
                    ? `${tab.color} scale-102 border-b-2 border-orange-500 shadow-sm text-gray-800 dark:text-white`
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800/80 hover:scale-101'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'animate-bounce' : ''}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Universal Studio Deck Controls */}
        <div className="flex items-center gap-2">
          {/* RUN SIMULATION CONTROL */}
          <button
            id="control-run"
            onClick={onToggleRun}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white shadow-md transition-all duration-300 ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20 animate-pulse'
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 active:scale-95'
            }`}
          >
            <Play className={`w-4 h-4 fill-current ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Stop Sim' : 'Run Studio'}</span>
          </button>

          {/* RESET CONTROL */}
          <button
            id="control-reset"
            onClick={onReset}
            title="Reset Workspace"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-100 hover:text-orange-500 dark:hover:bg-orange-950/40 transition-all border border-transparent hover:border-orange-200"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* SAVE CONTROL */}
          <button
            id="control-save"
            onClick={onSave}
            title="Save Project Local State"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-blue-100 hover:text-blue-500 dark:hover:bg-blue-950/40 transition-all border border-transparent hover:border-blue-200"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* EXPORT CONTROL */}
          <button
            id="control-export"
            onClick={onExport}
            title="Export Arduino/ESP32 Code"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-cyan-100 hover:text-cyan-500 dark:hover:bg-cyan-950/40 transition-all border border-transparent hover:border-cyan-200"
          >
            <Code className="w-4 h-4" />
          </button>

          {/* USER PROFILE OR LOGIN ACTIONS */}
          {currentUser ? (
            <button
              id="control-userprofile"
              onClick={onProfileClick}
              title={`View ${currentUser.displayName}'s Lab profile`}
              className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/45 dark:hover:bg-indigo-950/70 border border-indigo-100/60 dark:border-indigo-900/65 text-indigo-700 dark:text-indigo-300 cursor-pointer transition-all shrink-0"
            >
              <div className="w-5.5 h-5.5 rounded-lg bg-indigo-650 flex items-center justify-center text-white font-black text-xs select-none">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : 'M'}
              </div>
              <span className="text-[11px] font-extrabold hidden sm:inline max-w-[80px] truncate">
                {currentUser.displayName?.split(' ')[0]}
              </span>
            </button>
          ) : (
            <button
              id="control-login"
              onClick={onAuthClick}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase shadow-sm shadow-indigo-500/10 cursor-pointer transition-all active:scale-95 shrink-0"
            >
              <span>Log In</span>
            </button>
          )}

          {/* DARK MODE SWITCH */}
          <button
            id="control-darkmode"
            onClick={toggleDarkMode}
            title="Toggle Bright/Dark Lab light"
            className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
          </button>
        </div>
      </div>
    </header>
  );
}
