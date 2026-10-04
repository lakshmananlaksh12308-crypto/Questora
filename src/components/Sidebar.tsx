import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck,
  Brain,
  HelpCircle,
  Sparkles,
  Shield,
  BarChart3,
  Calendar,
  Award,
  Settings,
  Flame,
  Zap,
  Film,
  MessageSquare,
  Mic,
  Gamepad2,
  BookMarked,
  Swords,
} from 'lucide-react';

interface SidebarProps {
  onOpenDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenDemo }) => {
  const { activeView, setActiveView, user } = useApp();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'syllabus', label: 'My Syllabus', badge: 'Sage', icon: BookOpen },
    { id: 'planner', label: 'AI Planner', badge: 'Adaptive', icon: CalendarCheck },
    { id: 'study', label: 'Study Sessions', icon: Brain },
    { id: 'games', label: 'Study Game Arena', badge: 'Play & Learn', icon: Gamepad2 },
    { id: 'ebook', label: 'E-Book Library', badge: 'Reader', icon: BookMarked },
    { id: 'transcribe', label: 'Transcribe Audio', badge: 'Gemini 3.5', icon: Mic },
    { id: 'chatbot', label: 'Gemini Chatbot', badge: 'AI Pro', icon: MessageSquare },
    { id: 'veo', label: 'Veo Video Studio', badge: 'Veo 3', icon: Film },
    { id: 'manga', label: 'Manga Animation', badge: 'Anime AI', icon: Swords },
    { id: 'quiz', label: 'Quizzes', badge: 'AI', icon: HelpCircle },
    { id: 'reformat', label: 'Reformat Engine', badge: '3-Way', icon: Sparkles },
    { id: 'focus', label: 'Focus Mode', badge: 'LOCKDIN', icon: Shield },
    { id: 'analytics', label: 'Progress & Stats', icon: BarChart3 },
    { id: 'calendar', label: 'Schedule Calendar', icon: Calendar },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-3 justify-between h-[calc(100vh-57px)] sticky top-[57px]">
        <div className="space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Intelligent Study Core
          </div>

          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                        isActive
                          ? 'text-white'
                          : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-500'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] uppercase px-1.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Gamification & Demo Widget */}
        <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          {user && (
            <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200/60 dark:border-indigo-800/60">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Level {user.level} Learner
                </span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono">
                  {user.xp % 300}/300 XP
                </span>
              </div>
              {/* Progress bar to next level */}
              <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, ((user.xp % 300) / 300) * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1.5">
                {300 - (user.xp % 300)} XP to Level {user.level + 1}
              </p>
            </div>
          )}

          {/* 90-Sec Demo Flow Trigger */}
          <button
            onClick={onOpenDemo}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 active:scale-98 transition-all"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>90s Judge Demo Flow</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {[
          { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
          { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
          { id: 'planner', label: 'Planner', icon: CalendarCheck },
          { id: 'reformat', label: 'Reformat', icon: Sparkles },
          { id: 'focus', label: 'LOCKDIN', icon: Shield },
          { id: 'analytics', label: 'Stats', icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-semibold transition-colors ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'scale-110' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
