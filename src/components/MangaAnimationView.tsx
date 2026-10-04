import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MangaEpisode, MangaPanel, CartoonCharacter } from '../types';
import { CartoonCharacterAvatar, CartoonMood } from './CartoonCharacterAvatar';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Zap,
  Flame,
  Award,
  Share2,
  Download,
  Film,
  Layers,
  Swords,
  Maximize2,
  Tv,
  RefreshCw,
  Loader2,
  CheckCircle2,
  Upload,
  User,
  MessageSquare,
} from 'lucide-react';

interface MangaAnimationViewProps {
  initialTopic?: string;
  initialContent?: string;
  onClose?: () => void;
}

export const MangaAnimationView: React.FC<MangaAnimationViewProps> = ({
  initialTopic,
  initialContent,
  onClose,
}) => {
  const { preferredLanguage, activeTask } = useApp();

  const [topicInput, setTopicInput] = useState(
    initialTopic || activeTask?.title || 'Derivatives & Instantaneous Velocity'
  );
  const [subjectInput, setSubjectInput] = useState(
    activeTask?.subject || 'Mathematics'
  );
  const [contentInput, setContentInput] = useState(initialContent || '');
  const [selectedHero, setSelectedHero] = useState('Professor Paws');
  const [isLoading, setIsLoading] = useState(false);
  const [activePanelIndex, setActivePanelIndex] = useState(0);
  const [isPlayingAuto, setIsPlayingAuto] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [theaterMode, setTheaterMode] = useState(true);
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cartoonHeroes: CartoonCharacter[] = [
    {
      id: 'paws',
      name: 'Professor Paws',
      role: 'Math & Calculus Sensei',
      species: 'Cat',
      avatar: '🐱',
      badge: 'Logic Master',
      color: 'from-amber-500 to-orange-600',
      catchphrase: 'Paws and solve with precision!',
    },
    {
      id: 'spark',
      name: 'Dr. Spark',
      role: 'Physics & Circuit Robot',
      species: 'Robot',
      avatar: '⚡',
      badge: 'Quantum AI',
      color: 'from-cyan-500 to-blue-600',
      catchphrase: 'Overclock your brain cells!',
    },
    {
      id: 'luna',
      name: 'Luna the Owl',
      role: 'Cosmic & Deep Science',
      species: 'Owl',
      avatar: '🦉',
      badge: 'Star Sage',
      color: 'from-purple-500 to-indigo-600',
      catchphrase: 'Hoot! The truth is in the stars!',
    },
    {
      id: 'kit',
      name: 'Kit the Fox',
      role: 'Algorithms & Code Ninja',
      species: 'Fox',
      avatar: '🦊',
      badge: 'Algorithm Prodigy',
      color: 'from-rose-500 to-orange-500',
      catchphrase: 'Slice through time complexity!',
    },
    {
      id: 'rex',
      name: 'Rex the Dino',
      role: 'Bio & Earth Science',
      species: 'Dinosaur',
      avatar: '🦖',
      badge: 'Eco Explorer',
      color: 'from-emerald-500 to-teal-600',
      catchphrase: 'Stomp through any tough exam!',
    },
  ];

  // Initial Episode with Cartoon Heroes
  const [episode, setEpisode] = useState<MangaEpisode>({
    title: 'EPISODE 1: The Instantaneous Pounce!',
    subtitle: 'Awakening the Calculus Claws',
    conceptTitle: 'Derivatives & Instantaneous Rate of Change',
    subject: 'Mathematics',
    characters: [
      { name: 'Professor Paws', role: 'Grand Master Cat Mathematician', avatar: '🐱' },
      { name: 'Dr. Spark', role: 'Determined Apprentice Bot', avatar: '⚡' },
      { name: 'Luna the Owl', role: 'Cosmic Exam Judge', avatar: '🦉' },
    ],
    panels: [
      {
        panelNumber: 1,
        character: 'Professor Paws 🐱',
        avatar: '🐱',
        dialogue:
          'Meow! Listen closely, Dr. Spark! Average velocity is the shield of slowpokes. When catching a laser dot, you need the DERIVATIVE at the exact millisecond of impact!',
        narration:
          'Average speed across two hours is simply total distance over time. But the instantaneous rate isolates what occurs at a single point in time.',
        sfx: 'ドドド (DODODO)',
        visualAction: 'Professor Paws adjusts his scholar glasses and slices a parabolic curve in mid-air with golden glowing speed lines.',
        visualEffect: 'speed_lines',
        formula: 'v(t) = ds / dt',
        bgTheme: 'fire',
      },
      {
        panelNumber: 2,
        character: 'Dr. Spark ⚡',
        avatar: '⚡',
        dialogue:
          'BEEP BOOP?! If the delta interval h approaches zero, does that mean the secant line transforms into the TRUE TANGENT SLOPE?!',
        narration:
          'As the delta interval shrinks toward zero, the approximation gap collapses, revealing the exact geometric slope of the tangent.',
        sfx: 'ゴゴゴ (GOGOGO)',
        visualAction: 'Dr. Spark’s antenna flashes bright cyan as glowing mathematical limits calculate in his memory matrix.',
        visualEffect: 'lightning',
        formula: "f'(x) = lim_{h→0} [f(x+h) - f(x)] / h",
        bgTheme: 'electric',
      },
      {
        panelNumber: 3,
        character: 'Professor Paws 🐱',
        avatar: '🐱',
        dialogue:
          'BEHOLD! THE SECRET POWER RULE! Power Rule, Product Rule, and Chain Rule will slice through any calculus exam problem!',
        narration:
          'Differentiation allows engineers to calculate maximum acceleration, economists to find marginal profit, and scientists to measure decay.',
        sfx: 'バァン (BAAAN!)',
        visualAction: 'A cartoon supernova of calculus formulas illuminates the entire blackboard with pure clarity.',
        visualEffect: 'impact_flash',
        formula: 'd/dx [x^n] = n · x^(n-1)',
        bgTheme: 'aurora',
      },
      {
        panelNumber: 4,
        character: 'Dr. Spark ⚡',
        avatar: '✨',
        dialogue:
          'CIRCUITS OVERCHARGED WITH 100% EXAM MASTERY! MY ACADEMIC POWER LEVEL IS OVER NINE THOUSAND!',
        narration:
          'Concept Conquered: Never fear complex functions. Break them into composite layers and apply the rules step-by-step.',
        sfx: 'SHING! ✨',
        visualAction: 'Dr. Spark and Professor Paws high-five in victory with an S-Rank certificate glowing in the background.',
        visualEffect: 'focus_zoom',
        formula: 'MASTERY UNLOCKED: S-RANK SCHOLAR',
        bgTheme: 'void',
      },
    ],
    takeaway:
      'The derivative is the exact instantaneous rate of change at one isolated instant: anchor to the limit definition and conquer!',
  });

  const samplePresets = [
    {
      topic: 'Derivatives & Instantaneous Velocity',
      subject: 'Mathematics',
      hero: 'Professor Paws',
    },
    {
      topic: 'Quantum Photoelectric Effect',
      subject: 'Physics',
      hero: 'Dr. Spark',
    },
    {
      topic: 'Binary Search Tree Rotations',
      subject: 'Computer Science',
      hero: 'Kit the Fox',
    },
    {
      topic: 'Faraday’s Law & Magnetic Flux',
      subject: 'Physics',
      hero: 'Luna the Owl',
    },
    {
      topic: 'DNA Polymerase Replication Fork',
      subject: 'Biology',
      hero: 'Rex the Dino',
    },
  ];

  // Dynamic Cartoon Canvas Effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const currentPanel = episode.panels[activePanelIndex] || episode.panels[0];
    const effect = currentPanel?.visualEffect || 'speed_lines';

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 640;
      canvas.height = canvas.parentElement?.clientHeight || 420;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const w = canvas.width;
      const h = canvas.height;
      const cx = w / 2;
      const cy = h / 2;

      if (effect === 'speed_lines') {
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 1.5;
        const lineCount = 36;
        for (let i = 0; i < lineCount; i++) {
          const angle = (i / lineCount) * Math.PI * 2 + (frame * 0.015);
          const r1 = 90 + Math.sin(frame * 0.1 + i) * 20;
          const r2 = Math.max(w, h);
          ctx.beginPath();
          ctx.moveTo(cx + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
          ctx.lineTo(cx + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
          ctx.stroke();
        }
        ctx.restore();
      } else if (effect === 'lightning') {
        ctx.save();
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        if (frame % 8 < 5) {
          for (let b = 0; b < 4; b++) {
            let lx = (b * w) / 4 + Math.sin(frame) * 40;
            let ly = 0;
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            while (ly < h) {
              lx += (Math.random() - 0.5) * 45;
              ly += 25 + Math.random() * 20;
              ctx.lineTo(lx, ly);
            }
            ctx.stroke();
          }
        }
        ctx.restore();
      } else if (effect === 'impact_flash') {
        ctx.save();
        const maxR = Math.max(w, h) * 0.7;
        const ring = (frame * 6) % maxR;
        const alpha = Math.max(0, 1 - ring / maxR) * 0.4;
        ctx.strokeStyle = `rgba(244, 63, 94, ${alpha})`;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(cx, cy, ring, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.8})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, (ring + 40) % maxR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      } else {
        ctx.save();
        for (let p = 0; p < 25; p++) {
          const px = (Math.sin(p * 99 + frame * 0.02) * 0.5 + 0.5) * w;
          const py = (Math.cos(p * 33 + frame * 0.03) * 0.5 + 0.5) * h;
          const pr = 2 + (p % 3) * 1.5;
          ctx.fillStyle = p % 2 === 0 ? 'rgba(168, 85, 247, 0.45)' : 'rgba(56, 189, 248, 0.45)';
          ctx.beginPath();
          ctx.arc(px, py, pr, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [activePanelIndex, episode]);

  // Autoplay handler
  useEffect(() => {
    if (isPlayingAuto) {
      autoPlayTimerRef.current = setTimeout(() => {
        setActivePanelIndex((prev) => {
          if (prev < episode.panels.length - 1) {
            return prev + 1;
          } else {
            setIsPlayingAuto(false);
            try {
              confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
            } catch (e) {}
            return 0;
          }
        });
      }, 5500);
    } else {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    }

    return () => {
      if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    };
  }, [isPlayingAuto, activePanelIndex, episode.panels.length]);

  // Handle uploaded note file
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    setTopicInput(fileName);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = (event.target?.result as string) || '';
      setContentInput(text);
      setUploadFeedback(`Uploaded ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      handleGenerateEpisode(fileName, subjectInput, text);
    };
    reader.readAsText(file);
  };

  // Generate new episode from prompt
  const handleGenerateEpisode = async (customTopic?: string, customSub?: string, customContent?: string) => {
    const targetTopic = customTopic || topicInput;
    const targetSub = customSub || subjectInput;
    const targetContent = customContent !== undefined ? customContent : contentInput;
    if (!targetTopic.trim() || isLoading) return;

    setIsLoading(true);
    setIsPlayingAuto(false);
    stopAudio();

    try {
      const res = await fetch('/api/manga/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: targetTopic,
          subject: targetSub,
          textContent: targetContent,
          style: 'cartoon',
        }),
      });

      const data = await res.json();
      if (data && data.panels && data.panels.length > 0) {
        setEpisode(data);
        setActivePanelIndex(0);
        try {
          confetti({ particleCount: 50, spread: 70, origin: { y: 0.5 } });
        } catch (e) {}
      }
    } catch (err) {
      console.error('Cartoon generation failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-Speech for current panel
  const handleSpeakPanel = async () => {
    if (isSpeakingAudio) {
      stopAudio();
      return;
    }

    const currentPanel = episode.panels[activePanelIndex];
    if (!currentPanel) return;

    const speechText = `${currentPanel.character} yells: ${currentPanel.dialogue}. Explanation: ${currentPanel.narration}`;
    setIsSpeakingAudio(true);

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: speechText,
          speaker: currentPanel.character.includes('Paws') ? 'Puck' : 'Fenrir',
          style: 'Dramatic Cartoon Anime Voice',
        }),
      });

      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`);
        audioRef.current = audio;
        audio.onended = () => setIsSpeakingAudio(false);
        audio.play().catch(() => setIsSpeakingAudio(false));
      } else {
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(speechText);
          utterance.rate = 1.1;
          utterance.onend = () => setIsSpeakingAudio(false);
          utterance.onerror = () => setIsSpeakingAudio(false);
          window.speechSynthesis.speak(utterance);
        } else {
          setIsSpeakingAudio(false);
        }
      }
    } catch (e) {
      console.error(e);
      setIsSpeakingAudio(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeakingAudio(false);
  };

  const currentPanel = episode.panels[activePanelIndex] || episode.panels[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-amber-500 text-white shadow-md">
                <Swords className="w-5 h-5" />
              </span>
              <span>Cartoon & Manga Animation Studio</span>
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
              Animated Characters
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Transform uploaded textbooks, notes, and STEM lessons into animated cartoon episodes with voice acting.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition-colors"
            >
              Back to Reader
            </button>
          )}

          <button
            onClick={() => setTheaterMode(!theaterMode)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
          >
            {theaterMode ? <Layers className="w-3.5 h-3.5" /> : <Tv className="w-3.5 h-3.5" />}
            <span>{theaterMode ? 'Storyboard Grid' : 'Cinema Mode'}</span>
          </button>
        </div>
      </div>

      {/* Cartoon Character Selection Bar */}
      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
          Select Animated Cartoon Mentor:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {cartoonHeroes.map((hero) => (
            <button
              key={hero.id}
              onClick={() => {
                setSelectedHero(hero.name);
                handleGenerateEpisode(topicInput, subjectInput);
              }}
              className={`p-3 rounded-2xl border text-left transition-all flex flex-col items-center sm:items-start text-center sm:text-left ${
                selectedHero.includes(hero.species) || selectedHero === hero.name
                  ? 'border-amber-400 bg-amber-500/10 dark:bg-slate-800 shadow-md shadow-amber-400/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300'
              }`}
            >
              <CartoonCharacterAvatar characterName={hero.name} mood="cheering" size="sm" />
              <span className="font-black text-xs text-slate-900 dark:text-white mt-1">
                {hero.name}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full">
                {hero.role}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Topic & Document Upload Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <Sparkles className="w-4 h-4 text-purple-500 shrink-0" />
            <input
              type="text"
              value={topicInput}
              onChange={(e) => setTopicInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateEpisode()}
              placeholder="Enter any topic or paste concept (e.g. Calculus Derivatives, Newton's Laws)..."
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          {/* Quick File Upload Button */}
          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold cursor-pointer transition-colors shrink-0">
            <Upload className="w-3.5 h-3.5 text-indigo-500" />
            <span>Upload Notes</span>
            <input
              type="file"
              accept=".txt,.md,.pdf,.json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <div className="w-full sm:w-36 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={subjectInput}
              onChange={(e) => setSubjectInput(e.target.value)}
              placeholder="Subject"
              className="w-full bg-transparent text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <button
            onClick={() => handleGenerateEpisode()}
            disabled={isLoading || !topicInput.trim()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-rose-600/25 active:scale-95 transition-all whitespace-nowrap"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Animating...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>Animate Cartoon Episode</span>
              </>
            )}
          </button>
        </div>

        {uploadFeedback && (
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{uploadFeedback}</span>
          </div>
        )}

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0 mr-1">
            Presets:
          </span>
          {samplePresets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setTopicInput(preset.topic);
                setSubjectInput(preset.subject);
                setSelectedHero(preset.hero);
                handleGenerateEpisode(preset.topic, preset.subject);
              }}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 bg-slate-100/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 text-[11px] font-medium whitespace-nowrap transition-colors"
            >
              {preset.topic}
            </button>
          ))}
        </div>
      </div>

      {/* Main Theater View */}
      {theaterMode ? (
        <div className="space-y-4">
          {/* Cinema Frame */}
          <div className="relative rounded-3xl overflow-hidden border-2 border-slate-800 bg-slate-950 shadow-2xl min-h-[480px] flex flex-col justify-between">
            {/* Background Canvas for Motion Effects */}
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />

            {/* Gradient Theme Backdrop */}
            <div
              className={`absolute inset-0 opacity-40 transition-colors duration-700 ${
                currentPanel.bgTheme === 'fire'
                  ? 'bg-gradient-to-tr from-rose-950 via-orange-950 to-slate-950'
                  : currentPanel.bgTheme === 'electric'
                  ? 'bg-gradient-to-tr from-cyan-950 via-blue-950 to-slate-950'
                  : currentPanel.bgTheme === 'aurora'
                  ? 'bg-gradient-to-tr from-emerald-950 via-teal-950 to-slate-950'
                  : 'bg-gradient-to-tr from-purple-950 via-slate-900 to-slate-950'
              }`}
            />

            {/* Top Info Bar */}
            <div className="relative z-20 flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-slate-950/60 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <CartoonCharacterAvatar
                  characterName={currentPanel.character || selectedHero}
                  mood="excited"
                  isSpeaking={isSpeakingAudio}
                  size="sm"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-rose-500 text-white tracking-widest">
                      PANEL {currentPanel.panelNumber} / {episode.panels.length}
                    </span>
                    <span className="text-xs font-bold text-amber-400">
                      {currentPanel.character}
                    </span>
                  </div>
                  <h3 className="text-sm sm:text-base font-black text-white mt-0.5">
                    {episode.title}
                  </h3>
                </div>
              </div>

              {/* Japanese/Cartoon SFX badge */}
              <div className="px-3 py-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-center animate-pulse">
                <span className="text-xs sm:text-sm font-black text-amber-300 tracking-wider">
                  {currentPanel.sfx}
                </span>
              </div>
            </div>

            {/* Center Animated Cartoon Action Area */}
            <div className="relative z-20 flex-1 p-6 sm:p-8 flex flex-col justify-center items-center text-center max-w-3xl mx-auto space-y-6">
              {/* Formula / Concept Pill */}
              {currentPanel.formula && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-amber-400/20 border-2 border-amber-400/40 text-amber-200 text-xs sm:text-sm font-mono font-black shadow-lg">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>{currentPanel.formula}</span>
                </div>
              )}

              {/* Cartoon Character Center Stage */}
              <div className="flex items-center justify-center gap-6">
                <CartoonCharacterAvatar
                  characterName={currentPanel.character || selectedHero}
                  mood={
                    currentPanel.panelNumber === 4
                      ? 'cheering'
                      : currentPanel.panelNumber === 3
                      ? 'mindblown'
                      : 'excited'
                  }
                  isSpeaking={isSpeakingAudio}
                  size="lg"
                  className="animate-bounce"
                />
              </div>

              {/* Cartoon Character Speech Balloon */}
              <div className="relative bg-white text-slate-950 p-5 sm:p-6 rounded-3xl shadow-2xl border-4 border-slate-900 max-w-2xl transform hover:scale-[1.01] transition-transform">
                <div className="text-sm sm:text-base md:text-lg font-black leading-snug tracking-tight">
                  "{currentPanel.dialogue}"
                </div>
                {/* Speech Bubble Pointer */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 border-l-4 border-t-4 border-slate-900" />
              </div>

              {/* Educational Narration Box */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/15 backdrop-blur-md text-xs sm:text-sm text-slate-200 text-left max-w-2xl space-y-1 shadow-xl">
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider block">
                  📖 Academic Principle & Proof:
                </span>
                <p className="leading-relaxed">{currentPanel.narration}</p>
              </div>

              {/* Visual Action Description */}
              <div className="text-[11px] font-mono text-slate-400 max-w-xl italic">
                Scene: {currentPanel.visualAction}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
              {/* Play / Next / Prev Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setActivePanelIndex((prev) => Math.max(0, prev - 1))
                  }
                  disabled={activePanelIndex === 0}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold transition-all"
                  title="Previous Panel"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlayingAuto(!isPlayingAuto)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                    isPlayingAuto
                      ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                  }`}
                >
                  {isPlayingAuto ? (
                    <>
                      <Pause className="w-4 h-4" />
                      <span>Pause Autoplay</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Autoplay Cartoon</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() =>
                    setActivePanelIndex((prev) =>
                      Math.min(episode.panels.length - 1, prev + 1)
                    )
                  }
                  disabled={activePanelIndex === episode.panels.length - 1}
                  className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white font-bold transition-all"
                  title="Next Panel"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Panel Dots */}
              <div className="flex items-center gap-1.5">
                {episode.panels.map((_p: MangaPanel, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setActivePanelIndex(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      activePanelIndex === idx
                        ? 'w-8 bg-amber-400 shadow-md shadow-amber-400/50'
                        : 'w-2.5 bg-white/30 hover:bg-white/50'
                    }`}
                    title={`Panel ${idx + 1}`}
                  />
                ))}
              </div>

              {/* TTS Audio Voice Narrator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSpeakPanel}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSpeakingAudio
                      ? 'bg-amber-500 text-slate-950 font-black animate-pulse'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {isSpeakingAudio ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Stop Voice</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Cartoon Voice Actor</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Storyboard 4-Panel Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {episode.panels.map((panel: MangaPanel, idx: number) => (
            <div
              key={idx}
              onClick={() => {
                setActivePanelIndex(idx);
                setTheaterMode(true);
              }}
              className={`rounded-3xl p-5 border-2 transition-all cursor-pointer group hover:-translate-y-1 ${
                activePanelIndex === idx
                  ? 'border-amber-400 bg-slate-900 shadow-xl shadow-amber-500/15'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500/50'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CartoonCharacterAvatar
                    characterName={panel.character}
                    mood="teaching"
                    size="sm"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase text-rose-500">
                      PANEL {panel.panelNumber}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {panel.character}
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-mono font-black text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full">
                  {panel.sfx}
                </span>
              </div>

              <div className="py-4 space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 font-extrabold text-xs text-slate-900 dark:text-white leading-relaxed">
                  "{panel.dialogue}"
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {panel.narration}
                </p>

                {panel.formula && (
                  <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 font-mono text-[11px] font-bold text-purple-600 dark:text-purple-300">
                    {panel.formula}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Effect: {panel.visualEffect}</span>
                <span className="font-bold text-indigo-500 group-hover:underline">
                  Launch in Cinema →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Episode Exam Takeaway Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/30 flex items-start sm:items-center gap-3.5">
        <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shrink-0 shadow-md">
          <Award className="w-6 h-6" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[10px] uppercase font-black tracking-wider text-amber-600 dark:text-amber-400">
            Cartoon Scholar Exam Takeaway:
          </span>
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">
            {episode.takeaway}
          </p>
        </div>
      </div>
    </div>
  );
};
