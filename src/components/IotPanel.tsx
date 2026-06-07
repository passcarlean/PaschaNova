import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Wifi, Phone, Lightbulb, Wind, Droplet, AlertOctagon, 
  Flame, Thermometer, ShieldCheck, Cpu, Database, RefreshCw
} from 'lucide-react';

interface IotPanelProps {
  isRunning: boolean;
  addConsoleLine: (line: string) => void;
}

export default function IotPanel({ isRunning, addConsoleLine }: IotPanelProps) {
  // Mobile phone dashboard state
  const [lightOn, setLightOn] = useState<boolean>(false);
  const [fanSpeed, setFanSpeed] = useState<number>(0); // 0 (off), 1, 2, 3
  const [sprinklerOn, setSprinklerOn] = useState<boolean>(false);
  
  // Environment sliders
  const [temperature, setTemperature] = useState<number>(24); // in C
  const [humidity, setHumidity] = useState<number>(55); // %
  const [soilMoisture, setSoilMoisture] = useState<number>(350); // LDR scale 0-1023
  const [smokeDetected, setSmokeDetected] = useState<boolean>(false);

  // Sync virtual phone commands with general workspace console logs
  const toggleLightPhone = () => {
    setLightOn(!lightOn);
    addConsoleLine(`[IoT] Phone Command: Turned SMART_LIGHT ${!lightOn ? 'ON' : 'OFF'} 💡`);
  };

  const cycleFanSpeed = () => {
    const nextSpeed = (fanSpeed + 1) % 4;
    setFanSpeed(nextSpeed);
    addConsoleLine(`[IoT] Phone Command: Set SMART_FAN SPEED to Level ${nextSpeed} 🌀`);
  };

  const toggleSprinklerPhone = () => {
    setSprinklerOn(!sprinklerOn);
    addConsoleLine(`[IoT] Phone Command: Turned IRRIGATION_SPRINKLER ${!sprinklerOn ? 'ON' : 'OFF'} 💦`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      
      {/* COLUMN 1: VIRTUAL SMARTPHONE CONTROLLER */}
      <div className="lg:col-span-5 h-full flex items-center justify-center">
        
        {/* Phone Case Chassis */}
        <div className="w-[280px] h-[520px] bg-black rounded-[40px] p-3.5 border-4 border-gray-800 shadow-2xl relative select-none">
          <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-32 h-5 bg-black rounded-b-2xl z-30 flex items-center justify-center">
            {/* Phone speaker mesh & camera hole */}
            <div className="w-12 h-1 bg-gray-800 rounded-full mb-1" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-gray-800 absolute right-5" />
          </div>

          {/* Liquid Glass Display Screen */}
          <div className="w-full h-full rounded-[30px] bg-linear-to-b from-gray-900 to-indigo-950 p-4 text-white overflow-hidden flex flex-col justify-between relative">
            
            {/* Top Stat bar */}
            <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 mt-1 relative z-20 font-mono">
              <span>9:41 AM</span>
              <div className="flex items-center gap-1">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>IoT Connected</span>
              </div>
            </div>

            {/* Smart Home dashboard title */}
            <div className="text-center mt-3 mb-2 relative z-20">
              <h4 className="text-sm font-black uppercase tracking-wider text-amber-400">PaschaNova Smart</h4>
              <p className="text-[10px] text-gray-300">Hub: IoT-ESP32-9410</p>
            </div>

            {/* Middle Dashboard Controls Cards */}
            <div className="flex-1 overflow-y-auto py-2 space-y-3 scrollbar-none relative z-20">
              
              {/* Accessory 1: smart Light */}
              <div className="bg-white/10 p-3 rounded-2xl flex items-center justify-between border border-white/5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${lightOn ? 'bg-amber-400 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
                    <Lightbulb className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black leading-tight">Living Room Light</h5>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">{lightOn ? 'ACTIVE' : 'OFFLINE'}</span>
                  </div>
                </div>
                <button
                  onClick={toggleLightPhone}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${lightOn ? 'bg-emerald-400' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${lightOn ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Accessory 2: Smart blower Fan */}
              <div className="bg-white/10 p-3 rounded-2xl flex items-center justify-between border border-white/5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${fanSpeed > 0 ? 'bg-indigo-400 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
                    <Wind className={`w-4 h-4 ${fanSpeed > 0 ? 'animate-spin-slow' : ''}`} />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black leading-tight">Climate Fan Speed</h5>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Level {fanSpeed}</span>
                  </div>
                </div>
                <button
                  onClick={cycleFanSpeed}
                  className="px-2.5 py-1 text-[8px] font-black bg-indigo-500 hover:bg-indigo-600 rounded-lg uppercase"
                >
                  Cycle
                </button>
              </div>

              {/* Accessory 3: Smart Soil Sprinkler */}
              <div className="bg-white/10 p-3 rounded-2xl flex items-center justify-between border border-white/5 shadow-xs">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${sprinklerOn ? 'bg-blue-400 text-gray-950' : 'bg-gray-800 text-gray-400'}`}>
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black leading-tight">Soil Irrigator</h5>
                    <span className="text-[9px] text-gray-400 font-bold uppercase">{sprinklerOn ? 'Irrigating' : 'Standby'}</span>
                  </div>
                </div>
                <button
                  onClick={toggleSprinklerPhone}
                  className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${sprinklerOn ? 'bg-emerald-400' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white transition-transform ${sprinklerOn ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>

              {/* Mini sensory readings grid */}
              <div className="grid grid-cols-2 gap-2 pt-1 font-mono">
                <div className="bg-black/35 p-2 rounded-xl border border-white/5">
                  <span className="text-[7.5px] uppercase text-gray-400 font-bold block">Humidity</span>
                  <div className="text-sm font-black mt-0.5 text-blue-300">{humidity}%</div>
                </div>

                <div className="bg-black/35 p-2 rounded-xl border border-white/5">
                  <span className="text-[7.5px] uppercase text-gray-400 font-bold block">Soil Moisture</span>
                  <div className="text-sm font-black mt-0.5 text-emerald-300">{soilMoisture}/1023</div>
                </div>
              </div>

            </div>

            {/* Smart fire alarm status badge bottom */}
            <div className={`p-2.5 rounded-2xl border flex items-center gap-2 justify-center transition-all ${
              smokeDetected 
                ? 'bg-rose-500/25 border-rose-500 text-rose-300 animate-pulse'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {smokeDetected ? <Flame className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              <span className="text-[8.5px] font-black uppercase tracking-wider">
                {smokeDetected ? 'SMOKE FLARE DETECTED! 🚨' : 'Household Secure'}
              </span>
            </div>

          </div>
        </div>

      </div>

      {/* COLUMN 2: ENVIRONMENT SIMULATORS AND TELEMETRY GRID */}
      <div className="lg:col-span-7 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col justify-between h-full space-y-6 shadow-xs overflow-y-auto">
        <div>
          <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-1.5">
            <Cpu className="w-5 h-5 text-rose-500" /> Sensor Environment Rig
          </h3>
          <p className="text-xs text-gray-400 font-semibold leading-relaxed">
            Slide the controllers down to simulate physical weather or atmosphere shifts and see how the smart phone reacts!
          </p>
        </div>

        {/* Sensory Inputs Controls Rig Grid */}
        <div className="grid sm:grid-cols-2 gap-6 flex-1">
          
          {/* Temperature Slider */}
          <div className="bg-gray-50 dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-600/30 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black dark:text-white uppercase flex items-center gap-1 text-gray-700">
                <Thermometer className="w-4 h-4 text-orange-500 animate-pulse" /> Air Temperature
              </label>
              <span className="text-xs font-black font-mono text-orange-600 dark:text-orange-400">{temperature}°C</span>
            </div>
            <input 
              type="range" 
              min="-10" 
              max="50" 
              value={temperature}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTemperature(val);
                addConsoleLine(`[IoT] Sensor Shift: Atmosphere Temperature is now ${val}°C`);
              }}
              className="w-full accent-orange-500 cursor-col-resize animate-pulse"
            />
          </div>

          {/* Humidity Slider */}
          <div className="bg-gray-50 dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-600/30 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black dark:text-white uppercase flex items-center gap-1 text-gray-700">
                <Droplet className="w-4 h-4 text-blue-500" /> Air Humidity (%)
              </label>
              <span className="text-xs font-black font-mono text-blue-600 dark:text-blue-400">{humidity}%</span>
            </div>
            <input 
              type="range" 
              min="10" 
              max="100" 
              value={humidity}
              onChange={(e) => {
                const val = Number(e.target.value);
                setHumidity(val);
                addConsoleLine(`[IoT] Sensor Shift: Atmosphere Humidity is now ${val}%`);
              }}
              className="w-full accent-blue-500 cursor-col-resize"
            />
          </div>

          {/* Soil Moisture Slider */}
          <div className="bg-gray-50 dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-600/30 space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-black dark:text-white uppercase text-gray-700">
                🌾 Ground Moisture level
              </label>
              <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">{soilMoisture}/1023</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1023" 
              value={soilMoisture}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSoilMoisture(val);
                addConsoleLine(`[IoT] Sensor Shift: Ground Soil Moisture index reading: ${val}`);
              }}
              className="w-full accent-emerald-500 cursor-col-resize"
            />
          </div>

          {/* Smoke gaseous Alarm Slider */}
          <div className="bg-gray-50 dark:bg-gray-905 p-4 rounded-2xl border border-gray-100 dark:border-gray-600/30 flex items-center justify-between">
            <div>
              <label className="text-xs font-black dark:text-white uppercase text-gray-700">
                💨 Smoke Smother Gas
              </label>
              <span className="text-[10px] text-gray-400 block font-bold">Triggers alert warnings</span>
            </div>
            <button
              onClick={() => {
                setSmokeDetected(!smokeDetected);
                addConsoleLine(`[IoT] Environment Altered: Gaseous smoke flare: ${!smokeDetected ? 'DETECTED' : 'CLEAR'}`);
              }}
              className={`px-4 py-2 rounded-xl text-[10px] font-extrabold text-white uppercase transition-all select-none ${
                smokeDetected ? 'bg-rose-500 ring-4 ring-rose-400/30 animate-pulse' : 'bg-gray-700 hover:bg-gray-800'
              }`}
            >
              {smokeDetected ? 'Clear Smoke' : 'Release Smoke'}
            </button>
          </div>

        </div>

        {/* Real-Time Telemetry visual graphs mock */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-gray-800 text-gray-400 font-mono text-[9px] uppercase tracking-wider space-y-3">
          <div className="flex justify-between items-center text-[10px] pb-1 border-b border-gray-800 font-black">
            <span className="flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-rose-500 animate-spin-slow" /> Cloud Telemetry Streams</span>
            <span className="text-emerald-400 animate-pulse font-bold">● Recv Live packets</span>
          </div>

          {/* Render stylized bar graphs showing sensory inputs over time */}
          <div className="space-y-2 py-1">
            <div className="flex items-center gap-2">
              <span className="w-16">WiFi Png:</span>
              <div className="flex-1 bg-gray-900 border border-gray-800 h-3.5 rounded-sm overflow-hidden flex items-center">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full animate-pulse" style={{ width: '85%' }} />
              </div>
              <span className="w-8 text-right font-black">85ms</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16">ESP32 Temp:</span>
              <div className="flex-1 bg-gray-900 border border-gray-800 h-3.5 rounded-sm overflow-hidden flex items-center">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-rose-500 h-full transition-all duration-300" 
                  style={{ width: `${Math.min(100, (temperature + 10) * 1.62)}%` }} 
                />
              </div>
              <span className="w-8 text-right font-black">{temperature}°C</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-16">Moisture:</span>
              <div className="flex-1 bg-gray-900 border border-gray-800 h-3.5 rounded-sm overflow-hidden flex items-center">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full transition-all duration-300" 
                  style={{ width: `${(soilMoisture / 1023) * 100}%` }} 
                />
              </div>
              <span className="w-8 text-right font-black">{Math.round((soilMoisture/1023)*100)}%</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
