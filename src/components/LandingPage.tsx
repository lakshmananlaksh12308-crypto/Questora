import React from 'react';
import { useApp } from '../context/AppContext';
import { QuestoraLogo } from './QuestoraLogo';
import {
  Compass,
  ArrowRight,
  BookOpen,
  Brain,
  Shield,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Award,
  PlayCircle,
  HelpCircle,
  BarChart,
  RefreshCw,
  Flame,
} from 'lucide-react';

interface LandingPageProps {
  onStartStudying: () => void;
  onOpenDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartStudying, onOpenDemo }) => {
  const { setActiveView } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-indigo-500 selection:text-white pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Futuristic glowing backdrop */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Logo Showcase */}
          <div className="flex justify-center mb-2">
            <QuestoraLogo size="xl" showText={true} showTagline={true} animated={true} />
          </div>

          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Unified AI Study & Gamified Learning System</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] text-slate-950 dark:text-white">
            Turn Your Syllabus Into a{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 dark:from-indigo-400 dark:via-purple-400 dark:to-cyan-300 bg-clip-text text-transparent">
              Smarter Study System
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            QUESTORA plans your studies, measures your understanding, protects your focus, quizzes your knowledge, and automatically adapts your learning journey with gamified quests.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartStudying}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 active:scale-95 transition-all"
            >
              <span>Start Studying</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDemo}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            >
              <PlayCircle className="w-4 h-4" />
              <span>Launch 90s Judge Demo</span>
            </button>

            <a
              href="#features"
              className="px-5 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm transition-all"
            >
              Explore Features
            </a>
          </div>
        </div>

        {/* Hero Visual: Interactive AI Study Dashboard Preview */}
        <div className="mt-12 relative max-w-5xl mx-auto">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/70 shadow-2xl backdrop-blur-xl p-4 sm:p-6 overflow-hidden">
            {/* Window bar */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="text-xs text-slate-400 font-mono ml-2">focusflow.ai/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Adaptive AI: Active
                </span>
              </div>
            </div>

            {/* Dashboard interactive preview grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Today's Tasks & Study Progress */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    Today's Progress
                  </span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono">5 / 8 Tasks</span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div className="w-[62.5%] h-full bg-gradient-to-r from-emerald-500 to-indigo-600 rounded-full" />
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 line-through">
                    <span>Calculus: Derivatives</span>
                    <span className="text-[10px] text-emerald-500">Done</span>
                  </div>
                  <div className="flex items-center justify-between p-1.5 rounded bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-indigo-800 dark:text-indigo-200 font-medium">
                    <span>Physics: Faraday Law</span>
                    <span className="text-[10px] bg-indigo-500 text-white px-1 rounded">Next</span>
                  </div>
                </div>
              </div>

              {/* Card 2: LOCKDIN Focus Timer & Score */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-indigo-800/40 text-center relative overflow-hidden">
                <div className="flex items-center justify-between text-xs font-bold text-indigo-300 mb-1">
                  <span className="flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    LOCKDIN Mode
                  </span>
                  <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.5 rounded text-indigo-400">
                    Focus Score: 96%
                  </span>
                </div>
                <div className="font-mono text-3xl font-extrabold text-white my-1 tracking-wider">
                  25:00
                </div>
                <p className="text-[11px] text-indigo-200/80 mb-2">Current: Integration by Parts</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold">
                    Distractions Blocked
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-semibold">
                    15m Reward Ahead
                  </span>
                </div>
              </div>

              {/* Card 3: Quiz Score & AI Recommendation */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    Quiz Accuracy
                  </span>
                  <span className="text-amber-500 font-mono font-bold">78% Average</span>
                </div>
                {/* AI Recommendation bubble */}
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-left">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    <Brain className="w-3 h-3" />
                    AI Recommendation
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                    “Derivatives needs additional revision. Scheduled a 20-minute revision tomorrow.”
                  </p>
                </div>
              </div>
            </div>

            {/* Subject Progress bar strip */}
            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Subjects:</span>
                <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-medium">
                  Mathematics 72%
                </span>
                <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 font-medium">
                  Physics 54%
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-medium">
                  Programming 86%
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate-500 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synchronized with Firestore & Extension</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four Intelligent Pillars Section */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-xs uppercase tracking-widest text-indigo-600 dark:text-indigo-400 font-bold mb-2">
            The 4-in-1 Engine
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-950 dark:text-white">
            Four Intelligent Systems. One Seamless Flow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Syllabus Sage */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              1. Syllabus Sage
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Upload any syllabus (PDF, image, text) and extract subjects, chapters, topics, difficulty, and exam priorities into an actionable study map.
            </p>
            <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
              “47 topics detected across 5 subjects”
            </span>
          </div>

          {/* Pillar 2: SmartStudy AI */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              2. SmartStudy AI
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              After each session, report understanding, mood, and difficulty (1–5). The AI dynamically adjusts revision cycles and spaced repetition.
            </p>
            <span className="text-[11px] font-mono text-purple-600 dark:text-purple-400 font-semibold">
              “Understanding = 2/5 → Revision scheduled”
            </span>
          </div>

          {/* Pillar 3: LOCKDIN Focus Mode */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              3. LOCKDIN Focus Mode
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Full-screen distraction-free timer with macro/micro reward logic. Connects to Manifest V3 Chrome Extension via Firestore SessionState.
            </p>
            <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-semibold">
              “Focus Mode: ACTIVE | Break: 15:00”
            </span>
          </div>

          {/* Pillar 4: Reformat Engine */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all hover:shadow-xl group">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
              4. Reformat Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Stuck on a concept? Explain it in 3 ways: Visual (diagrams), Logical (step-by-step), or Story (real-world analogy), plus Tanglish & regional languages.
            </p>
            <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-semibold">
              “Visual • Logical • Story • Tanglish”
            </span>
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mt-8">
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-8 sm:p-12 text-center text-white shadow-2xl relative overflow-hidden">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to upgrade your study workflow?
          </h2>
          <p className="text-sm sm:text-base text-indigo-200 max-w-xl mx-auto mb-6">
            Join students using QUESTORA to master complex coursework without burnout.
          </p>
          <button
            onClick={onStartStudying}
            className="px-6 py-3 rounded-xl bg-white text-indigo-900 font-extrabold text-sm hover:bg-indigo-50 shadow-lg active:scale-95 transition-all"
          >
            Enter Study Operating System
          </button>
        </div>
      </section>
    </div>
  );
};
