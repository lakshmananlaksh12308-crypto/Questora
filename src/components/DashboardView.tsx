import React from 'react';
import { useApp } from '../context/AppContext';
import { DailyGoalProgress } from './DailyGoalProgress';
import {
  Sparkles,
  Flame,
  CheckCircle2,
  Clock,
  Target,
  Brain,
  AlertTriangle,
  Calendar,
  ArrowRight,
  Shield,
  HelpCircle,
  Play,
  RotateCcw,
  Zap,
  Gamepad2,
  BookMarked,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    user,
    dailyBriefing,
    tasks,
    subjects,
    topics,
    quizResults,
    completeTask,
    startFocusSession,
    triggerReformatTopic,
    setActiveView,
  } = useApp();

  const weakTopics = topics.filter((t) => t.status === 'Needs Revision' || t.confidence < 50);
  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6 pb-12">
      {/* 1. AI Daily Briefing Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-5 sm:p-6 shadow-xl border border-indigo-700/30">
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-extrabold">{dailyBriefing.greeting}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-cyan-300 border border-white/10">
                AI Study Briefing
              </span>
            </div>

            <p className="text-xs sm:text-sm text-indigo-100/90 leading-relaxed">
              Today you have <strong className="text-white underline">{pendingTasks.length} pending tasks</strong> out of your {user?.dailyGoalTotal || 8} daily target.{' '}
              <span className="text-amber-300 font-semibold">{dailyBriefing.attentionSubject}</span> needs attention because your recent quiz accuracy was 54%.
              Your strongest subject is <span className="text-emerald-300 font-semibold">{dailyBriefing.strongestSubject}</span>.
              Recommended focus time today: <span className="text-cyan-300 font-bold">{dailyBriefing.recommendedFocusMinutes} minutes</span>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (pendingTasks.length > 0) {
                  startFocusSession(pendingTasks[0]);
                } else {
                  setActiveView('planner');
                }
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start Today's Plan</span>
            </button>

            <button
              onClick={() => setActiveView('syllabus')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/15 transition-all"
            >
              <span>View Weak Topics</span>
            </button>

            <button
              onClick={() => setActiveView('games')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs border border-amber-500/30 transition-all"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Game Arena</span>
            </button>

            <button
              onClick={() => setActiveView('ebook')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-xs border border-indigo-500/30 transition-all"
            >
              <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
              <span>E-Book Reader</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Daily Goal Progress Tracker with Confetti Animation */}
      <DailyGoalProgress />

      {/* 3. Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Today's Progress */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Today's Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            {user?.dailyGoalCompleted || 5} / {user?.dailyGoalTotal || 8}
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (((user?.dailyGoalCompleted || 5) / (user?.dailyGoalTotal || 8)) * 100))}%`,
              }}
            />
          </div>
        </div>

        {/* Card 2: Focus Time */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Focus Time</span>
            <Clock className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            2h 35m
          </div>
          <p className="text-[10px] text-cyan-600 dark:text-cyan-400 mt-1 font-medium">LOCKDIN tracked</p>
        </div>

        {/* Card 3: Quiz Accuracy */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Quiz Accuracy</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            78%
          </div>
          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-1 font-medium">Across all checks</p>
        </div>

        {/* Card 4: Current Streak */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Current Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
            7 Days
          </div>
          <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">🔥 Streak Shield Active</p>
        </div>

        {/* Card 5: Weak Topics */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Weak Topics</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {weakTopics.length} Topics
          </div>
          <p className="text-[10px] text-rose-600 dark:text-rose-400 mt-1 font-medium">Priority revision</p>
        </div>

        {/* Card 6: Next Revision */}
        <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
            <span className="text-[11px] font-semibold">Next Revision</span>
            <Calendar className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
            Tomorrow
          </div>
          <p className="text-[10px] text-purple-600 dark:text-purple-400 mt-1 font-medium">Calculus Derivatives</p>
        </div>
      </div>

      {/* 3. Main Dashboard Layout: Left (Tasks + Subjects) | Right (Recommendations + Weak Topics) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tasks & Subject Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Tasks Section */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Today's Adaptive Tasks
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Micro-reward unlocks 15m break after each completion
                </p>
              </div>

              <button
                onClick={() => setActiveView('planner')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
              >
                <span>View Full Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {tasks.slice(0, 6).map((task) => {
                const isDone = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isDone
                        ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 hover:border-indigo-500/50 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => !isDone && completeTask(task.id)}
                        disabled={isDone}
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </button>

                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-semibold ${
                              isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                            }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                              task.difficulty === 'Hard'
                                ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {task.difficulty}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{task.subject}</span>
                          <span>•</span>
                          <span>{task.timeSlot}</span>
                          <span>•</span>
                          <span>{task.estimatedMinutes} mins</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isDone && (
                        <button
                          onClick={() => startFocusSession(task)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors"
                        >
                          <Shield className="w-3 h-3" />
                          <span>Focus</span>
                        </button>
                      )}
                      <button
                        onClick={() => triggerReformatTopic(task.title, task.subject)}
                        className="p-1 rounded-lg text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Reformat explanation"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Subject Progress Cards (Mathematics, Physics, Programming) */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
              Subject Mastery & Confidence
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {subjects.map((subj) => (
                <div
                  key={subj.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white mb-1">
                    <span>{subj.name}</span>
                    <span className="font-mono text-indigo-600 dark:text-indigo-400">
                      {subj.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden my-2">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full"
                      style={{ width: `${subj.progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    <span>Confidence: {subj.confidence}%</span>
                    <span>Remaining: {subj.totalTopics - subj.completedTopics}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Recommendations & Weak Topics */}
        <div className="space-y-6">
          {/* AI Recommendation Engine Cards */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                AI Recommendations
              </h3>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  text: 'Revise Integration for 20 minutes before today’s quiz.',
                  action: 'Revise',
                  icon: RotateCcw,
                  badge: 'High Priority',
                  onClick: () => triggerReformatTopic('Integration by Parts', 'Mathematics'),
                },
                {
                  text: 'Take a 10-minute mindful break to prevent cognitive fatigue.',
                  action: 'Break',
                  icon: Clock,
                  badge: 'Rest Signal',
                  onClick: () => setActiveView('focus'),
                },
                {
                  text: 'You are ready for the next Physics topic: Magnetic Flux.',
                  action: 'Advance',
                  icon: ArrowRight,
                  badge: 'Progression',
                  onClick: () => setActiveView('syllabus'),
                },
                {
                  text: 'Your quiz accuracy dropped. Try the 3-Way Reformat Engine.',
                  action: 'Reformat',
                  icon: Sparkles,
                  badge: 'Adaptive',
                  onClick: () => triggerReformatTopic('Derivatives & Chain Rule', 'Mathematics'),
                },
                {
                  text: '3 topics need spaced revision before your exam in 2 weeks.',
                  action: 'Schedule',
                  icon: Calendar,
                  badge: 'Spaced Repetition',
                  onClick: () => setActiveView('planner'),
                },
              ].map((rec, idx) => {
                const Icon = rec.icon;
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 hover:border-indigo-500/30 transition-all text-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded">
                        {rec.badge}
                      </span>
                      <button
                        onClick={rec.onClick}
                        className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                      >
                        <span>{rec.action}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                      {rec.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Quiz & Weak Topics action */}
          <div className="rounded-2xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-800/40 p-4 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                QuizMaster AI Challenge
              </span>
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded font-mono">
                3 Questions
              </span>
            </div>
            <p className="text-xs text-indigo-100/80 mb-3">
              Test your grasp on <strong className="text-white">Derivatives & Chain Rule</strong> to boost your accuracy from 66%!
            </p>
            <button
              onClick={() => setActiveView('quiz')}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
            >
              <span>Take Quick Quiz</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
