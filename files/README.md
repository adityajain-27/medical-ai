# MedAI — Agentic Clinical Assistant
> RAG + Multi-Agent Pipeline for Medical Triage, SOAP Notes & Drug Interaction Checking

---

## Architecture

```
Patient Input (symptoms + image + medications)
            │
            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                              │
│                                                             │
│  [1] RAGAgent ──────────── ChromaDB / FAISS                │
│        │  Retrieve clinical guidelines, ICD descriptions    │
│        ▼                                                    │
│  [2] TriageAgent ─────────── Rule-based + LLM              │
│        │  Preliminary RED/YELLOW/GREEN                      │
│        ▼                                                    │
│  [3] VisionAgent ─────────── Claude Vision / MedViT        │
│        │  Image analysis: rash, wound, eye                  │
│        ▼                                                    │
│  [4] FollowUpAgent ────────── LLM (OPQRST-guided)          │
│        │  3-5 context-aware clinical questions              │
│        ▼                                                    │
│  [5] AssessmentAgent ──────── LLM + RAG synthesis          │
│        │  SOAP Note + Differential Dx + Final Triage        │
│        ▼                                                    │
│  [6] DrugInteractionAgent ─── OpenFDA API + LLM            │
│           Flag interactions with proposed treatments         │
└─────────────────────────────────────────────────────────────┘
            │
            ▼
    Clinical Output
    ├── Triage Color: RED / YELLOW / GREEN
    ├── SOAP Note (S/O/A/P)
    ├── Differential Diagnosis + ICD-10 codes
    ├── Drug Interaction Warnings (OpenFDA)
    └── Red Flags to monitor
```

---

## Setup

```bash
# 1. Clone and install
git clone <repo>
cd medai
pip install -r requirements.txt

# 2. Set API key
export ANTHROPIC_API_KEY="your-key-here"

# 3. Run CLI
python main.py

# 4. Or run as API server
pip install fastapi uvicorn
uvicorn api_server:app --reload --port 8000
```

---

## Features

### 1. Multimodal Input
- Accepts JPEG/PNG images alongside text symptoms
- Analyzed by Claude Vision (or swap for MedViT/SkinGPT-4)
- Image findings injected into RAG context for downstream agents
- Supports: skin rash, wound, eye redness, oral lesions

### 2. Dynamic Triage System
```
RED    → Life-threatening → Go to ER NOW
YELLOW → Urgent           → See doctor within 24 hours  
GREEN  → Non-urgent       → Self-care at home
```
- Stage A: Rule-based regex (catches obvious emergencies instantly)
- Stage B: LLM triage with RAG context for nuanced cases
- Final triage re-evaluated after follow-up answers

### 3. SOAP Note Generation
```
Subjective:  Patient-reported symptoms in clinical language
Objective:   Exam findings + image analysis + reported observations
Assessment:  Differential diagnosis with clinical reasoning
Plan:        Tests, treatments, referrals, return precautions
```

### 4. Follow-up Question Engine
- OPQRST-guided (Onset, Provocation, Quality, Radiation, Severity, Timing)
- Questions are context-aware — not generic
- Prioritizes questions that change triage level or diagnosis
- Example for "chest pain":
  - "Does the pain radiate to your left arm or jaw?"
  - "Are you sweating or feeling nauseous?"
  - "Did it start suddenly or build up over hours?"

### 5. Drug Interaction Checker
- Layer 1: OpenFDA API — real FDA drug label data (no API key needed)
- Layer 2: LLM synthesis — identifies clinically significant interactions
- Severity levels: Minor / Moderate / Major
- Flags interactions between current medications AND proposed treatments

---

## RAG Setup (Production)

```python
# Install
pip install chromadb sentence-transformers

# Index your medical corpus (PubMed, ICD-10, guidelines)
from agents.rag_agent import RAGAgent
rag = RAGAgent()
# ChromaDB auto-initializes from MEDICAL_KB
# Replace MEDICAL_KB with your full corpus for production
```

For production scale:
- Use **Pinecone** or **Weaviate** for hosted vector DB
- Embed **PubMed abstracts** (~35M papers via S3 snapshot)
- Add **UpToDate** or **ClinicalKey** guideline embeddings
- Use **text-embedding-3-large** or **BGE-M3** for medical embeddings

---

## Swapping Vision Model

```python
# In agents/vision_agent.py, replace VisionAgent with:

# Option A: MedViT (skin lesion classification)
# https://github.com/Omid-Nejati/MedViT
import torch
from medvit import MedViT_small
model = MedViT_small(num_classes=7)  # ISIC 7 classes
model.load_state_dict(torch.load("medvit_isic.pth"))

# Option B: SkinGPT-4 (dermatology multimodal)
# Option C: BioViL-T (radiology)
# Option D: Custom YOLO for wound detection
```

---

## API Endpoints

```
POST /assess         → Text-only assessment
POST /assess/image   → Assessment with image upload
GET  /health         → Service health check
```

Example:
```bash
curl -X POST http://localhost:8000/assess \
  -H "Content-Type: application/json" \
  -d '{
    "symptoms": "chest pain radiating to left arm, sweating",
    "medications": ["warfarin", "metoprolol"],
    "followup_answers": {
      "Is pain worse on breathing?": "No",
      "Rate pain 1-10": "8"
    }
  }'
```

---

## Project Structure

```
medai/
├── main.py                    # CLI entry point
├── api_server.py              # FastAPI REST server
├── requirements.txt
├── agents/
│   ├── orchestrator.py        # Master pipeline controller
│   ├── rag_agent.py           # Vector DB retrieval
│   ├── triage_agent.py        # RED/YELLOW/GREEN classification
│   ├── vision_agent.py        # Image analysis (Claude / MedViT)
│   ├── followup_agent.py      # Dynamic Q&A engine
│   ├── assessment_agent.py    # SOAP note generation
│   └── drug_agent.py          # OpenFDA interaction checker
└── utils/
    ├── session.py             # Shared state across agents
    └── llm_client.py          # Claude API wrapper
```

---

## Disclaimer

This system is for research and educational purposes only. It does not constitute medical advice and should not replace professional clinical judgment. Always consult a qualified healthcare provider.
