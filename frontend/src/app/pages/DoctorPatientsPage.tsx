import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../components/ui/dialog';
import { Search, Plus, Eye, Loader2, UserPlus, Trash2 } from 'lucide-react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const NODE_BASE_URL = 'http://localhost:5000';
function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

interface DoctorPatient {
  _id: string; patientId: string; name: string; age: number; gender: string;
  email?: string; phone?: string; totalAnalyses: number; status: string;
  latestTriage?: { color: string; label: string } | null;
  lastVisit?: string | null; createdAt: string;
}

const defaultForm = { name: '', age: '', gender: '', email: '', phone: '', medicalHistory: '', allergies: '', bloodGroup: '' };

export default function DoctorPatientsPage() {
  const { token } = useAuth();
  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [saving, setSaving] = useState(false);

  const fetchPatients = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${NODE_BASE_URL}/api/doctor/patients`, { headers: authHeaders(token) });
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch { toast.error('Failed to load patients'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPatients(); }, [token]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.age || !form.gender) { toast.error('Name, age and gender are required'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${NODE_BASE_URL}/api/doctor/patients`, {
        method: 'POST', headers: authHeaders(token!),
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.message); }
      toast.success('Patient added successfully!');
      setShowAddModal(false); setForm(defaultForm); fetchPatients();
    } catch (err: any) { toast.error(err.message || 'Failed to add patient'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Remove ${name} from your patient list?`)) return;
    try {
      await fetch(`${NODE_BASE_URL}/api/doctor/patients/${id}`, { method: 'DELETE', headers: authHeaders(token!) });
      toast.success('Patient removed');
      setPatients(p => p.filter(x => x._id !== id));
    } catch { toast.error('Failed to remove patient'); }
  };

  const getRisk = (color?: string | null) => {
    if (color === 'RED') return 'HIGH';
    if (color === 'YELLOW') return 'MEDIUM';
    if (color === 'GREEN') return 'LOW';
    return null;
  };

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Patients</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">{patients.length} patient{patients.length !== 1 ? 's' : ''} in your care</p>
          </div>
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 text-white" onClick={() => setShowAddModal(true)}>
            <UserPlus className="w-4 h-4 mr-2" /> Add Patient
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input placeholder="Search by name, patient ID or email..." className="pl-10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Age / Gender</TableHead>
                    <TableHead>Last Risk</TableHead>
                    <TableHead>Analyses</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                        {patients.length === 0 ? 'No patients yet. Click "Add Patient" to get started.' : 'No patients match your search.'}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map(patient => {
                      const risk = getRisk(patient.latestTriage?.color);
                      return (
                        <TableRow key={patient._id}>
                          <TableCell><code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono">{patient.patientId}</code></TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{patient.name}</p>
                              {patient.email && <p className="text-xs text-slate-500">{patient.email}</p>}
                            </div>
                          </TableCell>
                          <TableCell><p className="text-sm text-slate-700 dark:text-slate-300">{patient.age}y · <span className="capitalize">{patient.gender}</span></p></TableCell>
                          <TableCell>
                            {risk ? (
                              <Badge variant={risk === 'HIGH' ? 'destructive' : risk === 'MEDIUM' ? 'default' : 'secondary'}>{risk}</Badge>
                            ) : <span className="text-xs text-slate-400">Not analysed</span>}
                          </TableCell>
                          <TableCell><span className="text-sm text-slate-600 dark:text-slate-400">{patient.totalAnalyses}</span></TableCell>
                          <TableCell><span className="text-sm text-slate-500">{new Date(patient.createdAt).toLocaleDateString()}</span></TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Link to={`/doctor/patient/${patient._id}`}>
                                <Button variant="ghost" size="sm"><Eye className="w-4 h-4 mr-1" /> View</Button>
                              </Link>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                onClick={() => handleDelete(patient._id, patient.name)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle className="flex items-center gap-2"><UserPlus className="w-5 h-5 text-teal-500" /> Add New Patient</DialogTitle></DialogHeader>
            <form onSubmit={handleAdd} className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Full Name *</Label>
                  <Input placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Age *</Label>
                  <Input type="number" min={0} max={150} placeholder="35" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} required />
                </div>
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <Select value={form.gender} onValueChange={v => setForm(f => ({ ...f, gender: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="patient@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select value={form.bloodGroup} onValueChange={v => setForm(f => ({ ...f, bloodGroup: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {['A+', 'A−', 'B+', 'B−', 'O+', 'O−', 'AB+', 'AB−'].map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Allergies</Label>
                  <Input placeholder="Penicillin, latex..." value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Medical History</Label>
                  <Textarea placeholder="Diabetes, hypertension, previous surgeries..." className="resize-none" rows={3}
                    value={form.medicalHistory} onChange={e => setForm(f => ({ ...f, medicalHistory: e.target.value }))} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                <Button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                  {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Adding...</> : <><Plus className="w-4 h-4 mr-2" /> Add Patient</>}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
