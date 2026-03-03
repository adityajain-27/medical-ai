import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="fixed w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/">
                        <img src="/image.png" alt="Nirog AI" className="h-9 w-auto object-contain" />
                    </Link>
                    <Link to="/register" className="text-sm text-blue-600 hover:underline">← Back to Register</Link>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center">
                            <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy</h1>
                            <p className="text-sm text-slate-500">Effective date: March 1, 2026</p>
                        </div>
                    </div>

                    <div className="space-y-6 text-slate-700 dark:text-slate-300">

                        <section className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-2xl p-5">
                            <p className="text-teal-800 dark:text-teal-300 font-semibold text-sm">🔒 Our Commitment</p>
                            <p className="text-teal-700 dark:text-teal-400 text-sm mt-1">Nirog AI is committed to protecting patient and healthcare provider data. We handle all health information with the utmost care and follow applicable data protection regulations.</p>
                        </section>

                        {[
                            {
                                title: "1. Information We Collect",
                                content: "We collect information you provide directly: account details (name, email, password), patient symptom data submitted for AI analysis, doctor patient records, and usage data (pages visited, features used). We do not sell your personal information to third parties."
                            },
                            {
                                title: "2. How We Use Your Information",
                                content: "Your information is used to: provide and improve the Nirog AI service, generate AI-powered clinical assessments, send transactional emails (account verification, patient intake forms), and maintain platform security."
                            },
                            {
                                title: "3. Health Information",
                                content: "Symptom data and clinical information submitted through Nirog AI is used solely to generate AI assessments for the intended healthcare provider. We do not share individual health data with any third parties without your explicit consent."
                            },
                            {
                                title: "4. Data Storage & Security",
                                content: "All data is stored in encrypted MongoDB databases hosted on MongoDB Atlas. Passwords are hashed using bcrypt before storage. API communications use HTTPS/TLS encryption. Access is controlled via JWT authentication."
                            },
                            {
                                title: "5. Third-Party Services",
                                content: "Nirog AI uses: Groq AI (for LLM inference — symptom data is sent to Groq's API), Resend (for transactional emails), MongoDB Atlas (database hosting), and Render/Vercel (cloud hosting). Each service has its own privacy policy."
                            },
                            {
                                title: "6. Data Retention",
                                content: "Patient intake form data and assessment results are retained as long as the associated doctor account is active. You may request deletion of your data at any time by contacting us."
                            },
                            {
                                title: "7. Your Rights",
                                content: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at nirogai.health@gmail.com. We will respond within 30 days."
                            },
                            {
                                title: "8. Contact Us",
                                content: "For privacy-related questions or data deletion requests, contact: nirogai.health@gmail.com"
                            },
                        ].map(({ title, content }) => (
                            <section key={title}>
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h2>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{content}</p>
                            </section>
                        ))}
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
