import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Target,
  Award,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const ProgressAnalyticsView: React.FC = () => {
  const { subjects, topics, quizResults, user, studySessions } = useApp();

  const weeklyStudyHours = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 3.2 },
    { day: 'Wed', hours: 1.8 },
    { day: 'Thu', hours: 4.0 },
    { day: 'Fri', hours: 3.5 },
    { day: 'Sat', hours: 5.0 },
    { day: 'Sun', hours: 2.6 },
  ];

  const maxHours = Math.max(...weeklyStudyHours.map((w) => w.hours));

  const weakTopics = topics.filter((t) => t.status === 'Needs Revision' || t.confidence < 50);
  const strongTopics = topics.filter((t) => t.confidence >= 80);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            Progress & Learning Analytics
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Cognitive Diagnostics
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Longitudinal trends across focus sessions, quiz accuracy, retention curves, and topic mastery.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400">Total Focus Time</span>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
            22.6h
          </div>
          <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5 mt-1">
            <TrendingUp className="w-3 h-3" />
            +18% this week
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400">Quiz Accuracy</span>
          <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 font-mono mt-1">
            78.4%
          </div>
          <span className="text-[11px] text-indigo-500 font-semibold mt-1 block">
            Across 14 topic quizzes
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400">Tasks Completed</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono mt-1">
            38 Tasks
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            87% on-time completion
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <span className="text-[11px] font-semibold text-slate-400">Understanding Trend</span>
          <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 font-mono mt-1">
            4.2 / 5
          </div>
          <span className="text-[11px] text-purple-500 font-semibold mt-1 block">
            Average post-study rating
          </span>
        </div>
      </div>

      {/* Main Charts Grid: Weekly Study Time & Quiz Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Study Time Bar Chart */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>Weekly Focus Hours (LOCKDIN)</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">Target: 3.5h/day</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 pb-2 px-2">
            {weeklyStudyHours.map((item, idx) => {
              const heightPercent = (item.hours / maxHours) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.hours}h
                  </span>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400 group-hover:brightness-110 transition-all cursor-pointer"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Subject Progress & Confidence Radar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-500" />
              <span>Subject Completion & Confidence</span>
            </h3>
            <span className="text-xs text-slate-400">Syllabus Progress</span>
          </div>

          <div className="space-y-4 pt-2">
            {subjects.map((subj) => (
              <div key={subj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{subj.name}</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {subj.progressPercent}% completed • {subj.confidence}% confidence
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-indigo-500 rounded-l-full"
                    style={{ width: `${subj.progressPercent}%` }}
                  />
                  <div
                    className="h-full bg-cyan-400/40"
                    style={{ width: `${Math.max(0, subj.confidence - subj.progressPercent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strongest vs Weakest Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Topics Needing Revision */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/60 dark:border-rose-950/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              <span>Weak Topics Needing Immediate Revision ({weakTopics.length})</span>
            </h4>
          </div>

          <div className="space-y-2">
            {weakTopics.map((wt) => (
              <div
                key={wt.id}
                className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {wt.subject}: {wt.name}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Confidence: {wt.confidence}% • Revision Due: {wt.revisionDate}
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                  High Priority
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Strongest Topics */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-200/60 dark:border-emerald-950/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Strongest Mastered Topics ({strongTopics.length})</span>
            </h4>
          </div>

          <div className="space-y-2">
            {strongTopics.map((st) => (
              <div
                key={st.id}
                className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {st.subject}: {st.name}
                  </span>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Confidence: {st.confidence}% • Status: {st.status}
                  </div>
                </div>

                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Mastered
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
