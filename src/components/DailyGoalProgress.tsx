import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Target,
  Trophy,
  Sparkles,
  CheckCircle2,
  Flame,
  ArrowRight,
  Shield,
  Sliders,
  RotateCcw,
  PartyPopper,
  Zap,
} from 'lucide-react';

interface DailyGoalProgressProps {
  className?: string;
  onOpenSettings?: () => void;
}

export const DailyGoalProgress: React.FC<DailyGoalProgressProps> = ({
  className = '',
  onOpenSettings,
}) => {
  const {
    user,
    tasks,
    completeTask,
    startFocusSession,
    updateUserDailyGoal,
    setActiveView,
  } = useApp();

  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [customGoal, setCustomGoal] = useState(user?.dailyGoalTotal || 8);

  const completed = user?.dailyGoalCompleted ?? 5;
  const target = user?.dailyGoalTotal ?? 8;
  const percentage = target > 0 ? Math.min(100, Math.round((completed / target) * 100)) : 0;
  const isGoalMet = completed >= target && target > 0;
  const remaining = Math.max(0, target - completed);

  const prevCompletedRef = useRef(completed);
  const hasTriggeredInitialRef = useRef(false);

  // Trigger high-energy confetti burst
  const triggerConfetti = () => {
    try {
      // 1. Center burst
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899', '#8b5cf6'],
      });

      // 2. Left and right celebration cannons
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#10b981', '#6366f1', '#f59e0b'],
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ec4899', '#06b6d4', '#8b5cf6'],
        });
      }, 250);
    } catch (e) {
      console.error('Confetti animation error:', e);
    }
  };

  // Watch for goal completion changes
  useEffect(() => {
    // If the count increased and reached or surpassed the goal, fire confetti
    if (completed >= target && prevCompletedRef.current < target) {
      triggerConfetti();
    }
    prevCompletedRef.current = completed;
  }, [completed, target]);

  // Handle manual goal update
  const handleSaveGoal = () => {
    if (customGoal > 0) {
      updateUserDailyGoal(customGoal, user?.rewardDurationMinutes || 15);
      setIsEditingGoal(false);
      if (completed >= customGoal) {
        triggerConfetti();
      }
    }
  };

  // Complete next pending task
  const handleCompleteNextTask = () => {
    const nextPending = tasks.find((t) => t.status === 'pending');
    if (nextPending) {
      completeTask(nextPending.id);
    }
  };

  // SVG Radial Ring Calculations
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border ${
        isGoalMet
          ? 'border-emerald-500/40 shadow-emerald-500/10 dark:shadow-emerald-950/20 shadow-xl'
          : 'border-slate-200 dark:border-slate-800 shadow-lg'
      } p-6 sm:p-7 transition-all ${className}`}
    >
      {/* Background ambient gradient glow */}
      <div
        className={`absolute -right-16 -top-16 w-56 h-56 rounded-full blur-3xl pointer-events-none transition-all ${
          isGoalMet
            ? 'bg-gradient-to-br from-emerald-500/20 via-teal-500/15 to-transparent'
            : 'bg-gradient-to-br from-indigo-500/15 via-purple-500/10 to-transparent'
        }`}
      />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Section: Details & Status */}
        <div className="flex-1 space-y-4 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            <div
              className={`p-2 rounded-xl flex items-center justify-center ${
                isGoalMet
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {isGoalMet ? <Trophy className="w-5 h-5 text-emerald-500" /> : <Target className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Daily Goal Progress
                </h3>
                {isGoalMet && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500 text-white shadow-md shadow-emerald-500/30 animate-bounce">
                    <Sparkles className="w-3 h-3 fill-white" />
                    Goal Met!
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing task completion against your user-set daily target.
              </p>
            </div>
          </div>

          {/* Status Headline */}
          <div className="space-y-1">
            <div className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center justify-center md:justify-start gap-2 font-mono">
              <span>{completed}</span>
              <span className="text-slate-400 font-normal">/</span>
              <span>{target} Tasks</span>
              <span
                className={`text-sm sm:text-base font-bold ml-1 ${
                  isGoalMet
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-indigo-600 dark:text-indigo-400'
                }`}
              >
                ({percentage}%)
              </span>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              {isGoalMet ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center justify-center md:justify-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  Sensational work! You crushed 100% of your daily learning goal today.
                </span>
              ) : remaining === 1 ? (
                <span className="text-amber-600 dark:text-amber-400 font-bold flex items-center justify-center md:justify-start gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                  Only 1 task remaining to hit your target and trigger today&apos;s celebration!
                </span>
              ) : (
                <span>
                  Complete <strong className="text-indigo-600 dark:text-indigo-400">{remaining} more tasks</strong> today to unlock your Goal Crusher achievement badge.
                </span>
              )}
            </p>
          </div>

          {/* Interactive Progress Segments */}
          <div className="space-y-1.5 max-w-md mx-auto md:mx-0">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span>Milestone Breakdown</span>
              <span>{percentage}% Complete</span>
            </div>

            <div className="grid grid-flow-col gap-1.5 h-2.5">
              {Array.from({ length: target }).map((_, idx) => {
                const isFinished = idx < completed;
                return (
                  <div
                    key={idx}
                    className={`rounded-full transition-all duration-500 ${
                      isFinished
                        ? isGoalMet
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-sm shadow-emerald-500/20'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        : 'bg-slate-100 dark:bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
            {!isGoalMet ? (
              <button
                onClick={handleCompleteNextTask}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark Next Task Complete (+1)</span>
              </button>
            ) : (
              <button
                onClick={triggerConfetti}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
              >
                <PartyPopper className="w-3.5 h-3.5" />
                <span>Trigger Celebration Confetti 🎉</span>
              </button>
            )}

            <button
              onClick={() => setIsEditingGoal(!isEditingGoal)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isEditingGoal ? 'Cancel' : 'Edit Goal'}</span>
            </button>
          </div>

          {/* In-Place Goal Editor */}
          {isEditingGoal && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-3 animate-in fade-in">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Daily Goal:
              </span>
              <input
                type="number"
                min={1}
                max={25}
                value={customGoal}
                onChange={(e) => setCustomGoal(Number(e.target.value))}
                className="w-20 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
              />
              <span className="text-xs text-slate-400">tasks/day</span>

              <button
                onClick={handleSaveGoal}
                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors"
              >
                Save & Update
              </button>
            </div>
          )}
        </div>

        {/* Right Section: Futuristic Radial Gauge */}
        <div className="relative shrink-0 flex flex-col items-center justify-center p-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Radial Meter */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100 dark:text-slate-800/80"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />

              {/* Progress Ring with Smooth Stroke */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={isGoalMet ? '#10b981' : '#6366f1'}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-700 ease-out"
              />
            </svg>

            {/* Inner Center Badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  isGoalMet
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-900 dark:text-white'
                }`}
              >
                {percentage}%
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                {isGoalMet ? 'Crushed' : 'Target'}
              </span>
            </div>
          </div>

          {/* Quick Confetti Replay Trigger */}
          <button
            onClick={triggerConfetti}
            className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 opacity-80 hover:opacity-100 transition-opacity"
            title="Test celebration animation"
          >
            <Sparkles className="w-3 h-3" />
            <span>Test Confetti Burst</span>
          </button>
        </div>
      </div>
    </div>
  );
};
