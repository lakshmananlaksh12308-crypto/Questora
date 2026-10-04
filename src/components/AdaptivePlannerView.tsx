import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TimetableSlot } from '../types';
import {
  Calendar,
  Clock,
  Sparkles,
  Download,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Shield,
  Coffee,
  HelpCircle,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const AdaptivePlannerView: React.FC = () => {
  const {
    subjects,
    user,
    startFocusSession,
    triggerReformatTopic,
    setActiveView,
  } = useApp();

  const [examDate, setExamDate] = useState('2026-10-15');
  const [availableHours, setAvailableHours] = useState(4);
  const [preferredTime, setPreferredTime] = useState('6:00 PM');
  const [dailyGoal, setDailyGoal] = useState(8);
  const [breakPreference, setBreakPreference] = useState('15-minute micro break');
  const [isGenerating, setIsGenerating] = useState(false);

  // Active timetable state
  const [timetable, setTimetable] = useState<TimetableSlot[]>([
    {
      time: '6:00 PM',
      activity: 'Mathematics — Derivatives & Chain Rule Deep Dive',
      type: 'study',
      duration: 45,
      subject: 'Mathematics',
      taskId: 'task-1',
    },
    {
      time: '6:45 PM',
      activity: 'Cognitive Reset & Hydration Break (Reward)',
      type: 'break',
      duration: 15,
      subject: 'Rest',
      taskId: 'break-1',
    },
    {
      time: '7:00 PM',
      activity: 'Physics — Electromagnetic Induction & Lenz Law',
      type: 'study',
      duration: 45,
      subject: 'Physics',
      taskId: 'task-2',
    },
    {
      time: '7:45 PM',
      activity: 'QuizMaster Check — 3-Question Active Recall',
      type: 'quiz',
      duration: 15,
      subject: 'Physics',
      taskId: 'quiz-1',
    },
    {
      time: '8:00 PM',
      activity: 'Active Spaced-Repetition Revision & Notes Reformat',
      type: 'revision',
      duration: 30,
      subject: 'Mathematics',
      taskId: 'rev-1',
    },
  ]);

  const [planSummary, setPlanSummary] = useState(
    'Timetable dynamically optimized for peak focus periods and spaced-repetition retention.'
  );

  const handleGeneratePlan = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/planner/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examDate,
          availableHours,
          subjects: subjects.map((s) => s.name),
          preferredTime,
          dailyGoal,
          breakPreference,
        }),
      });

      const data = await res.json();
      if (data.schedule) {
        setTimetable(data.schedule);
      }
      if (data.summary) {
        setPlanSummary(data.summary);
      }
    } catch (err) {
      console.error('Failed to generate adaptive plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Standard Calendar Export (.ics format)
  const exportToCalendar = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');

    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QUESTORA//Adaptive Planner//EN',
      'CALSCALE:GREGORIAN',
    ];

    timetable.forEach((slot, index) => {
      const uid = `questora-${Date.now()}-${index}@questora.ai`;
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `SUMMARY:QUESTORA: ${slot.activity}`,
        `DESCRIPTION:Type: ${slot.type} | Duration: ${slot.duration}m | Subject: ${slot.subject}`,
        `DTSTART:${dateStr}T180000Z`,
        `DTEND:${dateStr}T184500Z`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'focusflow-adaptive-schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Adaptive AI Planner
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              Spaced Repetition
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Dynamic scheduling that automatically shifts when tasks are completed, scores drop, or exams near.
          </p>
        </div>

        <button
          onClick={exportToCalendar}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export .ICS Calendar</span>
        </button>
      </div>

      {/* Inputs Configuration Form */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Sliders className="w-3.5 h-3.5" />
          <span>Plan Constraints & Student Preferences</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Available Daily Hours
            </label>
            <input
              type="number"
              min={1}
              max={12}
              value={availableHours}
              onChange={(e) => setAvailableHours(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Preferred Study Start
            </label>
            <input
              type="text"
              value={preferredTime}
              onChange={(e) => setPreferredTime(e.target.value)}
              placeholder="e.g. 6:00 PM"
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Daily Tasks Target
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={dailyGoal}
              onChange={(e) => setDailyGoal(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Break Structure
            </label>
            <select
              value={breakPreference}
              onChange={(e) => setBreakPreference(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="15-minute micro break">15m Micro Break (Recommended)</option>
              <option value="10-minute quick reset">10m Quick Reset</option>
              <option value="20-minute restorative">20m Restorative Walk</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <p className="text-[11px] text-slate-400">
            {planSummary}
          </p>
          <button
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isGenerating ? 'Recalibrating...' : 'Regenerate Adaptive Plan'}</span>
          </button>
        </div>
      </div>

      {/* Generated Adaptive Timetable Visual */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Generated Adaptive Timetable</span>
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">
            Auto-Adapts Live
          </span>
        </div>

        <div className="space-y-3">
          {timetable.map((slot, index) => {
            const isBreak = slot.type === 'break';
            const isQuiz = slot.type === 'quiz';
            const isRevision = slot.type === 'revision';

            return (
              <div
                key={index}
                className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                  isBreak
                    ? 'bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-200'
                    : isQuiz
                    ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-900 dark:text-cyan-200'
                    : isRevision
                    ? 'bg-purple-500/5 border-purple-500/20 text-purple-900 dark:text-purple-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-20 font-mono text-xs font-bold text-slate-900 dark:text-white shrink-0">
                    {slot.time}
                  </div>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {isBreak ? (
                      <Coffee className="w-4 h-4 text-amber-500" />
                    ) : isQuiz ? (
                      <HelpCircle className="w-4 h-4 text-cyan-500" />
                    ) : isRevision ? (
                      <RotateCcw className="w-4 h-4 text-purple-500" />
                    ) : (
                      <BookOpen className="w-4 h-4 text-indigo-500" />
                    )}
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {slot.activity}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{slot.subject}</span>
                      <span>•</span>
                      <span>{slot.duration} mins</span>
                      <span>•</span>
                      <span className="uppercase font-semibold tracking-wider text-indigo-600 dark:text-indigo-400">
                        {slot.type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {slot.type === 'study' && (
                    <button
                      onClick={() =>
                        startFocusSession({
                          id: slot.taskId,
                          userId: 'demo-student-001',
                          title: slot.activity,
                          subject: slot.subject,
                          difficulty: 'Medium',
                          status: 'pending',
                          confidence: 50,
                          priority: 'High',
                        })
                      }
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                    >
                      Start Focus
                    </button>
                  )}
                  {slot.type === 'quiz' && (
                    <button
                      onClick={() => setActiveView('quiz')}
                      className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                    >
                      Launch Quiz
                    </button>
                  )}
                  {slot.type === 'revision' && (
                    <button
                      onClick={() => triggerReformatTopic(slot.activity, slot.subject)}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                    >
                      Reformat Engine
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adaptive Trigger Rules Card */}
      <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60 p-4">
        <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2">
          Adaptive Trigger Mechanics
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-indigo-800 dark:text-indigo-200">
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-200/50">
            <strong>Task Missed / Low Rating:</strong> Automatically shifts schedule to insert a 20-minute recovery block next day.
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-200/50">
            <strong>Quiz &lt; 50%:</strong> Freezes forward progression and injects Reformat Engine visual explanations.
          </div>
          <div className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-indigo-200/50">
            <strong>Exam Proximity:</strong> Proportion of revision blocks increases linearly from 20% to 60% as date approaches.
          </div>
        </div>
      </div>
    </div>
  );
};
