import express from "express";
import { createServer as createViteServer } from "vite";
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";
import helmet from 'helmet';
import cors from 'cors';
import { body, validationResult } from 'express-validator';
import { Translate } from '@google-cloud/translate/build/src/index.js';
import compression from 'compression';
import { MAX_MESSAGE_LENGTH, MAX_HISTORY_LENGTH, CACHE_TTL_MS, APP_NAME } from './src/utils/constants.js';

const responseCache = new Map<string, { reply: string; timestamp: number }>();
const CACHE_TTL = CACHE_TTL_MS;

const translateClient = new Translate({
  key: process.env.GOOGLE_TRANSLATE_API_KEY || process.env.GEMINI_API_KEY
});

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // JSON middleware
  app.use(express.json());

  app.use(cors({
    origin: process.env.APP_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: false
  }));

  app.use(compression());
  
  // Security headers using Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "https://www.googletagmanager.com", "https://www.google-analytics.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https://www.google-analytics.com", "https://region1.google-analytics.com"],
        imgSrc: ["'self'", "data:", "https://www.google-analytics.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }));

  // Rate limiter — scoped to /api routes only (FIX 1)
  const rateLimitMap = new Map();
  app.use('/api', (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
      return next();
    }
    const limitData = rateLimitMap.get(ip);
    if (now > limitData.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
      return next();
    }
    if (limitData.count >= 20) {
      return res.status(429).json({ error: "Too many requests" });
    }
    limitData.count += 1;
    next();
  });

  // Initialize Gemini
  let ai: GoogleGenAI | null = null;
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }

  // API Routes (Backend logic goes here)
  app.get("/api/health", (req, res) => {
    res.json({ status: 'ok', app: APP_NAME, version: '1.0.0' });
  });

  /**
   * POST /api/translate
   * Translates text using Google Cloud Translation API.
   * Used for dynamic Hindi translation of user-generated content.
   * @param {string} text - Text to translate
   * @param {string} targetLang - Target language code ('hi' or 'en')
   * @returns {Object} { translatedText: string }
   */
  app.post('/api/translate',
    [
      body('text').isString().trim().notEmpty().isLength({ max: 500 }),
      body('targetLang').isIn(['hi', 'en']),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid input' });
      }
      const { text, targetLang } = req.body;
      try {
        const [translation] = await translateClient.translate(text, targetLang);
        res.json({ translatedText: translation });
      } catch (error) {
        // Fallback gracefully if API key not set
        res.json({ translatedText: text });
      }
    }
  );

  /**
   * POST /api/chat
   * Proxies user messages to Gemini API server-side.
   * Keeps API key secure — never exposed to client.
   * @param {string} message - User's message (max 1000 chars)
   * @param {Array} history - Conversation history for context
   * @returns {Object} { reply: string }
   */
  app.post('/api/chat',
    [
      body('message').isString().trim().notEmpty().isLength({ max: MAX_MESSAGE_LENGTH }),
      body('history').optional().isArray({ max: MAX_HISTORY_LENGTH }),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Invalid input', details: errors.array() });
      }
      try {
        if (!ai) {
          return res.status(500).json({ error: "Gemini API key is missing on the server" });
        }

        const { message, history } = req.body;

      const cacheKey = message.trim().toLowerCase().slice(0, 100);
      const cached = responseCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json({ reply: cached.reply });
      }
      
      const systemInstruction = `You are Disha, a friendly, knowledgeable, and trusted guide to India's election process, created to help Indian citizens exercise their democratic rights.

Your knowledge covers:
- How to register to vote (Form 6 for residents, Form 6A for NRIs, Form 7 for deletions)
- How EVMs (Electronic Voting Machines) work and why they are considered secure by ECI
- What VVPAT (Voter Verifiable Paper Audit Trail) is and how the 7-second slip display works
- What NOTA (None Of The Above) means and how it is counted
- The Model Code of Conduct (MCC) — what is allowed and prohibited during election period
- The 7-phase election process from notification to government formation
- Voter eligibility criteria: age 18+, Indian citizenship, residency in constituency
- How to check your name on the electoral roll at electoralsearch.eci.gov.in
- Postal ballot and service voter provisions for armed forces and government employees

Response rules:
1. Respond ONLY in the same language the user writes in. Hindi input = Hindi output. English input = English output. Never mix languages in one reply.
2. Keep every reply under 120 words. Be direct and clear.
3. Never mention, support, criticize, or compare any political party, politician, candidate, or government policy.
4. If asked anything outside elections and voting, politely redirect: say you only know about India's election process and offer to answer election questions.
5. Always end responses about registration or voting with the relevant ECI portal link when appropriate.`;

      const contents = (history || []).map((msg: any) => ({
        role: msg.role === 'bot' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction,
        }
      });

      const replyText = response.text || "";
      
      responseCache.set(cacheKey, { reply: replyText, timestamp: Date.now() });

      // Clean old entries periodically
      if (responseCache.size > 100) {
        const now = Date.now();
        for (const [key, val] of responseCache.entries()) {
          if (now - val.timestamp > CACHE_TTL) responseCache.delete(key);
        }
      }

      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Failed to fetch response" });
    }
  });

  // Vite Integration for Serving Frontend
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Note: If deploying to production, static file handling goes here.
    // Ensure dist path is correctly routed.
    const path = await import('path');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
