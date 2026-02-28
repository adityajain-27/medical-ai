import { useNavigate, useParams } from 'react-router';
import { Clock, TrendingUp, AlertCircle, Activity, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { RiskBadge } from '../components/RiskBadge';
import { mockPatients, mockHealthTimeline, riskTrendData } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function PatientHistoryPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();

  // Find patient by ID or default to first patient
  const patient = mockPatients.find(p => p.id === patientId) || mockPatients[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] to-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient History Timeline</h1>
            <p className="text-gray-600">
              Complete medical history and risk progression analysis
            </p>
          </div>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Patient Info Card */}
        <Card className="shadow-lg border-2 border-[#3B82F6]/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl text-white
                  ${patient.riskLevel === 'HIGH' ? 'bg-[#EF4444]' : 
                    patient.riskLevel === 'MEDIUM' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                >
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{patient.name}</h2>
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>Patient ID: {patient.id}</span>
                    <span>•</span>
                    <span>{patient.age} years old</span>
                    <span>•</span>
                    <span>{patient.gender}</span>
                  </div>
                </div>
              </div>
              <RiskBadge level={patient.riskLevel} size="lg" />
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#3B82F6]" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Last Visit</p>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-gray-900">{patient.lastVisit}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Current Symptoms</p>
                <p className="text-gray-900">{patient.symptoms}</p>
              </div>
            </div>
            {patient.conditions && patient.conditions.length > 0 && (
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600 mb-2">Primary Concern</p>
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                  <span className="font-semibold text-gray-900">{patient.conditions[0].name}</span>
                  <span className="text-[#3B82F6]">({patient.conditions[0].probability}% probability)</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Risk Trend Graph */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#3B82F6]" />
              Risk Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={riskTrendData}>
                  <defs>
                    <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="date" 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis 
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    fill="url(#riskGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#D1FAE5] border-2 border-[#10B981] rounded-full" />
                <span className="text-gray-600">Low Risk (0-30)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FEF3C7] border-2 border-[#F59E0B] rounded-full" />
                <span className="text-gray-600">Medium Risk (31-60)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FEE2E2] border-2 border-[#EF4444] rounded-full" />
                <span className="text-gray-600">High Risk (61-100)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Timeline */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#3B82F6]" />
              Chronological Health Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockHealthTimeline.map((entry, index) => (
                <div key={index} className="relative">
                  {/* Timeline line */}
                  {index !== mockHealthTimeline.length - 1 && (
                    <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-gray-200" />
                  )}
                  
                  <div className="flex gap-4">
                    {/* Date marker */}
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-white shadow-md
                        ${entry.riskLevel === 'HIGH' ? 'bg-[#EF4444]' : 
                          entry.riskLevel === 'MEDIUM' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                      >
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    
                    {/* Entry content */}
                    <div className="flex-1 pb-6">
                      <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-900">
                            {new Date(entry.date).toLocaleDateString('en-US', { 
                              month: 'long', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </span>
                          <RiskBadge level={entry.riskLevel} size="sm" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-1">{entry.condition}</h4>
                        <p className="text-sm text-gray-600">{entry.symptoms}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Repeat Symptom Alert */}
            {patient.riskLevel === 'HIGH' && (
              <div className="mt-6 p-4 bg-[#FEF3C7] border border-[#F59E0B] rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">Repeat Symptom Alert</p>
                    <p className="text-sm text-gray-700">
                      Patient has shown recurring high-risk symptoms. Consider comprehensive evaluation 
                      and long-term monitoring plan.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={() => navigate(`/soap-report/${patient.id}`)}
            className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white h-12"
          >
            <FileText className="w-5 h-5 mr-2" />
            View Clinical Report
          </Button>
          <Button
            onClick={() => navigate(`/risk-analysis/${patient.id}`)}
            variant="outline"
            className="flex-1 h-12"
          >
            View Risk Analysis
          </Button>
        </div>
      </div>
    </div>
  );
}
