import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Activity, Brain, Shield, HeartPulse, ArrowRight } from 'lucide-react';

export default function AboutPage() {
    const values = [
        {
            icon: Brain,
            title: 'AI-Driven Intelligence',
            description: 'Leveraging cutting-edge language models to analyze symptoms and provide instant, reliable health insights.',
        },
        {
            icon: Shield,
            title: 'Secure & Confidential',
            description: 'Built with privacy at its core, ensuring that patient data is processed securely and responsibly.',
        },
        {
            icon: HeartPulse,
            title: 'Patient-Centric Care',
            description: 'Designed to empower individuals with understandable medical information, bridging the gap between patients and providers.',
        },
        {
            icon: Activity,
            title: 'Clinical Accuracy',
            description: 'Trained on vast medical knowledge bases to ensure our decision support tools align with modern medical standards.',
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="fixed w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/">
                        <img src="/nirog-logo.png" alt="Nirog Ai" className="h-10 w-auto object-contain" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/contact" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Contact
                        </Link>
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Login</Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="bg-teal-600 hover:bg-teal-700">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                        Pioneering the Future of <br className="hidden md:block" />
                        <span className="text-teal-600">Healthcare Triage</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        At Nirog Ai, we believe in augmenting medical professionals with powerful artificial intelligence, dramatically reducing triage times and improving patient outcomes worldwide.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/register">
                            <Button size="lg" className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100">
                                Join the Platform
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button size="lg" variant="outline">
                                Get in Touch
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Our Core Values</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">The principles that guide our technology and our mission.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, idx) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Card className="h-full border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                                    <CardContent className="p-6">
                                        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/40 text-teal-600 dark:text-teal-400 rounded-xl flex items-center justify-center mb-4">
                                            <value.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{value.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                                            {value.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Ready to transform your practice?</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto text-lg">
                        Join thousands of modern healthcare providers using Nirog Ai to streamline their triage workflow.
                    </p>
                    <Link to="/register">
                        <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                            Get Started for Free <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Nirog Ai. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
