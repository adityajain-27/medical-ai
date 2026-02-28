import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { AlertTriangle, FileText, ArrowRight, TrendingUp, AlertCircle, ChevronDown, ChevronUp, Info, MapPin, Camera, Siren, Clock, Home } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";
import { motion } from "motion/react";
import EmergencyModal from "./EmergencyModal";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface Condition {
  name: string;
  probability: number;
  evidence: string[];
}

type TriageCode = 'RED' | 'YELLOW' | 'GREEN';

const TRIAGE_CONFIG: Record<TriageCode, {
  label: string;
  sublabel: string;
  bg: string;
  border: string;
  textColor: string;
  icon: typeof Siren;
  action: string;
  timeframe: string;
}> = {
  RED: {
    label: '🔴 Critical — ER Immediately',
    sublabel: 'Life-threatening condition suspected',
    bg: 'bg-red-50',
    border: 'border-red-300',
    textColor: 'text-red-900',
    icon: Siren,
    action: 'Call 911 or go to the Emergency Room NOW. Do not drive yourself.',
    timeframe: 'Within the next 30 minutes',
  },
  YELLOW: {
    label: '🟡 Urgent — See Doctor Within 24 Hours',
    sublabel: 'Condition needs prompt medical attention',
    bg: 'bg-yellow-50',
    border: 'border-yellow-300',
    textColor: 'text-yellow-900',
    icon: Clock,
    action: 'Schedule a same-day urgent care or clinic appointment. Monitor symptoms closely.',
    timeframe: 'Within 24 hours',
  },
  GREEN: {
    label: '🟢 Low Urgency — Self-Care at Home',
    sublabel: 'Symptoms manageable without immediate care',
    bg: 'bg-green-50',
    border: 'border-green-300',
    textColor: 'text-green-900',
    icon: Home,
    action: 'Rest, stay hydrated, and monitor symptoms. Schedule a routine appointment if symptoms persist beyond 3 days.',
    timeframe: 'Routine appointment within 3–5 days if not improving',
  },
};

function getTriageCode(riskScore: number): TriageCode {
  if (riskScore >= 70) return 'RED';
  if (riskScore >= 35) return 'YELLOW';
  return 'GREEN';
}

export default function RiskAnalysisEnhanced() {
  const navigate = useNavigate();
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [expandedCondition, setExpandedCondition] = useState<number | null>(null);
  const [patientInput, setPatientInput] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('patientInput');
    if (stored) setPatientInput(JSON.parse(stored));
  }, []);

  // Demo data
  const riskLevel = 'HIGH';
  const riskScore = 87;
  const triageCode = getTriageCode(riskScore);
  const triageConfig = TRIAGE_CONFIG[triageCode];

  const conditions: Condition[] = [
    {
      name: 'Acute Myocardial Infarction (Heart Attack)',
      probability: 78,
      evidence: [
        'Severe chest pain with radiation to left arm',
        'Associated shortness of breath and diaphoresis',
        'Patient age (45) and cardiovascular risk factors',
        'Symptoms duration exceeds 20 minutes',
        'Pain described as crushing/pressure-like'
      ]
    },
    {
      name: 'Angina Pectoris',
      probability: 65,
      evidence: [
        'Chest discomfort pattern consistent with cardiac origin',
        'Patient history of hypertension',
        'Pain characteristics match typical angina presentation'
      ]
    },
    {
      name: 'Pulmonary Embolism',
      probability: 42,
      evidence: [
        'Acute onset of shortness of breath',
        'Chest pain present',
        'Need to rule out PE in differential diagnosis'
      ]
    },
    {
      name: 'Pneumothorax',
      probability: 28,
      evidence: [
        'Sudden onset chest pain',
        'Breathing difficulty reported',
        'Less likely given symptom pattern but warrants consideration'
      ]
    }
  ];

  const redFlags = [
    'Severe chest pain with radiation to arm',
    'Shortness of breath at rest',
    'Elevated cardiovascular risk profile',
    'Symptoms lasting > 20 minutes'
  ];

  const recommendedTests = [
    {
      name: 'ECG (12-lead electrocardiogram)',
      reason: 'Essential for detecting acute myocardial infarction and other cardiac abnormalities',
      priority: 'Immediate'
    },
    {
      name: 'Troponin I blood test',
      reason: 'Cardiac biomarker to confirm myocardial damage',
      priority: 'Immediate'
    },
    {
      name: 'Chest X-ray',
      reason: 'To evaluate lung fields and rule out pulmonary causes',
      priority: 'Urgent'
    },
    {
      name: 'Complete Blood Count (CBC)',
      reason: 'Assess for anemia or infection that may contribute to symptoms',
      priority: 'Standard'
    },
    {
      name: 'D-dimer test',
      reason: 'If pulmonary embolism is suspected based on clinical presentation',
      priority: 'As needed'
    }
  ];

  const getRiskColor = (score: number) => {
    if (score >= 70) return 'from-red-500 to-red-600';
    if (score >= 40) return 'from-orange-500 to-orange-600';
    return 'from-green-500 to-green-600';
  };

  const getRiskBadgeVariant = (risk: string): "destructive" | "default" | "secondary" => {
    switch (risk) {
      case 'HIGH': return 'destructive';
      case 'MEDIUM': return 'default';
      case 'LOW': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Risk Analysis Results
            </h1>
            <p className="text-slate-600">
              AI-powered assessment completed • Patient ID: {patientInput?.patientId || 'PT-0045'}
            </p>
          </div>

          {/* ====== TRIAGE COLOR CODE BANNER ====== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className={`mb-6 p-5 rounded-2xl border-2 ${triageConfig.bg} ${triageConfig.border}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className={`text-xl font-bold mb-1 ${triageConfig.textColor}`}>
                  {triageConfig.label}
                </div>
                <div className={`text-sm font-medium mb-2 opacity-80 ${triageConfig.textColor}`}>
                  {triageConfig.sublabel}
                </div>
                <div className={`text-sm leading-relaxed ${triageConfig.textColor}`}>
                  <strong>What to do:</strong> {triageConfig.action}
                </div>
                <div className={`text-xs mt-2 opacity-70 ${triageConfig.textColor}`}>
                  ⏱ Recommended timeframe: {triageConfig.timeframe}
                </div>
              </div>
              {triageCode === 'RED' && (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl flex-shrink-0 text-base"
                  onClick={() => setShowEmergencyModal(true)}
                >
                  <Siren className="w-5 h-5 mr-2" />
                  Emergency
                </Button>
              )}
            </div>
          </motion.div>

          {/* Patient input summary (body map / images if present) */}
          {patientInput && (patientInput.bodyRegions?.length > 0 || patientInput.hasImages) && (
            <div className="flex gap-3 mb-6 flex-wrap">
              {patientInput.bodyRegions?.length > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
                  <MapPin className="w-4 h-4" />
                  <span>Symptom locations: <strong>{patientInput.bodyRegions.join(', ')}</strong></span>
                </div>
              )}
              {patientInput.hasImages && (
                <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-xl text-sm text-purple-700">
                  <Camera className="w-4 h-4" />
                  <span><strong>{patientInput.imageCount} image{patientInput.imageCount !== 1 ? 's' : ''}</strong> analyzed by AI Vision</span>
                </div>
              )}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            {/* Risk Score Gauge */}
            <Card className="lg:col-span-1 p-8 rounded-xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
              <div className="relative w-48 h-48 mb-4">
                {/* Circular gauge background */}
                <svg className="transform -rotate-90 w-48 h-48">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="#e2e8f0"
                    strokeWidth="16"
                    fill="none"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="url(#gradient)"
                    strokeWidth="16"
                    fill="none"
                    strokeDasharray={`${(riskScore / 100) * 502.65} 502.65`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" className="text-red-500" stopColor="currentColor" />
                      <stop offset="100%" className="text-red-600" stopColor="currentColor" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-slate-900">{riskScore}</div>
                  <div className="text-sm text-slate-600">Risk Score</div>
                </div>
              </div>

              <Badge variant={getRiskBadgeVariant(riskLevel)} className="text-lg px-6 py-2 mb-2">
                {riskLevel} RISK
              </Badge>
              <p className="text-sm text-center text-slate-600">
                Immediate medical attention required
              </p>
            </Card>

            {/* Alert Actions */}
            <Card className="lg:col-span-2 p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4">AI Alerts & Recommendations</h3>

              <div className="space-y-3">
                {/* Urgent Alert */}
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-red-900">⚠️ Urgent - Likely Severe Condition</div>
                        <div className="text-sm text-red-800 mt-1">
                          Patient exhibits critical symptoms requiring immediate intervention
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white ml-4"
                        onClick={() => setShowEmergencyModal(true)}
                      >
                        Emergency
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Teleconsult Recommendation */}
                <Alert className="border-blue-200 bg-blue-50">
                  <Info className="h-5 w-5 text-blue-600" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-blue-900">🟢 Teleconsultation Available</div>
                        <div className="text-sm text-blue-800 mt-1">
                          Connect with a specialist immediately for remote assessment
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-blue-300 text-blue-700 ml-4"
                      >
                        Start Call
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Review History */}
                <Alert className="border-yellow-200 bg-yellow-50">
                  <FileText className="h-5 w-5 text-yellow-600" />
                  <AlertDescription>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-semibold text-yellow-900">🟡 Review Patient History</div>
                        <div className="text-sm text-yellow-800 mt-1">
                          Patient has relevant medical history that may impact diagnosis
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-yellow-300 text-yellow-700 ml-4"
                        onClick={() => navigate('/patient-history/PT-0045')}
                      >
                        View History
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          </div>

          {/* Red Flags */}
          {redFlags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <AlertDescription>
                  <div className="font-semibold text-red-900 mb-2">Red Flags Detected</div>
                  <ul className="space-y-1">
                    {redFlags.map((flag, index) => (
                      <li key={index} className="text-sm text-red-800">
                        • {flag}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Possible Conditions with Evidence */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Possible Conditions
                </h3>
                <div className="space-y-3">
                  {conditions.map((condition, index) => (
                    <Collapsible
                      key={index}
                      open={expandedCondition === index}
                      onOpenChange={(open) => setExpandedCondition(open ? index : null)}
                    >
                      <div className="border border-slate-200 rounded-lg overflow-hidden">
                        <div className="p-3 bg-slate-50">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-slate-700 flex-1">
                              {condition.name}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 ml-2">
                              {condition.probability}%
                            </span>
                          </div>
                          <Progress value={condition.probability} className="h-2 mb-2" />

                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full justify-between text-blue-600 hover:text-blue-700 h-auto py-1"
                            >
                              <span className="text-xs">
                                {expandedCondition === index ? 'Hide' : 'Show'} Evidence
                              </span>
                              {expandedCondition === index ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                        </div>

                        <CollapsibleContent>
                          <div className="p-3 bg-white">
                            <div className="text-xs font-semibold text-slate-600 mb-2">
                              Clinical Evidence:
                            </div>
                            <ul className="space-y-1">
                              {condition.evidence.map((item, idx) => (
                                <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                  <span className="text-blue-600 mt-0.5">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* AI Test Recommendation Wizard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6 rounded-xl border border-slate-200 shadow-sm h-full">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Recommended Tests
                </h3>
                <div className="space-y-3">
                  {recommendedTests.map((test, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-sm font-medium text-slate-700">{test.name}</span>
                            <Badge
                              variant={test.priority === 'Immediate' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {test.priority}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            <span className="font-semibold">Why: </span>
                            {test.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex gap-4"
          >
            <Button
              onClick={() => navigate('/soap-report')}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-xl"
            >
              Generate Clinical Report
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="px-8 py-6 rounded-xl"
            >
              View Dashboard
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <EmergencyModal open={showEmergencyModal} onClose={() => setShowEmergencyModal(false)} />
    </div>
  );
}
