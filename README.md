# Nirog AI

AI-powered clinical triage and health assessment platform for doctors and patients.

**Live → [nirog-ai.vercel.app](https://nirog-ai.vercel.app)**

---

## Overview

Nirog AI is a full-stack medical assistant that lets doctors run AI-powered triage, generate SOAP notes, check drug interactions, and send patients smart intake forms — all from a single dashboard.

The AI pipeline is built on a multi-agent architecture: symptoms enter, and six specialised agents (RAG retrieval, triage, vision, follow-up, assessment, drug interaction) run sequentially to produce a structured clinical report.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express 5, MongoDB Atlas, JWT, SendGrid |
| AI Server | Python, FastAPI, Groq (Llama 3.3 70B), Claude Vision, OpenFDA |
| Deployment | Vercel (frontend) · Render (backend + AI server) |

---

## Features

- **Triage** — RED / YELLOW / GREEN urgency scoring via rule-based + LLM pipeline, grounded in clinical guidelines using RAG
- **SOAP Notes** — Structured clinical notes generated from patient symptoms, ready for EMR
- **Drug Interactions** — OpenFDA label data cross-referenced with an LLM, ranked by severity
- **Image Analysis** — Claude Vision analyses photos of rashes, wounds, or eyes
- **Patient Intake** — Doctor sends a tokenised email link; patient fills a form; AI report lands in the doctor's dashboard automatically
- **Medical Chatbot** — Conversational assistant for general health questions

---

## Getting Started

**Prerequisites:** Node.js ≥ 18, Python ≥ 3.10, MongoDB Atlas, Groq API key, SendGrid account

```bash
git clone https://github.com/adityajain-27/Nirog-AI.git
cd Nirog-AI
```

**Frontend**
```bash
cd frontend && npm install && npm run dev   # http://localhost:5173
```

**Backend**
```bash
cd backend && npm install && cp .env.example .env && npm run dev   # http://localhost:5000
```

**AI Server**
```bash
cd files && pip install -r requirements.txt && cp .env.example .env
uvicorn api_server:app --reload --port 8000
```

---

## Environment Variables

**`backend/.env`**
```
MONGODB_URI=
JWT_SECRET=
PYTHON_AI_URL=https://your-ai-server.onrender.com
APP_URL=https://your-frontend.vercel.app
SENDGRID_API_KEY=
SENDGRID_VERIFIED_SENDER=
```

**`files/.env`**
```
GROQ_API_KEY=
```

**`frontend/.env.local`**
```
VITE_NODE_URL=https://your-backend.onrender.com
VITE_PYTHON_URL=https://your-ai-server.onrender.com
```

> Render's free tier blocks outbound SMTP — SendGrid (HTTPS-based) is used for all email sending.

---

## AI Pipeline

```
Symptoms + Image + Medications
        │
        ├── [1] RAG Agent          Retrieve clinical guidelines from vector DB
        ├── [2] Triage Agent       Assign RED / YELLOW / GREEN urgency
        ├── [3] Vision Agent       Analyse uploaded image (Claude Vision)
        ├── [4] Follow-up Agent    Generate OPQRST-guided clinical questions
        ├── [5] Assessment Agent   Generate SOAP note + differential diagnosis
        └── [6] Drug Agent         Flag interactions via OpenFDA + LLM
```

---

## API Reference

**AI Server** (`/files`, port 8000)

```
POST /assess          Text-only assessment
POST /assess/image    Assessment with image upload
POST /followup        Generate follow-up questions
POST /chat            Medical chatbot
POST /drug-check      Standalone drug interaction check
GET  /health          Health check
```

**Backend** (`/backend`, port 5000)

```
POST /api/auth/register
POST /api/auth/login
GET  /api/patients                    (auth)
POST /api/doctor/assess               (auth)
POST /api/intake/send                 (auth)
GET  /api/intake/:token               (public)
POST /api/intake/:token/submit        (public)
```

---

## Disclaimer

This project is for research and educational purposes only. It does not constitute medical advice and must not replace professional clinical judgment.
