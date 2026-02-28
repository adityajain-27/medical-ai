"""
VisionAgent
============
Analyzes patient-uploaded images (skin rash, wound, eye, etc.)
using Groq's Llama 3.2 Vision model (llama-3.2-90b-vision-preview).

The vision analysis is appended to session.rag_context so the downstream
AssessmentAgent can incorporate image findings into the SOAP note.

Supported image types:
  - Dermatology: rash, lesion, wound, burn, bruise
  - Ophthalmology: red eye, discharge, swelling
  - ENT: throat, ear (requires otoscope)
  - Oral: mouth sores, tongue, gums
"""

import os
from groq import Groq

VISION_PROMPT = """
You are a clinical image analyst. Analyze this patient-submitted medical image carefully.

Patient reported symptoms: {symptoms}

Provide a structured image analysis:
1. What body part / region is visible?
2. What abnormalities do you observe? (color, texture, morphology, size estimate, distribution)
3. What conditions could this appearance suggest? (top 3, ranked by likelihood)
4. Are there any IMAGE-BASED red flags that suggest emergency conditions?
5. What is the quality/limitation of this image for clinical assessment?

Be specific and use clinical terminology. Format your response as a clinical image report.
"""


class VisionAgent:

    VISION_MODELS = [
        "meta-llama/llama-4-scout-17b-16e-instruct",
        "llama-3.2-11b-vision-preview",
        "llama-3.2-90b-vision-preview",
    ]

    def __init__(self):
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))

    async def run(self, session):
        """Analyze image and append findings to session.rag_context."""
        if not session.has_image():
            print("           [VISION] No image found in session, skipping.")
            return

        print(f"           [VISION] Image detected ({len(session.image_b64)} chars base64). Starting analysis...")

        for model in self.VISION_MODELS:
            try:
                print(f"           [VISION] Trying model: {model}")
                response = self.client.chat.completions.create(
                    model=model,
                    messages=[
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "image_url",
                                    "image_url": {
                                        "url": f"data:image/jpeg;base64,{session.image_b64}",
                                    },
                                },
                                {
                                    "type": "text",
                                    "text": VISION_PROMPT.format(symptoms=session.symptoms)
                                }
                            ],
                        }
                    ],
                    max_tokens=1024,
                    temperature=0.3,
                )

                image_report = response.choices[0].message.content.strip()
                print(f"           [VISION] ✅ Success with {model} ({len(image_report)} chars).")

                session.rag_context = (
                    f"=== VISION ANALYSIS (Image Submitted by Patient) ===\n{image_report}\n\n"
                    f"=== RETRIEVED MEDICAL CONTEXT ===\n{session.rag_context}"
                )
                return  # Success, stop trying models

            except Exception as e:
                print(f"           [VISION] ❌ Failed with {model}: {type(e).__name__}: {e}")
                continue

        print("           [VISION] ⚠️ All vision models failed. Proceeding text-only.")
        session.rag_context = (
            "[VISION] Image was provided but could not be analyzed. "
            "Proceeding with text-only assessment.\n\n" + session.rag_context
        )
