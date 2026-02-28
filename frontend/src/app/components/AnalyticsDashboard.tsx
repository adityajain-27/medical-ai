import { Card } from "./ui/card";
import { TrendingUp, Users, AlertTriangle, Activity } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AnalyticsDashboard() {
  // Demo data
  const triageCategories = [
    { category: 'Respiratory', count: 145 },
    { category: 'Cardiac', count: 98 },
    { category: 'Neurological', count: 76 },
    { category: 'Gastrointestinal', count: 62 },
    { category: 'Musculoskeletal', count: 54 },
    { category: 'Other', count: 89 }
  ];
  
  const riskTrend = [
    { month: 'Sep', avgRisk: 42, emergencies: 12 },
    { month: 'Oct', avgRisk: 38, emergencies: 9 },
    { month: 'Nov', avgRisk: 45, emergencies: 15 },
    { month: 'Dec', avgRisk: 40, emergencies: 11 },
    { month: 'Jan', avgRisk: 48, emergencies: 18 },
    { month: 'Feb', avgRisk: 52, emergencies: 22 }
  ];
  
  const riskDistribution = [
    { name: 'Low Risk', value: 58, color: '#10b981' },
    { name: 'Medium Risk', value: 28, color: '#f59e0b' },
    { name: 'High Risk', value: 14, color: '#ef4444' }
  ];
  
  const emergencyCases = [
    { week: 'Week 1', flagged: 5, actual: 4 },
    { week: 'Week 2', flagged: 7, actual: 6 },
    { week: 'Week 3', flagged: 8, actual: 7 },
    { week: 'Week 4', flagged: 6, actual: 5 }
  ];
  
  const totalPatients = triageCategories.reduce((sum, cat) => sum + cat.count, 0);
  const emergencyPercentage = ((riskDistribution[2].value / 100) * totalPatients).toFixed(0);
  
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Healthcare Analytics Dashboard
          </h1>
          <p className="text-slate-600">
            System performance and patient insights
          </p>
        </div>
        
        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">{totalPatients}</div>
            <div className="text-sm text-slate-600">Total Patients</div>
          </Card>
          
          <Card className="p-6 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-semibold">52ms</span>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">98.2%</div>
            <div className="text-sm text-slate-600">AI Accuracy Rate</div>
          </Card>
          
          <Card className="p-6 rounded-xl border border-orange-200 bg-orange-50">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-orange-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-orange-700 mb-1">{riskTrend[5].avgRisk}%</div>
            <div className="text-sm text-orange-700">Avg Risk Level</div>
          </Card>
          
          <Card className="p-6 rounded-xl border border-red-200 bg-red-50">
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-red-200 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-700" />
              </div>
            </div>
            <div className="text-3xl font-bold text-red-700 mb-1">{emergencyPercentage}</div>
            <div className="text-sm text-red-700">Emergency Cases</div>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Most Common Triage Categories */}
          <Card className="p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Patient Count by Symptom Type</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={triageCategories}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="category" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          
          {/* Risk Distribution */}
          <Card className="p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Risk Level Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Average Risk Levels Over Time */}
          <Card className="p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Average Risk Levels Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={riskTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgRisk"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  name="Average Risk %"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          
          {/* Emergency Cases Flagged */}
          <Card className="p-6 rounded-xl border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Emergency Detection Accuracy</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={emergencyCases}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="flagged" fill="#f59e0b" name="AI Flagged" radius={[8, 8, 0, 0]} />
                <Bar dataKey="actual" fill="#10b981" name="Confirmed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
        
        {/* Key Insights */}
        <Card className="p-6 rounded-xl border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-4">Key Insights</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="text-2xl font-bold text-green-700 mb-1">95%</div>
              <div className="text-sm text-green-700">Emergency Detection Rate</div>
              <p className="text-xs text-green-600 mt-2">
                22 out of 23 critical cases correctly identified
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="text-2xl font-bold text-blue-700 mb-1">60%</div>
              <div className="text-sm text-blue-700">Faster Triage Time</div>
              <p className="text-xs text-blue-600 mt-2">
                Average time reduced from 15 min to 6 min
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <div className="text-2xl font-bold text-purple-700 mb-1">145</div>
              <div className="text-sm text-purple-700">Most Common Category</div>
              <p className="text-xs text-purple-600 mt-2">
                Respiratory symptoms lead patient visits
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
