import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { QuestoraLogo } from './QuestoraLogo';
import { Language } from '../types';
import {
  Compass,
  Flame,
  Shield,
  Coffee,
  Sun,
  Moon,
  Mic,
  Volume2,
  LogIn,
  LogOut,
  PlayCircle,
  Sparkles,
  Layers,
} from 'lucide-react';

interface NavbarProps {
  onOpenLiveVoice: () => void;
  onOpenDemo: () => void;
  onOpenTranscribe?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLiveVoice, onOpenDemo, onOpenTranscribe }) => {
  const {
    user,
    signInGoogle,
    signOutAccount,
    theme,
    setTheme,
    preferredLanguage,
    setPreferredLanguage,
    sessionState,
    startRewardBreak,
    endRewardBreak,
    setActiveView,
  } = useApp();

  const [langOpen, setLangOpen] = useState(false);

  const languages: Language[] = [
    'English',
    'Tanglish',
    'Tamil',
    'Hindi',
    'Malayalam',
    'Telugu',
    'Kannada',
  ];

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between px-4 lg:px-6 py-2.5">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('dashboard')}
            className="text-left group transition-transform active:scale-95"
            title="QUESTORA — Learn. Challenge. Master."
          >
            <QuestoraLogo size="sm" showText={true} showTagline={true} animated={true} />
          </button>
        </div>

        {/* Center Live Badges: LOCKDIN and Reward Break State */}
        <div className="hidden md:flex items-center gap-2">
          {sessionState.isStudyMode ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold animate-pulse">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>LOCKDIN FOCUS: ACTIVE</span>
              <span className="font-mono bg-emerald-500/20 px-1.5 py-0.2 rounded text-[11px]">
                {formatTimer(sessionState.activeTimer)}
              </span>
            </div>
          ) : sessionState.rewardBreakActive ? (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <Coffee className="w-3.5 h-3.5 text-amber-500" />
              <span>REWARD BREAK: {formatTimer(sessionState.activeTimer)}</span>
              <button
                onClick={() => endRewardBreak()}
                className="text-[10px] underline hover:text-amber-500"
              >
                Resume
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-medium">
              <Shield className="w-3.5 h-3.5 text-slate-400" />
              <span>LOCKDIN: Standby</span>
            </div>
          )}

          {/* Daily Goal Pill */}
          {user && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium border border-indigo-200 dark:border-indigo-800">
              <Layers className="w-3.5 h-3.5" />
              <span>Goal: {user.dailyGoalCompleted}/{user.dailyGoalTotal}</span>
            </div>
          )}
        </div>

        {/* Right Tools & Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Hackathon Demo Launcher */}
          <button
            onClick={onOpenDemo}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold text-xs shadow-md shadow-orange-500/20 active:scale-95 transition-all"
            title="90-Second Judge Walkthrough"
          >
            <PlayCircle className="w-3.5 h-3.5 animate-bounce" />
            <span className="hidden sm:inline">Demo Mode</span>
            <span className="sm:hidden">Demo</span>
          </button>

          {/* Transcribe Audio (gemini-3.5-transcribe) */}
          <button
            onClick={onOpenTranscribe || (() => setActiveView('transcribe'))}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 text-xs font-semibold active:scale-95 transition-all"
            title="Transcribe audio with microphone (gemini-3.5-transcribe)"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Transcribe</span>
          </button>

          {/* Live Voice Coach */}
          <button
            onClick={onOpenLiveVoice}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-600/10 hover:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs font-semibold active:scale-95 transition-all"
            title="Real-Time Voice Assistant (Gemini Live)"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Voice Coach</span>
          </button>

          {/* Multilingual Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              <Sparkles className="w-3 h-3 text-indigo-500" />
              <span>{preferredLanguage}</span>
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-1.5 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400">
                  Tutor Language
                </div>
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setPreferredLanguage(lang);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-slate-700 ${
                      preferredLanguage === lang
                        ? 'text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{lang}</span>
                    {lang === 'Tanglish' && (
                      <span className="text-[9px] bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1 rounded font-normal">
                        Colloquial
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Dark / Light Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* User Profile / Gamification stats */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
              <div className="hidden lg:flex flex-col items-end text-right">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <span>{user.displayName}</span>
                  <span className="text-amber-500 flex items-center text-[11px]">
                    <Flame className="w-3 h-3 fill-amber-500" />
                    {user.streak}d
                  </span>
                </div>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">
                  Lv.{user.level} • {user.xp} XP
                </span>
              </div>
              <button
                onClick={() => signOutAccount()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setActiveView('login')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 font-semibold text-xs transition-colors"
              title="Sign In or Sync Account"
            >
              <LogIn className="w-3.5 h-3.5 text-indigo-500" />
              <span>Sign In / Sync</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
