import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { QuizQuestion } from '../types';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Award,
  Layers,
  Brain,
} from 'lucide-react';

export const QuizMasterView: React.FC = () => {
  const {
    topics,
    quizResults,
    saveQuizResult,
    triggerReformatTopic,
    setActiveView,
  } = useApp();

  const [selectedTopic, setSelectedTopic] = useState('Derivatives & Chain Rule');
  const [selectedSubject, setSelectedSubject] = useState('Mathematics');
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 1,
      question: 'What is the derivative of f(x) = sin(x²)?',
      options: ['cos(x²)', '2x · cos(x²)', '-2x · cos(x²)', '2x · sin(x)'],
      correctOptionIndex: 1,
      explanation: 'By the Chain Rule, d/dx[f(g(x))] = f\'(g(x)) · g\'(x). The outer derivative is cos(x²) and the inner derivative of x² is 2x.',
    },
    {
      id: 2,
      question: 'If a car travel distance is s(t) = 3t² + 2t, what is its instantaneous velocity at t = 3 seconds?',
      options: ['20 m/s', '18 m/s', '26 m/s', '38 m/s'],
      correctOptionIndex: 0,
      explanation: 'Velocity is the first derivative of position: v(t) = s\'(t) = 6t + 2. At t = 3, v(3) = 6(3) + 2 = 20 m/s.',
    },
    {
      id: 3,
      question: 'Which condition must hold for a function f(x) to have a critical point at x = c?',
      options: ['f\'(c) = 0 or f\'(c) is undefined', 'f\'\'(c) > 0', 'f(c) = 0', 'f(x) must be discontinuous at c'],
      correctOptionIndex: 0,
      explanation: 'A critical point of a function f occurs at any point c where either f\'(c) = 0 or f\'(c) does not exist.',
    },
  ]);

  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [scoreResult, setScoreResult] = useState<{
    score: number;
    total: number;
    accuracy: number;
    adaptiveAction: string;
  } | null>(null);

  const handleGenerateQuiz = async (topicName: string, subjectName: string) => {
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setScoreResult(null);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicName,
          subject: subjectName,
          difficulty: 'Medium',
        }),
      });

      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      }
    } catch (err) {
      console.error('Quiz generation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (qId: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
  };

  const handleSubmitQuiz = async () => {
    let score = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        score += 1;
      }
    });

    const saved = await saveQuizResult({
      topicName: selectedTopic,
      subject: selectedSubject,
      score,
      totalQuestions: questions.length,
    });

    setScoreResult({
      score,
      total: questions.length,
      accuracy: saved.accuracy,
      adaptiveAction: saved.adaptiveAction,
    });

    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              QuizMaster AI
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              3-Question Rapid Recall
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Instant diagnostic checks that immediately update the adaptive study planner.
          </p>
        </div>

        {/* Topic picker */}
        <div className="flex items-center gap-2">
          <select
            value={selectedTopic}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedTopic(val);
              const found = topics.find((t) => t.name === val);
              const subj = found ? found.subject : 'General';
              setSelectedSubject(subj);
              handleGenerateQuiz(val, subj);
            }}
            className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.name}>
                {t.subject} — {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quiz Area */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Diagnostic Assessment
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              {selectedTopic}
            </h3>
          </div>

          <button
            onClick={() => handleGenerateQuiz(selectedTopic, selectedSubject)}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Regenerate Questions</span>
          </button>
        </div>

        {/* Questions list */}
        <div className="space-y-6">
          {questions.map((q, qIndex) => {
            const isAnswered = selectedAnswers[q.id] !== undefined;
            const chosen = selectedAnswers[q.id];
            const isCorrect = chosen === q.correctOptionIndex;

            return (
              <div key={q.id} className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs flex items-center justify-center shrink-0 border border-indigo-200 dark:border-indigo-800">
                    {qIndex + 1}
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </p>
                </div>

                {/* 4 Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8">
                  {q.options.map((opt, optIndex) => {
                    let optionStyle =
                      'border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-200';

                    if (isSubmitted) {
                      if (optIndex === q.correctOptionIndex) {
                        optionStyle =
                          'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                      } else if (chosen === optIndex && !isCorrect) {
                        optionStyle =
                          'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300';
                      }
                    } else if (chosen === optIndex) {
                      optionStyle =
                        'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold';
                    }

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(q.id, optIndex)}
                        className={`text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {isSubmitted && optIndex === q.correctOptionIndex && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 ml-2" />
                        )}
                        {isSubmitted && chosen === optIndex && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on submission */}
                {isSubmitted && (
                  <div className="ml-8 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
                    <strong className="text-indigo-600 dark:text-indigo-400">Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Submit or Score Banner */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
          {!isSubmitted ? (
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {Object.keys(selectedAnswers).length} of {questions.length} answered
              </span>
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < questions.length}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
              >
                Submit & Calculate Score
              </button>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span className="text-base font-extrabold">
                    Quiz Score: {scoreResult?.score}/{scoreResult?.total} ({scoreResult?.accuracy}%)
                  </span>
                </div>
                <p className="text-xs text-indigo-200 mt-1">
                  <strong>Adaptive Logic: </strong>
                  {scoreResult?.adaptiveAction}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {scoreResult && scoreResult.accuracy < 80 && (
                  <button
                    onClick={() => triggerReformatTopic(selectedTopic, selectedSubject)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try Reformat Engine</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
