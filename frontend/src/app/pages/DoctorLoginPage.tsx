import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Stethoscope, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

export default function DoctorLoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) { toast.error('Please fill in all fields'); return; }
        setLoading(true);
        try {
            await login(email, password);
            const stored = localStorage.getItem('token');
            if (stored) {
                const payload = JSON.parse(atob(stored.split('.')[1]));
                if (payload.role !== 'doctor') {
                    toast.error('This portal is for doctors only. Please use the patient login.');
                    localStorage.removeItem('token');
                    return;
                }
                toast.success('Welcome back, Doctor!');
                navigate('/doctor/dashboard');
            }
        } catch (err: any) {
            toast.error(err.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-blue-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <img src="/nirog-logo.png" alt="Nirog AI" className="h-16 w-auto object-contain" />
                </div>

                <Card className="border-slate-200 bg-white shadow-xl shadow-slate-200/60">
                    <CardHeader className="text-center pb-2">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-teal-500" />
                            <span className="text-xs font-semibold text-teal-600 uppercase tracking-wider">Verified Medical Professional</span>
                        </div>
                        <CardTitle className="text-2xl text-slate-900">Doctor Sign In</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">Access your patient dashboard and analytics</p>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-700">Medical Email</Label>
                                <Input id="email" type="email" placeholder="doctor@hospital.com" value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="border-slate-200 focus:border-teal-400" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-slate-700">Password</Label>
                                <Input id="password" type="password" placeholder="••••••••" value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="border-slate-200 focus:border-teal-400" required />
                            </div>
                            <Button type="submit" size="lg" disabled={loading}
                                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90 text-white">
                                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Signing in...</> : <><Stethoscope className="w-4 h-4 mr-2" />Sign In to Dashboard</>}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm text-slate-500">
                            Not registered yet?{' '}
                            <Link to="/doctor/register" className="text-teal-600 font-semibold hover:underline">Create Doctor Account</Link>
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                            <Link to="/" className="text-xs text-slate-400 hover:text-slate-600">← Back to main site</Link>
                            <span className="text-slate-300 mx-2">·</span>
                            <Link to="/login" className="text-xs text-slate-400 hover:text-slate-600">Patient login</Link>
                        </div>
                    </CardContent>
                </Card>
                <p className="text-center text-xs text-slate-400 mt-6">🔒 HIPAA-compliant · Encrypted session · Role-verified access</p>
            </div>
        </div>
    );
}
