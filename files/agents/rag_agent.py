"""
RAGAgent
=========
Retrieves relevant clinical knowledge to ground the AI's reasoning.

Production setup uses:
  - Vector DB: ChromaDB (local) or Pinecone/Weaviate (cloud)
  - Embeddings: sentence-transformers (all-MiniLM-L6-v2) or OpenAI
  - Corpus: PubMed abstracts, ICD-10 descriptions, clinical guidelines

For Day-1 demo: Falls back to a curated keyword-matched knowledge base
if ChromaDB is not set up. Swap out _fallback_retrieve() with real
vector search in production.
"""

import os
from utils.llm_client import LLMClient

# Curated mini knowledge base for demo (replace with real vector DB)
MEDICAL_KB = {
    "chest pain": """
Clinical Note: Chest pain differential includes ACS (STEMI/NSTEMI), PE, aortic dissection,
pneumothorax, GERD, costochondritis. Red flags: radiation to arm/jaw, diaphoresis, syncope,
sudden onset ripping pain (dissection). ECG and troponin are first-line workup.
Guidelines: AHA 2021 Chest Pain Guidelines. High-sensitivity troponin preferred.
""",
    "skin rash": """
Clinical Note: Rash differential includes contact dermatitis, eczema, psoriasis, urticaria,
cellulitis, meningococcemia (petechial/purpuric - EMERGENCY). Stevens-Johnson Syndrome (mucosal
involvement - EMERGENCY). Evaluate: distribution, morphology, associated fever, medication history.
""",
    "eye redness": """
Clinical Note: Red eye differential: conjunctivitis (viral/bacterial/allergic), scleritis,
uveitis, acute angle-closure glaucoma (EMERGENCY: halos, severe pain, nausea), corneal abrasion,
subconjunctival hemorrhage. Acute glaucoma: elevated IOP, mid-dilated pupil - refer to ED.
""",
    "fever": """
Clinical Note: Fever workup depends on severity and associated symptoms. >39.4°C with rigors
suggests bacteremia. Consider sepsis if tachycardia + hypotension. Blood cultures before
antibiotics. In children <3mo: low threshold for lumbar puncture.
""",
    "headache": """
Clinical Note: Headache red flags (SNOOP4): Systemic symptoms, Neoplasm history, Neurologic
symptoms, Onset sudden (thunderclap = SAH until proven otherwise), Older age onset >50, Position-
related, Postdural puncture, Progressive. Thunderclap → CT head immediately.
""",
    "shortness of breath": """
Clinical Note: Dyspnea differential: asthma/COPD exacerbation, heart failure, PE, pneumonia,
pneumothorax, anemia. Peak flow for asthma. BNP + echo for HF. D-dimer + CTPA for PE.
SpO2 <92% = concerning. Stridor = upper airway emergency.
""",
    "abdominal pain": """
Clinical Note: Abdominal pain red flags: peritoneal signs (rigidity, rebound), pulsatile mass
(AAA), age >50 new onset, rectal bleeding, weight loss. RLQ + fever + migration = appendicitis.
RUQ + fever + jaundice = Charcot's triad (cholangitis). LLQ + elderly = diverticulitis.
""",
    "wound": """
Clinical Note: Wound assessment: size, depth, contamination, time since injury, tetanus status,
vascular supply, nerve function. Signs of infection: erythema, warmth, purulence, SIRS criteria.
Bite wounds: high infection risk, consider prophylactic antibiotics. Diabetic wounds: high
complication risk, refer to wound care early.
""",
}


class RAGAgent:

    def __init__(self):
        self.llm = LLMClient()
        self._init_vector_db()

    def _init_vector_db(self):
        """
        Initialize ChromaDB vector store.
        In production: load your FAISS/Chroma index with PubMed embeddings here.
        """
        try:
            import chromadb
            from sentence_transformers import SentenceTransformer

            self.encoder = SentenceTransformer("all-MiniLM-L6-v2")
            self.chroma = chromadb.Client()
            self.collection = self.chroma.get_or_create_collection("medical_kb")

            # Index our KB if empty
            if self.collection.count() == 0:
                docs = list(MEDICAL_KB.values())
                ids = list(MEDICAL_KB.keys())
                embeddings = self.encoder.encode(docs).tolist()
                self.collection.add(documents=docs, embeddings=embeddings, ids=ids)

            self.use_vector = True
            print("           [RAG] ChromaDB vector store initialized.")
        except Exception:
            self.use_vector = False
            print("           [RAG] ChromaDB unavailable. Using keyword fallback.")

    async def run(self, session):
        """Retrieve relevant context and store in session.rag_context."""
        if self.use_vector:
            context = self._vector_retrieve(session.symptoms)
        else:
            context = self._fallback_retrieve(session.symptoms)

        session.rag_context = context
        print(f"           [RAG] Retrieved {len(context)} chars of medical context.")

    def _vector_retrieve(self, query: str, top_k: int = 3) -> str:
        """Semantic search via ChromaDB."""
        query_embedding = self.encoder.encode([query]).tolist()
        results = self.collection.query(query_embeddings=query_embedding, n_results=top_k)
        docs = results.get("documents", [[]])[0]
        return "\n\n---\n\n".join(docs)

    def _fallback_retrieve(self, symptoms: str) -> str:
        """Keyword-based fallback when vector DB is unavailable."""
        symptoms_lower = symptoms.lower()
        matched = []
        for keyword, content in MEDICAL_KB.items():
            if keyword in symptoms_lower:
                matched.append(content.strip())
        if not matched:
            # Return general context if no keyword match
            matched.append("""
General Clinical Note: Assess symptom onset, severity (1-10), duration, radiation, 
associated symptoms, aggravating/relieving factors, relevant medical history,
medications, allergies, and social history. Apply OPQRST framework.
""".strip())
        return "\n\n---\n\n".join(matched)
