import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  CheckCircle2,
  HelpCircle,
  Clock,
  Sparkles,
  Shield,
  RotateCcw,
  Volume2,
  VolumeX,
  Send,
  Star,
  ArrowRight,
  Brain,
} from 'lucide-react';

export const SmartStudySessionView: React.FC = () => {
  const {
    activeTask,
    submitSessionFeedback,
    triggerReformatTopic,
    preferredLanguage,
    setActiveView,
  } = useApp();

  const [currentSubject, setCurrentSubject] = useState(
    activeTask?.subject || 'Mathematics'
  );
  const [currentTopic, setCurrentTopic] = useState(
    activeTask?.title || 'Derivatives & Chain Rule'
  );

  // Timer states
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Rating Modal state
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [understanding, setUnderstanding] = useState(3);
  const [mood, setMood] = useState(4);
  const [difficulty, setDifficulty] = useState(3);
  const [confidence, setConfidence] = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // AI Tutor chat states
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your QUESTORA study mentor for ${currentTopic}. Ready to break down tricky steps or quiz yourself whenever you like.`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
      setShowRatingModal(true);
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsLeft]);

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isAiReplying) return;

    const newMessages = [...messages, { role: 'user', content: chatInput }];
    setMessages(newMessages);
    setChatInput('');
    setIsAiReplying(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          topic: currentTopic,
          subject: currentSubject,
          language: preferredLanguage,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      console.error(e);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Let’s think about this: what is the fundamental rule or formula you are applying here?',
        },
      ]);
    } finally {
      setIsAiReplying(false);
    }
  };

  const handleSpeakText = async (text: string) => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play().catch(() => setIsPlayingAudio(false));
      } else {
        setIsPlayingAudio(false);
      }
    } catch (err) {
      console.error(err);
      setIsPlayingAudio(false);
    }
  };

  const handleCompleteSession = async () => {
    setSubmitting(true);
    const duration = Math.round((25 * 60 - secondsLeft) / 60) || 25;
    const result = await submitSessionFeedback({
      topic: currentTopic,
      subject: currentSubject,
      duration,
      understanding,
      mood,
      confidence,
      difficulty,
    });
    setAiResult(result);
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Session Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              SmartStudy AI Session
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Interactive Study Screen
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time focus monitoring, multi-turn AI tutoring, and adaptive understanding rating.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            Subject: <strong className="text-indigo-600 dark:text-indigo-400">{currentSubject}</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Timer & Study Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-3 border border-indigo-200 dark:border-indigo-800">
              Active Topic: {currentTopic}
            </div>

            {/* Circular Timer Visual */}
            <div className="my-6">
              <div className="w-56 h-56 mx-auto rounded-full border-4 border-indigo-500/20 flex flex-col items-center justify-center relative bg-gradient-to-b from-indigo-500/5 to-transparent">
                <Clock className="w-6 h-6 text-indigo-500 mb-1 animate-pulse" />
                <div className="text-5xl font-extrabold font-mono text-slate-900 dark:text-white tracking-wider">
                  {formatTimer(secondsLeft)}
                </div>
                <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-widest">
                  {isRunning ? 'Focus In Progress' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-all text-white ${
                  isRunning
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                {isRunning ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isRunning ? 'Pause Session' : 'Start Focus'}</span>
              </button>

              <button
                onClick={() => setShowRatingModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Complete Topic</span>
              </button>

              <button
                onClick={() => triggerReformatTopic(currentTopic, currentSubject)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span>Need Help? Reformat</span>
              </button>
            </div>
          </div>

          {/* Quick Learning Signals Info */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
            <strong className="text-slate-700 dark:text-slate-200">How SmartStudy AI works:</strong> When you hit &quot;Complete Topic&quot;, report your perceived understanding (1–5). Low ratings automatically reschedule a micro-revision and alert the Reformat Engine.
          </div>
        </div>

        {/* Right Col: AI Tutor Interactive Chat */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col h-[520px]">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                AI Tutor Chat ({preferredLanguage})
              </span>
            </div>
            <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-ping" />
              Online
            </span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      isAssistant
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                        : 'bg-indigo-600 text-white rounded-tr-none'
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-wrap">{m.content}</p>

                    {isAssistant && (
                      <button
                        onClick={() => handleSpeakText(m.content)}
                        className="mt-1.5 text-[10px] text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                        title="Read aloud with Gemini TTS"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isPlayingAudio ? 'Speaking...' : 'Listen'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {isAiReplying && (
              <div className="text-[11px] text-slate-400 animate-pulse">
                AI Tutor is thinking...
              </div>
            )}
          </div>

          {/* Chat input */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Ask in ${preferredLanguage}...`}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isAiReplying}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SmartStudy AI Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                How did your study session go?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Reported signals are used exclusively to adapt your spaced-repetition timetable.
              </p>
            </div>

            {aiResult ? (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Recommendation Generated</span>
                  </div>
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                    “{aiResult.recommendation}”
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-purple-600 dark:text-purple-400">
                    Next revision: {aiResult.scheduledRevision}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setShowRatingModal(false);
                      setAiResult(null);
                      setActiveView('quiz');
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs"
                  >
                    Take Topic Quiz
                  </button>
                  <button
                    onClick={() => {
                      setShowRatingModal(false);
                      setAiResult(null);
                      setActiveView('dashboard');
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs"
                  >
                    Done to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                {/* 1. Understanding */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Understanding of topic (1–5):</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{understanding} / 5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setUnderstanding(star)}
                        className={`p-2 rounded-lg flex-1 border text-center font-bold transition-all ${
                          understanding >= star
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-600 dark:text-amber-400'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        ⭐ {star}
                      </button>
                    ))}
                  </div>
                  {understanding <= 2 && (
                    <span className="text-[11px] text-rose-500 font-medium mt-1 block">
                      ⚠️ Low understanding triggers additional revision tomorrow.
                    </span>
                  )}
                </div>

                {/* 2. Difficulty */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>How difficult was this topic? (1–5):</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{difficulty} / 5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`p-2 rounded-lg flex-1 border text-center font-bold transition-all ${
                          difficulty === level
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Mood */}
                <div>
                  <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    <span>Study Mood / Energy (1–5):</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">{mood} / 5</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`p-2 rounded-lg flex-1 border text-center font-bold transition-all ${
                          mood === m
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {m === 1 ? '😴 1' : m === 3 ? '😐 3' : '⚡ 5'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 italic">
                  Note: Student-reported signals only. QUESTORA does not make medical emotion diagnoses.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowRatingModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteSession}
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
                  >
                    {submitting ? 'Adapting Plan...' : 'Save & Update Plan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
