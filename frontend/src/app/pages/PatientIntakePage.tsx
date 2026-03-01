import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, HeartPulse, CheckCircle2, AlertCircle, Plus, X, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const NODE_BASE_URL = import.meta.env.VITE_NODE_URL || 'http://localhost:5000';

type Stage = 'loading' | 'form' | 'submitting' | 'success' | 'error';

interface IntakeInfo {
    patientName: string;
    patientAge: number;
    patientGender: string;
    doctorName: string;
    expiresAt: string;
}

export default function PatientIntakePage() {
    const { token } = useParams<{ token: string }>();
    const [stage, setStage] = useState<Stage>('loading');
    const [info, setInfo] = useState<IntakeInfo | null>(null);
    const [errorMsg, setErrorMsg] = useState('');

    const [symptoms, setSymptoms] = useState('');
    const [medications, setMedications] = useState<string[]>([]);
    const [medInput, setMedInput] = useState('');
    const [followupAnswers] = useState({});

    useEffect(() => {
        fetch(`${NODE_BASE_URL}/api/intake/${token}`)
            .then(r => r.json().then(d => ({ ok: r.ok, data: d })))
            .then(({ ok, data }) => {
                if (!ok) { setErrorMsg(data.message || 'Invalid link'); setStage('error'); return; }
                setInfo(data);
                setStage('form');
            })
            .catch(() => { setErrorMsg('Could not connect. Please try again.'); setStage('error'); });
    }, [token]);

    const addMed = () => {
        const t = medInput.trim();
        if (t && !medications.includes(t)) { setMedications(m => [...m, t]); setMedInput(''); }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!symptoms.trim()) { toast.error('Please describe your symptoms.'); return; }
        setStage('submitting');
        try {
            const res = await fetch(`${NODE_BASE_URL}/api/intake/${token}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symptoms, medications, followup_answers: followupAnswers }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Submission failed');
            setStage('success');
        } catch (err: any) {
            setErrorMsg(err.message || 'Something went wrong. Please try again.');
            setStage('error');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-teal-50 flex flex-col items-center justify-center px-4 py-12">
            <AnimatePresence mode="wait">

                {stage === 'loading' && (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center">
                            <HeartPulse className="w-8 h-8 text-white animate-pulse" />
                        </div>
                        <Loader2 className="w-6 h-6 animate-spin text-sky-500" />
                        <p className="text-slate-500 text-sm">Loading your assessment form…</p>
                    </motion.div>
                )}

                {stage === 'error' && (
                    <motion.div key="error" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Link Unavailable</h2>
                        <p className="text-slate-500">{errorMsg}</p>
                    </motion.div>
                )}

                {stage === 'submitting' && (
                    <motion.div key="submitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-6 text-center max-w-sm">
                        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-200">
                            <HeartPulse className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Analysing your symptoms…</h2>
                            <p className="text-slate-500 text-sm">Our AI is generating your health report. This usually takes 15–30 seconds.</p>
                        </div>
                        <div className="flex gap-2">
                            {[0, 1, 2].map(i => (
                                <motion.div key={i} className="w-3 h-3 bg-sky-400 rounded-full"
                                    animate={{ y: [0, -10, 0] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} />
                            ))}
                        </div>
                    </motion.div>
                )}

                {stage === 'success' && (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center">
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }}
                            className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-teal-200">
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">Assessment Complete! 🎉</h2>
                        <p className="text-slate-600 leading-relaxed mb-2">
                            Your health information has been securely sent to <strong>{info?.doctorName || 'your doctor'}</strong>.
                        </p>
                        <p className="text-slate-500 text-sm">They will review the AI-generated report and get back to you. You may close this tab.</p>
                        <div className="mt-6 p-4 bg-teal-50 rounded-2xl border border-teal-100">
                            <p className="text-teal-700 text-sm font-medium">✓ AI report generated &amp; sent to doctor's dashboard</p>
                        </div>
                    </motion.div>
                )}

                {stage === 'form' && info && (
                    <motion.div key="form" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-200">
                                <HeartPulse className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900">Nirog AI</h1>
                            <p className="text-slate-500 mt-1 text-sm">Health Assessment Form</p>
                        </div>

                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                            {/* Greeting */}
                            <div className="bg-gradient-to-r from-sky-500 to-teal-500 px-8 py-6 text-white">
                                <p className="text-sky-100 text-sm font-medium uppercase tracking-wide mb-1">Requested by Dr. {info.doctorName}</p>
                                <h2 className="text-2xl font-bold">Hello, {info.patientName} 👋</h2>
                                <p className="text-sky-100 text-sm mt-1">Please fill this form so your doctor can review your health status.</p>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                {/* Symptoms */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Describe your current symptoms <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={symptoms} onChange={e => setSymptoms(e.target.value)} required
                                        rows={4} placeholder="e.g. I've had a fever of 38.5°C for 2 days, along with a dry cough and fatigue…"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none text-slate-800 placeholder-slate-400 text-sm leading-relaxed"
                                    />
                                    <p className="text-xs text-slate-400 mt-1.5">Be as detailed as possible — when it started, severity, related symptoms.</p>
                                </div>

                                {/* Medications */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Current Medications <span className="text-slate-400 font-normal">(optional)</span></label>
                                    <div className="flex gap-2">
                                        <input value={medInput} onChange={e => setMedInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addMed())}
                                            placeholder="e.g. Paracetamol 500mg" className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm text-slate-800 placeholder-slate-400" />
                                        <button type="button" onClick={addMed}
                                            className="w-11 h-11 bg-sky-50 hover:bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center transition-colors border border-sky-200">
                                            <Plus className="w-4 h-4" />
                                        </button>
                                    </div>
                                    {medications.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {medications.map(m => (
                                                <span key={m} className="flex items-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-200 text-xs px-3 py-1.5 rounded-full font-medium">
                                                    {m}
                                                    <button type="button" onClick={() => setMedications(x => x.filter(x => x !== m))}>
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Info box */}
                                <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100">
                                    <p className="text-xs text-sky-600 font-semibold mb-2">ℹ️ Your information</p>
                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        {[['Age', `${info.patientAge}y`], ['Gender', info.patientGender], ['Doctor', `Dr. ${info.doctorName}`]].map(([label, val]) => (
                                            <div key={label} className="bg-white rounded-xl p-2 border border-sky-100">
                                                <p className="text-xs text-slate-400">{label}</p>
                                                <p className="text-sm font-semibold text-slate-700 capitalize">{val}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <button type="submit"
                                    className="w-full py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold rounded-2xl text-base flex items-center justify-center gap-2 hover:from-sky-600 hover:to-teal-600 transition-all shadow-lg shadow-sky-200 active:scale-[0.98]">
                                    Submit to My Doctor <ChevronRight className="w-5 h-5" />
                                </button>

                                <p className="text-xs text-slate-400 text-center">Your data is used only for this assessment. Link expires {new Date(info.expiresAt).toLocaleDateString()}.</p>
                            </form>
                        </div>

                        <p className="text-center text-xs text-slate-400 mt-6">Powered by <strong className="text-sky-600">Nirog AI</strong> — AI-Powered Clinical Assessment</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
