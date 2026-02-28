import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Stethoscope, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

const POSITIONS = [
    'General Practitioner', 'Cardiologist', 'Neurologist', 'Orthopedic Surgeon',
    'Pediatrician', 'Dermatologist', 'Psychiatrist', 'Oncologist', 'Gastroenterologist',
    'Endocrinologist', 'Emergency Medicine', 'Radiologist', 'Anesthesiologist',
    'Urologist', 'Gynecologist', 'Ophthalmologist', 'ENT Specialist', 'Pulmonologist',
    'Rheumatologist', 'Other',
];

export default function DoctorRegisterPage() {
    const navigate = useNavigate();
    const { signup } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [position, setPosition] = useState('');
    const [qualification, setQualification] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email || !password || !confirm) { toast.error('Please fill in all required fields'); return; }
        if (password !== confirm) { toast.error('Passwords do not match'); return; }
        if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
        setLoading(true);
        try {
            await signup(name, email, password, 'doctor', { position, qualification });
            toast.success('Doctor account created! Welcome to your dashboard.');
            navigate('/doctor/dashboard');
        } catch (err: any) {
            toast.error(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50 flex items-start justify-center p-6 overflow-y-auto">
            <div className="w-full max-w-md my-8">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <img src="/nirog-logo.png" alt="Nirog AI" className="h-16 w-auto object-contain" />
                </div>
                <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                    <CardHeader className="text-center pb-2">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-teal-500" />
                            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Medical Professional Registration</span>
                        </div>
                        <CardTitle className="text-2xl text-slate-900">Create Doctor Account</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Get access to AI patient triage dashboard</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-slate-700">Full Name *</Label>
                                <Input id="name" placeholder="Dr. Jane Smith" value={name} onChange={e => setName(e.target.value)}
                                    className="border-slate-200 focus:border-teal-400" required />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-700">Position / Specialization</Label>
                                <Select value={position} onValueChange={setPosition}>
                                    <SelectTrigger className="border-slate-200 focus:border-teal-400">
                                        <SelectValue placeholder="Select your specialization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {POSITIONS.map(p => (
                                            <SelectItem key={p} value={p}>{p}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="qual" className="text-slate-700">Qualification / Degree</Label>
                                <Input id="qual" placeholder="e.g. MBBS, MD, MS, DM" value={qualification} onChange={e => setQualification(e.target.value)}
                                    className="border-slate-200 focus:border-teal-400" />
                                <p className="text-xs text-slate-500">Your academic qualifications (e.g. MBBS, MD Cardiology)</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Medical Email *</Label>
                                <Input id="email" type="email" placeholder="doctor@hospital.com" value={email} onChange={e => setEmail(e.target.value)}
                                    className="border-slate-200 focus:border-teal-400" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700">Password *</Label>
                                <Input id="password" type="password" placeholder="Min. 8 characters" value={password} onChange={e => setPassword(e.target.value)}
                                    className="border-slate-200 focus:border-teal-400" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm" className="text-slate-700">Confirm Password *</Label>
                                <Input id="confirm" type="password" placeholder="••••••••" value={confirm} onChange={e => setConfirm(e.target.value)}
                                    className={`border-slate-200 focus:border-teal-400 ${confirm && password !== confirm ? 'border-red-500' : ''}`} required />
                                {confirm && password !== confirm && <p className="text-xs text-red-400">Passwords do not match</p>}
                            </div>
                            <Button type="submit" size="lg" disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:opacity-90 text-white mt-2">
                                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Account...</> : <><Stethoscope className="w-4 h-4 mr-2" />Create Doctor Account</>}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm text-slate-500">
                            Already registered?{' '}
                            <Link to="/doctor/login" className="text-teal-600 font-semibold hover:underline">Sign in</Link>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">← Back to main site</Link>
                            <span className="text-slate-300 mx-2">·</span>
                            <Link to="/register" className="text-xs text-slate-400 hover:text-slate-600">Patient signup</Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
