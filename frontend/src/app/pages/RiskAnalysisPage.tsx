import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AlertTriangle, FileText, TrendingUp, Activity, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { RiskBadge } from '../components/RiskBadge';
import { EmergencyAlert } from '../components/EmergencyAlert';
import { mockPatients } from '../data/mockData';

export default function RiskAnalysisPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);

  // Find patient by ID or default to first patient
  const patient = mockPatients.find(p => p.id === patientId) || mockPatients[0];

  // Show emergency alert for HIGH risk patients
  useState(() => {
    if (patient.riskLevel === 'HIGH') {
      const timer = setTimeout(() => setShowEmergencyAlert(true), 500);
      return () => clearTimeout(timer);
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] to-white p-8">
      <EmergencyAlert
        isOpen={showEmergencyAlert}
        onClose={() => setShowEmergencyAlert(false)}
        patientName={patient.name}
        condition={patient.conditions?.[0]?.name}
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Risk Analysis Results</h1>
            <p className="text-gray-600">
              Patient {patient.id} • {patient.name} • {patient.age}y {patient.gender}
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Risk Assessment Card */}
        <Card className="shadow-lg border-2 border-[#3B82F6]/20">
          <CardContent className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Overall Risk Level</p>
                <RiskBadge level={patient.riskLevel} size="lg" />
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">AI Confidence Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-[#3B82F6]">
                    {patient.confidenceScore}%
                  </span>
                  <CheckCircle className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Presenting Symptoms:</span> {patient.symptoms}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Possible Conditions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
                Possible Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.conditions?.map((condition, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">{condition.name}</span>
                    <span className="text-sm font-semibold text-[#3B82F6]">
                      {condition.probability}%
                    </span>
                  </div>
                  <Progress value={condition.probability} className="h-2" />
                </div>
              ))}
              <div className="pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Probabilities based on symptom analysis and clinical data patterns
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Red Flags */}
          <Card className="shadow-lg border-2 border-[#EF4444]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#EF4444]">
                <AlertTriangle className="w-5 h-5" />
                Red Flags Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              {patient.redFlags && patient.redFlags.length > 0 ? (
                <ul className="space-y-3">
                  {patient.redFlags.map((flag, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{flag}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-2 text-[#10B981]">
                  <CheckCircle className="w-5 h-5" />
                  <span>No critical red flags identified</span>
                </div>
              )}
              
              {patient.redFlags && patient.redFlags.length > 0 && (
                <div className="mt-4 p-3 bg-[#FEE2E2] rounded-lg">
                  <p className="text-sm text-[#EF4444] font-medium">
                    ⚠ Urgent attention recommended
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recommended Tests */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#10B981]" />
              Recommended Diagnostic Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {patient.recommendedTests?.map((test, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-[#D1FAE5] border border-[#10B981]/20 rounded-lg"
                >
                  <CheckCircle className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900">{test}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-[#EFF6FF] rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-[#3B82F6]">Note:</span> Test recommendations 
                are based on current symptoms and clinical guidelines. Ordering physician should 
                use clinical judgment.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate(`/soap-report/${patient.id}`)}
            className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white h-12"
          >
            <FileText className="w-5 h-5 mr-2" />
            Generate Clinical Report
          </Button>
          <Button
            onClick={() => navigate('/symptom-input')}
            variant="outline"
            className="h-12"
          >
            New Patient Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
