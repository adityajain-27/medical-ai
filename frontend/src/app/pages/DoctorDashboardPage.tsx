import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { DashboardLayout } from '../components/DashboardLayout';
import {
  Users,
  AlertTriangle,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDoctorStats, getDoctorPatients } from '../services/api';

interface DoctorStats {
  totalAssessments: number;
  totalPatients: number;
  recentAssessments: number;
  avgUrgencyScore: number | null;
  triageBreakdown: { RED: number; YELLOW: number; GREEN: number };
  topConditions: Array<{ name: string; count: number }>;
}

interface PatientSummary {
  _id: string;
  patientId: string;
  name: string;
  age: number;
  gender: string;
  email?: string;
  totalAnalyses: number;
  latestTriage: { color: string; label: string; urgency_score?: number } | null;
  lastVisit: string | null;
  lastSymptoms: string | null;
}

export default function DoctorDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [patients, setPatients] = useState<PatientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      getDoctorStats(token),
      getDoctorPatients(token),
    ])
      .then(([s, p]) => { setStats(s); setPatients(p); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      </DashboardLayout>
    );
  }

  const highRiskCount = stats?.triageBreakdown.RED || 0;
  const recentPatients = patients.slice(0, 4);

  const getRiskLevel = (color: string | undefined) => {
    if (color === 'RED') return 'HIGH';
    if (color === 'YELLOW') return 'MEDIUM';
    return 'LOW';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Welcome back, {user?.name || 'Doctor'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Patients */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Patients</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalPatients || 0}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">High-Risk (RED)</p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">{highRiskCount}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-950 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Assessments</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalAssessments || 0}</p>
                </div>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-950 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Urgency</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {stats?.avgUrgencyScore ?? '—'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {stats?.topConditions && stats.topConditions.length > 0 && (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader>
              <CardTitle>Top Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.topConditions.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">{c.name}</span>
                    <Badge variant="secondary">{c.count} cases</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Patients</CardTitle>
              <Link to="/doctor/patients">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentPatients.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                No patients yet. Add patients from the Patients section to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {recentPatients.map((patient) => {
                  const risk = getRiskLevel(patient.latestTriage?.color);
                  return (
                    <Link
                      key={patient._id}
                      to={`/doctor/patient/${patient._id}`}
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <p className="font-semibold text-slate-900 dark:text-white">{patient.name}</p>
                          <span className="text-xs text-slate-400 font-mono">{patient.patientId}</span>
                          <Badge variant={risk === 'HIGH' ? 'destructive' : risk === 'MEDIUM' ? 'default' : 'secondary'}>
                            {risk}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {patient.age}y · <span className="capitalize">{patient.gender}</span> · {patient.totalAnalyses} analyse{patient.totalAnalyses !== 1 ? 's' : ''} · Last: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'No analysis yet'}
                        </p>
                        {patient.lastSymptoms && (
                          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1 line-clamp-1 italic">
                            "{patient.lastSymptoms}"
                          </p>
                        )}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-slate-400" />
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
