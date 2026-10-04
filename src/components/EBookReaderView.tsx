import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import confetti from 'canvas-confetti';
import {
  BookOpen,
  Library,
  BookMarked,
  Search,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bookmark,
  Highlighter,
  CheckCircle2,
  HelpCircle,
  Clock,
  ArrowRight,
  Download,
  Upload,
  Plus,
  FileText,
  Brain,
  Zap,
  Star,
  Award,
  List,
  Type,
  Eye,
  X,
  Share2,
  Lightbulb,
  Swords,
  Palette,
} from 'lucide-react';
import { QuestoraLogo } from './QuestoraLogo';
import { MangaAnimationView } from './MangaAnimationView';
import { VisualExplanationModal } from './VisualExplanationModal';
import { CartoonCharacterAvatar } from './CartoonCharacterAvatar';

export interface EBookChapter {
  id: string;
  chapterNumber: number;
  title: string;
  readingTimeMinutes: number;
  content: string[];
  keyTakeaways: string[];
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface EBook {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  subject: string;
  coverGradient: string;
  coverIcon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  totalPages: number;
  estimatedHours: number;
  publishedYear: string;
  description: string;
  chapters: EBookChapter[];
  isCustom?: boolean;
}

export interface EBookHighlight {
  id: string;
  bookId: string;
  chapterId: string;
  chapterTitle: string;
  text: string;
  note?: string;
  color: 'amber' | 'emerald' | 'indigo' | 'rose';
  createdAt: string;
}

// CURATED ACADEMIC TEXTBOOKS FOR QUESTORA
const DEFAULT_BOOKS: EBook[] = [
  {
    id: 'book-calc',
    title: 'Calculus & Mathematical Dynamics',
    subtitle: 'From Limits & Derivatives to Multivariable Mechanics',
    author: 'Prof. Elena Rostova, Ph.D.',
    subject: 'Mathematics',
    coverGradient: 'from-indigo-600 via-purple-700 to-cyan-600',
    coverIcon: '📐',
    difficulty: 'Intermediate',
    totalPages: 240,
    estimatedHours: 6.5,
    publishedYear: '2026 Edition',
    description: 'A rigorous, intuition-first textbook connecting the foundations of differentiation, integration, and vector fields with physical applications.',
    chapters: [
      {
        id: 'c1',
        chapterNumber: 1,
        title: 'Foundations of Limits & Continuity',
        readingTimeMinutes: 8,
        content: [
          'Calculus is fundamentally the mathematics of change. Before we can measure instantaneous rates of change, we must develop a rigorous tool for exploring values that functions approach as inputs draw arbitrarily close to a point.',
          'Consider a function f(x). We say that the limit of f(x) as x approaches c is L, written lim_{x→c} f(x) = L, if we can make the value of f(x) arbitrarily close to L by taking x sufficiently close to c, without x ever needing to equal c.',
          'The epsilon-delta definition formalized by Augustin-Louis Cauchy in the 19th century removed intuitive ambiguities: For every real ε > 0, there exists a real δ > 0 such that whenever 0 < |x - c| < δ, we have |f(x) - L| < ε.',
          'Continuity at a point x = c requires three criteria: First, f(c) must be defined; second, lim_{x→c} f(x) must exist; and third, lim_{x→c} f(x) must equal f(c). If any of these fail, a discontinuity arises—either a removable hole, a jump, or an infinite vertical asymptote.',
          'The Intermediate Value Theorem (IVT) states that if f is continuous on a closed interval [a, b], then for every value u between f(a) and f(b), there exists at least one c in [a, b] such that f(c) = u. This theorem underpins numerical root-finding algorithms such as the Bisection Method.'
        ],
        keyTakeaways: [
          'A limit examines function behavior arbitrarily close to a target coordinate, regardless of whether the point itself is defined.',
          'Continuity requires limit existence, point definition, and equality between the two.',
          'The Intermediate Value Theorem guarantees that continuous curves pass through all intermediate states without jumping.'
        ],
        quizQuestion: {
          question: 'What three conditions are required for a function f(x) to be continuous at x = c?',
          options: [
            'f(c) is positive, f\'(c) is zero, and f\'\'(c) is negative',
            'f(c) is defined, lim_{x→c} f(x) exists, and lim_{x→c} f(x) = f(c)',
            'The function is a polynomial, has no fractions, and is strictly increasing',
            'The derivative f\'(c) is continuous everywhere on the real number line'
          ],
          correctIndex: 1,
          explanation: 'By standard mathematical definition, continuity requires: (1) f(c) exists, (2) the limit as x approaches c exists, and (3) the limit equals the function value.'
        }
      },
      {
        id: 'c2',
        chapterNumber: 2,
        title: 'The Derivative: Instantaneous Rate of Change',
        readingTimeMinutes: 10,
        content: [
          'Average rate of change between two coordinates (x, f(x)) and (x + h, f(x + h)) is represented by the secant line slope: [f(x + h) - f(x)] / h. When we shrink the step interval h toward zero, the secant line morphs into the tangent line.',
          'The derivative f\'(x) is defined as: f\'(x) = lim_{h→0} [f(x + h) - f(x)] / h. This single concept unlocks instantaneous velocity from position functions, marginal cost in economics, and electric current from charge flow.',
          'Geometrically, f\'(x) represents the exact slope of the tangent line at any point along the curve. If f\'(x) > 0 on an interval, the function is strictly increasing; if f\'(x) < 0, it is strictly decreasing; if f\'(x) = 0, the tangent line is horizontal, signaling critical points.',
          'Differentiability implies continuity: If a function is differentiable at x = c, it must be continuous at c. However, the converse is not true. The classic counterexample is f(x) = |x| at x = 0, which is continuous but has a sharp corner where left and right limits disagree.',
          'The Power Rule states that for any real number n, d/dx[x^n] = n * x^(n - 1). Linearity allows us to differentiate sums term-by-term and pull out constant multipliers.'
        ],
        keyTakeaways: [
          'The derivative is the limit of the difference quotient as the step size h approaches zero.',
          'A horizontal tangent line (f\'(x) = 0) pinpoints critical locations: peaks, troughs, or stationary inflections.',
          'Differentiability guarantees continuity, but continuity does not guarantee differentiability at sharp corners or cusps.'
        ],
        quizQuestion: {
          question: 'What is the derivative of the function f(x) = 4x^3 - 5x + 9 with respect to x?',
          options: [
            '12x^2 - 5',
            '4x^2 - 5x',
            '12x^3 - 5x + 9',
            'x^4 - (5/2)x^2 + 9x'
          ],
          correctIndex: 0,
          explanation: 'Using the power rule: d/dx[4x^3] = 4*(3x^2) = 12x^2; d/dx[-5x] = -5; and the derivative of constant 9 is 0. Result: 12x^2 - 5.'
        }
      },
      {
        id: 'c3',
        chapterNumber: 3,
        title: 'Integral Calculus & The Fundamental Theorem',
        readingTimeMinutes: 12,
        content: [
          'While differentiation breaks curves down into infinitesimal local rates, integration accumulates infinitesimals back into macroscopic totals. The definite integral calculates net signed area bounded between a curve and the x-axis.',
          'Riemann sums approximate this area by partitioning the interval [a, b] into n subintervals of width Δx = (b - a)/n and evaluating function heights at sample coordinates x_i*. As n approaches infinity, the Riemann sum converges to the definite integral ∫_a^b f(x) dx.',
          'The Fundamental Theorem of Calculus (FTC) represents one of the greatest intellectual syntheses in human history. Part 1 states that if g(x) = ∫_a^x f(t) dt, then g\'(x) = f(x). Differentiation and integration are exact inverse processes.',
          'Part 2 of the Fundamental Theorem provides the computational engine: If F is any antiderivative of continuous f on [a, b], then ∫_a^b f(x) dx = F(b) - F(a). Instead of calculating infinite Riemann limits, we simply find an antiderivative and take the endpoint difference.',
          'Integration techniques include u-substitution (the reverse chain rule), integration by parts (∫ u dv = uv - ∫ v du, derived from the product rule), and partial fraction decomposition for rational expressions.'
        ],
        keyTakeaways: [
          'Definite integrals quantify accumulated total area through the limit of infinite Riemann sum slices.',
          'The Fundamental Theorem of Calculus unifies differentiation and integration as exact reciprocal operations.',
          'Computing definite integrals requires finding an antiderivative function and evaluating the difference between bounds F(b) - F(a).'
        ],
        quizQuestion: {
          question: 'What does Part 1 of the Fundamental Theorem of Calculus establish regarding g(x) = ∫_a^x f(t) dt?',
          options: [
            'g(x) is always equal to zero for all x',
            'The derivative g\'(x) is exactly equal to f(x)',
            'Integration cannot be reversed by differentiation',
            'g(x) can only exist if f(t) is a linear straight line'
          ],
          correctIndex: 1,
          explanation: 'FTC Part 1 proves that differentiating an integral accumulator function yields the original integrand: d/dx[∫_a^x f(t) dt] = f(x).'
        }
      }
    ]
  },
  {
    id: 'book-algo',
    title: 'Mastering Algorithms & Data Structures',
    subtitle: 'From Asymptotic Complexity to Dynamic Programming',
    author: 'Turing Academic Press',
    subject: 'Computer Science',
    coverGradient: 'from-emerald-600 via-teal-700 to-indigo-700',
    coverIcon: '⚡',
    difficulty: 'Advanced',
    totalPages: 310,
    estimatedHours: 8.0,
    publishedYear: '2026 Edition',
    description: 'A comprehensive engineering guide covering algorithmic design paradigms, tree balancing, graph traversals, and dynamic programming optimization.',
    chapters: [
      {
        id: 'algo-c1',
        chapterNumber: 1,
        title: 'Asymptotic Analysis & Big-O Foundations',
        readingTimeMinutes: 9,
        content: [
          'In computer science, measuring runtime by clock seconds is unreliable because hardware architecture, compiler optimizations, and operating system scheduling introduce high variance. Instead, we measure algorithmic efficiency asymptotically based on input size n.',
          'Big-O notation O(g(n)) defines an asymptotic upper bound. Formally, f(n) = O(g(n)) if there exist positive constants c and n_0 such that 0 ≤ f(n) ≤ c * g(n) for all n ≥ n_0. It describes the worst-case growth rate of operations.',
          'Common complexity hierarchies ordered by growth rate: O(1) constant time, O(log n) logarithmic (e.g., binary search), O(n) linear, O(n log n) linearithmic (e.g., merge sort, heap sort), O(n^2) quadratic (nested loops), and O(2^n) exponential (brute force subsets).',
          'Space complexity measures auxiliary memory required as input scales. In-place algorithms such as Quicksort achieve O(log n) auxiliary stack space, whereas Merge Sort requires O(n) auxiliary space to merge divided arrays.',
          'The Master Theorem provides a cookbook solution for divide-and-conquer recurrences of the form T(n) = a * T(n/b) + f(n), comparing the cost of dividing/recombining f(n) against the leaf execution cost n^(log_b a).'
        ],
        keyTakeaways: [
          'Asymptotic analysis measures algorithm scalability independent of physical hardware differences.',
          'Big-O represents worst-case upper bound growth, whereas Big-Omega (Ω) represents lower bound.',
          'Logarithmic and linearithmic algorithms scale gracefully to millions of elements, whereas quadratic and exponential algorithms collapse.'
        ],
        quizQuestion: {
          question: 'If an algorithm divides a problem of size n into 2 subproblems of size n/2 and does O(n) merge work, what is its overall time complexity?',
          options: [
            'O(n)',
            'O(n log n)',
            'O(n^2)',
            'O(log n)'
          ],
          correctIndex: 1,
          explanation: 'By the Master Theorem (Case 2: a=2, b=2, log_b(a) = 1 matching the f(n)=O(n^1) work), the recurrence T(n) = 2T(n/2) + O(n) resolves to O(n log n), characteristic of Merge Sort.'
        }
      },
      {
        id: 'algo-c2',
        chapterNumber: 2,
        title: 'Binary Search Trees & Self-Balancing Invariants',
        readingTimeMinutes: 11,
        content: [
          'A Binary Search Tree (BST) maintains the fundamental ordering property: for any node N, all keys in N’s left subtree are strictly less than N.key, and all keys in N’s right subtree are strictly greater.',
          'Under balanced conditions, search, insertion, and deletion execute in O(h) = O(log n) time, where h is tree height. However, inserting sorted data (e.g., [1, 2, 3, 4, 5]) into an unaugmented BST degrades the structure into a linear linked list with O(n) worst-case height.',
          'Self-balancing binary trees solve this degeneration through invariant enforcement. AVL trees maintain balance factor BF = height(left) - height(right) ∈ {-1, 0, 1}. If any insertion or deletion violates this invariant, tree rotations (Left, Right, Left-Right, Right-Left) restore O(log n) balance in O(1) rotation steps.',
          'Red-Black Trees relax strict balance by painting nodes red or black under 5 rules: the root is black, leaves (NIL) are black, red nodes cannot have red children, and every path from root to NIL must contain the same black height. Red-Black trees require fewer rotations during frequent writes than AVL trees.'
        ],
        keyTakeaways: [
          'Unbalanced BSTs degrade to O(n) linked lists when supplied sequential data.',
          'AVL trees enforce strict height differentials (|BF| ≤ 1) through tree rotations.',
          'Red-Black trees offer faster writes and insertions by maintaining black-height equality.'
        ],
        quizQuestion: {
          question: 'What is the maximum allowed height difference between left and right subtrees at any node in an AVL Tree?',
          options: [
            'Exactly 0',
            'At most 1',
            'At most 2',
            'Unlimited as long as all leaves are black'
          ],
          correctIndex: 1,
          explanation: 'The AVL balance factor invariant requires |height(left) - height(right)| ≤ 1 at every node in the tree.'
        }
      }
    ]
  },
  {
    id: 'book-phys',
    title: 'Quantum Physics & Modern Thermodynamics',
    subtitle: 'Principles of Wave-Particle Duality, Quanta, and Entropy',
    author: 'Dr. Marcus Vance & Dr. A. Bohr',
    subject: 'Physics',
    coverGradient: 'from-blue-700 via-indigo-900 to-rose-700',
    coverIcon: '⚛️',
    difficulty: 'Advanced',
    totalPages: 280,
    estimatedHours: 7.2,
    publishedYear: '2026 Edition',
    description: 'An authoritative study of quantum states, wave-particle duality, Heisenberg uncertainty, and statistical mechanics governing thermodynamic arrows of time.',
    chapters: [
      {
        id: 'phys-c1',
        chapterNumber: 1,
        title: 'Wave-Particle Duality & The Quantum Hypothesis',
        readingTimeMinutes: 10,
        content: [
          'At the close of the 19th century, classical physics treated radiation strictly as continuous Maxwellian waves and matter strictly as discrete Newtonian corpuscles. This worldview collapsed when calculating blackbody radiation.',
          'Classical Rayleigh-Jeans theory predicted that an ideal blackbody would emit infinite energy at ultraviolet frequencies—the "Ultraviolet Catastrophe." In 1900, Max Planck resolved this crisis by postulating that vibrating atoms absorb and emit energy only in discrete packets called quanta: E = h * f, where h is Planck’s constant.',
          'Albert Einstein extended Planck’s idea to explain the Photoelectric Effect in 1905: Light itself travels as discrete energy packets (photons). Electrons are dislodged from metal plates instantly if the photon frequency exceeds the work function threshold, regardless of light intensity.',
          'In 1924, Louis de Broglie hypothesized the reciprocal truth: If light waves exhibit particle properties, then material particles must possess wave properties. The de Broglie wavelength is given by λ = h / p, where p is momentum.',
          'The Davisson-Germer experiment and modern double-slit experiments with electrons confirmed de Broglie’s matter waves through unmistakable constructive and destructive interference fringes.'
        ],
        keyTakeaways: [
          'Energy emission and absorption occurs in discrete quanta (E = hf), resolving the ultraviolet catastrophe.',
          'Light exhibits dual nature: continuous electromagnetic waves in propagation, discrete photons during interaction.',
          'All matter exhibits a characteristic de Broglie wavelength inversely proportional to its momentum.'
        ],
        quizQuestion: {
          question: 'According to Louis de Broglie, what is the wavelength λ of a particle with momentum p?',
          options: [
            'λ = h * p',
            'λ = h / p',
            'λ = p / h',
            'λ = m * c^2'
          ],
          correctIndex: 1,
          explanation: 'The de Broglie relation defines matter wavelength as Planck\'s constant divided by particle momentum: λ = h / p.'
        }
      }
    ]
  },
  {
    id: 'book-neuro',
    title: 'The Neuroscience of Focus & Memory',
    subtitle: 'Synaptic Plasticity, Deep Work Mechanisms, and Spaced Recall',
    author: 'Cognitive Science Research Institute',
    subject: 'Cognitive Science',
    coverGradient: 'from-amber-600 via-rose-700 to-indigo-800',
    coverIcon: '🧠',
    difficulty: 'Beginner',
    totalPages: 190,
    estimatedHours: 4.8,
    publishedYear: '2026 Edition',
    description: 'Explore the physiological circuitry of human attention, neurotransmitter dynamics during deep work, and evidence-backed memorization architectures.',
    chapters: [
      {
        id: 'neuro-c1',
        chapterNumber: 1,
        title: 'Synaptic Plasticity & Long-Term Potentiation',
        readingTimeMinutes: 7,
        content: [
          'Memory is not a static recording stored in a biological file cabinet; it is a dynamic network of synaptic connections across billions of neurons. Learning physically alters brain structure through synaptic plasticity.',
          'Donald Hebb’s 1949 postulate summarized the mechanism: "Neurons that fire together, wire together." When an axon of cell A repeatedly excites cell B, growth processes strengthen the transmission efficacy between them.',
          'Long-Term Potentiation (LTP), discovered in the hippocampus by Bliss and Lømo in 1973, is the cellular basis of memory formation. Repeated high-frequency stimulation triggers glutamate release, activating NMDA receptors and flooding postsynaptic cells with calcium ions.',
          'This calcium surge recruits additional AMPA receptors to the dendritic spine, permanently sensitizing the synapse to future signals. Conversely, disuse leads to Long-Term Depression (LTD), pruning weak synaptic paths.',
          'Sleep plays an indispensable role in memory consolidation. During slow-wave and REM sleep, the hippocampus replays waking neuronal firing patterns, transferring short-term episodic traces to the neocortex for permanent, resilient retention.'
        ],
        keyTakeaways: [
          'Learning physically reshapes neural architecture via Long-Term Potentiation (LTP).',
          'Glutamate and NMDA/AMPA receptor activation strengthen synaptic transmission sensitivity.',
          'Sleep is biologically necessary to transfer transient hippocampal memory traces into permanent neocortical storage.'
        ],
        quizQuestion: {
          question: 'What biological phenomenon discovered in the hippocampus represents the cellular foundation of long-term memory formation?',
          options: [
            'Action potential hyperpolarization',
            'Long-Term Potentiation (LTP)',
            'Synaptic exhaustion reflex',
            'Glial cell dehydration'
          ],
          correctIndex: 1,
          explanation: 'Long-Term Potentiation (LTP) is the persistent strengthening of synapses based on recent patterns of activity, forming the cellular basis of learning.'
        }
      }
    ]
  }
];

export const EBookReaderView: React.FC = () => {
  const { setActiveView } = useApp();

  // Books Library State (loads default + custom user uploaded books)
  const [books, setBooks] = useState<EBook[]>(() => {
    try {
      const saved = localStorage.getItem('questora_ebooks');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_BOOKS;
  });

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');

  // Currently Open Book & Chapter
  const [activeBook, setActiveBook] = useState<EBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  // Reader Customization Ergonomics
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono'>('serif');
  const [readerTheme, setReaderTheme] = useState<'paper' | 'sepia' | 'dark' | 'slate'>('dark');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToC, setShowToC] = useState(false);
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);

  // Interactive Quiz & AI Features
  const [quizAnswered, setQuizAnswered] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [showAiSummary, setShowAiSummary] = useState(false);

  // Highlights & Annotations
  const [highlights, setHighlights] = useState<EBookHighlight[]>(() => {
    try {
      const saved = localStorage.getItem('questora_ebook_highlights');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });
  const [highlightNoteText, setHighlightNoteText] = useState('');
  const [selectedHighlightColor, setSelectedHighlightColor] = useState<'amber' | 'emerald' | 'indigo' | 'rose'>('amber');

  // Text-To-Speech (TTS)
  const [isPlayingTts, setIsPlayingTts] = useState(false);
  const [ttsSpeed, setTtsSpeed] = useState<number>(1.0);

  // Manga Animation & AI Explanation States
  const [showMangaModal, setShowMangaModal] = useState(false);
  const [showVisualModal, setShowVisualModal] = useState(false);
  const [visualTopic, setVisualTopic] = useState('');
  const [visualExcerpt, setVisualExcerpt] = useState('');
  const [explainingIdx, setExplainingIdx] = useState<number | null>(null);
  const [paragraphExplanations, setParagraphExplanations] = useState<{ [key: number]: string }>({});

  // Import New Book Modal State
  const [showImportModal, setShowImportModal] = useState(false);
  const [importTitle, setImportTitle] = useState('');
  const [importAuthor, setImportAuthor] = useState('');
  const [importSubject, setImportSubject] = useState('Computer Science');
  const [importContent, setImportContent] = useState('');
  const [importFileFeedback, setImportFileFeedback] = useState<string | null>(null);

  // Reader container ref for scrolling
  const readerContentRef = useRef<HTMLDivElement | null>(null);

  // Save books to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('questora_ebooks', JSON.stringify(books));
    } catch {}
  }, [books]);

  // Save highlights to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('questora_ebook_highlights', JSON.stringify(highlights));
    } catch {}
  }, [highlights]);

  // Scroll to top on chapter change
  useEffect(() => {
    if (readerContentRef.current) {
      readerContentRef.current.scrollTop = 0;
    }
    setQuizAnswered(null);
    setQuizFeedback(null);
    setShowAiSummary(false);
    stopTts();
  }, [activeBook, activeChapterIndex]);

  // Stop TTS on unmount
  useEffect(() => {
    return () => {
      stopTts();
    };
  }, []);

  // Filtered books
  const subjectsList = ['All', ...Array.from(new Set(books.map((b) => b.subject)))];
  const filteredBooks = books.filter((book) => {
    const matchesSubject = selectedSubject === 'All' || book.subject === selectedSubject;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Current active chapter
  const currentChapter = activeBook?.chapters[activeChapterIndex] || null;

  // Text to Speech
  const startTts = () => {
    if (!currentChapter || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const fullText = `${currentChapter.title}. ${currentChapter.content.join(' ')}`;
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = ttsSpeed;
    utterance.onend = () => setIsPlayingTts(false);
    utterance.onerror = () => setIsPlayingTts(false);

    window.speechSynthesis.speak(utterance);
    setIsPlayingTts(true);
  };

  const stopTts = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingTts(false);
  };

  const toggleTts = () => {
    if (isPlayingTts) {
      stopTts();
    } else {
      startTts();
    }
  };

  // AI Explain Paragraph
  const handleExplainParagraph = async (idx: number, text: string) => {
    if (paragraphExplanations[idx]) {
      setParagraphExplanations((prev) => {
        const next = { ...prev };
        delete next[idx];
        return next;
      });
      return;
    }

    setExplainingIdx(idx);
    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Please simplify and explain this excerpt from our textbook chapter "${currentChapter?.title}":\n\n"${text}"\n\nGive an intuitive analogy and a clear 2-sentence summary.`,
            },
          ],
          topic: currentChapter?.title || 'Academic Reading',
          subject: activeBook?.subject || 'Coursework',
          role: 'coach',
        }),
      });
      const data = await res.json();
      setParagraphExplanations((prev) => ({
        ...prev,
        [idx]: data.reply || 'Key takeaway: this principle links directly to real-world physical and mathematical dynamics.',
      }));
    } catch (e) {
      setParagraphExplanations((prev) => ({
        ...prev,
        [idx]: 'Intuitive takeaway: break down this mechanism step-by-step to isolate the core rate or principle.',
      }));
    } finally {
      setExplainingIdx(null);
    }
  };

  // Quick Highlight creation from selection or prompt
  const handleAddHighlight = (text: string) => {
    if (!activeBook || !currentChapter || !text.trim()) return;

    const newHighlight: EBookHighlight = {
      id: `hl-${Date.now()}`,
      bookId: activeBook.id,
      chapterId: currentChapter.id,
      chapterTitle: currentChapter.title,
      text: text.trim(),
      note: highlightNoteText.trim() || undefined,
      color: selectedHighlightColor,
      createdAt: new Date().toLocaleDateString(),
    };

    setHighlights((prev) => [newHighlight, ...prev]);
    setHighlightNoteText('');
    confetti({
      particleCount: 25,
      spread: 50,
      origin: { y: 0.7 },
      colors: ['#f59e0b', '#10b981', '#6366f1'],
    });
  };

  // Chapter Quiz Handler
  const handleQuizOption = (optIdx: number) => {
    if (!currentChapter?.quizQuestion || quizAnswered !== null) return;
    setQuizAnswered(optIdx);

    const isCorrect = optIdx === currentChapter.quizQuestion.correctIndex;
    if (isCorrect) {
      setQuizFeedback(`Exemplary! Correct answer. +35 XP awarded for comprehension.`);
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#10b981', '#4f46e5', '#f59e0b'],
      });
    } else {
      setQuizFeedback(`Review needed. ${currentChapter.quizQuestion.explanation}`);
    }
  };

  // Smart text cleaner and paragraph splitter for uploaded notes and files
  const cleanExtractedText = (raw: string): string => {
    // If text contains binary PDF metadata, extract readable text streams
    if (raw.includes('%PDF-') || raw.includes('/FlateDecode') || raw.includes('/Filter')) {
      const matches = raw.match(/\(([^()]{3,})\)/g) || [];
      const extracted = matches.map((m) => m.slice(1, -1).trim()).filter((s) => s.length > 2).join(' ');
      if (extracted.length > 50) {
        return extracted;
      }
    }
    // Remove control characters except newlines/tabs
    return raw.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '').trim();
  };

  // File upload parser for text, markdown, json, pdf notes
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.replace(/\.[^/.]+$/, '');
    if (!importTitle) {
      setImportTitle(fileName.charAt(0).toUpperCase() + fileName.slice(1));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawText = (event.target?.result as string) || '';
      const cleaned = cleanExtractedText(rawText);
      setImportContent(cleaned || rawText);
      setImportFileFeedback(`Loaded ${file.name} (${(file.size / 1024).toFixed(1)} KB) successfully!`);
    };
    reader.onerror = () => {
      setImportFileFeedback('Could not read file. Please try pasting the text.');
    };
    reader.readAsText(file);
  };

  // Custom User Book Import
  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importTitle.trim() || !importContent.trim()) return;

    const cleaned = cleanExtractedText(importContent);

    // Split paragraphs by double newlines, single newlines, or sentence chunks
    let paragraphs = cleaned
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // If single giant block, split every 3-4 sentences
    if (paragraphs.length === 1 && paragraphs[0].length > 400) {
      const sentences = paragraphs[0].match(/[^.!?]+[.!?]+/g) || [paragraphs[0]];
      paragraphs = [];
      for (let i = 0; i < sentences.length; i += 3) {
        paragraphs.push(sentences.slice(i, i + 3).join(' ').trim());
      }
    }

    const newBook: EBook = {
      id: `custom-book-${Date.now()}`,
      title: importTitle,
      subtitle: 'User Uploaded Coursework Manuscript',
      author: importAuthor.trim() || 'Student Scholar',
      subject: importSubject,
      coverGradient: 'from-amber-600 via-indigo-700 to-teal-700',
      coverIcon: '📖',
      difficulty: 'Intermediate',
      totalPages: Math.max(12, Math.ceil(paragraphs.length * 3)),
      estimatedHours: Math.max(0.5, +(paragraphs.length * 0.1).toFixed(1)),
      publishedYear: 'Custom Upload',
      description: paragraphs[0]?.slice(0, 140) + '...',
      isCustom: true,
      chapters: [
        {
          id: 'custom-c1',
          chapterNumber: 1,
          title: `Section 1: ${importTitle.slice(0, 32)}`,
          readingTimeMinutes: Math.max(3, Math.ceil(paragraphs.length * 1.5)),
          content: paragraphs,
          keyTakeaways: [
            'Imported user study materials ready for active recall, diagrams, and cartoon animations.',
            'Highlights and notes can be created and saved indefinitely.',
          ],
          quizQuestion: {
            question: `What is the primary focus of "${importTitle}"?`,
            options: [
              `Understanding the foundational concepts and mechanisms of ${importTitle}`,
              'Memorizing unrelated definitions without applying principles',
              'Skipping practice steps and formulas',
              'Ignoring core takeaways',
            ],
            correctIndex: 0,
            explanation: `Comprehending the foundational principles of ${importTitle} ensures high exam retention.`,
          },
        },
      ],
    };

    setBooks((prev) => [newBook, ...prev]);
    setShowImportModal(false);
    setImportTitle('');
    setImportAuthor('');
    setImportContent('');
    setImportFileFeedback(null);
    setActiveBook(newBook);
    setActiveChapterIndex(0);
  };

  // Theme style classes for Reader
  const getThemeClasses = () => {
    switch (readerTheme) {
      case 'paper':
        return 'bg-[#fcfbf9] text-slate-800 border-stone-200';
      case 'sepia':
        return 'bg-[#f6f1e5] text-[#4a3b2c] border-[#e7dbc5]';
      case 'slate':
        return 'bg-slate-900 text-slate-100 border-slate-800';
      case 'dark':
      default:
        return 'bg-slate-950 text-slate-100 border-indigo-950/60';
    }
  };

  const getFontFamilyClass = () => {
    switch (fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono text-sm';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm':
        return 'text-sm leading-relaxed';
      case 'lg':
        return 'text-lg leading-relaxed';
      case 'xl':
        return 'text-xl leading-loose';
      case 'base':
      default:
        return 'text-base leading-relaxed';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* 1. TOP HEADER BRANDING */}
      <div className="rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/20 p-5 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <QuestoraLogo size="sm" showText={false} animated={true} />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 text-lg uppercase tracking-wider">
                  QUESTORA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
                  E-Book Library & Reader
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
                Curated Academic Textbooks & Manuscripts
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {activeBook ? (
              <button
                onClick={() => {
                  stopTts();
                  setActiveBook(null);
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-all"
              >
                <Library className="w-4 h-4 text-indigo-400" />
                <span>Return to Library</span>
              </button>
            ) : (
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Upload / Import E-Book</span>
              </button>
            )}

            <button
              onClick={() => setShowNotesDrawer(!showNotesDrawer)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all"
            >
              <Bookmark className="w-4 h-4" />
              <span>Notes ({highlights.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN VIEW SWITCHER: LIBRARY VIEW VS. ACTIVE READER VIEW */}
      {!activeBook ? (
        /* ======================== LIBRARY VIEW ======================== */
        <div className="space-y-6">
          {/* SEARCH & SUBJECT FILTERS */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by textbook title, author, or keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subject Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {subjectsList.map((subj) => (
                <button
                  key={subj}
                  onClick={() => setSelectedSubject(subj)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedSubject === subj
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* E-BOOKS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 hover:border-indigo-500/50"
              >
                <div>
                  {/* Book Spine Graphic Header */}
                  <div
                    className={`h-40 rounded-2xl bg-gradient-to-tr ${book.coverGradient} p-4 flex flex-col justify-between text-white shadow-inner relative overflow-hidden mb-4`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider">
                        {book.subject}
                      </span>
                      <span className="text-2xl">{book.coverIcon}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono opacity-80 uppercase block">
                        QUESTORA ACADEMIC PRESS
                      </span>
                      <h3 className="font-black text-sm line-clamp-2 leading-snug drop-shadow-sm">
                        {book.title}
                      </h3>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{book.author}</span>
                      <span className="font-mono">{book.publishedYear}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Bottom stats and Open Button */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-3">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                      {book.chapters.length} Chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      ~{book.estimatedHours}h
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveBook(book);
                      setActiveChapterIndex(0);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                  >
                    <span>Read E-Book</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* ======================== ACTIVE READER VIEW ======================== */
        <div
          className={`space-y-4 ${
            isFullscreen ? 'fixed inset-0 z-50 p-6 overflow-y-auto bg-slate-950' : ''
          }`}
        >
          {/* 1. READER ERGONOMICS CONTROL BAR */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 sm:p-4 shadow-lg flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left: ToC Drawer Toggle & Book Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowToC(!showToC)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-colors"
                title="Table of Contents"
              >
                <List className="w-4 h-4 text-indigo-500" />
                <span>Contents</span>
              </button>

              <div className="hidden sm:block">
                <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                  {activeBook.title}
                </span>
                <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate max-w-xs">
                  Chapter {currentChapter?.chapterNumber}: {currentChapter?.title}
                </div>
              </div>
            </div>

            {/* Center: Audio Playback & TTS controls */}
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 px-3 py-1 rounded-2xl border border-slate-200 dark:border-slate-700">
              <button
                onClick={toggleTts}
                className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
              >
                {isPlayingTts ? <Pause className="w-4 h-4 text-rose-500" /> : <Play className="w-4 h-4 text-emerald-500" />}
                <span>{isPlayingTts ? 'Stop Voice' : 'Read Aloud'}</span>
              </button>

              <span className="text-slate-400 text-xs">|</span>

              <select
                value={ttsSpeed}
                onChange={(e) => {
                  const spd = parseFloat(e.target.value);
                  setTtsSpeed(spd);
                  if (isPlayingTts) {
                    stopTts();
                  }
                }}
                className="bg-transparent text-[11px] font-mono text-slate-600 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="0.8">0.8x</option>
                <option value="1.0">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>

            {/* Manga / Cartoon Animation Button */}
            <button
              onClick={() => setShowMangaModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md shadow-rose-500/20 active:scale-95 transition-all"
              title="Transform Chapter to Animated Cartoon / Manga Episode"
            >
              <Swords className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cartoon Animation</span>
              <span className="sm:hidden">Animate</span>
            </button>

            {/* Visual Diagram Studio Button */}
            <button
              onClick={() => {
                setVisualTopic(currentChapter?.title || activeBook?.title || 'Coursework Concept');
                setVisualExcerpt(currentChapter?.content?.join('\n') || '');
                setShowVisualModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
              title="Generate Interactive Visual Diagrams & Cartoon Explanations"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Visual Studio</span>
              <span className="sm:hidden">Visuals</span>
            </button>

            {/* Right: Typography & Display Preferences */}
            <div className="flex items-center gap-2">
              {/* Font Size */}
              <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 font-bold">
                <button
                  onClick={() => setFontSize('sm')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'sm' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize('base')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'base' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-1 rounded-lg ${fontSize === 'lg' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
                >
                  A+
                </button>
              </div>

              {/* Font Family */}
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value as any)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none"
              >
                <option value="serif">Serif (Book)</option>
                <option value="sans">Clean Sans</option>
                <option value="mono">Monospace</option>
              </select>

              {/* Theme Switcher */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setReaderTheme('dark')}
                  className={`w-6 h-6 rounded-full bg-slate-950 border-2 ${
                    readerTheme === 'dark' ? 'border-indigo-400 scale-110' : 'border-slate-700'
                  }`}
                  title="QUESTORA Dark"
                />
                <button
                  onClick={() => setReaderTheme('sepia')}
                  className={`w-6 h-6 rounded-full bg-[#f6f1e5] border-2 ${
                    readerTheme === 'sepia' ? 'border-amber-600 scale-110' : 'border-stone-400'
                  }`}
                  title="Warm Sepia"
                />
                <button
                  onClick={() => setReaderTheme('paper')}
                  className={`w-6 h-6 rounded-full bg-white border-2 ${
                    readerTheme === 'paper' ? 'border-indigo-600 scale-110' : 'border-slate-300'
                  }`}
                  title="Paper Light"
                />
              </div>

              {/* Fullscreen Toggle */}
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                title={isFullscreen ? 'Exit Fullscreen' : 'Distraction-Free Mode'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* 2. READER WORKSPACE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* TABLE OF CONTENTS DRAWER (When open) */}
            {showToC && (
              <div className="lg:col-span-3 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="font-extrabold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <List className="w-4 h-4 text-indigo-500" />
                    <span>Chapters</span>
                  </h3>
                  <button onClick={() => setShowToC(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 max-h-[500px] overflow-y-auto">
                  {activeBook.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChapterIndex(idx);
                        setShowToC(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs transition-all ${
                        activeChapterIndex === idx
                          ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span className="text-[10px] block opacity-80 font-mono">
                        Chapter {ch.chapterNumber} • {ch.readingTimeMinutes}m
                      </span>
                      <span className="line-clamp-2">{ch.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* MAIN E-BOOK CONTENT CONTAINER */}
            <div
              className={`${
                showToC ? 'lg:col-span-9' : 'lg:col-span-12'
              } rounded-3xl border ${getThemeClasses()} p-6 sm:p-10 shadow-2xl transition-colors duration-300 min-h-[600px] flex flex-col justify-between`}
            >
              <div ref={readerContentRef} className="space-y-6">
                {/* Chapter Eyebrow Header */}
                <div className="border-b border-current/15 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs uppercase font-mono font-bold tracking-widest text-indigo-500">
                      CHAPTER {currentChapter?.chapterNumber} OF {activeBook.chapters.length}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-1">
                      {currentChapter?.title}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowAiSummary(!showAiSummary)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25 font-bold text-xs transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{showAiSummary ? 'Hide AI Summary' : 'AI Key Insights'}</span>
                    </button>
                  </div>
                </div>

                {/* AI Key Insights Box */}
                {showAiSummary && currentChapter?.keyTakeaways && (
                  <div className="p-4 rounded-2xl bg-indigo-950/60 border border-indigo-500/40 space-y-2 animate-in fade-in">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4" />
                      <span>AI Chapter Distillation & Takeaways:</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-indigo-100 list-disc list-inside">
                      {currentChapter.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="leading-relaxed">
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Chapter Body Paragraphs */}
                <div className={`${getFontFamilyClass()} ${getFontSizeClass()} space-y-5 text-justify`}>
                  {currentChapter?.content.map((paragraph, idx) => (
                    <div key={idx} className="relative group space-y-2">
                      <p className="leading-relaxed">{paragraph}</p>

                      {/* Quick paragraph actions on hover or mobile */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-wrap items-center gap-1.5 justify-end pt-1">
                        <button
                          onClick={() => {
                            setVisualTopic(currentChapter?.title || 'Academic Reading');
                            setVisualExcerpt(paragraph);
                            setShowVisualModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold transition-all"
                          title="Generate Visual SVG Diagram"
                        >
                          <Palette className="w-3 h-3 text-amber-400" />
                          <span>Visual Diagram</span>
                        </button>

                        <button
                          onClick={() => {
                            setShowMangaModal(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[11px] font-bold transition-all"
                          title="Animate into Cartoon Storyboard"
                        >
                          <Swords className="w-3 h-3 text-rose-400" />
                          <span>Cartoon Anime</span>
                        </button>

                        <button
                          onClick={() => handleExplainParagraph(idx, paragraph)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-400 text-[11px] font-bold transition-all"
                          title="Explain & Simplify with Gemini"
                        >
                          <Sparkles className="w-3 h-3 text-indigo-400" />
                          <span>{explainingIdx === idx ? 'Explaining...' : paragraphExplanations[idx] ? 'Hide AI' : 'Explain'}</span>
                        </button>

                        <button
                          onClick={() => handleAddHighlight(paragraph.slice(0, 120) + '...')}
                          className="p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs"
                          title="Bookmark & Highlight Excerpt"
                        >
                          <Highlighter className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Inline AI Explanation Drawer */}
                      {paragraphExplanations[idx] && (
                        <div className="p-3.5 rounded-2xl bg-indigo-950/70 border border-indigo-500/40 text-xs text-indigo-200 space-y-1 animate-in fade-in">
                          <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px] uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>AI Intuitive Breakdown:</span>
                          </div>
                          <p className="leading-relaxed">{paragraphExplanations[idx]}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Active Recall Check (Twist: Comprehension Quiz at Chapter End) */}
                {currentChapter?.quizQuestion && (
                  <div className="mt-10 p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-3 font-sans">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-amber-400" />
                        <span className="font-extrabold uppercase tracking-wider text-amber-300">
                          Active Recall Checkpoint
                        </span>
                      </div>
                      <span className="font-mono text-emerald-400 font-bold">+35 XP</span>
                    </div>

                    <p className="text-sm font-bold text-white">
                      {currentChapter.quizQuestion.question}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {currentChapter.quizQuestion.options.map((opt, i) => {
                        const isChosen = quizAnswered === i;
                        const isCorrect = i === currentChapter.quizQuestion?.correctIndex;
                        return (
                          <button
                            key={i}
                            onClick={() => handleQuizOption(i)}
                            disabled={quizAnswered !== null}
                            className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                              quizAnswered !== null
                                ? isCorrect
                                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200'
                                  : isChosen
                                  ? 'bg-rose-500/20 border-rose-500 text-rose-200'
                                  : 'bg-slate-800/40 border-slate-800 text-slate-500'
                                : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-amber-400 hover:bg-slate-800'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizFeedback && (
                      <div className="p-3 rounded-xl bg-slate-800/80 text-xs font-medium text-amber-200 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{quizFeedback}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* BOTTOM CHAPTER NAVIGATION BAR */}
              <div className="mt-8 pt-4 border-t border-current/15 flex items-center justify-between text-xs font-sans">
                <button
                  onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                  disabled={activeChapterIndex === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white font-bold transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous Chapter</span>
                </button>

                <div className="font-mono text-current/60 text-xs hidden sm:block">
                  Progress: {Math.round(((activeChapterIndex + 1) / activeBook.chapters.length) * 100)}%
                </div>

                <button
                  onClick={() =>
                    setActiveChapterIndex((prev) => Math.min(activeBook.chapters.length - 1, prev + 1))
                  }
                  disabled={activeChapterIndex === activeBook.chapters.length - 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white font-bold transition-all shadow-md shadow-indigo-600/30"
                >
                  <span>Next Chapter</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. HIGHLIGHTS & SAVED NOTES DRAWER */}
      {showNotesDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md h-full bg-slate-900 border-l border-indigo-500/20 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-sm text-white">Study Highlights & Notes</h3>
                </div>
                <button
                  onClick={() => setShowNotesDrawer(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Add Custom Note Input */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  Quick Capture Thought:
                </span>
                <textarea
                  value={highlightNoteText}
                  onChange={(e) => setHighlightNoteText(e.target.value)}
                  placeholder="Record an observation, formula, or question..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
                />
                <button
                  onClick={() => handleAddHighlight(highlightNoteText)}
                  disabled={!highlightNoteText.trim()}
                  className="w-full py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-all"
                >
                  Save Note
                </button>
              </div>

              {/* List of Highlights */}
              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                {highlights.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    No highlights captured yet. Click the highlight pen on any chapter paragraph!
                  </div>
                ) : (
                  highlights.map((hl) => (
                    <div
                      key={hl.id}
                      className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono">
                        <span>{hl.chapterTitle}</span>
                        <span>{hl.createdAt}</span>
                      </div>
                      <p className="text-slate-200 italic border-l-2 border-amber-400 pl-2">
                        "{hl.text}"
                      </p>
                      {hl.note && (
                        <p className="text-amber-200 text-[11px] pt-1 font-sans">
                          <strong>Note:</strong> {hl.note}
                        </p>
                      )}
                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => setHighlights((prev) => prev.filter((h) => h.id !== hl.id))}
                          className="text-[10px] text-rose-400 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Export Notes Button */}
            {highlights.length > 0 && (
              <button
                onClick={() => {
                  const exportMarkdown = highlights
                    .map((h) => `### ${h.chapterTitle}\n> ${h.text}\n${h.note ? `Note: ${h.note}\n` : ''}`)
                    .join('\n\n');
                  const blob = new Blob([exportMarkdown], { type: 'text/markdown' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `questora_study_notes_${Date.now()}.md`;
                  a.click();
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Notes as Markdown</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. CUSTOM E-BOOK IMPORT MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-indigo-500/40 p-6 sm:p-7 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">Import E-Book / Notes</h3>
                  <span className="text-[10px] text-slate-400">
                    Add custom textbook or lecture manuscript
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="space-y-4 text-xs">
              {/* Direct File Upload Area */}
              <div className="p-3.5 rounded-2xl bg-slate-800/80 border-2 border-dashed border-indigo-500/40 hover:border-indigo-500 transition-colors flex flex-col items-center justify-center text-center space-y-1.5 cursor-pointer relative">
                <input
                  type="file"
                  accept=".txt,.md,.pdf,.json,.epub,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-extrabold text-white text-xs block">
                    Choose File or Drag & Drop
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supports TXT, Markdown (.md), PDF notes, EPUB, JSON
                  </span>
                </div>
                {importFileFeedback && (
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/40">
                    ✓ {importFileFeedback}
                  </span>
                )}
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Book / Document Title</label>
                <input
                  type="text"
                  required
                  value={importTitle}
                  onChange={(e) => setImportTitle(e.target.value)}
                  placeholder="e.g. Modern Computational Robotics"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Author</label>
                  <input
                    type="text"
                    value={importAuthor}
                    onChange={(e) => setImportAuthor(e.target.value)}
                    placeholder="e.g. Dr. Ada Lovelace"
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Subject</label>
                  <select
                    value={importSubject}
                    onChange={(e) => setImportSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Physics">Physics</option>
                    <option value="Cognitive Science">Cognitive Science</option>
                    <option value="Engineering">Engineering</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Textbook Manuscript / Content
                </label>
                <textarea
                  required
                  rows={5}
                  value={importContent}
                  onChange={(e) => setImportContent(e.target.value)}
                  placeholder="Paste chapter text or article content here. Separate paragraphs with double newlines..."
                  className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!importTitle && !importContent) return;
                      handleCreateBook({ preventDefault: () => {} } as any);
                      setShowVisualModal(true);
                      setVisualTopic(importTitle || 'Uploaded Coursework');
                      setVisualExcerpt(importContent);
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 border border-amber-500/30"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Visual Explain</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!importTitle && !importContent) return;
                      handleCreateBook({ preventDefault: () => {} } as any);
                      setShowMangaModal(true);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-xs flex items-center gap-1.5 border border-rose-500/30"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Cartoon Animate</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowImportModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-md shadow-indigo-600/30"
                  >
                    Save to Library
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manga / Cartoon Animation Modal */}
      {showMangaModal && currentChapter && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex items-center justify-center animate-in fade-in">
          <div className="w-full max-w-5xl rounded-3xl bg-slate-900 border border-purple-500/30 p-4 sm:p-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setShowMangaModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors z-30 shadow-md"
              title="Close Cartoon Viewer"
            >
              <X className="w-5 h-5" />
            </button>
            <MangaAnimationView
              initialTopic={currentChapter.title}
              initialContent={currentChapter.content.join('\n')}
              onClose={() => setShowMangaModal(false)}
            />
          </div>
        </div>
      )}

      {/* Visual Explanation Modal */}
      {showVisualModal && (
        <VisualExplanationModal
          initialTopic={visualTopic || currentChapter?.title || activeBook?.title || 'Academic Concept'}
          initialExcerpt={visualExcerpt || currentChapter?.content?.join('\n') || ''}
          subject={activeBook?.subject || 'Coursework'}
          onClose={() => setShowVisualModal(false)}
        />
      )}
    </div>
  );
};
