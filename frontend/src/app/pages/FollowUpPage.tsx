import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Activity, Loader2, ChevronRight, SkipForward, Brain } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { motion, AnimatePresence } from 'motion/react';
import { getFollowupQuestions, analyzeSymptoms } from '../services/api';
import { useCredits } from '../hooks/useCredits';
import { toast } from 'sonner';
import { ThemeToggle } from '../components/ThemeToggle';

const ANALYSIS_STEPS = [
    'Retrieving clinical guidelines…',
    'Computing preliminary triage…',
    'Generating differential diagnosis…',
    'Writing SOAP note…',
    'Checking drug interactions…',
    'Finalizing assessment…',
];

export default function FollowUpPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as { symptoms: string; medications: string[]; age: string; gender: string } | null;
    const { credits, deductCredits, isDoctor } = useCredits();

    const [questions, setQuestions] = useState<string[]>([]);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [currentQ, setCurrentQ] = useState(0);
    const [inputVal, setInputVal] = useState('');
    const [phase, setPhase] = useState<'loading-q' | 'answering' | 'analyzing'>('loading-q');
    const [stepIdx, setStepIdx] = useState(0);
    const calledRef = useRef(false); // prevent StrictMode double-fire

    // Rotate step label during analysis
    useEffect(() => {
        if (phase !== 'analyzing') return;
        const t = setInterval(() => {
            setStepIdx(i => (i + 1) % ANALYSIS_STEPS.length);
        }, 3500);
        return () => clearInterval(t);
    }, [phase]);

    // Step 1: load follow-up questions on mount (guard against StrictMode double-call)
    useEffect(() => {
        if (calledRef.current) return;
        calledRef.current = true;
        if (!state?.symptoms) { navigate('/patient/symptom'); return; }

        getFollowupQuestions(state.symptoms, state.medications)
            .then(qs => {
                if (qs.length === 0) {
                    startAnalysis({});
                } else {
                    setQuestions(qs);
                    setPhase('answering');
                }
            })
            .catch(() => startAnalysis({}));
    }, []);

    const startAnalysis = async (followupAnswers: Record<string, string>) => {
        if (!state) return;

        // Credit gate: only for patients with known low balance
        if (!isDoctor && credits !== null && credits < 150) {
            toast.error('Not enough credits. Please buy more to generate a report.');
            navigate('/buy-credits');
            return;
        }

        setPhase('analyzing');
        setStepIdx(0);
        try {
            const result = await analyzeSymptoms(state.symptoms, state.medications, followupAnswers);

            // Deduct credits after successful analysis
            const { success, insufficientCredits } = await deductCredits();
            if (!success && insufficientCredits) {
                toast.error('Not enough credits. Please buy more to generate a report.');
                navigate('/buy-credits');
                return;
            }

            const sessionId = `session-${Date.now()}`;
            sessionStorage.setItem(sessionId, JSON.stringify({
                result,
                symptoms: state.symptoms,
                age: state.age,
                gender: state.gender,
            }));
            toast.success('Analysis complete! 150 credits used.');
            navigate(`/patient/risk/${sessionId}`);
        } catch {
            toast.error('AI service error. Please ensure the Python server is running on port 8000.');
            navigate('/patient/symptom');
        }
    };

    const handleAnswer = () => {
        const q = questions[currentQ];
        const newAnswers = { ...answers, [q]: inputVal.trim() || 'Not provided' };
        setAnswers(newAnswers);
        setInputVal('');
        if (currentQ + 1 < questions.length) {
            setCurrentQ(q => q + 1);
        } else {
            startAnalysis(newAnswers);
        }
    };

    const handleSkip = () => startAnalysis(answers);

    // ── Loading questions phase ──────────────────────────────
    if (phase === 'loading-q') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:to-slate-900">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center"
                >
                    <Brain className="w-8 h-8 text-white" />
                </motion.div>
                <div className="text-center">
                    <p className="text-slate-900 dark:text-white text-lg font-semibold mb-1">Reviewing your symptoms…</p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Preparing follow-up questions for better accuracy</p>
                </div>
                <div className="flex gap-1.5 mt-2">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            className="w-2 h-2 bg-teal-400 rounded-full"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.4 }}
                        />
                    ))}
                </div>
            </div>
        );
    }

    // ── Full AI analysis phase ──────────────────────────────
    if (phase === 'analyzing') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:to-slate-900 px-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-teal-900/50"
                    >
                        <Activity className="w-10 h-10 text-white" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI Running Full Analysis</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Using your answers for a more precise result</p>

                    {/* Animated step label */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={stepIdx}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.4 }}
                            className="flex items-center justify-center gap-2 text-teal-400 text-sm"
                        >
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {ANALYSIS_STEPS[stepIdx]}
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress bar */}
                    <div className="w-64 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mt-6 overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-teal-500 to-blue-500 rounded-full"
                            initial={{ width: '5%' }}
                            animate={{ width: '92%' }}
                            transition={{ duration: 28, ease: 'easeInOut' }}
                        />
                    </div>

                    <p className="text-slate-400 text-xs mt-3">This takes 15–30 seconds</p>
                </motion.div>
            </div>
        );
    }

    // ── Follow-up questions phase ──────────────────────────────
    const progress = questions.length > 0 ? (currentQ / questions.length) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-teal-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-2xl mx-auto px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="font-bold text-slate-900 dark:text-white text-sm">AI Follow-Up Questions</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Answering these improves your assessment accuracy</p>
                    </div>
                    <div className="ml-auto flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-teal-500" />
                            AI analyzing…
                        </div>
                        <ThemeToggle />
                    </div>
                </div>
                {/* Progress */}
                <div className="h-0.5 bg-slate-200 dark:bg-slate-800">
                    <motion.div
                        className="h-full bg-gradient-to-r from-teal-500 to-blue-500"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.4 }}
                    />
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-6 py-12">
                {/* Context strip */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-8 bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/50 rounded-xl px-4 py-3"
                >
                    <Loader2 className="w-4 h-4 animate-spin text-teal-400 flex-shrink-0" />
                    <p className="text-teal-700 dark:text-teal-300 text-sm">
                        The AI is running your full analysis in the background.
                        Your answers below will be factored into the result.
                    </p>
                </motion.div>

                {/* Question counter */}
                <div className="flex items-center justify-between mb-5">
                    <p className="text-slate-400 text-sm">
                        Question <span className="text-slate-900 dark:text-white font-semibold">{currentQ + 1}</span> of {questions.length}
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSkip}
                        className="text-slate-500 hover:text-slate-300 text-xs gap-1"
                    >
                        <SkipForward className="w-3.5 h-3.5" /> Skip all
                    </Button>
                </div>

                {/* Question card */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQ}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <Card className="border-2 border-teal-100 dark:border-slate-700 bg-white dark:bg-slate-800/50 mb-5 shadow-xl">
                            <CardContent className="p-6">
                                <p className="text-slate-900 dark:text-white text-lg leading-relaxed mb-5 font-medium">
                                    {questions[currentQ]}
                                </p>
                                <textarea
                                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-teal-400 text-sm leading-relaxed min-h-[90px] placeholder-slate-400"
                                    placeholder="Type your answer… (press Ctrl+Enter to continue)"
                                    value={inputVal}
                                    onChange={e => setInputVal(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleAnswer(); }}
                                    autoFocus
                                />
                            </CardContent>
                        </Card>

                        <Button
                            onClick={handleAnswer}
                            size="lg"
                            className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:opacity-90 shadow-lg shadow-teal-900/50"
                        >
                            {currentQ + 1 < questions.length
                                ? <><ChevronRight className="w-5 h-5 mr-2" /> Next Question</>
                                : <><Activity className="w-5 h-5 mr-2" /> Submit &amp; Get Results</>}
                        </Button>
                    </motion.div>
                </AnimatePresence>

                {/* Dot progress */}
                <div className="flex justify-center gap-2 mt-8">
                    {questions.map((_, i) => (
                        <motion.div
                            key={i}
                            className="h-2 rounded-full"
                            animate={{
                                width: i === currentQ ? 24 : i < currentQ ? 16 : 8,
                                backgroundColor: i < currentQ ? '#14b8a6' : i === currentQ ? '#3b82f6' : '#334155',
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
