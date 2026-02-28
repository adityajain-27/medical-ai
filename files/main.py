"""
MedAI — Agentic Clinical Assistant
====================================
RAG + Multi-Agent Pipeline for:
  1. Multimodal symptom intake (image + text)
  2. Dynamic triage (RED / YELLOW / GREEN)
  3. SOAP note generation
  4. Follow-up question engine
  5. Drug interaction checker (OpenFDA)

Run:
    pip install -r requirements.txt
    python main.py
"""

import asyncio
from agents.orchestrator import MedicalOrchestrator
from utils.session import PatientSession


async def main():
    print("\n" + "="*60)
    print("       MedAI — Agentic Clinical Assistant")
    print("="*60)

    session = PatientSession()
    orchestrator = MedicalOrchestrator()

    # ---------- INTAKE ----------
    print("\n[INTAKE] Describe your symptoms:")
    symptoms = input(">> ").strip()

    print("\n[INTAKE] Any current medications? (comma-separated, or press Enter to skip):")
    medications_raw = input(">> ").strip()
    medications = [m.strip() for m in medications_raw.split(",") if m.strip()]

    print("\n[INTAKE] Image path (skin/wound/eye photo)? (press Enter to skip):")
    image_path = input(">> ").strip() or None

    session.set_intake(symptoms=symptoms, medications=medications, image_path=image_path)

    # ---------- AGENTIC PIPELINE ----------
    result = await orchestrator.run(session)

    # ---------- OUTPUT ----------
    print("\n" + "="*60)
    print(f"  TRIAGE: {result['triage']['color']} — {result['triage']['label']}")
    print("="*60)

    print("\n📋 SOAP NOTE")
    print("-"*40)
    for section, content in result["soap_note"].items():
        print(f"{section.upper()}: {content}\n")

    if result.get("drug_interactions"):
        print("\n💊 DRUG INTERACTIONS DETECTED")
        print("-"*40)
        for interaction in result["drug_interactions"]:
            print(f"  [{interaction['severity'].upper()}] {interaction['drug1']} ↔ {interaction['drug2']}")
            print(f"  → {interaction['description']}\n")

    if result.get("conditions"):
        print("\n🔬 DIFFERENTIAL DIAGNOSIS")
        print("-"*40)
        for cond in result["conditions"]:
            print(f"  • {cond['name']} ({cond['probability']}) — {cond.get('icd_code', '')}")

    print("\n⚠️  DISCLAIMER:", result.get("disclaimer", "This is not a substitute for professional medical advice."))


if __name__ == "__main__":
    asyncio.run(main())
