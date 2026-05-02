# Disha — Your Guide to India's Elections

> An AI-powered, bilingual civic education platform helping Indian citizens navigate the election process, verify eligibility, and exercise their democratic rights.

**Live App**: [YOUR CLOUD RUN URL]  
**Built for**: Google PromptWars Virtual Challenge 2 — Hack2Skill  
**Stack**: React + Vite + TypeScript · Node.js + Express · Gemini API · Google Cloud Run

---

## 🎯 Chosen Vertical
**Civic Education & Democratic Engagement**
Disha focuses on the critical need for accessible, bilingual civic education in India. With 968M+ registered voters, a massive portion of the population (especially first-time voters and those from non-English speaking backgrounds) struggles with the complexities of voter registration, understanding Electronic Voting Machines (EVMs), Voter Verifiable Paper Audit Trails (VVPATs), and the "None of the Above" (NOTA) option. Disha bridges this knowledge gap.

---

## 🧠 Approach and Logic
Our approach is built around **accessibility, personalization, and secure AI integration**:
1. **Bilingual First**: Language shouldn't be a barrier to democracy. The platform is inherently bilingual (English/Hindi), with an AI that dynamically responds in the user's preferred language.
2. **Journey-Based Guidance**: Instead of dumping information, Disha categorizes users (First-time, NRI, Returning) and tailors the learning journey.
3. **Secure AI Implementation**: We purposefully moved the Gemini API integration to a secure Node.js backend. This prevents API key exposure on the frontend while allowing us to enforce rate limits (20 req/min) and custom system prompts for consistent, unhallucinated civic responses.

---

## ⚙️ How the Solution Works
Disha operates as a unified platform with 6 core modules:
- **Home**: Role-based entry points for different types of citizens.
- **Timeline**: An interactive 7-phase breakdown of the Indian election process (from Notification to Government Formation).
- **Eligibility**: A quick 3-question quiz that evaluates user inputs to provide personalized next steps.
- **Learn**: Visual, easy-to-understand explanations of EVM, VVPAT, and NOTA.
- **Register**: A step-by-step guide with direct links to the official Election Commission of India (ECI) portals.
- **AI Chat**: A backend-proxied Gemini AI assistant. When a user asks a question, the backend attaches a strict system prompt (confining it to civic education) and returns the generated answer in the user's language.

---

## 🤔 Assumptions Made
- **Device & Network**: Assumes users are accessing via mobile or desktop web browsers with standard internet connectivity (optimized with SVGs and minimal payload).
- **Target Audience**: Built under the assumption that the primary audience needs simplified, jargon-free explanations of civic processes.
- **Official Portal Availability**: Assumes that the official ECI portals linked for registration and checking voter rolls are active and maintained by the government.
- **Language**: English and Hindi cover a large majority of the target demographic; regional languages are out of scope for this MVP but assumed as a future expansion.

---

## Key Technical Decisions
- **Server-side API key**: Gemini API key never exposed to the browser.
- **Bilingual System Prompt**: Ensures the AI strictly adheres to the language used by the user.
- **Security & Performance**: Rate limiting implemented, plus strict security headers (X-Frame-Options, etc.).
- **Accessibility**: ARIA labels, semantic HTML, and high contrast ratios.

---

## How to Run Locally

```bash
git clone https://github.com/YOUR_USERNAME/disha
cd disha
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm run dev
```

Open http://localhost:3000

## Run Tests

```bash
npm test
```

---

## Deployment

Deployed to Google Cloud Run via AI Studio one-click deploy.  
The `GEMINI_API_KEY` is configured as a Cloud Run environment variable — never in source code.

---

*Disclaimer: Disha is an educational platform. It is not an official Election Commission of India website.*
