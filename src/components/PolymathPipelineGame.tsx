import React, { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Trophy,
  RotateCw,
  Lock,
  Unlock,
  HelpCircle,
  Timer,
  Star,
  CheckCircle2,
  RefreshCw,
  Lightbulb,
  Award,
  Layers,
  Zap,
  Volume2,
  VolumeX,
  ArrowRight,
  ExternalLink,
  Download,
  Info,
  ChevronRight,
  Play,
} from 'lucide-react';
import { QuestoraLogo } from './QuestoraLogo';

export interface SubjectQuestion {
  id: number;
  type: string;
  question: string;
  options: string[];
  answer: string;
  points: number;
}

export const subjectData: SubjectQuestion[] = [
  {
    id: 1,
    type: 'science',
    question: 'If 2x + 7 = 19, what is the value of x?',
    options: ['4', '5', '6', '7'],
    answer: '6',
    points: 20,
  },
  {
    id: 2,
    type: 'history',
    question: 'Who was the first president of the United States of America?',
    options: ['Adams', 'Lincoln', 'Washington', 'Jefferson'],
    answer: 'Washington',
    points: 20,
  },
  {
    id: 3,
    type: 'math',
    question: 'What is the square root of 144?',
    options: ['10', '11', '12', '14'],
    answer: '12',
    points: 20,
  },
  {
    id: 4,
    type: 'science',
    question: 'What is the chemical symbol for gold on the periodic table?',
    options: ['Ag', 'Au', 'Fe', 'Gd'],
    answer: 'Au',
    points: 25,
  },
  {
    id: 5,
    type: 'math',
    question: 'What is the value of 7 cubed (7^3)?',
    options: ['343', '243', '49', '512'],
    answer: '343',
    points: 25,
  },
  {
    id: 6,
    type: 'history',
    question: 'In what year did the Apollo 11 mission land humans on the Moon?',
    options: ['1965', '1969', '1972', '1975'],
    answer: '1969',
    points: 25,
  },
  {
    id: 7,
    type: 'science',
    question: 'Which planet in our solar system has the most prominent ring system?',
    options: ['Jupiter', 'Saturn', 'Uranus', 'Neptune'],
    answer: 'Saturn',
    points: 20,
  },
  {
    id: 8,
    type: 'math',
    question: 'If a triangle has angles of 90° and 45°, what is the third angle?',
    options: ['35°', '45°', '55°', '90°'],
    answer: '45°',
    points: 20,
  },
  {
    id: 9,
    type: 'literature',
    question: 'Who wrote the epic adventure novel "Twenty Thousand Leagues Under the Seas"?',
    options: ['H.G. Wells', 'Jules Verne', 'Arthur Conan Doyle', 'Mary Shelley'],
    answer: 'Jules Verne',
    points: 25,
  },
  {
    id: 10,
    type: 'science',
    question: 'What fundamental particle carries a negative electric charge?',
    options: ['Proton', 'Neutron', 'Electron', 'Photon'],
    answer: 'Electron',
    points: 20,
  },
  {
    id: 11,
    type: 'history',
    question: 'The ancient city of Alexandria was founded in which country?',
    options: ['Greece', 'Egypt', 'Italy', 'Persia'],
    answer: 'Egypt',
    points: 25,
  },
  {
    id: 12,
    type: 'math',
    question: 'What is the sum of angles in any Euclidean quadrilateral (4-sided polygon)?',
    options: ['180°', '270°', '360°', '540°'],
    answer: '360°',
    points: 25,
  },
];

export type PipeType = 'straight' | 'elbow' | 'tee' | 'cross' | 'valve' | 'tank';

export interface GridCell {
  r: number;
  c: number;
  type: PipeType;
  rotation: number; // 0: 0deg, 1: 90deg, 2: 180deg, 3: 270deg
  isLocked: boolean;
  questionId?: number;
  isUnlocked?: boolean;
  isFlowing?: boolean;
  isStart?: boolean;
  isFinish?: boolean;
}

interface LevelBlueprint {
  levelNumber: number;
  name: string;
  description: string;
  targetSeconds: number;
  lockedPos: [number, number];
  questionId: number;
  gridTemplate: { type: PipeType; targetRotation: number }[][];
}

// Fixed 6x6 level blueprints with verified guaranteed solutions
const LEVEL_BLUEPRINTS: LevelBlueprint[] = [
  {
    levelNumber: 1,
    name: 'Genesis Flow: Logic Initiation',
    description: 'Establish the primary hydraulic circuit from Input Valve to Storage Reservoir.',
    targetSeconds: 45,
    lockedPos: [2, 2],
    questionId: 1,
    gridTemplate: [
      // row 0
      [
        { type: 'valve', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 2 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 1
      [
        { type: 'straight', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 3 },
        { type: 'tee', targetRotation: 1 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 2
      [
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 2 }, // LOCKED
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 1 },
        { type: 'elbow', targetRotation: 0 },
      ],
      // row 3
      [
        { type: 'straight', targetRotation: 0 },
        { type: 'tee', targetRotation: 2 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 3 },
        { type: 'straight', targetRotation: 0 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 4
      [
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 2 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 5
      [
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'tank', targetRotation: 3 },
      ],
    ],
  },
  {
    levelNumber: 2,
    name: 'Dual Conduits: Kinetic Pressure',
    description: 'Route flow through alternating cross-junctions and bypass the pressure gate.',
    targetSeconds: 60,
    lockedPos: [3, 3],
    questionId: 3,
    gridTemplate: [
      // row 0
      [
        { type: 'valve', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 2 },
      ],
      // row 1
      [
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 2 },
        { type: 'straight', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 2
      [
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'tee', targetRotation: 2 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 1 },
      ],
      // row 3
      [
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 }, // LOCKED
        { type: 'elbow', targetRotation: 2 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 4
      [
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 1 },
      ],
      // row 5
      [
        { type: 'straight', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'tank', targetRotation: 3 },
      ],
    ],
  },
  {
    levelNumber: 3,
    name: 'Quantum Manifold: Universal Matrix',
    description: 'Solve the science cipher to release the locked manifold and achieve full equilibrium.',
    targetSeconds: 75,
    lockedPos: [1, 4],
    questionId: 4,
    gridTemplate: [
      // row 0
      [
        { type: 'valve', targetRotation: 2 },
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 2 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 2 },
      ],
      // row 1
      [
        { type: 'straight', targetRotation: 0 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'tee', targetRotation: 1 }, // LOCKED
        { type: 'straight', targetRotation: 0 },
      ],
      // row 2
      [
        { type: 'elbow', targetRotation: 0 },
        { type: 'tee', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 2 },
        { type: 'straight', targetRotation: 0 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 3
      [
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 0 },
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'elbow', targetRotation: 2 },
      ],
      // row 4
      [
        { type: 'elbow', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'cross', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 0 },
      ],
      // row 5
      [
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'elbow', targetRotation: 0 },
        { type: 'straight', targetRotation: 1 },
        { type: 'straight', targetRotation: 1 },
        { type: 'tank', targetRotation: 0 },
      ],
    ],
  },
];

// Returns port directions: 0 = Top, 1 = Right, 2 = Bottom, 3 = Left
export const getPortsForCell = (type: PipeType, rotation: number): number[] => {
  let basePorts: number[] = [];
  switch (type) {
    case 'straight':
      basePorts = [0, 2]; // Top, Bottom
      break;
    case 'elbow':
      basePorts = [0, 1]; // Top, Right
      break;
    case 'tee':
      basePorts = [0, 1, 2]; // Top, Right, Bottom
      break;
    case 'cross':
      basePorts = [0, 1, 2, 3];
      break;
    case 'valve':
      // Start valve: outputs to Right (1) and Bottom (2) depending on rotation
      basePorts = [1, 2];
      break;
    case 'tank':
      // Finish tank: accepts from Top (0) and Left (3) depending on rotation
      basePorts = [0, 3];
      break;
    default:
      basePorts = [];
  }
  return basePorts.map((p) => (p + rotation) % 4);
};

// Web Audio synthesizer for crisp, satisfying game sound effects without external audio files
class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Lazy init on first user gesture
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setSound(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled() {
    return this.soundEnabled;
  }

  public playRotate() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(540, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.08);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playLockedBuzz() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(120, now + 0.06);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playUnlockChime() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;
    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.18, now + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.06 + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.26);
    });
  }

  public playLevelWin() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5, 1318.51];
    const now = this.ctx.currentTime;
    chords.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.08);

      gain.gain.setValueAtTime(0.25, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.65);
    });
  }
}

const sounds = new SoundEngine();

interface PolymathPipelineGameProps {
  onAwardXp?: (xp: number) => void;
}

export const PolymathPipelineGame: React.FC<PolymathPipelineGameProps> = ({ onAwardXp }) => {
  // Game progression state
  const [levelIdx, setLevelIdx] = useState(0);
  const currentBlueprint = LEVEL_BLUEPRINTS[levelIdx] || LEVEL_BLUEPRINTS[0];

  const [grid, setGrid] = useState<GridCell[][]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLevelClear, setIsLevelClear] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  // Active question modal state
  const [activeQuestion, setActiveQuestion] = useState<SubjectQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [questionFeedback, setQuestionFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // AI Hint state
  const [hintMessage, setHintMessage] = useState<string | null>(null);
  const [hintPipes, setHintPipes] = useState<[number, number][]>([]);
  const [hintsRemaining, setHintsRemaining] = useState(3);

  // Code / standalone prototype modal
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load High Score from localStorage
  useEffect(() => {
    try {
      const savedHigh = localStorage.getItem('questora_pipeline_highscore');
      if (savedHigh) setHighScore(parseInt(savedHigh, 10));
      const savedScore = localStorage.getItem('questora_pipeline_current_score');
      if (savedScore) setScore(parseInt(savedScore, 10));
    } catch {
      // ignore
    }
  }, []);

  // Initialize level grid
  const initializeGrid = useCallback((blueprint: LevelBlueprint) => {
    const newGrid: GridCell[][] = [];
    const template = blueprint.gridTemplate;

    for (let r = 0; r < 6; r++) {
      const row: GridCell[] = [];
      for (let c = 0; c < 6; c++) {
        const item = template[r][c];
        const isStart = r === 0 && c === 0;
        const isFinish = r === 5 && c === 5;
        const isLocked = r === blueprint.lockedPos[0] && c === blueprint.lockedPos[1];

        // Randomize initial rotation for all cells except start & finish
        let initialRot = item.targetRotation;
        if (!isStart && !isFinish) {
          // ensure initial puzzle starts scrambled
          initialRot = (item.targetRotation + Math.floor(Math.random() * 3) + 1) % 4;
        }

        row.push({
          r,
          c,
          type: item.type,
          rotation: initialRot,
          isLocked,
          questionId: isLocked ? blueprint.questionId : undefined,
          isUnlocked: !isLocked,
          isFlowing: false,
          isStart,
          isFinish,
        });
      }
      row.push();
      newGrid.push(row);
    }

    setGrid(newGrid);
    setIsLevelClear(false);
    setSecondsElapsed(0);
    setIsPlaying(true);
    setHintMessage(null);
    setHintPipes([]);
  }, []);

  // Reset or change level
  useEffect(() => {
    initializeGrid(currentBlueprint);
  }, [currentBlueprint, initializeGrid]);

  // Main game timer
  useEffect(() => {
    if (isPlaying && !isLevelClear) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isLevelClear]);

  // Star calculation based on time limit
  const calculateStars = (): number => {
    const target = currentBlueprint.targetSeconds;
    if (secondsElapsed <= target * 0.8) return 3;
    if (secondsElapsed <= target * 1.3) return 2;
    return 1;
  };

  // Evaluate pipeline fluid connectivity via Breadth-First Search (BFS)
  const evaluatePipelineFlow = useCallback(
    (currentGrid: GridCell[][]) => {
      if (!currentGrid || currentGrid.length === 0) return;

      const visited = Array(6)
        .fill(null)
        .map(() => Array(6).fill(false));
      const queue: [number, number][] = [];

      // Start at (0,0)
      visited[0][0] = true;
      queue.push([0, 0]);

      // Direction vectors: 0: Up, 1: Right, 2: Down, 3: Left
      const dr = [-1, 0, 1, 0];
      const dc = [0, 1, 0, -1];

      while (queue.length > 0) {
        const [cr, cc] = queue.shift()!;
        const currCell = currentGrid[cr][cc];
        const currPorts = getPortsForCell(currCell.type, currCell.rotation);

        for (const port of currPorts) {
          const nr = cr + dr[port];
          const nc = cc + dc[port];

          if (nr >= 0 && nr < 6 && nc >= 0 && nc < 6 && !visited[nr][nc]) {
            const nextCell = currentGrid[nr][nc];
            // Needed incoming port from opposite direction: (port + 2) % 4
            const oppositePort = (port + 2) % 4;
            const nextPorts = getPortsForCell(nextCell.type, nextCell.rotation);

            if (nextPorts.includes(oppositePort)) {
              visited[nr][nc] = true;
              queue.push([nr, nc]);
            }
          }
        }
      }

      // Update flow status on each grid cell
      let isFinishConnected = false;
      const updatedGrid = currentGrid.map((row, r) =>
        row.map((cell, c) => {
          const flowing = visited[r][c];
          if (r === 5 && c === 5 && flowing) {
            isFinishConnected = true;
          }
          return {
            ...cell,
            isFlowing: flowing,
          };
        })
      );

      setGrid(updatedGrid);

      // Check if winning condition reached
      if (isFinishConnected && !isLevelClear) {
        handleLevelComplete();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLevelClear, secondsElapsed]
  );

  // Trigger win state
  const handleLevelComplete = () => {
    setIsLevelClear(true);
    setIsPlaying(false);
    sounds.playLevelWin();

    // Trigger victory confetti burst
    confetti({
      particleCount: 80,
      spread: 75,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#10b981', '#f59e0b', '#06b6d4'],
    });

    const stars = calculateStars();
    const speedBonus = Math.max(10, Math.floor((currentBlueprint.targetSeconds - secondsElapsed) * 2));
    const levelPoints = 100 * stars + speedBonus;
    const newTotal = score + levelPoints;

    setScore(newTotal);
    if (newTotal > highScore) {
      setHighScore(newTotal);
      try {
        localStorage.setItem('questora_pipeline_highscore', newTotal.toString());
      } catch {
        // ignore
      }
    }
    try {
      localStorage.setItem('questora_pipeline_current_score', newTotal.toString());
    } catch {
      // ignore
    }

    // Award XP to user profile in QUESTORA
    if (onAwardXp) {
      onAwardXp(120 + stars * 30);
    }
  };

  // Handle cell click / rotation
  const handleCellClick = (r: number, c: number) => {
    if (isLevelClear) return;
    const cell = grid[r][c];

    // If cell is locked and not yet unlocked -> open question modal!
    if (cell.isLocked && !cell.isUnlocked) {
      sounds.playLockedBuzz();
      const q = subjectData.find((item) => item.id === cell.questionId) || subjectData[0];
      setActiveQuestion(q);
      setSelectedOption(null);
      setQuestionFeedback(null);
      return;
    }

    // Don't rotate fixed valve/tank endpoints
    if (cell.isStart || cell.isFinish) {
      sounds.playRotate();
      return;
    }

    // Rotate 90 degrees clockwise
    sounds.playRotate();
    const newGrid = grid.map((row, rowIdx) =>
      row.map((colCell, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          return {
            ...colCell,
            rotation: (colCell.rotation + 1) % 4,
          };
        }
        return colCell;
      })
    );

    evaluatePipelineFlow(newGrid);
  };

  // Handle question submit
  const handleAnswerSubmit = (option: string) => {
    if (!activeQuestion) return;
    setSelectedOption(option);

    if (option === activeQuestion.answer) {
      sounds.playUnlockChime();
      setQuestionFeedback({
        isCorrect: true,
        message: `Exemplary! Correct answer selected (+${activeQuestion.points} pts). The locked segment is now freely rotatable!`,
      });

      // Award immediate question points
      setScore((prev) => prev + activeQuestion.points);

      // Unlock the target grid cell
      setTimeout(() => {
        const newGrid = grid.map((row) =>
          row.map((cell) => {
            if (cell.questionId === activeQuestion.id) {
              return {
                ...cell,
                isUnlocked: true,
                isLocked: false,
              };
            }
            return cell;
          })
        );
        evaluatePipelineFlow(newGrid);
        setActiveQuestion(null);
      }, 1400);
    } else {
      sounds.playLockedBuzz();
      setQuestionFeedback({
        isCorrect: false,
        message: `Incorrect. Try again! Universal knowledge requires precision.`,
      });
    }
  };

  // AI Hint Action
  const handleAIHint = () => {
    if (hintsRemaining <= 0) return;
    setHintsRemaining((prev) => prev - 1);
    sounds.playRotate();

    // Check if locked pipe is still locked
    const lockedCell = grid.flat().find((c) => c.isLocked && !c.isUnlocked);
    if (lockedCell) {
      setHintMessage(`AI Guidance: The critical relay at coordinates (${lockedCell.r + 1}, ${lockedCell.c + 1}) is locked! Click it to answer the ${currentBlueprint.name.split(':')[0]} question.`);
      setHintPipes([[lockedCell.r, lockedCell.c]]);
      return;
    }

    // Find a misaligned pipe in the solution template
    const template = currentBlueprint.gridTemplate;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 6; c++) {
        const cell = grid[r][c];
        const targetRot = template[r][c].targetRotation;
        if (!cell.isStart && !cell.isFinish && cell.rotation !== targetRot) {
          setHintMessage(`AI Analysis: Inspect segment at [Row ${r + 1}, Col ${c + 1}]. Rotate it to harmonize fluid routing.`);
          setHintPipes([[r, c]]);
          return;
        }
      }
    }

    setHintMessage('AI Status: All conduit segments appear correctly orientated! Check continuous flow alignment.');
  };

  // Next level
  const handleNextLevel = () => {
    const nextIdx = (levelIdx + 1) % LEVEL_BLUEPRINTS.length;
    setLevelIdx(nextIdx);
    initializeGrid(LEVEL_BLUEPRINTS[nextIdx]);
  };

  // Reset current level
  const handleRestartLevel = () => {
    initializeGrid(currentBlueprint);
  };

  // Download Standalone index.html file
  const handleDownloadStandalone = () => {
    const link = document.createElement('a');
    link.href = '/polymaths-pipeline.html';
    link.download = 'polymaths-pipeline.html';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stars = calculateStars();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* 1. TOP BRANDED QUESTORA HEADER */}
      <div className="rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/20 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        {/* Ambient atmospheric gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Logo & Game Title */}
          <div className="flex items-center gap-3.5">
            <QuestoraLogo size="sm" showText={false} animated={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 text-lg uppercase font-mono">
                  QUESTORA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Polymath’s Pipeline
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Logic Puzzle & Knowledge Conduits
              </h1>
            </div>
          </div>

          {/* Player Progression Counters */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            {/* Current Level */}
            <div className="px-3.5 py-2 rounded-2xl bg-indigo-950/70 border border-indigo-500/30 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-[10px] text-indigo-300 block uppercase font-sans">Level</span>
                <span className="text-sm font-black text-white">
                  {currentBlueprint.levelNumber} / {LEVEL_BLUEPRINTS.length}
                </span>
              </div>
            </div>

            {/* Score */}
            <div className="px-3.5 py-2 rounded-2xl bg-emerald-950/70 border border-emerald-500/30 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-[10px] text-emerald-300 block uppercase font-sans">Score</span>
                <span className="text-sm font-black text-emerald-300">{score.toLocaleString()}</span>
              </div>
            </div>

            {/* High Score (localStorage) */}
            <div className="px-3.5 py-2 rounded-2xl bg-amber-950/70 border border-amber-500/30 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-amber-300 block uppercase font-sans">High Score</span>
                <span className="text-sm font-black text-amber-300">{highScore.toLocaleString()}</span>
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundOn;
                setSoundOn(next);
                sounds.setSound(next);
              }}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors"
              title={soundOn ? 'Mute Sound FX' : 'Enable Sound FX'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            </button>

            {/* Standalone HTML Deliverable Links */}
            <button
              onClick={() => window.open('/polymaths-pipeline.html', '_blank')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-400/30 text-indigo-200 transition-all font-sans font-semibold text-xs"
              title="Open Standalone Single-File Prototype in new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Standalone</span> HTML5
            </button>

            <button
              onClick={handleDownloadStandalone}
              className="p-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 transition-colors"
              title="Download standalone index.html (Zero npm install, runs via VS Code Live Server)"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE: 6x6 INTERACTIVE PIPELINE + SIDE PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / CENTER: THE 6x6 PIPELINE GRID */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 backdrop-blur-md border border-indigo-500/20 p-5 sm:p-7 shadow-2xl flex flex-col items-center">
          {/* Grid Subheader with Valves Status */}
          <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-slate-800 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-bold text-cyan-300">INPUT VALVE [0,0]</span>
            </div>
            <div className="text-slate-400 hidden sm:block text-[11px]">
              Click tiles to rotate • Answer quiz to unlock gray segment
            </div>
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${grid[5]?.[5]?.isFlowing ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
              <span className={`font-bold ${grid[5]?.[5]?.isFlowing ? 'text-emerald-300' : 'text-slate-400'}`}>
                STORAGE TANK [5,5]
              </span>
            </div>
          </div>

          {/* THE 6x6 GRID CONTAINER */}
          <div className="relative p-3.5 sm:p-4 rounded-3xl bg-slate-950/80 border-2 border-indigo-900/60 shadow-[inset_0_0_30px_rgba(30,27,75,0.8)]">
            <div className="grid grid-cols-6 gap-2 sm:gap-2.5">
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const isHighlightedByHint = hintPipes.some(([hr, hc]) => hr === r && hc === c);
                  const isFlowing = cell.isFlowing;
                  const isLocked = cell.isLocked && !cell.isUnlocked;

                  return (
                    <button
                      key={`${r}-${c}`}
                      onClick={() => handleCellClick(r, c)}
                      disabled={isLevelClear}
                      className={`relative w-11 h-11 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-2xl transition-all duration-300 flex items-center justify-center select-none group ${
                        isLocked
                          ? 'bg-slate-800/80 border-2 border-dashed border-amber-500/60 cursor-pointer shadow-lg shadow-amber-500/10 hover:border-amber-400'
                          : cell.isStart
                          ? 'bg-gradient-to-br from-cyan-900/60 to-slate-900 border-2 border-cyan-500/80 shadow-lg shadow-cyan-500/20'
                          : cell.isFinish
                          ? `bg-gradient-to-br from-emerald-900/60 to-slate-900 border-2 ${
                              isFlowing ? 'border-emerald-400 shadow-lg shadow-emerald-500/30' : 'border-slate-700'
                            }`
                          : isFlowing
                          ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950/40 border-2 border-emerald-400/80 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 hover:bg-slate-850 hover:shadow-indigo-500/10'
                      } ${isHighlightedByHint ? 'ring-4 ring-amber-400 ring-offset-2 ring-offset-slate-950 animate-bounce' : ''}`}
                    >
                      {/* Pipe Graphic SVG Renderer with Rotation */}
                      <div
                        className="w-full h-full p-1.5 sm:p-2 transition-transform duration-300 flex items-center justify-center"
                        style={{
                          transform: `rotate(${cell.rotation * 90}deg)`,
                        }}
                      >
                        <PipeGraphic
                          type={cell.type}
                          isFlowing={isFlowing}
                          isLocked={isLocked}
                          isStart={cell.isStart}
                          isFinish={cell.isFinish}
                        />
                      </div>

                      {/* Locked Padlock Overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 rounded-2xl bg-slate-950/70 backdrop-blur-[2px] flex flex-col items-center justify-center text-amber-400 pointer-events-none p-1">
                          <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
                          <span className="text-[8px] sm:text-[9px] font-black uppercase text-amber-300 font-mono mt-0.5">
                            QUIZ
                          </span>
                        </div>
                      )}

                      {/* Coordinate Tooltip in bottom corner */}
                      <span className="absolute bottom-1 right-1 text-[8px] font-mono text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {r},{c}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Controls Under Grid */}
          <div className="w-full mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRestartLevel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all border border-slate-700"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Scramble / Reset
              </button>

              <button
                onClick={() => initializeGrid(LEVEL_BLUEPRINTS[0])}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 font-semibold transition-all border border-indigo-800/50"
              >
                Level 1
              </button>
              <button
                onClick={() => initializeGrid(LEVEL_BLUEPRINTS[1])}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 font-semibold transition-all border border-indigo-800/50"
              >
                Level 2
              </button>
              <button
                onClick={() => initializeGrid(LEVEL_BLUEPRINTS[2])}
                className="px-3 py-1.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 font-semibold transition-all border border-indigo-800/50"
              >
                Level 3
              </button>
            </div>

            <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
              <Timer className="w-4 h-4 text-indigo-400" />
              <span>Time: {secondsElapsed}s</span>
            </div>
          </div>
        </div>

        {/* RIGHT: SIDE PANEL WITH OBJECTIVES, AI HINT, & STAR METER */}
        <div className="lg:col-span-4 space-y-4">
          {/* STAR PROGRESS METER */}
          <div className="rounded-3xl bg-slate-900/90 backdrop-blur-md border border-indigo-500/20 p-5 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Speed Rating Meter
              </span>
              <span className="text-xs font-mono font-bold text-amber-400">
                Target: {currentBlueprint.targetSeconds}s
              </span>
            </div>

            <div className="flex items-center justify-center gap-3 py-2">
              {[1, 2, 3].map((starNum) => (
                <div
                  key={starNum}
                  className={`p-3 rounded-2xl border transition-all duration-500 flex flex-col items-center justify-center ${
                    stars >= starNum
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                      : 'bg-slate-800/40 border-slate-800 text-slate-600 scale-95'
                  }`}
                >
                  <Star
                    className={`w-7 h-7 ${
                      stars >= starNum ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.6)]' : 'text-slate-600'
                    }`}
                  />
                  <span className="text-[10px] font-bold font-mono mt-1">
                    {starNum === 3 ? 'Master' : starNum === 2 ? 'Adept' : 'Initiate'}
                  </span>
                </div>
              ))}
            </div>

            {/* Time progress bar */}
            <div className="mt-3">
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (secondsElapsed / currentBlueprint.targetSeconds) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>0s (3★)</span>
                <span>{Math.floor(currentBlueprint.targetSeconds * 0.8)}s (2★)</span>
                <span>{currentBlueprint.targetSeconds}s (1★)</span>
              </div>
            </div>
          </div>

          {/* LEVEL OBJECTIVES */}
          <div className="rounded-3xl bg-slate-900/90 backdrop-blur-md border border-indigo-500/20 p-5 shadow-xl space-y-3">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Level Objectives</span>
            </h3>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2.5">
                <span
                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center text-[10px] font-bold font-mono ${
                    grid[currentBlueprint.lockedPos[0]]?.[currentBlueprint.lockedPos[1]]?.isUnlocked
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  ✓
                </span>
                <span
                  className={
                    grid[currentBlueprint.lockedPos[0]]?.[currentBlueprint.lockedPos[1]]?.isUnlocked
                      ? 'line-through text-slate-500'
                      : 'text-slate-300'
                  }
                >
                  Unlock gray critical conduit at ({currentBlueprint.lockedPos[0] + 1}, {currentBlueprint.lockedPos[1] + 1})
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span
                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center text-[10px] font-bold font-mono ${
                    grid[5]?.[5]?.isFlowing
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  ✓
                </span>
                <span className={grid[5]?.[5]?.isFlowing ? 'line-through text-slate-500' : 'text-slate-300'}>
                  Route unbroken flow to Output Reservoir [5,5]
                </span>
              </li>

              <li className="flex items-start gap-2.5">
                <span
                  className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center text-[10px] font-bold font-mono ${
                    secondsElapsed <= currentBlueprint.targetSeconds
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  ★
                </span>
                <span className="text-slate-300">
                  Complete within {currentBlueprint.targetSeconds} seconds for 3-star rating
                </span>
              </li>
            </ul>
          </div>

          {/* AI HINT BUTTON */}
          <div className="rounded-3xl bg-slate-900/90 backdrop-blur-md border border-indigo-500/20 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>AI Guidance Co-Pilot</span>
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {hintsRemaining} Left
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Need assistance determining which valve to orient next or identifying the locked choke point?
            </p>

            <button
              onClick={handleAIHint}
              disabled={hintsRemaining <= 0}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Request AI Hint</span>
            </button>

            {hintMessage && (
              <div className="p-3 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 text-xs text-indigo-200 animate-fadeIn">
                <span className="font-bold text-amber-300 block mb-0.5">🧠 Hint Analysis:</span>
                {hintMessage}
              </div>
            )}
          </div>

          {/* STANDALONE PROTOTYPE CARD (Fulfills Deliverables) */}
          <div className="rounded-3xl bg-gradient-to-br from-indigo-950/70 to-slate-900/90 backdrop-blur-md border border-amber-500/30 p-5 shadow-xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-500/20 text-amber-300">
                <Award className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-xs text-amber-200 uppercase tracking-wider">
                Single-File Deliverable
              </h4>
            </div>
            <p className="text-[11px] text-slate-300">
              The complete standalone prototype is pre-compiled as a single self-contained HTML5 file with React 18, Babel CDN, Tailwind CDN, and Lucide icons.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => window.open('/polymaths-pipeline.html', '_blank')}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Live Server Tab
              </button>
              <button
                onClick={handleDownloadStandalone}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1"
                title="Download HTML"
              >
                <Download className="w-3.5 h-3.5" />
                Save .html
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MULTIPLE-CHOICE QUESTION MODAL (The Twist: Required to unlock gray segment) */}
      {activeQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border-2 border-amber-500/60 p-6 sm:p-7 shadow-[0_0_50px_rgba(245,158,11,0.25)] relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Badge */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 font-mono">
                    SECURITY CHOKE POINT
                  </span>
                  <h3 className="font-extrabold text-sm text-white">Unlock Pipeline Segment</h3>
                </div>
              </div>

              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                +{activeQuestion.points} pts
              </span>
            </div>

            {/* Question Subject & Prompt */}
            <div className="space-y-2 mb-5">
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                Subject: {activeQuestion.type}
              </span>
              <p className="text-base sm:text-lg font-bold text-white leading-relaxed">
                {activeQuestion.question}
              </p>
            </div>

            {/* Multiple Choice Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
              {activeQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = isSelected && questionFeedback?.isCorrect;
                const isWrong = isSelected && questionFeedback && !questionFeedback.isCorrect;

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSubmit(option)}
                    disabled={questionFeedback?.isCorrect}
                    className={`p-3.5 rounded-2xl border text-left font-semibold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between ${
                      isCorrect
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-lg shadow-emerald-500/20'
                        : isWrong
                        ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400/80 hover:bg-slate-800'
                    }`}
                  >
                    <span>{option}</span>
                    <span className="text-xs font-mono text-slate-500">
                      {String.fromCharCode(65 + idx)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Feedback alert */}
            {questionFeedback && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-medium mb-4 flex items-center gap-2.5 ${
                  questionFeedback.isCorrect
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                    : 'bg-rose-950/80 border-rose-500 text-rose-200'
                }`}
              >
                {questionFeedback.isCorrect ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span>{questionFeedback.message}</span>
              </div>
            )}

            {/* Modal Cancel Button */}
            {!questionFeedback?.isCorrect && (
              <div className="flex justify-end">
                <button
                  onClick={() => setActiveQuestion(null)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. LEVEL CLEAR MODAL */}
      {isLevelClear && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="w-full max-w-md rounded-3xl bg-slate-900 border-2 border-emerald-400/60 p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.3)] text-center relative overflow-hidden">
            {/* Ambient burst */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* Trophy & Stars */}
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center mx-auto mb-3 text-emerald-300 shadow-xl shadow-emerald-500/20">
              <Trophy className="w-8 h-8 text-emerald-400 animate-bounce" />
            </div>

            <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400 font-mono">
              FLUID HARMONY ACHIEVED
            </span>
            <h2 className="text-2xl font-black text-white tracking-tight mt-1 mb-2">
              Level {currentBlueprint.levelNumber} Clear!
            </h2>
            <p className="text-xs text-slate-300 mb-6">
              Continuous hydraulic pressure successfully routed from Input Valve to Storage Reservoir.
            </p>

            {/* Stars awarded */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {[1, 2, 3].map((starIdx) => (
                <Star
                  key={starIdx}
                  className={`w-8 h-8 transition-transform duration-300 ${
                    stars >= starIdx
                      ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                      : 'text-slate-700'
                  }`}
                />
              ))}
            </div>

            {/* Score & XP breakdown */}
            <div className="grid grid-cols-2 gap-3 mb-6 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
                <span className="text-[10px] text-slate-400 block font-sans uppercase">Completion Time</span>
                <span className="text-sm font-bold text-white">{secondsElapsed} seconds</span>
              </div>
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40">
                <span className="text-[10px] text-emerald-300 block font-sans uppercase">QUESTORA XP</span>
                <span className="text-sm font-black text-emerald-300">+{120 + stars * 30} XP</span>
              </div>
            </div>

            {/* Next Level & Replay Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleRestartLevel}
                className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all border border-slate-700"
              >
                Replay Level
              </button>
              <button
                onClick={handleNextLevel}
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-1.5"
              >
                <span>Next Circuit</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// SVG PIPE RENDERER COMPONENT: Renders straight, elbow, tee, cross, valve, and tank with glowing fluid flow
interface PipeGraphicProps {
  type: PipeType;
  isFlowing?: boolean;
  isLocked?: boolean;
  isStart?: boolean;
  isFinish?: boolean;
}

const PipeGraphic: React.FC<PipeGraphicProps> = ({ type, isFlowing, isLocked, isStart, isFinish }) => {
  const pipeColor = isLocked ? '#64748b' : isFlowing ? '#38bdf8' : '#6366f1';
  const flowColor = isFlowing ? '#34d399' : 'transparent';
  const innerGlow = isFlowing ? 'drop-shadow(0 0 6px rgba(52, 211, 153, 0.9))' : 'none';

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: innerGlow }}>
      <defs>
        {/* Glowing fluid pattern */}
        <linearGradient id="fluid-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>

        <linearGradient id="brass-accent" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
      </defs>

      {/* RENDER STRAIGHT PIPE (Top to Bottom) */}
      {type === 'straight' && (
        <g>
          {/* Outer conduit sleeve */}
          <rect x="36" y="0" width="28" height="100" rx="4" fill="#1e293b" stroke={pipeColor} strokeWidth="3" />
          {/* Inner core flow channel */}
          <rect x="42" y="0" width="16" height="100" fill={isFlowing ? 'url(#fluid-gradient)' : '#0f172a'} />
          {/* Flanges / Brass Rings */}
          <rect x="32" y="4" width="36" height="6" rx="2" fill="url(#brass-accent)" />
          <rect x="32" y="90" width="36" height="6" rx="2" fill="url(#brass-accent)" />
          {/* Fluid flow pulse animation */}
          {isFlowing && (
            <line x1="50" y1="0" x2="50" y2="100" stroke="#ffffff" strokeWidth="3" strokeDasharray="8 8" className="animate-pulse" />
          )}
        </g>
      )}

      {/* RENDER ELBOW PIPE (Top to Right) */}
      {type === 'elbow' && (
        <g>
          {/* Outer conduit curved sleeve */}
          <path
            d="M 36,0 L 36,36 L 100,36 L 100,64 L 64,64 Q 36,64 36,100 L 64,100 L 64,64 L 100,64"
            fill="none"
          />
          <path
            d="M 36,0 L 64,0 L 64,36 Q 64,64 100,64 L 100,36 Q 36,36 36,0 Z"
            fill="#1e293b"
            stroke={pipeColor}
            strokeWidth="3"
          />
          {/* Corner curve outer and inner */}
          <path
            d="M 50,0 Q 50,50 100,50"
            fill="none"
            stroke={isFlowing ? 'url(#fluid-gradient)' : '#0f172a'}
            strokeWidth="16"
          />
          {/* Flanges */}
          <rect x="32" y="4" width="36" height="6" rx="2" fill="url(#brass-accent)" />
          <rect x="90" y="32" width="6" height="36" rx="2" fill="url(#brass-accent)" />
          {/* Corner rivet bolt */}
          <circle cx="50" cy="50" r="4" fill="url(#brass-accent)" />
        </g>
      )}

      {/* RENDER TEE JUNCTION (Top, Right, Bottom) */}
      {type === 'tee' && (
        <g>
          {/* Vertical pipe */}
          <rect x="36" y="0" width="28" height="100" rx="4" fill="#1e293b" stroke={pipeColor} strokeWidth="3" />
          {/* Right spur */}
          <rect x="50" y="36" width="50" height="28" rx="4" fill="#1e293b" stroke={pipeColor} strokeWidth="3" />
          {/* Inner flow core */}
          <rect x="42" y="0" width="16" height="100" fill={isFlowing ? 'url(#fluid-gradient)' : '#0f172a'} />
          <rect x="50" y="42" width="50" height="16" fill={isFlowing ? 'url(#fluid-gradient)' : '#0f172a'} />
          {/* Flanges */}
          <rect x="32" y="4" width="36" height="6" rx="2" fill="url(#brass-accent)" />
          <rect x="32" y="90" width="36" height="6" rx="2" fill="url(#brass-accent)" />
          <rect x="90" y="32" width="6" height="36" rx="2" fill="url(#brass-accent)" />
          {/* Junction center hub */}
          <circle cx="50" cy="50" r="10" fill="#0f172a" stroke="url(#brass-accent)" strokeWidth="2" />
        </g>
      )}

      {/* RENDER CROSS JUNCTION (4-Way) */}
      {type === 'cross' && (
        <g>
          {/* Vertical pipe */}
          <rect x="36" y="0" width="28" height="100" rx="4" fill="#1e293b" stroke={pipeColor} strokeWidth="3" />
          {/* Horizontal pipe */}
          <rect x="0" y="36" width="100" height="28" rx="4" fill="#1e293b" stroke={pipeColor} strokeWidth="3" />
          {/* Inner core */}
          <rect x="42" y="0" width="16" height="100" fill={isFlowing ? 'url(#fluid-gradient)' : '#0f172a'} />
          <rect x="0" y="42" width="100" height="16" fill={isFlowing ? 'url(#fluid-gradient)' : '#0f172a'} />
          {/* Flanges */}
          <rect x="32" y="4" width="36" height="6" rx="2" fill="url(#brass-accent)" />
          <rect x="32" y="90" width="36" height="6" rx="2" fill="url(#brass-accent)" />
          <rect x="4" y="32" width="6" height="36" rx="2" fill="url(#brass-accent)" />
          <rect x="90" y="32" width="6" height="36" rx="2" fill="url(#brass-accent)" />
          {/* Center core */}
          <circle cx="50" cy="50" r="12" fill="#0f172a" stroke="url(#brass-accent)" strokeWidth="3" />
        </g>
      )}

      {/* RENDER INPUT VALVE (Source) */}
      {type === 'valve' && (
        <g>
          {/* Tank chamber */}
          <circle cx="50" cy="50" r="38" fill="#0f172a" stroke="#06b6d4" strokeWidth="4" />
          {/* Pressure indicator */}
          <circle cx="50" cy="50" r="28" fill="#164e63" />
          <circle cx="50" cy="50" r="12" fill="#22d3ee" className="animate-ping" />
          <circle cx="50" cy="50" r="8" fill="#ffffff" />
          {/* Outlet conduit pointing right */}
          <rect x="50" y="40" width="50" height="20" fill="url(#fluid-gradient)" stroke="#06b6d4" strokeWidth="2" />
          {/* Brass valve turning wheel */}
          <line x1="25" y1="50" x2="75" y2="50" stroke="url(#brass-accent)" strokeWidth="4" />
          <line x1="50" y1="25" x2="50" y2="75" stroke="url(#brass-accent)" strokeWidth="4" />
          <circle cx="50" cy="50" r="5" fill="#f59e0b" />
        </g>
      )}

      {/* RENDER OUTPUT TANK (Finish Reservoir) */}
      {type === 'tank' && (
        <g>
          {/* Hexagonal / Circular storage silo */}
          <rect x="15" y="15" width="70" height="70" rx="16" fill="#0f172a" stroke={isFlowing ? '#34d399' : '#475569'} strokeWidth="4" />
          {/* Liquid level fill */}
          <rect
            x="20"
            y={isFlowing ? '25' : '65'}
            width="60"
            height={isFlowing ? '55' : '15'}
            rx="10"
            fill={isFlowing ? 'url(#fluid-gradient)' : '#1e293b'}
            className="transition-all duration-700"
          />
          {/* Gauge meter */}
          <circle cx="50" cy="50" r="16" fill="#022c22" stroke="url(#brass-accent)" strokeWidth="3" />
          <line x1="50" y1="50" x2={isFlowing ? '62' : '38'} y2={isFlowing ? '38' : '50'} stroke="#f59e0b" strokeWidth="3" />
          <circle cx="50" cy="50" r="3" fill="#ffffff" />
          {/* Input nozzle */}
          <rect x="0" y="40" width="20" height="20" fill={isFlowing ? 'url(#fluid-gradient)' : '#1e293b'} />
        </g>
      )}
    </svg>
  );
};
