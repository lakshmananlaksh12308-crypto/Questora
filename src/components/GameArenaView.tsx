import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Upload,
  FileText,
  Sparkles,
  Trophy,
  Flame,
  Swords,
  Timer,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Shield,
  Zap,
  Star,
  Layers,
  Award,
  BookOpen,
  Volume2,
} from 'lucide-react';
import { PolymathPipelineGame } from './PolymathPipelineGame';

interface MatchingPair {
  id: string;
  term: string;
  definition: string;
}

interface BossQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  damage: number;
}

interface SpeedCard {
  id: string;
  statement: string;
  isTrue: boolean;
  explanation: string;
}

interface ScrambleWord {
  id: string;
  word: string;
  hint: string;
}

interface GamePack {
  gameTitle: string;
  bossName: string;
  bossHealth: number;
  matchingPairs: MatchingPair[];
  bossQuestions: BossQuestion[];
  speedCards: SpeedCard[];
  scrambleWords: ScrambleWord[];
}

export const GameArenaView: React.FC = () => {
  const { user, completeTask, topics } = useApp();

  // Upload & Insert Input States
  const [inputMode, setInputMode] = useState<'upload' | 'insert' | 'presets'>('presets');
  const [insertedText, setInsertedText] = useState('');
  const [topicName, setTopicName] = useState('Calculus & Derivatives');
  const [subjectName, setSubjectName] = useState('Mathematics');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Game Mode: 'pipeline' | 'match' | 'boss' | 'swipe' | 'scramble'
  const [activeGame, setActiveGame] = useState<'pipeline' | 'match' | 'boss' | 'swipe' | 'scramble'>('pipeline');

  // Loaded Game Pack State
  const [gamePack, setGamePack] = useState<GamePack>({
    gameTitle: 'Calculus Titan: Derivative Arena',
    bossName: 'The Entropy Dragon',
    bossHealth: 100,
    matchingPairs: [
      { id: 'm1', term: 'Derivative', definition: 'Instantaneous rate of change of a curve at a single point' },
      { id: 'm2', term: 'Integral', definition: 'Accumulated total area under a continuous curve' },
      { id: 'm3', term: 'Tangent Line', definition: 'Straight line that touches a curve at exactly one coordinate' },
      { id: 'm4', term: 'Limit', definition: 'The value a function approaches as input nears a specific value' },
      { id: 'm5', term: 'Chain Rule', definition: 'Formula to differentiate composite functions f(g(x))' },
      { id: 'm6', term: 'Second Derivative', definition: 'Measures the concavity and acceleration of a curve' },
    ],
    bossQuestions: [
      {
        id: 1,
        question: 'What is the derivative of x^3 with respect to x?',
        options: ['3x^2', '2x^3', '3x', 'x^2 / 3'],
        correctIndex: 0,
        explanation: 'By the power rule: d/dx[x^n] = n*x^(n-1), so d/dx[x^3] = 3x^2.',
        damage: 25,
      },
      {
        id: 2,
        question: 'When the derivative f\'(x) is zero on a smooth curve, what does it indicate?',
        options: ['Vertical asymptote', 'Critical point (local peak or valley)', 'Discontinuity', 'Infinite slope'],
        correctIndex: 1,
        explanation: 'f\'(x) = 0 indicates a horizontal tangent, meaning a local maximum, minimum, or saddle point.',
        damage: 25,
      },
      {
        id: 3,
        question: 'What does the Chain Rule compute?',
        options: ['Sum of matrices', 'Derivative of nested composite functions', 'Area under a circle', 'Mean average'],
        correctIndex: 1,
        explanation: '[f(g(x))]\' = f\'(g(x)) * g\'(x).',
        damage: 25,
      },
      {
        id: 4,
        question: 'If position s(t) is given over time, what is its first derivative with respect to time?',
        options: ['Acceleration', 'Instantaneous Velocity', 'Force', 'Momentum'],
        correctIndex: 1,
        explanation: 'Instantaneous velocity is ds/dt, the rate of change of position over time.',
        damage: 25,
      },
      {
        id: 5,
        question: 'What is the derivative of sin(x)?',
        options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
        correctIndex: 0,
        explanation: 'd/dx[sin(x)] = cos(x).',
        damage: 25,
      },
    ],
    speedCards: [
      { id: 'c1', statement: 'The derivative of any constant number is always zero.', isTrue: true, explanation: 'Constants do not change, so their rate of change is 0.' },
      { id: 'c2', statement: 'Integration and differentiation are inverse mathematical operations.', isTrue: true, explanation: 'By the Fundamental Theorem of Calculus, they reverse each other.' },
      { id: 'c3', statement: 'A sharp corner on a graph is always differentiable.', isTrue: false, explanation: 'Sharp cusps have conflicting left and right limits, so no tangent line exists.' },
      { id: 'c4', statement: 'The derivative of e^x is e^x itself.', isTrue: true, explanation: 'The natural exponential function is equal to its own derivative.' },
      { id: 'c5', statement: 'If a function is continuous, it must always be differentiable.', isTrue: false, explanation: 'Functions like f(x) = |x| are continuous everywhere, but not differentiable at x=0.' },
    ],
    scrambleWords: [
      { id: 's1', word: 'DERIVATIVE', hint: 'Instantaneous rate of change' },
      { id: 's2', word: 'INTEGRAL', hint: 'Area under a curve' },
      { id: 's3', word: 'TANGENT', hint: 'Line touching a curve at one coordinate' },
      { id: 's4', word: 'CALCULUS', hint: 'Mathematics of continuous change' },
    ],
  });

  // GAME 1: SPEED MATCH STATE
  interface MatchCardItem {
    cardId: string;
    pairId: string;
    text: string;
    type: 'term' | 'def';
  }
  const [matchCards, setMatchCards] = useState<MatchCardItem[]>([]);
  const [selectedCards, setSelectedCards] = useState<MatchCardItem[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [matchStreak, setMatchStreak] = useState(0);
  const [matchSeconds, setMatchSeconds] = useState(0);
  const [matchWon, setMatchWon] = useState(false);

  // GAME 2: BOSS BATTLE STATE
  const [currentBossHp, setCurrentBossHp] = useState(100);
  const [studentHp, setStudentHp] = useState(100);
  const [bossQuestionIdx, setBossQuestionIdx] = useState(0);
  const [bossFeedback, setBossFeedback] = useState<string | null>(null);
  const [bossBattleWon, setBossBattleWon] = useState(false);
  const [bossBattleLost, setBossBattleLost] = useState(false);

  // GAME 3: SPEED SWIPE STATE
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [swipeScore, setSwipeScore] = useState(0);
  const [swipeFeedback, setSwipeFeedback] = useState<string | null>(null);
  const [swipeWon, setSwipeWon] = useState(false);

  // GAME 4: WORD SCRAMBLE STATE
  const [scrambleIdx, setScrambleIdx] = useState(0);
  const [scrambleInput, setScrambleInput] = useState('');
  const [scrambleFeedback, setScrambleFeedback] = useState<string | null>(null);
  const [scrambleWon, setScrambleWon] = useState(false);

  // Session XP earned
  const [sessionXp, setSessionXp] = useState(0);

  // Setup speed match cards whenever gamePack changes
  useEffect(() => {
    initMatchGame(gamePack.matchingPairs);
    initBossGame(gamePack);
    initSwipeGame();
    initScrambleGame();
  }, [gamePack]);

  const initMatchGame = (pairs: MatchingPair[]) => {
    const cards: MatchCardItem[] = [];
    pairs.slice(0, 6).forEach((p) => {
      cards.push({ cardId: `term-${p.id}`, pairId: p.id, text: p.term, type: 'term' });
      cards.push({ cardId: `def-${p.id}`, pairId: p.id, text: p.definition, type: 'def' });
    });
    // Shuffle cards randomly
    cards.sort(() => Math.random() - 0.5);
    setMatchCards(cards);
    setSelectedCards([]);
    setMatchedPairIds([]);
    setMatchScore(0);
    setMatchStreak(0);
    setMatchSeconds(0);
    setMatchWon(false);
  };

  const initBossGame = (pack: GamePack) => {
    setCurrentBossHp(100);
    setStudentHp(100);
    setBossQuestionIdx(0);
    setBossFeedback(null);
    setBossBattleWon(false);
    setBossBattleLost(false);
  };

  const initSwipeGame = () => {
    setSwipeIdx(0);
    setSwipeScore(0);
    setSwipeFeedback(null);
    setSwipeWon(false);
  };

  const initScrambleGame = () => {
    setScrambleIdx(0);
    setScrambleInput('');
    setScrambleFeedback(null);
    setScrambleWon(false);
  };

  // Trigger celebration confetti
  const triggerVictoryConfetti = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'],
      });
    } catch (e) {
      // ignore
    }
  };

  // MATCH CARD CLICK
  const handleCardClick = (card: MatchCardItem) => {
    if (matchedPairIds.includes(card.pairId)) return;
    if (selectedCards.length === 1 && selectedCards[0].cardId === card.cardId) return;

    if (selectedCards.length === 0) {
      setSelectedCards([card]);
    } else if (selectedCards.length === 1) {
      const first = selectedCards[0];
      const second = card;
      setSelectedCards([first, second]);

      if (first.pairId === second.pairId && first.type !== second.type) {
        // MATCH!
        const nextMatched = [...matchedPairIds, first.pairId];
        setMatchedPairIds(nextMatched);
        const streakBonus = matchStreak >= 2 ? 30 : 20;
        setMatchScore((prev) => prev + streakBonus);
        setMatchStreak((prev) => prev + 1);
        setSessionXp((prev) => prev + 15);
        setSelectedCards([]);

        if (nextMatched.length === Math.min(6, gamePack.matchingPairs.length)) {
          setMatchWon(true);
          setSessionXp((prev) => prev + 50);
          triggerVictoryConfetti();
        }
      } else {
        // WRONG MATCH
        setMatchStreak(0);
        setTimeout(() => {
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // BOSS BATTLE ANSWER
  const handleBossAnswer = (selectedIdx: number) => {
    const q = gamePack.bossQuestions[bossQuestionIdx];
    if (!q) return;

    if (selectedIdx === q.correctIndex) {
      const dmg = q.damage || 25;
      const nextHp = Math.max(0, currentBossHp - dmg);
      setCurrentBossHp(nextHp);
      setBossFeedback(`💥 Direct Hit! Dealt ${dmg} damage to ${gamePack.bossName}!`);
      setSessionXp((prev) => prev + 25);

      if (nextHp <= 0) {
        setBossBattleWon(true);
        triggerVictoryConfetti();
        setSessionXp((prev) => prev + 100);
        return;
      }
    } else {
      const nextStudentHp = Math.max(0, studentHp - 30);
      setStudentHp(nextStudentHp);
      setBossFeedback(`🛡️ Miss! ${gamePack.bossName} counter-attacked. (${q.explanation})`);

      if (nextStudentHp <= 0) {
        setBossBattleLost(true);
        return;
      }
    }

    setTimeout(() => {
      setBossFeedback(null);
      if (bossQuestionIdx + 1 < gamePack.bossQuestions.length) {
        setBossQuestionIdx((prev) => prev + 1);
      } else {
        if (currentBossHp > 0) {
          setBossBattleWon(true);
          triggerVictoryConfetti();
        }
      }
    }, 1800);
  };

  // SPEED SWIPE ANSWER
  const handleSwipeAnswer = (userChoice: boolean) => {
    const card = gamePack.speedCards[swipeIdx];
    if (!card) return;

    const isCorrect = userChoice === card.isTrue;
    if (isCorrect) {
      setSwipeScore((prev) => prev + 1);
      setSessionXp((prev) => prev + 15);
      setSwipeFeedback(`✅ Correct! ${card.explanation}`);
    } else {
      setSwipeFeedback(`❌ Incorrect! ${card.explanation}`);
    }

    setTimeout(() => {
      setSwipeFeedback(null);
      if (swipeIdx + 1 < gamePack.speedCards.length) {
        setSwipeIdx((prev) => prev + 1);
      } else {
        setSwipeWon(true);
        triggerVictoryConfetti();
        setSessionXp((prev) => prev + 40);
      }
    }, 1500);
  };

  // WORD SCRAMBLE CHECK
  const handleScrambleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cur = gamePack.scrambleWords[scrambleIdx];
    if (!cur) return;

    if (scrambleInput.trim().toUpperCase() === cur.word.toUpperCase()) {
      setScrambleFeedback('✨ Spot on! Word unlocked!');
      setSessionXp((prev) => prev + 20);

      setTimeout(() => {
        setScrambleFeedback(null);
        setScrambleInput('');
        if (scrambleIdx + 1 < gamePack.scrambleWords.length) {
          setScrambleIdx((prev) => prev + 1);
        } else {
          setScrambleWon(true);
          triggerVictoryConfetti();
          setSessionXp((prev) => prev + 50);
        }
      }, 1200);
    } else {
      setScrambleFeedback(`Try again! Hint: ${cur.hint}`);
    }
  };

  // Convert uploaded / inserted notes to game pack via Gemini AI
  const handleGenerateGame = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/game/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyMaterial: insertedText || topicName,
          subject: subjectName,
          topic: topicName,
        }),
      });

      const data = await res.json();
      if (data.gameTitle && data.matchingPairs) {
        setGamePack(data);
        triggerVictoryConfetti();
      }
    } catch (err) {
      console.error('Error generating game pack:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle file input
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setInsertedText(text.slice(0, 3000));
        setTopicName(file.name.replace(/\.[^/.]+$/, ''));
      }
    };
    reader.readAsText(file);
  };

  // Preset packs
  const presetKits = [
    {
      title: 'Calculus: Derivatives & Chain Rule',
      subject: 'Mathematics',
      summary: 'Differentiating polynomial, exponential, and composite functions with limits.',
      text: 'Derivatives represent instantaneous rates of change. Power rule: d/dx[x^n]=nx^(n-1). Chain rule: [f(g(x))]\'=f\'(g(x))*g\'(x). Tangent slopes at peaks equal zero.',
    },
    {
      title: 'Quantum Mechanics: Wave-Particle Duality',
      subject: 'Physics',
      summary: 'Schrödinger wavefunctions, Planck-Einstein relation, and Heisenberg uncertainty.',
      text: 'Light and matter exhibit both wave and particle characteristics. Photons carry energy E=hf. Heisenberg uncertainty principle states delta x * delta p >= hbar / 2.',
    },
    {
      title: 'Algorithms: Big-O & Graph Traversal',
      subject: 'Computer Science',
      summary: 'Time complexity, BFS, DFS, Dijkstra shortest path, and sorting algorithms.',
      text: 'Binary search operates in O(log n). Merge Sort is O(n log n). BFS uses a FIFO Queue for shortest unweighted paths. DFS uses recursion or a LIFO stack.',
    },
    {
      title: 'Cellular Biology: Mitochondria & ATP',
      subject: 'Biology',
      summary: 'Cellular respiration, Krebs cycle, glycolysis, and ATP synthase phosphorylation.',
      text: 'Mitochondria produce ATP through oxidative phosphorylation. Glycolysis breaks glucose into pyruvate in cytoplasm. Electron transport chain creates proton gradient.',
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-600 p-0.5 shadow-md shadow-rose-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Study Game Arena
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                  Gamified Learning
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Insert or upload your syllabus notes to generate playable learning mini-games with speed matching, RPG boss battles, and swipe challenges.
          </p>
        </div>

        {/* Live Session XP Banner */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 px-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
            <Trophy className="w-4 h-4 fill-amber-500" />
            <span>Session XP: +{sessionXp}</span>
          </div>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Active: <strong className="text-slate-900 dark:text-white">{gamePack.gameTitle}</strong>
          </span>
        </div>
      </div>

      {/* 1. INSERT & UPLOAD STUDIO CARD */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-500" />
              <span>Insert or Upload Study Material</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste revision notes, syllabus summaries, or upload a document to auto-generate game levels.
            </p>
          </div>

          {/* Input Method Switcher */}
          <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs font-semibold">
            <button
              onClick={() => setInputMode('presets')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inputMode === 'presets'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Preset Packs
            </button>
            <button
              onClick={() => setInputMode('insert')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inputMode === 'insert'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Paste Notes
            </button>
            <button
              onClick={() => setInputMode('upload')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                inputMode === 'upload'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Upload File
            </button>
          </div>
        </div>

        {/* TAB 1: PRESETS */}
        {inputMode === 'presets' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {presetKits.map((kit, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTopicName(kit.title);
                  setSubjectName(kit.subject);
                  setInsertedText(kit.text);
                }}
                className={`p-4 rounded-2xl border text-left transition-all group flex flex-col justify-between ${
                  topicName === kit.title
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                    {kit.subject}
                  </span>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    {kit.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {kit.summary}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                  <span>{topicName === kit.title ? '● Selected' : 'Select Deck'}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        )}

        {/* TAB 2: INSERT & PASTE */}
        {inputMode === 'insert' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="Topic Name (e.g. Calculus Derivatives, Organic Chemistry)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                placeholder="Subject Name (e.g. Mathematics, Physics)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white"
              />
            </div>

            <textarea
              rows={4}
              value={insertedText}
              onChange={(e) => setInsertedText(e.target.value)}
              placeholder="Paste lecture notes, textbook definitions, formula sheets, or exam questions here..."
              className="w-full p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* TAB 3: UPLOAD */}
        {inputMode === 'upload' && (
          <div className="p-8 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {fileName ? `Uploaded: ${fileName}` : 'Upload syllabus note or PDF/TXT file'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Supports TXT, MD, PDF, and exported document notes up to 25MB
              </p>
            </div>

            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Choose Document</span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        )}

        {/* Generation Trigger Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-xs text-slate-400">
            Current Deck Topic: <strong className="text-slate-700 dark:text-slate-200">{topicName}</strong>
          </span>

          <button
            onClick={handleGenerateGame}
            disabled={isGenerating}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 active:scale-95 transition-all"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>{isGenerating ? 'Gemini AI Building Game Pack...' : 'Generate Game Pack with Gemini AI'}</span>
          </button>
        </div>
      </div>

      {/* 2. GAME MODE SELECTOR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveGame('pipeline')}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden ${
            activeGame === 'pipeline'
              ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/40 shadow-lg shadow-amber-500/15 ring-2 ring-amber-500/30'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-400/50'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🌊</span>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-500 dark:text-amber-300 border border-amber-500/30">
              FEATURED
            </span>
          </div>
          <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1">
            <span>Polymath's Pipeline</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
            Rotate conduits, solve quiz locks, achieve flow
          </p>
        </button>

        <button
          onClick={() => setActiveGame('match')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeGame === 'match'
              ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 shadow-md shadow-indigo-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">⚡</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              Memory
            </span>
          </div>
          <div className="font-extrabold text-xs text-slate-900 dark:text-white">Speed Match</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Match terms to definitions with combo streaks
          </p>
        </button>

        <button
          onClick={() => setActiveGame('boss')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeGame === 'boss'
              ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 shadow-md shadow-rose-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🐉</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
              Boss Fight
            </span>
          </div>
          <div className="font-extrabold text-xs text-slate-900 dark:text-white">Boss Battle RPG</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Answer questions to defeat {gamePack.bossName}
          </p>
        </button>

        <button
          onClick={() => setActiveGame('swipe')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeGame === 'swipe'
              ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 shadow-md shadow-emerald-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🎯</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              Rapid
            </span>
          </div>
          <div className="font-extrabold text-xs text-slate-900 dark:text-white">Speed Swipe</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Rapid True or False decision rush
          </p>
        </button>

        <button
          onClick={() => setActiveGame('scramble')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeGame === 'scramble'
              ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/60 shadow-md shadow-purple-500/10'
              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl">🧩</span>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
              Word Builder
            </span>
          </div>
          <div className="font-extrabold text-xs text-slate-900 dark:text-white">Term Scramble</div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
            Reassemble scrambled vocabulary letters
          </p>
        </button>
      </div>

      {/* 3. ACTIVE GAME PLAY ARENA */}
      {activeGame === 'pipeline' ? (
        <PolymathPipelineGame onAwardXp={(xp) => setSessionXp((prev) => prev + xp)} />
      ) : (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl min-h-[420px]">
          {/* GAME 1: SPEED MATCH */}
        {activeGame === 'match' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <span>⚡ Speed Match Arena</span>
                  <span className="text-xs text-slate-400 font-normal">
                    (Click a Term then its Definition)
                  </span>
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs font-bold font-mono">
                <div className="text-indigo-600 dark:text-indigo-400">
                  Score: {matchScore}
                </div>
                {matchStreak > 1 && (
                  <div className="text-amber-500 animate-pulse">
                    🔥 x{matchStreak} Combo!
                  </div>
                )}
                <div className="text-slate-500">
                  Pairs: {matchedPairIds.length} / {Math.min(6, gamePack.matchingPairs.length)}
                </div>
                <button
                  onClick={() => initMatchGame(gamePack.matchingPairs)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  title="Restart"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {matchWon ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  🏆
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
                    Speed Match Cleared!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    You matched all {matchedPairIds.length} concepts and earned +{matchScore} points!
                  </p>
                </div>
                <button
                  onClick={() => initMatchGame(gamePack.matchingPairs)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {matchCards.map((card) => {
                  const isMatched = matchedPairIds.includes(card.pairId);
                  const isSelected = selectedCards.some((s) => s.cardId === card.cardId);

                  if (isMatched) {
                    return (
                      <div
                        key={card.cardId}
                        className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center text-center opacity-40 select-none"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" />
                        <span>Matched</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={card.cardId}
                      onClick={() => handleCardClick(card)}
                      className={`p-4 rounded-2xl border text-left transition-all select-none min-h-[90px] flex flex-col justify-between ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 scale-[1.02]'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-indigo-400 text-slate-800 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 shadow-sm'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span
                          className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : card.type === 'term'
                              ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {card.type === 'term' ? 'Concept' : 'Definition'}
                        </span>
                      </div>

                      <p
                        className={`text-xs font-semibold leading-snug ${
                          card.type === 'term' ? 'font-bold' : 'font-normal'
                        }`}
                      >
                        {card.text}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GAME 2: BOSS BATTLE RPG */}
        {activeGame === 'boss' && (
          <div className="space-y-6">
            {/* Boss vs Student Battle Status Bar */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 via-slate-900 to-indigo-950/60 border border-rose-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Boss Stat */}
              <div className="flex items-center gap-3 w-full md:w-1/2">
                <div className="w-14 h-14 rounded-2xl bg-rose-600/30 border border-rose-500/40 flex items-center justify-center text-3xl shrink-0">
                  🐉
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-rose-300">{gamePack.bossName}</span>
                    <span className="font-mono">{currentBossHp} / 100 HP</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-rose-900/60">
                    <div
                      className="h-full bg-gradient-to-r from-rose-600 to-orange-500 transition-all duration-500"
                      style={{ width: `${currentBossHp}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* VS Pill */}
              <div className="font-black text-xs text-amber-400 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                VS
              </div>

              {/* Student Stat */}
              <div className="flex items-center gap-3 w-full md:w-1/2">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-3xl shrink-0">
                  🧙‍♂️
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-indigo-300">
                      {user?.displayName || 'Student Mage'}
                    </span>
                    <span className="font-mono">{studentHp} / 100 Shield</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-indigo-900/60">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-500"
                      style={{ width: `${studentHp}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Battle Result States */}
            {bossBattleWon ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto text-2xl">
                  ⚔️
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-emerald-900 dark:text-emerald-200">
                    VICTORY! {gamePack.bossName} Defeated!
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    You proved complete syllabus mastery and earned +100 bonus XP!
                  </p>
                </div>
                <button
                  onClick={() => initBossGame(gamePack)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Battle Again
                </button>
              </div>
            ) : bossBattleLost ? (
              <div className="p-8 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto text-2xl">
                  🛡️
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-extrabold text-rose-900 dark:text-rose-200">
                    Shield Depleted!
                  </h4>
                  <p className="text-xs text-rose-700 dark:text-rose-300">
                    Review your weak topics in Syllabus Sage and try the battle again!
                  </p>
                </div>
                <button
                  onClick={() => initBossGame(gamePack)}
                  className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  Retry Battle
                </button>
              </div>
            ) : (
              /* Battle Question Card */
              <div className="space-y-4">
                {bossFeedback && (
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-bold text-indigo-700 dark:text-indigo-300 text-center animate-in fade-in">
                    {bossFeedback}
                  </div>
                )}

                {gamePack.bossQuestions[bossQuestionIdx] && (
                  <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-4">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      <span>Question {bossQuestionIdx + 1} of {gamePack.bossQuestions.length}</span>
                      <span>Spell Damage: 25 HP</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {gamePack.bossQuestions[bossQuestionIdx].question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {gamePack.bossQuestions[bossQuestionIdx].options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => handleBossAnswer(oIdx)}
                          className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-left text-xs font-semibold text-slate-800 dark:text-slate-200 transition-all flex items-center justify-between group"
                        >
                          <span>{opt}</span>
                          <Swords className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-indigo-500 transition-opacity" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GAME 3: SPEED SWIPE */}
        {activeGame === 'swipe' && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                🎯 Speed Swipe (True or False)
              </h3>
              <div className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                Score: {swipeScore} / {gamePack.speedCards.length}
              </div>
            </div>

            {swipeWon ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
                <div className="text-3xl">🎉</div>
                <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Speed Swipe Finished!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  You scored {swipeScore} out of {gamePack.speedCards.length} correct!
                </p>
                <button
                  onClick={initSwipeGame}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {swipeFeedback && (
                  <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold text-center text-indigo-700 dark:text-indigo-300">
                    {swipeFeedback}
                  </div>
                )}

                {gamePack.speedCards[swipeIdx] && (
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/30 dark:from-slate-800 dark:to-indigo-950/30 border border-slate-200 dark:border-slate-700 text-center space-y-6 shadow-md">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      Card {swipeIdx + 1} of {gamePack.speedCards.length}
                    </span>

                    <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                      &quot;{gamePack.speedCards[swipeIdx].statement}&quot;
                    </h4>

                    <div className="flex items-center justify-center gap-4 pt-2">
                      <button
                        onClick={() => handleSwipeAnswer(false)}
                        className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-rose-600/20"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>FALSE</span>
                      </button>

                      <button
                        onClick={() => handleSwipeAnswer(true)}
                        className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>TRUE</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* GAME 4: WORD SCRAMBLE */}
        {activeGame === 'scramble' && (
          <div className="space-y-6 max-w-xl mx-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                🧩 Term Scramble Builder
              </h3>
              <div className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
                Word {scrambleIdx + 1} of {gamePack.scrambleWords.length}
              </div>
            </div>

            {scrambleWon ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-4 animate-in fade-in">
                <div className="text-3xl">🏅</div>
                <h4 className="text-lg font-bold text-emerald-900 dark:text-emerald-200">
                  Vocabulary Master!
                </h4>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  You unscrambled all key academic terms!
                </p>
                <button
                  onClick={initScrambleGame}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                >
                  Play Again
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                {gamePack.scrambleWords[scrambleIdx] && (
                  <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-center space-y-5">
                    {/* Scrambled Letters Display */}
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {gamePack.scrambleWords[scrambleIdx].word
                        .split('')
                        .sort(() => 0.5 - Math.random())
                        .map((char, cIdx) => (
                          <span
                            key={cIdx}
                            className="w-10 h-10 rounded-xl bg-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-purple-600/20"
                          >
                            {char}
                          </span>
                        ))}
                    </div>

                    <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-xs text-purple-700 dark:text-purple-300">
                      <strong>Hint:</strong> {gamePack.scrambleWords[scrambleIdx].hint}
                    </div>

                    {scrambleFeedback && (
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {scrambleFeedback}
                      </p>
                    )}

                    <form onSubmit={handleScrambleSubmit} className="flex gap-2 max-w-sm mx-auto">
                      <input
                        type="text"
                        value={scrambleInput}
                        onChange={(e) => setScrambleInput(e.target.value)}
                        placeholder="Type unscrambled word..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-bold uppercase text-slate-900 dark:text-white tracking-widest text-center"
                      />
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
);
};
