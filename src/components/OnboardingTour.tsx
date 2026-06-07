import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, ArrowRight, ArrowLeft, CheckCircle2, Play, Cpu, 
  Code, Wifi, CircleDot, Lightbulb, HelpCircle, BookOpen, X, RefreshCw
} from 'lucide-react';

export interface TourStep {
  title: string;
  description: string;
  tabRequirement?: string; // e.g. 'circuit', 'blockly', 'iot'
  highlightSelector?: string; // HTML element ID/class to focus
  taskDescription?: string;
  checkCompleted: (state: {
    blocksCount: number;
    componentsCount: number;
    wiresCount: number;
    isRunning: boolean;
    currentTab: string;
  }) => boolean;
  hint: string;
}

export interface OnboardingCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  difficulty: 'Beginner' | 'Intermediate';
  steps: TourStep[];
}

export const ONBOARDING_COURSES: OnboardingCourse[] = [
  {
    id: 'blockly_basics',
    title: 'Blockly Drag-and-Drop Coding Studio',
    subtitle: 'Learn to write logic using visual flow puzzle blocks',
    description: 'Perfect starting point for future firmwares. Learn how to nest conditional loops, set hardware outputs, and compile real C++ scripts with simple visual snap-ons.',
    icon: Code,
    difficulty: 'Beginner',
    steps: [
      {
        title: 'Entering Blockly Studio 📝',
        description: 'First, let\'s move to the Blockly Code Workspace where our microprocessor commands are written.',
        tabRequirement: 'blockly',
        highlightSelector: '#nav-blockly',
        taskDescription: 'Click on the "Blockly Studio" tab in the header menu.',
        checkCompleted: ({ currentTab }) => currentTab === 'blockly',
        hint: 'Use the top navigation bar and select "Blockly Studio" (marked with an orange code icon).'
      },
      {
        title: 'Discovering Category Drawers 🗃️',
        description: 'You are now inside the Blockly Canvas. On the left, click on the "Input/Output" or "Logic" category drawers to see the blocks inside!',
        tabRequirement: 'blockly',
        highlightSelector: '#blockly-categories-sidebar',
        taskDescription: 'Have a block on the workspace canvas.',
        checkCompleted: ({ blocksCount, currentTab }) => currentTab === 'blockly' && blocksCount > 0,
        hint: 'Click "Input/Output" on the sidebar, then drag the "Set LED Pin Direct" block onto the dark workspace board.'
      },
      {
        title: 'Power up Simulator ⚡',
        description: 'Awesome! Blocks compile on-the-fly into micro-code. Now we must run our digital simulation processor to execute the custom instructions.',
        tabRequirement: 'blockly',
        highlightSelector: '#control-run',
        taskDescription: 'Click the green "Run Studio" button to ignite live execution.',
        checkCompleted: ({ isRunning }) => isRunning === true,
        hint: 'Look at the top-right corner of the window. Click the high-contrast green "Run Studio" button.'
      }
    ]
  },
  {
    id: 'circuit_arena',
    title: 'Interactive Breadboard Circuit Assembly',
    subtitle: 'Build and wire realistic electronic setups',
    description: 'Construct real physical components. Grab an Arduino board, plug LEDs, align current-limiting resistors, and string custom color wires together.',
    icon: Cpu,
    difficulty: 'Beginner',
    steps: [
      {
        title: 'Entering Circuit Arena 🔬',
        description: 'Excellent. Switch across to the physical Circuit board to design our schematic layout.',
        tabRequirement: 'circuit',
        highlightSelector: '#nav-circuit',
        taskDescription: 'Navigate to the "Circuit Builder" tab in the header.',
        checkCompleted: ({ currentTab }) => currentTab === 'circuit',
        hint: 'Click the green "Circuit Builder" button in the navigation list.'
      },
      {
        title: 'Placing Components 💡',
        description: 'Let\'s load an actuator! Open the floating Parts Drawer and place an LED or other electronics parts on the board.',
        tabRequirement: 'circuit',
        highlightSelector: '#circuit-parts-drawer-trigger',
        taskDescription: 'Have at least one electronic component on the main breadboard layout.',
        checkCompleted: ({ componentsCount, currentTab }) => currentTab === 'circuit' && componentsCount > 0,
        hint: 'Click the "Parts Drawer" slide-out button on the right, and choose a part like LED or Resistor to drop!'
      },
      {
        title: 'Completing Circuit Loop 🔗',
        description: 'Circuits require closed voltage connections. Try drawing wire nodes, or connect pins to complete the power flow.',
        tabRequirement: 'circuit',
        highlightSelector: '#circuit-builder-canvas',
        taskDescription: 'Have at least 1 component wire link or place multiple components to unlock electricity pathways.',
        checkCompleted: ({ componentsCount, wiresCount, currentTab }) => currentTab === 'circuit' && (wiresCount > 0 || componentsCount >= 2),
        hint: 'In Circuit tab, double-click on any pin or terminal (e.g. on Arduino or LED) to start dragging a wire rope to another node, or add multiple parts.'
      }
    ]
  },
  {
    id: 'iot_automation',
    title: 'Smart IoT Infrastructure Automation',
    subtitle: 'Wire automated smart home sensors and triggers',
    description: 'Operate connected microcontrollers. Integrate light dependent sensors, trigger automatic water sprays, and coordinate wireless responses.',
    icon: Wifi,
    difficulty: 'Intermediate',
    steps: [
      {
        title: 'Opening the IoT Station 🏡',
        description: 'Let\'s open the Smart Greenhouse console to explore telemetry dashboards.',
        tabRequirement: 'iot',
        highlightSelector: '#nav-iot',
        taskDescription: 'Welcome! Shift your active tab to the "IoT Lab" in the top header.',
        checkCompleted: ({ currentTab }) => currentTab === 'iot',
        hint: 'Press the Rose/pink coloured "IoT Lab" tab in the navigator.'
      },
      {
        title: 'Engaging Cyber Handshake 📡',
        description: 'This is the smart dashboard tracking current ambient values. We need to turn on our Wi-Fi receiver link to synchronise cloud telemetry.',
        tabRequirement: 'iot',
        highlightSelector: '#iot-wifi-toggle-btn',
        taskDescription: 'Click mock ESP32 WiFi connectivity trigger or make the simulator run.',
        checkCompleted: ({ isRunning }) => isRunning === true,
        hint: 'Click "WiFi: Disconnected" on telemetry card, or turn on the main "Run Studio" green switch to initialize electronic network feeds.'
      }
    ]
  }
];

interface OnboardingTourProps {
  currentTab: string;
  setTab: (tab: string) => void;
  blocksCount: number;
  componentsCount: number;
  wiresCount: number;
  isRunning: boolean;
  onUnlockCertificate: (earnedCertificate: string) => void;
  userCertificates: string[];
}

export default function OnboardingTour({
  currentTab,
  setTab,
  blocksCount,
  componentsCount,
  wiresCount,
  isRunning,
  onUnlockCertificate,
  userCertificates
}: OnboardingTourProps) {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [showCelebrationModal, setShowCelebrationModal] = useState<boolean>(false);

  const activeCourse = ONBOARDING_COURSES.find(c => c.id === activeCourseId);
  const currentStep = activeCourse?.steps[currentStepIndex];

  // Auto-advance step if requirements are satisfied!
  useEffect(() => {
    if (!currentStep) return;

    const isSatisfied = currentStep.checkCompleted({
      blocksCount,
      componentsCount,
      wiresCount,
      isRunning,
      currentTab
    });

    if (isSatisfied) {
      const timeout = setTimeout(() => {
        if (currentStepIndex < (activeCourse?.steps.length || 0) - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          // Finished the whole course!
          handleCourseComplete();
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [blocksCount, componentsCount, wiresCount, isRunning, currentTab, currentStepIndex, activeCourseId]);

  // Handle active class pulsing visual cues
  useEffect(() => {
    if (!currentStep?.highlightSelector) return;
    
    const elements = document.querySelectorAll(currentStep.highlightSelector);
    elements.forEach(el => {
      el.classList.add('ring-4', 'ring-amber-500', 'ring-offset-2', 'animate-pulse');
    });

    return () => {
      elements.forEach(el => {
        el.classList.remove('ring-4', 'ring-amber-500', 'ring-offset-2', 'animate-pulse');
      });
    };
  }, [currentStepIndex, activeCourseId, currentTab]);

  const handleStartCourse = (courseId: string) => {
    setActiveCourseId(courseId);
    setCurrentStepIndex(0);
    setMinimized(false);
    setShowCelebrationModal(false);

    // Prompt user to route immediately to requirement if set
    const firstStep = ONBOARDING_COURSES.find(c => c.id === courseId)?.steps[0];
    if (firstStep?.tabRequirement && currentTab !== firstStep.tabRequirement) {
      setTab(firstStep.tabRequirement);
    }
  };

  const handleCourseComplete = () => {
    if (activeCourse) {
      onUnlockCertificate(activeCourse.title);
      setShowCelebrationModal(true);
    }
  };

  const handleCloseTour = () => {
    setActiveCourseId(null);
    setCurrentStepIndex(0);
    setShowCelebrationModal(false);
  };

  return (
    <>
      {/* 1. SELECTION CARDS EMBEDDED IN HOME PANEL (Tours hub overview) */}
      {currentTab === 'home' && !activeCourseId && (
        <div id="tutorial-dashboard-widget" className="bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-emerald-500/5 p-6 rounded-3xl border border-gray-150 dark:border-gray-800 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5 tracking-tight">
                <Sparkles className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
                <span>STEM Academy Training Center</span>
              </h3>
              <p className="text-xs text-gray-400 font-bold leading-none mt-1">
                Conquer virtual hardware, embedded firmwares, & cloud IoT models step-by-step
              </p>
            </div>
            
            {userCertificates.length > 0 && (
              <div className="px-3.5 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center gap-1.5 text-xs font-black">
                <Award className="w-4 h-4 fill-current animate-bounce" />
                <span>{userCertificates.length} Badges Unlocked</span>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {ONBOARDING_COURSES.map((course) => {
              const CourseIcon = course.icon;
              const isCompleted = userCertificates.includes(course.title);

              return (
                <div 
                  key={course.id} 
                  id={`course-card-${course.id}`}
                  className={`bg-white dark:bg-gray-800 rounded-2xl border transition-all flex flex-col justify-between p-5 shadow-2xs group relative overflow-hidden ${
                    isCompleted 
                      ? 'border-emerald-250 dark:border-emerald-800/80 bg-gradient-to-b from-transparent to-emerald-500/5' 
                      : 'border-gray-150 dark:border-gray-750 hover:border-blue-400 dark:hover:border-blue-500/40 hover:shadow-xs'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-500'
                      }`}>
                        <CourseIcon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black uppercase text-gray-400 px-1.5 py-0.5 rounded bg-gray-50 dark:bg-gray-900 border">
                          {course.difficulty}
                        </span>
                        {isCompleted && (
                          <span className="text-[8px] font-black uppercase text-white bg-emerald-500 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5 fill-current" /> Valid
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-gray-800 dark:text-white group-hover:text-blue-500 transition-colors uppercase tracking-tight">
                        {course.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-bold tracking-tight">
                        {course.subtitle}
                      </p>
                      <p className="text-[11px] font-medium leading-relaxed font-sans text-gray-500 dark:text-gray-400 pt-1">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-end">
                    <button
                      onClick={() => handleStartCourse(course.id)}
                      className={`text-[10px] font-black tracking-wider uppercase flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-lg border transition-all ${
                        isCompleted 
                          ? 'border-emerald-250 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400' 
                          : 'border-blue-100 bg-blue-50 hover:bg-blue-10 w-full hover:bg-blue-100 justify-center text-blue-600 dark:bg-blue-950/30 dark:border-blue-900/40 dark:text-blue-400'
                      }`}
                    >
                      <span>{isCompleted ? 'Redo course ⟲' : 'Launch Workshop 🚀'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. FLOATING TUTORIAL HUB BAR (Sits at bottom of workspace when active) */}
      <AnimatePresence>
        {activeCourse && currentStep && !showCelebrationModal && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            id="onboarding-guide-dock"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4"
          >
            <div className="bg-white dark:bg-gray-900 border border-amber-400/70 rounded-2xl shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-500 animate-pulse" />
              
              {/* Main Content Layout */}
              <div className="p-4 space-y-3">
                {/* Header title block */}
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-950 px-2.5 py-1.5 rounded-xl border border-gray-150 dark:border-gray-800">
                  <div className="flex items-center gap-1.5">
                    <CircleDot className="w-4 h-4 text-amber-500 animate-ping" />
                    <span className="text-[10px] font-black uppercase text-gray-500 font-mono tracking-widest leading-none">
                      Active Tour: {activeCourse.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMinimized(!minimized)}
                      className="text-[9px] font-bold text-gray-400 hover:text-gray-900 hover:underline cursor-pointer"
                    >
                      {minimized ? 'Expand' : 'Collapse'}
                    </button>
                    <button
                      onClick={handleCloseTour}
                      className="p-0.5 text-gray-400 hover:text-red-500 border border-gray-200 dark:border-gray-700 hover:border-red-200 rounded cursor-pointer"
                      title="Exit training tour"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {!minimized && (
                  <>
                    {/* Active Step Content */}
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-gray-900 dark:text-white tracking-tight leading-snug">
                          {currentStep.title}
                        </h4>
                        <span className="text-[10px] font-bold text-gray-400">
                          Step {currentStepIndex + 1} of {activeCourse.steps.length}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-300 font-medium leading-relaxed">
                        {currentStep.description}
                      </p>

                      {/* Goal checklist target */}
                      <div className="p-3 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1 text-xs">
                        <span className="block text-[9.5px] uppercase font-black text-amber-600 dark:text-amber-400 tracking-wider">
                          🎯 ACTION TASK REQUIRED:
                        </span>
                        <div className="flex items-start gap-1.5 text-gray-700 dark:text-gray-200 font-bold leading-none">
                          <div className="w-4 h-4 shrink-0 rounded-md border-2 border-amber-550 flex items-center justify-center text-amber-500 font-mono text-[9px]">
                            {currentStep.checkCompleted({
                              blocksCount,
                              componentsCount,
                              wiresCount,
                              isRunning,
                              currentTab
                            }) ? '✓' : '●'}
                          </div>
                          <span>{currentStep.taskDescription}</span>
                        </div>
                      </div>

                      {/* Small expandable tips */}
                      <div className="text-[10.5px] text-gray-400 font-semibold flex items-start gap-1">
                        <span className="text-amber-500">💡 Hint:</span>
                        <span>{currentStep.hint}</span>
                      </div>
                    </div>

                    {/* Footer Nav Controls */}
                    <div className="border-t border-gray-150 dark:border-gray-800 pt-3 flex justify-between items-center text-xs">
                      <button
                        onClick={() => setCurrentStepIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentStepIndex === 0}
                        className="py-1 px-2.5 bg-gray-50 dark:bg-gray-800 border dark:border-gray-750 font-bold text-gray-500 dark:text-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                      </button>

                      {/* Progress Bar indicator */}
                      <div className="flex gap-1">
                        {activeCourse.steps.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 rounded-full transition-all ${
                              i === currentStepIndex 
                                ? 'w-5 bg-amber-500' 
                                : i < currentStepIndex 
                                  ? 'w-1.5 bg-emerald-500' 
                                  : 'w-1.5 bg-gray-200 dark:bg-gray-750'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (currentStepIndex < activeCourse.steps.length - 1) {
                            setCurrentStepIndex(currentStepIndex + 1);
                          } else {
                            handleCourseComplete();
                          }
                        }}
                        className="py-1 px-3.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-black transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                      >
                        Skip Step <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. TRAINING CELEBRATION MODAL OVERLAY */}
      <AnimatePresence>
        {showCelebrationModal && activeCourse && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl max-w-sm w-full border border-gray-150 dark:border-gray-800 overflow-hidden shadow-2xl text-center relative p-8 space-y-6"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-emerald-500" />
              
              <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20 animate-bounce">
                <Award className="w-10 h-10 fill-current" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#10B981] bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-250">
                  ★ Level Completed ★
                </span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight pt-1 leading-tight">
                  Inventor Training Badge Earned!
                </h3>
                <p className="text-xs text-gray-400 font-bold tracking-tight">
                  Successfully completed "{activeCourse.title}" course.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-2xl text-left space-y-2.5">
                <span className="block text-[8.5px] uppercase font-black tracking-widest text-slate-400">
                  SKILLS GAINED:
                </span>
                <ul className="text-xs font-bold text-gray-650 dark:text-gray-300 space-y-1.5">
                  <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-450">
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                    <span>Visual Algorithm Composition</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-450">
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                    <span>Microcontroller pin layout rules</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-450">
                    <CheckCircle2 className="w-4 h-4 fill-current" />
                    <span>Live electrical simulators execution</span>
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleCloseTour}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase rounded-xl text-xs shadow-md shadow-blue-500/10 cursor-pointer transition-all active:scale-95"
                >
                  Retrieve Certificate & return to Hub 💳
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
