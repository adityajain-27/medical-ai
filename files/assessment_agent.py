"""
AssessmentAgent
================
Generates the final clinical assessment after all context is collected:
  - Full SOAP note (Subjective / Objective / Assessment / Plan)
  - Differential diagnosis with ICD-10 codes
  - Final triage color (overrides preliminary)
  - Red flags to monitor
  - Disclaimer

This is the "brain" of the system — it synthesizes:
  1. Patient symptoms (subjective)
  2. Image analysis findings (objective)
  3. RAG-retrieved medical guidelines
  4. Follow-up Q&A answers
  5. Preliminary triage
"""

from agents.triage_agent import TriageAgent
from utils.llm_client import LLMClient

ASSESSMENT_PROMPT = """
You are a senior attending physician writing a formal clinical assessment.

=== PATIENT CONTEXT ===
{context}

=== RETRIEVED MEDICAL GUIDELINES (RAG) ===
{rag_context}

=== PRELIMINARY TRIAGE ===
{preliminary_triage}

Based on ALL the above information, generate a complete clinical assessment.

IMPORTANT RULES:
1. The SOAP note must be in formal clinical language
2. The differential diagnosis must include ICD-10 codes
3. The Plan must be actionable and specific
4. Triage must reflect ALL information including follow-up answers
5. Flag any medication interactions in the plan if medications were mentioned

Respond ONLY in this JSON format:
{{
  "triage": {{
    "color": "RED|YELLOW|GREEN",
    "urgency_score": <1-10>,
    "label": "Go to ER NOW | See doctor within 24 hours | Self-care at home",
    "reason": "Clinical reasoning for this triage level"
  }},
  "soap_note": {{
    "subjective": "Patient-reported symptoms in clinical language, including HPI (history of present illness), medications, and relevant history from follow-up answers",
    "objective": "Observed/objective findings including any image analysis results, vital sign estimates, and physical examination findings described by patient",
    "assessment": "Clinical assessment: most likely diagnosis, differential diagnoses, clinical reasoning integrating all data sources including RAG guidelines",
    "plan": "Specific clinical plan: immediate actions, tests to order (labs/imaging), medications/treatments, follow-up, return precautions, patient education"
  }},
  "conditions": [
    {{"name": "Most likely condition", "probability": "High", "icd_code": "ICD-10"}},
    {{"name": "Second condition", "probability": "Medium", "icd_code": "ICD-10"}},
    {{"name": "Third condition", "probability": "Low", "icd_code": "ICD-10"}}
  ],
  "red_flags": [
    "Symptom/sign that should prompt immediate ER visit",
    "Another red flag to watch for"
  ],
  "disclaimer": "This AI-generated assessment is for informational purposes only and does not constitute medical advice. Always consult a qualified healthcare provider for diagnosis and treatment."
}}
"""


class AssessmentAgent:

    def __init__(self):
        self.llm = LLMClient()
        self.triage_agent = TriageAgent()

    async def run(self, session) -> dict:
        """Generate final SOAP note + full assessment."""
        prompt = ASSESSMENT_PROMPT.format(
            context=session.to_context_string(),
            rag_context=session.rag_context[:3000],
            preliminary_triage=session.preliminary_triage or "UNKNOWN"
        )

        result = await self.llm.json_call(prompt, max_tokens=2000)

        # Ensure all expected keys exist with fallbacks
        result.setdefault("triage", {
            "color": session.preliminary_triage or "YELLOW",
            "urgency_score": 5,
            "label": "See a doctor",
            "reason": "Unable to determine — please consult a healthcare provider"
        })
        result.setdefault("soap_note", {
            "subjective": session.symptoms,
            "objective": "Assessment based on patient-reported symptoms only.",
            "assessment": "Insufficient data for complete assessment.",
            "plan": "Please consult a healthcare provider."
        })
        result.setdefault("conditions", [])
        result.setdefault("red_flags", [])
        result.setdefault("disclaimer",
            "This AI assessment is for informational purposes only. "
            "Consult a qualified healthcare provider.")

        print(f"           [ASSESSMENT] Final triage: {result['triage']['color']} "
              f"(score: {result['triage']['urgency_score']}/10)")

        return result
