import { useParams, useNavigate, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { AlertTriangle, Activity, FileText, ArrowLeft, TrendingUp, Clock, Pill } from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { AIConfidenceMeter } from '../components/AIConfidenceMeter';
import type { AIResult } from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';

const PROB_MAP: Record<string, number> = { High: 75, Medium: 50, Low: 20 };
const TRIAGE_TO_RISK: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
  RED: 'HIGH', YELLOW: 'MEDIUM', GREEN: 'LOW',
};

export default function PatientRiskResultPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const stored = patientId ? sessionStorage.getItem(patientId) : null;
  const data: { result: AIResult; symptoms: string; age: string; gender: string } | null =
    stored ? JSON.parse(stored) : null;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600 dark:text-slate-400">No assessment data found.</p>
        <Link to="/patient/symptom">
          <Button>Start New Analysis</Button>
        </Link>
      </div>
    );
  }

  const { result, symptoms, age, gender } = data;
  const riskLevel = TRIAGE_TO_RISK[result.triage.color] ?? 'MEDIUM';
  const riskScore = result.triage.urgency_score * 10;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/nirog-logo.png" alt="Nirog Ai" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to="/patient/symptom">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Analysis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            AI Risk Assessment Complete
          </h2>
          {(age || gender) && (
            <p className="text-slate-500 dark:text-slate-400">
              Patient: {gender && <span className="capitalize">{gender}</span>}
              {age && gender && ', '}{age && <span>Age {age}</span>}
            </p>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Gauge */}
          <Card className="lg:col-span-1 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-center">Triage Result</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-48 h-48 mb-4">
                <svg className="transform -rotate-90" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="20" className="text-slate-200 dark:text-slate-800" />
                  <circle
                    cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="20"
                    strokeDasharray={`${(riskScore / 100) * 502.4} 502.4`}
                    className={riskLevel === 'HIGH' ? 'text-red-500' : riskLevel === 'MEDIUM' ? 'text-yellow-500' : 'text-emerald-500'}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-bold text-slate-900 dark:text-white">{riskScore}</span>
                  <span className="text-sm text-slate-500">/ 100</span>
                </div>
              </div>
              <RiskBadge level={riskLevel} size="lg" />
              <div className="w-full mt-4">
                <AIConfidenceMeter score={result.triage.urgency_score * 10} />
              </div>
              <p className="text-sm text-center text-slate-600 dark:text-slate-400 mt-3 px-2">
                {result.triage.label} — {result.triage.reason}
              </p>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Possible Conditions (Ranked by Probability)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.conditions.map((condition, index) => {
                const prob = PROB_MAP[condition.probability] ?? 30;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-slate-900 dark:text-white">
                          {index + 1}. {condition.name}
                        </span>
                        <span className="ml-2 text-xs text-slate-400">{condition.icd_code}</span>
                      </div>
                      <Badge variant={prob >= 70 ? 'destructive' : prob >= 50 ? 'default' : 'outline'}>
                        {condition.probability}
                      </Badge>
                    </div>
                    <div className="relative">
                      <Progress value={prob} className="h-2" />
                      <div
                        className={`absolute top-0 left-0 h-2 rounded-full transition-all ${prob >= 70 ? 'bg-red-500' : prob >= 50 ? 'bg-yellow-500' : 'bg-blue-500'}`}
                        style={{ width: `${prob}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Red Flags */}
        {result.red_flags.length > 0 && (
          <Card className="mb-6 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                Red Flag Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.red_flags.map((flag, i) => (
                  <li key={i} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{flag}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* SOAP Note */}
        <Card className="mb-6 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              Clinical SOAP Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(['subjective', 'objective', 'assessment', 'plan'] as const).map(key => (
              <div key={key} className="border-l-4 border-teal-200 pl-4">
                <h4 className="font-semibold text-slate-700 dark:text-slate-300 capitalize mb-1 text-sm">
                  {key === 'subjective' ? 'S — Subjective' : key === 'objective' ? 'O — Objective' : key === 'assessment' ? 'A — Assessment' : 'P — Plan'}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {result.soap_note[key]}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Drug Interactions */}
        {result.drug_interactions.length > 0 && (
          <Card className="mb-6 border-orange-200 dark:border-orange-900 bg-orange-50 dark:bg-orange-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Pill className="w-5 h-5" />
                Drug Interaction Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.drug_interactions.map((interaction, i) => (
                  <li key={i} className="text-sm text-orange-800 dark:text-orange-300">{interaction}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
            onClick={() => navigate(`/patient/report/${patientId}`)}
          >
            <FileText className="w-5 h-5 mr-2" />
            View Full SOAP Report
          </Button>
          <Button size="lg" variant="outline" className="flex-1" onClick={() => navigate('/patient/symptom')}>
            Start New Analysis
          </Button>
        </div>

        <Card className="mt-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              Want to track your health over time?
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Sign up for the Doctor Dashboard to track cases, history, and advanced analytics
            </p>
            <Link to="/register">
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                Explore Doctor Dashboard
              </Button>
            </Link>
          </CardContent>
        </Card>

        <p className="text-xs text-slate-400 text-center mt-6">{result.disclaimer}</p>
      </main>
    </div>
  );
}