"""
TriageAgent
============
Assigns urgency triage color using a two-stage approach:

  Stage A — Rule-based fast triage (instant, no LLM call)
             Catches obvious emergencies: "chest pain + sweating", "not breathing", etc.
             This mirrors the START triage algorithm used in mass casualty events.

  Stage B — LLM triage (nuanced, uses RAG context + symptoms)
             For non-obvious cases, uses the LLM to score urgency 1-10 and
             assign RED/YELLOW/GREEN with clinical reasoning.

The preliminary result is stored in session.preliminary_triage.
The final triage (in assessment_agent) overrides this after follow-up answers.
"""

import re
from utils.llm_client import LLMClient

# ── Hard-coded RED flag triggers (rule-based, instant) ──────────────────────
RED_FLAG_PATTERNS = [
    r"\bnot breathing\b",
    r"\bno pulse\b",
    r"\bunconsciou\b",
    r"\bseizure\b",
    r"\bstroke\b",
    r"\bsuicid\b",
    r"\bsevere chest pain\b",
    r"\bchest pain.{0,30}(arm|jaw|sweat|dizz)",
    r"\b(can't|cannot|can not) breathe\b",
    r"\bsevere bleed\b",
    r"\bblood.{0,20}vomit\b",
    r"\bsuddenly (blind|deaf|paralyz)\b",
    r"\bthunderclap headache\b",
    r"\brash.{0,30}(fever|neck stiff)\b",  # meningitis
    r"\bswollen throat\b",
    r"\banaphyla\b",
    r"\bpetechial\b",
    r"\bpurpuric rash\b",
]

YELLOW_FLAG_PATTERNS = [
    r"\bfever.{0,30}(child|infant|baby|toddler)\b",
    r"\bhigh fever\b",
    r"\bpersistent\b",
    r"\bworsening\b",
    r"\bchest.{0,20}(tight|pressure|heavy)\b",
    r"\bshortness of breath\b",
    r"\bdifficult.{0,10}breath\b",
    r"\babdominal pain\b",
    r"\bblood in (urine|stool|pee)\b",
    r"\bjaundic\b",
]

TRIAGE_PROMPT = """
You are an emergency medicine physician performing rapid triage.

Patient Symptoms: {symptoms}
RAG Medical Context: {rag_context}

Assign a triage level based on clinical urgency:
- RED: Life-threatening, needs immediate emergency care (call 911 / go to ER NOW)
- YELLOW: Urgent, should see a doctor within 24 hours
- GREEN: Non-urgent, can be managed with self-care or scheduled appointment

Respond ONLY in this JSON format:
{{
  "triage": "RED|YELLOW|GREEN",
  "urgency_score": <1-10>,
  "label": "<short label>",
  "reason": "<one sentence clinical reasoning>"
}}
"""


class TriageAgent:

    def __init__(self):
        self.llm = LLMClient()

    async def run_preliminary(self, session):
        """Fast preliminary triage — stored in session.preliminary_triage."""
        rule_triage = self._rule_based_triage(session.symptoms)
        if rule_triage == "RED":
            session.preliminary_triage = "RED"
            print("           [TRIAGE] Rule-based RED flag triggered!")
            return

        prompt = TRIAGE_PROMPT.format(
            symptoms=session.symptoms,
            rag_context=session.rag_context[:1500]  # truncate for speed
        )
        result = await self.llm.json_call(prompt)
        session.preliminary_triage = result.get("triage", rule_triage)

    def _rule_based_triage(self, symptoms: str) -> str:
        text = symptoms.lower()
        for pattern in RED_FLAG_PATTERNS:
            if re.search(pattern, text):
                return "RED"
        for pattern in YELLOW_FLAG_PATTERNS:
            if re.search(pattern, text):
                return "YELLOW"
        return "GREEN"

    async def run_final(self, session) -> dict:
        """
        Final triage after follow-up answers are collected.
        Called by AssessmentAgent to include in the full result.
        """
        prompt = TRIAGE_PROMPT.format(
            symptoms=session.to_context_string(),
            rag_context=session.rag_context[:1500]
        )
        result = await self.llm.json_call(prompt)
        return {
            "color": result.get("triage", session.preliminary_triage),
            "urgency_score": result.get("urgency_score", 5),
            "label": result.get("label", ""),
            "reason": result.get("reason", ""),
        }
