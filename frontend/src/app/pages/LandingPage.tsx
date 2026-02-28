import { Link } from 'react-router';
import { Activity, Shield, FileText, Zap, AlertTriangle, Brain, TrendingUp, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EFF6FF] to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
            <Activity className="w-4 h-4 text-[#3B82F6]" />
            <span className="text-sm text-gray-600">AI-Powered Healthcare Technology</span>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 tracking-tight">
            AI-Powered Clinical Triage &<br />
            <span className="text-[#3B82F6]">Decision Support</span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reduce triage time by 60% and detect high-risk cases instantly with advanced AI analysis.
            Empower your clinical team with intelligent decision support.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link
              to="/symptom-input"
              className="px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Start Patient Analysis
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-semibold border border-gray-300 transition-all"
            >
              View Dashboard
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto mb-20">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-[#3B82F6] mb-1">60%</div>
            <div className="text-sm text-gray-600">Faster Triage Time</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-[#10B981] mb-1">94%</div>
            <div className="text-sm text-gray-600">Accuracy Rate</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 text-center">
            <div className="text-3xl font-bold text-[#F59E0B] mb-1">98%</div>
            <div className="text-sm text-gray-600">Risk Detection</div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Clinical Decision Support
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FEE2E2] rounded-xl flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6 text-[#EF4444]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Risk-Level Prioritization
              </h3>
              <p className="text-gray-600">
                Automatically categorize patients by risk severity (LOW, MEDIUM, HIGH) to optimize resource allocation and ensure critical cases receive immediate attention.
              </p>
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-[#D1FAE5] text-[#10B981] text-xs font-semibold rounded-full">LOW</span>
                <span className="px-3 py-1 bg-[#FEF3C7] text-[#F59E0B] text-xs font-semibold rounded-full">MEDIUM</span>
                <span className="px-3 py-1 bg-[#FEE2E2] text-[#EF4444] text-xs font-semibold rounded-full">HIGH</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#FEF3C7] rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Emergency Red Flag Detection
              </h3>
              <p className="text-gray-600">
                Advanced pattern recognition identifies life-threatening symptoms and conditions requiring immediate intervention, reducing diagnostic delays.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-[#10B981]" />
                Real-time alerts for critical conditions
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-[#3B82F6]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI SOAP Note Generation
              </h3>
              <p className="text-gray-600">
                Generate comprehensive, structured clinical documentation (Subjective, Objective, Assessment, Plan) in seconds, saving valuable clinician time.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <Zap className="w-4 h-4 text-[#3B82F6]" />
                Reduces documentation time by 70%
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-[#10B981]" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Intelligent Test Recommendation
              </h3>
              <p className="text-gray-600">
                AI-driven diagnostic test suggestions based on symptom patterns, patient history, and current best practices, improving diagnostic accuracy.
              </p>
              <div className="flex items-center gap-2 mt-4 text-sm text-gray-500">
                <TrendingUp className="w-4 h-4 text-[#10B981]" />
                Evidence-based recommendations
              </div>
            </div>
          </div>
        </div>

        {/* Target Users */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Designed For Healthcare Professionals
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-[#3B82F6]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Small Clinics</h3>
              <p className="text-sm text-gray-600">
                Streamline patient flow and enhance diagnostic capabilities for smaller practices
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#FEE2E2] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Emergency Rooms</h3>
              <p className="text-sm text-gray-600">
                Rapid triage and risk assessment for high-volume emergency departments
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D1FAE5] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Telemedicine</h3>
              <p className="text-sm text-gray-600">
                Support remote clinical decision-making with AI-powered analysis
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-4">Ready to transform your clinical workflow?</p>
          <Link
            to="/symptom-input"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Activity className="w-5 h-5" />
            Start Patient Analysis Now
          </Link>
        </div>
      </div>
    </div>
  );
}
