"""
PatientSession — stateful object passed between agents.
Acts as the shared memory/context across the agentic pipeline.
"""

from dataclasses import dataclass, field
from typing import Optional
import base64
import json


@dataclass
class PatientSession:
    # Intake
    symptoms: str = ""
    medications: list = field(default_factory=list)
    image_path: Optional[str] = None
    image_b64: Optional[str] = None

    # Follow-up Q&A
    followup_questions: list = field(default_factory=list)
    followup_answers: dict = field(default_factory=dict)

    # RAG context (retrieved medical docs)
    rag_context: str = ""

    # Intermediate + final outputs
    preliminary_triage: Optional[str] = None
    final_result: Optional[dict] = None

    def set_intake(self, symptoms: str, medications: list, image_path: Optional[str]):
        self.symptoms = symptoms
        self.medications = medications
        self.image_path = image_path
        if image_path:
            self._load_image(image_path)

    def _load_image(self, path: str):
        try:
            with open(path, "rb") as f:
                self.image_b64 = base64.b64encode(f.read()).decode("utf-8")
            print(f"[SESSION] Image loaded: {path}")
        except FileNotFoundError:
            print(f"[SESSION] Warning: Image not found at {path}. Proceeding without image.")

    def add_followup_answers(self, answers: dict):
        self.followup_answers = answers

    def to_context_string(self) -> str:
        """Serializes session state for prompt injection."""
        parts = [f"Symptoms: {self.symptoms}"]
        if self.medications:
            parts.append(f"Medications: {', '.join(self.medications)}")
        if self.followup_answers:
            qa = "\n".join([f"  Q: {q}\n  A: {a}" for q, a in self.followup_answers.items()])
            parts.append(f"Follow-up Q&A:\n{qa}")
        if self.rag_context:
            parts.append(f"Retrieved Medical Context:\n{self.rag_context}")
        return "\n\n".join(parts)

    def has_image(self) -> bool:
        return self.image_b64 is not None
