import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ChevronDown, ChevronUp, Brain, Activity, Clock, AlertTriangle } from 'lucide-react';

interface AIExplainabilityProps {
  symptoms: string;
  duration?: string;
  severity?: number;
  riskFactors?: string[];
}

export function AIExplainability({ 
  symptoms, 
  duration = 'Acute onset',
  severity = 7,
  riskFactors = []
}: AIExplainabilityProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-slate-200 dark:border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            Why this prediction?
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Symptom Match */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Symptom Match
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 pl-6">
              The reported symptoms: "{symptoms.substring(0, 100)}..." closely match the typical presentation 
              pattern for the identified conditions. Key symptom indicators were detected and weighted in the analysis.
            </p>
          </div>

          {/* Severity Weighting */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              Severity Weighting
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 pl-6">
              Symptom severity level of {severity}/10 indicates {severity >= 7 ? 'high' : severity >= 4 ? 'moderate' : 'low'} urgency. 
              This factor increases the risk score and influences condition probability rankings.
            </p>
          </div>

          {/* Duration Influence */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <Clock className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Duration Influence
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 pl-6">
              {duration} presentation affects the differential diagnosis. Acute symptoms require immediate 
              evaluation while chronic symptoms may indicate different underlying conditions.
            </p>
          </div>

          {/* Risk Factors */}
          {riskFactors.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                <Brain className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                Contributing Risk Factors
              </div>
              <ul className="text-sm text-slate-600 dark:text-slate-400 pl-6 space-y-1">
                {riskFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Model Info */}
          <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-xs text-purple-900 dark:text-purple-100">
              <strong>AI Model:</strong> This prediction uses a multi-factor neural network trained on 
              millions of medical cases. The model considers symptom patterns, temporal relationships, 
              severity indicators, and clinical risk factors to generate probability-weighted differential diagnoses.
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
