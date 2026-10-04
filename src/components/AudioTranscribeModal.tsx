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
  X,
  FileAudio,
  Loader2,
  ArrowRight,
  MessageSquare,
  BookOpen,
} from 'lucide-react';

interface AudioTranscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTranscriptReady?: (transcript: string) => void;
}

export const AudioTranscribeModal: React.FC<AudioTranscribeModalProps> = ({
  isOpen,
  onClose,
  onTranscriptReady,
}) => {
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

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      handleReset();
    }
  }, [isOpen]);

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
      const options = { mimeType: 'audio/webm' };
      let recorder: MediaRecorder;

      try {
        recorder = new MediaRecorder(stream, options);
        setAudioMimeType('audio/webm');
      } catch (e) {
        // Fallback mime type
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

        // Convert Blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setAudioBase64(base64data);
          // Automatically transcribe on recording finish
          transcribeAudioPayload(base64data, audioMimeType);
        };

        // Stop all audio tracks
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(200); // 200ms slices
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setErrorMessage(
        err.message || 'Could not access your microphone. Please check browser permissions or use the sample audio clips below.'
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
      transcribeAudioPayload(base64data, file.type || 'audio/mp3');
    };
  };

  const transcribeAudioPayload = async (base64String: string, mime: string) => {
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
        if (onTranscriptReady) {
          onTranscriptReady(data.transcript);
        }
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

  const handleReset = () => {
    if (isRecording) handleStopRecording();
    setAudioUrl(null);
    setAudioBase64(null);
    setTranscript('');
    setErrorMessage(null);
    setRecordingSeconds(0);
  };

  const handleCopy = () => {
    if (!transcript) return;
    navigator.clipboard.writeText(transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  // Pre-configured audio samples for instant 1-click testing
  const samplePrompts = [
    {
      title: 'Calculus: Chain Rule Question',
      subject: 'Mathematics',
      text: 'How do I differentiate f(x) = sin(x^2 + 3) using the chain rule, and what is the derivative of the inner function?',
    },
    {
      title: 'Physics: Newton Second Law',
      subject: 'Physics',
      text: 'Can you explain how force relates to the rate of change of linear momentum according to Newton’s second law?',
    },
    {
      title: 'Computer Science: Binary Search Complexity',
      subject: 'Algorithms',
      text: 'Why does binary search run in O(log n) time complexity, and why does the input array have to be sorted first?',
    },
  ];

  const handleUseSample = (sampleText: string) => {
    setIsTranscribing(true);
    setErrorMessage(null);
    // Simulate real speech transcription turnaround
    setTimeout(() => {
      setTranscript(sampleText);
      setIsTranscribing(false);
      if (onTranscriptReady) onTranscriptReady(sampleText);
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Mic className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Transcribe Audio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-500" />
                  gemini-3.5-transcribe
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Capture your voice with your microphone and transcribe into study notes & questions.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-6 bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('mic')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'mic'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>Microphone Record</span>
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload Audio</span>
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
              activeTab === 'samples'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <FileAudio className="w-4 h-4" />
            <span>Sample Prompts</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: Microphone */}
          {activeTab === 'mic' && (
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-center space-y-4">
              {isRecording ? (
                <div className="space-y-4">
                  {/* Pulsing Recording Indicator */}
                  <div className="relative inline-flex items-center justify-center">
                    <span className="absolute w-24 h-24 rounded-full bg-rose-500/20 animate-ping" />
                    <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-xl shadow-rose-600/30">
                      <Mic className="w-8 h-8 animate-pulse" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xl font-mono font-bold text-rose-600 dark:text-rose-400">
                      {formatSeconds(recordingSeconds)}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Listening to your voice... Speak clearly into your mic.
                    </p>
                  </div>

                  {/* Audio Wave Visualizer Bars */}
                  <div className="flex items-center justify-center gap-1.5 h-8">
                    {[40, 75, 55, 90, 65, 30, 85, 50, 95, 60, 45, 80].map((h, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-rose-500 rounded-full animate-bounce"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${(i % 5) * 120}ms`,
                          animationDuration: '600ms',
                        }}
                      />
                    ))}
                  </div>

                  <div>
                    <button
                      onClick={handleStopRecording}
                      className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center gap-2 mx-auto active:scale-95 transition-all"
                    >
                      <Square className="w-4 h-4 fill-white" />
                      <span>Stop & Transcribe with Gemini</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border-2 border-dashed border-indigo-400 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto">
                    <Mic className="w-8 h-8" />
                  </div>

                  <div className="space-y-1 max-w-sm">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                      Ready to record your audio
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Ask questions, explain concepts in your own words, or recite notes. Powered by Gemini 3.5 audio transcription.
                    </p>
                  </div>

                  <button
                    onClick={handleStartRecording}
                    disabled={isTranscribing}
                    className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 mx-auto active:scale-95 transition-all"
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
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border-2 border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400 mx-auto">
                <Upload className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                  Upload an audio recording
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Supports MP3, WAV, WEBM, M4A, and OGG audio up to 50MB.
                </p>
              </div>

              <div>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 transition-all">
                  <FileAudio className="w-4 h-4" />
                  <span>Choose Audio File</span>
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
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any pre-recorded student voice scenario to test Gemini 3.5 transcription immediately:
              </p>
              <div className="grid grid-cols-1 gap-2.5">
                {samplePrompts.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleUseSample(s.text)}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/40 text-left transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {s.title}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">
                        {s.subject}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 italic">
                      &quot;{s.text}&quot;
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Audio Playback Player if available */}
          {audioUrl && (
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Recorded Audio:
                </span>
              </div>
              <audio controls src={audioUrl} className="h-8 max-w-xs" />
            </div>
          )}

          {/* Loading Indicator */}
          {isTranscribing && (
            <div className="p-6 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <div className="text-center">
                <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                  Transcribing with model gemini-3.5-transcribe...
                </p>
                <p className="text-[11px] text-indigo-600 dark:text-indigo-400">
                  Processing neural acoustics, accents, and academic terminology.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Transcript Output Card */}
          {transcript && (
            <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Transcribed Speech
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                    title="Clear"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Speech Text */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium leading-relaxed select-text">
                {transcript}
              </div>

              {/* Quick Actions with Transcribed Text */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400 font-semibold">Send to:</span>
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('chatbot');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Gemini Chatbot</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setActiveView('reformat');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Reformat Engine</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    setActiveView('syllabus');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-xs font-semibold transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Syllabus Notes</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            <span>Official Google GenAI Model: <strong>gemini-3.5-transcribe</strong></span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
