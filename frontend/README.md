# Nirog AI — AI-Powered Clinical Triage & Assessment

> A full-stack web app that uses a multi-agent AI pipeline to perform medical triage, generate SOAP notes, check drug interactions, and help doctors manage patients — built for a hackathon demo.

![Stack](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript%20%2B%20Vite-blue)
![Stack](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20MongoDB-green)
![Stack](https://img.shields.io/badge/AI-Python%20%2B%20FastAPI%20%2B%20Groq-orange)

---

## What It Does

- **AI Triage** — RED / YELLOW / GREEN urgency classification from patient symptoms
- **SOAP Note Generation** — Structured clinical notes generated from patient input
- **Drug Interaction Checker** — Cross-references OpenFDA data and flags risks
- **Follow-up Question Engine** — OPQRST-guided dynamic Q&A to refine diagnosis
- **Multimodal Input** — Upload images of rashes, wounds, etc. for vision analysis
- **Doctor Dashboard** — Manage patients, view assessment history, analytics
- **Patient Intake via Email** — Send branded intake form links to patients; results go straight to the doctor's dashboard
- **Credit System** — Token-based usage with Razorpay payment integration

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| Backend | Node.js, Express 5, MongoDB Atlas, Mongoose, JWT Auth |
| AI Server | Python, FastAPI, Groq (Llama 3.3), RAG pipeline, OpenFDA |
| Email | Nodemailer (Gmail SMTP) |
| Deployment | Vercel (frontend), Render (backend + AI) |

---

## Project Structure

```
├── frontend/          # React + TypeScript frontend (Vite)
├── backend/           # Node.js REST API (auth, credits, doctor routes)
└── files/             # Python AI server (multi-agent pipeline)
    ├── api_server.py  # FastAPI entry point
    ├── orchestrator.py
    ├── agents/        # RAG, Triage, Vision, SOAP, Drug agents
    └── ...
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.10+
- MongoDB Atlas account
- Groq API key ([console.groq.com](https://console.groq.com))
- Gmail App Password (for intake emails)

---

### 1. Python AI Server

```bash
cd files
pip install -r requirements.txt
cp .env.example .env    # fill in your GROQ_API_KEY
uvicorn api_server:app --reload --port 8000
```

### 2. Node.js Backend

```bash
cd backend
npm install
cp .env.example .env    # fill in MongoDB, JWT, email, and app URL
npm run dev             # starts on port 5000
```

### 3. React Frontend

```bash
cd frontend
npm install
cp .env.example .env    # set VITE_NODE_URL and VITE_AI_URL
npm run dev             # starts on http://localhost:5173
```

---

## Environment Variables

### `backend/.env`
| Key | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string (use `openssl rand -hex 32`) |
| `PYTHON_AI_URL` | URL of the Python FastAPI server |
| `EMAIL_USER` | Gmail address for sending intake emails |
| `EMAIL_PASS` | Gmail App Password |
| `APP_URL` | Frontend URL (for intake email links) |

### `files/.env`
| Key | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for LLM inference |

### `frontend/.env`
| Key | Description |
|---|---|
| `VITE_NODE_URL` | Node.js backend URL |
| `VITE_AI_URL` | Python AI server URL |

---

## AI Pipeline Architecture

```
Patient Input (symptoms + image + medications)
          │
          ▼
    ORCHESTRATOR
    ├── [1] RAGAgent          → retrieves clinical guidelines
    ├── [2] TriageAgent       → RED / YELLOW / GREEN classification
    ├── [3] VisionAgent       → image analysis (skin, wounds, eyes)
    ├── [4] FollowUpAgent     → OPQRST-guided follow-up questions
    ├── [5] AssessmentAgent   → SOAP note + differential diagnosis
    └── [6] DrugAgent         → OpenFDA interaction checker
```

---

## Disclaimer

This project is a **hackathon prototype** for research and educational purposes only. It does **not** constitute medical advice and should not replace professional clinical judgment. Always consult a qualified healthcare provider.

---

## License

MIT