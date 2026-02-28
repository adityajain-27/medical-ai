import { useState, useEffect } from 'react';
import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { User, Lock, Loader2, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'sonner';

const NODE_BASE_URL = 'http://localhost:5000';
function authHeaders(token: string) {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

export default function DoctorSettingsPage() {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [savingProfile, setSavingProfile] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => { if (user?.name) setName(user.name); }, [user]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Name cannot be empty'); return; }
    setSavingProfile(true);
    try {
      const res = await fetch(`${NODE_BASE_URL}/api/auth/me`, {
        method: 'PUT', headers: authHeaders(token!), body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Profile updated!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally { setSavingProfile(false); }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) { toast.error('All fields are required'); return; }
    if (newPassword !== confirmPassword) { toast.error('New passwords do not match'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setSavingPassword(true);
    try {
      const res = await fetch(`${NODE_BASE_URL}/api/auth/me`, {
        method: 'PUT', headers: authHeaders(token!), body: JSON.stringify({ password: newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success('Password changed successfully!');
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Failed to change password');
    } finally { setSavingPassword(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your doctor account</p>
        </div>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><User className="w-5 h-5 text-blue-500" /> Profile</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {(user?.name || 'D').charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white text-lg">{user?.name || 'Doctor'}</p>
                <p className="text-slate-500 text-sm">{user?.email || email}</p>
                {user?.position && <p className="text-xs text-slate-400 mt-0.5">{user.position}{user.qualification ? ` · ${user.qualification}` : ''}</p>}
                <Badge className="mt-1 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">Doctor</Badge>
              </div>
            </div>
            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-2"><Label>Display Name</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" /></div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={email} disabled className="bg-slate-50 dark:bg-slate-900 text-slate-500 cursor-not-allowed" />
                <p className="text-xs text-slate-400">Email cannot be changed.</p>
              </div>
              <Button type="submit" disabled={savingProfile} className="bg-gradient-to-r from-blue-500 to-teal-500 text-white">
                {savingProfile ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</> : <><Check className="w-4 h-4 mr-2" />Save Profile</>}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Lock className="w-5 h-5 text-teal-500" /> Change Password</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••" /></div>
              <Separator />
              <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Min 6 characters" /></div>
              <div className="space-y-2">
                <Label>Confirm New Password</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Repeat new password" />
                {newPassword && confirmPassword && newPassword !== confirmPassword && <p className="text-xs text-red-500">Passwords do not match</p>}
                {newPassword && confirmPassword && newPassword === confirmPassword && newPassword.length >= 6 && <p className="text-xs text-green-500">✓ Passwords match</p>}
              </div>
              <Button type="submit" disabled={savingPassword} variant="outline" className="border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/20">
                {savingPassword ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Updating...</> : <><Lock className="w-4 h-4 mr-2" />Update Password</>}
              </Button>
            </form>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardHeader><CardTitle className="text-lg">Account Info</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800"><span className="text-slate-500">Role</span><Badge>Doctor</Badge></div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Plan</span>
              <span className="text-slate-700 dark:text-slate-300">Professional <span className="text-xs text-slate-400 ml-1">(Demo)</span></span>
            </div>
            <div className="flex justify-between py-2"><span className="text-slate-500">Data Security</span><span className="text-green-600 dark:text-green-400 font-medium">HIPAA Compliant</span></div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
