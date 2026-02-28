import { useState } from "react";
import { Button } from "./ui/button";
import { MapPin, X, RotateCcw } from "lucide-react";
import { bodyMapData, MuscleData } from "../data/bodyMapData";

interface SelectedRegion {
    id: string; // The unique id of the specific polygon (e.g. anterior-biceps-0)
    severity: number;
    muscle: string; // The parent muscle group name
    label: string;
}

interface BodyMapProps {
    onRegionsChange?: (regions: string[]) => void;
}

export default function BodyMap({ onRegionsChange }: BodyMapProps) {
    const [selectedParts, setSelectedParts] = useState<SelectedRegion[]>([]);
    const [hovered, setHovered] = useState<string | null>(null);
    const [side, setSide] = useState<'anterior' | 'posterior'>('anterior');

    const filteredMapData = bodyMapData.filter(d => d.side === side);

    const toggleRegion = (data: MuscleData) => {
        let updated: SelectedRegion[];
        const existing = selectedParts.find(p => p.id === data.id);

        if (existing) {
            updated = selectedParts.filter(p => p.id !== data.id);
        } else {
            updated = [...selectedParts, { id: data.id, severity: 1, muscle: data.muscle, label: data.label }];
        }

        setSelectedParts(updated);
        notifyParent(updated);
    };

    const updateSeverity = (id: string, newSeverity: number) => {
        const updated = selectedParts.map(p => p.id === id ? { ...p, severity: newSeverity } : p);
        setSelectedParts(updated);
        notifyParent(updated);
    };

    const removeRegion = (id: string) => {
        const updated = selectedParts.filter(p => p.id !== id);
        setSelectedParts(updated);
        notifyParent(updated);
    };

    const notifyParent = (parts: SelectedRegion[]) => {
        onRegionsChange?.(parts.map(p => {
            const sevStr = p.severity === 1 ? 'Mild' : p.severity === 2 ? 'Moderate' : 'Severe';
            return `${p.label} (${sevStr})`;
        }));
    };

    const getSeverityColor = (severity: number) => {
        if (severity === 1) return '#22c55e'; // Green
        if (severity === 2) return '#eab308'; // Yellow
        if (severity === 3) return '#ef4444'; // Red
        return 'transparent';
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>Click on specific body areas to mark symptoms</span>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    type="button"
                    onClick={() => setSide(side === 'anterior' ? 'posterior' : 'anterior')}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shrink-0"
                >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Switch to {side === 'anterior' ? 'Back' : 'Front'}
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full items-start">
                {/* Detailed SVG Body Figure */}
                <div className="flex justify-center bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <svg
                        width="200"
                        height="400"
                        viewBox={side === 'anterior' ? "0 0 100 200" : "0 0 100 220"}
                        className="cursor-pointer select-none"
                        style={{ filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.06))' }}
                    >
                        {filteredMapData.map((part) => {
                            const partData = selectedParts.find(p => p.id === part.id);
                            const isSelected = !!partData;
                            const isHov = hovered === part.id;

                            const fillColor = isSelected ? getSeverityColor(partData.severity) : isHov ? '#81b1d9' : '#cbd5e1';

                            return (
                                <polygon
                                    key={part.id}
                                    points={part.points}
                                    fill={fillColor}
                                    stroke="#f1f5f9"
                                    strokeWidth="0.5"
                                    className="transition-colors duration-150"
                                    onMouseEnter={() => setHovered(part.id)}
                                    onMouseLeave={() => setHovered(null)}
                                    onClick={() => toggleRegion(part)}
                                />
                            );
                        })}
                    </svg>
                </div>

                {/* Selected List */}
                <div className="flex flex-col gap-4">
                    <h4 className="font-semibold text-slate-700 dark:text-slate-300">Selected Areas & Severity</h4>
                    {selectedParts.length === 0 ? (
                        <div className="p-6 rounded-xl bg-slate-50 border border-dashed border-slate-300 dark:bg-slate-900/40 dark:border-slate-800 text-center">
                            <MapPin className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                            <p className="text-sm text-slate-500">No areas selected</p>
                            <p className="text-xs text-slate-400 mt-1">Click the body diagram to mark symptom locations</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {selectedParts.map(part => (
                                <div key={part.id} className="flex flex-col gap-2 p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-slate-800 dark:text-slate-200">{part.label}</span>
                                        <button type="button" onClick={() => removeRegion(part.id)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => updateSeverity(part.id, 1)}
                                            className={`flex-1 text-xs py-1.5 border rounded-md transition-colors ${part.severity === 1 ? 'bg-green-100 border-green-300 text-green-700 dark:bg-green-900/40 dark:border-green-800 dark:text-green-400 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                                        >
                                            Mild
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateSeverity(part.id, 2)}
                                            className={`flex-1 text-xs py-1.5 border rounded-md transition-colors ${part.severity === 2 ? 'bg-yellow-100 border-yellow-300 text-yellow-700 dark:bg-yellow-900/40 dark:border-yellow-800 dark:text-yellow-400 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                                        >
                                            Moderate
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateSeverity(part.id, 3)}
                                            className={`flex-1 text-xs py-1.5 border rounded-md transition-colors ${part.severity === 3 ? 'bg-red-100 border-red-300 text-red-700 dark:bg-red-900/40 dark:border-red-800 dark:text-red-400 font-medium' : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700'}`}
                                        >
                                            Severe
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
