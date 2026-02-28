import { Progress } from './ui/progress';

interface AIConfidenceMeterProps {
  score: number;
  showLabel?: boolean;
}

export function AIConfidenceMeter({ score, showLabel = true }: AIConfidenceMeterProps) {
  const getColor = (value: number) => {
    if (value >= 90) return 'bg-emerald-500';
    if (value >= 75) return 'bg-blue-500';
    if (value >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  const getTextColor = (value: number) => {
    if (value >= 90) return 'text-emerald-600 dark:text-emerald-400';
    if (value >= 75) return 'text-blue-600 dark:text-blue-400';
    if (value >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  return (
    <div className="space-y-2">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600 dark:text-slate-400">AI Confidence</span>
          <span className={`font-semibold ${getTextColor(score)}`}>{score}%</span>
        </div>
      )}
      <div className="relative">
        <Progress value={score} className="h-2" />
        <div 
          className={`absolute top-0 left-0 h-2 ${getColor(score)} rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
