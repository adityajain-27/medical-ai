import { useParams, Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Activity, Download, Copy, ArrowLeft, TrendingUp } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { RiskBadge } from '../components/RiskBadge';
import { toast } from 'sonner';
import type { AIResult } from '../services/api';
import { ThemeToggle } from '../components/ThemeToggle';

const TRIAGE_TO_RISK: Record<string, 'HIGH' | 'MEDIUM' | 'LOW'> = {
  RED: 'HIGH', YELLOW: 'MEDIUM', GREEN: 'LOW',
};

export default function PatientFreeReportPage() {
  const { patientId } = useParams();

  const stored = patientId ? sessionStorage.getItem(patientId) : null;
  const data: { result: AIResult; symptoms: string; age: string; gender: string } | null =
    stored ? JSON.parse(stored) : null;

  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-600 dark:text-slate-400">No report found. Please run a new analysis.</p>
        <Link to="/patient/symptom">
          <Button>Start New Analysis</Button>
        </Link>
      </div>
    );
  }

  const { result, age, gender } = data;
  const riskLevel = TRIAGE_TO_RISK[result.triage.color] ?? 'MEDIUM';
  const generatedAt = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const handleCopy = () => {
    const reportText = `
NIROG AI — CLINICAL SOAP REPORT
Generated: ${generatedAt}
Triage: ${result.triage.label}

SUBJECTIVE:
${result.soap_note.subjective}

OBJECTIVE:
${result.soap_note.objective}

ASSESSMENT:
${result.soap_note.assessment}

PLAN:
${result.soap_note.plan}

CONDITIONS:
${result.conditions.map((c, i) => `${i + 1}. ${c.name} (${c.icd_code}) — ${c.probability}`).join('\n')}

RED FLAGS:
${result.red_flags.join('\n') || 'None'}

${result.disclaimer}
    `.trim();
    navigator.clipboard.writeText(reportText);
    toast.success('Report copied to clipboard!');
  };

  const handleDownload = () => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const lineW = pageW - margin * 2;
    let y = 20;

    const addText = (text: string, size = 10, bold = false, color = '#1e293b') => {
      doc.setFontSize(size);
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setTextColor(color);
      const lines = doc.splitTextToSize(text, lineW);
      if (y + lines.length * (size * 0.4) > 270) { doc.addPage(); y = 20; }
      doc.text(lines, margin, y);
      y += lines.length * (size * 0.45) + 2;
    };

    const addSection = (letter: string, title: string, content: string, hex: string) => {
      y += 4;
      doc.setFillColor(hex);
      doc.roundedRect(margin, y - 5, lineW, 8, 2, 2, 'F');
      addText(`${letter} — ${title}`, 11, true, '#ffffff');
      y += 2;
      addText(content, 10, false, '#334155');
    };

    // Header
    doc.setFillColor('#0f766e');
    doc.rect(0, 0, pageW, 18, 'F');
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor('#ffffff');
    doc.text('Nirog Ai — Clinical SOAP Report', margin, 12);
    y = 28;

    addText(`Generated: ${generatedAt}`, 9, false, '#64748b');
    addText(`Triage: ${result.triage.label}  •  Risk Level: ${riskLevel}  •  Urgency Score: ${result.triage.urgency_score}/10`, 9, false, '#64748b');
    if (age || gender) addText(`Patient: ${gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : ''}${age ? `, Age ${age}` : ''}`, 9, false, '#64748b');
    y += 3;

    addSection('S', 'Subjective', result.soap_note.subjective, '#3b82f6');
    addSection('O', 'Objective', result.soap_note.objective, '#0d9488');
    addSection('A', 'Assessment', result.soap_note.assessment, '#7c3aed');
    addSection('P', 'Plan', result.soap_note.plan, '#059669');

    y += 6;
    addText('Differential Diagnosis', 12, true, '#1e293b');
    result.conditions.forEach((c, i) => {
      addText(`${i + 1}. ${c.name}  (${c.icd_code})  — ${c.probability}`, 10, false, '#334155');
    });

    if (result.red_flags.length > 0) {
      y += 4;
      addText('⚠ Red Flag Warnings', 11, true, '#dc2626');
      result.red_flags.forEach(f => addText(`• ${f}`, 10, false, '#b91c1c'));
    }

    if (result.drug_interactions.length > 0) {
      y += 4;
      addText('Drug Interaction Warnings', 11, true, '#d97706');
      result.drug_interactions.forEach(d => addText(`• ${d}`, 10, false, '#92400e'));
    }

    y += 6;
    doc.setDrawColor('#e2e8f0');
    doc.line(margin, y, pageW - margin, y);
    y += 4;
    addText(result.disclaimer, 8, false, '#94a3b8');

    doc.save(`NirogAi-SOAP-Report-${new Date().toISOString().slice(0, 10)}.pdf`);
    toast.success('PDF downloaded!');
  };

  const soapSections = [
    { key: 'subjective' as const, label: 'S — Subjective', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/20' },
    { key: 'objective' as const, label: 'O — Objective', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-50 dark:bg-teal-950/20' },
    { key: 'assessment' as const, label: 'A — Assessment', color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/20' },
    { key: 'plan' as const, label: 'P — Plan', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src="/nirog-logo.png" alt="Nirog Ai" className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link to={`/patient/risk/${patientId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Analysis
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">Your Clinical SOAP Report</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            AI-generated clinical summary in doctor-standard format
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Button onClick={handleCopy} variant="outline" className="flex items-center gap-2">
            <Copy className="w-4 h-4" /> Copy Full Report
          </Button>
          <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" /> Download PDF
          </Button>
        </div>

        <Card className="mb-6 border-slate-200 dark:border-slate-800">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                  AI Clinical Assessment
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {gender && <span className="capitalize">{gender}</span>}
                  {age && gender && ', '}
                  {age && <span>Age {age}</span>}
                </p>
                <p className="text-xs text-slate-400 mt-1">Generated: {generatedAt}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <RiskBadge level={riskLevel} size="lg" />
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{result.triage.label}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5 mb-8">
          {soapSections.map(({ key, label, color, bg }) => (
            <Card key={key} className="border-slate-200 dark:border-slate-800">
              <CardHeader className={`${bg} rounded-t-lg py-3 px-6`}>
                <CardTitle className={`${color} text-lg`}>{label}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {result.soap_note[key]}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mb-6 border-slate-200 dark:border-slate-800">
          <CardHeader>
            <CardTitle>Differential Diagnosis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">#</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">Condition</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">ICD-10 Code</th>
                    <th className="text-left py-2 px-3 text-slate-500 font-medium">Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {result.conditions.map((c, i) => (
                    <tr key={i} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900">
                      <td className="py-2 px-3 text-slate-400">{i + 1}</td>
                      <td className="py-2 px-3 font-medium text-slate-900 dark:text-white">{c.name}</td>
                      <td className="py-2 px-3 font-mono text-slate-500">{c.icd_code}</td>
                      <td className="py-2 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.probability === 'High' ? 'bg-red-100 text-red-700' :
                          c.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>{c.probability}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-8 border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardContent className="p-8 text-center">
            <TrendingUp className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Upgrade to Doctor Dashboard</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Access full patient tracking, history timeline, advanced analytics, and multi-session management.
            </p>
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                Get Started
              </Button>
            </Link>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">{result.disclaimer}</p>
        </div>
      </main>
    </div>
  );
}
