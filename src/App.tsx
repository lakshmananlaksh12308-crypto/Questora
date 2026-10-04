import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthView } from './components/AuthView';
import { DashboardView } from './components/DashboardView';
import { SyllabusSageView } from './components/SyllabusSageView';
import { AdaptivePlannerView } from './components/AdaptivePlannerView';
import { SmartStudySessionView } from './components/SmartStudySessionView';
import { QuizMasterView } from './components/QuizMasterView';
import { ReformatEngineView } from './components/ReformatEngineView';
import { LockdinFocusView } from './components/LockdinFocusView';
import { ProgressAnalyticsView } from './components/ProgressAnalyticsView';
import { CalendarView } from './components/CalendarView';
import { AchievementsView } from './components/AchievementsView';
import { SettingsView } from './components/SettingsView';
import { VeoVideoStudioView } from './components/VeoVideoStudioView';
import { MangaAnimationView } from './components/MangaAnimationView';
import { GeminiChatbotView } from './components/GeminiChatbotView';
import { AudioTranscribeView } from './components/AudioTranscribeView';
import { AudioTranscribeModal } from './components/AudioTranscribeModal';
import { GameArenaView } from './components/GameArenaView';
import { EBookReaderView } from './components/EBookReaderView';
import { HackathonDemoModal } from './components/HackathonDemoModal';
import { LiveVoiceModal } from './components/LiveVoiceModal';
import { QuestoraLogo } from './components/QuestoraLogo';
import { Compass } from 'lucide-react';

function MainApp() {
  const { activeView, setActiveView, isAuthenticated, loading } = useApp();
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isLiveVoiceOpen, setIsLiveVoiceOpen] = useState(false);
  const [isTranscribeOpen, setIsTranscribeOpen] = useState(false);

  // 1. Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-white">
        <QuestoraLogo size="md" showText={false} animated={true} />
        <p className="text-xs font-semibold text-slate-400">Loading QUESTORA Ecosystem...</p>
      </div>
    );
  }

  // 2. Unauthenticated State: Protected Routes Enforcement
  if (!isAuthenticated) {
    if (activeView === 'landing') {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
          <Navbar
            onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
            onOpenDemo={() => setIsDemoOpen(true)}
            onOpenTranscribe={() => setIsTranscribeOpen(true)}
          />
          <LandingPage
            onStartStudying={() => setActiveView('login')}
            onOpenDemo={() => setIsDemoOpen(true)}
          />
          <HackathonDemoModal
            isOpen={isDemoOpen}
            onClose={() => setIsDemoOpen(false)}
          />
          <LiveVoiceModal
            isOpen={isLiveVoiceOpen}
            onClose={() => setIsLiveVoiceOpen(false)}
          />
          <AudioTranscribeModal
            isOpen={isTranscribeOpen}
            onClose={() => setIsTranscribeOpen(false)}
          />
        </div>
      );
    }

    // Must log in before accessing the dashboard
    return (
      <>
        <AuthView onSkipToLanding={() => setActiveView('landing')} />
        <HackathonDemoModal
          isOpen={isDemoOpen}
          onClose={() => setIsDemoOpen(false)}
        />
        <LiveVoiceModal
          isOpen={isLiveVoiceOpen}
          onClose={() => setIsLiveVoiceOpen(false)}
        />
        <AudioTranscribeModal
          isOpen={isTranscribeOpen}
          onClose={() => setIsTranscribeOpen(false)}
        />
      </>
    );
  }

  // 3. Authenticated State: Full Access to Dashboard and Modules
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Navbar */}
      <Navbar
        onOpenLiveVoice={() => setIsLiveVoiceOpen(true)}
        onOpenDemo={() => setIsDemoOpen(true)}
        onOpenTranscribe={() => setIsTranscribeOpen(true)}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar onOpenDemo={() => setIsDemoOpen(true)} />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'syllabus' && <SyllabusSageView />}
          {activeView === 'planner' && <AdaptivePlannerView />}
          {activeView === 'study' && <SmartStudySessionView />}
          {activeView === 'games' && <GameArenaView />}
          {activeView === 'ebook' && <EBookReaderView />}
          {activeView === 'transcribe' && <AudioTranscribeView />}
          {activeView === 'chatbot' && <GeminiChatbotView />}
          {activeView === 'veo' && <VeoVideoStudioView />}
          {activeView === 'manga' && <MangaAnimationView />}
          {activeView === 'quiz' && <QuizMasterView />}
          {activeView === 'reformat' && <ReformatEngineView />}
          {activeView === 'focus' && <LockdinFocusView />}
          {activeView === 'analytics' && <ProgressAnalyticsView />}
          {activeView === 'calendar' && <CalendarView />}
          {activeView === 'achievements' && <AchievementsView />}
          {activeView === 'settings' && <SettingsView />}
          {activeView === 'login' && <AuthView onSkipToLanding={() => setActiveView('dashboard')} />}
          {activeView === 'landing' && (
            <LandingPage
              onStartStudying={() => setActiveView('dashboard')}
              onOpenDemo={() => setIsDemoOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Floating Modals */}
      <HackathonDemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />

      <LiveVoiceModal
        isOpen={isLiveVoiceOpen}
        onClose={() => setIsLiveVoiceOpen(false)}
      />

      <AudioTranscribeModal
        isOpen={isTranscribeOpen}
        onClose={() => setIsTranscribeOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
