import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Bot,
  User,
  Send,
  Sparkles,
  Mic,
  MicOff,
  Volume2,
  Trash2,
  Cpu,
  Brain,
  Zap,
  CheckCircle2,
  Layers,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  modelUsed?: string;
  timestamp: string;
}

export const GeminiChatbotView: React.FC = () => {
  const { preferredLanguage, activeTask, topics } = useApp();

  const [role, setRole] = useState<'coach' | 'socratic' | 'rapid'>('coach');
  const [modelType, setModelType] = useState<'general' | 'complex' | 'fast'>('general');
  const [input, setInput] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: `Welcome to QUESTORA Multi-Turn Chat! I'm equipped with Gemini 3 models to adapt to your study goals:\n• **gemini-3.1-pro-preview** for complex STEM, calculus derivations & code.\n• **gemini-3.8-flash** for general study coaching.\n• **gemini-3.1-flash-lite** for lightning fast rapid checks.\n\nWhat would you like to master today?`,
      modelUsed: 'gemini-3.8-flash',
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isReplying]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isReplying) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: 'Just now',
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput('');
    setIsReplying(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map((m) => ({ role: m.role, content: m.content })),
          topic: activeTask?.title || 'Coursework Concept',
          subject: activeTask?.subject || 'Mathematics',
          language: preferredLanguage,
          role,
          modelType,
        }),
      });

      const data = await res.json();
      const botMessage: ChatMessage = {
        id: `b-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Let us explore that concept together.',
        modelUsed: data.modelUsed || (modelType === 'complex' ? 'gemini-3.1-pro-preview' : modelType === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'),
        timestamp: 'Just now',
      };

      setMessages([...updated, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages([
        ...updated,
        {
          id: `b-${Date.now()}`,
          role: 'assistant',
          content: 'I had trouble connecting. Let me know what step in your study materials feels tricky.',
          modelUsed: 'gemini-3.5-flash',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsReplying(false);
    }
  };

  // Text-To-Speech with gemini-3.8-flash-tts
  const handleTTS = async (id: string, text: string) => {
    if (playingId) return;
    setPlayingId(id);
    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`);
        audio.onended = () => setPlayingId(null);
        audio.play().catch(() => setPlayingId(null));
      } else {
        setPlayingId(null);
      }
    } catch (err) {
      console.error(err);
      setPlayingId(null);
    }
  };

  // Speech-To-Text transcription with gemini-3.5-transcribe
  const handleDictate = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Microphone access not available');
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        let recorder: MediaRecorder;
        let mime = 'audio/webm';
        try {
          recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        } catch {
          recorder = new MediaRecorder(stream);
          mime = 'audio/wav';
        }

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: mime });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64data, mimeType: mime }),
              });
              const data = await res.json();
              if (data.transcript) {
                setInput(data.transcript);
                handleSendMessage(data.transcript);
              }
            } catch (err) {
              console.error('Transcription error:', err);
            }
          };
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.error('Mic access error, falling back to sample:', err);
        const speech = 'How do I solve the chain rule when differentiating composite trigonometric functions?';
        setInput(speech);
        handleSendMessage(speech);
      }
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Gemini AI Study Chatbot
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Multi-Turn Dialogue
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose specialized chatbot roles and model reasoning tiers for any academic subject.
          </p>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'm-init',
                role: 'assistant',
                content: 'Chat history cleared. What topic shall we master now?',
                timestamp: 'Just now',
              },
            ])
          }
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Clear Thread</span>
        </button>
      </div>

      {/* Role & Model Control Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Chatbot Role Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>Chatbot System Persona</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'coach', label: 'Study Coach', icon: Brain },
                { id: 'socratic', label: 'Socratic STEM', icon: Cpu },
                { id: 'rapid', label: 'Exam Drill', icon: Zap },
              ].map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.id}
                    onClick={() => setRole(r.id as any)}
                    className={`py-1.5 px-2 rounded-xl border flex items-center justify-center gap-1 text-[11px] font-semibold transition-all ${
                      role === r.id
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{r.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-purple-500" />
              <span>Gemini Model Tier</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'complex', label: 'Pro (Complex)', desc: 'gemini-3.1-pro-preview' },
                { id: 'general', label: 'Flash (General)', desc: 'gemini-3.5-flash' },
                { id: 'fast', label: 'Lite (Fast)', desc: 'gemini-3.1-flash-lite' },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModelType(m.id as any)}
                  className={`py-1.5 px-2 rounded-xl border text-center text-[11px] font-semibold transition-all ${
                    modelType === m.id
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                  title={m.desc}
                >
                  <div>{m.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 sm:p-6 flex flex-col h-[560px]">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m) => {
            const isBot = m.role === 'assistant';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isBot
                      ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-slate-800 text-cyan-400'
                  }`}
                >
                  {isBot ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-1.5 max-w-[82%] ${isBot ? '' : 'text-right'}`}>
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isBot
                        ? 'bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/80 dark:border-slate-700/60'
                        : 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                    }`}
                  >
                    {m.content}
                  </div>

                  {/* Metadata and actions */}
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 px-1">
                    {m.modelUsed && (
                      <span className="font-mono bg-purple-500/10 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 rounded font-semibold">
                        {m.modelUsed}
                      </span>
                    )}

                    {isBot && (
                      <button
                        onClick={() => handleTTS(m.id, m.content)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                        title="Read aloud with Gemini 3.8 Flash TTS"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{playingId === m.id ? 'Speaking...' : 'Listen'}</span>
                      </button>
                    )}

                    <span>{m.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}

          {isReplying && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-500">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping inline-block" />
                <span>
                  {modelType === 'complex'
                    ? 'Gemini 3.1 Pro is performing rigorous academic deduction...'
                    : 'Gemini is composing response...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          {/* Audio dictation button */}
          <button
            onClick={handleDictate}
            className={`p-2.5 rounded-xl border transition-all ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600'
            }`}
            title="Transcribe speech with Gemini 3.5 Transcribe"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Ask question or prompt in ${preferredLanguage}...`}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isReplying || !input.trim()}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
