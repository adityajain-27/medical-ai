"""
VisionAgent
============
Analyzes patient-uploaded images (skin rash, wound, eye, etc.)
using Claude's vision capability (claude-3-5-sonnet).

In production, you can swap the vision model for:
  - MedViT: Fine-tuned ViT on medical images (skin lesion classification)
  - SkinGPT-4: Dermatology-specific multimodal LLM
  - BioViL-T: Radiology/clinical imaging model (Microsoft Research)
  - Custom YOLO/ResNet for wound severity detection

The vision analysis is appended to session.rag_context so the downstream
AssessmentAgent can incorporate image findings into the SOAP note.

Supported image types:
  - Dermatology: rash, lesion, wound, burn, bruise
  - Ophthalmology: red eye, discharge, swelling
  - ENT: throat, ear (requires otoscope)
  - Oral: mouth sores, tongue, gums
"""

import anthropic
import os
from utils.llm_client import LLMClient

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

VISION_JSON_PROMPT = """
Based on your image analysis, respond in this JSON format:
{
  "region": "body region observed",
  "findings": ["finding 1", "finding 2", ...],
  "visual_conditions": [
    {"name": "condition", "confidence": "High|Medium|Low", "visual_evidence": "what in the image suggests this"}
  ],
  "image_red_flags": ["red flag 1"] or [],
  "image_quality": "Good|Fair|Poor",
  "image_notes": "any limitations or caveats"
}
"""


class VisionAgent:

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

    async def run(self, session):
        """Analyze image and append findings to session.rag_context."""
        if not session.has_image():
            return

        try:
            # Call Claude Vision API
            message = self.client.messages.create(
                model="claude-opus-4-5",
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": "image/jpeg",
                                    "data": session.image_b64,
                                },
                            },
                            {
                                "type": "text",
                                "text": VISION_PROMPT.format(symptoms=session.symptoms)
                            }
                        ],
                    }
                ],
            )

            image_report = message.content[0].text
            print(f"           [VISION] Image analysis complete ({len(image_report)} chars).")

            # Append vision findings to RAG context so AssessmentAgent sees them
            session.rag_context = (
                f"=== VISION ANALYSIS (Image Submitted by Patient) ===\n{image_report}\n\n"
                f"=== RETRIEVED MEDICAL CONTEXT ===\n{session.rag_context}"
            )

        except Exception as e:
            print(f"           [VISION] Warning: Image analysis failed: {e}")
            session.rag_context = (
                "[VISION] Image was provided but could not be analyzed. "
                "Proceeding with text-only assessment.\n\n" + session.rag_context
            )


# ── Production swap: MedViT / SkinGPT-4 ────────────────────────────────────
class MedViTAgent:
    """
    Placeholder for MedViT integration.
    
    MedViT (Medical Vision Transformer) is a ViT-based model fine-tuned on
    medical imaging datasets including ISIC (skin lesions), HAM10000, etc.
    
    To use:
        pip install torch torchvision timm
        
    Model: https://github.com/Omid-Nejati/MedViT
    
    Example integration:
        import torch
        from medvit import MedViT_small
        
        model = MedViT_small(num_classes=7)  # 7 ISIC classes
        model.load_state_dict(torch.load("medvit_isic.pth"))
        model.eval()
        
        # Preprocess image
        from torchvision import transforms
        transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        
        # Classify
        with torch.no_grad():
            output = model(transform(pil_image).unsqueeze(0))
            predicted_class = ISIC_CLASSES[output.argmax()]
    """
    pass
