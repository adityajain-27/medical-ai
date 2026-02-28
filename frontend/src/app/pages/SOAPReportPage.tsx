import { useNavigate, useParams } from 'react-router';
import { Copy, Download, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RiskBadge } from '../components/RiskBadge';
import { mockPatients } from '../data/mockData';
import { toast } from 'sonner';

export default function SOAPReportPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // Find patient by ID or default to first patient
  const patient = mockPatients.find(p => p.id === patientId) || mockPatients[0];

  const handleCopyToClipboard = () => {
    const soapText = `
SOAP NOTE - ${patient.name} (${patient.id})
Age: ${patient.age} | Gender: ${patient.gender}
Date: ${new Date().toLocaleDateString()}

SUBJECTIVE:
${patient.soapNote?.subjective || 'N/A'}

OBJECTIVE:
${patient.soapNote?.objective || 'N/A'}

ASSESSMENT:
${patient.soapNote?.assessment || 'N/A'}

PLAN:
${patient.soapNote?.plan || 'N/A'}
    `.trim();

    navigator.clipboard.writeText(soapText);
    toast.success('SOAP note copied to clipboard');
  };

  const handleDownloadPDF = () => {
    toast.success('PDF download initiated');
    // In a real app, this would generate and download a PDF
  };

  const handleSendToDashboard = () => {
    toast.success('Report sent to Doctor Dashboard');
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] to-white p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Generated Clinical Report</h1>
            <p className="text-gray-600">
              SOAP Note • Patient {patient.id}
            </p>
          </div>
          <RiskBadge level={patient.riskLevel} size="md" />
        </div>

        {/* Patient Info Card */}
        <Card className="shadow-lg border-2 border-[#3B82F6]/20">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Patient Name</p>
                <p className="font-semibold text-gray-900">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Patient ID</p>
                <p className="font-semibold text-gray-900">{patient.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Age / Gender</p>
                <p className="font-semibold text-gray-900">{patient.age}y / {patient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Report Date</p>
                <p className="font-semibold text-gray-900">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SOAP Note Sections */}
        <div className="space-y-4">
          {/* Subjective */}
          <Card className="shadow-lg">
            <CardHeader className="bg-[#EFF6FF]">
              <CardTitle className="flex items-center gap-2 text-[#3B82F6]">
                <div className="w-8 h-8 bg-[#3B82F6] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  S
                </div>
                Subjective
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {patient.soapNote?.subjective || 'No subjective data available'}
              </p>
            </CardContent>
          </Card>

          {/* Objective */}
          <Card className="shadow-lg">
            <CardHeader className="bg-[#D1FAE5]">
              <CardTitle className="flex items-center gap-2 text-[#10B981]">
                <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  O
                </div>
                Objective
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {patient.soapNote?.objective || 'No objective data available'}
              </p>
            </CardContent>
          </Card>

          {/* Assessment */}
          <Card className="shadow-lg">
            <CardHeader className="bg-[#FEF3C7]">
              <CardTitle className="flex items-center gap-2 text-[#F59E0B]">
                <div className="w-8 h-8 bg-[#F59E0B] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  A
                </div>
                Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                {patient.soapNote?.assessment || 'No assessment available'}
              </p>
              {patient.conditions && patient.conditions.length > 0 && (
                <div className="border-t pt-4 space-y-2">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Differential Diagnosis (by probability):
                  </p>
                  {patient.conditions.map((condition, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">• {condition.name}</span>
                      <span className="text-[#3B82F6] font-semibold">{condition.probability}%</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Plan */}
          <Card className="shadow-lg">
            <CardHeader className="bg-[#FEE2E2]">
              <CardTitle className="flex items-center gap-2 text-[#EF4444]">
                <div className="w-8 h-8 bg-[#EF4444] rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  P
                </div>
                Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-gray-700 leading-relaxed mb-4">
                {patient.soapNote?.plan || 'No plan available'}
              </p>
              {patient.recommendedTests && patient.recommendedTests.length > 0 && (
                <div className="border-t pt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">
                    Recommended Diagnostic Tests:
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {patient.recommendedTests.map((test, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-[#10B981]" />
                        {test}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* AI Disclosure */}
        <Card className="bg-[#EFF6FF] border-[#3B82F6]/20">
          <CardContent className="p-4">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">AI Disclosure:</span> This SOAP note was generated
              by Nirog Ai based on symptom analysis and clinical patterns. It should be
              reviewed and validated by a licensed healthcare professional before clinical use.
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <Button
            onClick={handleCopyToClipboard}
            variant="outline"
            className="h-12"
          >
            <Copy className="w-5 h-5 mr-2" />
            Copy to Clipboard
          </Button>

          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="h-12"
          >
            <Download className="w-5 h-5 mr-2" />
            Download as PDF
          </Button>

          <Button
            onClick={handleSendToDashboard}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white h-12"
          >
            <Send className="w-5 h-5 mr-2" />
            Send to Dashboard
          </Button>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <Button
            onClick={() => navigate(`/risk-analysis/${patient.id}`)}
            variant="ghost"
          >
            ← Back to Risk Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
