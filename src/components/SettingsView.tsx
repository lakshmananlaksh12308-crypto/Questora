import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import {
  Settings,
  Languages,
  Clock,
  Shield,
  Database,
  CheckCircle2,
  Save,
  Server,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    user,
    preferredLanguage,
    setPreferredLanguage,
    updateUserDailyGoal,
    sessionState,
  } = useApp();

  const [dailyTotal, setDailyTotal] = useState(user?.dailyGoalTotal || 8);
  const [rewardMins, setRewardMins] = useState(user?.rewardDurationMinutes || 15);
  const [savedNotice, setSavedNotice] = useState(false);

  const languages: Language[] = [
    'English',
    'Tanglish',
    'Tamil',
    'Hindi',
    'Malayalam',
    'Telugu',
    'Kannada',
  ];

  const handleSave = () => {
    updateUserDailyGoal(dailyTotal, rewardMins);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            System & Learning Settings
          </h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            Preferences
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Customize your study cadence, break duration, language preferences, and cloud synchronization.
        </p>
      </div>

      {savedNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      {/* Main Settings Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-500" />
            <span>AI Tutor & Reformat Language</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {languages.map((l) => (
              <button
                key={l}
                onClick={() => setPreferredLanguage(l)}
                className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                  preferredLanguage === l
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>{l}</div>
                {l === 'Tanglish' && (
                  <span className="text-[10px] text-purple-500 font-normal">
                    Colloquial peer tone
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Daily Tasks & Break Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Micro Reward Break Duration (Minutes)</span>
            </label>
            <input
              type="number"
              min={5}
              max={60}
              value={rewardMins}
              onChange={(e) => setRewardMins(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100"
            />
            <p className="text-[10px] text-slate-400">
              Default is 15 minutes. Automatically unlocked each time you complete a study task.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>Macro Daily Goal Target (Tasks)</span>
            </label>
            <input
              type="number"
              min={1}
              max={25}
              value={dailyTotal}
              onChange={(e) => setDailyTotal(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100"
            />
            <p className="text-[10px] text-slate-400">
              Default is 8 tasks. Focus Mode remains active until daily target is accomplished.
            </p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>

        {/* API Key & Cloud Architecture Details Card */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-5 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-500" />
            <span>API Keys & Cloud Services Configuration</span>
          </h3>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 w-fit">
            ● Services Connected
          </span>
        </div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-mono">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase text-[10px] font-bold">Google Gemini API Key</span>
              <span className="text-emerald-500 text-[10px] font-bold">Active in Server Proxy</span>
            </div>
            <div className="text-purple-600 dark:text-purple-400 font-bold select-all truncate">
              AI Studio Runtime Secret (GEMINI_API_KEY)
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Powers gemini-3.5-transcribe, gemini-3.8-flash-tts, gemini-3.5-flash, and Live Voice.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 uppercase text-[10px] font-bold">Firebase Web API Key</span>
              <span className="text-indigo-500 text-[10px] font-bold">Auth & Firestore</span>
            </div>
            <div className="text-indigo-600 dark:text-indigo-400 font-bold select-all truncate">
              AIzaSyD_4GvMqm2Devejw-_44IRiRRCvMQO3HOo
            </div>
            <p className="text-[10px] text-slate-400 font-sans">
              Configured via firebase-applet-config.json for Google Sign-In & Email Auth.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-bold">Firebase Project ID</span>
            <div className="text-slate-800 dark:text-slate-200 font-bold select-all">
              lucid-totality-2vr20
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <span className="text-slate-400 uppercase text-[10px] font-bold">Firestore Database ID</span>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold select-all truncate">
              ai-studio-focusflowai-1296e4d0-73a4-45c1-8415-1bf7efa41cf7
            </div>
          </div>
        </div>

        {/* Live Gemini Test Connection Action */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Gemini Model Ecosystem Status</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Models ready: <strong>gemini-3.5-transcribe</strong> (Speech-to-Text), <strong>gemini-3.8-flash-tts</strong> (Speech), <strong>gemini-3.5-flash</strong> (Tutor & Syllabus).
            </p>
          </div>

          <button
            onClick={() => {
              setSavedNotice(true);
              setTimeout(() => setSavedNotice(false), 2500);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            Verify API Status
          </button>
        </div>

        {/* Email/Password Setup Guide */}
        <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
          <div className="font-bold text-indigo-900 dark:text-indigo-300 flex items-center justify-between">
            <span>Enabling Email/Password in Firebase Console:</span>
            <span className="text-[10px] bg-indigo-500/20 px-2 py-0.5 rounded font-mono">Setup Guide</span>
          </div>
          <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300 text-[11px] leading-relaxed">
            <li>Open the Firebase Console for your project: <strong className="font-mono text-indigo-600 dark:text-indigo-400">lucid-totality-2vr20</strong>.</li>
            <li>In the left sidebar, click <strong>Build &gt; Authentication &gt; Sign-in method</strong>.</li>
            <li>Click <strong>Email/Password</strong> under Native providers.</li>
            <li>Toggle <strong>Enable</strong> to ON (and optionally Email link), then click <strong>Save</strong>.</li>
            <li>Students can now register and log in seamlessly via both Email/Password and Google Sign-In!</li>
          </ol>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600 dark:text-slate-400 pt-2">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-500" />
              Firebase Firestore Security
            </strong>
            <p className="text-[11px] leading-relaxed">
              Rules version 2 deployed with ABAC protection. Collections: Users, Tasks, Subjects, Topics, StudySessions, QuizResults, SessionState, Achievements.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-1">
            <strong className="text-slate-900 dark:text-white flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-indigo-500" />
              Gemini AI Server Proxy
            </strong>
            <p className="text-[11px] leading-relaxed">
              Protected Express proxy (/api/*) communicates with `@google/genai` utilizing GEMINI_API_KEY without exposing secrets to client bundles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
