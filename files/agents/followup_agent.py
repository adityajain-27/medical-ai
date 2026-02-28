"""
FollowUpAgent
==============
Generates and collects 3-5 context-aware clinical follow-up questions,
exactly as a doctor would ask during a consultation.

Question generation strategy:
  - Uses OPQRST framework (Onset, Provocation, Quality, Radiation, Severity, Timing)
  - Incorporates RAG context to ask condition-specific questions
  - Avoids generic questions — targets the most diagnostically useful info
  - Prioritizes questions that would change triage level or differential

Example output for "chest pain":
  1. Is the pain worse when you breathe in deeply or lie flat?
  2. Does the pain radiate to your left arm, jaw, or back?
  3. Are you sweating, nauseous, or feel like something is "wrong"?
  4. Did it start suddenly or gradually over hours/days?
  5. Do you have a history of heart disease, clots, or high blood pressure?
"""

from utils.llm_client import LLMClient

FOLLOWUP_PROMPT = """
You are an experienced emergency medicine physician conducting an initial patient assessment.

Patient Information:
{context}

RAG Medical Context (use to ask targeted questions):
{rag_context}

Generate exactly 3-5 smart, clinically relevant follow-up questions to narrow the diagnosis.
Rules:
- Questions must be specific to the symptoms described — NOT generic
- Prioritize questions that would change the urgency/triage level
- Use plain language (no medical jargon for patients)
- Apply OPQRST + RED FLAG screening
- Each question should target a different diagnostic dimension

Respond ONLY in this JSON format:
{{
  "questions": [
    "Question 1?",
    "Question 2?",
    "Question 3?",
    "Question 4?",
    "Question 5?"
  ],
  "reasoning": "Why these questions were chosen (for clinician transparency)"
}}
"""


class FollowUpAgent:

    def __init__(self):
        self.llm = LLMClient()

    async def generate_questions(self, session) -> list:
        """Generate questions only — no CLI input. For API use."""
        prompt = FOLLOWUP_PROMPT.format(
            context=session.to_context_string(),
            rag_context=session.rag_context[:1500]
        )
        result = await self.llm.json_call(prompt)
        questions = result.get("questions", [])
        session.followup_questions = questions
        return questions

    async def run(self, session):
        """
        1. Generate context-aware questions
        2. Present to user (CLI or can be wrapped in API/UI)
        3. Collect answers back into session
        """
        questions = await self.generate_questions(session)

        if not questions:
            print("           [FOLLOWUP] No follow-up questions generated.")
            return

        print(f"           [FOLLOWUP] Generated {len(questions)} follow-up questions.\n")

        # Collect answers interactively
        answers = {}
        print("─" * 55)
        print("  Please answer these follow-up questions:")
        print("─" * 55)
        for i, question in enumerate(questions, 1):
            print(f"\n  Q{i}: {question}")
            answer = input("  Your answer: ").strip()
            answers[question] = answer if answer else "Not provided"

        session.add_followup_answers(answers)
        print("\n           [FOLLOWUP] Answers collected.")
