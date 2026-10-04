import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TopicItem, SubjectItem } from '../types';
import {
  Upload,
  FileText,
  Sparkles,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Play,
  RotateCcw,
  Search,
  BookOpen,
  Layers,
  FileSpreadsheet,
} from 'lucide-react';

export const SyllabusSageView: React.FC = () => {
  const {
    topics,
    subjects,
    updateSyllabusData,
    triggerReformatTopic,
    startFocusSession,
    setActiveView,
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadFileName, setUploadFileName] = useState('');
  const [detectedSummary, setDetectedSummary] = useState(
    '47 topics detected across 5 subjects.'
  );

  const sampleSyllabi = [
    {
      title: 'Engineering & STEM (Calculus, Physics, Algorithms)',
      text: `SEMESTER IV CURRICULUM
Subject 1: Advanced Calculus (Differential Equations, Multivariable Calculus, Vector Integrals, Stokes Theorem, Line Integrals)
Subject 2: Electromagnetism & Quantum Mechanics (Maxwell Equations, Faraday Induction, Lenz Law, Photoelectric Effect, Wave-Particle Duality)
Subject 3: Computer Science & Data Structures (Binary Search Trees, Dynamic Programming, Graph Traversals, Red-Black Trees, Dijkstra Algorithm)
Subject 4: Organic Chemistry (Reaction Kinetics, Aromatic Compounds, Thermodynamics)
Subject 5: Cellular Biology (Cell division, Genetic expression, DNA replication)`,
    },
    {
      title: 'Computer Science & Software Architecture',
      text: `CS DEGREE SYLLABUS:
Unit 1: Data Structures - AVL Trees, Heaps, Graph BFS/DFS, Trie Structures.
Unit 2: System Design - Load Balancers, Distributed Caching, Database Sharding, Event Driven Messaging.
Unit 3: Operating Systems - Virtual Memory, Process Concurrency, Deadlocks, Paging.
Unit 4: AI & Machine Learning - Gradient Descent, Backpropagation, Attention Transformers, Convolutional Networks.`,
    },
    {
      title: 'Medical Physiology & Anatomy',
      text: `MBBS YR 2 SYLLABUS:
Module A: Cardiovascular System - Cardiac Cycle, Action Potentials, Arterial Hemodynamics, Arrhythmias.
Module B: Neurophysiology - Synaptic Transmission, Motor Pathways, Cranial Nerves, Cerebellar Control.
Module C: Renal Physiology - Glomerular Filtration Rate, Countercurrent Multiplier, Acid-Base Regulation.`,
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setInputText(text || `Uploaded ${file.name}: Parsing academic sections and chapters...`);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyzeSyllabus = async (customText?: string) => {
    const content = customText || inputText;
    if (!content.trim()) return;

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/syllabus/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          syllabusText: content,
          fileName: uploadFileName || 'uploaded-syllabus.txt',
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setDetectedSummary(data.summary);
      }
      if (data.subjects && data.topics) {
        const mappedSubjects: SubjectItem[] = data.subjects.map((s: any) => ({
          id: s.id || `sub-${Math.random()}`,
          userId: 'demo-student-001',
          name: s.name,
          totalTopics: s.totalTopics || 8,
          completedTopics: s.completedTopics || 0,
          confidence: s.confidence || 60,
          progressPercent: s.progressPercent || 0,
        }));

        const mappedTopics: TopicItem[] = data.topics.map((t: any) => ({
          id: t.id || `top-${Math.random()}`,
          userId: 'demo-student-001',
          subject: t.subject,
          unit: t.unit || 'Core Unit',
          chapter: t.chapter || 'Chapter 1',
          name: t.topicName || t.name,
          difficulty: t.difficulty || 'Medium',
          status: t.status || 'Needs Revision',
          confidence: t.confidence || 40,
          priority: t.priority || 'High',
          revisionDate: t.revisionDate || 'Tomorrow',
        }));

        updateSyllabusData(mappedSubjects, mappedTopics);
      }
    } catch (err) {
      console.error('Error analyzing syllabus:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const filteredTopics = topics.filter((t) => {
    const matchesSubject = selectedSubjectFilter === 'All' || t.subject === selectedSubjectFilter;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.unit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Syllabus Sage
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              AI Syllabus Ingestion
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Convert any curriculum, PDF, document, or course text into an actionable structured study graph.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
            {detectedSummary}
          </div>
        </div>
      </div>

      {/* Upload & Ingestion Box */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          1. Upload or Paste Syllabus
        </h3>

        {/* Dropzone simulation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 space-y-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste syllabus text here (modules, units, course outcomes, textbook topics)..."
              rows={4}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF / Image / Text</span>
                <input
                  type="file"
                  accept=".pdf,.txt,.doc,.docx,.png,.jpg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              {uploadFileName && (
                <span className="text-[11px] text-slate-500 font-mono">
                  File: {uploadFileName}
                </span>
              )}

              <button
                onClick={() => handleAnalyzeSyllabus()}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all ml-auto"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAnalyzing ? 'Analyzing Syllabus...' : 'Extract Study Plan'}</span>
              </button>
            </div>
          </div>

          {/* Quick Pre-loaded Templates */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/60 p-3.5 space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Quick Test Templates:
            </span>
            {sampleSyllabi.map((s, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputText(s.text);
                  handleAnalyzeSyllabus(s.text);
                }}
                className="w-full text-left p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              >
                <div className="font-semibold text-[11px] truncate">{s.title}</div>
                <div className="text-[10px] text-slate-400 truncate">Click to load & analyze</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Extracted Visual Syllabus Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Extracted Topics & Difficulty Graph
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Each topic is mapped with confidence metrics, priority, and scheduled spaced revision
            </p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics..."
                className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-44"
              />
            </div>

            <select
              value={selectedSubjectFilter}
              onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 font-medium focus:outline-none"
            >
              <option value="All">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Topics List Table */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-2 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {topic.subject} → {topic.name}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                      topic.difficulty === 'Hard'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : topic.difficulty === 'Medium'
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {topic.difficulty}
                  </span>
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                      topic.status === 'Needs Revision'
                        ? 'bg-rose-500/20 text-rose-700 dark:text-rose-300'
                        : topic.status === 'Mastered'
                        ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                        : 'bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
                    }`}
                  >
                    {topic.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>Unit: {topic.unit}</span>
                  <span>•</span>
                  <span>Chapter: {topic.chapter}</span>
                  <span>•</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Confidence: {topic.confidence}%
                  </span>
                  <span>•</span>
                  <span className="text-purple-600 dark:text-purple-400 font-medium">
                    Revision: {topic.revisionDate}
                  </span>
                </div>
              </div>

              {/* Action buttons per topic */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => triggerReformatTopic(topic.name, topic.subject)}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-200 dark:border-indigo-800 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Reformat Engine</span>
                </button>

                <button
                  onClick={() => {
                    startFocusSession({
                      id: `task-${topic.id}`,
                      userId: topic.userId,
                      title: `Study: ${topic.name}`,
                      subject: topic.subject,
                      difficulty: topic.difficulty,
                      status: 'pending',
                      confidence: topic.confidence,
                      priority: topic.priority,
                    });
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-400 dark:hover:text-white text-xs font-semibold transition-colors"
                >
                  <Play className="w-3 h-3" />
                  <span>Study</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
