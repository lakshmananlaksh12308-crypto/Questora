import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  PlayCircle,
  PauseCircle,
  ArrowRight,
  ArrowLeft,
  X,
  CheckCircle2,
  Sparkles,
  Zap,
  BookOpen,
  CalendarCheck,
  Brain,
  HelpCircle,
  Shield,
  Coffee,
  RotateCcw,
} from 'lucide-react';

interface HackathonDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HackathonDemoModal: React.FC<HackathonDemoModalProps> = ({ isOpen, onClose }) => {
  const {
    setActiveView,
    demoStep,
    setDemoStep,
    completeTask,
    triggerReformatTopic,
    startFocusSession,
    startRewardBreak,
    setPreferredLanguage,
    resetToDemoDefaults,
  } = useApp();

  const [isPlayingAuto, setIsPlayingAuto] = useState(false);

  const demoSteps = [
    {
      step: 1,
      title: '1. Upload Sample Syllabus',
      desc: 'Judge uploads an Engineering & STEM curriculum containing Calculus, Electromagnetism, and Algorithms.',
      actionLabel: 'Go to Syllabus Sage',
      action: () => setActiveView('syllabus'),
      icon: BookOpen,
      highlight: 'Syllabus Sage',
    },
    {
      step: 2,
      title: '2. AI Detects Subjects & Topics',
      desc: 'Gemini analyzes the document and extracts 47 topics across 5 subjects with difficulty, priority, and confidence ratings.',
      actionLabel: 'View Topic Breakdown',
      action: () => setActiveView('syllabus'),
      icon: Sparkles,
      highlight: '47 Topics Detected',
    },
    {
      step: 3,
      title: '3. Generate Adaptive Study Plan',
      desc: 'Based on upcoming exam dates and student available hours, an optimal spaced-repetition daily timetable is synthesized.',
      actionLabel: 'Open Adaptive Planner',
      action: () => setActiveView('planner'),
      icon: CalendarCheck,
      highlight: 'Spaced Repetition',
    },
    {
      step: 4,
      title: '4. Start Focused Study Session',
      desc: 'Student launches into a dedicated study screen with countdown timer and interactive multi-turn AI tutor.',
      actionLabel: 'Enter Study Screen',
      action: () => setActiveView('study'),
      icon: Brain,
      highlight: 'SmartStudy AI',
    },
    {
      step: 5,
      title: '5. Complete a Topic',
      desc: 'After 25 minutes of deep focus on Derivatives, the student clicks "Complete Topic" to signal learning progress.',
      actionLabel: 'Complete Topic',
      action: () => setActiveView('study'),
      icon: CheckCircle2,
      highlight: 'Session Logged',
    },
    {
      step: 6,
      title: '6. Rate Understanding (Signal = 2/5)',
      desc: 'Student reports low understanding (2/5) and high difficulty. The app records this non-medical cognitive signal.',
      actionLabel: 'Simulate 2/5 Rating',
      action: () => setActiveView('study'),
      icon: Brain,
      highlight: 'Understanding = 2/5',
    },
    {
      step: 7,
      title: '7. AI Automatically Schedules Revision',
      desc: 'QUESTORA Intelligence Engine detects the low understanding rating and schedules an urgent 20-minute revision tomorrow.',
      actionLabel: 'Check Adaptive Plan',
      action: () => setActiveView('planner'),
      icon: RotateCcw,
      highlight: 'Revision Scheduled',
    },
    {
      step: 8,
      title: '8. Take 3-Question Quick Quiz',
      desc: 'QuizMaster AI presents 3 multiple choice questions to diagnostically test understanding of the Chain Rule.',
      actionLabel: 'Launch QuizMaster AI',
      action: () => setActiveView('quiz'),
      icon: HelpCircle,
      highlight: 'Active Recall Check',
    },
    {
      step: 9,
      title: '9. Adaptive Score Evaluation (< 50%)',
      desc: 'Student scores 1/3 (33% accuracy). The adaptive engine flags the topic and prompts the 3-Way Reformat Engine.',
      actionLabel: 'View Quiz Results',
      action: () => setActiveView('quiz'),
      icon: AlertTriangleIcon,
      highlight: 'Accuracy: 33%',
    },
    {
      step: 10,
      title: '10. Trigger Reformat Engine in Tanglish',
      desc: 'Student accesses alternative mental models. Tutor language set to Tanglish for natural conversational peer-to-peer clarity.',
      actionLabel: 'Open Tanglish Reformat',
      action: () => {
        setPreferredLanguage('Tanglish');
        triggerReformatTopic('Derivatives & Chain Rule', 'Mathematics');
      },
      icon: Sparkles,
      highlight: 'Tanglish Peer Tutor',
    },
    {
      step: 11,
      title: '11. Visual / Logical / Story Explanations',
      desc: 'Concept is explained geometrically, deductively, and via a relatable Speedometer analogy ("Speedometer instant speed kaatum...").',
      actionLabel: 'Explore 3 Perspectives',
      action: () => setActiveView('reformat'),
      icon: BookOpen,
      highlight: 'Visual • Logical • Story',
    },
    {
      step: 12,
      title: '12. Start LOCKDIN Focus Mode',
      desc: 'Student enters distraction-free LOCKDIN full-screen mode. Syncs live with Firestore SessionState for Chrome extension blocking.',
      actionLabel: 'Activate LOCKDIN',
      action: () => startFocusSession(),
      icon: Shield,
      highlight: 'Distraction Shield Active',
    },
    {
      step: 13,
      title: '13. Complete Daily Task (Micro Logic)',
      desc: 'Student finishes problem set. Earns +60 XP, level progression bar advances, and celebratory confetti fires!',
      actionLabel: 'Complete Task',
      action: () => completeTask('task-6'),
      icon: CheckCircle2,
      highlight: 'Task 6/8 Done • +60 XP',
    },
    {
      step: 14,
      title: '14. Activate 15-Minute Reward Break',
      desc: 'Micro logic automatically unlocks a 15-minute reward countdown. Extension temporarily allows recreational sites.',
      actionLabel: 'Trigger Reward Break',
      action: () => startRewardBreak(15),
      icon: Coffee,
      highlight: '15m Micro Reward',
    },
    {
      step: 15,
      title: '15. Return to Updated Dashboard',
      desc: 'Dashboard reflects updated subject mastery, streak count (7 days), new daily goal progress, and scheduled revision!',
      actionLabel: 'View Live Dashboard',
      action: () => setActiveView('dashboard'),
      icon: Zap,
      highlight: 'Unified Ecosystem Complete',
    },
  ];

  // Auto-play timer (approx 6 seconds per step = ~90 seconds total)
  useEffect(() => {
    let timer: any = null;
    if (isPlayingAuto && isOpen) {
      timer = setInterval(() => {
        setDemoStep((prev: number) => {
          if (prev < demoSteps.length - 1) {
            const nextStep = prev + 1;
            demoSteps[nextStep].action();
            return nextStep;
          } else {
            setIsPlayingAuto(false);
            return prev;
          }
        });
      }, 6000);
    }
    return () => clearInterval(timer);
  }, [isPlayingAuto, isOpen, demoSteps]);

  if (!isOpen) return null;

  const current = demoSteps[demoStep];
  const Icon = current.icon;

  const handleNext = () => {
    if (demoStep < demoSteps.length - 1) {
      const next = demoStep + 1;
      setDemoStep(next);
      demoSteps[next].action();
    }
  };

  const handlePrev = () => {
    if (demoStep > 0) {
      const prev = demoStep - 1;
      setDemoStep(prev);
      demoSteps[prev].action();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-xl rounded-3xl bg-slate-900 border border-slate-700/80 p-5 sm:p-6 shadow-2xl text-white space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping inline-block" />
            <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
              Hackathon Judge Demo Flow (90s Walkthrough)
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => resetToDemoDefaults()}
              className="text-[11px] text-slate-400 hover:text-white underline font-semibold"
            >
              Reset
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step pill indicator */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono">
            Step {demoStep + 1} of {demoSteps.length}
          </span>
          <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
            {current.highlight}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-purple-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((demoStep + 1) / demoSteps.length) * 100}%` }}
          />
        </div>

        {/* Step card content */}
        <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700 space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{current.title}</h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                {current.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setIsPlayingAuto(!isPlayingAuto)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
              isPlayingAuto
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isPlayingAuto ? <PauseCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
            <span>{isPlayingAuto ? 'Pause Auto-Play' : 'Auto-Play (90s)'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={demoStep === 0}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={current.action}
              className="px-3.5 py-2 rounded-xl bg-indigo-600/40 hover:bg-indigo-600/60 border border-indigo-500/50 text-indigo-300 text-xs font-semibold transition-all"
            >
              {current.actionLabel}
            </button>

            <button
              onClick={handleNext}
              disabled={demoStep === demoSteps.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-30 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function AlertTriangleIcon(props: any) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}
