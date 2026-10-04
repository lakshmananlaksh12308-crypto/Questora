import React, { useState, useEffect } from 'react';
import { VisualExplanation, CartoonCharacter } from '../types';
import { CartoonCharacterAvatar, CartoonMood } from './CartoonCharacterAvatar';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Zap,
  Volume2,
  VolumeX,
  X,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Layers,
  Award,
  Share2,
  RotateCcw,
  Loader2,
} from 'lucide-react';

interface VisualExplanationModalProps {
  initialTopic?: string;
  initialExcerpt?: string;
  subject?: string;
  onClose: () => void;
}

export const VisualExplanationModal: React.FC<VisualExplanationModalProps> = ({
  initialTopic = 'Instantaneous Rate of Change',
  initialExcerpt = '',
  subject = 'Coursework',
  onClose,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [selectedCharacter, setSelectedCharacter] = useState('Professor Paws');
  const [mood, setMood] = useState<CartoonMood>('excited');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const characterList: CartoonCharacter[] = [
    {
      id: 'paws',
      name: 'Professor Paws',
      role: 'Math & Logic Sensei',
      species: 'Cat',
      avatar: '🐱',
      badge: 'Logic Master',
      color: 'from-amber-500 to-orange-600',
      catchphrase: 'Paws and ponder: every curve has a secret slope!',
    },
    {
      id: 'spark',
      name: 'Dr. Spark',
      role: 'Quantum & Physics Bot',
      species: 'Robot',
      avatar: '⚡',
      badge: 'Circuit AI',
      color: 'from-cyan-500 to-blue-600',
      catchphrase: 'Beep boop! Electrons never guess, they follow field lines!',
    },
    {
      id: 'luna',
      name: 'Luna the Owl',
      role: 'Astrophysics & Deep Science',
      species: 'Owl',
      avatar: '🦉',
      badge: 'Cosmic Sage',
      color: 'from-purple-500 to-indigo-600',
      catchphrase: 'Look beyond the clouds to find first principles!',
    },
    {
      id: 'kit',
      name: 'Kit the Fox',
      role: 'Algorithms & Computer Science',
      species: 'Fox',
      avatar: '🦊',
      badge: 'Code Ninja',
      color: 'from-rose-500 to-orange-500',
      catchphrase: 'Optimize the path and balance the tree!',
    },
    {
      id: 'rex',
      name: 'Rex the Dino',
      role: 'Biology & Natural Systems',
      species: 'Dinosaur',
      avatar: '🦖',
      badge: 'Eco Scholar',
      color: 'from-emerald-500 to-teal-600',
      catchphrase: 'Life evolves one molecular adaptation at a time!',
    },
  ];

  const [explanation, setExplanation] = useState<VisualExplanation>({
    title: `Visual Breakdown: ${initialTopic || 'Core Principle'}`,
    summary:
      'Understanding this concept becomes effortless when you observe how input changes propagate through the system in real time.',
    topic: initialTopic || 'Core Principle',
    subject,
    diagramType: 'flowchart',
    diagramSvg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="100%" height="240" style="background:#0b1120; border-radius:16px;">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#818cf8;stop-opacity:1" />
        </linearGradient>
      </defs>
      <line x1="60" y1="40" x2="60" y2="200" stroke="#1e293b" stroke-width="2"/>
      <line x1="60" y1="200" x2="540" y2="200" stroke="#1e293b" stroke-width="2"/>
      <path d="M 80 190 Q 220 180, 320 110 T 520 40" fill="none" stroke="url(#grad1)" stroke-width="4"/>
      <circle cx="320" cy="110" r="7" fill="#fbbf24"/>
      <text x="75" y="30" fill="#f8fafc" font-family="sans-serif" font-weight="900" font-size="14">VISUAL MECHANISM: ${initialTopic}</text>
      <text x="335" y="115" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="12">Coordinate P(x, y)</text>
      <text x="180" y="225" fill="#94a3b8" font-family="sans-serif" font-size="11">Input (x) ──► Mechanism ──► Resulting Output</text>
    </svg>`,
    cartoonCharacter: {
      name: 'Professor Paws',
      avatar: '🐱',
      expression: 'excited',
      dialogue: `Meow! Let's slice right into ${initialTopic || 'this lesson'}! No fear, just pure visual fun!`,
      tip: 'Break the problem into small bite-sized steps: input, transformation, output!',
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: The Initial State',
        detail: 'Identify what you are given and the boundary conditions before any action takes place.',
        visualIcon: '🌱',
        formula: 'Baseline Input: x_0',
      },
      {
        stepNumber: 2,
        title: 'Step 2: The Core Transformation',
        detail: 'Apply the fundamental rule or formula to calculate the change as it progresses.',
        visualIcon: '⚡',
        formula: 'Transformation Rule: f(x) -> f\'(x)',
      },
      {
        stepNumber: 3,
        title: 'Step 3: The Resulting Verification',
        detail: 'Verify the solution with physical units or logical consistency.',
        visualIcon: '🎯',
        formula: 'Solved Output: 100% Verified',
      },
    ],
    realWorldAnalogy: 'Like watching a speedometer needle flicker right as you press the accelerator!',
    examTakeaway: 'Always remember: visual intuition unlocks formulas faster than brute memorization!',
  });

  const fetchVisualExplanation = async (targetTopic?: string, targetExcerpt?: string) => {
    setIsLoading(true);
    stopAudio();

    try {
      const res = await fetch('/api/visual/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic || topic,
          excerpt: targetExcerpt || excerpt,
          subject,
          cartoonCharacter: selectedCharacter,
        }),
      });

      const data = await res.json();
      if (data && data.steps) {
        setExplanation(data);
        setMood('excited');
        try {
          confetti({ particleCount: 40, spread: 60, origin: { y: 0.5 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Visual explanation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisualExplanation();
  }, []);

  const handleSpeak = async () => {
    if (isSpeaking) {
      stopAudio();
      return;
    }

    const speechText = `${explanation.cartoonCharacter.name} says: ${explanation.cartoonCharacter.dialogue}. Summary: ${explanation.summary}`;
    setIsSpeaking(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: speechText,
          speaker: selectedCharacter.includes('Paws') ? 'Puck' : 'Fenrir',
          style: 'Energetic Cartoon Voice',
        }),
      });
      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => setIsSpeaking(false);
        audio.play().catch(() => setIsSpeaking(false));
      } else {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.rate = 1.05;
          utterance.onend = () => setIsSpeaking(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeaking(false);
        }
      }
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex items-center justify-center animate-in fade-in">
      <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border-2 border-indigo-500/30 p-5 sm:p-7 shadow-2xl relative max-h-[92vh] overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Visual Explanation Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Cartoon Mentors & Diagram AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Turn any paragraph or coursework topic into animated visual diagrams and cartoon explanations.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Character Selector Bar */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Choose Cartoon Teacher:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {characterList.map((char) => (
              <button
                key={char.id}
                onClick={() => {
                  setSelectedCharacter(char.name);
                  fetchVisualExplanation(topic, excerpt);
                }}
                className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left ${
                  selectedCharacter.includes(char.species) || selectedCharacter === char.name
                    ? 'border-amber-400 bg-slate-800/90 shadow-lg shadow-amber-400/10 scale-[1.02]'
                    : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/60'
                }`}
              >
                <CartoonCharacterAvatar characterName={char.name} mood="cheering" size="sm" />
                <span className="font-black text-xs text-white mt-1">{char.name}</span>
                <span className="text-[10px] text-slate-400 truncate w-full">{char.role}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Search / Topic Adjuster */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchVisualExplanation(topic, excerpt)}
            placeholder="Enter topic or question to explain visually..."
            className="flex-1 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-xs sm:text-sm font-semibold text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => fetchVisualExplanation(topic, excerpt)}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-500 hover:from-indigo-500 hover:to-amber-400 text-white text-xs font-black shadow-md shadow-indigo-600/30 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Explaining...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Generate Visuals</span>
              </>
            )}
          </button>
        </div>

        {/* Main Content Area: Cartoon Mentor + SVG Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left 1 Col: Animated Cartoon Character Speech Card */}
          <div className="rounded-3xl bg-gradient-to-b from-slate-800 to-slate-900 border border-indigo-500/20 p-5 flex flex-col justify-between items-center text-center space-y-4 relative overflow-hidden">
            <div className="space-y-3 w-full flex flex-col items-center">
              <CartoonCharacterAvatar
                characterName={selectedCharacter}
                mood={mood}
                isSpeaking={isSpeaking}
                size="lg"
              />

              <div className="w-full">
                <span className="text-xs font-black text-amber-400 block">
                  {explanation.cartoonCharacter?.name || selectedCharacter}
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Cartoon Professor
                </span>
              </div>

              {/* Speech Balloon */}
              <div className="relative bg-white text-slate-900 p-4 rounded-2xl shadow-xl border-2 border-slate-900 text-xs font-extrabold leading-snug w-full">
                "{explanation.cartoonCharacter?.dialogue || 'Check out the visual diagram!'}"
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l-2 border-t-2 border-slate-900" />
              </div>
            </div>

            {/* Voice Narration Button */}
            <div className="w-full pt-2">
              <button
                onClick={handleSpeak}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black transition-all ${
                  isSpeaking
                    ? 'bg-amber-500 text-slate-950 animate-pulse shadow-lg'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Cartoon Voice</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Hear Cartoon Voice</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right 2 Cols: Diagram & Step Mechanism Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            {/* SVG Visual Diagram Card */}
            <div className="rounded-3xl bg-slate-950 border border-slate-800 p-4 overflow-hidden shadow-xl">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3 text-xs text-slate-400 font-bold">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Layers className="w-4 h-4" />
                  <span>Interactive Vector Diagram</span>
                </span>
                <span className="font-mono text-[10px] text-amber-400">
                  {explanation.topic}
                </span>
              </div>

              {/* Render SVG or dynamic diagram */}
              {explanation.diagramSvg ? (
                <div
                  className="w-full overflow-x-auto flex justify-center py-2"
                  dangerouslySetInnerHTML={{ __html: explanation.diagramSvg }}
                />
              ) : (
                <div className="h-48 flex items-center justify-center text-slate-500 font-mono text-xs">
                  Generating dynamic visual...
                </div>
              )}
            </div>

            {/* Step-by-Step Mechanisms */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {explanation.steps?.map((st) => (
                <div
                  key={st.stepNumber}
                  className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{st.visualIcon || '⚡'}</span>
                      <span className="text-[11px] font-black uppercase text-amber-400">
                        {st.title}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{st.detail}</p>
                  </div>
                  {st.formula && (
                    <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[10px] text-purple-300 font-bold">
                      {st.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Analogy & Exam Rule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1">
                <span className="text-[10px] uppercase font-black text-indigo-400 flex items-center gap-1">
                  <Lightbulb className="w-3 h-3" />
                  <span>Real World Analogy:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {explanation.realWorldAnalogy}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-1">
                <span className="text-[10px] uppercase font-black text-amber-400 flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  <span>Exam Golden Rule:</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {explanation.examTakeaway}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
