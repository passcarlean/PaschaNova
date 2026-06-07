import React, { useState, useEffect } from 'react';
import { BLOCK_CATEGORIES, generateArduinoCode, generateEspCode } from '../data/blockDefinitions';
import { WorkspaceBlock, BlockType } from '../types';
import { 
  Plus, Trash2, Copy, MoveUp, MoveDown, Search, Cpu, Wifi, 
  Terminal, Sparkles, ZoomIn, ZoomOut, RotateCcw, Variable, 
  Brain, FileDown
} from 'lucide-react';
import { motion } from 'motion/react';

interface BlocklyPanelProps {
  blocks: WorkspaceBlock[];
  setBlocks: React.Dispatch<React.SetStateAction<WorkspaceBlock[]>>;
  addConsoleLine: (line: string) => void;
  consoleLines: string[];
}

export default function BlocklyPanel({
  blocks,
  setBlocks,
  addConsoleLine,
  consoleLines
}: BlocklyPanelProps) {
  const [activeCategory, setActiveCategory] = useState<string>('logic');
  const [activeRightTab, setActiveRightTab] = useState<'arduino' | 'esp32' | 'console'>('arduino');
  const [zoom, setZoom] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingVarId, setEditingVarId] = useState<string | null>(null);
  const [varRenameValue, setVarRenameValue] = useState<string>('');

  // Auto-generate triggers on block updates
  const arduinoCode = generateArduinoCode(blocks);
  const esp32Code = generateEspCode(blocks);

  // Sync virtual console during changes
  useEffect(() => {
    if (blocks.length > 0) {
      addConsoleLine(`[Compiler] Refreshed sketch logic. Detected ${blocks.length} active block instructions.`);
    }
  }, [blocks.length]);

  // Spawn new block in center
  const spawnBlock = (b: BlockType) => {
    const newBlock: WorkspaceBlock = {
      ...b,
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      x: 50,
      y: blocks.length * 80 + 30,
      // Default inputs copies
      fields: b.fields ? { ...b.fields } : {}
    };
    setBlocks(prev => [...prev, newBlock]);
    addConsoleLine(`[Blockly] Added instruction block: "${b.label}"`);
  };

  // Reorder instruction blocks
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === blocks.length - 1) return;

    const updated = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setBlocks(updated);
    addConsoleLine(`[Blockly] Moved block index to ${targetIndex}`);
  };

  // Duplicate a block
  const duplicateBlock = (index: number) => {
    const copy = {
      ...blocks[index],
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      fields: blocks[index].fields ? { ...blocks[index].fields } : {}
    };
    const updated = [...blocks];
    updated.splice(index + 1, 0, copy);
    setBlocks(updated);
    addConsoleLine(`[Blockly] Duplicated block: "${copy.label}"`);
  };

  // Delete block
  const deleteBlock = (index: number) => {
    const deleted = blocks[index];
    setBlocks(prev => prev.filter((_, i) => i !== index));
    addConsoleLine(`[Blockly] Deleted block: "${deleted.label}"`);
  };

  // Clear workspace completely
  const clearWorkspace = () => {
    setBlocks([]);
    addConsoleLine('[Blockly] Code canvas cleared.');
  };

  // Update field parameters/values inside a block
  const updateBlockField = (id: string, fieldName: string, value: any) => {
    setBlocks(prev => prev.map(b => {
      if (b.id === id) {
        return {
          ...b,
          fields: {
            ...b.fields,
            [fieldName]: value
          }
        };
      }
      return b;
    }));
  };

  // Handles renaming variables across all variable reference blocks
  const handleRenameVar = (id: string, currentName: string) => {
    setEditingVarId(id);
    setVarRenameValue(currentName);
  };

  const saveVarRename = (id: string) => {
    setBlocks(prev => prev.map(b => {
      if (b.fields?.name === varRenameValue || b.id === id) {
        return {
          ...b,
          fields: {
            ...b.fields,
            name: varRenameValue
          }
        };
      }
      return b;
    }));
    setEditingVarId(null);
    addConsoleLine(`[Blockly] Renamed variable reference to "${varRenameValue}"`);
  };

  const downloadSketchCode = () => {
    const code = activeRightTab === 'arduino' ? arduinoCode : esp32Code;
    const extension = activeRightTab === 'arduino' ? 'ino' : 'cpp';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PaschaNova_Sketch.${extension}`;
    link.click();
    addConsoleLine(`[System] Downloaded ${extension.toUpperCase()} sketch successfully.`);
  };

  const filteredCategories = BLOCK_CATEGORIES.map(category => ({
    ...category,
    blocks: category.blocks.filter(b => 
      b.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.blocks.length > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-140px)] select-none">
      
      {/* COLUMN 1: CATEGORIES DRAWER */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden shadow-xs">
        {/* Search tool */}
        <div className="p-3 border-b border-gray-100 dark:border-gray-700 space-y-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search blocks..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-orange-500 text-gray-800 dark:text-gray-200"
            />
          </div>
        </div>

        {/* Sidebar category grid tab chips */}
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-y-auto scrollbar-none border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-gray-700">
          {BLOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold shrink-0 text-left border-b lg:border-b-0 lg:border-l-4 transition-all ${
                activeCategory === cat.id
                  ? 'bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 border-orange-500'
                  : 'text-gray-500 dark:text-gray-400 border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/30'
              }`}
            >
              <div 
                className="w-3.5 h-3.5 rounded-full" 
                style={{ backgroundColor: cat.color }}
              />
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Category Blocks Shelf */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50/50 dark:bg-gray-800/40">
          <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Click to add block to screen
          </h4>
          
          {filteredCategories.find(c => c.id === activeCategory)?.blocks.map((block) => (
            <div
              key={block.id}
              onClick={() => spawnBlock(block)}
              className="cursor-pointer hover:scale-102 hover:-translate-y-0.5 active:scale-98 transition-all px-3 py-2.5 rounded-xl text-xs font-extrabold text-white flex items-center justify-between shadow-xs shadow-black/5"
              style={{ backgroundColor: block.color }}
            >
              <span>{block.label}</span>
              <Plus className="w-4 h-4 bg-white/20 rounded-full p-0.5" />
            </div>
          ))}

          {filteredCategories.find(c => c.id === activeCategory)?.blocks.length === 0 && (
            <p className="text-xs text-center text-gray-400 py-6">No matching blocks</p>
          )}
        </div>
      </div>

      {/* COLUMN 2: DRAGGABLE SNAPPING CODING WORKSPACE */}
      <div className="lg:col-span-5 bg-gray-100 dark:bg-gray-950 rounded-2xl border border-gray-200/55 dark:border-gray-800 flex flex-col h-full overflow-hidden shadow-Inner">
        
        {/* Workspace Operations Header bar */}
        <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse" />
            <h3 className="text-xs font-extrabold text-gray-800 dark:text-white uppercase tracking-wider">
              Instruction Canvas
            </h3>
            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
              {blocks.length} Steps
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoom(prev => Math.min(prev + 0.1, 1.5))}
              title="Zoom In"
              className="p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-gray-800 transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setZoom(prev => Math.max(prev - 0.1, 0.7))}
              title="Zoom Out"
              className="p-1.5 rounded-lg hover:bg-gray-150 dark:hover:bg-gray-800 transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
            </button>
            <button
              onClick={clearWorkspace}
              title="Clear Sandbox"
              className="p-1.5 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950 text-orange-500 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Puzzle Block List Space */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 relative" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
          {blocks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3 mt-12 bg-gray-50 dark:bg-gray-950/40 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl mx-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-950 text-orange-500 flex items-center justify-center animate-bounce">
                <Brain className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Workspace is Empty!</h4>
                <p className="text-xs text-gray-400 max-w-xs font-semibold">
                  Click on the colorful blocks in the left-hand drawer to build instructions for your smart board.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pr-2">
              {blocks.map((block, index) => {
                // Determine layout nesting rules (e.g. loops or logic branch code nested padding visuals)
                const isInnerNext = block.type === 'logic_if' || block.type === 'logic_if_else' || block.type.startsWith('loop_');
                
                return (
                  <motion.div
                    key={block.id}
                    layoutId={block.id}
                    className="relative flex flex-col rounded-2xl border-l-[6px] shadow-sm text-white overflow-hidden transition-all duration-200"
                    style={{ 
                      borderColor: block.color,
                      backgroundColor: `${block.color}cc`
                    }}
                  >
                    {/* Block puzzle joint connector simulation */}
                    <div className="absolute top-0 left-8 w-6 h-2 bg-yellow-400 rounded-b-md border-b border-black/10 z-20" />

                    <div className="px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
                      {/* Left: Input values/labels */}
                      <div className="flex items-center gap-2 flex-wrap text-xs font-extrabold">
                        <span>{block.label}</span>

                        {/* Interactive Parameters Setup */}
                        {block.fields && Object.keys(block.fields).map((fieldName) => {
                          const val = block.fields?.[fieldName];
                          
                          // Handle Var renamed field
                          if (fieldName === 'name') {
                            return editingVarId === block.id ? (
                              <input
                                key={fieldName}
                                type="text"
                                value={varRenameValue}
                                onChange={e => setVarRenameValue(e.target.value)}
                                onBlur={() => saveVarRename(block.id)}
                                onKeyDown={e => e.key === 'Enter' && saveVarRename(block.id)}
                                className="px-2 py-0.5 bg-black/40 text-white rounded-md border border-white/20 w-24 text-xs font-bold"
                                autoFocus
                              />
                            ) : (
                              <button
                                key={fieldName}
                                onClick={() => handleRenameVar(block.id, String(val))}
                                className="px-2 py-0.5 bg-black/30 hover:bg-black/50 text-white rounded-md flex items-center gap-1 border border-white/10"
                                title="Click to rename variable"
                              >
                                <Variable className="w-3 h-3 text-amber-300" />
                                <span>{String(val)}</span>
                              </button>
                            );
                          }

                          // General state switch dropdown
                          if (fieldName === 'state' || fieldName === 'val') {
                            return (
                              <select
                                key={fieldName}
                                value={String(val)}
                                onChange={e => updateBlockField(block.id, fieldName, e.target.value)}
                                className="px-2 py-0.5 bg-black/40 text-white rounded-md border border-white/20 text-[10px] font-bold outline-hidden"
                              >
                                <option value="HIGH">HIGH (ON)</option>
                                <option value="LOW">LOW (OFF)</option>
                              </select>
                            );
                          }

                          // Value numbers / text inputs
                          if (fieldName === 'ms' || fieldName === 'times' || fieldName === 'freq' || fieldName === 'text' || fieldName === 'pin' || fieldName === 'angle' || fieldName === 'speed' || fieldName === 'dir') {
                            return (
                              <input
                                key={fieldName}
                                type={typeof val === 'number' ? 'number' : 'text'}
                                value={String(val)}
                                onChange={e => updateBlockField(block.id, fieldName, typeof val === 'number' ? Number(e.target.value) : e.target.value)}
                                className="px-2 py-0.5 bg-black/30 text-white font-extrabold text-center rounded-md border border-white/10 text-[10px] w-12"
                              />
                            );
                          }

                          return null;
                        })}
                      </div>

                      {/* Right: Quick Block controls */}
                      <div className="flex items-center gap-1 opacity-90 hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => moveBlock(index, 'up')}
                          disabled={index === 0}
                          title="Move Instruction Up"
                          className="p-1 rounded-md bg-white/10 hover:bg-white/25 disabled:opacity-20 transition-all text-white"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveBlock(index, 'down')}
                          disabled={index === blocks.length - 1}
                          title="Move Instruction Down"
                          className="p-1 rounded-md bg-white/10 hover:bg-white/25 disabled:opacity-20 transition-all text-white"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateBlock(index)}
                          title="Copy Step"
                          className="p-1 rounded-md bg-white/10 hover:bg-white/25 transition-all text-white"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteBlock(index)}
                          title="Trash Step"
                          className="p-1 rounded-md bg-white/15 hover:bg-rose-600/60 transition-all text-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Simulated indented nested container outline for visual aesthetics */}
                    {isInnerNext && (
                      <div className="py-2.5 px-4 bg-black/10 border-t border-black/10 flex items-center justify-between text-[11px] font-semibold tracking-wide">
                        <span className="opacity-90 flex items-center gap-1">
                          <Brain className="w-3 h-3 text-orange-200" /> Auto-nest loops inside this operation slot.
                        </span>
                        <span className="text-[10px] opacity-75">• Nesting Mode</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 3: REAL-TIME SPEC CODE VIEWER & CONSOLE */}
      <div className="lg:col-span-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col h-full overflow-hidden shadow-xs">
        
        {/* Right Tab controls */}
        <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 p-2 flex items-center gap-1">
          {[
            { id: 'arduino', label: 'Arduino Sketch', icon: Cpu, badge: '.ino' },
            { id: 'esp32', label: 'ESP32 IoT Code', icon: Wifi, badge: '.cpp' },
            { id: 'console', label: 'Live Console', icon: Terminal, badge: 'Logs' }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeRightTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRightTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 text-[11px] font-extrabold rounded-lg transition-all ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Content Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-950 text-emerald-400 font-mono text-xs leading-relaxed select-text">
          
          {activeRightTab === 'arduino' && (
            <div className="relative">
              <button
                onClick={downloadSketchCode}
                className="absolute top-0 right-0 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
              >
                <FileDown className="w-3 h-3" /> Download .ino
              </button>
              <pre className="whitespace-pre-wrap pt-8">{arduinoCode}</pre>
            </div>
          )}

          {activeRightTab === 'esp32' && (
            <div className="relative">
              <button
                onClick={downloadSketchCode}
                className="absolute top-0 right-0 p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-[10px] font-bold flex items-center gap-1"
              >
                <FileDown className="w-3 h-3" /> Download .cpp
              </button>
              <pre className="whitespace-pre-wrap pt-8">{esp32Code}</pre>
            </div>
          )}

          {activeRightTab === 'console' && (
            <div className="space-y-1 select-none">
              <p className="text-[10px] text-gray-500 font-bold border-b border-gray-800 pb-1 uppercase tracking-widest flex items-center justify-between">
                <span>★ System Telemetry Logs ★</span>
                <span className="text-amber-500 animate-pulse">● Connected</span>
              </p>
              
              {consoleLines.length === 0 ? (
                <p className="text-gray-500 text-center py-12 text-xs">No activity yet. Run the simulation to trigger outputs!</p>
              ) : (
                consoleLines.map((line, i) => (
                  <p 
                    key={i} 
                    className={`text-[10px] ${
                      line.includes('[Compiler]') ? 'text-cyan-400' :
                      line.includes('[Blockly]') ? 'text-amber-400' :
                      line.includes('[Simulator]') ? 'text-emerald-400 animate-pulse' :
                      'text-gray-300'
                    }`}
                  >
                    {line}
                  </p>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
