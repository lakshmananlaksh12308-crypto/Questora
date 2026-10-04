import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  BookOpen,
  Coffee,
  HelpCircle,
  RotateCcw,
  Clock,
  Flag,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { subjects, tasks } = useApp();
  const [selectedDate, setSelectedDate] = useState('2026-09-29');

  const calendarEvents = [
    {
      id: 'ev-1',
      date: '2026-09-29',
      time: '6:00 PM',
      title: 'Mathematics: Derivatives Practice',
      type: 'study',
      subject: 'Mathematics',
      duration: '45 mins',
    },
    {
      id: 'ev-2',
      date: '2026-09-29',
      time: '6:45 PM',
      title: 'Cognitive Recovery Break',
      type: 'break',
      subject: 'Break',
      duration: '15 mins',
    },
    {
      id: 'ev-3',
      date: '2026-09-29',
      time: '7:00 PM',
      title: 'Physics: Faraday Law Problem Solving',
      type: 'study',
      subject: 'Physics',
      duration: '45 mins',
    },
    {
      id: 'ev-4',
      date: '2026-09-29',
      time: '7:45 PM',
      title: 'Quick Recall Quiz: Electromagnetism',
      type: 'quiz',
      subject: 'Physics',
      duration: '15 mins',
    },
    {
      id: 'ev-5',
      date: '2026-09-30',
      time: '6:00 PM',
      title: 'Mathematics: Scheduled Revision on Derivatives',
      type: 'revision',
      subject: 'Mathematics',
      duration: '30 mins',
    },
    {
      id: 'ev-6',
      date: '2026-10-15',
      time: '9:00 AM',
      title: 'Calculus Mid-Term Exam',
      type: 'exam',
      subject: 'Mathematics',
      duration: '3 hours',
    },
    {
      id: 'ev-7',
      date: '2026-10-22',
      time: '9:00 AM',
      title: 'Physics Quantum Exam',
      type: 'exam',
      subject: 'Physics',
      duration: '3 hours',
    },
  ];

  const exportICS = () => {
    let ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//QUESTORA//Study Calendar//EN',
      'CALSCALE:GREGORIAN',
    ];

    calendarEvents.forEach((ev) => {
      const cleanDate = ev.date.replace(/-/g, '');
      ics.push(
        'BEGIN:VEVENT',
        `UID:${ev.id}@questora.ai`,
        `SUMMARY:QUESTORA: ${ev.title}`,
        `DESCRIPTION:Type: ${ev.type} | Duration: ${ev.duration} | Subject: ${ev.subject}`,
        `DTSTART:${cleanDate}T180000Z`,
        `DTEND:${cleanDate}T184500Z`,
        'STATUS:CONFIRMED',
        'END:VEVENT'
      );
    });

    ics.push('END:VCALENDAR');

    const blob = new Blob([ics.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'focusflow-study-calendar.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Study Schedule Calendar
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              Exam Milestones
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Visual map of upcoming study blocks, scheduled revisions, quick quizzes, and exam dates.
          </p>
        </div>

        <button
          onClick={exportICS}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Export .ICS Calendar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                September 2026
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <span key={d} className="font-bold text-[11px] text-slate-400 py-1">
                {d}
              </span>
            ))}

            {/* Empty offset days */}
            <div />
            <div />

            {daysInMonth.map((day) => {
              const dayStr = `2026-09-${day < 10 ? '0' : ''}${day}`;
              const isSelected = selectedDate === dayStr;
              const hasEvents = calendarEvents.some((e) => e.date === dayStr);
              const isToday = day === 29;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dayStr)}
                  className={`h-16 p-1.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 font-bold'
                      : isToday
                      ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/30'
                      : 'border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className={`text-[11px] font-mono ${
                      isToday ? 'text-cyan-600 dark:text-cyan-400 font-bold' : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {day}
                  </span>

                  {hasEvents && (
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule for Selected Day (1 Col) */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Schedule for {selectedDate}
            </h3>
            <span className="text-[11px] text-slate-400">
              {calendarEvents.filter((e) => e.date === selectedDate).length} events scheduled
            </span>
          </div>

          <div className="space-y-3">
            {calendarEvents
              .filter((e) => e.date === selectedDate)
              .map((ev) => {
                const isBreak = ev.type === 'break';
                const isQuiz = ev.type === 'quiz';
                const isRevision = ev.type === 'revision';
                const isExam = ev.type === 'exam';

                return (
                  <div
                    key={ev.id}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isBreak
                        ? 'bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-200'
                        : isQuiz
                        ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-900 dark:text-cyan-200'
                        : isRevision
                        ? 'bg-purple-500/5 border-purple-500/20 text-purple-900 dark:text-purple-200'
                        : isExam
                        ? 'bg-rose-500/5 border-rose-500/20 text-rose-900 dark:text-rose-200'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-slate-500">{ev.time}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded bg-white dark:bg-slate-800">
                        {ev.type}
                      </span>
                    </div>

                    <div className="font-bold text-slate-900 dark:text-white">
                      {ev.title}
                    </div>

                    <div className="text-[10px] text-slate-500 flex items-center gap-2">
                      <span>{ev.subject}</span>
                      <span>•</span>
                      <span>{ev.duration}</span>
                    </div>
                  </div>
                );
              })}

            {calendarEvents.filter((e) => e.date === selectedDate).length === 0 && (
              <p className="text-xs text-slate-400 py-8 text-center italic">
                No events scheduled for this date.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
