import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserProfile,
  SubjectItem,
  TopicItem,
  TaskItem,
  StudySessionItem,
  QuizResultItem,
  SessionState,
  AchievementItem,
  DailyBriefing,
  Language,
} from '../types';
import { auth, db } from '../firebase/config';
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import confetti from 'canvas-confetti';

interface AppContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  activeView: string;
  setActiveView: (view: string) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  preferredLanguage: Language;
  setPreferredLanguage: (lang: Language) => void;
  // Domain Data
  subjects: SubjectItem[];
  topics: TopicItem[];
  tasks: TaskItem[];
  studySessions: StudySessionItem[];
  quizResults: QuizResultItem[];
  achievements: AchievementItem[];
  sessionState: SessionState;
  dailyBriefing: DailyBriefing;
  activeTask: TaskItem | null;
  setActiveTask: (task: TaskItem | null) => void;
  // Auth State & Actions
  isAuthenticated: boolean;
  isGuestMode: boolean;
  authError: string | null;
  setAuthError: (err: string | null) => void;
  signInGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  sendResetPassword: (email: string) => Promise<void>;
  signOutAccount: () => Promise<void>;
  enterDemoMode: () => void;
  useGuestMode: () => void;
  completeTask: (taskId: string) => Promise<void>;
  startFocusSession: (task?: TaskItem | null) => void;
  endFocusSession: () => void;
  startRewardBreak: (minutes?: number) => void;
  endRewardBreak: () => void;
  submitSessionFeedback: (data: {
    topic: string;
    subject: string;
    duration: number;
    understanding: number;
    mood: number;
    confidence: number;
    difficulty: number;
  }) => Promise<any>;
  saveQuizResult: (result: {
    topicName: string;
    subject: string;
    score: number;
    totalQuestions: number;
    topicId?: string;
  }) => Promise<{ accuracy: number; adaptiveAction: string }>;
  updateSyllabusData: (subjects: SubjectItem[], topics: TopicItem[]) => void;
  triggerReformatTopic: (topicName: string, subjectName?: string) => void;
  selectedReformatTopic: { topic: string; subject: string } | null;
  setSelectedReformatTopic: (val: { topic: string; subject: string } | null) => void;
  updateUserDailyGoal: (total: number, rewardMins: number) => void;
  demoStep: number;
  setDemoStep: React.Dispatch<React.SetStateAction<number>>;
  isDemoActive: boolean;
  setIsDemoActive: (val: boolean) => void;
  resetToDemoDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Seed Data matching prompt specifications
const INITIAL_USER: UserProfile = {
  uid: 'demo-student-001',
  email: 'student@focusflow.ai',
  displayName: 'Alex Chen',
  preferredLanguage: 'Tanglish',
  xp: 1250,
  level: 5,
  streak: 7,
  dailyGoalTotal: 8,
  dailyGoalCompleted: 5,
  rewardDurationMinutes: 15,
};

const INITIAL_SUBJECTS: SubjectItem[] = [
  { id: 'sub-math', userId: 'demo-student-001', name: 'Mathematics', totalTopics: 12, completedTopics: 8, confidence: 68, progressPercent: 72, examDate: 'Oct 15' },
  { id: 'sub-phys', userId: 'demo-student-001', name: 'Physics', totalTopics: 15, completedTopics: 7, confidence: 51, progressPercent: 54, examDate: 'Oct 22' },
  { id: 'sub-prog', userId: 'demo-student-001', name: 'Programming', totalTopics: 10, completedTopics: 8, confidence: 82, progressPercent: 86, examDate: 'Nov 04' },
];

const INITIAL_TOPICS: TopicItem[] = [
  {
    id: 'top-1',
    userId: 'demo-student-001',
    subject: 'Mathematics',
    unit: 'Calculus',
    chapter: 'Differentiation',
    name: 'Derivatives & Chain Rule',
    difficulty: 'Hard',
    status: 'Needs Revision',
    confidence: 42,
    priority: 'High',
    revisionDate: 'Tomorrow',
  },
  {
    id: 'top-2',
    userId: 'demo-student-001',
    subject: 'Physics',
    unit: 'Electromagnetism',
    chapter: 'Field Dynamics',
    name: 'Electromagnetic Induction',
    difficulty: 'Hard',
    status: 'Needs Revision',
    confidence: 38,
    priority: 'High',
    revisionDate: 'Tomorrow',
  },
  {
    id: 'top-3',
    userId: 'demo-student-001',
    subject: 'Mathematics',
    unit: 'Calculus',
    chapter: 'Integration',
    name: 'Integration by Parts',
    difficulty: 'Hard',
    status: 'Needs Revision',
    confidence: 48,
    priority: 'High',
    revisionDate: 'In 2 days',
  },
  {
    id: 'top-4',
    userId: 'demo-student-001',
    subject: 'Programming',
    unit: 'Algorithms',
    chapter: 'Dynamic Programming',
    name: 'Memoization & Tabulation',
    difficulty: 'Hard',
    status: 'In Progress',
    confidence: 65,
    priority: 'Medium',
    revisionDate: 'In 3 days',
  },
  {
    id: 'top-5',
    userId: 'demo-student-001',
    subject: 'Physics',
    unit: 'Quantum Physics',
    chapter: 'Photoelectric Effect',
    name: 'Wave-Particle Duality',
    difficulty: 'Medium',
    status: 'In Progress',
    confidence: 62,
    priority: 'Medium',
    revisionDate: 'In 4 days',
  },
  {
    id: 'top-6',
    userId: 'demo-student-001',
    subject: 'Programming',
    unit: 'Data Structures',
    chapter: 'Trees',
    name: 'Binary Search Trees',
    difficulty: 'Medium',
    status: 'Mastered',
    confidence: 90,
    priority: 'Low',
    revisionDate: 'In 1 week',
  },
];

const INITIAL_TASKS: TaskItem[] = [
  { id: 'task-1', userId: 'demo-student-001', title: 'Calculus: Derivatives Practice', subject: 'Mathematics', difficulty: 'Hard', status: 'completed', confidence: 42, priority: 'High', timeSlot: '9:00 AM', estimatedMinutes: 45, completedAt: '2026-09-29T09:45:00Z' },
  { id: 'task-2', userId: 'demo-student-001', title: 'Physics: Faraday Law Problems', subject: 'Physics', difficulty: 'Hard', status: 'completed', confidence: 45, priority: 'High', timeSlot: '11:00 AM', estimatedMinutes: 40, completedAt: '2026-09-29T11:40:00Z' },
  { id: 'task-3', userId: 'demo-student-001', title: 'Data Structures: Tree Traversal', subject: 'Programming', difficulty: 'Medium', status: 'completed', confidence: 85, priority: 'Medium', timeSlot: '1:30 PM', estimatedMinutes: 30, completedAt: '2026-09-29T14:00:00Z' },
  { id: 'task-4', userId: 'demo-student-001', title: 'Quick Quiz: Derivatives Check', subject: 'Mathematics', difficulty: 'Medium', status: 'completed', confidence: 50, priority: 'High', timeSlot: '3:00 PM', estimatedMinutes: 15, completedAt: '2026-09-29T15:15:00Z' },
  { id: 'task-5', userId: 'demo-student-001', title: 'Physics: Lenz Law & Flux Notes', subject: 'Physics', difficulty: 'Medium', status: 'completed', confidence: 60, priority: 'Medium', timeSlot: '4:15 PM', estimatedMinutes: 35, completedAt: '2026-09-29T14:50:00Z' },
  { id: 'task-6', userId: 'demo-student-001', title: 'Deep Focus: Integration by Parts', subject: 'Mathematics', difficulty: 'Hard', status: 'pending', confidence: 45, priority: 'High', timeSlot: '6:00 PM', estimatedMinutes: 45 },
  { id: 'task-7', userId: 'demo-student-001', title: 'Algorithm Memoization Exercise', subject: 'Programming', difficulty: 'Hard', status: 'pending', confidence: 65, priority: 'Medium', timeSlot: '7:00 PM', estimatedMinutes: 45 },
  { id: 'task-8', userId: 'demo-student-001', title: 'Evening Active Spaced Revision', subject: 'Mathematics', difficulty: 'Medium', status: 'pending', confidence: 55, priority: 'Low', timeSlot: '8:15 PM', estimatedMinutes: 30 },
];

const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  { id: 'ach-1', userId: 'demo-student-001', code: 'streak_7', title: '7-Day Streak', description: 'Maintained 7 consecutive days of focused study', icon: '🔥', isUnlocked: true, unlockedAt: 'Yesterday' },
  { id: 'ach-2', userId: 'demo-student-001', code: 'quiz_master', title: 'Quiz Master', description: 'Scored 100% on 3 consecutive topic quizzes', icon: '🧠', isUnlocked: true, unlockedAt: '2 days ago' },
  { id: 'ach-3', userId: 'demo-student-001', code: 'revision_hero', title: 'Revision Hero', description: 'Completed 5 scheduled spaced-repetition revisions', icon: '📚', isUnlocked: true, unlockedAt: '3 days ago' },
  { id: 'ach-4', userId: 'demo-student-001', code: 'goal_crusher', title: 'Goal Crusher', description: 'Completed 8 daily study tasks in a single day', icon: '🎯', isUnlocked: false },
  { id: 'ach-5', userId: 'demo-student-001', code: 'lockdin_pro', title: 'LOCKDIN Flow State', description: 'Accumulated 10 hours of distraction-free focus mode', icon: '⚡', isUnlocked: true, unlockedAt: 'Yesterday' },
];

const INITIAL_QUIZ_RESULTS: QuizResultItem[] = [
  { id: 'q-1', userId: 'demo-student-001', topicName: 'Derivatives & Chain Rule', subject: 'Mathematics', score: 2, totalQuestions: 3, accuracyPercent: 66, adaptiveAction: 'Topic kept in active revision cycle', completedAt: '2 hours ago' },
  { id: 'q-2', userId: 'demo-student-001', topicName: 'Binary Search Trees', subject: 'Programming', score: 3, totalQuestions: 3, accuracyPercent: 100, adaptiveAction: 'Progressed to advanced balancing', completedAt: 'Yesterday' },
  { id: 'q-3', userId: 'demo-student-001', topicName: 'Faraday Law & Flux', subject: 'Physics', score: 1, totalQuestions: 3, accuracyPercent: 33, adaptiveAction: 'Scheduled urgent 20-min revision', completedAt: 'Yesterday' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(INITIAL_USER);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('Tanglish');

  const [subjects, setSubjects] = useState<SubjectItem[]>(INITIAL_SUBJECTS);
  const [topics, setTopics] = useState<TopicItem[]>(INITIAL_TOPICS);
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [studySessions, setStudySessions] = useState<StudySessionItem[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResultItem[]>(INITIAL_QUIZ_RESULTS);
  const [achievements, setAchievements] = useState<AchievementItem[]>(INITIAL_ACHIEVEMENTS);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [selectedReformatTopic, setSelectedReformatTopic] = useState<{ topic: string; subject: string } | null>({
    topic: 'Derivatives & Chain Rule',
    subject: 'Mathematics',
  });

  const [sessionState, setSessionState] = useState<SessionState>({
    userId: 'user-default',
    isStudyMode: false,
    rewardBreakActive: false,
    activeTimer: 1500, // 25 min default
    currentTaskId: 'task-6',
    rewardDurationMinutes: 15,
    updatedAt: new Date().toISOString(),
  });

  const [dailyBriefing] = useState<DailyBriefing>({
    greeting: 'Good morning! 👋',
    message: 'Your AI study briefing for today:',
    taskCount: 8,
    attentionSubject: 'Mathematics',
    accuracyNote: 'Recent quiz accuracy was 54% in Calculus differentiation.',
    strongestSubject: 'Programming (86% mastery)',
    recommendedFocusMinutes: 90,
  });

  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  const isAuthenticated = !!firebaseUser || isGuestMode;

  // Sync Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        setIsGuestMode(false);
        // Load or create user profile in Firestore
        const userRef = doc(db, 'users', fUser.uid);
        try {
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data() as UserProfile;
            setUser(data);
            setPreferredLanguage(data.preferredLanguage || 'Tanglish');
          } else {
            const newUser: UserProfile = {
              uid: fUser.uid,
              email: fUser.email || 'student@questora.ai',
              displayName: fUser.displayName || 'QUESTORA Student',
              preferredLanguage: 'Tanglish',
              xp: 200,
              level: 1,
              streak: 1,
              dailyGoalTotal: 8,
              dailyGoalCompleted: 0,
              rewardDurationMinutes: 15,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userRef, newUser);
            setUser(newUser);
          }
        } catch (error) {
          console.warn('Firestore user fetch failed, fallback to local user', error);
          setUser({
            uid: fUser.uid,
            email: fUser.email || 'student@questora.ai',
            displayName: fUser.displayName || 'QUESTORA Student',
            preferredLanguage: 'Tanglish',
            xp: 250,
            level: 1,
            streak: 1,
            dailyGoalTotal: 8,
            dailyGoalCompleted: 0,
            rewardDurationMinutes: 15,
          });
        }
      } else {
        setIsGuestMode(true);
        setUser((prev) => prev || INITIAL_USER);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isGuestMode]);

  // Listen to Firestore sessionState if logged in with real auth
  useEffect(() => {
    if (!firebaseUser) return;
    const sessionDocRef = doc(db, 'sessionState', firebaseUser.uid);
    const unsub = onSnapshot(
      sessionDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as SessionState;
          setSessionState(data);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `sessionState/${firebaseUser.uid}`);
      }
    );
    return () => unsub();
  }, [firebaseUser]);

  // Sync state changes to Firestore sessionState (Chrome Extension bridge)
  const syncSessionToFirestore = async (newState: SessionState) => {
    setSessionState(newState);
    if (firebaseUser) {
      try {
        await setDoc(doc(db, 'sessionState', firebaseUser.uid), newState, { merge: true });
      } catch (err) {
        console.warn('Extension SessionState sync error:', err);
      }
    }
  };

  const signInGoogle = async () => {
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Google Sign-in error:', err);
      const msg = err.message || 'Google sign-in was cancelled or encountered an error.';
      setAuthError(msg);
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      console.error('Email sign-in error:', err);
      let msg = err.message || 'Failed to sign in with email and password.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password sign-in is not enabled in Firebase Console. Please enable Email/Password provider in the Firebase Console under Authentication > Sign-in method, or use Google Sign-In.';
      } else if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password. Please verify your credentials or create a new account.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    setAuthError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      const userRef = doc(db, 'users', userCredential.user.uid);
      const newUser: UserProfile = {
        uid: userCredential.user.uid,
        email: userCredential.user.email || email,
        displayName: displayName || userCredential.user.displayName || 'QUESTORA Student',
        preferredLanguage: 'Tanglish',
        xp: 150,
        level: 1,
        streak: 1,
        dailyGoalTotal: 8,
        dailyGoalCompleted: 0,
        rewardDurationMinutes: 15,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      try {
        await setDoc(userRef, newUser);
      } catch (e) {
        console.warn('Could not write profile to Firestore:', e);
      }
      setUser(newUser);
    } catch (err: any) {
      console.error('Email sign-up error:', err);
      let msg = err.message || 'Failed to create account.';
      if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password accounts are not enabled in Firebase Console. Please enable Email/Password provider in the Firebase Console under Authentication > Sign-in method, or use Google Sign-In.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered. Please sign in instead.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setAuthError(msg);
      throw new Error(msg);
    }
  };

  const sendResetPassword = async (email: string) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setAuthError(err.message || 'Failed to send password reset email.');
      throw err;
    }
  };

  const signOutAccount = async () => {
    try {
      await signOut(auth);
      setFirebaseUser(null);
      setUser(null);
      setIsGuestMode(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const enterDemoMode = () => {
    setIsGuestMode(true);
    setUser(INITIAL_USER);
    setSubjects(INITIAL_SUBJECTS);
    setTopics(INITIAL_TOPICS);
    setTasks(INITIAL_TASKS);
    setQuizResults(INITIAL_QUIZ_RESULTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
  };

  const useGuestMode = () => {
    enterDemoMode();
  };

  const resetToDemoDefaults = () => {
    setIsGuestMode(true);
    setUser({ ...INITIAL_USER, dailyGoalCompleted: 5 });
    setSubjects(INITIAL_SUBJECTS);
    setTopics(INITIAL_TOPICS);
    setTasks(INITIAL_TASKS);
    setQuizResults(INITIAL_QUIZ_RESULTS);
    setAchievements(INITIAL_ACHIEVEMENTS);
    setDemoStep(0);
    setIsDemoActive(false);
  };

  // Complete a Task
  const completeTask = async (taskId: string) => {
    let completedItem: TaskItem | null = null;
    const updatedTasks = tasks.map((t) => {
      if (t.id === taskId) {
        completedItem = { ...t, status: 'completed' as const, completedAt: new Date().toISOString() };
        return completedItem;
      }
      return t;
    });

    setTasks(updatedTasks);

    // Micro & Macro Logic
    const newCompletedCount = (user?.dailyGoalCompleted || 0) + 1;
    const gainedXp = 60;
    const newTotalXp = (user?.xp || 0) + gainedXp;
    const newLevel = Math.floor(newTotalXp / 300) + 1;

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
      });
    } catch (e) {
      // ignore
    }

    if (user) {
      const updatedUser: UserProfile = {
        ...user,
        dailyGoalCompleted: newCompletedCount,
        xp: newTotalXp,
        level: newLevel,
      };
      setUser(updatedUser);

      // Check if daily goal crusher unlocked
      if (newCompletedCount >= updatedUser.dailyGoalTotal) {
        setAchievements((prev) =>
          prev.map((a) => (a.code === 'goal_crusher' ? { ...a, isUnlocked: true, unlockedAt: 'Just now' } : a))
        );
      }
    }

    // Auto-unlock configurable micro reward break (default 15 minutes)
    startRewardBreak(user?.rewardDurationMinutes || 15);
  };

  const startFocusSession = (task?: TaskItem | null) => {
    const currentTask = task || tasks.find((t) => t.status === 'pending') || null;
    setActiveTask(currentTask);
    const updated: SessionState = {
      ...sessionState,
      isStudyMode: true,
      rewardBreakActive: false,
      currentTaskId: currentTask ? currentTask.id : '',
      activeTimer: 1500, // 25 mins
      updatedAt: new Date().toISOString(),
    };
    syncSessionToFirestore(updated);
    setActiveView('focus');
  };

  const endFocusSession = () => {
    const updated: SessionState = {
      ...sessionState,
      isStudyMode: false,
      updatedAt: new Date().toISOString(),
    };
    syncSessionToFirestore(updated);
  };

  const startRewardBreak = (minutes?: number) => {
    const mins = minutes || user?.rewardDurationMinutes || 15;
    const updated: SessionState = {
      ...sessionState,
      isStudyMode: false,
      rewardBreakActive: true,
      activeTimer: mins * 60,
      rewardDurationMinutes: mins,
      updatedAt: new Date().toISOString(),
    };
    syncSessionToFirestore(updated);
  };

  const endRewardBreak = () => {
    const updated: SessionState = {
      ...sessionState,
      rewardBreakActive: false,
      isStudyMode: true, // Auto-return to study state until daily goal completed
      activeTimer: 1500,
      updatedAt: new Date().toISOString(),
    };
    syncSessionToFirestore(updated);
  };

  // SmartStudy AI Session Feedback (understanding, mood, confidence, difficulty)
  const submitSessionFeedback = async (data: {
    topic: string;
    subject: string;
    duration: number;
    understanding: number;
    mood: number;
    confidence: number;
    difficulty: number;
  }) => {
    try {
      const response = await fetch('/api/study/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: data.topic,
          subject: data.subject,
          understandingRating: data.understanding,
          moodRating: data.mood,
          confidenceRating: data.confidence,
          difficultyRating: data.difficulty,
        }),
      });

      const result = await response.json();

      const newSession: StudySessionItem = {
        id: `sess-${Date.now()}`,
        userId: user?.uid || 'demo-user',
        subject: data.subject,
        topic: data.topic,
        durationMinutes: data.duration,
        understandingRating: data.understanding,
        moodRating: data.mood,
        confidenceRating: data.confidence,
        difficultyRating: data.difficulty,
        aiRecommendation: result.recommendation,
        createdAt: new Date().toISOString(),
      };

      setStudySessions((prev) => [newSession, ...prev]);

      // Adapt topics list
      setTopics((prev) =>
        prev.map((t) => {
          if (t.name.toLowerCase().includes(data.topic.toLowerCase()) || data.topic.toLowerCase().includes(t.name.toLowerCase())) {
            const needsRevision = data.understanding <= 2;
            return {
              ...t,
              status: needsRevision ? 'Needs Revision' : 'Mastered',
              confidence: result.adjustedConfidence || (data.understanding * 18),
              revisionDate: result.scheduledRevision || (needsRevision ? 'Tomorrow' : 'In 5 days'),
            };
          }
          return t;
        })
      );

      // Reward XP (+40 XP)
      if (user) {
        setUser({ ...user, xp: user.xp + 40 });
      }

      return result;
    } catch (err) {
      console.error('Failed to submit session feedback:', err);
      return {
        recommendation: `${data.topic} needs additional revision. Scheduled a 20-minute revision session tomorrow.`,
        scheduledRevision: 'Tomorrow, 20 mins',
      };
    }
  };

  // QuizMaster AI Result
  const saveQuizResult = async (result: {
    topicName: string;
    subject: string;
    score: number;
    totalQuestions: number;
    topicId?: string;
  }) => {
    const accuracy = Math.round((result.score / result.totalQuestions) * 100);
    let adaptiveAction = '';

    if (accuracy < 50) {
      adaptiveAction = 'Score < 50%: Scheduled extra revision & triggered Reformat Engine';
    } else if (accuracy < 80) {
      adaptiveAction = 'Score 50–79%: Kept topic in spaced revision cycle';
    } else {
      adaptiveAction = 'Score ≥ 80%: Mastered! Allowed progression to next topic';
    }

    const newResult: QuizResultItem = {
      id: `quiz-${Date.now()}`,
      userId: user?.uid || 'demo-user',
      topicId: result.topicId,
      topicName: result.topicName,
      subject: result.subject,
      score: result.score,
      totalQuestions: result.totalQuestions,
      accuracyPercent: accuracy,
      adaptiveAction,
      completedAt: 'Just now',
    };

    setQuizResults((prev) => [newResult, ...prev]);

    // Update topic status based on adaptive logic
    setTopics((prev) =>
      prev.map((t) => {
        if (t.name.toLowerCase().includes(result.topicName.toLowerCase())) {
          return {
            ...t,
            status: accuracy >= 80 ? 'Mastered' : 'Needs Revision',
            confidence: Math.round(accuracy * 0.9),
            revisionDate: accuracy < 50 ? 'Tomorrow' : accuracy < 80 ? 'In 3 days' : 'In 1 week',
          };
        }
        return t;
      })
    );

    // Gamification XP (+50 XP if good, +25 if tried)
    const earnedXp = accuracy >= 80 ? 75 : 35;
    if (user) {
      setUser({ ...user, xp: user.xp + earnedXp });
    }

    if (accuracy >= 80) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    return { accuracy, adaptiveAction };
  };

  const updateSyllabusData = (newSubjects: SubjectItem[], newTopics: TopicItem[]) => {
    setSubjects(newSubjects);
    setTopics(newTopics);
  };

  const triggerReformatTopic = (topicName: string, subjectName = 'General') => {
    setSelectedReformatTopic({ topic: topicName, subject: subjectName });
    setActiveView('reformat');
  };

  const updateUserDailyGoal = (total: number, rewardMins: number) => {
    if (user) {
      const updated = { ...user, dailyGoalTotal: total, rewardDurationMinutes: rewardMins };
      setUser(updated);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        activeView,
        setActiveView,
        theme,
        setTheme,
        preferredLanguage,
        setPreferredLanguage,
        subjects,
        topics,
        tasks,
        studySessions,
        quizResults,
        achievements,
        sessionState,
        dailyBriefing,
        activeTask,
        setActiveTask,
        isAuthenticated,
        isGuestMode,
        authError,
        setAuthError,
        signInGoogle,
        signInWithEmail,
        signUpWithEmail,
        sendResetPassword,
        signOutAccount,
        enterDemoMode,
        useGuestMode,
        completeTask,
        startFocusSession,
        endFocusSession,
        startRewardBreak,
        endRewardBreak,
        submitSessionFeedback,
        saveQuizResult,
        updateSyllabusData,
        triggerReformatTopic,
        selectedReformatTopic,
        setSelectedReformatTopic,
        updateUserDailyGoal,
        demoStep,
        setDemoStep,
        isDemoActive,
        setIsDemoActive,
        resetToDemoDefaults,
      }}
    >
      <div className={theme === 'dark' ? 'dark' : ''}>{children}</div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
