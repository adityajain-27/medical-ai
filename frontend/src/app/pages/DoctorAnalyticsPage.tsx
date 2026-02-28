import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getDoctorStats } from '../services/api';

interface DoctorStats {
  totalAssessments: number;
  totalPatients: number;
  recentAssessments: number;
  avgUrgencyScore: number | null;
  triageBreakdown: { RED: number; YELLOW: number; GREEN: number };
  topConditions: Array<{ name: string; count: number }>;
}

export default function DoctorAnalyticsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getDoctorStats(token)
      .then(setStats)
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

  const riskDistribution = stats ? [
    { name: 'High Risk (RED)', value: stats.triageBreakdown.RED, color: '#ef4444' },
    { name: 'Medium Risk (YELLOW)', value: stats.triageBreakdown.YELLOW, color: '#eab308' },
    { name: 'Low Risk (GREEN)', value: stats.triageBreakdown.GREEN, color: '#10b981' },
  ] : [];

  const conditionsData = stats?.topConditions || [];

  const emergencyRate = stats && stats.totalAssessments > 0
    ? Math.round((stats.triageBreakdown.RED / stats.totalAssessments) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Real-time insights from all patient assessments</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Assessments</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.totalAssessments || 0}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg. Urgency Score</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats?.avgUrgencyScore ?? '—'}</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Emergency Rate</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">{emergencyRate}%</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{stats?.triageBreakdown.RED || 0} RED triage cases</p>
            </CardContent>
          </Card>
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">This Week</p>
              <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">{stats?.recentAssessments || 0}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">assessments in last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>Risk Distribution</CardTitle></CardHeader>
            <CardContent>
              {riskDistribution.every(d => d.value === 0) ? (
                <div className="text-center py-16">
                  <p className="text-sm text-slate-500">No analyses run yet</p>
                  <p className="text-xs text-slate-400 mt-1">Run AI analyses for your patients to see risk distribution</p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={riskDistribution}
                        cx="50%" cy="50%"
                        outerRadius={90} innerRadius={40}
                        dataKey="value" paddingAngle={3}
                      >
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [value + ' cases', name]}
                        contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center gap-6 mt-2">
                    {riskDistribution.map(d => (
                      <div key={d.name} className="flex items-center gap-1.5 text-sm">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                        <span className="text-slate-600 dark:text-slate-400">{d.name.split(' ')[0]}</span>
                        <span className="font-bold text-slate-900 dark:text-white">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800">
            <CardHeader><CardTitle>Most Common Conditions</CardTitle></CardHeader>
            <CardContent>
              {conditionsData.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-16">No data yet</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={conditionsData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-800" />
                    <XAxis type="number" className="text-slate-600 dark:text-slate-400" />
                    <YAxis dataKey="name" type="category" width={120} className="text-slate-600 dark:text-slate-400" tick={{ fontSize: 12 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgb(255 255 255)', border: '1px solid rgb(226 232 240)', borderRadius: '8px' }} />
                    <Bar dataKey="count" fill="rgb(59 130 246)" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle>Triage Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800 text-center">
                <p className="text-4xl font-bold text-red-600 dark:text-red-400">{stats?.triageBreakdown.RED || 0}</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">RED — Emergency</p>
              </div>
              <div className="p-6 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200 dark:border-yellow-800 text-center">
                <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">{stats?.triageBreakdown.YELLOW || 0}</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">YELLOW — See Doctor</p>
              </div>
              <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800 text-center">
                <p className="text-4xl font-bold text-green-600 dark:text-green-400">{stats?.triageBreakdown.GREEN || 0}</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">GREEN — Self Care</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
