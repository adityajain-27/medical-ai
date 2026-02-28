"""
DrugInteractionAgent
=====================
Checks for drug interactions using a two-layer approach:

  Layer 1 — OpenFDA API (free, no key needed)
             Queries https://api.fda.gov/drug/label.json
             Fetches drug label warnings and interaction sections
             Real FDA data, updated regularly

  Layer 2 — LLM Synthesis
             Sends drug list + conditions to LLM to identify
             clinically significant interactions with proposed treatments

OpenFDA Docs: https://open.fda.gov/apis/drug/label/

Usage example:
  Medications: ["warfarin", "aspirin"]
  Proposed treatment: "ibuprofen" (for pain)
  → FLAG: NSAIDs (ibuprofen/aspirin) + warfarin = major bleeding risk
"""

import asyncio
import aiohttp
import json
import os
from utils.llm_client import LLMClient

OPENFDA_BASE = "https://api.fda.gov/drug/label.json"

DRUG_INTERACTION_PROMPT = """
You are a clinical pharmacist reviewing potential drug interactions.

Patient's current medications: {medications}
Likely conditions being assessed: {conditions}
OpenFDA interaction data retrieved: {fda_data}

Identify ALL clinically relevant drug-drug interactions and drug-condition interactions.
For each interaction found:
  - Severity: Minor (nuisance), Moderate (monitor), Major (avoid/emergency)
  - Clinical consequence
  - Recommended action

Respond ONLY in this JSON format:
{{
  "interactions": [
    {{
      "drug1": "medication name",
      "drug2": "other medication or condition",
      "severity": "Minor|Moderate|Major",
      "mechanism": "brief pharmacological mechanism",
      "description": "clinical consequence and management",
      "action": "what the patient/clinician should do"
    }}
  ],
  "overall_risk": "Low|Moderate|High",
  "pharmacy_note": "Summary note for the clinician"
}}
"""


class DrugInteractionAgent:

    def __init__(self):
        self.llm = LLMClient()

    async def run(self, session, conditions: list) -> list:
        """
        Check interactions for patient's medications.
        Returns list of interaction dicts.
        """
        if not session.medications:
            return []

        fda_data = await self._query_openfda(session.medications)

        condition_names = [c.get("name", "") for c in conditions]
        prompt = DRUG_INTERACTION_PROMPT.format(
            medications=", ".join(session.medications),
            conditions=", ".join(condition_names) or "Unknown",
            fda_data=json.dumps(fda_data, indent=2)[:2000]  # truncate for token budget
        )

        result = await self.llm.json_call(prompt)
        interactions = result.get("interactions", [])

        print(f"           [DRUG] Found {len(interactions)} interaction(s). "
              f"Overall risk: {result.get('overall_risk', 'Unknown')}")

        return interactions

    async def _query_openfda(self, medications: list) -> dict:
        """
        Query OpenFDA drug label API for interaction warnings.
        Returns dict of {drug_name: interaction_warnings}
        """
        results = {}

        async with aiohttp.ClientSession() as http_session:
            tasks = [self._fetch_drug_label(http_session, drug) for drug in medications]
            drug_data = await asyncio.gather(*tasks, return_exceptions=True)

        for drug, data in zip(medications, drug_data):
            if isinstance(data, Exception):
                results[drug] = f"[OpenFDA query failed: {data}]"
            else:
                results[drug] = data

        return results

    async def _fetch_drug_label(self, session: aiohttp.ClientSession, drug_name: str) -> str:
        """Fetch drug label from OpenFDA and extract interaction section."""
        url = f"{OPENFDA_BASE}?search=openfda.brand_name:{drug_name}+generic_name:{drug_name}&limit=1"
        try:
            async with session.get(url, timeout=aiohttp.ClientTimeout(total=8)) as resp:
                if resp.status != 200:
                    url2 = f"{OPENFDA_BASE}?search=openfda.generic_name:{drug_name.lower()}&limit=1"
                    async with session.get(url2, timeout=aiohttp.ClientTimeout(total=8)) as resp2:
                        if resp2.status != 200:
                            return f"No FDA data found for {drug_name}"
                        data = await resp2.json()
                else:
                    data = await resp.json()

            results = data.get("results", [])
            if not results:
                return f"No label found for {drug_name}"

            label = results[0]
            sections = []
            for field in ["drug_interactions", "warnings", "contraindications", "precautions"]:
                content = label.get(field)
                if content:
                    if isinstance(content, list):
                        content = " ".join(content)
                    sections.append(f"[{field.upper()}] {content[:500]}")

            return "\n".join(sections) if sections else f"No interaction data in FDA label for {drug_name}"

        except asyncio.TimeoutError:
            return f"[OpenFDA timeout for {drug_name}]"
        except Exception as e:
            return f"[OpenFDA error for {drug_name}: {str(e)}]"
