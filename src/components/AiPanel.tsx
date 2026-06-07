import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Camera, Mic, Volume2, ShieldCheck, Play, StopCircle, 
  Layers, Smile, Focus, RefreshCw, VolumeX 
} from 'lucide-react';

interface AiPanelProps {
  isRunning: boolean;
  addConsoleLine: (line: string) => void;
}

export default function AiPanel({ isRunning, addConsoleLine }: AiPanelProps) {
  const [aiMode, setAiMode] = useState<'face' | 'object' | 'color' | 'speech'>('face');
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  
  // Simulated object lists
  const [detectedItem, setDetectedItem] = useState<string>('Arduino Board');
  const [confidence, setConfidence] = useState<number>(98);
  const [ttsText, setTtsText] = useState<string>('Object detected in Robotics Lab!');
  const [micActive, setMicActive] = useState<boolean>(false);
  const [voiceInput, setVoiceInput] = useState<string>('');
  
  // Simulated tracking frames coordinates
  const [markerX, setMarkerX] = useState<number>(140);
  const [markerY, setMarkerY] = useState<number>(80);

  // Animation ticks for face/object meshes drift
  useEffect(() => {
    let interval: any;
    if (isCapturing) {
      interval = setInterval(() => {
        setMarkerX(100 + Math.random() * 80);
        setMarkerY(60 + Math.random() * 50);
        
        // Randomly simulate items found in object mode
        if (aiMode === 'object') {
          const objects = ['Smart LED Pin 13', 'LDR Photoresistor', 'Robot Chassis Box', 'Human Maker Student', 'Jumper Wire Ribbon'];
          setDetectedItem(objects[Math.floor(Math.random() * objects.length)]);
          setConfidence(Math.round(85 + Math.random() * 14));
        }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isCapturing, aiMode]);

  // Activate / stop camera feed
  const toggleCamera = () => {
    setIsCapturing(!isCapturing);
    addConsoleLine(`[AI Computer Vision] ${!isCapturing ? 'ACTIVATING' : 'STOPPING'} smart lens camera... 📸`);
  };

  // Speaks out custom text via Web Speech synthesis API
  const speakText = () => {
    if ('speechSynthesis' in window) {
      const sentence = new SpeechSynthesisUtterance(ttsText);
      sentence.rate = 1.0;
      sentence.pitch = 1.2; // Kid friendly cute pitch
      window.speechSynthesis.speak(sentence);
      addConsoleLine(`[AI Text-to-Speech] Synthetic Voice output spoken: "${ttsText}" 🔊`);
    } else {
      addConsoleLine(`[AI Speech Synthesis API error] System web browser does not support Speech Utterances.`);
    }
  };

  // Simulated Speech inputs matching Voice Commands
  const handleVoiceKeyword = (command: string) => {
    setVoiceInput(command);
    setMicActive(true);
    addConsoleLine(`[AI Voice Assist] Microphone hears: "${command}"... PROCESSING 🎙️`);
    
    setTimeout(() => {
      setMicActive(false);
      if (command === 'open sesame') {
        addConsoleLine('[AI Smart Automation] Command parsed: Password Accepted. Unlocking relay Pin 12! 🔓');
      } else if (command === 'lights on') {
        addConsoleLine('[AI Smart Automation] Command parsed: LED Digital Pin 13 written to HIGH! 💡');
      } else if (command === 'launch rocket') {
        addConsoleLine('[AI Smart Automation] Command parsed: Servo Pin 10 rotation angle initialized to 180°! 🚀');
      }
    }, 1100);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      
      {/* COLUMN 1: AI FILTER TYPES SELECTION */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 flex flex-col justify-between h-full space-y-4 shadow-xs">
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500 animate-spin-slow" /> AI Smart Tools
            </h3>
            <p className="text-[10px] font-bold text-gray-400">Train neural tools on sensory feeds.</p>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: 'face', label: 'Face Tracking mesh', desc: 'Identify facial nodes & overlays', icon: Smile },
              { id: 'object', label: 'Object Classifier', desc: 'Auto-detect breadboard modules', icon: Focus },
              { id: 'speech', label: 'Voice Command Deck', desc: 'Automate relays via voice scripts', icon: Mic }
            ].map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setAiMode(mode.id as any)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    aiMode === mode.id
                      ? 'bg-purple-50 dark:bg-purple-950/25 text-purple-600 dark:text-purple-400 border-purple-500 font-extrabold scale-102'
                      : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 hover:bg-white dark:hover:bg-gray-800 text-gray-600 hover:scale-101'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 shrink-0 text-purple-500" />
                    <div>
                      <div className="text-sm font-extrabold leading-tight">{mode.label}</div>
                      <div className="text-[9.5px] text-gray-400">{mode.desc}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic speech synthesis text box */}
        <div className="bg-purple-50/50 dark:bg-purple-950/20 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-950/40 space-y-2">
          <label className="text-[9px] font-black uppercase text-purple-500 block">
            🗣️ Text-To-Speech Synthesizer
          </label>
          <input
            type="text"
            value={ttsText}
            onChange={(e) => setTtsText(e.target.value)}
            className="w-full text-xs p-2 rounded-lg bg-white dark:bg-gray-800 border border-purple-250 text-gray-800 dark:text-white font-bold outline-hidden focus:ring-1 focus:ring-purple-400"
          />
          <button
            onClick={speakText}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/10 hover:scale-101 active:scale-98 transition-all cursor-pointer"
          >
            <Volume2 className="w-3.5 h-3.5" /> Synthesize Voice
          </button>
        </div>
      </div>

      {/* COLUMN 2: CAMERA SIMULATOR AND AUDIT MATRIX */}
      <div className="lg:col-span-9 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden shadow-inner relative">
        
        {/* Visualizer Header */}
        <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <span className={`w-2.5 h-2.5 rounded-full ${isCapturing ? 'bg-purple-500 animate-ping' : 'bg-gray-300'}`} />
            <h3 className="dark:text-white uppercase tracking-wider">Neural Stream Sandbox</h3>
          </div>
          <button
            onClick={toggleCamera}
            className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black uppercase flex items-center gap-1 text-white shadow-md transition-all ${
              isCapturing ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/10' : 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/10'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{isCapturing ? 'Close Camera' : 'Activate Sight'}</span>
          </button>
        </div>

        {/* Primary Viewfinder */}
        <div className="flex-1 relative flex items-center justify-center bg-slate-900 overflow-hidden">
          
          {/* CAMERA SECTOR SIGHT OVERLAYS */}
          {isCapturing ? (
            <div className="w-full h-full relative flex items-center justify-center">
              
              {/* Fake High-Fidelity video preview of student's desk */}
              <div className="absolute inset-0 bg-linear-to-tr from-slate-950 via-slate-900 to-indigo-950" />
              
              {/* Outer scope borders overlay */}
              <div className="absolute top-6 left-6 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-md" />
              <div className="absolute top-6 right-6 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-md" />
              <div className="absolute bottom-6 left-6 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-md" />
              <div className="absolute bottom-6 right-6 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-md" />

              {/* FACE DETECTION GRAPHIC MESH */}
              {aiMode === 'face' && (
                <div 
                  className="absolute w-40 h-40 border-2 border-dashed border-cyan-400 rounded-3xl flex flex-col justify-between items-center p-3 animate-pulse transition-all duration-700 shadow-lg shadow-cyan-400/15"
                  style={{ left: markerX, top: markerY }}
                >
                  <div className="w-full flex justify-between px-1">
                    <span className="text-[6px] text-cyan-300 bg-cyan-950 border border-cyan-500/30 font-bold px-1 rounded-sm uppercase tracking-wider">Face Mesh</span>
                    <span className="text-[6.5px] text-cyan-400 font-black">99.2% Lock</span>
                  </div>

                  {/* Fun neon sunglasses overlay placement simulation */}
                  <div className="w-32 h-6 bg-cyan-400 rounded-full flex justify-around p-1 shadow-inner relative z-10">
                    <div className="w-8 h-4 bg-slate-900 rounded-full" />
                    <div className="w-8 h-4 bg-slate-900 rounded-full" />
                  </div>

                  <span className="text-[8px] text-cyan-300 font-extrabold tracking-widest leading-none">CUTE STUDENT</span>
                </div>
              )}

              {/* OBJECT DETECTION MESH BOX */}
              {aiMode === 'object' && (
                <div 
                  className="absolute w-44 h-28 border-2 border-orange-500 rounded-2xl flex flex-col justify-between p-3 animate-fade-in transition-all duration-700 shadow-lg shadow-orange-500/15"
                  style={{ left: markerX + 20, top: markerY + 40 }}
                >
                  <div className="w-full flex justify-between">
                    <span className="text-[7.5px] text-orange-400 bg-orange-950/80 border border-orange-500/35 font-mono px-1.5 py-0.5 rounded-md uppercase tracking-wide">
                      {detectedItem}
                    </span>
                    <span className="text-[7px] text-orange-300 font-mono font-black">{confidence}% ACC</span>
                  </div>
                  
                  {/* Digital scale target */}
                  <div className="w-10 h-10 rounded-full border border-orange-400/30 flex items-center justify-center font-bold text-orange-500 mx-auto">
                    ⨉
                  </div>
                </div>
              )}

              {/* VOICE COMANDS ACTIVE PANEL */}
              {aiMode === 'speech' && (
                <div className="w-64 bg-slate-950/85 p-6 rounded-2xl border border-purple-500/35 text-center text-white space-y-4 shadow-xl z-20">
                  <div className="w-12 h-12 rounded-full bg-purple-500/25 border-2 border-purple-400 flex items-center justify-center mx-auto text-lg animate-ping">
                    🎙️
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-sm font-black uppercase text-purple-400">Microphone Input</h5>
                    <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                      Choose any quick command formulas down below to simulate a real smart-room trigger!
                    </p>
                  </div>
                  {voiceInput && (
                    <div className="bg-purple-900/60 p-2.5 rounded-xl border border-purple-400 text-xs font-black">
                      Heard: <span className="text-yellow-300">"{voiceInput}"</span>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            <div className="text-center p-8 text-slate-500 space-y-3 z-15 select-none">
              <Camera className="w-12 h-12 text-slate-700 mx-auto animate-bounce" />
              <h4 className="text-sm font-black uppercase text-slate-300">Diagnostic Camera is Off</h4>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed font-semibold">
                Click **"Activate Sight"** to initialize the AI Lens emulator. See face meshes and bounding boxes lock onto targets in real time!
              </p>
            </div>
          )}

        </div>

        {/* BOTTOM CONTROLLER FORMULAS FOR SPEECH MODE */}
        {isCapturing && aiMode === 'speech' && (
          <div className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
            <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest leading-none">
              Speak command presets
            </h4>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '🔓 "open sesame"', cmd: 'open sesame', color: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 hover:bg-emerald-100' },
                { label: '💡 "lights on"', cmd: 'lights on', color: 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 hover:bg-indigo-100' },
                { label: '🚀 "launch rocket"', cmd: 'launch rocket', color: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600 hover:bg-rose-100' }
              ].map((pill) => (
                <button
                  key={pill.cmd}
                  onClick={() => handleVoiceKeyword(pill.cmd)}
                  className={`px-3 py-2 rounded-xl text-xs font-black transition-all hover:scale-102 active:scale-98 select-none border border-transparent hover:border-gray-200 cursor-pointer ${pill.color}`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
