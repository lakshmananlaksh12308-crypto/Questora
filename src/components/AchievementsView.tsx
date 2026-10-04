import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Award,
  Flame,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
  BookOpen,
  Lock,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { user, achievements } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            QUESTORA Levels & Badges
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Encouraging Progress
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Earn XP for completing study tasks, maintaining focus sessions, and active spaced-repetition revisions.
        </p>
      </div>

      {/* Level Hero Card */}
      {user && (
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-indigo-700/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shrink-0">
              🔥
            </div>
            <div>
              <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Level {user.level} Focused Learner
              </div>
              <h3 className="text-2xl font-extrabold text-white mt-0.5">
                {user.displayName}
              </h3>
              <div className="flex items-center gap-3 text-xs text-indigo-200 mt-1">
                <span>{user.xp} Total XP</span>
                <span>•</span>
                <span>{user.streak}-Day Study Streak</span>
              </div>
            </div>
          </div>

          {/* XP Progress to next level */}
          <div className="w-full md:w-64 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-300">Level {user.level}</span>
              <span className="text-cyan-300 font-mono">{user.xp % 300} / 300 XP</span>
              <span className="text-slate-300">Level {user.level + 1}</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-400 via-indigo-400 to-cyan-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, ((user.xp % 300) / 300) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block text-right">
              {300 - (user.xp % 300)} XP to next milestone
            </span>
          </div>
        </div>
      )}

      {/* Badges Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-slate-400">
          Earned Badges & Milestones
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-2xl border transition-all ${
                ach.isUnlocked
                  ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl mb-2">{ach.icon}</div>
                {ach.isUnlocked ? (
                  <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlocked
                  </span>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {ach.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                {ach.description}
              </p>

              {ach.unlockedAt && (
                <div className="mt-3 text-[10px] text-slate-400 font-mono">
                  Unlocked: {ach.unlockedAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
