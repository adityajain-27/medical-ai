<h1 align="center">
  <img src="https://img.shields.io/badge/Nirog_AI-AI--Powered_Clinical_Assistant-0ea5e9?style=for-the-badge&logo=heart&logoColor=white" alt="Nirog AI" />
</h1>

<p align="center">
  An AI-powered clinical triage and health assessment platform for doctors and patients.
  <br/>
  <strong>Multi-agent AI pipeline · Patient intake forms via email · SOAP note generation · Drug interaction checking</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-TypeScript-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployed-Render_%26_Vercel-blueviolet" />
</p>

---

## ✨ Features

- 🩺 **AI Triage** — RED / YELLOW / GREEN urgency classification with clinical reasoning
- 📋 **SOAP Note Generation** — Structured clinical notes from patient-reported symptoms
- 💊 **Drug Interaction Checker** — OpenFDA API + LLM synthesis, severity-ranked warnings
- 📸 **Image Analysis** — Upload photos of rashes, wounds, or eyes for visual AI assessment
- 📧 **Patient Intake via Email** — Doctor sends a tokenised link; patient fills a form; AI runs automatically
- 🧠 **RAG-Augmented Diagnosis** — Clinical guidelines retrieved from a vector knowledge base
- 💬 **Medical Chatbot** — Conversational health assistant for general questions
- 👨‍⚕️ **Doctor Dashboard** — Patient management, assessment history, billing

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript)          [Vercel]         │
│  30+ pages · Doctor dashboard · Patient intake form      │
└────────────────────┬────────────────────────────────────┘
                     │ REST API
┌────────────────────▼────────────────────────────────────┐
│  Backend (Node.js + Express)            [Render]         │
│  Auth · Patients · Assessments · Intake · Billing        │
│  Email via SendGrid · MongoDB Atlas                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
┌────────────────────▼────────────────────────────────────┐
│  AI Layer (Python FastAPI)              [Render]         │
│                                                          │
│  [1] RAGAgent ────────── ChromaDB / FAISS                │
│  [2] TriageAgent ─────── Rule-based + LLM (Groq)         │
│  [3] VisionAgent ─────── Claude Vision                   │
│  [4] FollowUpAgent ───── OPQRST-guided Q&A               │
│  [5] AssessmentAgent ─── SOAP Note + Differential Dx     │
│  [6] DrugInteractionAgent ── OpenFDA API + LLM           │
└─────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
nirog-ai/
├── frontend/                  # React + TypeScript (Vite)
│   └── src/app/
│       ├── pages/             # 30+ pages (Dashboard, Intake, Billing…)
│       ├── components/        # Reusable UI components
│       └── services/api.ts    # Centralised API calls
│
├── backend/                   # Node.js + Express
│   ├── app.js                 # Entry point
│   ├── routes/
│   │   ├── auth.js            # Register / Login / JWT
│   │   ├── doctor.js          # Assessment endpoint
│   │   ├── patients.js        # Patient CRUD
│   │   ├── intake.js          # Patient intake form + email
│   │   ├── contact.js         # Contact form
│   │   └── billing.js         # Razorpay billing
│   ├── models/                # Mongoose schemas
│   └── middlewares/auth.js    # JWT verification
│
└── files/                     # Python FastAPI AI server
    ├── api_server.py           # FastAPI entry point
    ├── agents/
    │   ├── orchestrator.py
    │   ├── rag_agent.py
    │   ├── triage_agent.py
    │   ├── vision_agent.py
    │   ├── followup_agent.py
    │   ├── assessment_agent.py
    │   └── drug_agent.py
    └── utils/
        ├── session.py          # Shared state across agents
        └── llm_client.py       # LLM wrapper (Groq / Claude)
```

---

## 🚀 Local Development

### Prerequisites

- Node.js ≥ 18
- Python ≥ 3.10
- MongoDB Atlas account
- SendGrid account (free tier)
- Groq API key (free tier)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/nirog-ai.git
cd nirog-ai
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env.local   # fill in VITE_NODE_URL and VITE_PYTHON_URL
npm run dev                  # http://localhost:5173
```

### 3. Backend

```bash
cd backend
npm install
cp .env.example .env         # fill in all values
npm run dev                  # http://localhost:5000
```

### 4. Python AI Server

```bash
cd files
pip install -r requirements.txt
cp .env.example .env         # fill in GROQ_API_KEY etc.
uvicorn api_server:app --reload --port 8000
```

---

## 🔑 Environment Variables

### `backend/.env`

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random secret for JWT signing |
| `PYTHON_AI_URL` | URL of the deployed Python AI server |
| `APP_URL` | Frontend URL (used in intake email links) |
| `SENDGRID_API_KEY` | SendGrid API key (required for emails on Render) |
| `SENDGRID_VERIFIED_SENDER` | Verified sender email address in SendGrid |

### `files/.env`

| Variable | Description |
|----------|-------------|
| `GROQ_API_KEY` | Groq API key for LLM calls |

### `frontend/.env.local`

| Variable | Description |
|----------|-------------|
| `VITE_NODE_URL` | Backend URL (e.g. `https://your-backend.onrender.com`) |
| `VITE_PYTHON_URL` | Python AI URL (e.g. `https://your-ai.onrender.com`) |

---

## 🌐 Deployment

| Service | Platform | Notes |
|---------|----------|-------|
| Frontend | **Vercel** | Auto-deploy from `frontend/` |
| Backend | **Render** (free) | Set all env vars in Render dashboard |
| AI Server | **Render** (free) | Set `GROQ_API_KEY` in Render dashboard |
| Database | **MongoDB Atlas** | Free M0 cluster |
| Email | **SendGrid** | Free tier — verify sender in SendGrid dashboard |

> **Note**: Render's free tier blocks outbound SMTP, which is why SendGrid (HTTPS-based API) is used for all emails.

---

## 🤖 AI Pipeline

When a patient submits symptoms, the following pipeline runs:

1. **RAG Agent** — Retrieves relevant clinical guidelines from the vector knowledge base
2. **Triage Agent** — Assigns RED / YELLOW / GREEN urgency (rule-based first, then LLM)
3. **Vision Agent** *(if image uploaded)* — Analyses the image with Claude Vision
4. **Assessment Agent** — Generates a full SOAP note + differential diagnosis with ICD-10 codes
5. **Drug Interaction Agent** — Cross-checks medications against OpenFDA and flags interactions

---

## 📡 API Reference

### Python AI Server (`/files`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/assess` | Full AI assessment (text) |
| `POST` | `/assess/image` | Full AI assessment (text + image) |
| `POST` | `/followup` | Generate follow-up questions only |
| `POST` | `/chat` | Medical chatbot |
| `POST` | `/drug-check` | Standalone drug interaction check |
| `GET` | `/health` | Health check |

### Node.js Backend (`/backend`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | — | Doctor registration |
| `POST` | `/api/auth/login` | — | Login → JWT |
| `GET` | `/api/patients` | ✅ | List patients |
| `POST` | `/api/doctor/assess` | ✅ | Run assessment |
| `POST` | `/api/intake/send` | ✅ | Email intake form to patient |
| `GET` | `/api/intake/:token` | — | Patient fetches form info |
| `POST` | `/api/intake/:token/submit` | — | Patient submits form → AI runs |

---

## ⚠️ Disclaimer

Nirog AI is intended for **research, educational, and demonstration purposes only**. It does not constitute medical advice and must not replace professional clinical judgment. Always consult a qualified healthcare provider for diagnosis and treatment.

---

<p align="center">Built with ❤️ · Powered by <strong>Groq · Claude · OpenFDA · MongoDB</strong></p>
