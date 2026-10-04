import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  Sparkles,
  Radio,
  Send,
  Brain,
} from 'lucide-react';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({ isOpen, onClose }) => {
  const { preferredLanguage, activeTask } = useApp();

  const [isConnected, setIsConnected] = useState(false);
  const [isTalking, setIsTalking] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<
    { sender: 'user' | 'ai'; text: string }[]
  >([
    {
      sender: 'ai',
      text: `Hello! I'm your QUESTORA Live Voice Mentor. Ask me any question aloud or say "Explain the Chain Rule" to get started!`,
    },
  ]);
  const [typedInput, setTypedInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!isOpen) {
      if (socketRef.current) {
        socketRef.current.close();
      }
      setIsConnected(false);
      return;
    }

    // Try WebSocket connection to /api/live
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/live`;

    try {
      const ws = new WebSocket(wsUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        ws.send(JSON.stringify({ ping: true }));
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio) {
            // Audio response received from Gemini Live API
            setIsTalking(true);
            setTimeout(() => setIsTalking(false), 2000);
          }
        } catch (e) {
          // ignore
        }
      };

      ws.onerror = () => {
        setIsConnected(true); // Fallback to REST TTS voice
      };

      ws.onclose = () => {
        setIsConnected(false);
      };
    } catch (e) {
      setIsConnected(true);
    }

    return () => {
      if (socketRef.current) socketRef.current.close();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSendVoiceQuery = async (queryText?: string) => {
    const text = queryText || typedInput;
    if (!text.trim() || isProcessing) return;

    setTranscriptHistory((prev) => [...prev, { sender: 'user', text }]);
    setTypedInput('');
    setIsProcessing(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: text }],
          topic: activeTask?.title || 'General Studies',
          subject: activeTask?.subject || 'Mathematics',
          language: preferredLanguage,
        }),
      });

      const data = await res.json();
      const reply = data.reply || 'Understood! Let us break it down intuitively.';
      setTranscriptHistory((prev) => [...prev, { sender: 'ai', text: reply }]);

      // Speak reply aloud with Gemini 3.8 Flash TTS
      const ttsRes = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: reply }),
      });
      const ttsData = await ttsRes.json();
      if (ttsData.audioData) {
        setIsTalking(true);
        const audio = new Audio(`data:${ttsData.mimeType || 'audio/wav'};base64,${ttsData.audioData}`);
        audio.onended = () => setIsTalking(false);
        audio.play().catch(() => setIsTalking(false));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-slate-700/80 p-6 shadow-2xl text-white space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                Gemini 3.8 Live Voice Assistant
              </h3>
              <p className="text-[11px] text-slate-400">
                Real-time vocal conversation ({preferredLanguage})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Animated Sound Wave Visualizer */}
        <div className="py-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center justify-center gap-1.5 h-16">
            {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-gradient-to-t from-cyan-500 to-indigo-500 transition-all duration-150"
                style={{
                  height: isTalking ? `${h}%` : '15%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          <div className="text-center">
            <span className="text-xs font-mono text-cyan-300">
              {isTalking
                ? 'Gemini Live is speaking...'
                : isProcessing
                ? 'Synthesizing voice response...'
                : 'Listening... (Speak or click below)'}
            </span>
          </div>
        </div>

        {/* Quick Voice Prompts */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {[
            'Explain the Chain Rule in Tanglish',
            'Give me a 30s quiz on Calculus',
            'Why does Faraday\'s Law have a negative sign?',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendVoiceQuery(prompt)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            >
              🗣️ {prompt}
            </button>
          ))}
        </div>

        {/* Scrollable Conversation History */}
        <div className="h-44 overflow-y-auto space-y-2 p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs">
          {transcriptHistory.map((item, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl ${
                item.sender === 'ai'
                  ? 'bg-slate-800/80 text-indigo-200 border border-slate-700/60'
                  : 'bg-indigo-600/30 text-white border border-indigo-500/40 text-right'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 mb-0.5 uppercase">
                {item.sender === 'ai' ? 'Gemini Live Coach' : 'You'}
              </div>
              <p className="leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="flex gap-2">
          <input
            type="text"
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceQuery()}
            placeholder="Type voice query or question..."
            className="flex-1 rounded-xl border border-slate-700 bg-slate-800 p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />

          <button
            onClick={() => handleSendVoiceQuery()}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
