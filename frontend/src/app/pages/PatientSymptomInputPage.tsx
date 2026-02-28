import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { Activity, Mic, ArrowLeft, MapPin, Camera, Pill, Plus, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import BodyMap from '../components/BodyMap';
import ImageUpload from '../components/ImageUpload';
import { analyzeSymptoms } from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';

export default function PatientSymptomInputPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState([5]);
  const [bodyRegions, setBodyRegions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [medInput, setMedInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [listeningLang, setListeningLang] = useState<'en-IN' | 'hi-IN'>('en-IN');
  const recognitionRef = useRef<any>(null);

  const toggleListening = (lang: 'en-IN' | 'hi-IN') => {
    if (isListening && listeningLang === lang) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
    }

    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Browser doesn't support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => {
      setIsListening(true);
      setListeningLang(lang);
      toast.success(lang === 'hi-IN' ? 'हिंदी में सुन रहा है... बोलिए।' : 'Listening in English... Speak now.');
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        setSymptoms((prev) => prev ? prev + ' ' + finalTranscript : finalTranscript);
      }
    };

    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  const addMedication = () => {
    const trimmed = medInput.trim();
    if (trimmed && !medications.includes(trimmed)) {
      setMedications([...medications, trimmed]);
      setMedInput('');
    }
  };

  const removeMedication = (med: string) =>
    setMedications(medications.filter(m => m !== med));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    // Include any medication still typed in the input (user didn't press +)
    const allMeds = [...medications];
    if (medInput.trim() && !allMeds.includes(medInput.trim())) {
      allMeds.push(medInput.trim());
    }

    const regionText = bodyRegions.length > 0
      ? ` Affected body areas: ${bodyRegions.join(', ')}.`
      : '';
    const medicationText = allMeds.length > 0
      ? ` Current medications: ${allMeds.join(', ')}.`
      : '';
    const fullSymptoms = `${symptoms}${regionText}${medicationText} Severity: ${severity[0]}/10.`;

    setIsLoading(true);
    try {
      // Navigate to follow-up questions page first
      navigate('/patient/followup', {
        state: { symptoms: fullSymptoms, medications: allMeds, name, age, gender }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/nirog-logo.png" alt="Nirog Ai" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Free AI Health Analysis</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Fill in as much as you can — the more detail, the better the AI assessment
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Section 1: Basic Info */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-sm flex items-center justify-center font-bold">1</span>
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" placeholder="e.g., Ahana" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age">Age *</Label>
                  <Input id="age" type="number" placeholder="e.g., 34" value={age} onChange={e => setAge(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={gender} onValueChange={setGender} required>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Symptoms */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 text-sm flex items-center justify-center font-bold">2</span>
                <Activity className="w-4 h-4" />
                Describe Your Symptoms *
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="symptoms">What are you experiencing?</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={isListening && listeningLang === 'hi-IN' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleListening('hi-IN')}
                      className={`h-7 ${isListening && listeningLang === 'hi-IN' ? 'bg-red-500 hover:bg-red-600 text-white border-transparent' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800'}`}
                    >
                      <Mic className={`w-3.5 h-3.5 mr-1.5 ${isListening && listeningLang === 'hi-IN' ? 'animate-pulse' : ''}`} />
                      {isListening && listeningLang === 'hi-IN' ? 'सुन रहा है...' : 'हिंदी'}
                    </Button>
                    <Button
                      type="button"
                      variant={isListening && listeningLang === 'en-IN' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => toggleListening('en-IN')}
                      className={`h-7 ${isListening && listeningLang === 'en-IN' ? 'bg-red-500 hover:bg-red-600 text-white border-transparent' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800'}`}
                    >
                      <Mic className={`w-3.5 h-3.5 mr-1.5 ${isListening && listeningLang === 'en-IN' ? 'animate-pulse' : ''}`} />
                      {isListening && listeningLang === 'en-IN' ? 'Listening (EN)' : 'English'}
                    </Button>
                  </div>
                </div>
                <Textarea
                  id="symptoms"
                  placeholder="e.g., chest pain, shortness of breath, started 2 days ago, gets worse when breathing in..."
                  className="min-h-[130px] text-base"
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Severity: {severity[0]}/10</Label>
                <Slider min={0} max={10} step={1} value={severity} onValueChange={setSeverity} className="w-full" />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Mild</span><span>Moderate</span><span>Severe</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Body Map (Localization) */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="pt-6">
              <BodyMap onRegionsChange={setBodyRegions} />
            </CardContent>
          </Card>

          {/* Section 4: Image Upload */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-sm flex items-center justify-center font-bold">4</span>
                <Camera className="w-4 h-4" />
                Upload Symptom Photos
                <Badge variant="secondary" className="ml-auto text-xs font-normal">Optional</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-500 mb-4">
                Upload photos of rashes, wounds, eye redness, or skin changes — AI will analyze them visually.
              </p>
              <ImageUpload />
            </CardContent>
          </Card>

          {/* Section 5: Medications */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 text-sm flex items-center justify-center font-bold">5</span>
                <Pill className="w-4 h-4" />
                Current Medications
                <Badge variant="secondary" className="ml-auto text-xs font-normal">Optional — for drug interaction check</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-slate-500">
                List any medications you're currently taking. The AI will automatically flag dangerous interactions with suggested treatments.
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Warfarin, Aspirin, Metformin..."
                  value={medInput}
                  onChange={e => setMedInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addMedication(); } }}
                />
                <Button type="button" variant="outline" onClick={addMedication} className="shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {medications.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {medications.map(med => (
                    <Badge key={med} variant="secondary" className="bg-orange-50 text-orange-700 border border-orange-200 flex items-center gap-1 pr-1">
                      <Pill className="w-3 h-3" />
                      {med}
                      <button onClick={() => removeMedication(med)} className="ml-1 hover:text-orange-900">
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-lg py-6"
          >
            {isLoading ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Analyzing with AI...</>
            ) : (
              <><Activity className="w-5 h-5 mr-2" /> Analyze with AI</>
            )}
          </Button>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100">
              <strong>Privacy Note:</strong> This is a demo platform. For actual medical emergencies, call emergency services immediately.
            </p>
          </div>
        </form>
      </main>
    </div>
  );
}
