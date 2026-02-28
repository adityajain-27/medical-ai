import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { FileText, Search, Loader2, AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const NODE_BASE_URL = 'http://localhost:5000';
function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

interface PatientRef { _id: string; name: string; age: number; gender: string; patientId: string; }
interface ReportItem {
  _id: string; symptoms: string;
  triage: { color: string; label: string; urgency_score?: number };
  conditions?: Array<{ name: string; probability: string; icd_code?: string }>;
  redFlags?: string[]; soapNote?: any; createdAt: string;
  doctorPatientId: PatientRef | null;
}
const TRIAGE_COLORS = {
  RED: 'bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-800',
  YELLOW: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-300 dark:border-yellow-800',
  GREEN: 'bg-green-50 dark:bg-green-950/20 border-green-300 dark:border-green-800',
};
const BADGE_VARIANT: Record<string, 'destructive' | 'default' | 'secondary'> = {
  RED: 'destructive', YELLOW: 'default', GREEN: 'secondary'
};

export default function DoctorReportsPage() {
  const { token } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'RED' | 'YELLOW' | 'GREEN'>('ALL');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch(`${NODE_BASE_URL}/api/doctor/assessments`, { headers: authHeaders(token) })
      .then(r => r.json())
      .then(data => setReports(Array.isArray(data) ? data : []))
      .catch(() => toast.error('Failed to load reports'))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = reports.filter(r => {
    const patient = r.doctorPatientId;
    const matchSearch = !search ||
      (patient?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (patient?.patientId || '').toLowerCase().includes(search.toLowerCase()) ||
      r.symptoms.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'ALL' || r.triage?.color === filter;
    return matchSearch && matchFilter;
  });

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Reports</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{reports.length} AI analyses across all patients</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search by patient, symptoms..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-2">
            {(['ALL', 'RED', 'YELLOW', 'GREEN'] as const).map(f => (
              <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)}
                className={filter === f && f !== 'ALL' ? (f === 'RED' ? 'bg-red-500 text-white' : f === 'YELLOW' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white') : ''}>
                {f === 'ALL' ? 'All' : f}
              </Button>
            ))}
          </div>
        </div>
        {filtered.length === 0 ? (
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="text-center py-16">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">{reports.length === 0 ? 'No reports yet. Run AI analyses from the Patients section.' : 'No reports match your search.'}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map(report => {
              const patient = report.doctorPatientId;
              const isOpen = expanded === report._id;
              const color = report.triage?.color || 'UNKNOWN';
              return (
                <Card key={report._id} className={`border-2 transition-all ${TRIAGE_COLORS[color as keyof typeof TRIAGE_COLORS] || 'border-slate-200 dark:border-slate-800'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge variant={BADGE_VARIANT[color] || 'secondary'}>
                            {color === 'RED' ? 'HIGH RISK' : color === 'YELLOW' ? 'MEDIUM RISK' : color === 'GREEN' ? 'LOW RISK' : color}
                          </Badge>
                          <Badge variant="outline" className="text-xs font-mono">{patient?.patientId || '—'}</Badge>
                          <span className="text-sm font-semibold text-slate-900 dark:text-white">{patient?.name || 'Unknown'}</span>
                          {patient && <span className="text-xs text-slate-500">{patient.age}y · {patient.gender}</span>}
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{report.symptoms}</p>
                        <p className="text-xs text-slate-400 mt-1">{new Date(report.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {report.triage?.urgency_score !== undefined && (
                          <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 dark:text-white">{report.triage.urgency_score}</p>
                            <p className="text-xs text-slate-400">score</p>
                          </div>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setExpanded(isOpen ? null : report._id)}>
                          {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                        {report.redFlags && report.redFlags.length > 0 && (
                          <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
                            <p className="text-xs font-semibold text-red-700 dark:text-red-400 flex items-center gap-1 mb-2">
                              <AlertTriangle className="w-3 h-3" /> Red Flags
                            </p>
                            <ul className="space-y-1">{report.redFlags.map((f, i) => <li key={i} className="text-xs text-red-700 dark:text-red-300">• {f}</li>)}</ul>
                          </div>
                        )}
                        {report.conditions && report.conditions.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Possible Conditions</p>
                            <div className="space-y-1">
                              {report.conditions.map((c, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <span className="text-sm text-slate-800 dark:text-slate-200">{i + 1}. {c.name}</span>
                                  <div className="flex items-center gap-1.5">
                                    {c.icd_code && <Badge variant="outline" className="text-xs font-mono">{c.icd_code}</Badge>}
                                    <Badge variant="secondary" className="text-xs">{c.probability}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {report.soapNote && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase mb-2">SOAP Note</p>
                            <div className="grid sm:grid-cols-2 gap-2">
                              {[
                                { key: 'subjective', label: 'S — Subjective', color: 'text-blue-600 dark:text-blue-400' },
                                { key: 'objective', label: 'O — Objective', color: 'text-green-600 dark:text-green-400' },
                                { key: 'assessment', label: 'A — Assessment', color: 'text-teal-600 dark:text-teal-400' },
                                { key: 'plan', label: 'P — Plan', color: 'text-purple-600 dark:text-purple-400' },
                              ].map(({ key, label, color }) => (
                                <div key={key} className="p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                                  <p className={`text-xs font-semibold ${color} mb-1`}>{label}</p>
                                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{(report.soapNote as any)[key]}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
