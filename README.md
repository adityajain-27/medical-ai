# 🩺 Nirog AI — AI-Powered Clinical Triage Platform

A full-stack health assessment platform that enables doctors to run AI-powered triage, generate structured clinical notes, check drug interactions, and send patients smart intake forms — all from a single dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.10-blue.svg)
![React](https://img.shields.io/badge/react-19.x-61dafb.svg)

## 🌐 Live Demo

🚀 **[View Live Application](https://nirog-ai-iota.vercel.app/)**

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| 👨‍⚕️ Doctor | `demo@gmail.com` | `demo1234` |

> The demo account has pre-loaded patients and assessment history so you can explore the full dashboard without setting anything up.

---

## ✨ Features

### Doctor Dashboard
- **AI Assessment** — Enter symptoms, medications, and optionally upload an image; the AI returns a triage colour, SOAP note, differential diagnosis with ICD-10 codes, drug interaction warnings, and red flags
- **Patient Management** — Add and manage a patient list with demographics, medical history, and allergies
- **Assessment History** — Browse all past AI reports per patient with full output preserved
- **Patient Intake via Email** — Send a secure, tokenised link to the patient's email; once they fill it in, the AI runs automatically and the report lands in the doctor's dashboard
- **Medical Chatbot** — Conversational assistant for general clinical questions
- **Billing** — Subscription management via Razorpay

### Patient Experience
- **Smart Intake Form** — Mobile-friendly, branded form accessible via email link (no login required); expires after 7 days
- **Image Upload** — Attach a photo of a rash, wound, or eye for visual AI analysis

### AI Capabilities
- **Triage Classification** — RED (emergency) / YELLOW (urgent) / GREEN (self-care) with numeric urgency score and clinical reasoning
- **SOAP Notes** — Structured Subjective / Objective / Assessment / Plan output in clinical language
- **Differential Diagnosis** — Ranked conditions with ICD-10 codes and confidence levels
- **Follow-up Questions** — OPQRST-guided clarifying questions generated dynamically based on presenting symptoms
- **Drug Interaction Checking** — OpenFDA data cross-referenced with LLM synthesis; severity-ranked (Minor / Moderate / Major)
- **Vision Analysis** — Patient photos analysed by Claude Vision; findings injected into the full assessment

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript — UI library
- **Vite** — Build tool
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Animations
- **React Router** — Client-side routing
- **Sonner** — Toast notifications
- **Lucide React** — Icons

### Backend
- **Node.js + Express 5** — API server
- **MongoDB Atlas + Mongoose** — Database
- **JWT + bcrypt** — Auth & password hashing
- **SendGrid** — Transactional email (HTTPS-based, works on Render free tier)
- **Razorpay** — Payment processing

### AI Server
- **Python + FastAPI** — AI API server
- **Groq** (Llama 3.3 70B) — Primary LLM for triage, assessment, drug analysis
- **Anthropic Claude** — Vision analysis
- **ChromaDB / FAISS** — Vector database for RAG
- **OpenFDA API** — Drug interaction data

---

## 📦 Local Installation

### Prerequisites
- Node.js ≥ 18, Python ≥ 3.10, MongoDB Atlas account, Groq API key, SendGrid account

### 1. Clone the Repository
```bash
git clone https://github.com/adityajain-27/Nirog-AI.git
cd Nirog-AI
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # fill in your values
npm run dev             # http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# create .env.local with VITE_NODE_URL and VITE_PYTHON_URL
npm run dev             # http://localhost:5173
```

### 4. Python AI Server Setup
```bash
cd files
pip install -r requirements.txt
cp .env.example .env    # add GROQ_API_KEY
uvicorn api_server:app --reload --port 8000
```

---

## 🚀 Deployment Guide

Optimised for deployment on **MongoDB Atlas**, **Render** (backend + AI), and **Vercel** (frontend).

### 1. Database — MongoDB Atlas
1. Create a free M0 cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a database user and whitelist all IPs (`0.0.0.0/0`) or Render IPs
3. Copy the connection string into `MONGODB_URI`

### 2. AI Server — Render
1. Create a new **Web Service** on [render.com](https://render.com)
2. Set root directory to `files/`
3. Start command: `uvicorn api_server:app --host 0.0.0.0 --port 8000`
4. Add environment variable: `GROQ_API_KEY`
5. Copy the service URL → you'll need it for `PYTHON_AI_URL`

### 3. Backend — Render
1. Create a second **Web Service** on Render
2. Set root directory to `backend/`
3. Start command: `node app.js`
4. Add all environment variables from `backend/.env.example`

### 4. Frontend — Vercel
1. Import the repo into [vercel.com](https://vercel.com)
2. Set root directory to `frontend/`
3. Add environment variables:
   - `VITE_NODE_URL` — your Render backend URL
   - `VITE_PYTHON_URL` — your Render AI server URL

---

## 🔐 Environment Variables

### `backend/.env`

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | MongoDB Atlas connection string | `mongodb+srv://...` |
| `JWT_SECRET` | Long random string for JWT signing | `openssl rand -hex 32` |
| `PYTHON_AI_URL` | Deployed AI server URL | `https://your-ai.onrender.com` |
| `APP_URL` | Frontend URL (for intake email links) | `https://your-app.vercel.app` |
| `SENDGRID_API_KEY` | SendGrid API key | `SG.xxxxxxxx` |
| `SENDGRID_VERIFIED_SENDER` | Verified sender email in SendGrid | `you@example.com` |

### `files/.env`

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | API key from [console.groq.com](https://console.groq.com) |

### `frontend/.env.local`

| Variable | Description |
|---|---|
| `VITE_NODE_URL` | Backend base URL |
| `VITE_PYTHON_URL` | AI server base URL |

---

## 🤖 AI Pipeline

```
Symptoms + Image + Medications
        │
        ├── [1] RAG Agent           Retrieve clinical guidelines from vector DB
        ├── [2] Triage Agent        Assign RED / YELLOW / GREEN urgency
        ├── [3] Vision Agent        Analyse uploaded image (Claude Vision)
        ├── [4] Follow-up Agent     Generate OPQRST-guided clinical questions
        ├── [5] Assessment Agent    Generate SOAP note + differential diagnosis
        └── [6] Drug Agent          Flag interactions via OpenFDA + LLM
```

---

## 🚀 Usage

### For Doctors
1. **Register / Login** — Create a doctor account
2. **Add Patients** — Build your patient list with medical history and allergies
3. **Run Assessment** — Enter symptoms and medications; let the AI generate a full report
4. **Send Intake** — Click "Send Intake Form" on any patient to email them a link
5. **View Reports** — Open any assessment in history for the full AI output including SOAP notes and drug warnings
6. **Chat** — Use the medical chatbot for quick clinical references

### For Patients
1. **Open Email Link** — Tap the link sent by your doctor (no account needed)
2. **Fill In Symptoms** — Describe your current symptoms in detail; optionally add medications and a photo
3. **Submit** — Your doctor's dashboard is updated automatically with the AI report

---

## 📡 API Reference

### Python AI Server (port 8000)

```
POST  /assess              Full pipeline assessment (text)
POST  /assess/image        Full pipeline assessment (text + image)
POST  /followup            Generate follow-up questions only
POST  /chat                Medical chatbot
POST  /drug-check          Standalone drug interaction check
GET   /health              Health check
```

**Example:**
```bash
curl -X POST http://localhost:8000/assess \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "chest pain radiating to left arm, sweating for 30 minutes",
    "medications": ["warfarin 5mg", "metoprolol 50mg"]
  }'
```

### Node.js Backend (port 5000)

```
POST  /api/auth/register
POST  /api/auth/login

GET   /api/patients                      [auth]
POST  /api/patients                      [auth]
PUT   /api/patients/:id                  [auth]
DELETE /api/patients/:id                 [auth]

POST  /api/doctor/assess                 [auth]
GET   /api/doctor/assessments            [auth]

POST  /api/intake/send                   [auth]
GET   /api/intake/:token                 [public]
POST  /api/intake/:token/submit          [public]

POST  /api/contact
```

---

## 📁 Project Structure

```
Nirog-AI/
├── frontend/
│   └── src/app/
│       ├── pages/              # 30+ route-level pages
│       ├── components/         # Reusable UI components
│       ├── services/api.ts     # API client
│       └── routes.tsx          # React Router config
│
├── backend/
│   ├── app.js
│   ├── routes/                 # auth, doctor, patients, intake, contact, billing
│   ├── models/                 # Mongoose schemas
│   └── middlewares/auth.js     # JWT guard
│
└── files/
    ├── api_server.py
    ├── agents/                 # 6 specialised AI agents
    └── utils/                  # session.py · llm_client.py
```

---

## 🔒 Security

- JWT-based authentication for all doctor routes
- Password hashing with bcrypt
- Tokenised, time-limited intake links (expire after 7 days)
- Protected API routes via middleware
- CORS configuration
- SendGrid HTTPS API used for email (avoids SMTP exposure)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add YourFeature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## � Team

Built at **[Hackathon Name]** — 🥈 2nd Place

| Name | Role | GitHub |
|---|---|---|
| **Aditya Jain** (Lead) | Project architecture · Full-stack backend · Deployment | [@adityajain-27](https://github.com/adityajain-27) |
| **Samay Parashar** | AI agent pipeline · AI integration | [@samay-username](https://github.com/samay722) |
| **Sweety** | Frontend development · UI design · Testing & QA | [@Sweety3106](https://github.com/Sweety3106) |
| **Hardik Agrawal** | Frontend development · UI design · Testing & QA | [@hardik-username](https://github.com/hardik-agrawal10) |


---

## 📞 Support

For support, email adityaalba27@gmail.com or open an issue in the repository.

---

⭐ Star this repository if you find it helpful!

---

## ⚠️ Disclaimer

Nirog AI is for research and educational purposes only. It does not constitute medical advice and must not replace the judgment of a qualified healthcare professional.
