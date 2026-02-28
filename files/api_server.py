from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import base64

from agents.orchestrator import MedicalOrchestrator
from utils.session import PatientSession
from utils.llm_client import LLMClient

app = FastAPI(title="MedAI Clinical Assistant", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = MedicalOrchestrator()
llm = LLMClient()


class AssessRequest(BaseModel):
    symptoms: str
    medications: List[str] = []
    followup_answers: dict = {}


class FollowupRequest(BaseModel):
    symptoms: str
    medications: List[str] = []


class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []


class DrugCheckRequest(BaseModel):
    medications: List[str]
    conditions: List[str] = []


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "MedAI Clinical Assistant",
        "agents": ["rag", "triage", "assessment", "drug", "vision", "followup", "chat"]
    }


@app.post("/assess")
async def assess_text(request: AssessRequest):
    session = PatientSession()
    session.set_intake(symptoms=request.symptoms, medications=request.medications, image_path=None)
    if request.followup_answers:
        session.followup_answers = request.followup_answers
    result = await run_pipeline(session)
    return result


@app.post("/followup")
async def get_followup_questions(request: FollowupRequest):
    """Generate context-aware follow-up questions WITHOUT running the full pipeline."""
    from agents.rag_agent import RAGAgent
    from agents.triage_agent import TriageAgent
    from agents.followup_agent import FollowUpAgent

    session = PatientSession()
    session.set_intake(symptoms=request.symptoms, medications=request.medications, image_path=None)

    await RAGAgent().run(session)
    await TriageAgent().run_preliminary(session)

    agent = FollowUpAgent()
    questions = await agent.generate_questions(session)
    return {"questions": questions}


@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """Medical assistant chatbot — answers health questions in plain language."""
    history_text = ""
    for msg in request.history[-6:]:  # last 6 turns for context
        role = "Patient" if msg.get("role") == "user" else "Assistant"
        history_text += f"{role}: {msg.get('content', '')}\n"

    prompt = f"""You are MediTriage AI — a friendly, knowledgeable medical assistant.
Answer health questions clearly in plain English. Always recommend consulting a doctor for diagnosis.
Keep answers concise (2-4 sentences unless detail is needed). Never diagnose directly.

Conversation so far:
{history_text}
Patient: {request.message}

Respond in plain text (NOT JSON). Be empathetic, clear, and helpful."""

    try:
        # Use raw text call, not JSON
        from groq import Groq
        import os
        client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=300,
            temperature=0.7,
        )
        answer = resp.choices[0].message.content.strip()
    except Exception as e:
        answer = "I'm having trouble connecting right now. For urgent concerns, please call your doctor or emergency services."

    return {"reply": answer}


@app.post("/drug-check")
async def standalone_drug_check(request: DrugCheckRequest):
    """Standalone drug interaction check — no full pipeline, just meds."""
    from agents.drug_agent import DrugInteractionAgent

    class MockSession:
        def __init__(self, meds):
            self.medications = meds

    session = MockSession(request.medications)
    conditions = [{"name": c} for c in request.conditions] if request.conditions else [{"name": "General health check"}]

    agent = DrugInteractionAgent()
    interactions = await agent.run(session, conditions)
    return {"interactions": interactions, "medications": request.medications}


@app.post("/assess/image")
async def assess_with_image(
    symptoms: str = Form(...),
    medications: str = Form(""),
    image: UploadFile = File(...)
):
    session = PatientSession()
    image_bytes = await image.read()
    session.image_b64 = base64.b64encode(image_bytes).decode("utf-8")
    meds = [m.strip() for m in medications.split(",") if m.strip()]
    session.set_intake(symptoms=symptoms, medications=meds, image_path=None)
    result = await run_pipeline(session)
    return result


async def run_pipeline(session):
    from agents.rag_agent import RAGAgent
    from agents.triage_agent import TriageAgent
    from agents.vision_agent import VisionAgent
    from agents.assessment_agent import AssessmentAgent
    from agents.drug_agent import DrugInteractionAgent

    await RAGAgent().run(session)
    await TriageAgent().run_preliminary(session)

    if session.has_image():
        await VisionAgent().run(session)

    result = await AssessmentAgent().run(session)

    if session.medications:
        result["drug_interactions"] = await DrugInteractionAgent().run(session, result.get("conditions", []))
    else:
        result["drug_interactions"] = []

    return result
