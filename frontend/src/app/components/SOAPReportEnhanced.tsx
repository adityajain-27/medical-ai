import { useState } from "react";
import { useNavigate } from "react-router";
import { Download, Copy, Send, Check, Share2, FileText, ThumbsUp, ThumbsDown, MessageSquare, Pill } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { toast } from "sonner";
import DrugInteractionChecker from "./DrugInteractionChecker";

export default function SOAPReportEnhanced() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState({ helpful: true, comments: '' });

  const [exportSections, setExportSections] = useState({
    soap: true,
    tests: true,
    timeline: true,
    risk: true
  });

  // Demo SOAP note data
  const soapNote = {
    subjective: "45-year-old female patient presents with acute onset of severe chest pain radiating to the left arm. Pain started approximately 30 minutes ago while at rest. Patient describes pain as crushing and pressure-like, rated 8/10 in severity. Associated symptoms include shortness of breath, nausea, and diaphoresis. Patient reports history of hypertension and hyperlipidemia. Family history significant for coronary artery disease (father had MI at age 52).",

    objective: "Vital Signs: BP 165/95 mmHg, HR 98 bpm, RR 22/min, SpO2 94% on room air, Temp 98.6°F. General: Patient appears anxious and in moderate distress. Cardiovascular: Tachycardic, regular rhythm, no murmurs appreciated. S3 gallop present. Respiratory: Tachypneic, bilateral lung fields clear to auscultation. Skin: Diaphoretic, cool and clammy to touch. No peripheral edema noted.",

    assessment: "Acute chest pain, highly suspicious for acute coronary syndrome (ACS)/acute myocardial infarction. Differential diagnosis includes: 1) ST-elevation myocardial infarction (STEMI) 2) Non-ST elevation myocardial infarction (NSTEMI) 3) Unstable angina 4) Pulmonary embolism 5) Aortic dissection. Risk stratification: HIGH RISK based on symptom presentation, cardiovascular risk factors, and clinical findings.",

    plan: "1. IMMEDIATE: Activate cardiac catheterization team, administer aspirin 325mg PO, sublingual nitroglycerin if BP allows, oxygen therapy to maintain SpO2 >94%. 2. DIAGNOSTIC: Stat 12-lead ECG, cardiac troponin I levels (serial), complete metabolic panel, CBC, chest X-ray, consider bedside echocardiogram. 3. MONITORING: Continuous cardiac monitoring, frequent vital signs, IV access established. 4. CONSULTATION: Cardiology for urgent evaluation and possible cardiac catheterization. 5. DISPOSITION: Admit to CCU/cardiac monitoring unit pending test results and specialist evaluation."
  };

  const handleCopy = () => {
    const fullText = `SOAP NOTE - Patient ID: PT-0045\n\nSUBJECTIVE:\n${soapNote.subjective}\n\nOBJECTIVE:\n${soapNote.objective}\n\nASSESSMENT:\n${soapNote.assessment}\n\nPLAN:\n${soapNote.plan}`;

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    toast.success('PDF Report Generated', {
      description: 'Your clinical report has been prepared for download'
    });
    setShowExportDialog(false);
  };

  const handleShare = () => {
    const url = `https://nirog.ai/reports/PT-0045-${Date.now()}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    toast.success('Shareable link copied to clipboard');
  };

  const handleFeedbackSubmit = () => {
    toast.success('Feedback submitted', {
      description: 'Thank you for helping improve our AI recommendations'
    });
    setShowFeedbackDialog(false);
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              AI Generated Clinical Report
            </h1>
            <p className="text-slate-600">
              SOAP Note • Patient ID: PT-0045 • Generated on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          {/* SOAP Sections */}
          <div className="space-y-6 mb-8">
            {/* Subjective */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-blue-600">S</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">Subjective</h3>
                    <p className="text-slate-700 leading-relaxed">{soapNote.subjective}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Objective */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-green-600">O</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">Objective</h3>
                    <p className="text-slate-700 leading-relaxed">{soapNote.objective}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Assessment */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-orange-600">A</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">Assessment</h3>
                    <p className="text-slate-700 leading-relaxed">{soapNote.assessment}</p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-purple-600">P</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 mb-2">Plan</h3>
                    <p className="text-slate-700 leading-relaxed">{soapNote.plan}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Drug Interaction Checker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <Card className="p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-orange-500" />
                Drug Interaction Checker
                <span className="ml-1 text-xs font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  Powered by OpenFDA
                </span>
              </h3>
              <DrugInteractionChecker />
            </Card>
          </motion.div>

          {/* Physician Feedback */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mb-8"
          >
            <Card className="p-6 rounded-xl border border-blue-200 bg-blue-50">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    Help us improve AI accuracy
                  </h3>
                  <p className="text-sm text-slate-600">
                    Your feedback helps train our models for better clinical decision support
                  </p>
                </div>
                <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="border-blue-300 text-blue-700">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Provide Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Physician Feedback</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <Label className="mb-3 block">Was this AI assessment helpful?</Label>
                        <div className="flex gap-4">
                          <Button
                            variant={feedback.helpful ? "default" : "outline"}
                            onClick={() => setFeedback({ ...feedback, helpful: true })}
                            className="flex-1"
                          >
                            <ThumbsUp className="w-4 h-4 mr-2" />
                            Yes, Helpful
                          </Button>
                          <Button
                            variant={!feedback.helpful ? "default" : "outline"}
                            onClick={() => setFeedback({ ...feedback, helpful: false })}
                            className="flex-1"
                          >
                            <ThumbsDown className="w-4 h-4 mr-2" />
                            Needs Improvement
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="feedback-comments">Additional Comments (Optional)</Label>
                        <Textarea
                          id="feedback-comments"
                          placeholder="Suggest corrections or improvements..."
                          value={feedback.comments}
                          onChange={(e) => setFeedback({ ...feedback, comments: e.target.value })}
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <Button onClick={handleFeedbackSubmit} className="w-full">
                        Submit Feedback
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid md:grid-cols-2 gap-4 mb-4"
          >
            <Button
              onClick={handleCopy}
              variant="outline"
              className="py-6 rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5 mr-2 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5 mr-2" />
                  Copy to Clipboard
                </>
              )}
            </Button>

            <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="py-6 rounded-xl"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Export as PDF
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Clinical Report</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p className="text-sm text-slate-600">Select sections to include in the PDF:</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="export-soap"
                        checked={exportSections.soap}
                        onCheckedChange={(checked) =>
                          setExportSections({ ...exportSections, soap: checked as boolean })
                        }
                      />
                      <Label htmlFor="export-soap" className="cursor-pointer">
                        SOAP Note
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="export-tests"
                        checked={exportSections.tests}
                        onCheckedChange={(checked) =>
                          setExportSections({ ...exportSections, tests: checked as boolean })
                        }
                      />
                      <Label htmlFor="export-tests" className="cursor-pointer">
                        Test Recommendations
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="export-risk"
                        checked={exportSections.risk}
                        onCheckedChange={(checked) =>
                          setExportSections({ ...exportSections, risk: checked as boolean })
                        }
                      />
                      <Label htmlFor="export-risk" className="cursor-pointer">
                        Risk Analysis
                      </Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="export-timeline"
                        checked={exportSections.timeline}
                        onCheckedChange={(checked) =>
                          setExportSections({ ...exportSections, timeline: checked as boolean })
                        }
                      />
                      <Label htmlFor="export-timeline" className="cursor-pointer">
                        Patient Timeline
                      </Label>
                    </div>
                  </div>

                  <Button onClick={handleExport} className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleShare}
              variant="outline"
              className="py-6 rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share Secure Link
            </Button>

            <Button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl"
            >
              <Send className="w-5 h-5 mr-2" />
              Send to Dashboard
            </Button>
          </motion.div>

          {shareUrl && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="p-4 rounded-xl border border-green-200 bg-green-50">
                <p className="text-sm text-green-800 mb-2">
                  <Check className="w-4 h-4 inline mr-1" />
                  Secure shareable link copied to clipboard:
                </p>
                <code className="text-xs bg-white px-3 py-2 rounded border border-green-200 block break-all">
                  {shareUrl}
                </code>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
