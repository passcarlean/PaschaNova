import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, Settings, RotateCcw, Lightbulb, Wifi, Eye, 
  ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Target
} from 'lucide-react';

interface RoboticsPanelProps {
  isRunning: boolean;
  addConsoleLine: (line: string) => void;
}

export default function RoboticsPanel({ isRunning, addConsoleLine }: RoboticsPanelProps) {
  const [activeRobot, setActiveRobot] = useState<'line_follower' | 'obstacle' | 'robotic_arm' | 'bluetooth_car' | 'traffic'>('obstacle');
  
  // Robot physics state variables
  const [roverAngle, setRoverAngle] = useState<number>(0);
  const [linePosition, setLinePosition] = useState<number>(30); // 0-100 position on line path
  const [roboticClawOpen, setRoboticClawOpen] = useState<boolean>(true);
  const [servoElbow, setServoElbow] = useState<number>(45);
  const [servoShoulder, setServoShoulder] = useState<number>(90);
  const [carSpeedPercent, setCarSpeedPercent] = useState<number>(0);
  const [sensorAlertActive, setSensorAlertActive] = useState<boolean>(false);
  const [bluetoothSignalIcon, setBluetoothSignalIcon] = useState<boolean>(false);
  
  // Simulated obstacles
  const [obstacleDistance, setObstacleDistance] = useState<number>(100);

  // Line follower automatic adjustments
  useEffect(() => {
    let interval: any;
    if (isRunning && activeRobot === 'line_follower') {
      interval = setInterval(() => {
        // Drifts back and forth dynamically, showing standard infrared sensors corrections
        setLinePosition((prev) => {
          let next = prev + (Math.random() - 0.5) * 15;
          if (next < 10) {
            addConsoleLine('[Robotics] IR Left Sensor: Line Detected! Action: Turning Left wheel ↩');
            return 25;
          }
          if (next > 90) {
            addConsoleLine('[Robotics] IR Right Sensor: Line Detected! Action: Turning Right wheel ↪');
            return 75;
          }
          return next;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeRobot]);

  // Obstacle avoidance automatic scanner sweep
  useEffect(() => {
    let interval: any;
    if (isRunning && activeRobot === 'obstacle') {
      interval = setInterval(() => {
        setObstacleDistance((prev) => {
          let next = prev - 8;
          if (next <= 20) {
            setSensorAlertActive(true);
            addConsoleLine('[Robotics] Warning: Obstacle detected within 20cm! Reversing Rover... 🚨');
            return 110; // reset far away in simulation loop
          } else {
            setSensorAlertActive(false);
          }
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeRobot]);

  const triggerBluetoothDir = (dir: string) => {
    setBluetoothSignalIcon(true);
    setCarSpeedPercent(80);
    addConsoleLine(`[Robotics] Received Bluetooth BLE command: DRIVE_${dir} at 80% motor speed.`);
    setTimeout(() => {
      setBluetoothSignalIcon(false);
      setCarSpeedPercent(0);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 max-w-7xl mx-auto h-[calc(100vh-140px)]">
      
      {/* ROBOT ARCHETYPES DRAWER */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col p-4 shadow-xs space-y-3">
        <div>
          <h3 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Select Archetypes
          </h3>
          <p className="text-[10px] font-bold text-gray-400">Build and test specialized modules.</p>
        </div>

        <div className="flex flex-col gap-2">
          {[
            { id: 'obstacle', label: 'Obstacle Sorter Bot', badge: 'Sonar sensor' },
            { id: 'line_follower', label: 'Line Tracker Rover', badge: 'Infrared line follow' },
            { id: 'robotic_arm', label: '3-Axis Robotic joint Arm', badge: 'Servo gripper' },
            { id: 'bluetooth_car', label: 'Bluetooth Remote Car', badge: 'BLE wireless' },
            { id: 'traffic', label: 'Grid Smart Signals', badge: 'Traffic light sync' }
          ].map((bot) => (
            <button
              key={bot.id}
              onClick={() => {
                setActiveRobot(bot.id as any);
                setObstacleDistance(100);
                setSensorAlertActive(false);
              }}
              className={`w-full text-left p-3 rounded-xl border transition-all shrink-0 cursor-pointer ${
                activeRobot === bot.id
                  ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border-indigo-500 scale-102 font-black'
                  : 'border-gray-100 dark:border-gray-700 bg-gray-50/50 hover:bg-white text-gray-600 hover:scale-101'
              }`}
            >
              <div className="text-sm font-extrabold leading-tight">{bot.label}</div>
              <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{bot.badge}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ROBOTICS TEST ENVIRONMENT ARENA */}
      <div className="lg:col-span-9 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col h-full overflow-hidden shadow-xs relative">
        
        {/* Arena Header */}
        <div className="bg-white dark:bg-gray-900 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isRunning ? 'bg-indigo-500 animate-ping' : 'bg-gray-300'}`} />
            <h3 className="dark:text-white uppercase tracking-wider">Robotics Arena Visualizer</h3>
          </div>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-md">
            Status: {isRunning ? 'Active Telemetry' : 'Standby Mode'}
          </span>
        </div>

        {/* Dynamic Sandbox graphic arena */}
        <div className="flex-1 overflow-hidden p-6 relative bg-linear-to-b from-gray-100/30 to-gray-200/50 dark:from-gray-950/20 dark:to-gray-900/40 flex items-center justify-center">
          
          {/* ARCHETYPE 1: OBSTACLE AVOIDANCE ROVER */}
          {activeRobot === 'obstacle' && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
              <div className="relative w-full h-[220px] bg-white dark:bg-gray-900/60 rounded-3xl border border-gray-100 dark:border-gray-800 flex items-center justify-around overflow-hidden shadow-inner px-4">
                
                {/* Sonic Pulses visually showing distance range */}
                {isRunning && (
                  <div className="absolute left-1/3 top-1/2 -translate-y-1/2 space-x-2 flex">
                    {[1, 2, 3].map(wave => (
                      <div 
                        key={wave} 
                        className={`h-12 w-1.5 rounded-full bg-indigo-500/20 animate-pulse`} 
                        style={{ opacity: obstacleDistance < wave * 40 ? 0.9 : 0.1 }}
                      />
                    ))}
                  </div>
                )}

                {/* Rover Robot Frame */}
                <motion.div 
                  animate={{ x: sensorAlertActive ? -15 : 0 }}
                  className="w-24 h-36 bg-gray-200 dark:bg-gray-800 border-2 border-gray-300 rounded-2xl p-3 flex flex-col justify-between shadow-md relative z-10"
                >
                  {/* Left Motor Wheel */}
                  <div className={`absolute -left-3 top-4 w-2.5 h-10 bg-black rounded-sm border border-gray-400 ${isRunning ? 'animate-pulse' : ''}`} />
                  {/* Right Motor Wheel */}
                  <div className={`absolute -right-3 top-4 w-2.5 h-10 bg-black rounded-sm border border-gray-400 ${isRunning ? 'animate-pulse' : ''}`} />
                  
                  {/* Ultrasonic eyes HUD */}
                  <div className="flex justify-center gap-1.5 border-b pb-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center border text-white font-mono text-[7px]">O</div>
                    <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center border text-white font-mono text-[7px]">O</div>
                  </div>

                  {/* Range metric panel */}
                  <div className="text-center font-mono">
                    <span className="text-[7.5px] uppercase font-bold text-gray-400">Range Sonar</span>
                    <p className={`text-xs font-black ${sensorAlertActive ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                      {Math.round(obstacleDistance)} cm
                    </p>
                  </div>

                  {/* Rear roller wheel */}
                  <div className="w-4 h-4 rounded-full bg-gray-500 mx-auto" />
                </motion.div>

                {/* Simulated Red obstacle Wall */}
                <div className="flex flex-col items-center gap-1.5">
                  <div className="text-[8px] font-black uppercase text-red-500 text-center tracking-widest leading-none">Wall Block</div>
                  <div className="w-8 h-24 rounded-lg bg-red-500 border-2 border-red-300 flex items-center justify-center shadow-md animate-pulse">
                    <span className="text-white font-black text-center text-[10px] select-none uppercase">Wall</span>
                  </div>
                </div>

              </div>

              {/* Range sensor Slider */}
              <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-gray-200">
                  <span>Obstacle Proximity Scale</span>
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-mono text-gray-600">{Math.round(obstacleDistance)} cm</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="140" 
                  value={obstacleDistance}
                  onChange={(e) => {
                    const d = Number(e.target.value);
                    setObstacleDistance(d);
                    setSensorAlertActive(d <= 20);
                  }}
                  className="w-full accent-indigo-500" 
                />
              </div>
            </div>
          )}

          {/* ARCHETYPE 2: LINE TRACKING ROVER */}
          {activeRobot === 'line_follower' && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-md">
              {/* Rover on line background map */}
              <div className="relative w-full h-[220px] bg-zinc-800 border rounded-3xl overflow-hidden flex items-center justify-center p-4">
                
                {/* Winding black tape track */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path d="M -10 110 Q 150 140 200 110 T 410 110" fill="none" stroke="#111827" strokeWidth="24" strokeLinecap="round" />
                  <path d="M -10 110 Q 150 140 200 110 T 410 110" fill="none" stroke="#EF4444" strokeWidth="2" strokeDasharray="6,6" />
                </svg>

                {/* Line Follower Chassis */}
                <motion.div 
                  animate={{ 
                    x: (linePosition - 50) * 1.6,
                    rotate: (linePosition - 50) * 0.4
                  }}
                  className="w-24 h-36 bg-gray-200 dark:bg-slate-700 rounded-3xl px-3 py-2 flex flex-col justify-between shadow-lg relative z-10 border border-gray-300"
                >
                  {/* Active spinning Wheels */}
                  <div className={`absolute -left-3 top-8 w-2.5 h-12 bg-black rounded-xs ${isRunning ? 'animate-pulse' : ''}`} />
                  <div className={`absolute -right-3 top-8 w-2.5 h-12 bg-black rounded-xs ${isRunning ? 'animate-pulse' : ''}`} />

                  {/* Dual IR modules under head */}
                  <div className="flex justify-between border-b pb-1">
                    <div className="flex flex-col items-center">
                      <span className="text-[5.5px] uppercase text-gray-400 font-bold leading-none">Left IR</span>
                      <div className={`w-3.5 h-3.5 rounded-full ${linePosition < 35 ? 'bg-red-500 animate-ping' : 'bg-gray-400'} border`} />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[5.5px] uppercase text-gray-400 font-bold leading-none">Right IR</span>
                      <div className={`w-3.5 h-3.5 rounded-full ${linePosition > 65 ? 'bg-red-500 animate-ping' : 'bg-gray-400'} border`} />
                    </div>
                  </div>

                  <div className="text-center font-mono">
                    <span className="text-[7.5px] text-gray-400 uppercase font-bold text-center block">IR Center Delta</span>
                    <span className="text-[10px] font-black tracking-wide text-indigo-500">
                      Bias: {Math.round(linePosition)}%
                    </span>
                  </div>

                  <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full mx-auto animate-pulse" />
                </motion.div>

              </div>

              {/* Control slider to drift robot manually */}
              <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold text-gray-800 dark:text-gray-200">
                  <span>Drift Track Position</span>
                  <span className="text-[10px] font-mono text-gray-400">Position Bias: {Math.round(linePosition)}%</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="95" 
                  value={linePosition} 
                  onChange={e => setLinePosition(Number(e.target.value))}
                  className="w-full accent-indigo-500" 
                />
              </div>
            </div>
          )}

          {/* ARCHETYPE 3: 3-AXIS ROBOTIC MECHANICAL ARM CLAW */}
          {activeRobot === 'robotic_arm' && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm">
              <div className="w-full h-[220px] bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-3xl flex items-end justify-center p-6 shadow-inner relative">
                
                {/* Robotic Base Pedestal */}
                <div className="w-24 h-5 bg-gray-800 rounded-t-lg relative z-10" />

                {/* Upper segments arm joints */}
                <div className="absolute bottom-11 origin-bottom flex flex-col items-center">
                  
                  {/* Shoulder pivot knob */}
                  <div 
                    className="w-4 h-16 bg-gray-400 rounded-full origin-bottom relative"
                    style={{ transform: `rotate(${servoShoulder - 90}deg)` }}
                  >
                    <div className="w-2.5 h-2.5 bg-indigo-500 absolute top-0.5 rounded-full" />
                    
                    {/* Elbow segment forearm */}
                    <div 
                      className="w-3 h-14 bg-gray-500 absolute top-1 rounded-full origin-top"
                      style={{ transform: `rotate(${servoElbow - 45}deg)` }}
                    >
                      {/* Interactive Claw Grip horn */}
                      <div className="w-6 h-6 bg-amber-400 rounded-xs absolute top-12 -left-1.5 flex items-center justify-center border font-mono text-[7px] text-gray-900 font-bold">
                        {roboticClawOpen ? '⊂⊃' : '⊏⊐'}
                      </div>
                    </div>
                  </div>

                </div>

                <div className="absolute top-2 left-4 text-[9px] font-black uppercase tracking-wider text-gray-400">
                  Arm Angles: H:{servoShoulder}° V:{servoElbow}°
                </div>
              </div>

              {/* Sliders for joint rotation */}
              <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                    <span>Base Shoulder Pivot</span>
                    <span>{servoShoulder}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="10" 
                    max="170" 
                    value={servoShoulder}
                    onChange={(e) => {
                      setServoShoulder(Number(e.target.value));
                      addConsoleLine(`[Robotics] Rotated Shoulder joint to: ${e.target.value}°`);
                    }}
                    className="w-full accent-amber-500" 
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-800 dark:text-gray-200">
                    <span>Active Elbow Joint</span>
                    <span>{servoElbow}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="120" 
                    value={servoElbow}
                    onChange={(e) => {
                      setServoElbow(Number(e.target.value));
                      addConsoleLine(`[Robotics] Adjusted Elbow flexion to: ${e.target.value}°`);
                    }}
                    className="w-full accent-amber-500" 
                  />
                </div>

                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/40 p-2.5 rounded-xl border border-gray-100 dark:border-gray-700/80">
                  <span className="text-xs font-bold dark:text-white">Active Locker Gripper open</span>
                  <button
                    onClick={() => {
                      setRoboticClawOpen(!roboticClawOpen);
                      addConsoleLine(`[Robotics] Gripper Claw status: ${!roboticClawOpen ? 'OPENED' : 'CLOSED'}`);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold text-white uppercase transition-all ${
                      roboticClawOpen ? 'bg-indigo-500' : 'bg-emerald-500'
                    }`}
                  >
                    {roboticClawOpen ? 'Close Gripper' : 'Open Gripper'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ARCHETYPE 4: BLUETOOTH REMOTE CONTROLLED SPORTS CAR */}
          {activeRobot === 'bluetooth_car' && (
            <div className="flex flex-col items-center justify-center space-y-6 w-full max-w-sm">
              <div className="w-full h-[220px] bg-slate-900 rounded-3xl overflow-hidden flex flex-col justify-between p-4 relative text-white border-2 border-slate-700 shadow-md">
                
                {/* Active Bluetooth Sparkles Signals */}
                {bluetoothSignalIcon && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-500/20 px-3 py-0.5 border border-indigo-400/40 rounded-full flex items-center gap-1.5 animate-pulse">
                    <Wifi className="w-3.5 h-3.5 text-indigo-400 animate-bounce" />
                    <span className="text-[8px] font-black uppercase text-indigo-300 tracking-wider">BLE Signal Link</span>
                  </div>
                )}

                {/* Grid stats values */}
                <div className="flex justify-between text-slate-400 font-mono text-[8px] uppercase tracking-wider">
                  <div>RF RSSI: -45dbm</div>
                  <div>Power: 12.4V</div>
                </div>

                {/* Animated Sports Car Preview */}
                <div className="flex justify-center flex-1 items-center">
                  <motion.div 
                    animate={{ 
                      scale: carSpeedPercent > 0 ? [1, 1.03, 1] : 1
                    }}
                    transition={{ repeat: Infinity, duration: 0.15 }}
                    className="w-16 h-28 bg-rose-500 rounded-2xl p-2 relative shadow-md shadow-rose-500/30"
                  >
                    {/* Headlights */}
                    <div className="absolute top-0.5 left-2 w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
                    <div className="absolute top-0.5 right-2 w-2 h-2 rounded-full bg-yellow-200 animate-pulse" />
                    <div className="w-full h-8 bg-slate-800 rounded-md mb-2 text-center text-[8px] pt-1">SPEED</div>
                    <div className="w-4 h-4 bg-black rounded-full mx-auto" />
                  </motion.div>
                </div>

                <div className="text-center font-mono text-xs font-black text-rose-400">
                  Drive Speed: {carSpeedPercent}%
                </div>
              </div>

              {/* Bluetooth Remote D-Pad Interface */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700/80 shadow-xs flex flex-col items-center gap-1">
                <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-1">
                  Virtual Touch D-Pad
                </span>
                
                <button 
                  onClick={() => triggerBluetoothDir('FORWARD')}
                  className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 rounded-xl hover:scale-105 active:scale-95 text-indigo-500 transition-all border border-indigo-100.3 h-12 w-12 flex items-center justify-center cursor-pointer"
                >
                  <ArrowUp className="w-5 h-5" />
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => triggerBluetoothDir('LEFT')}
                    className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 rounded-xl hover:scale-105 active:scale-95 text-indigo-500 transition-all border border-indigo-100 h-12 w-12 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-12 h-12 rounded-full border border-gray-200/55 flex items-center justify-center text-[10px] font-mono select-none font-bold text-gray-400 bg-gray-50 dark:bg-gray-900/40">
                    BLE
                  </div>
                  <button 
                    onClick={() => triggerBluetoothDir('RIGHT')}
                    className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 rounded-xl hover:scale-105 active:scale-95 text-indigo-500 transition-all border border-indigo-100 h-12 w-12 flex items-center justify-center cursor-pointer"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={() => triggerBluetoothDir('BACKWARD')}
                  className="p-3 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 rounded-xl hover:scale-105 active:scale-95 text-indigo-500 transition-all border border-indigo-100 h-12 w-12 flex items-center justify-center cursor-pointer"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* ARCHETYPE 5: SMART TRAFFIC light CONTROL BOARD */}
          {activeRobot === 'traffic' && (
            <div className="flex flex-col items-center justify-center space-y-4 w-full max-w-sm">
              <div className="w-full h-[220px] bg-sky-950 rounded-3xl overflow-hidden flex items-center justify-around p-4 relative border border-sky-800 shadow-inner">
                {/* Active Grid Roads */}
                <div className="absolute inset-0 bg-neutral-900 w-24 h-full left-1/2 -translate-x-1/2 flex items-center justify-center border-l border-r border-dashed border-gray-500/40" />

                {/* Speeding car on road */}
                {isRunning && (
                  <motion.div 
                    animate={{ y: [-150, 240] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                    className="w-10 h-16 rounded-md bg-amber-400 absolute left-1/3 border border-yellow-250 flex items-center justify-center"
                  >
                     <span className="text-[7px] font-black uppercase text-gray-900 font-sans">CAR</span>
                  </motion.div>
                )}

                {/* Heavy traffic signals post casing */}
                <div className="w-14 h-36 bg-neutral-900 border border-neutral-700/80 rounded-2xl p-2.5 flex flex-col justify-around relative z-10 shadow-lg">
                  <div className={`w-8 h-8 rounded-full ${isRunning ? 'bg-red-500 ring-4 ring-red-400/40 animate-pulse' : 'bg-red-950'} border border-gray-700 mx-auto`} />
                  <div className={`w-8 h-8 rounded-full bg-yellow-950 border border-gray-700 mx-auto`} />
                  <div className={`w-8 h-8 rounded-full bg-green-950 border border-gray-700 mx-auto`} />
                </div>
              </div>

              <p className="text-xs text-center font-bold text-gray-400 max-w-xs">
                Make sure you wire Pin 13 to Red LED, Pin 12 to Yellow, and Pin 11 to Green inside Circuit Builder for synchronized results.
              </p>
            </div>
          )}

          {/* Prompt warning if simulator is off */}
          {!isRunning && (
            <div className="absolute inset-4 rounded-2xl bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-center text-white p-6 z-40 select-none">
              <Bot className="w-10 h-10 text-amber-400 animate-bounce mb-2" />
              <h4 className="font-extrabold text-sm uppercase tracking-wider">Robot Simulator is Offline</h4>
              <p className="text-xs text-slate-300 font-semibold max-w-xs mt-1">
                Click the **"Run Studio"** play key on top navbar to stream power grids and start automated maneuvers!
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
