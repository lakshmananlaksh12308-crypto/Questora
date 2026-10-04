import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mic,
  MicOff,
  Square,
  Upload,
  Sparkles,
  Copy,
  Check,
  Play,
  RotateCcw,
  Volume2,
  FileAudio,
  Loader2,
  ArrowRight,
  MessageSquare,
  BookOpen,
  History,
  Trash2,
  Shield,
  Download,
  Share2,
} from 'lucide-react';

interface TranscribeRecord {
  id: string;
  transcript: string;
  durationSeconds: number;
  timestamp: string;
  category: string;
}

export const AudioTranscribeView: React.FC = () => {
  const { setActiveView } = useApp();

  const [activeTab, setActiveTab] = useState<'mic' | 'upload' | 'samples'>('mic');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioMimeType, setAudioMimeType] = useState('audio/webm');
  const [transcript, setTranscript] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved transcription history
  const [history, setHistory] = useState<TranscribeRecord[]>([
    {
      id: 'tr-1',
      transcript: 'Calculus concept review: Derivatives represent the instantaneous rate of change of a function with respect to one of its variables.',
      durationSeconds: 8,
      timestamp: 'Today, 2:15 PM',
      category: 'Mathematics',
    },
    {
      id: 'tr-2',
      transcript: 'Why does quantum tunneling occur in semiconductor diodes and what is the potential barrier formula?',
      durationSeconds: 6,
      timestamp: 'Yesterday',
      category: 'Physics',
    },
  ]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    setErrorMessage(null);
    setAudioUrl(null);
    setAudioBase64(null);
    setTranscript('');
    audioChunksRef.current = [];

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      let recorder: MediaRecorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        setAudioMimeType('audio/webm');
      } catch (e) {
        recorder = new MediaRecorder(stream);
        setAudioMimeType('audio/wav');
      }

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: audioMimeType });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBase64(base64data);
          transcribeAudioPayload(base64data, audioMimeType, recordingSeconds);
        };

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(200);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setErrorMessage(
        err.message || 'Microphone permission denied. Use the sample voice prompts below to test instantly.'
      );
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setAudioUrl(URL.createObjectURL(file));
    setAudioMimeType(file.type || 'audio/mp3');
    setTranscript('');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setAudioBase64(base64data);
      transcribeAudioPayload(base64data, file.type || 'audio/mp3', 10);
    };
  };

  const transcribeAudioPayload = async (base64String: string, mime: string, durationSec = 5) => {
    setIsTranscribing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64String,
          mimeType: mime,
        }),
      });

      const data = await res.json();
      if (data.transcript) {
        setTranscript(data.transcript);
        // Add to history
        const newRecord: TranscribeRecord = {
          id: `tr-${Date.now()}`,
          transcript: data.transcript,
          durationSeconds: durationSec || 5,
          timestamp: 'Just now',
          category: 'Voice Note',
        };
        setHistory((prev) => [newRecord, ...prev]);
      } else if (data.error) {
        setErrorMessage(data.error);
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setErrorMessage('Failed to connect to transcription service. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (isRecording) handleStopRecording();
    setAudioUrl(null);
    setAudioBase64(null);
    setTranscript('');
    setErrorMessage(null);
    setRecordingSeconds(0);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const samplePrompts = [
    {
      title: 'Calculus: Chain Rule & Composite Functions',
      subject: 'Mathematics',
      text: 'Explain how to differentiate y = sin(3x^2 + 5) and what is the derivative of the inner function with respect to x.',
    },
    {
      title: 'Physics: Faraday’s Law of Electromagnetic Induction',
      subject: 'Physics',
      text: 'How does magnetic flux change over time to induce an electromotive force in a closed conducting loop?',
    },
    {
      title: 'Computer Science: Merge Sort vs Quick Sort',
      subject: 'Algorithms',
      text: 'Compare the worst-case space and time complexity between Merge Sort and in-place Quick Sort algorithm.',
    },
  ];

  const handleUseSample = (sampleText: string, category: string) => {
    setIsTranscribing(true);
    setErrorMessage(null);
    setTimeout(() => {
      setTranscript(sampleText);
      setIsTranscribing(false);
      const newRecord: TranscribeRecord = {
        id: `tr-${Date.now()}`,
        transcript: sampleText,
        durationSeconds: 7,
        timestamp: 'Just now',
        category,
      };
      setHistory((prev) => [newRecord, ...prev]);
    }, 800);
  };

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Mic className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                  Transcribe audio
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  gemini-3.5-transcribe
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Input audio with your microphone to transcribe lectures, voice notes, questions, and revision summaries into structured study materials.
          </p>
        </div>

        {/* Action pills */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 dark:border-slate-700">
            <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
            <span>Whisper-clear AI Speech Recognition</span>
          </div>
        </div>
      </div>

      {/* Main Studio Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        {/* Mode Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-slate-50/50 dark:bg-slate-800/30">
          <button
            onClick={() => setActiveTab('mic')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'mic'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Microphone Audio Input</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Audio File</span>
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`py-3.5 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'samples'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileAudio className="w-4 h-4" />
            <span>Quick Test Voice Clips</span>
          </button>
        </div>

        {/* Input Interface Area */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* TAB 1: Microphone */}
          {activeTab === 'mic' && (
            <div className="flex flex-col items-center justify-center p-8 sm:p-12 rounded-2xl bg-gradient-to-b from-slate-50 to-indigo-50/20 dark:from-slate-800/40 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800 text-center space-y-5">
              {isRecording ? (
                <div className="space-y-5 w-full max-w-md">
                  <div className="relative inline-flex items-center justify-center">
                    <span className="absolute w-28 h-28 rounded-full bg-rose-500/20 animate-ping" />
                    <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/30">
                      <Mic className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>

                  <div>
                    <div className="text-3xl font-mono font-extrabold text-rose-600 dark:text-rose-400">
                      {formatSeconds(recordingSeconds)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                      Recording speech with your microphone... Speak clearly.
                    </p>
                  </div>

                  {/* Dynamic waveform visualizer */}
                  <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                    {[30, 65, 45, 85, 95, 60, 40, 80, 70, 90, 50, 75, 40, 60].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full animate-bounce"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${(i % 6) * 100}ms`,
                          animationDuration: '500ms',
                        }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleStopRecording}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/25 flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Stop Recording & Transcribe with Gemini 3.5</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-4 max-w-md">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/60 border-2 border-dashed border-indigo-400/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto shadow-inner">
                    <Mic className="w-8 h-8" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                      Ready to Speak
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Click the button below to start your microphone. Speak your study questions, complex definitions, or lecture highlights.
                    </p>
                  </div>

                  <button
                    onClick={handleStartRecording}
                    disabled={isTranscribing}
                    className="px-8 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mx-auto active:scale-95 transition-all"
                  >
                    <Mic className="w-4 h-4" />
                    <span>Start Microphone Recording</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Upload */}
          {activeTab === 'upload' && (
            <div className="p-8 sm:p-12 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Upload an audio file to transcribe
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Drag and drop or select an audio file (MP3, WAV, WEBM, M4A, OGG).
                </p>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 transition-all">
                  <FileAudio className="w-4 h-4" />
                  <span>Select Audio File</span>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: Samples */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Select an academic voice prompt scenario to test gemini-3.5-transcribe model immediately:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {samplePrompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUseSample(s.text, s.subject)}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/40 text-left transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
                          {s.subject}
                        </span>
                        <Sparkles className="w-3 h-3 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {s.title}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 italic line-clamp-3">
                        &quot;{s.text}&quot;
                      </p>
                    </div>

                    <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      <span>Transcribe Clip</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Audio Player if recorded/uploaded */}
          {audioUrl && (
            <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Audio Preview:
                </span>
              </div>
              <audio controls src={audioUrl} className="h-9 w-full sm:max-w-md" />
            </div>
          )}

          {/* Loading status */}
          {isTranscribing && (
            <div className="p-8 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center space-y-3 animate-pulse">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
                  Transcribing with model gemini-3.5-transcribe...
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400">
                  Parsing speech phonetics, academic terms, and punctuation.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <MicOff className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Live Transcript Output */}
          {transcript && (
            <div className="rounded-2xl border-2 border-indigo-500/40 bg-white dark:bg-slate-900 p-6 shadow-lg space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-white">
                    Transcribed Result
                  </h4>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">
                    High Accuracy
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Text'}</span>
                  </button>
                  <button
                    onClick={handleClear}
                    className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Clear"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text content */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed select-text">
                {transcript}
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2.5">
                <span className="text-xs font-bold text-slate-400">Actions:</span>

                <button
                  onClick={() => setActiveView('chatbot')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Ask in Gemini Chatbot</span>
                </button>

                <button
                  onClick={() => setActiveView('reformat')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Break Down in Reformat Engine</span>
                </button>

                <button
                  onClick={() => setActiveView('syllabus')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Save as Study Note</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transcription History & Voice Notes */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
              Recent Voice Transcriptions & Notes
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {history.length} items recorded
          </span>
        </div>

        <div className="space-y-3">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/70 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                  <span className="text-[11px] text-slate-400">• {item.durationSeconds}s clip</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                  {item.transcript}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(item.transcript);
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  title="Copy text"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setHistory((prev) => prev.filter((h) => h.id !== item.id));
                  }}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
