import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Zap, Star, Rocket, CheckCircle, Loader2, Coins, ArrowLeft, Clock } from 'lucide-react';
import { useCredits } from '../hooks/useCredits';
import { toast } from 'sonner';
import { Link } from 'react-router';

const PACKAGES = [
    { id: 'starter', credits: 300, price: 99, label: 'Starter' },
    { id: 'standard', credits: 750, price: 249, label: 'Standard' },
    { id: 'pro', credits: 1500, price: 499, label: 'Pro' },
];

const PACKAGE_ICONS = { starter: Zap, standard: Star, pro: Rocket };
const PACKAGE_COLORS = {
    starter: 'from-blue-500 to-cyan-500',
    standard: 'from-teal-500 to-emerald-500',
    pro: 'from-purple-500 to-pink-500',
};

export default function BuyCreditsPage() {
    const { credits, addCredits, loading } = useCredits();
    const [buying, setBuying] = useState<string | null>(null);

    const handleBuy = () => {
        toast.info('Payment integration coming soon! Credits will be purchasable here once the platform launches.');
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <Link to="/patient/symptom">
                        <Button variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Analysis
                        </Button>
                    </Link>
                </div>

                <div className="text-center">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Buy Credits</h1>
                    <p className="text-slate-600 dark:text-slate-400">Each AI health assessment costs <strong>150 credits</strong></p>
                </div>

                {/* Coming Soon Banner */}
                <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-5 py-4">
                    <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Payment integration coming soon</p>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">Credit purchasing will be enabled at public launch. You currently start with 500 free credits on signup.</p>
                    </div>
                </div>

                <Card className="border-2 border-teal-200 dark:border-teal-800 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-950/40 dark:to-blue-950/40">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-500 rounded-2xl flex items-center justify-center">
                                <Coins className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Your current balance</p>
                                <p className="text-4xl font-bold text-slate-900 dark:text-white">{credits ?? '—'}</p>
                                <p className="text-sm text-slate-500 mt-0.5">credits</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Reports remaining</p>
                            <p className="text-3xl font-bold text-teal-600 dark:text-teal-400">
                                {credits !== null ? Math.floor(credits / 150) : '—'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-3 gap-4 text-center">
                    {[
                        { label: '500 credits', sub: 'Given on signup', color: 'text-green-600 dark:text-green-400' },
                        { label: '150 credits', sub: 'per AI Report', color: 'text-blue-600 dark:text-blue-400' },
                        { label: '3 reports', sub: 'with free credits', color: 'text-purple-600 dark:text-purple-400' },
                    ].map((item, i) => (
                        <div key={i} className="p-4 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                            <p className={`text-xl font-bold ${item.color}`}>{item.label}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.sub}</p>
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {PACKAGES.map(pkg => {
                        const Icon = PACKAGE_ICONS[pkg.id as keyof typeof PACKAGE_ICONS] || Zap;
                        const gradient = PACKAGE_COLORS[pkg.id as keyof typeof PACKAGE_COLORS] || 'from-blue-500 to-teal-500';
                        const isPopular = pkg.id === 'standard';
                        return (
                            <Card key={pkg.id} className={`border-2 relative overflow-hidden transition-all hover:scale-105 ${isPopular ? 'border-teal-400 shadow-xl' : 'border-slate-200 dark:border-slate-700'}`}>
                                {isPopular && (
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0">Most Popular</Badge>
                                    </div>
                                )}
                                <CardHeader className="pb-2">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center mb-3`}>
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-lg">{pkg.label}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div><span className="text-4xl font-bold text-slate-900 dark:text-white">₹{pkg.price}</span></div>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" /><strong>{pkg.credits}</strong> credits
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />{Math.floor(pkg.credits / 150)} AI health reports
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                                            <CheckCircle className="w-4 h-4 text-teal-500 flex-shrink-0" />Never expires
                                        </li>
                                    </ul>
                                    <Button
                                        className="w-full bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border-0 cursor-not-allowed"
                                        onClick={handleBuy}
                                        disabled
                                    >
                                        <Clock className="w-4 h-4 mr-2" /> Coming Soon
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
                <p className="text-center text-xs text-slate-400">🔒 Secure payments · Payment gateway integration in progress</p>
            </div>
        </div>
    );
}
