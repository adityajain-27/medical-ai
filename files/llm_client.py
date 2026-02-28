"""
LLMClient
==========
Thin wrapper around Anthropic Claude API.
Handles JSON extraction, retries, and error fallback.
"""

import os
import re
import json
import anthropic


SYSTEM_PROMPT = """
You are MedAI, an expert clinical AI system operating as part of an agentic medical pipeline.
You assist healthcare professionals and patients with symptom assessment, triage, and clinical documentation.
You always respond with valid JSON as instructed. Never include markdown code fences.
You are precise, evidence-based, and appropriately cautious about patient safety.
"""


class LLMClient:

    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "ANTHROPIC_API_KEY not set. Run: export ANTHROPIC_API_KEY='your-key-here'"
            )
        self.client = anthropic.Anthropic(api_key=api_key)

    async def json_call(self, prompt: str, max_tokens: int = 1024) -> dict:
        """
        Call Claude and parse JSON response.
        Retries once on JSON parse failure with a stricter instruction.
        """
        for attempt in range(2):
            try:
                message = self.client.messages.create(
                    model="claude-opus-4-5",
                    max_tokens=max_tokens,
                    system=SYSTEM_PROMPT,
                    messages=[{"role": "user", "content": prompt}]
                )
                raw = message.content[0].text.strip()
                return self._extract_json(raw)
            except json.JSONDecodeError:
                if attempt == 0:
                    # Retry with stronger JSON instruction
                    prompt += "\n\nCRITICAL: Your ENTIRE response must be valid JSON only. No text before or after."
                    continue
                return {}
            except anthropic.APIError as e:
                raise RuntimeError(f"Claude API error: {e}")

    def _extract_json(self, text: str) -> dict:
        """Extract JSON from response, handling markdown fences."""
        # Strip markdown fences
        text = re.sub(r"```json\s*", "", text)
        text = re.sub(r"```\s*", "", text)
        text = text.strip()

        # Try direct parse
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # Find JSON object in text
        match = re.search(r'\{.*\}', text, re.DOTALL)
        if match:
            return json.loads(match.group())

        raise json.JSONDecodeError("No valid JSON found", text, 0)
