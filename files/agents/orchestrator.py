"""
MedicalOrchestrator
====================
Controls the full agentic pipeline:

  [1] RAGAgent         → retrieve relevant medical literature
  [2] TriageAgent      → preliminary urgency score
  [3] VisionAgent      → analyze uploaded image (if any)
  [4] FollowUpAgent    → generate + collect follow-up Q&A
  [5] AssessmentAgent  → final SOAP note + differential diagnosis
  [6] DrugAgent        → OpenFDA drug interaction check

Each agent reads from and writes back to the shared PatientSession.
"""

import asyncio
from agents.rag_agent import RAGAgent
from agents.triage_agent import TriageAgent
from agents.vision_agent import VisionAgent
from agents.followup_agent import FollowUpAgent
from agents.assessment_agent import AssessmentAgent
from agents.drug_agent import DrugInteractionAgent


class MedicalOrchestrator:

    def __init__(self):
        self.rag_agent = RAGAgent()
        self.triage_agent = TriageAgent()
        self.vision_agent = VisionAgent()
        self.followup_agent = FollowUpAgent()
        self.assessment_agent = AssessmentAgent()
        self.drug_agent = DrugInteractionAgent()

    async def run(self, session) -> dict:
        print("\n[ORCHESTRATOR] Starting agentic pipeline...\n")

        # ── Step 1: RAG — retrieve relevant medical context ──────────────────
        print("[AGENT 1/6] RAGAgent: Retrieving medical context...")
        await self.rag_agent.run(session)

        # ── Step 2: Preliminary triage ────────────────────────────────────────
        print("[AGENT 2/6] TriageAgent: Computing preliminary triage...")
        await self.triage_agent.run_preliminary(session)
        print(f"           Preliminary triage: {session.preliminary_triage}")

        # ── Step 3: Vision (parallel with triage if image present) ───────────
        if session.has_image():
            print("[AGENT 3/6] VisionAgent: Analyzing uploaded image...")
            await self.vision_agent.run(session)
        else:
            print("[AGENT 3/6] VisionAgent: No image provided, skipping.")

        # ── Step 4: Follow-up Q&A engine ──────────────────────────────────────
        print("[AGENT 4/6] FollowUpAgent: Generating clinical follow-up questions...")
        await self.followup_agent.run(session)

        # ── Step 5: Final assessment + SOAP note ──────────────────────────────
        print("[AGENT 5/6] AssessmentAgent: Generating SOAP note + differential...")
        result = await self.assessment_agent.run(session)

        # ── Step 6: Drug interaction check ────────────────────────────────────
        if session.medications:
            print("[AGENT 6/6] DrugAgent: Checking OpenFDA drug interactions...")
            drug_data = await self.drug_agent.run(session, result.get("conditions", []))
            result["drug_interactions"] = drug_data
        else:
            result["drug_interactions"] = []
            print("[AGENT 6/6] DrugAgent: No medications listed, skipping.")

        session.final_result = result
        print("\n[ORCHESTRATOR] Pipeline complete.\n")
        return result
