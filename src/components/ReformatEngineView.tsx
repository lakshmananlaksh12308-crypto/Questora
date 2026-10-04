import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ReformatContent, Language } from '../types';
import {
  Sparkles,
  Eye,
  ListOrdered,
  BookMarked,
  Volume2,
  Mic,
  MicOff,
  Send,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  VolumeX,
  Palette,
  Layers,
} from 'lucide-react';
import { VisualExplanationModal } from './VisualExplanationModal';
import { CartoonCharacterAvatar } from './CartoonCharacterAvatar';

export const ReformatEngineView: React.FC = () => {
  const {
    selectedReformatTopic,
    preferredLanguage,
    setPreferredLanguage,
    topics,
  } = useApp();

  const [topic, setTopic] = useState(
    selectedReformatTopic?.topic || 'Derivatives & Chain Rule'
  );
  const [subject, setSubject] = useState(
    selectedReformatTopic?.subject || 'Mathematics'
  );

  const [activeTab, setActiveTab] = useState<'visual' | 'logical' | 'story'>('visual');
  const [isLoading, setIsLoading] = useState(false);
  const [simplerMode, setSimplerMode] = useState(false);
  const [showVisualModal, setShowVisualModal] = useState(false);
  const [followUp, setFollowUp] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const audioChunksRef = React.useRef<Blob[]>([]);

  // Content state
  const [content, setContent] = useState<ReformatContent>({
    topic: 'Derivatives & Chain Rule',
    language: preferredLanguage,
    visual: {
      title: 'Visual Representation: Geometric Slope & Tangents',
      diagram: `
  y ^               / (Tangent line at point P)
    |              /
    |            .*  (Curve: y = f(x))
    |          .'
    |        .'|
    |      .'  | Δy
    |    P*----+
    |      |  Δx
    +-------------------> x
      Instantaneous Slope = lim(Δx->0) Δy / Δx = f'(x)
      `,
      breakdown: [
        'Imagine zooming infinitely into any smooth curved graph until it becomes a straight tangent line.',
        'The slope of that line at coordinate P is your instantaneous derivative.',
        'Steep upward slope = High positive rate; Flat curve = Rate of zero.',
      ],
      keyTakeaway: 'The derivative is simply the instantaneous slope of a graph at one split second.',
    },
    logical: {
      title: 'Logical Deduction: Step-by-Step Rigorous Reasoning',
      steps: [
        {
          step: 1,
          statement: 'Identify two coordinates on a function curve: (x, f(x)) and (x+h, f(x+h)).',
          reason: 'Two distinct coordinates form a secant line between points.',
        },
        {
          step: 2,
          statement: 'Calculate the average slope between them: [f(x+h) - f(x)] / h.',
          reason: 'Rise over run formula gives the average change across interval h.',
        },
        {
          step: 3,
          statement: 'Bring the two points together by taking the limit as h approaches zero.',
          reason: 'Eliminates gap h to compute rate at that isolated point.',
        },
        {
          step: 4,
          statement: 'The resulting limit f\'(x) is the exact rate of change.',
          reason: 'Removes any approximation error.',
        },
      ],
      formulaOrRule: "f'(x) = lim(h->0) [f(x+h) - f(x)] / h",
      conclusion: 'A derivative is a mathematically proven limit that measures local sensitivity.',
    },
    story: {
      title: 'Story Mode: The Police Radar Gun Analogy',
      analogy: 'Highway Speed Enforcement vs. Average Trip Speed',
      narrative:
        'Suppose you drive 120 miles from Chennai to Vellore in 2 hours. Your average speed is 60 km/h. But if a traffic officer points a radar gun at you on a steep downhill stretch, they do not care about your 2-hour trip average. The radar gun measures how far your car moved in an infinitesimal fraction of a millisecond. That single moment reading is the DERIVATIVE of your position with respect to time!',
      moral: 'Do not think about broad averages: the derivative isolates what is occurring right now.',
    },
    quickCheckQuestion: {
      question: 'What does a derivative equal when a curve reaches its peak (maximum)?',
      answer: 'Zero, because the tangent line is completely horizontal at the peak.',
    },
  });

  const fetchReformat = async (isSimpler = false, customFollowUp?: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/reformat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          subject,
          language: preferredLanguage,
          simpler: isSimpler,
          followUpQuestion: customFollowUp,
        }),
      });
      const data = await res.json();
      if (data.visual && data.logical && data.story) {
        setContent(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReformat(simplerMode);
  }, [topic, preferredLanguage]);

  // Audio Text-to-Speech (gemini-3.8-flash-tts)
  const handleTTS = async () => {
    if (isPlayingAudio) return;
    setIsPlayingAudio(true);

    let textToSpeak = '';
    if (activeTab === 'visual') {
      textToSpeak = `${content.visual.title}. ${content.visual.keyTakeaway || ''}`;
    } else if (activeTab === 'logical') {
      textToSpeak = `${content.logical.title}. ${content.logical.conclusion || ''}`;
    } else {
      textToSpeak = `${content.story.title}. ${content.story.narrative}`;
    }

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textToSpeak }),
      });
      const data = await res.json();
      if (data.audioData) {
        const audio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioData}`);
        audio.onended = () => setIsPlayingAudio(false);
        audio.play().catch(() => setIsPlayingAudio(false));
      } else {
        setIsPlayingAudio(false);
      }
    } catch (err) {
      console.error('TTS error:', err);
      setIsPlayingAudio(false);
    }
  };

  // Audio Speech Transcription (gemini-3.5-transcribe)
  const handleToggleMic = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Microphone not supported');
        }

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        let recorder: MediaRecorder;
        let mime = 'audio/webm';
        try {
          recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        } catch {
          recorder = new MediaRecorder(stream);
          mime = 'audio/wav';
        }

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, { type: mime });
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const base64data = reader.result as string;
            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioBase64: base64data, mimeType: mime }),
              });
              const data = await res.json();
              if (data.transcript) {
                setFollowUp(data.transcript);
                fetchReformat(simplerMode, data.transcript);
              }
            } catch (err) {
              console.error('Transcription error:', err);
            }
          };
          stream.getTracks().forEach((track) => track.stop());
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsRecording(true);
      } catch (err) {
        console.error('Mic access error, falling back to prompt sample:', err);
        // Fallback for environments with disabled microphone
        const fallbackText = 'Can you give another real-world application of this in robotics or physics?';
        setFollowUp(fallbackText);
        fetchReformat(simplerMode, fallbackText);
      }
    }
  };

  const languages: Language[] = [
    'English',
    'Tanglish',
    'Tamil',
    'Hindi',
    'Malayalam',
    'Telugu',
    'Kannada',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Reformat Engine
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              3-Way Concept Breakdown
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            When you say &quot;I don't understand this&quot;, the AI reconstructs the concept through Visual, Logical, and Story lenses.
          </p>
        </div>

        {/* Language selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Tutor Language:</span>
          <select
            value={preferredLanguage}
            onChange={(e) => setPreferredLanguage(e.target.value as Language)}
            className="py-1.5 px-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Concept Selector & Quick Action Bar */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            Concept:
          </span>
          <select
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
              const found = topics.find((t) => t.name === e.target.value);
              if (found) setSubject(found.subject);
            }}
            className="w-full max-w-md rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.name}>
                {t.subject}: {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSimplerMode(!simplerMode);
              fetchReformat(!simplerMode);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              simplerMode
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            {simplerMode ? '✨ Explaining Simpler' : 'Explain Simpler'}
          </button>

          <button
            onClick={handleTTS}
            disabled={isPlayingAudio}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition-all"
            title="Gemini 3.8 Flash TTS"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isPlayingAudio ? 'Reading Aloud...' : 'Read Aloud (TTS)'}</span>
          </button>
        </div>
      </div>

      {/* 3-Perspective Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('visual')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'visual'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>1. Visual Explanation</span>
        </button>

        <button
          onClick={() => setActiveTab('logical')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'logical'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>2. Logical Explanation</span>
        </button>

        <button
          onClick={() => setActiveTab('story')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'story'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookMarked className="w-4 h-4" />
          <span>3. Story Explanation</span>
        </button>
      </div>

      {/* Tab Content Box */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm min-h-[340px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
            <Sparkles className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs font-semibold">
              Reformatting {topic} through {activeTab} lens in {preferredLanguage}...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Visual Tab */}
            {activeTab === 'visual' && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <CartoonCharacterAvatar characterName="Professor Paws" mood="teaching" size="sm" />
                    <div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                        {content.visual.title}
                      </h3>
                      <span className="text-[11px] text-amber-500 font-bold">
                        Professor Paws • Visual STEM Mentor
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowVisualModal(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>Open Interactive Visual Studio</span>
                  </button>
                </div>

                {content.visual.diagram && (
                  <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed shadow-inner">
                    {content.visual.diagram}
                  </pre>
                )}

                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Structural Breakdown:
                  </span>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {content.visual.breakdown?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-200 font-medium">
                  <strong>Key Takeaway: </strong>
                  {content.visual.keyTakeaway}
                </div>
              </div>
            )}

            {/* Logical Tab */}
            {activeTab === 'logical' && (
              <div className="space-y-4">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {content.logical.title}
                </h3>

                <div className="space-y-3">
                  {content.logical.steps?.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs flex gap-3 items-start"
                    >
                      <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">
                        {step.step}
                      </span>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">
                          {step.statement}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                          <strong>Why: </strong>
                          {step.reason}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {content.logical.formulaOrRule && (
                  <div className="p-3 rounded-xl bg-slate-900 text-purple-300 font-mono text-xs text-center border border-purple-800/40">
                    {content.logical.formulaOrRule}
                  </div>
                )}

                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-800 dark:text-purple-200 font-medium">
                  <strong>Logical Conclusion: </strong>
                  {content.logical.conclusion}
                </div>
              </div>
            )}

            {/* Story Tab */}
            {activeTab === 'story' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {content.story.title}
                  </h3>
                  <span className="text-[11px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-bold">
                    Analogy: {content.story.analogy}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
                  &ldquo;{content.story.narrative}&rdquo;
                </div>

                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 font-medium">
                  <strong>Intuitive Moral: </strong>
                  {content.story.moral}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Ask Follow-Up & Voice Input Section */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
          <span>Ask Follow-up or Speak Your Doubts</span>
          <span className="text-[11px] text-slate-400 font-normal">
            Transcribed with Gemini 3.5 Transcribe
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={followUp}
            onChange={(e) => setFollowUp(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchReformat(simplerMode, followUp)}
            placeholder={`Ask a follow-up about ${topic} in ${preferredLanguage}...`}
            className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          {/* Microphone transcribe button */}
          <button
            onClick={handleToggleMic}
            className={`p-2 rounded-xl border transition-all ${
              isRecording
                ? 'bg-rose-500 text-white border-rose-500 animate-pulse'
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-indigo-600'
            }`}
            title="Speech to Text with Gemini 3.5 Transcribe"
          >
            {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          <button
            onClick={() => fetchReformat(simplerMode, followUp)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Visual Explanation Modal */}
      {showVisualModal && (
        <VisualExplanationModal
          initialTopic={topic}
          initialExcerpt={content.visual?.keyTakeaway || ''}
          subject={subject}
          onClose={() => setShowVisualModal(false)}
        />
      )}
    </div>
  );
};
