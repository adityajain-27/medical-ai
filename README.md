<div align="center">

# 🩺 Nirog AI

### *AI-Powered Clinical Triage & Health Assessment Platform*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Site-0ea5e9?style=for-the-badge)](https://nirog-ai.vercel.app)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge)](LICENSE)

<br/>

> **Nirog AI** is a full-stack clinical intelligence platform that lets doctors run AI-powered symptom triage, generate SOAP notes, check drug interactions, and send patients smart intake forms — all in one beautifully designed dashboard.

<br/>

---

</div>

## 📸 Screenshots

| Doctor Dashboard | Patient Intake | AI Assessment |
|:---:|:---:|:---:|
| ![Dashboard](https://placehold.co/340x200/0ea5e9/white?text=Doctor+Dashboard) | ![Intake](https://placehold.co/340x200/14b8a6/white?text=Patient+Intake) | ![Assessment](https://placehold.co/340x200/8b5cf6/white?text=AI+Assessment) |

---

## ✨ What It Does

<table>
<tr>
<td width="50%">

**🔴🟡🟢 AI Triage**
Classifies symptoms as RED (ER), YELLOW (urgent), or GREEN (self-care) using a rule-based + LLM pipeline grounded in clinical guidelines.

**📋 SOAP Notes**
Generates structured Subjective / Objective / Assessment / Plan notes from patient-reported symptoms — ready to paste into an EMR.

**💊 Drug Interaction Checker**
Cross-references current medications with OpenFDA label data, then uses an LLM to synthesise clinically significant warnings with severity levels.

</td>
<td width="50%">

**📧 Smart Patient Intake**
Doctor clicks "Send Intake" → patient receives a branded, tokenised email link → fills a form → AI runs automatically and pushes the report to the doctor's dashboard.

**📸 Image Analysis**
Patients can upload a photo of a rash, wound, or eye. Claude Vision analyses the image and integrates findings with the text assessment.

**💬 Medical Chatbot**
Conversational health assistant for general questions, powered by Llama 3.3 70B via Groq.

</td>
</tr>
</table>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│             Frontend  ·  React + TypeScript + Vite           │
│                    Deployed on  Vercel                        │
│   30+ pages · Doctor Dashboard · Patient Intake · Chatbot    │
└─────────────────────────┬────────────────────────────────────┘
                          │  HTTPS REST
┌─────────────────────────▼────────────────────────────────────┐
│            Backend  ·  Node.js + Express                     │
│                    Deployed on  Render                        │
│   Auth (JWT) · Patients · Assessments · Intake · Billing     │
│   MongoDB Atlas  ·  SendGrid Email  ·  Razorpay Payments      │
└─────────────────────────┬────────────────────────────────────┘
                          │  HTTPS REST
┌─────────────────────────▼────────────────────────────────────┐
│             AI Layer  ·  Python + FastAPI                    │
│                    Deployed on  Render                        │
│                                                              │
│   ① RAG Agent ──────── ChromaDB · Clinical Guidelines        │
│   ② Triage Agent ────── Rule-based + LLM (Groq)             │
│   ③ Vision Agent ────── Claude Vision · Image Analysis       │
│   ④ Follow-up Agent ─── OPQRST Clinical Q&A Engine          │
│   ⑤ Assessment Agent ── SOAP Notes · Differential Dx        │
│   ⑥ Drug Agent ──────── OpenFDA API + LLM Synthesis         │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide |
| **Backend** | Node.js, Express 5, MongoDB Atlas, Mongoose, JWT, SendGrid |
| **AI Server** | Python, FastAPI, Groq (Llama 3.3 70B), Claude (Vision), OpenFDA |
| **Vector DB** | ChromaDB / FAISS with sentence-transformers embeddings |
| **Payments** | Razorpay |
| **Deployment** | Vercel (frontend) · Render (backend + AI) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18 · Python ≥ 3.10 · MongoDB Atlas account · Groq API key · SendGrid account

### 1 · Clone

```bash
git clone https://github.com/adityajain-27/Nirog-AI.git
cd Nirog-AI
```

### 2 · Frontend

```bash
cd frontend
npm install
# Create .env.local:
# VITE_NODE_URL=http://localhost:5000
# VITE_PYTHON_URL=http://localhost:8000
npm run dev          # → http://localhost:5173
```

### 3 · Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev            # → http://localhost:5000
```

### 4 · Python AI Server

```bash
cd files
pip install -r requirements.txt
cp .env.example .env   # add GROQ_API_KEY
uvicorn api_server:app --reload --port 8000
```

---

## 🔑 Environment Variables

<details>
<summary><b>backend/.env</b></summary>

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/meditriage
JWT_SECRET=your-long-random-secret
PYTHON_AI_URL=https://your-ai-server.onrender.com
APP_URL=https://your-frontend.vercel.app
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
SENDGRID_VERIFIED_SENDER=your-verified@email.com
```

</details>

<details>
<summary><b>files/.env</b></summary>

```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxx
```

</details>

<details>
<summary><b>frontend/.env.local</b></summary>

```env
VITE_NODE_URL=https://your-backend.onrender.com
VITE_PYTHON_URL=https://your-ai-server.onrender.com
```

</details>

---

## 📡 API Reference

<details>
<summary><b>Python AI Server  (port 8000)</b></summary>

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/assess` | Full AI assessment from text symptoms |
| `POST` | `/assess/image` | Full assessment with image upload |
| `POST` | `/followup` | Generate follow-up questions only |
| `POST` | `/chat` | Medical chatbot |
| `POST` | `/drug-check` | Standalone drug interaction check |
| `GET` | `/health` | Health check |

```bash
curl -X POST http://localhost:8000/assess \
  -H "Content-Type: application/json" \
  -d '{"symptoms": "chest pain radiating to left arm", "medications": ["warfarin"]}'
```

</details>

<details>
<summary><b>Node.js Backend  (port 5000)</b></summary>

| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| `POST` | `/api/auth/register` | — | Doctor registration |
| `POST` | `/api/auth/login` | — | Login → JWT |
| `GET` | `/api/patients` | ✅ | List all patients |
| `POST` | `/api/doctor/assess` | ✅ | Run AI assessment |
| `POST` | `/api/intake/send` | ✅ | Email intake form to patient |
| `GET` | `/api/intake/:token` | — | Fetch intake form info |
| `POST` | `/api/intake/:token/submit` | — | Patient submits → AI runs |

</details>

---

## 📁 Project Structure

```
Nirog-AI/
├── frontend/                  # React + TypeScript (Vite)
│   └── src/app/
│       ├── pages/             # 30+ pages
│       ├── components/        # Reusable UI components
│       └── services/api.ts    # API client
│
├── backend/                   # Node.js + Express
│   ├── routes/                # auth, doctor, patients, intake, billing
│   ├── models/                # Mongoose schemas
│   └── middlewares/           # JWT auth guard
│
└── files/                     # Python FastAPI AI server
    ├── api_server.py
    ├── agents/                # 6 specialised AI agents
    └── utils/                 # Session & LLM client
```

---

## ⚠️ Disclaimer

Nirog AI is intended for **research, educational, and demonstration purposes only**. It does not constitute medical advice and must not replace professional clinical judgment. Always consult a qualified healthcare provider for diagnosis and treatment decisions.

---

<div align="center">

Made with ❤️ by [Aditya Jain](https://github.com/adityajain-27)

**[⭐ Star this repo](https://github.com/adityajain-27/Nirog-AI)** if you found it useful!

</div>
