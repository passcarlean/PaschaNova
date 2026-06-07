import React from 'react';
import { motion } from 'motion/react';
import { 
  Code, Cpu, Bot, Wifi, Sparkles, Layers, BookOpen, ArrowRight, Stars, Heart, Award, Users, 
  Trash2, FolderOpen, Calendar 
} from 'lucide-react';
import { SavedProject } from '../types';

interface HomePanelProps {
  setTab: (tab: string) => void;
  onLoadTemplate: (id: string) => void;
  savedProjects: SavedProject[];
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (projectId: string) => void;
}

function ProjectThumbnail({ project }: { project: SavedProject }) {
  const { components, wires, blocks } = project;

  if (!components || components.length === 0) {
    // Dynamic abstract logic block visuals since there's no circuit
    return (
      <div className="w-full h-28 bg-slate-900 rounded-xl relative flex items-center justify-center overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-transparent opacity-40" />
        <div className="space-y-2 z-10 w-full px-4">
          <div className="w-4/5 h-4 bg-orange-500/20 border border-orange-500/35 rounded-md flex items-center px-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mr-2" />
            <div className="w-10 h-1 bg-orange-400/40 rounded-full" />
          </div>
          <div className="w-2/3 h-4 bg-emerald-500/20 border border-emerald-500/35 rounded-md flex items-center px-1.5 ml-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2" />
            <div className="w-14 h-1 bg-emerald-400/40 rounded-full" />
          </div>
          <div className="w-1/2 h-4 bg-indigo-500/20 border border-indigo-500/35 rounded-md flex items-center px-1.5 ml-6">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2" />
            <div className="w-8 h-1 bg-indigo-400/40 rounded-full" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 text-[8px] font-black tracking-widest text-amber-400 bg-amber-950/60 border border-amber-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
          Logic / Code
        </div>
      </div>
    );
  }

  // Bounding box mapping for circuit
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  components.forEach(c => {
    minX = Math.min(minX, c.x);
    minY = Math.min(minY, c.y);
    maxX = Math.max(maxX, c.x + (c.type === 'breadboard' ? 300 : c.type === 'arduino_uno' ? 180 : 80));
    maxY = Math.max(maxY, c.y + (c.type === 'breadboard' ? 100 : c.type === 'arduino_uno' ? 120 : 60));
  });

  const width = Math.max(maxX - minX, 100);
  const height = Math.max(maxY - minY, 100);
  
  const padding = 20;
  const viewWidth = width + padding * 2;
  const viewHeight = height + padding * 2;

  return (
    <div className="w-full h-28 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 relative flex items-center justify-center">
      <svg
        viewBox={`${minX - padding} ${minY - padding} ${viewWidth} ${viewHeight}`}
        className="w-full h-full p-1 opacity-90 transition-opacity"
      >
        {/* Components */}
        {components.map((comp) => {
          let fill = '#4B5563'; 
          let stroke = '#6B7280';
          let w = 60;
          let h = 60;

          if (comp.type === 'arduino_uno') {
            fill = '#0F766E'; 
            stroke = '#14B8A6'; 
            w = 180;
            h = 120;
          } else if (comp.type === 'esp32') {
            fill = '#1E1B4B'; 
            stroke = '#6366F1'; 
            w = 160;
            h = 100;
          } else if (comp.type === 'breadboard') {
            fill = '#E5E7EB'; 
            stroke = '#9CA3AF'; 
            w = 300;
            h = 100;
          } else if (comp.type === 'led') {
            fill = '#EF4444'; 
            stroke = '#F87171';
            w = 40;
            h = 40;
          } else if (comp.type === 'resistor') {
            fill = '#F59E0B'; 
            stroke = '#FBBF24';
            w = 70;
            h = 30;
          } else if (comp.type === 'servo') {
            fill = '#2563EB'; 
            stroke = '#60A5FA';
            w = 70;
            h = 50;
          }

          return (
            <g key={comp.id} transform={`rotate(${comp.rotation || 0}, ${comp.x + w / 2}, ${comp.y + h / 2})`}>
              <rect
                x={comp.x}
                y={comp.y}
                width={w}
                height={h}
                rx={10}
                fill={fill}
                stroke={stroke}
                strokeWidth={2}
              />
              {comp.type === 'arduino_uno' && (
                <rect x={comp.x + 10} y={comp.y + 10} width={25} height={20} fill="#374151" rx={3} />
              )}
            </g>
          );
        })}

        {/* Wires */}
        {wires && wires.map((wire) => {
          const source = components.find(c => c.id === wire.fromComponentId);
          const target = components.find(c => c.id === wire.toComponentId);

          if (!source || !target) return null;

          const startX = source.x + (source.type === 'arduino_uno' ? 90 : source.type === 'breadboard' ? 150 : 30);
          const startY = source.y + (source.type === 'arduino_uno' ? 60 : source.type === 'breadboard' ? 50 : 30);
          const endX = target.x + (target.type === 'arduino_uno' ? 90 : target.type === 'breadboard' ? 150 : 30);
          const endY = target.y + (target.type === 'arduino_uno' ? 60 : target.type === 'breadboard' ? 50 : 30);

          const cpX = (startX + endX) / 2;
          const cpY = Math.min(startY, endY) - 40;

          return (
            <path
              key={wire.id}
              d={`M ${startX} ${startY} Q ${cpX} ${cpY} ${endX} ${endY}`}
              fill="none"
              stroke={wire.color || '#3B82F6'}
              strokeWidth={3}
              strokeLinecap="round"
              opacity={0.85}
            />
          );
        })}
      </svg>
      <div className="absolute bottom-2 right-2 text-[8px] font-black tracking-widest text-[#10B981] bg-emerald-950/60 border border-emerald-500/20 px-1.5 py-0.5 rounded uppercase font-mono">
        Circuit / Sim
      </div>
    </div>
  );
}

export default function HomePanel({ 
  setTab, 
  onLoadTemplate,
  savedProjects,
  onLoadProject,
  onDeleteProject
}: HomePanelProps) {
  const cards = [
    {
      id: 'blockly',
      title: 'Blockly Studio',
      desc: 'Drag blocks and code robots',
      sub: 'Snap together colorful instructions to write real Arduino and ESP32 code! Beginner friendly with zero syntax errors.',
      icon: Code,
      color: 'from-orange-400 to-amber-500 shadow-orange-500/20',
      textColor: 'text-orange-500',
      badge: 'Coding'
    },
    {
      id: 'circuit',
      title: 'Circuit Builder',
      desc: 'Connect components and simulate',
      sub: 'Wire up LEDs, ultrasonic sensors, micro servos, and core chips with virtual jumpers. Watch signals flow instantly!',
      icon: Cpu,
      color: 'from-emerald-400 to-teal-500 shadow-emerald-500/20',
      textColor: 'text-emerald-500',
      badge: 'Electronics'
    },
    {
      id: 'robotics',
      title: 'Robotics Lab',
      desc: 'Build moving robots',
      sub: 'Drive obstacle avoidance rover cars, trigger realistic street signals, or automate programmable crane hands.',
      icon: Bot,
      color: 'from-indigo-400 to-violet-500 shadow-indigo-500/20',
      textColor: 'text-indigo-500',
      badge: 'Robotics'
    },
    {
      id: 'iot',
      title: 'IoT Lab',
      desc: 'Connect smart devices',
      sub: 'Establish real wireless nodes. Send sensor values to virtual mobile phones and tap buttons to turn on relays.',
      icon: Wifi,
      color: 'from-rose-400 to-pink-500 shadow-rose-500/20',
      textColor: 'text-rose-500',
      badge: 'IoT Cloud'
    },
    {
      id: 'ai',
      title: 'AI Lab',
      desc: 'Create smart interactive systems',
      sub: 'Turn on smart computer vision, use microphone commands like "Open Sesame," or synthesize text-to-speech outputs.',
      icon: Sparkles,
      color: 'from-purple-400 to-fuchsia-500 shadow-purple-500/20',
      textColor: 'text-purple-500',
      badge: 'AI Smart tools'
    },
    {
      id: 'templates',
      title: 'Guided Templates',
      desc: 'Start instantly with guided projects',
      sub: 'Zero setup! Open micro projects like "Blink LED" or "Disaster Alarm" with pre-wired circuits and pre-loaded blocks.',
      icon: Layers,
      color: 'from-cyan-400 to-blue-500 shadow-cyan-500/20',
      textColor: 'text-cyan-500',
      badge: 'Templates'
    }
  ];

  const QuickStartTemplates = [
    { id: 'blink_led', title: 'Blink LED R3', desc: 'Fast step-up guide to flashing outputs.' },
    { id: 'traffic_light', title: 'Traffic Signals', desc: 'Control Red, Yellow, Green cycles.' },
    { id: 'servo_control', title: 'Servo Joint', desc: 'Learn sweeping robotic servos.' }
  ];

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-emerald-600 p-8 md:p-12 text-white shadow-xl shadow-blue-500/10">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-widest backdrop-blur-md">
            <Stars className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" /> Create awesome inventions!
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            PaschaNova Labs <br />
            <span className="text-amber-300">Robotics Studio</span>
          </h1>
          <p className="text-lg text-blue-100 font-medium tracking-wide">
            Build • Code • Simulate • Invent
          </p>
          <p className="text-sm text-blue-500/10 dark:text-gray-200/80 leading-relaxed">
            The ultimate visual STEM maker space! Click parts to construct electric breadboards, compile virtual coding blocks, and simulate robots, smart home smart devices, or AI features right in your browser.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => setTab('blockly')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-gray-950 font-extrabold shadow-md transition-all flex items-center gap-2 text-sm hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start Coding Now
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTab('lessons')}
              className="px-6 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-extrabold transition-all text-sm flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" /> Open STEM Lessons
            </button>
          </div>
        </div>
      </div>

      {/* Gamified Stat Banners */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'STEM Projects', value: '1,240+', icon: Award, color: 'text-orange-500' },
          { label: 'Active Makers', value: '45,800+', icon: Users, color: 'text-blue-500' },
          { label: 'Circuits Created', value: '9,410+', icon: Cpu, color: 'text-emerald-500' },
          { label: 'AI Detections', value: 'Live ✦', icon: Sparkles, color: 'text-purple-500' }
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 flex items-center gap-3 shadow-xs">
              <div className={`p-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/55 ${stat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-black dark:text-white leading-tight">{stat.value}</div>
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Bento Studio Labs Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span>Explore Your Interactive Labs</span>
          <span className="text-xs font-bold text-blue-500 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40">Select Lab</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{ y: -6 }}
                onClick={() => setTab(card.id)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                {/* Background Sparkle Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 dark:bg-slice-dark rounded-full -mr-12 -mt-12 group-hover:scale-110 transition-transform duration-300 pointer-events-none" />

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} text-white flex items-center justify-center shadow-md`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300 px-2.5 py-1 rounded-full">
                      {card.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-amber-300 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-sm font-bold text-amber-500 dark:text-orange-400">
                      “{card.desc}”
                    </p>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                    {card.sub}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-amber-300 relative z-10 transition-all">
                  <span>Enter Lab Space</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Portfolio Gallery Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>Portfolio Gallery</span>
            <span className="text-xs font-bold text-amber-500 px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40">
              {savedProjects?.length || 0} Saved Projects
            </span>
          </h2>
          {savedProjects && savedProjects.length > 0 && (
            <p className="text-xs font-semibold text-gray-400">
              Click any blueprint card to load structure
            </p>
          )}
        </div>

        {(!savedProjects || savedProjects.length === 0) ? (
          <div className="p-8 text-center rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800/20 space-y-3 shadow-2xs">
            <div className="w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 mx-auto">
              <FolderOpen className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                No active saved blueprints found
              </h4>
              <p className="text-xs text-gray-400 font-semibold max-w-sm mx-auto leading-relaxed">
                Start designing! Open any workspace tab (Blockly, Circuit Builder, etc.), build your circuit model, and click the Save icon in the header to populate your gallery.
              </p>
            </div>
            <div className="pt-1">
              <button
                onClick={() => setTab('circuit')}
                className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 dark:text-blue-400 text-xs font-black transition-all cursor-pointer"
              >
                Assemble New Circuit
              </button>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {savedProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/85 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Are you sure you want to delete "${project.title}"?`)) {
                      onDeleteProject(project.id);
                    }
                  }}
                  title="Wipe Saved blueprint"
                  className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 animate-fade-in"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-3 cursor-pointer text-left" onClick={() => onLoadProject(project)}>
                  <ProjectThumbnail project={project} />

                  <div className="space-y-1">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm tracking-tight group-hover:text-amber-500 transition-colors truncate max-w-[85%]">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 min-h-8 font-medium">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/70 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{project.savedAt}</span>
                  </div>
                  <button
                    onClick={() => onLoadProject(project)}
                    className="text-blue-600 dark:text-amber-400 font-black tracking-wider flex items-center gap-1 group-hover:underline cursor-pointer"
                  >
                    <span>LOAD DECK</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Load Guided Projects */}
      <div className="bg-gray-50 dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">
              ⚡ Instant Quick-Start Projects
            </h3>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
              Click any project block to load and test simulation immediately!
            </p>
          </div>
          <button
            onClick={() => setTab('templates')}
            className="text-xs font-bold text-blue-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            See all templates ({PROJECT_TEMPLATES.length}) →
          </button>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {QuickStartTemplates.map((template) => (
            <div
              key={template.id}
              onClick={() => onLoadTemplate(template.id)}
              className="bg-white dark:bg-gray-800 hover:bg-orange-50 dark:hover:bg-orange-950/20 p-4 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer shadow-2xs hover:border-orange-200 transition-all group flex flex-col justify-between"
            >
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-orange-500 transition-colors">
                  {template.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {template.desc}
                </p>
              </div>
              <div className="pt-2 text-[10px] font-black tracking-widest uppercase text-orange-500 flex items-center gap-1">
                <span>LOAD STUDY</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Heartfelt Attribution / Developer Note footer */}
      <footer className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between text-xs font-semibold text-gray-400 gap-4">
        <p className="flex items-center gap-1">
          Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" /> for Future STEM Leaders & Engineers.
        </p>
        <p>© 2026 PaschaNova Labs. Auto-compiles real Arduino sketch code.</p>
      </footer>
    </div>
  );
}

// Pre-import template list dynamically for size reporting
import { PROJECT_TEMPLATES } from '../data/templates';
export { PROJECT_TEMPLATES };
