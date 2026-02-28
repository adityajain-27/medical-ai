import { Link } from 'react-router';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Activity, Users, Shield } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export default function RoleSelectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-6 relative">
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <img src="/nirog-logo.png" alt="Nirog Ai" className="h-12 w-auto" />
        </Link>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Choose Your Path
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Select how you'd like to use Nirog Ai
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Patient Option */}
          <Card className="border-2 border-teal-200 dark:border-teal-800 hover:shadow-2xl transition-all cursor-pointer group">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-100 to-emerald-100 dark:from-teal-950 dark:to-emerald-950 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-10 h-10 text-teal-600 dark:text-teal-400" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                I'm a Patient
              </h3>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Get instant AI-powered health analysis and risk assessment completely free
              </p>

              <ul className="text-left space-y-2 mb-8 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  Free AI risk analysis
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  SOAP format health report
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  Emergency red-flag detection
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                  Downloadable PDF reports
                </li>
              </ul>

              <Link to="/patient/symptom">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600"
                >
                  Start Free Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Doctor Option */}
          <Card className="border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all cursor-pointer group">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950 dark:to-indigo-950 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                I'm a Doctor
              </h3>

              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Access professional SaaS dashboard with advanced analytics and patient management
              </p>

              <ul className="text-left space-y-2 mb-8 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  AI-powered triage dashboard
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Patient risk prioritization
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Advanced analytics & trends
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  Multi-patient management
                </li>
              </ul>

              <Link to="/doctor/dashboard">
                <Button
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  Go to Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
