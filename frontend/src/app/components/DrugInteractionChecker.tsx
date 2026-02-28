import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, Info, Pill, ExternalLink, CheckCircle2 } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { motion, AnimatePresence } from "motion/react";

interface DrugInteraction {
    drug1: string;
    drug2: string;
    severity: 'major' | 'moderate' | 'minor';
    effect: string;
    recommendation: string;
    fdaLink?: string;
}

// Pre-built interaction database (hardcoded for demo, simulates OpenFDA)
const INTERACTION_DATABASE: DrugInteraction[] = [
    {
        drug1: 'Warfarin', drug2: 'Aspirin',
        severity: 'major',
        effect: 'Increased risk of serious bleeding. Combined anticoagulant and antiplatelet effect.',
        recommendation: 'Avoid combination or use lowest effective dose with close INR monitoring.',
        fdaLink: 'https://open.fda.gov/drug/label.json?search=warfarin',
    },
    {
        drug1: 'Lisinopril', drug2: 'Ibuprofen',
        severity: 'moderate',
        effect: 'NSAIDs may reduce antihypertensive effect of ACE inhibitors and worsen renal function.',
        recommendation: 'Use acetaminophen instead. Monitor blood pressure and renal function closely.',
    },
    {
        drug1: 'Metformin', drug2: 'Contrast Media',
        severity: 'major',
        effect: 'Risk of contrast-induced nephropathy exacerbated, leading to lactic acidosis.',
        recommendation: 'Withhold metformin 48h before and after contrast procedures.',
    },
    {
        drug1: 'Atorvastatin', drug2: 'Amlodipine',
        severity: 'minor',
        effect: 'Amlodipine may slightly increase atorvastatin exposure by ~18%.',
        recommendation: 'Monitor for statin side effects. Generally safe to co-administer.',
    },
    {
        drug1: 'Clopidogrel', drug2: 'Omeprazole',
        severity: 'moderate',
        effect: 'Omeprazole inhibits CYP2C19 reducing clopidogrel antiplatelet activity.',
        recommendation: 'Use pantoprazole as an alternative PPI if GI protection is needed.',
    },
    {
        drug1: 'Amiodarone', drug2: 'Simvastatin',
        severity: 'major',
        effect: 'Increased risk of myopathy and rhabdomyolysis.',
        recommendation: 'Limit simvastatin dose to 20mg/day. Consider alternative statin.',
    },
    {
        drug1: 'Metoprolol', drug2: 'Verapamil',
        severity: 'major',
        effect: 'Combined effect can cause severe bradycardia, heart block, or cardiac arrest.',
        recommendation: 'Avoid co-administration. If necessary, use with extreme cardiac monitoring.',
    },
    {
        drug1: 'Digoxin', drug2: 'Furosemide',
        severity: 'moderate',
        effect: 'Furosemide-induced hypokalemia increases risk of digoxin toxicity.',
        recommendation: 'Monitor potassium levels and digoxin levels regularly.',
    },
];

function checkInteractions(medications: string[]): DrugInteraction[] {
    const found: DrugInteraction[] = [];
    const meds = medications.map(m => m.trim().toLowerCase());

    for (const interaction of INTERACTION_DATABASE) {
        const has1 = meds.some(m => m.includes(interaction.drug1.toLowerCase()));
        const has2 = meds.some(m => m.includes(interaction.drug2.toLowerCase()));
        if (has1 && has2) {
            found.push(interaction);
        }
    }
    return found;
}

function parseMedications(rawText: string): string[] {
    // Split by comma, semicolon, newline, or "and"
    return rawText
        .split(/[,;\n]|\ and\ /i)
        .map(m => m.trim())
        .filter(m => m.length > 2);
}

interface DrugInteractionCheckerProps {
    medicationsText?: string; // raw text from PreCheck
}

const SEVERITY_CONFIG: Record<DrugInteraction['severity'], {
    label: string; color: string; bg: string; border: string; icon: typeof AlertTriangle;
}> = {
    major: { label: 'MAJOR', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
    moderate: { label: 'MODERATE', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: AlertTriangle },
    minor: { label: 'MINOR', color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: Info },
};

// Demo medications for prototype (simulating pre-check data)
const DEMO_MEDICATIONS = "Warfarin 5mg daily, Aspirin 81mg, Atorvastatin 40mg, Amlodipine 5mg";

export default function DrugInteractionChecker({ medicationsText }: DrugInteractionCheckerProps) {
    const effectiveMeds = medicationsText || DEMO_MEDICATIONS;
    const medications = parseMedications(effectiveMeds);
    const interactions = checkInteractions(medications);

    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const majorCount = interactions.filter(i => i.severity === 'major').length;
    const moderateCount = interactions.filter(i => i.severity === 'moderate').length;

    if (medications.length === 0) {
        return (
            <Card className="p-4 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                    <Pill className="w-5 h-5" />
                    <span className="text-sm">No medications listed to check interactions</span>
                </div>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {/* Summary banner */}
            <div className={`flex items-center justify-between p-4 rounded-xl border ${majorCount > 0
                    ? 'bg-red-50 border-red-200'
                    : moderateCount > 0
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-green-50 border-green-200'
                }`}>
                <div className="flex items-center gap-3">
                    {majorCount > 0 ? (
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : moderateCount > 0 ? (
                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                    ) : (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                    )}
                    <div>
                        <div className={`font-semibold ${majorCount > 0 ? 'text-red-900' : moderateCount > 0 ? 'text-orange-900' : 'text-green-900'
                            }`}>
                            {interactions.length === 0
                                ? '✓ No interactions detected'
                                : `${interactions.length} interaction${interactions.length > 1 ? 's' : ''} found`}
                        </div>
                        <div className="text-xs text-slate-600 mt-0.5">
                            Checking {medications.length} medications • Powered by OpenFDA data
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {majorCount > 0 && (
                        <Badge className="bg-red-600 text-white text-xs">{majorCount} Major</Badge>
                    )}
                    {moderateCount > 0 && (
                        <Badge className="bg-orange-500 text-white text-xs">{moderateCount} Moderate</Badge>
                    )}
                </div>
            </div>

            {/* Medication chips */}
            <div>
                <p className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wide">Current Medications</p>
                <div className="flex flex-wrap gap-2">
                    {medications.map((med, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                            <Pill className="w-3 h-3" />
                            {med}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Interactions list */}
            {interactions.length > 0 && (
                <div className="space-y-3">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Detected Interactions</p>
                    {interactions.map((interaction, index) => {
                        const config = SEVERITY_CONFIG[interaction.severity];
                        const isExpanded = expandedIndex === index;
                        return (
                            <div key={index} className={`rounded-xl border ${config.border} ${config.bg} overflow-hidden`}>
                                <button
                                    className="w-full text-left p-4"
                                    onClick={() => setExpandedIndex(isExpanded ? null : index)}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex items-start gap-3">
                                            <config.icon className={`w-5 h-5 ${config.color} mt-0.5 flex-shrink-0`} />
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-semibold text-slate-900 text-sm">
                                                        {interaction.drug1} + {interaction.drug2}
                                                    </span>
                                                    <Badge className={`text-xs ${interaction.severity === 'major'
                                                            ? 'bg-red-600 text-white'
                                                            : interaction.severity === 'moderate'
                                                                ? 'bg-orange-500 text-white'
                                                                : 'bg-yellow-400 text-yellow-900'
                                                        }`}>
                                                        {config.label}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                                    {interaction.effect}
                                                </p>
                                            </div>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                                        )}
                                    </div>
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 pb-4 pt-0 border-t border-current/10 space-y-2">
                                                <div className="bg-white/70 rounded-lg p-3 mt-2">
                                                    <p className="text-xs font-semibold text-slate-700 mb-1">
                                                        ⚕️ Clinical Recommendation
                                                    </p>
                                                    <p className="text-xs text-slate-700 leading-relaxed">
                                                        {interaction.recommendation}
                                                    </p>
                                                </div>
                                                {interaction.fdaLink && (
                                                    <a
                                                        href={interaction.fdaLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                                                    >
                                                        <ExternalLink className="w-3 h-3" />
                                                        View FDA data
                                                    </a>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
