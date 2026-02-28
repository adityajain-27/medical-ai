import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mic, Loader2, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function SymptomInputPage() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    age: '',
    gender: '',
    symptoms: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      navigate('/risk-analysis/PT-2847');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] to-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Symptom Analysis</h1>
          <p className="text-gray-600">
            Enter patient information and symptoms for AI-powered triage and risk assessment
          </p>
        </div>

        {/* Analysis Card */}
        {isAnalyzing ? (
          <Card className="shadow-lg border-2 border-[#3B82F6]">
            <CardContent className="p-12">
              <div className="flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-[#EFF6FF] rounded-full flex items-center justify-center">
                    <Activity className="w-10 h-10 text-[#3B82F6] animate-pulse" />
                  </div>
                  <Loader2 className="w-24 h-24 text-[#3B82F6] animate-spin absolute -top-2 -left-2" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Analyzing Patient Data...
                  </h3>
                  <p className="text-gray-600">
                    AI is processing symptoms and generating risk assessment
                  </p>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>
                Complete the form below to begin AI-powered symptom analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient ID and Demographics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      placeholder="PT-XXXX"
                      value={formData.patientId}
                      onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="34"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                      required
                    >
                      <SelectTrigger>
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
                </div>

                {/* Symptom Description */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="symptoms">Symptom Description</Label>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-[#3B82F6] hover:bg-[#EFF6FF] rounded-lg transition-colors"
                      onClick={() => alert('Voice input feature would be enabled here')}
                    >
                      <Mic className="w-4 h-4" />
                      Voice Input
                    </button>
                  </div>
                  <Textarea
                    id="symptoms"
                    placeholder="Describe symptoms in natural language... e.g., 'Patient reports severe chest pain radiating to left arm, shortness of breath, started 45 minutes ago'"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    rows={8}
                    className="resize-none"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Be as detailed as possible. Include onset, duration, severity, and any associated symptoms.
                  </p>
                </div>

                {/* AI Features Info */}
                <div className="bg-[#EFF6FF] border border-[#3B82F6]/20 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-[#3B82F6]">AI Analysis Includes:</span>{' '}
                    Risk level classification, possible conditions ranking, red flag detection, 
                    recommended diagnostic tests, and automated SOAP note generation.
                  </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white h-12"
                  >
                    <Activity className="w-5 h-5 mr-2" />
                    Analyze with AI
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12"
                    onClick={() => navigate('/')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Quick Tips */}
        {!isAnalyzing && (
          <div className="mt-6 grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">✓ Good Example</h4>
              <p className="text-sm text-gray-600">
                "Severe chest pain radiating to left arm, shortness of breath, diaphoresis, started 45 minutes ago"
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 text-sm">✗ Poor Example</h4>
              <p className="text-sm text-gray-600">
                "Chest pain"
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
