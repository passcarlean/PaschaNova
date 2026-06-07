import React, { useState, useEffect, useRef } from 'react';
import { STEM_LESSONS } from '../data/lessons';
import { Lesson, LessonStep } from '../types';
import { 
  BookOpen, CheckCircle, Award, Compass, HelpCircle, ArrowRight, 
  ArrowLeft, Star, Volume2, Sparkles, Smile, Cpu, Zap, Eye, Gauge, 
  Radio, Car, Activity, ShieldAlert, Wifi, Server, Sliders, Play, RotateCcw,
  Sun, Moon, Waves, CloudRain, Lock, Lightbulb, Code
} from 'lucide-react';

interface LessonsPanelProps {
  onLoadLessonPreset: (lesson: Lesson) => void;
  blocksCount: number;
  componentsCount: number;
  isRunning: boolean;
  addConsoleLine: (line: string) => void;
}

// ==========================================
// 1. LED INDICATOR SIMULATION WORKSPACE
// ==========================================
function LedSimulator({ isRunning, addConsoleLine }: { isRunning: boolean; addConsoleLine: (line: string) => void }) {
  const [delaySpeed, setDelaySpeed] = useState<number>(500);
  const [hasResistor, setHasResistor] = useState<boolean>(true);
  const [voltage, setVoltage] = useState<number>(5);
  const [ledLit, setLedLit] = useState<boolean>(false);
  const [isBurned, setIsBurned] = useState<boolean>(false);

  // Core blinking timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning && !isBurned) {
      interval = setInterval(() => {
        setLedLit(prev => !prev);
      }, delaySpeed);
    } else {
      setLedLit(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, delaySpeed, isBurned]);

  // Check burn status based on voltage and resistor presence
  useEffect(() => {
    if (isRunning && !hasResistor && voltage > 5) {
      setIsBurned(true);
      setLedLit(false);
      addConsoleLine("[Simulator Alert] 🔥 BOOM! The LED popped! Connecting a diode above 5V without a limiting resistor destroys it due to direct short-circuit.");
    }
  }, [isRunning, hasResistor, voltage]);

  const handleReset = () => {
    setIsBurned(false);
    setLedLit(false);
    addConsoleLine("[Simulator] Ready. LED indicator reset.");
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-xs">
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> Live Breadboard LED Circuit
        </span>
        <button 
          onClick={handleReset}
          className="text-[9.5px] font-black uppercase text-rose-500 hover:underline flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" /> Reset Circuit
        </button>
      </div>

      {/* Visual Workspace Canvas */}
      <div className="relative h-44 bg-slate-100 dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800/80 flex flex-col items-center justify-center overflow-hidden">
        {/* Ground grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-35" />

        {/* Dynamic Warning Layer */}
        {isBurned ? (
          <div className="absolute z-10 flex flex-col items-center animate-bounce text-center bg-rose-500/10 dark:bg-rose-950/20 px-4 py-2.5 rounded-xl border border-rose-500/30">
            <ShieldAlert className="w-8 h-8 text-rose-500 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs font-black text-rose-600 dark:text-rose-450 mt-1">LED DAMAGED</span>
            <span className="text-[9px] font-bold text-rose-500">Overcurrent combusted the crystal.</span>
          </div>
        ) : null}

        {/* Graphic elements of LED & Arduino */}
        <div className={`transition-all duration-300 flex flex-col items-center ${isBurned ? 'opacity-30 filter grayscale' : ''}`}>
          <div className="relative flex flex-col items-center">
            {/* LED Bulb Glow halo */}
            {ledLit && (
              <div className="absolute top-1 w-14 h-14 bg-rose-500 rounded-full blur-xl opacity-80 animate-pulse scale-110" />
            )}

            {/* LED bulb body */}
            <div className={`w-8 h-9 rounded-t-full rounded-b-sm border-2 relative flex flex-col justify-end items-center transition-all ${
              ledLit 
                ? 'bg-rose-500 border-rose-400 shadow-md shadow-rose-500/50' 
                : 'bg-rose-200/50 dark:bg-rose-950/20 border-rose-350 dark:border-rose-900'
            }`}>
              {/* Internal electrode wire filament */}
              <div className="w-4 h-5 border-l border-t border-rose-400 absolute top-2 left-2 opacity-60" />
              {/* LED rim flange */}
              <div className="w-10 h-1 bg-rose-400 dark:bg-rose-800 rounded-xs" />
            </div>

            {/* Electronic Lead legs */}
            <div className="flex gap-4 h-12 -mt-0.5">
              {/* Anode (Long leg, bent) */}
              <div className="w-0.5 h-10 bg-slate-400 dark:bg-slate-600 rounded-full origin-top rotate-3" />
              {/* Cathode */}
              <div className="w-0.5 h-12 bg-slate-400 dark:bg-slate-600 rounded-full" />
            </div>

            {/* Resistor Block Representation */}
            {hasResistor && (
              <div className="absolute -bottom-2 -left-10 bg-amber-100 dark:bg-amber-950 border border-amber-300 rounded-[3px] py-1 px-2 text-[7.5px] font-black font-mono shadow-xs text-amber-800 dark:text-amber-350 flex gap-0.5 items-center">
                <span className="w-1 h-3.5 bg-red-500 rounded-xs" />
                <span className="w-1 h-3.5 bg-red-500 rounded-xs" />
                <span className="w-1 h-3.5 bg-amber-600 rounded-xs" />
                <span className="text-[7px]">220Ω</span>
              </div>
            )}
          </div>
        </div>

        {/* Simulated Volt bar helper indicators */}
        {isRunning && !isBurned && (
          <div className="absolute left-4 top-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 text-[9px] font-black px-2.5 py-1 rounded bg-white/85 dark:bg-gray-900 border border-emerald-500/40 font-mono tracking-wider">
            ⚡ VOLTS: {voltage}V • DELAY: {delaySpeed}ms
          </div>
        )}
      </div>

      {/* Simulator Inputs & Controllers */}
      <div className="grid sm:grid-cols-3 gap-4 bg-white dark:bg-gray-800/60 p-4 rounded-xl border border-gray-150 dark:border-gray-700">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center justify-between">
            <span>Power Supply</span>
            <span className="font-mono text-rose-500 font-bold">{voltage}V</span>
          </label>
          <input 
            type="range"
            min="1"
            max="9"
            step="1"
            value={voltage}
            onChange={(e) => setVoltage(parseInt(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
          />
          <span className="text-[9px] font-medium text-slate-400">Voltages &gt; 5V require limiting.</span>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center justify-between">
            <span>Blink Speed</span>
            <span className="font-mono text-rose-500 font-bold">{delaySpeed}ms</span>
          </label>
          <input 
            type="range"
            min="100"
            max="2000"
            step="100"
            value={delaySpeed}
            onChange={(e) => setDelaySpeed(parseInt(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-100 rounded-lg appearance-none"
          />
          <span className="text-[9px] font-medium text-slate-400">Controls flash cycle period.</span>
        </div>

        <div className="flex flex-col justify-center items-start space-y-2 pt-1 sm:border-l sm:pl-4 border-gray-100 dark:border-gray-700">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox"
              checked={hasResistor}
              onChange={(e) => setHasResistor(e.target.checked)}
              className="rounded text-rose-500 border-gray-300 focus:ring-rose-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>220Ω Resistor</span>
          </label>
          <p className="text-[8.5px] leading-tight text-slate-400 font-medium">
            Prevents dangerous overcurrent. Protects semiconductors.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. LIGHT SENSOR LDR AUTOMATED CIRCUIT
// ==========================================
function LdrSimulator({ isRunning, addConsoleLine }: { isRunning: boolean; addConsoleLine: (line: string) => void }) {
  const [ambientLight, setAmbientLight] = useState<number>(450); // Lux level 0 to 1000
  const [threshold, setThreshold] = useState<number>(500); // 0 to 1023
  const [streetLampOn, setStreetLampOn] = useState<boolean>(false);

  // Read value is directly proportional to light intensity
  const analogSensorReadVal = Math.round((ambientLight / 1000) * 1023);

  useEffect(() => {
    if (!isRunning) {
      setStreetLampOn(false);
      return;
    }

    const stateTrigger = analogSensorReadVal < threshold;
    if (stateTrigger !== streetLampOn) {
      setStreetLampOn(stateTrigger);
      addConsoleLine(`[LDR Event] Analog input triggered. Read: ${analogSensorReadVal} ADC (LDR Resistance: ${Math.round(100000 - (ambientLight * 95))}Ω). Lamp is turned ${stateTrigger ? 'ON' : 'OFF'}.`);
    }
  }, [isRunning, ambientLight, threshold, analogSensorReadVal, streetLampOn]);

  return (
    <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-xs">
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Light Dependent automatic lamp
        </span>
        <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded tracking-normal font-mono text-right leading-none">
          A0 PIN
        </span>
      </div>

      {/* Visual Canvas */}
      <div className="relative h-44 bg-slate-100 dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800/80 flex items-center justify-between px-8 overflow-hidden transition-all duration-500"
        style={{
          boxShadow: streetLampOn ? 'inset 0 0 40px rgba(251, 191, 36, 0.15)' : 'none'
        }}
      >
        {/* Ambient Dark shader */}
        <div 
          className="absolute inset-0 bg-gray-905 dark:bg-black transition-all duration-500 pointer-events-none"
          style={{ opacity: Math.max(0, 0.75 - (ambientLight / 1000)) }}
        />

        {/* LDR Component Visual */}
        <div className="relative z-10 bg-white/90 dark:bg-gray-900/90 p-4 rounded-xl border border-gray-200/60 dark:border-gray-700/80 flex flex-col items-center gap-2 shadow-xs">
          <span className="text-[7.5px] uppercase font-black text-slate-400 font-mono tracking-wider">CdS Photoresistor</span>
          <div className="w-10 h-10 rounded-full border-2 border-orange-500/80 bg-red-500/20 flex items-center justify-center relative p-1.5 flex flex-col">
            {/* Wavy serpentine conductor trace */}
            <svg viewBox="0 0 40 40" className="w-full h-full stroke-orange-600 dark:stroke-orange-400 stroke-2 fill-none animate-pulse">
              <path d="M 5,20 C 15,20 15,10 20,20 C 25,30 25,20 35,20" />
              <path d="M 5,10 C 15,10 15,0 20,10 C 25,20 25,10 35,10" />
              <path d="M 5,30 C 15,30 15,20 20,30 C 25,40 25,30 35,30" />
            </svg>
          </div>
          <span className="text-[10px] font-black font-mono text-gray-700 dark:text-gray-200">
            {analogSensorReadVal}ADC
          </span>
        </div>

        {/* Interactive Sun/Moon environment indicators */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/80 dark:bg-gray-900/85 px-3 py-1 rounded-full border text-[9.5px] font-bold">
          {ambientLight < 350 ? (
            <span className="text-amber-500 flex items-center gap-1"><Moon className="w-3.5 h-3.5 fill-amber-500" /> Moonlight Mode</span>
          ) : (
            <span className="text-amber-600 flex items-center gap-1"><Sun className="w-3.5 h-3.5 fill-amber-600 animate-spin" style={{ animationDuration: '24s' }} /> Daylight Mode</span>
          )}
        </div>

        {/* Automated Streetlight Post lamp visual */}
        <div className="relative z-10 flex flex-col items-center">
          {streetLampOn && (
            <div className="absolute top-0 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl -translate-y-6 pointer-events-none" />
          )}

          <div className="w-10 h-14 bg-slate-800 dark:bg-slate-700 border border-slate-650 rounded-lg flex flex-col items-center justify-between p-2 shadow-md">
            <span className="text-[7px] font-bold uppercase tracking-wider text-slate-400">Streetlamp</span>
            <div className={`w-6 h-6 rounded-full border transition-all duration-300 ${
              streetLampOn 
                ? 'bg-amber-300 border-amber-200 shadow-lg shadow-amber-305/70' 
                : 'bg-zinc-600 border-zinc-700'
            } flex items-center justify-center`}>
              <Lightbulb className={`w-3.5 h-3.5 ${streetLampOn ? 'text-amber-900 animate-pulse' : 'text-zinc-400'}`} />
            </div>
          </div>
          <div className="w-1.5 h-10 bg-slate-600 dark:bg-slate-500" />
          <div className="w-10 h-1 bg-slate-700 dark:bg-slate-600 rounded-t" />
        </div>
      </div>

      {/* Controllers */}
      <div className="grid sm:grid-cols-2 gap-5 bg-white dark:bg-gray-800/60 p-4 rounded-xl border border-gray-150 dark:border-gray-700">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center justify-between">
            <span>Ambient Light Lux slider</span>
            <span className="font-mono text-emerald-500 font-bold">{Math.round(ambientLight)} Lux</span>
          </label>
          <input 
            type="range"
            min="0"
            max="1000"
            step="10"
            value={ambientLight}
            onChange={(e) => setAmbientLight(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
          />
          <div className="flex justify-between text-[8px] text-slate-400 font-semibold font-mono">
            <span>DARK (0 LUX)</span>
            <span>DAYLIGHT (1000 LUX)</span>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center justify-between">
            <span>Software trigger threshold</span>
            <span className="font-mono text-emerald-500 font-bold">{threshold}ADC</span>
          </label>
          <input 
            type="range"
            min="50"
            max="950"
            step="10"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
          />
          <div className="flex justify-between text-[8px] text-slate-400 font-semibold font-mono">
            <span>LOWER READINGS</span>
            <span>HIGHER THRESHOLDS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. ULTRASONIC BARRIER COLLISION SIMULATOR
// ==========================================
function UltrasonicSimulator({ isRunning, addConsoleLine }: { isRunning: boolean; addConsoleLine: (line: string) => void }) {
  const [distanceCm, setDistanceCm] = useState<number>(55);
  const isBuzzerSounding = isRunning && distanceCm < 30;

  useEffect(() => {
    if (isBuzzerSounding) {
      addConsoleLine(`[HC-SR04] Distance alert! Collision boundary breached! Measured: ${distanceCm}cm (Sound delay return: ${Math.round(distanceCm * 58.8)} microseconds). buzzer sounding.`);
    }
  }, [distanceCm, isBuzzerSounding]);

  return (
    <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-xs">
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1">
          <Radio className="w-3.5 h-3.5 text-indigo-505 animate-pulse" /> Ultrasonic radar & Obstacle alerts
        </span>
        <span className="text-[9.5px] font-black tracking-wider px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded font-mono">
          TRIG: D4 | ECHO: D5
        </span>
      </div>

      {/* Simulation track visual */}
      <div className="relative h-44 bg-slate-100 dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800/80 flex items-center justify-between p-4 overflow-hidden">
        {/* Dynamic measurement guidelines */}
        <div className="absolute bottom-1.5 left-4 right-4 h-5 border-b border-t border-dashed border-gray-200 dark:border-gray-800 flex items-center justify-center">
          <span className="text-[9px] font-black font-mono text-gray-400 dark:text-gray-500">
            RADAR RANGE DETECT GAP: {distanceCm} cm ({Math.round(distanceCm * 10)} mm)
          </span>
        </div>

        {/* Sonar emitter sensor block */}
        <div className="flex flex-col items-center z-10">
          <div className="w-14 h-9 bg-indigo-600 dark:bg-indigo-900 rounded-lg p-1.5 flex gap-1 relative shadow">
            {/* Transmitter / Receiver snout eyes */}
            <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-300 flex items-center justify-center relative">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-400 animate-ping absolute" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
            </div>
            <div className="w-5 h-5 rounded-full bg-slate-800 border-2 border-slate-300 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            </div>
          </div>
          <span className="text-[8px] font-black uppercase text-indigo-550 mt-1">HC-SR04 Sensor</span>
        </div>

        {/* Sonar pulse wave overlays */}
        {isRunning && (
          <div className="absolute left-16 right-20 top-14 h-12 flex items-center justify-around pointer-events-none z-0">
            <Waves className={`w-8 h-8 text-indigo-400/30 scale-100 animate-pulse ${isBuzzerSounding ? 'text-rose-455' : ''}`} style={{ animationDuration: '1.2s' }} />
            <Waves className={`w-8 h-8 text-indigo-400/25 scale-110 animate-pulse ${isBuzzerSounding ? 'text-rose-455' : ''}`} style={{ animationDuration: '1s' }} />
            <Waves className={`w-8 h-8 text-indigo-400/10 scale-125 animate-pulse ${isBuzzerSounding ? 'text-rose-455' : ''}`} style={{ animationDuration: '0.8s' }} />
          </div>
        )}

        {/* Buzzer Alert alarm indicator */}
        <div className={`p-2 border rounded-xl flex flex-col items-center gap-1 shadow transition-all duration-300 ${
          isBuzzerSounding 
            ? 'bg-rose-500 text-white border-rose-400 animate-pulse scale-105' 
            : 'bg-white dark:bg-gray-900 text-slate-500 border-gray-200 dark:border-gray-800'
        }`}>
          <Volume2 className={`w-5 h-5 ${isBuzzerSounding ? 'animate-bounce' : ''}`} />
          <span className="text-[6.5px] font-black uppercase font-mono leading-none">Buzzer</span>
          {isBuzzerSounding && <span className="text-[5.5px] font-bold p-0.5 bg-rose-700/60 rounded">SIREN!</span>}
        </div>

        {/* Target movable Car module */}
        <div 
          className="absolute top-12 transition-all duration-150 ease-out z-10 flex flex-col items-center"
          style={{ left: `${20 + (distanceCm * 0.55)}%` }}
        >
          <div className={`bg-gray-800 text-white p-2.5 rounded-xl border flex items-center gap-1.5 shadow ${
            isBuzzerSounding ? 'border-rose-400 ring-2 ring-rose-500/25 animate-bounce' : 'border-gray-700'
          }`}>
            <Car className={`w-8 h-5 ${isBuzzerSounding ? 'text-rose-450 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <span className="text-[7.5px] font-black font-mono text-slate-500 mt-1">Car obstacle</span>
        </div>
      </div>

      {/* Slider controls */}
      <div className="bg-white dark:bg-gray-800/60 p-4 rounded-xl border border-gray-150 dark:border-gray-700 space-y-1">
        <label className="text-[10px] uppercase font-black text-slate-500 flex items-center justify-between">
          <span>Manual vehicle drag distance scale</span>
          <span className={`font-mono text-[10.5px] font-black px-2 py-0.5 rounded ${isBuzzerSounding ? 'bg-rose-100 text-rose-500 animate-pulse' : 'text-indigo-500'}`}>{distanceCm} cm</span>
        </label>
        <input 
          type="range"
          min="5"
          max="100"
          step="1"
          value={distanceCm}
          onChange={(e) => setDistanceCm(parseInt(e.target.value))}
          className="w-full accent-indigo-550 cursor-pointer h-2 bg-slate-100 rounded-lg"
        />
        <div className="flex justify-between text-[7px] text-slate-400 font-bold font-mono">
          <span className="text-rose-500">COLLISION RISK (&lt;30CM)</span>
          <span>OUT OF BOUNDS</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MICRO SERVO ROTATION ANGLE SIMULATOR
// ==========================================
function ServoSimulator({ isRunning, addConsoleLine }: { isRunning: boolean; addConsoleLine: (line: string) => void }) {
  const [angle, setAngle] = useState<number>(90);
  const [isSweeping, setIsSweeping] = useState<boolean>(false);
  const sweepDirRef = useRef<number>(1);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && isSweeping) {
      interval = setInterval(() => {
        setAngle(prev => {
          let next = prev + (5 * sweepDirRef.current);
          if (next >= 180) {
            next = 180;
            sweepDirRef.current = -1;
          } else if (next <= 0) {
            next = 0;
            sweepDirRef.current = 1;
          }
          return next;
        });
      }, 60);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, isSweeping]);

  useEffect(() => {
    if (isRunning) {
      addConsoleLine(`[Joint Servo] Pulse modulation duty state synchronized. Angle commanded: ${angle}°`);
    }
  }, [angle, isRunning]);

  return (
    <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-xs">
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1">
          <Sliders className="w-3.5 h-3.5 text-orange-500 animate-pulse" /> Robotic rotary joint manipulator
        </span>
        <span className="text-[9.5px] font-black tracking-wider px-1.5 py-0.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded font-mono">
          PWM D10
        </span>
      </div>

      {/* Visual Canvas */}
      <div className="relative h-44 bg-slate-100 dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800/80 flex items-center justify-center p-4 overflow-hidden">
        <div className="flex items-center gap-8 z-10">
          
          {/* Servo Blue Component box */}
          <div className="w-20 h-20 bg-blue-600 dark:bg-blue-800 rounded-2xl border border-blue-500 relative flex flex-col justify-between p-2 shadow-md">
            {/* Center golden pivot gear */}
            <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-white flex items-center justify-center relative mx-auto shadow-inner">
              {/* Inner alignment layout teeth */}
              <div className="w-1.5 h-3 bg-white/40 absolute rotate-45" />
              <div className="w-1.5 h-3 bg-white/40 absolute -rotate-45" />
            </div>
            <span className="text-[7.5px] font-black font-mono text-center text-blue-100 leading-none">SG90 SERVO</span>
          </div>

          {/* Steer gear rotary horn arm */}
          <div className="relative flex items-center justify-center w-24 h-24">
            <div 
              className="absolute w-20 h-6 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-slate-400 flex items-center justify-between px-2 transition-transform duration-100 ease-out shadow"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-800 border" />
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            </div>

            {/* Angular scale layout markings */}
            <div className="absolute inset-x-0 w-24 h-24 border border-dashed border-gray-200 dark:border-gray-800 rounded-full flex items-center justify-center pointer-events-none">
              <span className="absolute left-1 text-[8px] font-bold font-mono text-gray-400">0°</span>
              <span className="absolute top-1 text-[8px] font-bold font-mono text-gray-400">90°</span>
              <span className="absolute right-1 text-[8px] font-bold font-mono text-gray-400">180°</span>
            </div>
          </div>

        </div>
      </div>

      {/* Angle sliders control */}
      <div className="grid sm:grid-cols-2 gap-4 bg-white dark:bg-gray-800/60 p-4 rounded-xl border border-gray-150 dark:border-gray-700">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center justify-between">
            <span>Set Joint Angle</span>
            <span className="font-mono text-orange-500 font-bold">{angle}°</span>
          </label>
          <input 
            type="range"
            min="0"
            max="180"
            step="1"
            disabled={isSweeping}
            value={angle}
            onChange={(e) => setAngle(parseInt(e.target.value))}
            className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-100 rounded-lg disabled:opacity-40"
          />
          <span className="text-[9px] font-medium text-slate-400">Controlled sweeps between 180° limits.</span>
        </div>

        <div className="flex flex-col justify-center items-start border-t pt-3 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-4 border-gray-150">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox"
              checked={isSweeping}
              onChange={(e) => setIsSweeping(e.target.checked)}
              className="rounded text-orange-500 border-gray-300 focus:ring-orange-500 w-3.5 h-3.5 cursor-pointer"
            />
            <span>Auto Swing Sweep mode</span>
          </label>
          <p className="text-[8.5px] text-slate-400 font-medium leading-tight mt-1">
            Periodically sweeps angle from 0 to 180 and back using an automated algorithm.
          </p>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. SMART IoT GREENHOUSE HARVEST TRACKER
// ==========================================
function IotGreenhouseSimulator({ isRunning, addConsoleLine }: { isRunning: boolean; addConsoleLine: (line: string) => void }) {
  const [soilMoisture, setSoilMoisture] = useState<number>(45); // 0 to 100%
  const [wifiConnected, setWifiConnected] = useState<boolean>(false);
  const [sprinklersOn, setSprinklersOn] = useState<boolean>(false);

  useEffect(() => {
    if (wifiConnected && soilMoisture < 35 && isRunning) {
      setSprinklersOn(true);
      addConsoleLine("[IoT Event] 🌦 Soil moisture dry trigger detected! Moisture < 35%. Smart Sprinkler systems activated.");
    } else if (soilMoisture >= 75) {
      setSprinklersOn(false);
    }
  }, [soilMoisture, wifiConnected, isRunning]);

  const handleSprinklerToggle = () => {
    if (!wifiConnected) {
      addConsoleLine("[IoT System] Alert: Router cloud feeds offline! Establish WiFi handshake before remote manual spray operates.");
      return;
    }
    setSprinklersOn(prev => !prev);
    addConsoleLine(`[IoT Cloud] Sprinklers command triggered manually over internet: ${!sprinklersOn ? 'ACTIVATE' : 'DEACTIVATE'}`);
  };

  const handleWifiToggle = () => {
    setWifiConnected(prev => !prev);
    if (!wifiConnected) {
      addConsoleLine("[IoT System] Handshaking WiFi node with cloud gateway... Establishing secure link... ESP32 Node: ONLINE.");
    } else {
      addConsoleLine("[IoT System] Esp32 wireless adapter disconnected. IoT telemetry offline.");
    }
  };

  const handleWaterSoil = () => {
    // Increases soil moisture instantly to represent sprinkling
    setSoilMoisture(prev => Math.min(prev + 15, 100));
    addConsoleLine("[Circuit action] Supplied hydration stream. Soil moisture increased.");
  };

  return (
    <div className="bg-slate-50 dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-5 rounded-2xl space-y-5">
      <div className="flex justify-between items-center bg-white dark:bg-gray-800 px-3 py-2 rounded-xl shadow-xs">
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 flex items-center gap-1">
          <Wifi className="w-3.5 h-3.5 text-blue-500 animate-pulse" /> Smart IoT Greenhouse hub
        </span>
        <button 
          onClick={handleWifiToggle}
          className={`text-[8.5px] font-black uppercase rounded px-2.5 py-1 ${
            wifiConnected 
              ? 'bg-emerald-500 text-white animate-pulse' 
              : 'bg-rose-500 text-white'
          }`}
        >
          {wifiConnected ? 'WiFi: Connected' : 'WiFi: Offline'}
        </button>
      </div>

      {/* Visual Sandbox View */}
      <div className="relative h-44 bg-slate-100 dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800/80 flex items-center justify-between px-6 overflow-hidden">
        
        {/* Plant visual */}
        <div className="relative z-10 flex flex-col items-center">
          {sprinklersOn && (
            <div className="absolute top-0 flex flex-col items-center space-y-0.5 animate-bounce">
              <CloudRain className="w-6 h-6 text-blue-400 animate-pulse" />
              <div className="w-0.5 h-3 bg-blue-300 rounded animate-pulse" />
            </div>
          )}

          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center border-2 border-emerald-500 mt-6 shadow-sm">
            <span className="text-2xl">🌱</span>
          </div>
          <span className="text-[8.5px] font-black uppercase text-emerald-550 mt-1">Greenhouse plant</span>
        </div>

        {/* OLED Smart Dashboard Telemetry Screen mockup */}
        <div className="w-32 bg-slate-900 text-cyan-405 border-2 border-slate-700 rounded-xl p-2 font-mono text-[7px] space-y-1.5 shadow-md self-center">
          <div className="border-b border-cyan-800 pb-0.5 text-center font-bold tracking-wider text-cyan-400">
            IoT TELEMETRY CORE
          </div>
          <div className="space-y-0.5 text-cyan-205">
            <div>WIFI: {wifiConnected ? 'ONLINE' : 'LINK DOWN'}</div>
            <div className="font-extrabold">MOISTURE: {soilMoisture}%</div>
            <div>TEMP: 26.5 °C</div>
            <div>SPRINKLER: {sprinklersOn ? 'ACTIVE' : 'OFF'}</div>
          </div>
          <div className="pt-0.5 text-right font-black tracking-normal leading-tight text-yellow-500">
            {soilMoisture < 35 ? '⚠️ SOIL PARCHED' : '✓ HEALTHY'}
          </div>
        </div>

      </div>

      {/* Controllers panel */}
      <div className="grid sm:grid-cols-3 gap-3 bg-white dark:bg-gray-800/60 p-4 rounded-xl border border-gray-150 dark:border-gray-700">
        <div className="space-y-1">
          <label className="text-[10px] uppercase font-black text-slate-500 flex items-center justify-between">
            <span>Soil Moisture</span>
            <span className="font-mono text-cyan-500 font-bold">{soilMoisture}%</span>
          </label>
          <input 
            type="range"
            min="10"
            max="100"
            step="2"
            value={soilMoisture}
            onChange={(e) => setSoilMoisture(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
          />
          <span className="text-[8px] font-medium text-slate-400">&lt;35% triggers automatic watering sprays.</span>
        </div>

        <div className="flex flex-col justify-center items-stretch space-y-2 pt-1">
          <button 
            onClick={handleWaterSoil}
            className="py-1.5 bg-cyan-105 hover:bg-cyan-200 text-cyan-800 rounded-xl text-[9px] font-black uppercase text-center border border-cyan-300"
          >
            💦 Hydrate Soil (+15%)
          </button>
        </div>

        <div className="flex flex-col justify-center items-stretch space-y-2 pt-1 sm:border-l sm:pl-3 border-gray-150">
          <button 
            onClick={handleSprinklerToggle}
            className={`py-1.5 rounded-xl text-[9px] font-black uppercase text-center text-white ${
              sprinklersOn 
                ? 'bg-rose-500 hover:bg-rose-600' 
                : 'bg-emerald-500 hover:bg-emerald-600'
            }`}
          >
            {sprinklersOn ? 'Stop sprinkler' : 'Trigger Sprinkl'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// CENTRAL COMPONENT: LESSONS WORKSPACE PANEL
// ==========================================
export default function LessonsPanel({
  onLoadLessonPreset,
  blocksCount,
  componentsCount,
  isRunning,
  addConsoleLine
}: LessonsPanelProps) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [lessonCompleted, setLessonCompleted] = useState<boolean>(false);
  
  // Track visual selection category filter
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isStepAchieved, setIsStepAchieved] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Dynamic state sync for achievements
  useEffect(() => {
    if (activeLesson) {
      setIsStepAchieved(checkStepTargetSatisfied(activeLesson.steps[currentStepIndex]));
      setShowCelebration(false);
    } else {
      setIsStepAchieved(false);
      setShowCelebration(false);
    }
  }, [currentStepIndex, activeLesson?.id]);

  // Listen to outer workspace counts in real-time
  useEffect(() => {
    if (!activeLesson) return;

    const currentStep = activeLesson.steps[currentStepIndex];
    if (!currentStep) return;

    const achieved = checkStepTargetSatisfied(currentStep);

    if (achieved && !isStepAchieved) {
      setShowCelebration(true);
      addConsoleLine(`[Education Engine] 🎉 Bravo! Guided lesson goal target of step [${currentStepIndex + 1}] satisfied!`);
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 3000);
      setIsStepAchieved(true);
      return () => clearTimeout(timer);
    } else if (!achieved && isStepAchieved) {
      setIsStepAchieved(false);
      setShowCelebration(false);
    }
  }, [blocksCount, componentsCount, isRunning]);

  const startLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
    setCurrentStepIndex(0);
    setShowHint(false);
    setLessonCompleted(false);
    onLoadLessonPreset(lesson);
    addConsoleLine(`[Education Engine] Loaded Guided Mission Workspace: "${lesson.title}"`);
  };

  const checkStepTargetSatisfied = (step: LessonStep) => {
    if (step.goalType === 'add_block') {
      return blocksCount > 0;
    }
    if (step.goalType === 'connect_circuit') {
      return componentsCount > 0;
    }
    if (step.goalType === 'run_simulation') {
      return isRunning;
    }
    return false;
  };

  const nextStep = () => {
    if (!activeLesson) return;
    setShowHint(false);
    
    if (currentStepIndex < activeLesson.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
      addConsoleLine(`[Education Engine] Moving to Step ${currentStepIndex + 2} of lesson.`);
    } else {
      // Completed, reward a visual digital maker badge medal!
      setLessonCompleted(true);
      addConsoleLine(`[Education Engine] ★ Mission Accomplished! Successfully completed all steps for "${activeLesson.title}"! ★`);
    }
  };

  const quitLesson = () => {
    setActiveLesson(null);
    setLessonCompleted(false);
  };

  const filteredLessons = STEM_LESSONS.filter(lesson => {
    const matchesCategory = categoryFilter === 'All' || lesson.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-8 select-none">
      
      {!activeLesson ? (
        <>
          {/* -------------------- 1. HERO HEADER -------------------- */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-violet-50/50 dark:from-slate-900/40 dark:via-gray-950 dark:to-slate-900/20 p-8 rounded-3xl border border-gray-150 dark:border-gray-800 text-center space-y-4 max-w-4xl mx-auto shadow-2xs">
            <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
              <BookOpen className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Electronics Guided Tutor Workspace
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
                Step-by-step interactive paths teaching components, circuits, and logic block code parallel. Run simulations inline, analyze concepts, and conquer electronics challenges!
              </p>
            </div>

            {/* Micro Dashboard stats markers */}
            <div className="flex gap-4 justify-center pt-2">
              <div className="bg-white/80 dark:bg-gray-900/60 border border-gray-150 px-4 py-2 rounded-2xl text-left shadow-2xs">
                <span className="text-[8.5px] uppercase font-black text-slate-400 tracking-wider">Lessons Pool</span>
                <div className="text-sm font-black text-indigo-500">{STEM_LESSONS.length} Interactive Lessons</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-900/60 border border-gray-150 px-4 py-2 rounded-2xl text-left shadow-2xs">
                <span className="text-[8.5px] uppercase font-black text-slate-400 tracking-wider">Level range</span>
                <div className="text-sm font-black text-purple-500">Easy to Hard (IoT)</div>
              </div>
            </div>
          </div>

          {/* -------------------- 2. SEARCH & TABS FILTER -------------------- */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 max-w-5xl mx-auto">
            {/* Category tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {['All', 'LEDs', 'Sensors', 'Motors', 'basics'].map(tabName => (
                <button
                  key={tabName}
                  onClick={() => setCategoryFilter(tabName)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase transition-all tracking-wider ${
                    categoryFilter === tabName
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-gray-800 text-slate-600 dark:text-gray-300 border hover:bg-slate-50 border-gray-150 dark:border-gray-700/80'
                  }`}
                >
                  {tabName === 'basics' ? 'Arduino/Wifi basics' : tabName}
                </button>
              ))}
            </div>

            {/* Simple text search input */}
            <div className="relative w-full sm:w-64">
              <input 
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-4 pr-10 text-xs font-semibold bg-white dark:bg-gray-800 border border-gray-155 dark:border-gray-700 rounded-2xl shadow-xs text-slate-850 dark:text-gray-100"
              />
              <Compass className="w-4 h-4 text-slate-450 absolute right-3.5 top-2.5 animate-spin-slow" />
            </div>
          </div>

          {/* -------------------- 3. GRID OF COURSE CARDS -------------------- */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white dark:bg-gray-800/80 rounded-3xl border border-gray-150 dark:border-700/80 p-6 shadow-2xs hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all flex flex-col justify-between group cursor-pointer"
                onClick={() => startLesson(lesson)}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] uppercase font-black tracking-wider text-indigo-500 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg">
                      {lesson.category}
                    </span>
                    <span className="text-[9.5px] font-extrabold text-slate-400 uppercase tracking-widest font-mono">
                      {lesson.steps.length} Steps
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-455 transition-colors">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-xs text-slate-400 dark:text-gray-400 font-semibold leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100 dark:border-gray-700/40 mt-4 flex justify-between items-center">
                  <span className={`text-[10px] font-bold uppercase rounded px-2 py-0.5 ${
                    lesson.difficulty === 'Easy' 
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' 
                      : lesson.difficulty === 'Medium'
                      ? 'bg-orange-50 text-orange-650 dark:bg-orange-950/20'
                      : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20'
                  }`}>
                    {lesson.difficulty} Level
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startLesson(lesson);
                    }}
                    className="py-2 px-4 bg-indigo-600 hover:bg-indigo-750 text-white rounded-xl text-[10.5px] font-black flex items-center justify-center gap-1 shadow-sm cursor-pointer transition-all"
                  >
                    <span>Begin Mission</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            ))}

            {filteredLessons.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 font-semibold text-sm">
                No matching robotics or light sensor lessons found. Try resetting filters!
              </div>
            )}
          </div>
        </>
      ) : (
        /* ----------------------------------------------------- */
        /* -------------- ACTIVE GUIDED TUTORIAL SCREEN ---------- */
        /* ----------------------------------------------------- */
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header Action Back panel */}
          <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl border">
            <button
              onClick={quitLesson}
              className="text-xs font-black text-slate-500 dark:text-gray-450 hover:text-slate-800 dark:hover:text-white flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-4 h-4 text-slate-501" /> Back to Lessons Library
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-indigo-500">
                ACTIVE LESSON MISSION:
              </span>
              <span className="text-xs font-black text-slate-800 dark:text-white">
                {activeLesson.title}
              </span>
            </div>
          </div>

          {lessonCompleted ? (
            /* CONGRATULATIONS MEDAL CEREMONY OVERLAY */
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 p-10 max-w-2xl mx-auto text-center space-y-6 shadow-xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-50/10 via-transparent to-transparent pointer-events-none" />
              
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center mx-auto shadow-lg shadow-yellow-500/25 animate-celebrate">
                <Award className="w-14 h-14 text-white animate-bounce" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Gold STEM Inventor Badge Unlocked!</h3>
                <p className="text-xs font-semibold text-slate-500 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
                  Outstanding job! You solved every instructional step for <strong className="text-slate-800 dark:text-white">"{activeLesson.title}"</strong>. Your simulated values match physical standards perfectly!
                </p>
              </div>

              {/* Sparkle effects */}
              <div className="flex gap-4 justify-center pt-2">
                <button
                  onClick={quitLesson}
                  className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-800 rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  Select another Course
                </button>
                <button
                  onClick={() => {
                    const idx = STEM_LESSONS.findIndex(l => l.id === activeLesson.id);
                    const nextIdx = (idx + 1) % STEM_LESSONS.length;
                    startLesson(STEM_LESSONS[nextIdx]);
                  }}
                  className="px-6 py-2.5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer shadow"
                >
                  Next Mission <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* DUAL PANE WORKSPACE LAYOUT */
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: CONCEPTS, CHECKLISTS, MANUAL AND PARALLEL BLOCKLY */}
              <div className="lg:col-span-5 bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700/80 p-6 space-y-6 shadow-sm">
                
                {/* Step progress metadata bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-[10px] font-black text-slate-400 tracking-wider">
                    <span>STEP PROGRESS</span>
                    <span>{currentStepIndex + 1} OF {activeLesson.steps.length} STEPS</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-gray-900 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / activeLesson.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Concept / brief explanation card */}
                <div className="bg-gradient-to-br from-indigo-50/40 via-white to-indigo-50/20 dark:from-slate-900/10 dark:to-gray-850 p-4 rounded-2xl border border-indigo-100/60 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 flex items-center justify-center shrink-0">
                      <Cpu className="w-3.5 h-3.5 text-indigo-605" />
                    </div>
                    <h4 className="text-xs font-black uppercase text-indigo-905 dark:text-indigo-400">
                      Electrical Concept Underworld
                    </h4>
                  </div>
                  <p className="text-xs font-semibold leading-relaxed text-slate-500 dark:text-gray-300">
                    {activeLesson.steps[currentStepIndex].explanation}
                  </p>
                </div>

                {/* Checklist Task Goals card */}
                <div className="bg-slate-50 dark:bg-gray-900/50 p-4 rounded-2xl border space-y-3">
                  <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider">
                    Instructions & Challenge
                  </span>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="pt-0.5">
                        {isStepAchieved ? (
                          <div className="w-4 h-4 rounded bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold animate-tick">✓</div>
                        ) : (
                          <div className="w-4 h-4 rounded border-2 border-slate-300 flex items-center justify-center text-[9px] text-slate-400">1</div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-xs font-black text-slate-805 dark:text-gray-200">
                          {activeLesson.steps[currentStepIndex].title}
                        </span>
                        <p className="text-[10.5px] font-semibold text-slate-450 dark:text-slate-400">
                          Satisfy target goal by triggering correct physical properties or workspace structures.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-2.5 mt-2 flex justify-between items-center">
                    <span className="text-[9px] font-black uppercase text-slate-400">Goal State:</span>
                    {isStepAchieved ? (
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-lg flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-500 animate-pulse" /> Verified
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2 py-0.5 rounded-lg animate-pulse">
                        Solving...
                      </span>
                    )}
                  </div>
                </div>

                {/* Accompanying Blockly Code representation card */}
                <div className="border border-gray-150 dark:border-gray-700/80 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] uppercase font-black text-slate-400 tracking-wider flex items-center gap-1">
                      <Code className="w-3.5 h-3.5 text-slate-405" /> Accompanying Blockly Code
                    </span>
                    <span className="text-[8.5px] font-bold text-slate-400 font-mono">CODE PARALLEL</span>
                  </div>

                  {/* Simulated Visual Block */}
                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl p-3 font-mono text-[10px] shadow-xs flex justify-between items-center relative overflow-hidden">
                      <div className="absolute right-0 top-0 bottom-0 w-12 bg-white/10 skew-x-12 translate-x-3 pointer-events-none" />
                      <div className="space-y-1">
                        <div className="font-extrabold uppercase text-[7.5px] tracking-widest text-pink-200">Outputs block</div>
                        <div className="font-black">
                          {activeLesson.id === 'les_leds' && 'turn LED Pin 13 to HIGH [ON]'}
                          {activeLesson.id === 'les_sensors' && 'set distanceMeasure = read ultrasonic distance'}
                          {activeLesson.id === 'les_motors' && 'rotate servo Pin 10 to angle [90]'}
                          {activeLesson.id === 'les_arduino_basics' && 'digitalWrite(PIN_OUTPUT, HIGH)'}
                          {activeLesson.id === 'les_esp_basics' && 'ESP32.connectToWiFi(SSID, PASSWORD)'}
                        </div>
                      </div>
                      <span className="text-xs shrink-0 bg-white/20 px-1.5 py-0.5 rounded font-mono font-black text-[9px]">BLOCK</span>
                    </div>

                    <div className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[9px] p-2.5 rounded-lg space-y-0.5">
                      <div className="text-gray-500">// Arduino Dynamic Compile Preview</div>
                      {activeLesson.id === 'les_leds' && (
                        <>
                          <div><span className="text-pink-500">void</span> <span className="text-blue-400">setup</span>() &#123; <span className="text-yellow-600">pinMode</span>(<span className="text-orange-400">13</span>, OUTPUT); &#125;</div>
                          <div><span className="text-pink-500">void</span> <span className="text-blue-400">loop</span>() &#123; <span className="text-yellow-600">digitalWrite</span>(<span className="text-orange-400">13</span>, HIGH); &#125;</div>
                        </>
                      )}
                      {activeLesson.id === 'les_sensors' && (
                        <>
                          <div><span className="text-pink-500">double</span> <span className="text-blue-400">readSonar</span>() &#123;</div>
                          <div className="pl-3">pulseIn(<span className="text-orange-400">ECHO_PIN</span>, HIGH) / <span className="text-orange-400">58.2</span>;</div>
                          <div>&#125;</div>
                        </>
                      )}
                      {activeLesson.id === 'les_motors' && (
                        <>
                          <div>#include &lt;Servo.h&gt;</div>
                          <div>Servo joint_servo;</div>
                          <div>joint_servo.write(<span className="text-orange-400">90</span>);</div>
                        </>
                      )}
                      {activeLesson.id === 'les_arduino_basics' && (
                        <>
                          <div><span className="text-pink-500">void</span> loop() &#123;</div>
                          <div className="pl-3">digitalWrite(<span className="text-orange-450">OUTPUT</span>, HIGH);</div>
                          <div>&#125;</div>
                        </>
                      )}
                      {activeLesson.id === 'les_esp_basics' && (
                        <>
                          <div>#include &lt;WiFi.h&gt;</div>
                          <div>WiFi.begin(<span className="text-emerald-400">"PaschaWifi"</span>, <span className="text-emerald-400">"code123"</span>);</div>
                        </>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLoadLessonPreset(activeLesson);
                      addConsoleLine(`[Tutor] Injected matching starter layouts & Blockly blueprints into Sandbox Workspace!`);
                    }}
                    className="w-full py-2 bg-slate-100 dark:bg-gray-700/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-gray-200 hover:text-indigo-650 rounded-xl text-[10px] font-black transition-all flex items-center justify-center gap-1 cursor-pointer border hover:border-indigo-300"
                  >
                    <span>Load Block & Part Setups into Sandbox</span>
                  </button>
                </div>

                {/* Stuck hint trigger */}
                {showHint && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 border border-yellow-250 dark:border-yellow-950/30 rounded-2xl text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-start gap-1.5 animate-fade-in shadow-xs">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <strong>Tutor Tip:</strong> {activeLesson.steps[currentStepIndex].hint}
                    </div>
                  </div>
                )}

                {/* Actions controllers */}
                <div className="flex items-center justify-between border-t pt-4">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs font-black text-indigo-505 hover:underline"
                  >
                    {showHint ? 'Hide Instructor Tip' : 'Need Instructor Tip?'}
                  </button>

                  <button
                    onClick={nextStep}
                    className={`px-5 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all text-white ${
                      isStepAchieved
                        ? 'bg-emerald-500 hover:bg-emerald-600 shadow-md shadow-emerald-500/10'
                        : 'bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <span>{currentStepIndex === activeLesson.steps.length - 1 ? 'Complete Tutorial' : 'Solve & Next Step'}</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>
                </div>

              </div>

              {/* RIGHT COLUMN: HIGH-FIDELITY ACTIVE HARDWARE SIMULATOR */}
              <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-150 dark:border-gray-700/80 p-6 space-y-6 shadow-sm">
                
                <div className="flex justify-between items-center border-b pb-3.5">
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">HANDS-ON SIMULATION</span>
                    <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-500" /> Interactive Simulation Board
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-410 uppercase">Simulation power:</span>
                    <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-gray-400'}`} />
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-550 leading-relaxed">
                  Test and observe the live electronics schema feedback below. Slide, turn dials, toggle settings, and inspect circuit behaviors immediately inside your lecture!
                </p>

                {/* Simulators selection branch */}
                <div>
                  {activeLesson.id === 'les_leds' && (
                    <LedSimulator isRunning={isRunning} addConsoleLine={addConsoleLine} />
                  )}

                  {activeLesson.id === 'les_sensors' && (
                    <UltrasonicSimulator isRunning={isRunning} addConsoleLine={addConsoleLine} />
                  )}

                  {activeLesson.id === 'les_motors' && (
                    <ServoSimulator isRunning={isRunning} addConsoleLine={addConsoleLine} />
                  )}

                  {activeLesson.id === 'les_arduino_basics' && (
                    <div className="space-y-4">
                      <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl font-mono text-xs border border-slate-800 space-y-3">
                        <div className="text-gray-500">// Arduino virtual MCU loop compiler analyzer</div>
                        <div className="text-emerald-400 animate-pulse">// Code execution: LOOP FOREVER [Running...]</div>
                        <div className="space-y-1">
                          <p className="text-[11px] text-zinc-300">
                            [0.00s] setup() executed. Serial initialized at 9600 baud.
                          </p>
                          <p className="text-[11px] text-zinc-300">
                            [0.50s] loop() iteration 1: digitalWrite(PIN_13, HIGH) to ON.
                          </p>
                          <p className="text-[11px] text-zinc-300">
                            [1.50s] loop() iteration 2: digitalWrite(PIN_13, LOW) to STANDBY.
                          </p>
                          <p className="text-[11px] text-emerald-400 animate-pulse">
                            [Trace Log] Arduino memory usage: 9% of flash space. No compile glitches.
                          </p>
                        </div>
                      </div>
                      <LedSimulator isRunning={isRunning} addConsoleLine={addConsoleLine} />
                    </div>
                  )}

                  {activeLesson.id === 'les_esp_basics' && (
                    <IotGreenhouseSimulator isRunning={isRunning} addConsoleLine={addConsoleLine} />
                  )}
                </div>

                {/* Educational prompt banner */}
                <div className="bg-slate-50 dark:bg-gray-900/40 p-4 rounded-xl border border-dashed text-slate-500 dark:text-gray-400 text-xs text-center flex items-center justify-center gap-2 font-medium">
                  <span>💡</span>
                  <span>
                    To pass each lesson step, read the target requirement, fulfill it in the workspace sandboxes, and run the main play simulation!
                  </span>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
