import { Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Link } from 'react-router';

interface LockedFeatureOverlayProps {
  title?: string;
  description?: string;
}

export function LockedFeatureOverlay({ 
  title = 'Upgrade to Pro',
  description = 'Unlock advanced analytics and insights'
}: LockedFeatureOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center rounded-xl z-10">
      <div className="text-center space-y-4 p-8">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{title}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs">{description}</p>
        </div>
        <Link to="/doctor/billing">
          <Button className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
            View Plans
          </Button>
        </Link>
      </div>
    </div>
  );
}
