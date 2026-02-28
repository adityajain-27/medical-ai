import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mic, MicOff, Loader2, ArrowRight, MessageCircle, Send, Image, Map, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { motion, AnimatePresence } from "motion/react";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import BodyMap from "./BodyMap";
import ImageUpload from "./ImageUpload";

interface ChatMessage {
  role: 'ai' | 'user';
  message: string;
}

// Context-aware follow-up questions keyed to symptom keywords
const FOLLOW_UP_RULES: Array<{ keywords: string[]; questions: string[] }> = [
  {
    keywords: ['chest pain', 'chest', 'heart', 'cardiac', 'palpitation'],
    questions: [
      'Is the chest pain worse when you breathe in or cough?',
      'Does the pain radiate to your left arm, jaw, or back?',
      'Did the pain come on suddenly or gradually?',
      'Do you have a history of heart disease or high blood pressure?',
      'Are you experiencing sweating, nausea, or shortness of breath alongside the pain?',
    ],
  },
  {
    keywords: ['headache', 'head', 'migraine'],
    questions: [
      'Is this the worst headache you have ever felt, or similar to previous ones?',
      'Is the headache on one side or both sides of your head?',
      'Do you have sensitivity to light or sound?',
      'Did the headache start suddenly or come on slowly over hours?',
      'Have you had any fever, neck stiffness, or vision changes with the headache?',
    ],
  },
  {
    keywords: ['dizzy', 'dizziness', 'fainting', 'vertigo', 'lightheaded'],
    questions: [
      'Does the dizziness occur when you stand up quickly?',
      'Is the room spinning around you, or do you feel like you might faint?',
      'Have you had any recent vomiting or changes in hearing?',
      'Are you currently on any blood pressure medications?',
      'Does lying down make the dizziness better or worse?',
    ],
  },
  {
    keywords: ['fever', 'temperature', 'chills', 'sweating'],
    questions: [
      'What is your current temperature reading if measured?',
      'How long have you had the fever — hours or days?',
      'Do you have any rash, sore throat, or urinary symptoms alongside the fever?',
      'Have you recently traveled internationally or been exposed to someone who was sick?',
      'Are you experiencing rigors (uncontrollable shaking chills)?',
    ],
  },
  {
    keywords: ['cough', 'breathing', 'breath', 'short of breath', 'shortness', 'wheeze', 'respiratory'],
    questions: [
      'Is the cough productive (bringing up phlegm) or dry?',
      'What color is any phlegm or mucus you are coughing up?',
      'Do you have any difficulty breathing at rest or only on exertion?',
      'Do you have a history of asthma, COPD, or other lung conditions?',
      'Have you been in contact with anyone with COVID-19 or a respiratory illness recently?',
    ],
  },
  {
    keywords: ['stomach', 'abdomen', 'nausea', 'vomit', 'gastrointestinal', 'bowel', 'diarrhea'],
    questions: [
      'Where exactly in the abdomen is the pain — upper, lower, left, or right?',
      'Have you had any blood in your vomit or stool?',
      'Did the pain come on after eating a specific meal?',
      'Do you have any fever or jaundice (yellowing of skin/eyes)?',
      'Has the pain been constant or does it come and go in waves?',
    ],
  },
];

function getFollowUpQuestions(symptomsText: string): string[] {
  const lower = symptomsText.toLowerCase();
  for (const rule of FOLLOW_UP_RULES) {
    if (rule.keywords.some(kw => lower.includes(kw))) {
      return rule.questions.slice(0, 4);
    }
  }
  // Generic fallback questions
  return [
    'When exactly did these symptoms first start?',
    'On a scale of 1-10, how severe are your symptoms right now?',
    'Have you taken any medications for this? If so, did they help?',
    'Do you have any known allergies or pre-existing conditions?',
  ];
}

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default function SymptomInputEnhanced() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    age: '',
    gender: '',
    symptoms: '',
    severity: [5],
  });

  const [chatMode, setChatMode] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'ai', message: "Hello! I'll help you describe your symptoms. First, tell me what's bothering you most today." },
  ]);
  const [chatPhase, setChatPhase] = useState<'initial' | 'followup'>('initial');
  const [pendingFollowUps, setPendingFollowUps] = useState<string[]>([]);

  // Voice input state
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // Body map state
  const [showBodyMap, setShowBodyMap] = useState(false);
  const [selectedBodyRegions, setSelectedBodyRegions] = useState<string[]>([]);

  // Image upload state
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);

  // Check voice support
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setVoiceSupported(!!SR);
    if (SR) {
      const recognition = new SR();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(r => r[0].transcript)
          .join('');
        setFormData(prev => ({ ...prev, symptoms: prev.symptoms + (prev.symptoms ? ' ' : '') + transcript }));
      };

      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Store form data + image/body info in sessionStorage for other pages
    sessionStorage.setItem('patientInput', JSON.stringify({
      ...formData,
      bodyRegions: selectedBodyRegions,
      hasImages: uploadedImages.length > 0,
      imageCount: uploadedImages.length,
    }));

    setTimeout(() => {
      navigate('/risk-analysis');
    }, 2500);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', message: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      if (chatPhase === 'initial') {
        // Generate context-aware follow-up questions based on what user typed
        const questions = getFollowUpQuestions(userMsg + ' ' + formData.symptoms);
        setPendingFollowUps(questions.slice(1));
        setChatPhase('followup');
        setChatMessages(prev => [
          ...prev,
          { role: 'ai', message: `Thank you. I have a few follow-up questions to better understand your condition:\n\n${questions[0]}` },
        ]);
      } else if (pendingFollowUps.length > 0) {
        const nextQuestion = pendingFollowUps[0];
        setPendingFollowUps(prev => prev.slice(1));
        setChatMessages(prev => [
          ...prev,
          { role: 'ai', message: nextQuestion },
        ]);
      } else {
        setChatMessages(prev => [
          ...prev,
          { role: 'ai', message: "Thank you for the detailed information. I have enough to generate a thorough clinical summary. Please click 'Analyze with AI' to proceed." },
        ]);
      }
    }, 700);
  };

  const getSeverityLabel = (value: number) => {
    if (value <= 2) return 'Minimal';
    if (value <= 4) return 'Mild';
    if (value <= 6) return 'Moderate';
    if (value <= 8) return 'Severe';
    return 'Critical';
  };

  const getSeverityColor = (value: number) => {
    if (value <= 2) return 'text-green-600';
    if (value <= 4) return 'text-lime-600';
    if (value <= 6) return 'text-yellow-600';
    if (value <= 8) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Patient Symptom Analysis
          </h1>
          <p className="text-slate-600">
            Enter patient information for AI-powered triage and risk assessment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-8 rounded-xl border border-slate-200 shadow-sm">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      placeholder="PT-0001"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="35"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    required
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity Slider */}
                <div className="space-y-4 p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center justify-between">
                    <Label>Symptom Severity</Label>
                    <span className={`font-semibold ${getSeverityColor(formData.severity[0])}`}>
                      {formData.severity[0]} — {getSeverityLabel(formData.severity[0])}
                    </span>
                  </div>
                  <Slider
                    min={0} max={10} step={1}
                    value={formData.severity}
                    onValueChange={(value) => setFormData({ ...formData, severity: value })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>0 — None</span>
                    <span>5 — Moderate</span>
                    <span>10 — Worst</span>
                  </div>
                </div>

                {/* Symptom Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="symptoms">Symptom Description</Label>
                    <div className="flex gap-1">
                      {/* Voice Input */}
                      {voiceSupported && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`text-xs ${isRecording ? 'text-red-600 bg-red-50' : 'text-blue-600'}`}
                          onClick={toggleVoice}
                        >
                          {isRecording ? (
                            <><MicOff className="w-3.5 h-3.5 mr-1" />Stop</>
                          ) : (
                            <><Mic className="w-3.5 h-3.5 mr-1" />Voice</>
                          )}
                        </Button>
                      )}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 text-xs"
                        onClick={() => setChatMode(!chatMode)}
                      >
                        <MessageCircle className="w-3.5 h-3.5 mr-1" />
                        {chatMode ? 'Hide' : 'AI Chat'}
                      </Button>
                    </div>
                  </div>

                  {/* Recording indicator */}
                  <AnimatePresence>
                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200"
                      >
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs text-red-700 font-medium">Recording... speak your symptoms clearly</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Textarea
                    id="symptoms"
                    placeholder="Describe symptoms in natural language... e.g. 'Severe chest pain radiating to left arm, shortness of breath for 30 minutes, feel sweaty and dizzy'"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    required
                    rows={5}
                    className="rounded-lg resize-none"
                  />
                  <p className="text-xs text-slate-500">
                    Include: duration, onset, severity, associated symptoms, triggers
                  </p>
                </div>

                {/* Body Map toggle */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                    onClick={() => setShowBodyMap(!showBodyMap)}
                  >
                    <div className="flex items-center gap-2">
                      <Map className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Visual Body Map</span>
                      {selectedBodyRegions.length > 0 && (
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                          {selectedBodyRegions.length} area{selectedBodyRegions.length !== 1 ? 's' : ''} selected
                        </Badge>
                      )}
                    </div>
                    {showBodyMap ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showBodyMap && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white">
                          <BodyMap onRegionsChange={setSelectedBodyRegions} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image Upload toggle */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                    onClick={() => setShowImageUpload(!showImageUpload)}
                  >
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-slate-700">Upload Symptom Image</span>
                      <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                        AI Vision
                      </Badge>
                      {uploadedImages.length > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                          {uploadedImages.length} image{uploadedImages.length !== 1 ? 's' : ''}
                        </Badge>
                      )}
                    </div>
                    {showImageUpload ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {showImageUpload && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-white">
                          <ImageUpload onImagesChange={setUploadedImages} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl text-lg"
                >
                  {loading ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing with AI...</>
                  ) : (
                    <>Analyze with AI <ArrowRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
              </form>
            </Card>

            {/* AI Loading state */}
            <AnimatePresence>
              {loading && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <Card className="p-6 rounded-xl border border-blue-200 bg-blue-50">
                    <div className="flex items-start gap-4">
                      <Loader2 className="w-6 h-6 text-blue-600 animate-spin mt-1" />
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-2">AI Clinical Co-Pilot Processing</h3>
                        <ul className="space-y-1 text-sm text-slate-600">
                          <li>• Extracting structured health indicators...</li>
                          <li>• Analyzing symptom patterns & risk factors...</li>
                          {uploadedImages.length > 0 && <li>• Processing visual symptom images (AI Vision)...</li>}
                          {selectedBodyRegions.length > 0 && <li>• Correlating body region data...</li>}
                          <li>• Generating differential diagnosis...</li>
                          <li>• Assigning triage priority level...</li>
                        </ul>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* AI Chat Assistant */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {chatMode && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                  <Card className="p-6 rounded-xl border border-slate-200 shadow-sm h-[580px] flex flex-col">
                    <div className="mb-4">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-blue-600" />
                        AI Follow-up Engine
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        Context-aware questions based on your symptoms
                      </p>
                    </div>

                    <ScrollArea className="flex-1 pr-3 mb-4">
                      <div className="space-y-3">
                        {chatMessages.map((msg, index) => (
                          <div
                            key={index}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${msg.role === 'user'
                                  ? 'bg-blue-600 text-white rounded-tr-sm'
                                  : 'bg-slate-100 text-slate-900 rounded-tl-sm'
                                }`}
                            >
                              <p className="text-sm whitespace-pre-line">{msg.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    <form onSubmit={handleChatSubmit} className="flex gap-2">
                      <Input
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type your response..."
                        className="rounded-xl"
                      />
                      <Button type="submit" size="icon" className="rounded-xl flex-shrink-0">
                        <Send className="w-4 h-4" />
                      </Button>
                    </form>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Tips panel when chat is off */}
            {!chatMode && (
              <Card className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-semibold text-slate-800 text-sm mb-3">💡 Tips for better results</h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Use <strong>Voice Input</strong> to speak symptoms naturally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Open <strong>Body Map</strong> to pinpoint symptom location</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Upload <strong>photos</strong> of rashes, wounds, or eye conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>Open <strong>AI Chat</strong> to be guided with follow-up questions</span>
                  </li>
                </ul>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
