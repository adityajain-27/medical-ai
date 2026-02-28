import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, Clock, TrendingUp, Users, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { RiskBadge } from '../components/RiskBadge';
import { mockPatients, RiskLevel } from '../data/mockData';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');

  // Filter patients
  const filteredPatients = mockPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || patient.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  // Stats
  const stats = {
    total: mockPatients.length,
    high: mockPatients.filter(p => p.riskLevel === 'HIGH').length,
    medium: mockPatients.filter(p => p.riskLevel === 'MEDIUM').length,
    low: mockPatients.filter(p => p.riskLevel === 'LOW').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] to-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600">
              Patient triage and monitoring • {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Button
            onClick={() => navigate('/symptom-input')}
            className="bg-[#3B82F6] hover:bg-[#2563EB] text-white"
          >
            <Activity className="w-5 h-5 mr-2" />
            New Patient Analysis
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="shadow-lg border-2 border-[#3B82F6]/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#3B82F6]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#EF4444]/20 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setRiskFilter('HIGH')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">High Risk</p>
                  <p className="text-3xl font-bold text-[#EF4444]">{stats.high}</p>
                </div>
                <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#EF4444]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#F59E0B]/20 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setRiskFilter('MEDIUM')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Medium Risk</p>
                  <p className="text-3xl font-bold text-[#F59E0B]">{stats.medium}</p>
                </div>
                <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#F59E0B]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-2 border-[#10B981]/20 cursor-pointer hover:shadow-xl transition-shadow"
                onClick={() => setRiskFilter('LOW')}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Low Risk</p>
                  <p className="text-3xl font-bold text-[#10B981]">{stats.low}</p>
                </div>
                <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-[#10B981]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search by patient name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={riskFilter === 'ALL' ? 'default' : 'outline'}
                  onClick={() => setRiskFilter('ALL')}
                  className={riskFilter === 'ALL' ? 'bg-[#3B82F6]' : ''}
                >
                  All
                </Button>
                <Button
                  variant={riskFilter === 'HIGH' ? 'default' : 'outline'}
                  onClick={() => setRiskFilter('HIGH')}
                  className={riskFilter === 'HIGH' ? 'bg-[#EF4444] hover:bg-[#DC2626]' : ''}
                >
                  High
                </Button>
                <Button
                  variant={riskFilter === 'MEDIUM' ? 'default' : 'outline'}
                  onClick={() => setRiskFilter('MEDIUM')}
                  className={riskFilter === 'MEDIUM' ? 'bg-[#F59E0B] hover:bg-[#D97706]' : ''}
                >
                  Medium
                </Button>
                <Button
                  variant={riskFilter === 'LOW' ? 'default' : 'outline'}
                  onClick={() => setRiskFilter('LOW')}
                  className={riskFilter === 'LOW' ? 'bg-[#10B981] hover:bg-[#059669]' : ''}
                >
                  Low
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient List */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#3B82F6]" />
              Patient List ({filteredPatients.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No patients found matching your criteria
                </div>
              ) : (
                filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => navigate(`/patient-history/${patient.id}`)}
                    className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md hover:border-[#3B82F6]/30 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white
                        ${patient.riskLevel === 'HIGH' ? 'bg-[#EF4444]' : 
                          patient.riskLevel === 'MEDIUM' ? 'bg-[#F59E0B]' : 'bg-[#10B981]'}`}
                      >
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                          <RiskBadge level={patient.riskLevel} size="sm" />
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>ID: {patient.id}</span>
                          <span>•</span>
                          <span>{patient.age}y, {patient.gender}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {patient.lastVisit}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/risk-analysis/${patient.id}`);
                        }}
                        className="text-[#3B82F6] hover:text-[#2563EB] hover:bg-[#EFF6FF]"
                      >
                        View Report →
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
