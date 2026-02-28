import os
import re
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

SYSTEM_PROMPT = """You are MedAI, an expert clinical AI system operating as part of an agentic medical pipeline.
You assist healthcare professionals and patients with symptom assessment, triage, and clinical documentation.
You always respond with valid JSON as instructed. Never include markdown code fences.
You are precise, evidence-based, and appropriately cautious about patient safety."""


class LLMClient:

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise EnvironmentError("GROQ_API_KEY not set in .env file")
        self.client = Groq(api_key=api_key)

    async def json_call(self, prompt: str, max_tokens: int = 1024) -> dict:
        for attempt in range(2):
            try:
                response = self.client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens=max_tokens,
                    temperature=0.3
                )
                raw = response.choices[0].message.content.strip()
                return self._extract_json(raw)
            except json.JSONDecodeError:
                if attempt == 0:
                    prompt += "\n\nCRITICAL: Your ENTIRE response must be valid JSON only. No text before or after."
                    continue
                return {}
            except Exception as e:
                raise RuntimeError(f"Groq API error: {e}")

    def _extract_json(self, text: str) -> dict:
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text)
        text = text.strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())

        raise json.JSONDecodeError("No valid JSON found", text, 0)
