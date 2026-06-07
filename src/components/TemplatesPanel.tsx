import React from 'react';
import { PROJECT_TEMPLATES } from '../data/templates';
import { Layers, ArrowRight, Play, Award, Zap, Flame, Compass, Cpu } from 'lucide-react';

interface TemplatesPanelProps {
  onLoadTemplate: (id: string) => void;
}

export default function TemplatesPanel({ onLoadTemplate }: TemplatesPanelProps) {
  
  // Icon helper mapping
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Coding': return <Layers className="w-4 h-4 text-orange-500" />;
      case 'Circuits': return <Cpu className="w-4 h-4 text-emerald-500" />;
      case 'Robotics': return <Compass className="w-4 h-4 text-indigo-500" />;
      case 'IoT': return <Zap className="w-4 h-4 text-rose-500" />;
      case 'AI': return <Award className="w-4 h-4 text-purple-500" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner': return 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/20';
      case 'Intermediate': return 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20';
      case 'Advanced': return 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20';
      default: return 'bg-gray-50';
    }
  };

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto space-y-8 select-none">
      
      {/* Templates Title Header banner */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
          STEM Project Templates
        </h2>
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Kickstart your learning! Select any pre-designed circuit blueprint or visual blockly stack, load it instantly, and simulate right away!
        </p>
      </div>

      {/* Grid of templates */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PROJECT_TEMPLATES.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700/80 p-6 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Category & difficulty indicators */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 dark:bg-gray-700 rounded-xl text-xs font-extrabold text-gray-800 dark:text-gray-200">
                  {getCategoryIcon(template.category)}
                  <span>{template.category}</span>
                </div>

                <span className={`text-[10px] font-extrabold border px-2 py-0.5 rounded-full uppercase tracking-wider ${getDifficultyColor(template.difficulty)}`}>
                  {template.difficulty}
                </span>
              </div>

              {/* Title & info description */}
              <div className="space-y-1">
                <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors leading-snug">
                  {template.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold leading-relaxed">
                  {template.description}
                </p>
              </div>

              {/* Bill of materials indicators */}
              <div className="bg-gray-50 dark:bg-gray-900/40 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/80 space-y-2">
                <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">
                  🧪 Components Included
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {template.components.map((comp) => (
                    <span
                      key={comp.id}
                      className="text-[9.5px] px-2 py-0.5 rounded bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700 font-extrabold text-gray-600 dark:text-gray-300"
                    >
                      {comp.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Load project action button */}
            <div className="pt-6">
              <button
                onClick={() => onLoadTemplate(template.id)}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 active:scale-98 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 shadow-md shadow-orange-500/10 cursor-pointer hover:scale-101 transition-all"
              >
                <span>Load Project & Wire Grid</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
