import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Slider } from '../components/ui/slider';
import {
  ArrowLeft, FileText, AlertTriangle, Loader2,
  Activity, Brain, Zap, User, Phone, Mail, Calendar,
  Droplets, Camera, Plus, X, ChevronDown, ChevronUp, Send
} from 'lucide-react';
import { toast } from 'sonner';

const NODE_BASE_URL = import.meta.env.VITE_NODE_URL || 'http://localhost:5000';

function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// Body region selector options
const BODY_REGIONS = [
  'Head / Skull', 'Face', 'Neck', 'Chest / Thorax', 'Abdomen',
  'Back (Upper)', 'Back (Lower)', 'Left Arm', 'Right Arm',
  'Left Hand', 'Right Hand', 'Pelvis / Groin', 'Left Leg', 'Right Leg',
  'Left Foot', 'Right Foot', 'Whole Body'
];

interface Assessment {
  _id: string;
  symptoms: string;
  triage: { color: string; label: string; urgency_score?: number; reason?: string };
  soapNote?: any;
  conditions?: Array<{ name: string; probability: string; icd_code?: string }>;
  drugInteractions?: Array<{ drug1: string; drug2: string; severity: string; description: string }>;
  redFlags?: string[];
  createdAt: string;
}

interface Patient {
  _id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
  medicalHistory?: string;
  allergies?: string;
  totalAnalyses: number;
  createdAt: string;
}

export default function DoctorPatientDetailPage() {
  const { patientId } = useParams();
  const token = localStorage.getItem('token');
  const [patient, setPatient] = useState<Patient | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [showAnalyze, setShowAnalyze] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [sendingIntake, setSendingIntake] = useState(false);

  // Analysis form state
  const [symptoms, setSymptoms] = useState('');
  const [severity, setSeverity] = useState([5]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [medInput, setMedInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!token || !patientId) return;
    fetch(`${NODE_BASE_URL}/api/doctor/patients/${patientId}`, { headers: authHeaders(token) })
      .then(r => r.json())
      .then(data => { setPatient(data.patient); setAssessments(data.assessments || []); })
      .catch(() => toast.error('Failed to load patient'))
      .finally(() => setLoading(false));
  }, [token, patientId]);

  const toggleRegion = (region: string) => {
    setSelectedRegions(r => r.includes(region) ? r.filter(x => x !== region) : [...r, region]);
  };

  const addMed = () => {
    const t = medInput.trim();
    if (t && !medications.includes(t)) { setMedications(m => [...m, t]); setMedInput(''); }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) { toast.error('Please enter symptoms'); return; }
    setAnalyzing(true);

    const allMeds = [...medications];
    if (medInput.trim()) allMeds.push(medInput.trim());

    const regionText = selectedRegions.length > 0 ? ` Affected regions: ${selectedRegions.join(', ')}.` : '';
    const fullSymptoms = `${symptoms}${regionText}`;

    try {
      let url = `${NODE_BASE_URL}/api/doctor/patients/${patientId}/analyze`;
      let body: any;

      if (imageFile && imagePreview) {
        url = `${NODE_BASE_URL}/api/doctor/patients/${patientId}/analyze/image`;
        body = JSON.stringify({
          symptoms: fullSymptoms,
          medications: allMeds,
          severity: severity[0],
          imageBase64: imagePreview,
          imageType: imageFile.type,
        });
      } else {
        body = JSON.stringify({ symptoms: fullSymptoms, medications: allMeds, severity: severity[0] });
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: authHeaders(token!),
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast.success('✅ AI Analysis complete!');
      const newAssessment = {
        _id: data.assessmentId,
        symptoms: fullSymptoms,
        triage: data.triage,
        soapNote: data.soap_note,
        conditions: data.conditions,
        drugInteractions: data.drug_interactions,
        redFlags: data.red_flags,
        createdAt: new Date().toISOString(),
      };
      setAssessments(prev => [newAssessment, ...prev]);
      setSelectedIdx(0);
      setPatient(p => p ? { ...p, totalAnalyses: p.totalAnalyses + 1 } : p);
      setSymptoms(''); setSeverity([5]); setSelectedRegions([]); setMedications([]);
      setMedInput(''); setImageFile(null); setImagePreview(null);
      setShowAnalyze(false);
    } catch (err: any) {
      toast.error(err.message || 'Analysis failed. Is the AI server running?');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSendIntake = async () => {
    if (!patient?.email) { toast.error('This patient has no email address on file.'); return; }
    setSendingIntake(true);
    try {
      const res = await fetch(`${NODE_BASE_URL}/api/intake/send`, {
        method: 'POST',
        headers: authHeaders(token!),
        body: JSON.stringify({ patientId: patient._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(`✅ Intake form sent to ${patient.email}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to send intake form');
    } finally {
      setSendingIntake(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    </DashboardLayout>
  );

  if (!patient) return (
    <DashboardLayout>
      <div className="text-center py-16">
        <p className="text-slate-500">Patient not found.</p>
        <Link to="/doctor/patients"><Button variant="outline" className="mt-4"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>
      </div>
    </DashboardLayout>
  );

  const current = assessments[selectedIdx];
  const triageColor = current?.triage?.color;
  const riskLabel = triageColor === 'RED' ? 'HIGH RISK' : triageColor === 'YELLOW' ? 'MEDIUM RISK' : triageColor === 'GREEN' ? 'LOW RISK' : null;
  const badgeVariant = triageColor === 'RED' ? 'destructive' : triageColor === 'YELLOW' ? 'default' : 'secondary';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-4">
            <Link to="/doctor/patients">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />Patients</Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{patient.name}</h1>
              <code className="text-xs text-slate-500 font-mono">{patient.patientId} · {patient.age}y {patient.gender}</code>
            </div>
          </div>
          <Button
            className="bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg"
            onClick={() => { setShowAnalyze(s => !s); setShowHistory(!showAnalyze); }}
          >
            <Brain className="w-4 h-4 mr-2" />
            {showAnalyze ? 'Cancel' : 'Run AI Analysis'}
          </Button>
          <Button
            variant="outline"
            className="border-sky-300 text-sky-600 hover:bg-sky-50"
            onClick={handleSendIntake}
            disabled={sendingIntake || !patient.email}
            title={!patient.email ? 'Add an email address to this patient first' : 'Send intake form via email'}
          >
            {sendingIntake ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
            {sendingIntake ? 'Sending…' : 'Send Intake Form'}
          </Button>
        </div>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2"><User className="w-4 h-4 text-slate-400" /><span className="text-slate-700 dark:text-slate-300">{patient.age}y · <span className="capitalize">{patient.gender}</span></span></div>
              {patient.email && <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{patient.email}</span></div>}
              {patient.phone && <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-slate-400" /><span className="text-slate-600">{patient.phone}</span></div>}
              {patient.bloodGroup && <div className="flex items-center gap-2"><Droplets className="w-4 h-4 text-red-400" /><span className="font-semibold text-red-600">{patient.bloodGroup}</span></div>}
              <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-blue-400" /><span className="text-slate-600">{patient.totalAnalyses} analyse{patient.totalAnalyses !== 1 ? 's' : ''}</span></div>
              <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400" /><span className="text-slate-600">Added {new Date(patient.createdAt).toLocaleDateString()}</span></div>
            </div>
            {patient.medicalHistory && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Medical History</p>
                <p className="text-sm text-slate-700 dark:text-slate-300">{patient.medicalHistory}</p>
              </div>
            )}
            {patient.allergies && (
              <div className="mt-2 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <p className="text-xs font-semibold text-orange-600 uppercase mb-1">⚠ Allergies</p>
                <p className="text-sm text-orange-700 dark:text-orange-300">{patient.allergies}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {showAnalyze && (
          <Card className="border-2 border-teal-200 dark:border-teal-800 bg-teal-50/30 dark:bg-teal-950/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700 dark:text-teal-300">
                <Zap className="w-5 h-5" /> AI Analysis for {patient.name}
                <Badge variant="outline" className="ml-auto text-xs text-teal-600 border-teal-300">Patient context auto-included</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAnalyze} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Presenting Symptoms *</Label>
                  <Textarea
                    placeholder="Describe the patient's current complaints in detail..."
                    className="resize-none" rows={3}
                    value={symptoms} onChange={e => setSymptoms(e.target.value)} required
                  />
                  <p className="text-xs text-slate-500">Age, gender, medical history & allergies are automatically included in the AI context.</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Symptom Severity: <span className="text-teal-600 font-bold">{severity[0]}/10</span>
                  </Label>
                  <Slider min={1} max={10} step={1} value={severity} onValueChange={setSeverity} className="w-full" />
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Mild (1)</span><span>Moderate (5)</span><span>Severe (10)</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Affected Body Regions</Label>
                  <div className="flex flex-wrap gap-2">
                    {BODY_REGIONS.map(region => (
                      <button key={region} type="button" onClick={() => toggleRegion(region)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedRegions.includes(region)
                          ? 'bg-teal-500 text-white border-teal-500'
                          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                          }`}>
                        {region}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Current Medications</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add medication (e.g. Metformin 500mg)"
                      value={medInput} onChange={e => setMedInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMed())}
                    />
                    <Button type="button" variant="outline" onClick={addMed}><Plus className="w-4 h-4" /></Button>
                  </div>
                  {medications.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {medications.map(m => (
                        <Badge key={m} variant="secondary" className="flex items-center gap-1 pl-2">
                          {m}
                          <button type="button" onClick={() => setMedications(x => x.filter(x => x !== m))}>
                            <X className="w-3 h-3 ml-1" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    <Camera className="w-4 h-4 inline mr-2" />Symptom Image (optional)
                  </Label>
                  {imagePreview ? (
                    <div className="flex items-start gap-4 p-3 border border-slate-200 dark:border-slate-700 rounded-xl">
                      <img src={imagePreview} alt="symptom" className="w-24 h-24 object-cover rounded-lg" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{imageFile?.name}</p>
                        <p className="text-xs text-slate-500 mt-1">{imageFile ? (imageFile.size / 1024).toFixed(0) + ' KB' : ''}</p>
                        <p className="text-xs text-teal-600 dark:text-teal-400 mt-2">✓ AI vision analysis will be included</p>
                      </div>
                      <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); }} className="p-1 hover:bg-red-50 rounded-md">
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition-all">
                      <Camera className="w-8 h-8 text-slate-400" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">Upload skin rash, wound, or other symptom photo</span>
                      <span className="text-xs text-slate-400">JPG, PNG, HEIC — AI will analyze the image</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>
                  )}
                </div>

                <Button type="submit" disabled={analyzing} size="lg" className="w-full bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-lg">
                  {analyzing
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating AI Report...</>
                    : <><Brain className="w-4 h-4 mr-2" /> Generate AI Report{imageFile ? ' with Image Analysis' : ''}</>
                  }
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {assessments.length === 0 ? (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="text-center py-16">
              <Brain className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No analyses yet. Click "Run AI Analysis" to generate the first report.</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-slate-900 dark:text-white">Analysis History ({assessments.length})</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowHistory(h => !h)}>
                {showHistory ? <><ChevronUp className="w-4 h-4 mr-1" />Hide</> : <><ChevronDown className="w-4 h-4 mr-1" />Show</>}
              </Button>
            </div>

            {showHistory && (
              <>
                {assessments.length > 1 && (
                  <div className="flex flex-wrap gap-2">
                    {assessments.map((a, i) => (
                      <Button key={a._id} variant={i === selectedIdx ? 'default' : 'outline'} size="sm" onClick={() => setSelectedIdx(i)}>
                        {new Date(a.createdAt).toLocaleDateString()}
                        <Badge variant={a.triage?.color === 'RED' ? 'destructive' : a.triage?.color === 'YELLOW' ? 'default' : 'secondary'} className="ml-2 text-xs">
                          {a.triage?.color || '?'}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                )}

                {current && (
                  <div className="space-y-5">
                    <div className="grid md:grid-cols-4 gap-4">
                      <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="p-5">
                          <p className="text-xs text-slate-500 mb-1">Urgency Score</p>
                          <p className="text-4xl font-bold text-slate-900 dark:text-white">
                            {current.triage?.urgency_score ?? '—'}<span className="text-xl text-slate-400">/100</span>
                          </p>
                        </CardContent>
                      </Card>
                      <Card className={`border-2 ${triageColor === 'RED' ? 'border-red-300 bg-red-50/50' : triageColor === 'YELLOW' ? 'border-yellow-300 bg-yellow-50/50' : 'border-green-300 bg-green-50/50'}`}>
                        <CardContent className="p-5">
                          <p className="text-xs text-slate-500 mb-2">Triage Level</p>
                          <Badge variant={badgeVariant} className="text-sm px-3 py-1">{riskLabel || current.triage?.color}</Badge>
                          <p className="text-xs text-slate-500 mt-2">{current.triage?.label}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="p-5">
                          <p className="text-xs text-slate-500 mb-1">Analysed</p>
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">{new Date(current.createdAt).toLocaleDateString()}</p>
                          <p className="text-xs text-slate-500">{new Date(current.createdAt).toLocaleTimeString()}</p>
                        </CardContent>
                      </Card>
                      <Card className="border-slate-200 dark:border-slate-800">
                        <CardContent className="p-5">
                          <p className="text-xs text-slate-500 mb-1">AI Reasoning</p>
                          <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-3">{current.triage?.reason || '—'}</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Card className="border-slate-200 dark:border-slate-800">
                      <CardHeader><CardTitle className="text-base">Presenting Complaint</CardTitle></CardHeader>
                      <CardContent><p className="text-sm text-slate-700 dark:text-slate-300">{current.symptoms}</p></CardContent>
                    </Card>

                    {current.redFlags && current.redFlags.length > 0 && (
                      <Card className="border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400 text-base"><AlertTriangle className="w-4 h-4" /> Red Flag Warnings</CardTitle></CardHeader>
                        <CardContent>
                          <ul className="space-y-1">
                            {current.redFlags.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-red-700 dark:text-red-300">
                                <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />{f}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {current.conditions && current.conditions.length > 0 && (
                      <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader><CardTitle className="text-base">Possible Conditions (Ranked by Probability)</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                          {current.conditions.map((c, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                              <div><span className="text-sm font-medium text-slate-900 dark:text-white">{i + 1}. {c.name}</span></div>
                              <div className="flex items-center gap-2">
                                {c.icd_code && <Badge variant="outline" className="text-xs font-mono">{c.icd_code}</Badge>}
                                <Badge variant={Number(c.probability) >= 70 ? 'destructive' : Number(c.probability) >= 40 ? 'default' : 'secondary'}>
                                  {c.probability}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {current.drugInteractions && current.drugInteractions.length > 0 && (
                      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/10">
                        <CardHeader><CardTitle className="text-base text-amber-700 dark:text-amber-400">⚠ Drug Interactions</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                          {current.drugInteractions.map((d, i) => (
                            <div key={i} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-amber-200 dark:border-amber-800">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant={d.severity === 'High' ? 'destructive' : 'default'} className="text-xs">{d.severity}</Badge>
                                <span className="text-sm font-medium">{d.drug1} × {d.drug2}</span>
                              </div>
                              <p className="text-xs text-slate-600 dark:text-slate-400">{d.description}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}

                    {current.soapNote && (
                      <Card className="border-slate-200 dark:border-slate-800">
                        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="w-4 h-4" /> Clinical SOAP Note</CardTitle></CardHeader>
                        <CardContent className="grid md:grid-cols-2 gap-4">
                          {[
                            { key: 'subjective', label: 'S — Subjective', color: 'text-blue-600 dark:text-blue-400' },
                            { key: 'objective', label: 'O — Objective', color: 'text-green-600 dark:text-green-400' },
                            { key: 'assessment', label: 'A — Assessment', color: 'text-teal-600 dark:text-teal-400' },
                            { key: 'plan', label: 'P — Plan', color: 'text-purple-600 dark:text-purple-400' },
                          ].map(({ key, label, color }) => (
                            <div key={key} className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                              <h4 className={`font-semibold text-sm ${color} mb-2`}>{label}</h4>
                              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{(current.soapNote as any)[key]}</p>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
