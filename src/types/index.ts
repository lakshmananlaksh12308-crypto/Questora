export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Priority = 'High' | 'Medium' | 'Low';
export type TopicStatus = 'Mastered' | 'In Progress' | 'Needs Revision' | 'Pending';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'needs_revision';
export type Language = 'English' | 'Tanglish' | 'Tamil' | 'Hindi' | 'Malayalam' | 'Telugu' | 'Kannada';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  preferredLanguage: Language;
  xp: number;
  level: number;
  streak: number;
  dailyGoalTotal: number;
  dailyGoalCompleted: number;
  rewardDurationMinutes: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectItem {
  id: string;
  userId: string;
  name: string;
  totalTopics: number;
  completedTopics: number;
  confidence: number;
  progressPercent: number;
  examDate?: string;
}

export interface TopicItem {
  id: string;
  userId: string;
  subject: string;
  unit: string;
  chapter: string;
  name: string;
  difficulty: Difficulty;
  status: TopicStatus;
  confidence: number;
  priority: Priority;
  revisionDate: string;
}

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  subject: string;
  difficulty: Difficulty;
  status: TaskStatus;
  confidence: number;
  priority: Priority;
  timeSlot?: string;
  estimatedMinutes?: number;
  completedAt?: string;
}

export interface StudySessionItem {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  durationMinutes: number;
  understandingRating: number; // 1-5
  moodRating: number; // 1-5
  confidenceRating: number; // 1-5
  difficultyRating: number; // 1-5
  aiRecommendation?: string;
  createdAt: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizResultItem {
  id: string;
  userId: string;
  topicId?: string;
  topicName: string;
  subject: string;
  score: number;
  totalQuestions: number;
  accuracyPercent: number;
  adaptiveAction: string;
  completedAt: string;
}

export interface SessionState {
  userId: string;
  isStudyMode: boolean;
  rewardBreakActive: boolean;
  activeTimer: number; // seconds remaining
  currentTaskId: string;
  rewardDurationMinutes: number;
  updatedAt: string;
}

export interface AchievementItem {
  id: string;
  userId: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface ReformatPerspective {
  title: string;
  diagram?: string;
  breakdown?: string[];
  keyTakeaway?: string;
  steps?: { step: number; statement: string; reason: string }[];
  formulaOrRule?: string;
  conclusion?: string;
  analogy?: string;
  narrative?: string;
  moral?: string;
}

export interface ReformatContent {
  topic: string;
  language: string;
  visual: ReformatPerspective;
  logical: ReformatPerspective;
  story: ReformatPerspective;
  quickCheckQuestion?: {
    question: string;
    answer: string;
  };
}

export interface TimetableSlot {
  time: string;
  activity: string;
  type: 'study' | 'break' | 'quiz' | 'revision';
  duration: number;
  subject: string;
  taskId: string;
}

export interface DailyBriefing {
  greeting: string;
  message: string;
  taskCount: number;
  attentionSubject: string;
  accuracyNote: string;
  strongestSubject: string;
  recommendedFocusMinutes: number;
}

export interface MangaPanel {
  panelNumber: number;
  character: string;
  avatar: string;
  dialogue: string;
  narration: string;
  sfx: string;
  visualAction: string;
  visualEffect: 'speed_lines' | 'impact_flash' | 'aura_glow' | 'lightning' | 'focus_zoom';
  formula?: string;
  bgTheme?: 'fire' | 'electric' | 'void' | 'aurora' | 'matrix';
}

export interface MangaEpisode {
  title: string;
  subtitle: string;
  conceptTitle: string;
  subject: string;
  characters: { name: string; role: string; avatar: string }[];
  panels: MangaPanel[];
  takeaway: string;
}

export interface CartoonCharacter {
  id: string;
  name: string;
  role: string;
  species: string;
  avatar: string;
  badge: string;
  color: string;
  catchphrase: string;
}

export interface VisualExplanationStep {
  stepNumber: number;
  title: string;
  detail: string;
  visualIcon?: string;
  formula?: string;
}

export interface VisualExplanation {
  title: string;
  summary: string;
  topic: string;
  subject: string;
  diagramType: 'flowchart' | 'graph' | 'formula_breakdown' | 'cartoon_scene' | 'cycle';
  diagramSvg?: string;
  cartoonCharacter: {
    name: string;
    avatar: string;
    expression: 'excited' | 'thinking' | 'teaching' | 'mindblown' | 'cheering';
    dialogue: string;
    tip: string;
  };
  steps: VisualExplanationStep[];
  realWorldAnalogy: string;
  examTakeaway: string;
}

