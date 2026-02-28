import { DashboardLayout } from '../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Check, Zap, Star, Rocket, Building2, Lock } from 'lucide-react';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹999',
    period: '/month',
    description: 'Perfect for individual practitioners',
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500',
    border: 'border-slate-200 dark:border-slate-700',
    features: [
      '25 patients',
      '50 AI analyses / month',
      'SOAP note generation',
      'Basic analytics',
      'Email support',
    ],
    notIncluded: ['Advanced analytics', 'Priority support', 'API access'],
    popular: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: '₹2,499',
    period: '/month',
    description: 'For growing clinics and practices',
    icon: Star,
    gradient: 'from-teal-500 to-emerald-500',
    border: 'border-teal-400 dark:border-teal-500',
    features: [
      '100 patients',
      '200 AI analyses / month',
      'SOAP note generation',
      'Advanced analytics & trends',
      'Drug interaction alerts',
      'Priority support',
    ],
    notIncluded: ['Unlimited patients', 'API access'],
    popular: true,
  },
  {
    id: 'clinic',
    name: 'Clinic',
    price: '₹5,999',
    period: '/month',
    description: 'For hospitals and large clinics',
    icon: Rocket,
    gradient: 'from-purple-500 to-pink-500',
    border: 'border-purple-200 dark:border-purple-700',
    features: [
      'Unlimited patients',
      'Unlimited AI analyses',
      'SOAP note generation',
      'Full analytics suite',
      'Drug interaction alerts',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
    notIncluded: [],
    popular: false,
  },
];

export default function DoctorBillingPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <Badge className="mb-4 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800 px-4 py-1.5">
            <Building2 className="w-3.5 h-3.5 mr-1.5 inline" />
            Subscription Plans
          </Badge>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3">
            Choose Your Plan
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Scale your AI-powered triage practice. All plans include our core AI assessment engine.
          </p>
        </div>
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Lock className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Payments Coming Soon</p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Online subscription payments are under development. Contact us to get early access or request a demo.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const Icon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`border-2 relative ${plan.border} ${plan.popular ? 'shadow-2xl shadow-teal-900/20' : 'shadow-md'} transition-all hover:scale-[1.02]`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white border-0 px-4 shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="pb-2 pt-6">
                  <div className={`w-12 h-12 bg-gradient-to-br ${plan.gradient} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <span className="text-4xl font-bold text-slate-900 dark:text-white">{plan.price}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">{plan.period}</span>
                  </div>

                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                        <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-400 dark:text-slate-600">
                        <span className="w-4 h-4 inline-flex items-center justify-center text-slate-300 flex-shrink-0">✕</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? `bg-gradient-to-r ${plan.gradient} text-white` : 'bg-slate-900 dark:bg-white dark:text-slate-900 text-white'} hover:opacity-90`}
                    disabled
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Coming Soon
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <Card className="border-2 border-slate-200 dark:border-slate-700 bg-gradient-to-r from-slate-900 to-slate-800">
          <CardContent className="p-8 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-500 rounded-2xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Enterprise</h3>
                <p className="text-slate-400 text-sm">Custom pricing for hospital networks and large organizations</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800" disabled>
                <Lock className="w-4 h-4 mr-2" /> Contact Sales — Coming Soon
              </Button>
            </div>
          </CardContent>
        </Card>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500">
          All plans include 14-day free trial · No credit card required to start · Cancel anytime
        </p>
      </div>
    </DashboardLayout>
  );
}
