import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';

export default function TermsPage() {
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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Terms of Service</h1>
                            <p className="text-sm text-slate-500">Effective date: March 1, 2026</p>
                        </div>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-slate-700 dark:text-slate-300">

                        <section className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-5">
                            <p className="text-blue-800 dark:text-blue-300 font-semibold text-sm">⚕️ Medical Disclaimer</p>
                            <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">Nirog AI is a clinical decision support tool designed to assist healthcare professionals. It is <strong>not a substitute for professional medical advice, diagnosis, or treatment.</strong> Always consult a qualified healthcare provider.</p>
                        </section>

                        {[
                            {
                                title: "1. Acceptance of Terms",
                                content: "By accessing or using Nirog AI, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not use our service."
                            },
                            {
                                title: "2. Description of Service",
                                content: "Nirog AI provides an AI-powered clinical triage and assessment platform that helps healthcare professionals gather patient information, generate preliminary assessments, and organize clinical workflows. The platform uses artificial intelligence to assist — not replace — clinical judgment."
                            },
                            {
                                title: "3. User Accounts",
                                content: "You are responsible for maintaining the confidentiality of your account credentials. You agree to notify us immediately of any unauthorized use of your account. Nirog AI reserves the right to terminate accounts that violate these terms."
                            },
                            {
                                title: "4. Acceptable Use",
                                content: "You agree to use Nirog AI only for lawful purposes and in accordance with applicable healthcare regulations. You must not misuse the platform to submit false or misleading patient information, or attempt to circumvent any security measures."
                            },
                            {
                                title: "5. Credits & Payments",
                                content: "Nirog AI operates on a credit-based system. Credits are consumed per AI assessment generated. All credit purchases are final and non-refundable unless required by applicable law."
                            },
                            {
                                title: "6. Limitation of Liability",
                                content: "Nirog AI and its developers shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the service, including any clinical decisions made based on AI-generated outputs."
                            },
                            {
                                title: "7. Changes to Terms",
                                content: "We reserve the right to modify these terms at any time. Continued use of Nirog AI after changes constitutes acceptance of the new terms."
                            },
                            {
                                title: "8. Contact",
                                content: "For questions about these Terms, contact us at nirogai.health@gmail.com."
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
