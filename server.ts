import express from "express";
import { createServer as createViteServer } from "vite";
import 'dotenv/config';
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON middleware
  app.use(express.json());

  // Security headers (FIX 10)
  app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    next();
  });

  // CORS — scoped to /api routes only (FIX 9)
  app.use('/api', (req, res, next) => {
    const allowedOrigin = process.env.APP_URL || '*';
    res.header('Access-Control-Allow-Origin', allowedOrigin);
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(204).end();
    next();
  });

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
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: "Gemini API key is missing on the server" });
      }

      const { message, history } = req.body;
      
      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: "Message is required" });
      }

      if (message.length > 1000) {
        return res.status(400).json({ error: "Message too long" });
      }

      // Validate history field (FIX 6)
      if (history !== undefined && !Array.isArray(history)) {
        return res.status(400).json({ error: "History must be an array" });
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

      res.json({ reply: response.text });
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
