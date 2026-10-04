import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Clock,
  Maximize,
  Minimize,
  Coffee,
  CheckCircle2,
  AlertOctagon,
  Sparkles,
  Layers,
  Settings,
  Flame,
  ArrowRight,
} from 'lucide-react';

export const LockdinFocusView: React.FC = () => {
  const {
    sessionState,
    startFocusSession,
    endFocusSession,
    startRewardBreak,
    endRewardBreak,
    tasks,
    user,
    completeTask,
    updateUserDailyGoal,
  } = useApp();

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [focusTimer, setFocusTimer] = useState(sessionState.activeTimer || 1500);
  const [focusScore] = useState(96);
  const [showConfig, setShowConfig] = useState(false);
  const [rewardMins, setRewardMins] = useState(user?.rewardDurationMinutes || 15);
  const [dailyTarget, setDailyTarget] = useState(user?.dailyGoalTotal || 8);

  const activeTask = tasks.find((t) => t.id === sessionState.currentTaskId) || tasks.find((t) => t.status === 'pending');

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (sessionState.isStudyMode || sessionState.rewardBreakActive) {
      interval = setInterval(() => {
        setFocusTimer((prev) => {
          if (prev <= 1) {
            if (sessionState.rewardBreakActive) {
              endRewardBreak();
              return 1500;
            } else {
              startRewardBreak(user?.rewardDurationMinutes || 15);
              return (user?.rewardDurationMinutes || 15) * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionState.isStudyMode, sessionState.rewardBreakActive]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSaveConfig = () => {
    updateUserDailyGoal(dailyTarget, rewardMins);
    setShowConfig(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              LOCKDIN Focus Mode
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              Distraction Shield
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Zero-distraction environment with Macro daily goals and Micro 15-minute reward breaks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configure Breaks</span>
          </button>

          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Break Configuration Drawer */}
      {showConfig && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-3 animate-in fade-in">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Macro & Micro Logic Settings
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Micro Reward Break Duration (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={45}
                value={rewardMins}
                onChange={(e) => setRewardMins(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Automatically unlocks after every completed study task.
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Macro Daily Goal Target (Tasks)
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={dailyTarget}
                onChange={(e) => setDailyTarget(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Focus Mode remains the recommended state until this is met.
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowConfig(false)}
              className="px-3 py-1.5 text-xs text-slate-500 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* Main Focus Shield Console */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow ambient background */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* State Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full ${
                sessionState.isStudyMode
                  ? 'bg-emerald-500 animate-ping'
                  : sessionState.rewardBreakActive
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-slate-500'
              }`}
            />
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-300">
              {sessionState.isStudyMode
                ? 'Focus Mode: ACTIVE'
                : sessionState.rewardBreakActive
                ? `Reward Break: ${formatTimer(focusTimer)}`
                : 'Focus Mode: STANDBY'}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-cyan-400">
            <span>Focus Score: {focusScore}/100</span>
            <span>•</span>
            <span>Distractions: 0</span>
          </div>
        </div>

        {/* Big Center Display */}
        <div className="text-center max-w-lg mx-auto space-y-4 py-6">
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
            {sessionState.rewardBreakActive ? 'Reward Break In Progress' : 'Current Deep Focus Task'}
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            {sessionState.rewardBreakActive
              ? 'Enjoy Your 15-Minute Cognitive Refresh ☕'
              : activeTask?.title || 'Advanced Study Block'}
          </h3>

          <p className="text-xs text-indigo-200/80">
            Subject: <strong className="text-cyan-300">{activeTask?.subject || 'Mathematics'}</strong>
          </p>

          {/* Huge Timer */}
          <div className="my-8">
            <div className="font-mono text-6xl sm:text-7xl font-extrabold tracking-wider text-white">
              {formatTimer(focusTimer)}
            </div>
            <div className="w-48 h-1 bg-slate-800 mx-auto rounded-full mt-4 overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  sessionState.rewardBreakActive
                    ? 'bg-amber-400'
                    : 'bg-gradient-to-r from-cyan-400 to-indigo-500'
                }`}
                style={{
                  width: `${Math.min(100, (focusTimer / 1500) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            {!sessionState.isStudyMode && !sessionState.rewardBreakActive ? (
              <button
                onClick={() => startFocusSession(activeTask)}
                className="px-8 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
              >
                Activate LOCKDIN Focus
              </button>
            ) : sessionState.rewardBreakActive ? (
              <button
                onClick={() => endRewardBreak()}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              >
                Resume Study Mode Early
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    if (activeTask) {
                      completeTask(activeTask.id);
                    } else {
                      startRewardBreak(user?.rewardDurationMinutes || 15);
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md shadow-emerald-500/25 active:scale-95 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Complete Task & Unlock Reward</span>
                </button>

                <button
                  onClick={() => endFocusSession()}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-all"
                >
                  End Focus Session
                </button>
              </>
            )}
          </div>
        </div>

        {/* Macro Daily Target Progress Strip */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>
              Macro Goal: <strong>{user?.dailyGoalCompleted || 5}/{user?.dailyGoalTotal || 8} Tasks</strong>
            </span>
          </div>

          <div className="text-slate-400 text-[11px]">
            {user && user.dailyGoalCompleted >= user.dailyGoalTotal
              ? '🎉 Daily study goal reached! Feel free to unwind.'
              : '⚡ Until daily goal is met, LOCKDIN is the recommended focus state.'}
          </div>
        </div>
      </div>

      {/* Chrome Extension Integration Architecture */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Manifest V3 Chrome Extension Integration Architecture
            </h4>
          </div>
          <span className="text-[10px] font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full font-bold">
            Firestore SessionState Sync
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          The web application synchronizes real-time state with Firestore collection{' '}
          <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-400">
            sessionState/{'{userId}'}
          </code>
          . A companion Manifest V3 Chrome extension subscribes to this document via Firestore listeners.
        </p>

        {/* JSON Schema visual */}
        <pre className="p-3 rounded-xl bg-slate-950 text-cyan-300 font-mono text-[11px] overflow-x-auto border border-slate-800">
{`SessionState: {
  userId: "${user?.uid || 'user123'}",
  isStudyMode: ${sessionState.isStudyMode},
  rewardBreakActive: ${sessionState.rewardBreakActive},
  activeTimer: ${focusTimer},
  currentTaskId: "${sessionState.currentTaskId || 'task001'}",
  updatedAt: "${new Date().toISOString()}"
}`}
        </pre>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <strong className="text-slate-900 dark:text-white">When isStudyMode = true:</strong>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Extension dynamically activates declarativeNetRequest rules to block distracting entertainment websites.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60">
            <strong className="text-slate-900 dark:text-white">When rewardBreakActive = true:</strong>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              Extension temporarily unblocks configured sites for the configured duration (15:00 default).
            </p>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Compliance Note: The application operates strictly within standard browser sandbox and Web APIs. It does not make unsupported claims of physically locking hardware devices.
        </p>
      </div>
    </div>
  );
};
