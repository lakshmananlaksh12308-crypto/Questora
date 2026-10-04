import express, { Request, Response } from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, LiveServerMessage, GenerateVideosOperation } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize GoogleGenAI SDK with required telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// 1. SYLLABUS SAGE: AI Syllabus Analysis
// ==========================================
app.post('/api/syllabus/analyze', async (req: Request, res: Response) => {
  try {
    const { syllabusText, fileType, fileName } = req.body;

    if (!syllabusText && !fileName) {
      return res.status(400).json({ error: 'Syllabus content is required' });
    }

    if (!ai) {
      // Fallback high-fidelity sample analysis if API key is pending
      return res.json(getFallbackSyllabusData());
    }

    const prompt = `You are QUESTORA's Syllabus Sage.
Analyze this syllabus content:
"""
${syllabusText || 'Comprehensive Engineering Syllabus: Mathematics (Calculus, Linear Algebra), Physics (Quantum Mechanics, Thermodynamics), Computer Science (Data Structures, Algorithms, Databases)'}
"""

Extract all academic subjects, units, chapters, and topics.
For each topic, evaluate:
- subject
- topicName
- unit
- chapter
- difficulty ("Easy" | "Medium" | "Hard")
- status ("Needs Revision" | "In Progress" | "Mastered" | "Pending")
- confidence (number 20 - 90)
- priority ("High" | "Medium" | "Low")
- revisionDate (e.g., "Tomorrow", "In 3 Days", "Next Week")

Return strictly a JSON object with:
{
  "summary": "e.g. 47 topics detected across 5 subjects.",
  "totalTopics": number,
  "subjects": [
    {
      "id": string,
      "name": string,
      "totalTopics": number,
      "completedTopics": number,
      "confidence": number,
      "progressPercent": number
    }
  ],
  "topics": [
    {
      "id": string,
      "subject": string,
      "topicName": string,
      "unit": string,
      "chapter": string,
      "difficulty": "Easy" | "Medium" | "Hard",
      "status": "Needs Revision" | "In Progress" | "Mastered" | "Pending",
      "confidence": number,
      "priority": "High" | "Medium" | "Low",
      "revisionDate": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/syllabus/analyze:', err);
    return res.json(getFallbackSyllabusData());
  }
});

// ==========================================
// 2. ADAPTIVE AI PLANNER
// ==========================================
app.post('/api/planner/generate', async (req: Request, res: Response) => {
  try {
    const { examDate, availableHours, subjects, preferredTime, dailyGoal, breakPreference } = req.body;

    if (!ai) {
      return res.json(getFallbackPlanData(preferredTime || '6:00 PM'));
    }

    const prompt = `You are QUESTORA's Adaptive Planner engine.
Student inputs:
- Exam Date: ${examDate || '2 weeks from now'}
- Available daily study hours: ${availableHours || 4} hours
- Subjects: ${JSON.stringify(subjects || ['Mathematics', 'Physics', 'Programming'])}
- Preferred study time: ${preferredTime || '6:00 PM'}
- Daily task goal: ${dailyGoal || 8} tasks
- Break preference: ${breakPreference || '15-minute pomodoro breaks'}

Generate an optimal spaced-repetition daily timetable combining study blocks, micro-breaks, quick quizzes, and active revision.
Return strictly a JSON object:
{
  "summary": string,
  "schedule": [
    {
      "time": "e.g. 6:00 PM",
      "activity": "e.g. Mathematics - Derivatives Deep Dive",
      "type": "study" | "break" | "quiz" | "revision",
      "duration": 45,
      "subject": "Mathematics",
      "taskId": string
    },
    {
      "time": "6:45 PM",
      "activity": "Mindful Cognitive Break & Hydration",
      "type": "break",
      "duration": 15,
      "subject": "Rest",
      "taskId": string
    }
  ],
  "recommendations": [string, string]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/planner/generate:', err);
    return res.json(getFallbackPlanData('6:00 PM'));
  }
});

// ==========================================
// 3. SMARTSTUDY AI: Recommendation Engine
// ==========================================
app.post('/api/study/recommend', async (req: Request, res: Response) => {
  try {
    const { topic, subject, understandingRating, moodRating, confidenceRating, difficultyRating, quizScore } = req.body;

    if (!ai) {
      return res.json({
        recommendation: understandingRating <= 2
          ? `${topic || 'Derivatives'} needs additional revision. I have scheduled a 20-minute revision session tomorrow.`
          : `Great progress on ${topic}! You are ready to move on to the next chapter.`,
        scheduledRevision: understandingRating <= 3 ? 'Tomorrow, 20 mins' : 'In 3 days',
        adjustedConfidence: Math.min(100, Math.max(10, (understandingRating || 3) * 18 + (confidenceRating || 3) * 2)),
        nextStep: understandingRating <= 2 ? 'Try Reformat Engine for alternative visual/story angles' : 'Proceed to next planned topic',
      });
    }

    const prompt = `You are QUESTORA's SmartStudy recommendation engine.
A student just finished studying "${topic}" in "${subject}".
Student reported signals (1 to 5 scale, not medical):
- Understanding: ${understandingRating}/5
- Mood / Energy: ${moodRating}/5
- Confidence: ${confidenceRating}/5
- Difficulty: ${difficultyRating}/5
- Recent Quiz Score: ${quizScore ?? 'N/A'}

Provide an empathetic, scientifically sound adaptive study recommendation using spaced repetition and cognitive load theory.
If understanding <= 2, automatically recommend a scheduled revision and suggest the Reformat Engine.
Return JSON:
{
  "recommendation": string,
  "scheduledRevision": string,
  "adjustedConfidence": number,
  "nextStep": string
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/study/recommend:', err);
    return res.json({
      recommendation: `${req.body.topic || 'Topic'} needs additional revision. I have scheduled a 20-minute revision session tomorrow.`,
      scheduledRevision: 'Tomorrow, 20 mins',
      adjustedConfidence: 45,
      nextStep: 'Try Reformat Engine for alternative visual/story angles',
    });
  }
});

// ==========================================
// 4. QUIZMASTER AI: 3-Question Quick Quiz
// ==========================================
app.post('/api/quiz/generate', async (req: Request, res: Response) => {
  try {
    const { topic, subject, difficulty } = req.body;

    if (!ai) {
      return res.json(getFallbackQuiz(topic || 'Derivatives', subject || 'Mathematics'));
    }

    const prompt = `You are QUESTORA's QuizMaster.
Generate a high-yield 3-question quick quiz for the topic: "${topic || 'Derivatives'}" in "${subject || 'Mathematics'}".
Difficulty level: ${difficulty || 'Medium'}.

Return strictly a JSON object:
{
  "topic": "${topic}",
  "subject": "${subject}",
  "questions": [
    {
      "id": 1,
      "question": string,
      "options": [string, string, string, string],
      "correctOptionIndex": number,
      "explanation": string
    },
    {
      "id": 2,
      "question": string,
      "options": [string, string, string, string],
      "correctOptionIndex": number,
      "explanation": string
    },
    {
      "id": 3,
      "question": string,
      "options": [string, string, string, string],
      "correctOptionIndex": number,
      "explanation": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/quiz/generate:', err);
    return res.json(getFallbackQuiz(req.body.topic || 'Derivatives', req.body.subject || 'Mathematics'));
  }
});

// ==========================================
// 5. REFORMAT ENGINE & MULTILINGUAL TUTOR
// ==========================================
app.post('/api/reformat', async (req: Request, res: Response) => {
  try {
    const { topic, subject, language = 'English', mode = 'all', followUpQuestion, simpler = false } = req.body;

    if (!ai) {
      return res.json(getFallbackReformat(topic || 'Derivatives', language));
    }

    let langInstruction = `Language: ${language}.`;
    if (language.toLowerCase() === 'tanglish') {
      langInstruction = `Language: TANGLISH (Natural conversational Tamil written in English alphabet, friendly peer-to-peer student tone). Example: "Derivative-na basically oru value evlo fast-ah change aagudhu-nu measure panradhu. Car speedometer mari nenaikalam!" Maintain this lively, accurate Tanglish style.`;
    } else if (language.toLowerCase() === 'tamil') {
      langInstruction = `Language: Tamil (தமிழ்). Explain with clarity, respectful and motivating tone.`;
    } else if (language.toLowerCase() === 'hindi') {
      langInstruction = `Language: Hindi (हिंदी). Explain clearly in conversational Hindi.`;
    } else if (language.toLowerCase() === 'malayalam') {
      langInstruction = `Language: Malayalam (മലയാളം). Explain clearly in student-friendly Malayalam.`;
    } else if (language.toLowerCase() === 'telugu') {
      langInstruction = `Language: Telugu (తెలుగు). Explain clearly in student-friendly Telugu.`;
    } else if (language.toLowerCase() === 'kannada') {
      langInstruction = `Language: Kannada (ಕನ್ನಡ). Explain clearly in student-friendly Kannada.`;
    }

    const prompt = `You are QUESTORA's Reformat Engine.
When a student struggles to understand "${topic}" (${subject}), break down the concept from three distinct cognitive perspectives:

1. Visual Explanation:
Use structured layout, ASCII or markdown diagrams, spatial representations, flowcharts, and vivid imagery.

2. Logical Explanation:
Use step-by-step rigorous deduction, cause-and-effect reasoning, and clear fundamental laws.

3. Story Explanation:
Use an empathetic, relatable everyday narrative or real-world analogy.

${simpler ? 'IMPORTANT: The student requested "EXPLAIN SIMPLER". Make it 50% simpler, like explaining to a curious beginner.' : ''}
${followUpQuestion ? `Follow-up question from student: "${followUpQuestion}". Address this specifically.` : ''}

${langInstruction}

Return strictly a JSON object:
{
  "topic": "${topic}",
  "language": "${language}",
  "visual": {
    "title": string,
    "diagram": string,
    "breakdown": [string, string, string],
    "keyTakeaway": string
  },
  "logical": {
    "title": string,
    "steps": [
      { "step": number, "statement": string, "reason": string }
    ],
    "formulaOrRule": string,
    "conclusion": string
  },
  "story": {
    "title": string,
    "analogy": string,
    "narrative": string,
    "moral": string
  },
  "quickCheckQuestion": {
    "question": string,
    "answer": string
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/reformat:', err);
    return res.json(getFallbackReformat(req.body.topic || 'Derivatives', req.body.language || 'English'));
  }
});

// ==========================================
// 5B. VISUAL EXPLANATIONS & CARTOON TUTOR (gemini-3.8-flash)
// Generates rich step-by-step visual breakdowns, SVG diagrams & cartoon teacher insights
// ==========================================
app.post('/api/visual/explain', async (req: Request, res: Response) => {
  try {
    const { topic, subject = 'Coursework', excerpt, cartoonCharacter = 'Professor Paws' } = req.body;

    if (!topic && !excerpt) {
      return res.status(400).json({ error: 'Topic or excerpt is required' });
    }

    if (!ai) {
      return res.json(getFallbackVisualExplanation(topic || 'Core Concept', subject));
    }

    const prompt = `You are QUESTORA's Visual & Cartoon Concept Explainer.
Explain the following academic concept visually with high educational fidelity and a friendly cartoon character mentor (${cartoonCharacter}):
Topic: "${topic || 'Key Academic Concept'}"
Subject: "${subject}"
Source Excerpt / Notes:
"""
${(excerpt || topic || 'Key definitions and mechanisms').slice(0, 1800)}
"""

Return strictly a valid JSON object matching this schema:
{
  "title": "Visual Breakdown: ${topic || 'Key Concept'}",
  "summary": "Clear, intuitive 2-sentence explanation of what happens visually and mechanically",
  "topic": "${topic || 'Key Concept'}",
  "subject": "${subject}",
  "diagramType": "flowchart",
  "diagramSvg": "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 240' width='100%' height='240'>...</svg>",
  "cartoonCharacter": {
    "name": "${cartoonCharacter || 'Professor Paws'}",
    "avatar": "🐱",
    "expression": "excited",
    "dialogue": "Fun, encouraging cartoon character dialogue explaining the key mechanism in simple terms!",
    "tip": "Top exam tip or mental picture to remember"
  },
  "steps": [
    {
      "stepNumber": 1,
      "title": "Initial State / Input",
      "detail": "What we start with and the fundamental premise",
      "visualIcon": "🌱",
      "formula": "Initial condition or formula"
    },
    {
      "stepNumber": 2,
      "title": "Core Mechanism / Transformation",
      "detail": "How the process transforms or calculates step-by-step",
      "visualIcon": "⚡",
      "formula": "Key operating formula or rule"
    },
    {
      "stepNumber": 3,
      "title": "Result / Final Output",
      "detail": "What the final outcome represents in real-world applications",
      "visualIcon": "🎯",
      "formula": "Outcome equation"
    }
  ],
  "realWorldAnalogy": "Vivid real-life everyday analogy that makes this impossible to forget",
  "examTakeaway": "Golden rule for solving exam problems on this topic with 100% accuracy"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    if (!parsed.diagramSvg) {
      parsed.diagramSvg = getDefaultDiagramSvg(topic || 'Core Concept');
    }
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/visual/explain:', err);
    return res.json(getFallbackVisualExplanation(req.body.topic || 'Core Concept', req.body.subject || 'Coursework'));
  }
});

// ==========================================
// 6. MULTI-TURN TUTOR CHATBOT (gemini-3.1-pro-preview, gemini-3.8-flash, gemini-3.1-flash-lite)
// ==========================================
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  const { messages, topic, subject, language = 'English', role = 'coach', modelType = 'general' } = req.body;
  let selectedModel = 'gemini-3.8-flash';
  let systemInstruction = `You are QUESTORA's personal tutor for "${topic || 'General Studies'}" in "${subject || 'Coursework'}".
Language: ${language}.
Tone: Friendly, supportive, educational, clear.`;

  if (role === 'socratic') {
    systemInstruction += ` Role: Socratic STEM Professor. Ask probing, thoughtful questions to help the student derive principles from first premises.`;
  } else if (role === 'rapid') {
    systemInstruction += ` Role: Rapid Exam Drillmaster. Keep responses punchy, concise, and focused on high-yield exam takeaways.`;
  } else {
    systemInstruction += ` Role: Empathetic Study Coach. Explain concepts intuitively with real-life analogies and positive encouragement.`;
  }

  if (language && language.toLowerCase() === 'tanglish') {
    systemInstruction += ` Use natural colloquial Tanglish (Tamil words written in English alphabet) with a peer-to-peer student tone.`;
  }

  if (modelType === 'complex') {
    selectedModel = 'gemini-3.1-pro-preview';
  } else if (modelType === 'fast') {
    selectedModel = 'gemini-3.1-flash-lite';
  }

  const contents = (messages || []).map((m: { role: string; content: string }) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  if (contents.length === 0) {
    contents.push({
      role: 'user',
      parts: [{ text: `Hi! Explain ${topic || 'our lesson'} clearly.` }],
    });
  }

  try {
    if (!ai) {
      return res.json({
        reply: `Here to help you master ${topic || 'this concept'}! Break it down into smaller parts or ask me for a real-life analogy.`,
      });
    }

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
      },
    });

    return res.json({ reply: response.text, modelUsed: selectedModel });
  } catch (err: any) {
    console.error('Error in /api/tutor/chat:', err);
    const isQuota =
      err?.message?.toLowerCase().includes('quota') ||
      err?.message?.toLowerCase().includes('resource_exhausted') ||
      err?.status === 429;

    if (isQuota && ai && selectedModel !== 'gemini-3.1-flash-lite') {
      try {
        const fallbackRes = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents,
          config: { systemInstruction },
        });
        return res.json({
          reply: fallbackRes.text,
          modelUsed: 'gemini-3.1-flash-lite (lite tier)',
        });
      } catch (liteErr) {
        // Fall through to contextual answer
      }
    }

    const lastMsg = messages?.[messages.length - 1]?.content || '';
    const answer = getContextualTutorAnswer(topic, lastMsg);
    return res.json({
      reply: answer,
      modelUsed: 'questora-adaptive-tutor',
      quotaNote: isQuota
        ? 'Free tier quota limit reached. Answered with adaptive syllabus tutor.'
        : undefined,
    });
  }
});

// ==========================================
// 6B. VEO 3 VIDEO GENERATION (veo-3.1-fast-generate-preview)
// Animate images into video & Generate video from text
// ==========================================
app.post('/api/generate-video', async (req: Request, res: Response) => {
  try {
    const { prompt, imageBase64, mimeType = 'image/png', aspectRatio = '16:9' } = req.body;

    if (!prompt && !imageBase64) {
      return res.status(400).json({ error: 'Prompt or image is required for Veo video generation.' });
    }

    if (!ai) {
      return res.json({
        simulated: true,
        operationName: `models/veo-3.1-lite-generate-preview/operations/sim-${Date.now()}`,
      });
    }

    const validAspectRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    const config: any = {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: validAspectRatio,
    };

    let operation;
    if (imageBase64) {
      // Animate image into video
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt || 'Animate this educational diagram with smooth scientific visual motion',
        image: {
          imageBytes: imageBase64,
          mimeType,
        },
        config,
      });
    } else {
      // Generate video from text
      operation = await ai.models.generateVideos({
        model: 'veo-3.1-lite-generate-preview',
        prompt: prompt || '3D visualization of calculus tangents and rate of change',
        config,
      });
    }

    return res.json({ operationName: operation.name });
  } catch (err: any) {
    console.error('Error in /api/generate-video:', err);
    return res.json({
      simulated: true,
      operationName: `models/veo-3.1-lite-generate-preview/operations/sim-${Date.now()}`,
      error: err.message,
    });
  }
});

app.post('/api/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;

    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    if (operationName.includes('sim-') || !ai) {
      // Simulated completion for testing environments
      return res.json({ done: true, simulated: true });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });

    return res.json({
      done: updated.done,
      error: updated.error,
    });
  } catch (err: any) {
    console.error('Error in /api/video-status:', err);
    return res.json({ done: true, simulated: true, error: err.message });
  }
});

app.post('/api/video-download', async (req: Request, res: Response) => {
  try {
    const { operationName } = req.body;

    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    if (operationName.includes('sim-') || !ai) {
      // Fallback response for simulated test mode
      return res.json({
        simulated: true,
        message: 'Veo video generation simulation completed. Real-time rendering requires active Veo API credentials.',
      });
    }

    const op = new GenerateVideosOperation();
    op.name = operationName;
    const updated = await ai.operations.getVideosOperation({ operation: op });
    const uri = updated.response?.generatedVideos?.[0]?.video?.uri;

    if (!uri) {
      return res.status(404).json({ error: 'Video URI not found on completed operation.' });
    }

    const videoRes = await fetch(uri, {
      headers: { 'x-goog-api-key': apiKey },
    });

    res.setHeader('Content-Type', 'video/mp4');
    if (videoRes.body) {
      const arrayBuffer = await videoRes.arrayBuffer();
      res.send(Buffer.from(arrayBuffer));
    } else {
      res.status(500).json({ error: 'Could not stream video content' });
    }
  } catch (err: any) {
    console.error('Error in /api/video-download:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 7. TEXT-TO-SPEECH (TTS) with gemini-3.8-flash-tts
// ==========================================
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, speaker = 'Alex', style = 'Encouraging academic tutor' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    if (!ai) {
      return res.json({ simulated: true, message: 'Gemini API key required for real-time neural audio' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                speaker,
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return res.json({
        audioData: base64Audio,
        mimeType: 'audio/wav',
      });
    } else {
      return res.json({ simulated: true });
    }
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    return res.json({ simulated: true, error: err.message });
  }
});

// ==========================================
// 8. AUDIO TRANSCRIPTION with gemini-3.5-transcribe
// ==========================================
app.post('/api/transcribe', async (req: Request, res: Response) => {
  try {
    let { audioBase64, mimeType = 'audio/webm', prompt } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required' });
    }

    // Strip data URI prefix if provided (e.g. data:audio/webm;base64,xxxx)
    if (audioBase64.includes(';base64,')) {
      const parts = audioBase64.split(';base64,');
      if (parts[0] && parts[0].startsWith('data:')) {
        mimeType = parts[0].replace('data:', '');
      }
      audioBase64 = parts[1];
    }

    if (!ai) {
      return res.json({
        transcript: 'I need to review derivatives and understand the chain rule better for the upcoming calculus exam.',
        modelUsed: 'gemini-3.5-transcribe (fallback)',
        success: true,
      });
    }

    const audioPart = {
      inlineData: {
        mimeType,
        data: audioBase64,
      },
    };

    const transcribePrompt = prompt || 'Transcribe this student speech accurately and concisely. Return only the transcription text.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [audioPart, { text: transcribePrompt }],
      },
    });

    return res.json({
      transcript: response.text?.trim() || '',
      modelUsed: 'gemini-3.5-transcribe',
      success: true,
    });
  } catch (err: any) {
    console.error('Error in /api/transcribe:', err);
    return res.json({
      transcript: 'Could not clearly recognize audio. Please speak closer to the microphone.',
      error: err.message,
      modelUsed: 'gemini-3.5-transcribe',
      success: false,
    });
  }
});

// ==========================================
// 9. WEBSOCKET FOR GEMINI LIVE API (gemini-3.8-live)
// ==========================================
const wss = new WebSocketServer({ noServer: true });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('Client connected to QUESTORA Live voice session');

  let liveSession: any = null;

  if (ai) {
    try {
      liveSession = await (ai as any).live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are QUESTORA Live Voice Coach. Talk naturally, concisely, and warmly to help students revise.',
        },
        callbacks: {
          onmessage: (message: LiveServerMessage) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
      });
    } catch (err) {
      console.error('Error establishing Gemini Live connection:', err);
    }
  }

  clientWs.on('message', (data: any) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.audio && liveSession) {
        liveSession.sendRealtimeInput({
          audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
        });
      } else if (parsed.ping) {
        clientWs.send(JSON.stringify({ pong: true }));
      }
    } catch (e) {
      // ignore malformed input
    }
  });

  clientWs.on('close', () => {
    if (liveSession && typeof liveSession.close === 'function') {
      liveSession.close();
    }
  });
});

// ==========================================
// 10. GAME ARENA: Turn Uploaded/Inserted Notes into Interactive Educational Games
// ==========================================
app.post('/api/game/generate', async (req: Request, res: Response) => {
  try {
    const { studyMaterial, subject = 'General Studies', topic = 'Core Concepts' } = req.body;

    if (!studyMaterial && !topic) {
      return res.status(400).json({ error: 'studyMaterial or topic is required' });
    }

    if (!ai) {
      return res.json(getFallbackGameData(topic, subject));
    }

    const prompt = `You are QUESTORA's Game Engine Architect.
Convert the following uploaded or inserted study material into an exciting gamified study pack for students.
Study Material:
"""
${studyMaterial || topic}
"""
Subject: ${subject}
Topic: ${topic}

Generate a JSON object strictly matching this schema:
{
  "gameTitle": string (e.g. "Calculus Titan: Derivative Arena"),
  "bossName": string (e.g. "The Entropy Dragon"),
  "bossHealth": 100,
  "matchingPairs": [
    { "id": "m1", "term": "Short term", "definition": "Clear concise definition or formula" },
    { "id": "m2", "term": "Term 2", "definition": "Definition 2" },
    { "id": "m3", "term": "Term 3", "definition": "Definition 3" },
    { "id": "m4", "term": "Term 4", "definition": "Definition 4" },
    { "id": "m5", "term": "Term 5", "definition": "Definition 5" },
    { "id": "m6", "term": "Term 6", "definition": "Definition 6" }
  ],
  "bossQuestions": [
    {
      "id": 1,
      "question": "Question text",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct",
      "damage": 25
    },
    { "id": 2, "question": "Question 2", "options": ["A", "B", "C", "D"], "correctIndex": 1, "explanation": "Why", "damage": 25 },
    { "id": 3, "question": "Question 3", "options": ["A", "B", "C", "D"], "correctIndex": 2, "explanation": "Why", "damage": 25 },
    { "id": 4, "question": "Question 4", "options": ["A", "B", "C", "D"], "correctIndex": 3, "explanation": "Why", "damage": 25 },
    { "id": 5, "question": "Question 5", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "Why", "damage": 25 }
  ],
  "speedCards": [
    { "id": "c1", "statement": "Statement 1", "isTrue": true, "explanation": "Reason 1" },
    { "id": "c2", "statement": "Statement 2", "isTrue": false, "explanation": "Reason 2" },
    { "id": "c3", "statement": "Statement 3", "isTrue": true, "explanation": "Reason 3" },
    { "id": "c4", "statement": "Statement 4", "isTrue": false, "explanation": "Reason 4" },
    { "id": "c5", "statement": "Statement 5", "isTrue": true, "explanation": "Reason 5" },
    { "id": "c6", "statement": "Statement 6", "isTrue": false, "explanation": "Reason 6" }
  ],
  "scrambleWords": [
    { "id": "s1", "word": "DERIVATIVE", "hint": "The instantaneous rate of change" },
    { "id": "s2", "word": "INTEGRAL", "hint": "Accumulated area under a continuous curve" },
    { "id": "s3", "word": "TANGENT", "hint": "Straight line touching curve at single point" },
    { "id": "s4", "word": "LIMIT", "hint": "Value a function approaches as input approaches point" }
  ]
}
Return strictly JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/game/generate:', err);
    return res.json(getFallbackGameData(req.body.topic || 'Calculus', req.body.subject || 'Mathematics'));
  }
});

// ==========================================
// 11. MANGA ANIMATION GENERATOR (gemini-3.8-flash)
// Transforms any textbook or academic input into an Animated Manga Episode
// ==========================================
app.post('/api/manga/generate', async (req: Request, res: Response) => {
  try {
    const { topic, subject = 'General Studies', textContent, style = 'shonen' } = req.body;

    if (!topic && !textContent) {
      return res.status(400).json({ error: 'Topic or content is required' });
    }

    if (!ai) {
      return res.json(getFallbackMangaData(topic || 'Calculus & Instantaneous Derivatives', subject));
    }

    const prompt = `You are a world-class Anime & Manga Storyboard Master and STEM Professor.
Transform this academic lesson into an action-packed 4-panel Manga Episode:
Topic: "${topic || 'Key Academic Concept'}"
Subject: "${subject}"
Source Material:
"""
${(textContent || topic || 'Foundational principles, theorems, and real-world mechanisms').slice(0, 2000)}
"""

Format your response strictly as a JSON object with:
{
  "title": "e.g. EPISODE 1: The Instantaneous Slash!",
  "subtitle": "Short dramatic anime arc title",
  "conceptTitle": "${topic || 'Academic Concept'}",
  "subject": "${subject}",
  "characters": [
    { "name": "Sensei Akira", "role": "Master Mathematician", "avatar": "⚔️" },
    { "name": "Scholar Ren", "role": "Determined Student", "avatar": "🧠" }
  ],
  "panels": [
    {
      "panelNumber": 1,
      "character": "Sensei Akira",
      "avatar": "⚔️",
      "dialogue": "Dramatically introduce the core tension or problem in anime dialogue",
      "narration": "Rigorous educational explanation of the fundamental concept",
      "sfx": "ドドド (DODODO)",
      "visualAction": "Visual description of the character slicing through approximations or charging energy",
      "visualEffect": "speed_lines",
      "formula": "Core formula or theorem highlighted",
      "bgTheme": "fire"
    },
    {
      "panelNumber": 2,
      "character": "Scholar Ren",
      "avatar": "🧠",
      "dialogue": "Student realizes the key obstacle or misconception",
      "narration": "Deep dive into the mechanism and mathematical rule",
      "sfx": "ゴゴゴ (GOGOGO)",
      "visualAction": "Aura flares as the true principle is revealed",
      "visualEffect": "lightning",
      "formula": "Intermediate derivation step",
      "bgTheme": "electric"
    },
    {
      "panelNumber": 3,
      "character": "Sensei Akira",
      "avatar": "⚔️",
      "dialogue": "Unleashes the breakthrough technique/formula",
      "narration": "Mathematical proof and visual geometric interpretation",
      "sfx": "バァン (BAAAN!)",
      "visualAction": "A giant luminous equation forms as the ultimate technique",
      "visualEffect": "impact_flash",
      "formula": "The ultimate master formula",
      "bgTheme": "aurora"
    },
    {
      "panelNumber": 4,
      "character": "Scholar Ren",
      "avatar": "✨",
      "dialogue": "Victory statement connecting this theorem to real world exams and science",
      "narration": "Summary of the rule to memorize for tests",
      "sfx": "SHING!",
      "visualAction": "Character stands victorious with mastered knowledge glowing in eyes",
      "visualEffect": "focus_zoom",
      "formula": "Final takeaway rule",
      "bgTheme": "void"
    }
  ],
  "takeaway": "One punchy, memorable shonen-style rule to master this topic on exams."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('Error in /api/manga/generate:', err);
    return res.json(getFallbackMangaData(req.body.topic || 'Calculus Dynamics', req.body.subject || 'Mathematics'));
  }
});

server.on('upgrade', (request, socket, head) => {
  try {
    const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
    if (pathname === '/api/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
      return;
    }
  } catch (e) {
    // Allow non-custom upgrade requests to proceed without crashing
  }
  // Cleanly preserve socket for Vite dev server HMR handshakes and other connections
});

// ==========================================
// VITE MIDDLEWARE (DEV) & STATIC FILES (PROD)
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: {
          server,
        },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(port, () => {
    console.log(`QUESTORA server listening on port ${port}`);
  });
}

startServer();

// ==========================================
// FALLBACK DATA GENERATORS
// ==========================================
function getFallbackSyllabusData() {
  return {
    summary: '47 topics detected across 5 subjects.',
    totalTopics: 47,
    subjects: [
      { id: 'sub-1', name: 'Mathematics', totalTopics: 12, completedTopics: 8, confidence: 68, progressPercent: 72 },
      { id: 'sub-2', name: 'Physics', totalTopics: 15, completedTopics: 7, confidence: 51, progressPercent: 54 },
      { id: 'sub-3', name: 'Programming', totalTopics: 10, completedTopics: 8, confidence: 82, progressPercent: 86 },
      { id: 'sub-4', name: 'Chemistry', totalTopics: 6, completedTopics: 3, confidence: 60, progressPercent: 50 },
      { id: 'sub-5', name: 'Biology', totalTopics: 4, completedTopics: 2, confidence: 75, progressPercent: 50 },
    ],
    topics: [
      {
        id: 'top-1',
        subject: 'Mathematics',
        topicName: 'Derivatives & Chain Rule',
        unit: 'Calculus',
        chapter: 'Differentiation',
        difficulty: 'Hard',
        status: 'Needs Revision',
        confidence: 42,
        priority: 'High',
        revisionDate: 'Tomorrow',
      },
      {
        id: 'top-2',
        subject: 'Mathematics',
        topicName: 'Integration by Parts',
        unit: 'Calculus',
        chapter: 'Integral Calculus',
        difficulty: 'Hard',
        status: 'In Progress',
        confidence: 55,
        priority: 'High',
        revisionDate: 'In 2 days',
      },
      {
        id: 'top-3',
        subject: 'Mathematics',
        topicName: 'Matrix Eigenvalues & Eigenvectors',
        unit: 'Linear Algebra',
        chapter: 'Matrices',
        difficulty: 'Medium',
        status: 'Mastered',
        confidence: 88,
        priority: 'Medium',
        revisionDate: 'In 5 days',
      },
      {
        id: 'top-4',
        subject: 'Physics',
        topicName: 'Electromagnetic Induction & Faraday\'s Law',
        unit: 'Electromagnetism',
        chapter: 'Field Dynamics',
        difficulty: 'Hard',
        status: 'Needs Revision',
        confidence: 38,
        priority: 'High',
        revisionDate: 'Tomorrow',
      },
      {
        id: 'top-5',
        subject: 'Physics',
        topicName: 'Wave Particle Duality & Photoelectric Effect',
        unit: 'Quantum Physics',
        chapter: 'Modern Physics',
        difficulty: 'Medium',
        status: 'In Progress',
        confidence: 62,
        priority: 'Medium',
        revisionDate: 'In 3 days',
      },
      {
        id: 'top-6',
        subject: 'Programming',
        topicName: 'Binary Search Trees & Balancing',
        unit: 'Data Structures',
        chapter: 'Trees & Graphs',
        difficulty: 'Medium',
        status: 'Mastered',
        confidence: 85,
        priority: 'Low',
        revisionDate: 'In 1 week',
      },
      {
        id: 'top-7',
        subject: 'Programming',
        topicName: 'Dynamic Programming & Memoization',
        unit: 'Algorithms',
        chapter: 'Advanced Problem Solving',
        difficulty: 'Hard',
        status: 'In Progress',
        confidence: 65,
        priority: 'High',
        revisionDate: 'In 2 days',
      },
    ],
  };
}

function getFallbackPlanData(preferredTime: string) {
  return {
    summary: 'Optimized adaptive study schedule balanced for peak cognitive endurance and spaced repetition.',
    schedule: [
      { time: '6:00 PM', activity: 'Mathematics — Derivatives & Chain Rule', type: 'study', duration: 45, subject: 'Mathematics', taskId: 'task-1' },
      { time: '6:45 PM', activity: 'Hydration & Cognitive Reset Break', type: 'break', duration: 15, subject: 'Break', taskId: 'break-1' },
      { time: '7:00 PM', activity: 'Physics — Electromagnetic Induction', type: 'study', duration: 45, subject: 'Physics', taskId: 'task-2' },
      { time: '7:45 PM', activity: 'Quick Knowledge Check Quiz', type: 'quiz', duration: 15, subject: 'Physics', taskId: 'quiz-1' },
      { time: '8:00 PM', activity: 'Active Spaced-Repetition Revision', type: 'revision', duration: 30, subject: 'Mathematics', taskId: 'rev-1' },
    ],
    recommendations: [
      'Focus early energy on Calculus derivatives before mental fatigue sets in.',
      'Take advantage of the 15-minute reward break to step away from screens.',
    ],
  };
}

function getFallbackQuiz(topic: string, subject: string) {
  if (topic.toLowerCase().includes('derivative')) {
    return {
      topic: 'Derivatives & Chain Rule',
      subject: 'Mathematics',
      questions: [
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
      ],
    };
  }
  return {
    topic,
    subject,
    questions: [
      {
        id: 1,
        question: `What is the fundamental principle behind ${topic}?`,
        options: ['Conservation of state and rate of change', 'Static equilibrium', 'Unconstrained recursion', 'Random sampling'],
        correctOptionIndex: 0,
        explanation: `${topic} builds upon understanding rate transformations and state invariants.`,
      },
      {
        id: 2,
        question: `When applying ${topic} in real problems, what is the most common pitfall?`,
        options: ['Ignoring boundary conditions', 'Using too few variables', 'Always assuming non-linearity', 'Calculating in reverse'],
        correctOptionIndex: 0,
        explanation: 'Boundary conditions and base cases are essential to guarantee convergence and correctness.',
      },
      {
        id: 3,
        question: `How does mastery of ${topic} improve overall subject performance?`,
        options: ['It bridges foundational concepts with high-level problem solving', 'It eliminates the need for revision', 'It only applies to multiple choice questions', 'It is purely theoretical'],
        correctOptionIndex: 0,
        explanation: 'Mastering core mechanisms enables intuitive problem solving under exam conditions.',
      },
    ],
  };
}

function getFallbackReformat(topic: string, language: string) {
  if (language.toLowerCase() === 'tanglish') {
    return {
      topic,
      language: 'Tanglish',
      visual: {
        title: 'Speedometer Analogy — Visual Layout',
        diagram: `
+------------------------------------------+
|  Time Passed (t)  -->  Distance Walked   |
|  [0s] --------- 0m                       |
|  [1s] --------- 2m    (Slope = 2 m/s)    |
|  [2s] --------- 8m    (Slope = 6 m/s)    |
|  [3s] --------- 18m   (Slope = 10 m/s)   |
|                                          |
|  Derivative = Any point-la tangent slope!|
+------------------------------------------+`,
        breakdown: [
          'Graph-la ulla curve evlo steep-ah irukku-nu paakradhu.',
          'Point-by-point slope check panrom.',
          'Instantaneous speed reflect aagum.',
        ],
        keyTakeaway: 'Derivative-na instantaneous change mattum dhaan!',
      },
      logical: {
        title: 'Step-by-Step Reason (Logical Flow)',
        steps: [
          { step: 1, statement: 'Oru quantity change aagudhu (e.g. distance with time).', reason: 'Real life-la things constant-ah irukaadhu.' },
          { step: 2, statement: 'Average speed = Total distance / Total time.', reason: 'Ithu broad overall average.' },
          { step: 3, statement: 'Time gap-ah romba chinna limit (Δt -> 0) ku kondu varom.', reason: 'Oru exact microsecond speed theriyanum.' },
          { step: 4, statement: 'Result dhaan dy/dx (Derivative).', reason: 'Perfect exact rate of change kedaikkum.' },
        ],
        formulaOrRule: "f'(x) = lim(h->0) [f(x+h) - f(x)] / h",
        conclusion: 'Derivative is just zeroing in on an instant.',
      },
      story: {
        title: 'Car Speedometer Kadhai (Story Mode)',
        analogy: 'Chennai to Bangalore highway driving',
        narrative: 'Neenga Chennai-la irundhu Bangalore drive panreenga. 300km travel panna 5 hours aachu, so unga average speed 60 km/h. Aana toll booth kitta neenga 0 km/h-la ninneenga, bypass road-la 100 km/h-la poneenga. Unga speedometer right now kaattradhu dhaan DERIVATIVE! That single instant speed.',
        moral: 'Average pathi yosikaatheenga, current moment speed dhaan derivative.',
      },
      quickCheckQuestion: {
        question: 'Speedometer instantaneous speed kaatudha or average speed kaatudha?',
        answer: 'Instantaneous speed (Derivative)!',
      },
    };
  }

  return {
    topic,
    language: 'English',
    visual: {
      title: 'Geometric Slope & Tangent View',
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
      Slope = lim(Δx->0) Δy / Δx = f'(x)
`,
      breakdown: [
        'Imagine zooming into any smooth curve until it looks like a straight line.',
        'The tilt or slope of that straight line at that exact coordinate is the derivative.',
        'If the graph is rising, derivative is positive; if falling, derivative is negative.',
      ],
      keyTakeaway: 'The derivative is simply the instantaneous slope of a graph.',
    },
    logical: {
      title: 'Step-by-Step Mathematical Deduction',
      steps: [
        { step: 1, statement: 'Pick two points on a curve: (x, f(x)) and (x+h, f(x+h)).', reason: 'Two points define a secant line.' },
        { step: 2, statement: 'Calculate the secant slope: [f(x+h) - f(x)] / h.', reason: 'Rise over run formula.' },
        { step: 3, statement: 'Let distance h shrink toward 0 (limit as h -> 0).', reason: 'Brings the two points together into a single instantaneous point.' },
        { step: 4, statement: 'The resulting limit f\'(x) is the exact rate of change.', reason: 'Removes approximation error.' },
      ],
      formulaOrRule: "f'(x) = lim(h->0) [f(x+h) - f(x)] / h",
      conclusion: 'A derivative is a rigorous limit that measures local sensitivity.',
    },
    story: {
      title: 'The Police Radar Gun Analogy',
      analogy: 'Highway Speed Enforcement',
      narrative: 'Suppose you drove 120 miles in 2 hours. Your average speed was 60 mph. But if a traffic officer points a radar gun at you on a downhill stretch, they do not care about your 2-hour trip average. The radar gun measures how far your car moved in a split millisecond: that instantaneous reading is the derivative of your position.',
      moral: 'A derivative isolates what is happening right now, stripped of past or future averages.',
    },
    quickCheckQuestion: {
      question: 'What does a derivative equal when a curve reaches its peak (maximum)?',
      answer: 'Zero, because the tangent line is completely horizontal at the peak.',
    },
  };
}

function getFallbackGameData(topic: string, subject: string) {
  return {
    gameTitle: `${topic || 'Knowledge'} Quest: Arena Challenge`,
    bossName: `The ${topic || 'Exam'} Titan`,
    bossHealth: 100,
    matchingPairs: [
      { id: 'm1', term: 'Derivative', definition: 'Instantaneous rate of change of a curve at a single point' },
      { id: 'm2', term: 'Integral', definition: 'Accumulated total area under a continuous curve' },
      { id: 'm3', term: 'Tangent Line', definition: 'Straight line that touches a curve at exactly one coordinate' },
      { id: 'm4', term: 'Limit', definition: 'The value a function approaches as input nears a specific value' },
      { id: 'm5', term: 'Chain Rule', definition: 'Formula to differentiate composite functions f(g(x))' },
      { id: 'm6', term: 'Second Derivative', definition: 'Measures the concavity and acceleration of a curve' },
    ],
    bossQuestions: [
      {
        id: 1,
        question: `In ${topic}, what is the derivative of x^3 with respect to x?`,
        options: ['3x^2', '2x^3', '3x', 'x^2 / 3'],
        correctIndex: 0,
        explanation: 'By the power rule: d/dx[x^n] = n*x^(n-1), so d/dx[x^3] = 3x^2.',
        damage: 25,
      },
      {
        id: 2,
        question: 'When the derivative f\'(x) is equal to zero on a smooth curve, what does it indicate?',
        options: ['Vertical asymptote', 'Critical point (local max/min or inflection)', 'Discontinuity', 'Infinite slope'],
        correctIndex: 1,
        explanation: 'f\'(x) = 0 means the tangent line is flat, marking a potential peak, valley, or saddle point.',
        damage: 25,
      },
      {
        id: 3,
        question: 'What does the Chain Rule compute?',
        options: ['Sum of two functions', 'Derivative of composite nested functions', 'Product of matrices', 'Area under a circle'],
        correctIndex: 1,
        explanation: 'Chain rule: [f(g(x))]\' = f\'(g(x)) * g\'(x).',
        damage: 25,
      },
      {
        id: 4,
        question: 'If position s(t) is given over time, what is its first derivative with respect to time?',
        options: ['Acceleration', 'Instantaneous Velocity', 'Force', 'Total Distance'],
        correctIndex: 1,
        explanation: 'Velocity is ds/dt, the rate of change of position with respect to time.',
        damage: 25,
      },
      {
        id: 5,
        question: 'What is the derivative of sin(x)?',
        options: ['cos(x)', '-cos(x)', 'tan(x)', '-sin(x)'],
        correctIndex: 0,
        explanation: 'The standard derivative of sine is cosine: d/dx[sin(x)] = cos(x).',
        damage: 25,
      },
    ],
    speedCards: [
      { id: 'c1', statement: 'The derivative of a constant number is always zero.', isTrue: true, explanation: 'Constants do not change, so their rate of change is 0.' },
      { id: 'c2', statement: 'Integration and differentiation are inverse mathematical operations.', isTrue: true, explanation: 'By the Fundamental Theorem of Calculus, they reverse each other.' },
      { id: 'c3', statement: 'A sharp corner on a graph is always differentiable.', isTrue: false, explanation: 'Sharp cusps/corners have conflicting left and right limits, so no unique tangent exists.' },
      { id: 'c4', statement: 'The derivative of e^x is e^x itself.', isTrue: true, explanation: 'The natural exponential function is its own derivative.' },
      { id: 'c5', statement: 'Velocity is the integral of acceleration with respect to time.', isTrue: true, explanation: 'Integrating acceleration gives the velocity function plus a constant.' },
      { id: 'c6', statement: 'If a function is continuous, it must always be differentiable.', isTrue: false, explanation: 'Functions like f(x) = |x| are continuous everywhere, but not differentiable at x=0.' },
    ],
    scrambleWords: [
      { id: 's1', word: 'DERIVATIVE', hint: 'Instantaneous rate of change' },
      { id: 's2', word: 'INTEGRAL', hint: 'Area under a curve' },
      { id: 's3', word: 'TANGENT', hint: 'Line touching a curve at one point' },
      { id: 's4', word: 'CALCULUS', hint: 'Mathematics of continuous change' },
    ],
  };
}

function getFallbackMangaData(topic: string, subject: string) {
  return {
    title: `ARC 1: The Secret of ${topic}`,
    subtitle: 'Awakening the First Principles',
    conceptTitle: topic,
    subject: subject || 'Science & Mathematics',
    characters: [
      { name: 'Sensei Akira', role: 'Grand Master Tutor', avatar: '⚔️' },
      { name: 'Scholar Ren', role: 'Prodigy Student', avatar: '🧠' },
      { name: 'Rival Ryuto', role: 'Exam Nemesis', avatar: '⚡' },
    ],
    panels: [
      {
        panelNumber: 1,
        character: 'Sensei Akira',
        avatar: '⚔️',
        dialogue: `Look closely, Ren! The enemy attacks with complex questions, but ${topic} can be sliced cleanly into first principles!`,
        narration: `In nature, every change happens through continuous progression. When we isolate the rate of change at one exact instant, the mystery resolves.`,
        sfx: 'ドドド (DODODO)',
        visualAction: 'Sensei stands before a massive glowing celestial diagram, energy swirling around his chalkboard brush.',
        visualEffect: 'speed_lines',
        formula: 'Δy / Δx as Δx → 0',
        bgTheme: 'fire',
      },
      {
        panelNumber: 2,
        character: 'Scholar Ren',
        avatar: '🧠',
        dialogue: 'N-NANI?! You mean the tangent line isn\'t an approximation—it\'s the true instantaneous velocity?!',
        narration: 'By taking the mathematical limit as the interval h approaches zero, the secant line transforms seamlessly into a single tangent coordinate.',
        sfx: 'ゴゴゴ (GOGOGO)',
        visualAction: 'Ren\'s eyes widen as glowing equations form a protective matrix around him, shattering the error approximations.',
        visualEffect: 'lightning',
        formula: "f'(x) = lim(h→0) [f(x+h) - f(x)] / h",
        bgTheme: 'electric',
      },
      {
        panelNumber: 3,
        character: 'Sensei Akira',
        avatar: '⚔️',
        dialogue: 'BEHOLD! The ultimate technique: Differentiation unlocks instantaneous rates across all physics and engineering!',
        narration: 'Velocity is derivative of position. Current is derivative of charge. Marginal profit is derivative of revenue. The same truth governs all!',
        sfx: 'バァン (BAAAN!)',
        visualAction: 'A supernova of geometric vectors explodes across the panel as the master equation is forged.',
        visualEffect: 'impact_flash',
        formula: 'd/dx [x^n] = n · x^(n-1)',
        bgTheme: 'aurora',
      },
      {
        panelNumber: 4,
        character: 'Scholar Ren',
        avatar: '✨',
        dialogue: 'I SEE IT! I CAN SOLVE ANY PROBLEM ON THIS TEST NOW! LET\'S CONQUER THE FINAL EXAM!',
        narration: 'Mastery achieved: Never fear complex variations. Anchor to the fundamental rate rule and evaluate step by step.',
        sfx: 'SHING!',
        visualAction: 'Ren leaps forward with an aura of mastery, ready to crush any academic challenge with complete confidence.',
        visualEffect: 'focus_zoom',
        formula: 'MASTERY UNLOCKED: 100% ACCURACY',
        bgTheme: 'void',
      },
    ],
    takeaway: `Master ${topic} by breaking it down to instantaneous rates: never get bogged down by surface complexity!`,
  };
}

function cleanAndParseJson<T>(raw: string, fallback: T): T {
  if (!raw || typeof raw !== 'string') return fallback;
  try {
    let cleaned = raw.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    const firstBrace = cleaned.indexOf('{');
    const firstBracket = cleaned.indexOf('[');
    if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
      const lastBrace = cleaned.lastIndexOf('}');
      if (lastBrace !== -1) {
        cleaned = cleaned.slice(firstBrace, lastBrace + 1);
      }
    } else if (firstBracket !== -1) {
      const lastBracket = cleaned.lastIndexOf(']');
      if (lastBracket !== -1) {
        cleaned = cleaned.slice(firstBracket, lastBracket + 1);
      }
    }
    return JSON.parse(cleaned);
  } catch (e) {
    return fallback;
  }
}

function getContextualTutorAnswer(topic: string, question: string) {
  const cleanQ = (question || '').toLowerCase();
  if (cleanQ.includes('formula') || cleanQ.includes('equation')) {
    return `For ${topic || 'this concept'}, remember the foundational formula. Focus on isolating each variable step-by-step and checking units before calculating.`;
  }
  if (cleanQ.includes('example') || cleanQ.includes('analogy') || cleanQ.includes('real life')) {
    return `Here is a real-world analogy for ${topic || 'this lesson'}: Think of it like a vehicle's speedometer measuring your instant velocity at one split second, rather than your average speed across the whole trip.`;
  }
  return `Great question on ${topic || 'this topic'}! To master this, break it into three steps: 1) Identify given values and initial conditions, 2) Apply the transformation or theorem, and 3) Verify edge cases. Would you like a step-by-step practice problem?`;
}

function getDefaultDiagramSvg(topic: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 240" width="100%" height="240" style="background:#0b1120; border-radius:16px;">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#38bdf8;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#818cf8;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#f43f5e;stop-opacity:0.8" />
      <stop offset="100%" style="stop-color:#fbbf24;stop-opacity:0.8" />
    </linearGradient>
  </defs>
  <!-- Grid Lines -->
  <line x1="60" y1="40" x2="60" y2="200" stroke="#1e293b" stroke-width="2"/>
  <line x1="60" y1="200" x2="540" y2="200" stroke="#1e293b" stroke-width="2"/>
  <!-- Smooth Function Curve -->
  <path d="M 80 190 Q 220 180, 320 110 T 520 40" fill="none" stroke="url(#grad1)" stroke-width="4"/>
  <!-- Tangent Line -->
  <line x1="190" y1="185" x2="450" y2="35" stroke="url(#glow)" stroke-width="3" stroke-dasharray="6,4"/>
  <!-- Point of Contact P -->
  <circle cx="320" cy="110" r="7" fill="#fbbf24" stroke="#ffffff" stroke-width="2"/>
  <!-- Labels -->
  <text x="75" y="30" fill="#f8fafc" font-family="sans-serif" font-weight="900" font-size="14">VISUAL MECHANISM: ${topic.slice(0, 30)}</text>
  <text x="335" y="115" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="12">P(x, y) Tangent</text>
  <text x="180" y="225" fill="#94a3b8" font-family="sans-serif" font-size="11">Input Domain (x) ──► Transformation ──► Rate of Change</text>
</svg>`;
}

function getFallbackVisualExplanation(topic: string, subject: string) {
  return {
    title: `Visual Breakdown: ${topic}`,
    summary: `At its core, ${topic} describes how variables interact dynamically. By zooming into each step, the relationship becomes crystal clear.`,
    topic,
    subject: subject || 'Coursework',
    diagramType: 'flowchart',
    diagramSvg: getDefaultDiagramSvg(topic),
    cartoonCharacter: {
      name: 'Professor Paws 🐱',
      avatar: '🐱',
      expression: 'excited',
      dialogue: `Meow-velous! Don't let complex equations spook you! Think of ${topic} like calculating the exact speed of a pouncing cat right at the moment of takeoff!`,
      tip: 'Remember to isolate variables one at a time before combining them in the final step.',
    },
    steps: [
      {
        stepNumber: 1,
        title: 'Step 1: Identify Known Values',
        detail: `Start with the baseline conditions and recognize the fundamental relationship governing ${topic}.`,
        visualIcon: '🌱',
        formula: 'Initial State: f(x)',
      },
      {
        stepNumber: 2,
        title: 'Step 2: Apply the Core Transformation',
        detail: 'Evaluate the rate of change or mechanism step-by-step without skipping intermediate terms.',
        visualIcon: '⚡',
        formula: "Rate Transformation: f'(x) = df / dx",
      },
      {
        stepNumber: 3,
        title: 'Step 3: Conclude the Target Solution',
        detail: 'Verify units and plug in boundary conditions to verify real-world consistency.',
        visualIcon: '🎯',
        formula: 'Final Verification: 100% Validated',
      },
    ],
    realWorldAnalogy: `Like a car speedometer calculating your instant speed instead of your whole-day trip average!`,
    examTakeaway: `Always state the primary definition first on exam sheets: this guarantees partial credit even on tough calculations!`,
  };
}
