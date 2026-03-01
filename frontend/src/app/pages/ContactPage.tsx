import { useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, Send, Linkedin } from 'lucide-react';
import { toast } from 'sonner';

const teamMembers = [
    {
        name: "Aditya Jain",
        email: "aditya.jain_cs.h25@gla.ac.in",
        linkedin: "https://www.linkedin.com/in/aditya-jain-32b310371/",
    },
    {
        name: "Sweety",
        email: "sweety.sweety_cs.h25@gla.ac.in",
        linkedin: "https://www.linkedin.com/in/sweety-527189382/",
    },
    {
        name: "Samay Parashar",
        email: "samay.parashar_cs.h25@gla.ac.in",
        linkedin: "https://www.linkedin.com/in/samay-parashar-95833b382",
    },
    {
        name: "Hardik Aggarwal",
        email: "hardik.agrawal_cs.h25@gla.ac.in",
        linkedin: "https://www.linkedin.com/in/hardik-agarwal-85a90a382",
    }
];

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            toast.success('Message sent! We will get back to you shortly.');
            (e.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <header className="fixed w-full z-50 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/">
                        <img src="/nirog-logo.png" alt="Nirog Ai" className="h-10 w-auto object-contain" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/about" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                            About
                        </Link>
                        <Link to="/login">
                            <Button variant="ghost" size="sm">Login</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4"
                    >
                        Get in <span className="text-teal-600">Touch</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto"
                    >
                        Have questions about our platform or want to request a demo? We'd love to hear from you.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-1 space-y-6"
                    >
                        <div className="grid sm:grid-cols-2 gap-4">
                            {teamMembers.map((member, i) => (
                                <Card key={i} className="border-slate-200 dark:border-slate-800 shadow-sm hover:border-teal-300 dark:hover:border-teal-700 transition-colors">
                                    <CardContent className="p-5">
                                        <h3 className="font-bold text-slate-900 dark:text-white text-lg">{member.name}</h3>
                                        <p className="text-teal-600 dark:text-teal-400 text-sm font-medium mb-4">Core Team</p>

                                        <div className="space-y-3">
                                            <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors group">
                                                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <span className="truncate" title={member.email}>{member.email}</span>
                                            </a>
                                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group">
                                                <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors">
                                                    <Linkedin className="w-4 h-4" />
                                                </div>
                                                <span>LinkedIn Profile</span>
                                            </a>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="md:col-span-2"
                    >
                        <Card className="border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900">
                            <CardContent className="p-8">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" placeholder="John" required className="bg-slate-50 dark:bg-slate-950" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" placeholder="Doe" required className="bg-slate-50 dark:bg-slate-950" />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Work Email</Label>
                                        <Input id="email" type="email" placeholder="john@clinic.com" required className="bg-slate-50 dark:bg-slate-950" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" placeholder="How can we help?" required className="bg-slate-50 dark:bg-slate-950" />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <textarea
                                            id="message"
                                            rows={5}
                                            required
                                            placeholder="Tell us about your needs..."
                                            className="w-full flex min-h-[80px] rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                                        ></textarea>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full bg-teal-600 hover:bg-teal-700 h-12"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Sending...' : (
                                            <>Send Message <Send className="w-4 h-4 ml-2" /></>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-slate-200 dark:border-slate-800 py-10 bg-white dark:bg-slate-900 mt-20">
                <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-500">
                    <p>© {new Date().getFullYear()} Nirog Ai. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
