import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Activity, ArrowLeft } from 'lucide-react';
import DrugInteractionChecker from '../components/DrugInteractionChecker';

export default function DrugCheckerPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-purple-50/20 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <header className="border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <img src="/nirog-logo.png" alt="Nirog Ai" className="h-10 w-auto" />
                    </Link>
                    <Link to="/patient/symptom">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Symptoms
                        </Button>
                    </Link>
                </div>
            </header>
            <main className="max-w-4xl mx-auto px-6 py-12">
                <DrugInteractionChecker />
            </main>
        </div>
    );
}
