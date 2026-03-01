import { Link } from 'react-router';
import { createPortal } from 'react-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

import { ThemeToggle } from '../components/ThemeToggle';
import {
  Activity, Brain, FileText, AlertTriangle, Download,
  BarChart3, Users, TrendingUp, ArrowRight
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import type { Variants } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { subscriptionPlans } from '../data/mockData';
import LightRays from '../../components/LightRays';
import ShapeBlur from '../components/ShapeBlur';

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const wordStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const wordFade = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.55, ease: 'easeOut' as const } },
};

function FlowingHeadline({ text, className }: { text: string; className?: string }) {
  return (
    <motion.span variants={wordStagger} initial="hidden" animate="show" className={className}>
      {text.split(' ').map((word, i) => (
        <motion.span key={i} variants={wordFade} className="inline-block mr-[0.28em] last:mr-0">
          {word}
        </motion.span>
      ))}
    </motion.span>
  );
}

const marqueeItems = [
  '✦ HIPAA Compliant',
  '✦ Evidence-Based',
  '✦ Real-Time Analysis',
  '✦ ICD-10 Coded',
  '✦ SOAP Reports',
  '✦ Drug Interaction Alerts',
  '✦ Multi-Language Support',
  '✦ 6 AI Pipeline Agents',
];

function Marquee() {
  const items = [...marqueeItems, ...marqueeItems];
  return (
    <div className="mt-16 overflow-hidden relative">
      <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white dark:from-transparent to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white dark:from-transparent to-transparent z-10 pointer-events-none" />
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
      >
        {items.map((item, i) => (
          <span key={i} className="text-xs font-semibold tracking-widest uppercase text-slate-500 dark:text-slate-500 flex-shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '10%']);

  const patientFeatures = [
    { icon: Brain, title: 'AI Risk Analysis', description: 'Advanced symptom analysis powered by Llama 3.3 AI', color: 'from-teal-400 to-emerald-500' },
    { icon: FileText, title: 'Clinical SOAP Report', description: 'Doctor-standard medical documentation generated instantly', color: 'from-blue-400 to-cyan-500' },
    { icon: AlertTriangle, title: 'Emergency Red-Flag Detection', description: 'Instant identification of critical conditions', color: 'from-red-400 to-orange-500' },
    { icon: Download, title: 'Downloadable PDF', description: 'Share formatted clinical reports with your doctor', color: 'from-purple-400 to-pink-500' },
  ];

  const doctorFeatures = [
    { icon: Activity, title: 'AI-Powered Triage Dashboard', description: 'Intelligent patient prioritization system', color: 'from-blue-400 to-indigo-500' },
    { icon: Users, title: 'Patient Risk Prioritization', description: 'Focus on critical cases first, reduce triage time', color: 'from-violet-400 to-purple-500' },
    { icon: BarChart3, title: 'Analytics & Trends', description: 'Track clinical patterns and health outcomes', color: 'from-cyan-400 to-blue-500' },
    { icon: TrendingUp, title: 'Unlimited Reports (Pro)', description: 'Scale your practice without limits', color: 'from-emerald-400 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-transparent overflow-hidden relative">

      {/* LightRays Background */}
      {createPortal(
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] bg-white dark:bg-slate-950">
          <LightRays
            raysOrigin="top-center"
            raysColor="#36f255"
            raysSpeed={1}
            lightSpread={0.5}
            rayLength={3}
            pulsating={false}
            fadeDistance={1}
            saturation={1}
            followMouse
            mouseInfluence={0.1}
            noiseAmount={0}
            distortion={0}
          />
        </div>,
        document.body
      )}

      {/* Header */}
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="absolute top-0 left-0 right-0 w-full z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/">
              <img
                src="/nirog-logo.png"
                alt="Nirog Ai"
                className="h-20 md:h-28 w-auto object-contain mix-blend-multiply dark:mix-blend-screen contrast-125 brightness-110"
              />
            </Link>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden md:flex items-center gap-8 mr-4">
              <Link to="/about">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  About Us
                </motion.div>
              </Link>
              <Link to="/contact">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-base font-semibold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                  Contact Us
                </motion.div>
              </Link>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY }}
        className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center"
      >
        <motion.div variants={stagger} initial="hidden" animate="show">


          <div className="mt-16 mb-6">
            <h2
              className="text-5xl md:text-7xl font-extrabold text-slate-900 dark:text-white leading-[1.12] tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <FlowingHeadline text="Intelligent" />
              {' '}
              <FlowingHeadline
                text="Clinical Triage."
                className="text-teal-600 dark:text-teal-400"
              />
            </h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="mt-4 text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-slate-600 dark:text-slate-400"
            >
              Clinical AI for Patients &amp; Providers
            </motion.p>
          </div>

          <motion.p
            variants={fadeUp}
            className="text-lg text-slate-600 dark:text-slate-400 mb-14 max-w-2xl mx-auto leading-relaxed"
          >
            Describe your symptoms — get triage priority, SOAP notes, ICD-10 codes,
            and drug interaction checks in seconds.
          </motion.p>

          {/* Single CTA Card */}
          <motion.div variants={fadeUp} className="max-w-xl mx-auto w-full">
            <Card className="border border-teal-200/60 dark:border-teal-800 shadow-xl shadow-teal-100 dark:shadow-teal-900/30 overflow-hidden relative group bg-teal-50/60 dark:bg-slate-900/80 backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-100/50 to-blue-100/50 dark:from-teal-950/20 dark:to-blue-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

              <CardContent className="p-6 md:p-8 relative z-10 flex flex-col items-center text-center">
                <motion.div
                  className="w-16 h-16 bg-teal-100 dark:bg-teal-900/50 rounded-2xl flex items-center justify-center mb-5 shadow-sm ring-1 ring-teal-200 dark:ring-teal-800"
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                >
                  <Activity className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                  Get AI Consultation
                </h3>

                <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm md:text-base leading-relaxed max-w-md">
                  Enter symptoms and receive real-time triage priority, risk assessment, and structured medical report powered by clinical AI.
                </p>

                <Link to="/register" state={{ returnTo: "/patient/symptom" }} className="w-full max-w-xs">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button className="w-full bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg shadow-teal-200 dark:shadow-teal-900/50 text-base py-6 font-semibold tracking-wide">
                      🚀 Start AI Assessment
                    </Button>
                  </motion.div>
                </Link>
              </CardContent>
            </Card>

            {/* Doctor Link beneath the card */}
            <motion.div variants={fadeUp} className="mt-8 text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-4 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 inline-block shadow-sm">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-base md:text-lg text-slate-700 dark:text-slate-300 font-medium">
                <span>Are you a healthcare professional?</span>
                <Link to="/doctor/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-bold hover:underline transition-all underline-offset-4 flex items-center group whitespace-nowrap">
                  Access Doctor Dashboard <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        <Marquee />
      </motion.section>

      {/* Stats */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 py-16 mb-20"
      >
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8 text-center"
          >
            {[
              { value: 60, suffix: '%', label: 'Faster Triage Time' },
              { value: 95, suffix: '%', label: 'Risk Detection Accuracy' },
              { value: 6, suffix: ' Agents', label: 'AI Pipeline Agents' },
            ].map((stat) => (
              <motion.div key={stat.label} variants={fadeUp}>
                <div className="text-5xl font-extrabold text-white mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Patient Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 mb-10">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">AI for Patients</h3>
            <p className="text-slate-600 dark:text-slate-400">Get instant AI-powered health analysis at no cost</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {patientFeatures.map((feature, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -10, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
                className="relative group h-full"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl overflow-hidden blur-2xl z-0">
                  <ShapeBlur
                    variation={0}
                    pixelRatioProp={window.devicePixelRatio || 1}
                    shapeSize={1.5}
                    roundness={0.5}
                    borderSize={0}
                    circleSize={0.3}
                    circleEdge={1}
                  />
                </div>
                <Card className="h-full relative z-10 border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Doctor Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-20 mb-20 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-slate-900/60 dark:to-indigo-950/20 rounded-3xl">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">SaaS Platform for Doctors</h3>
            <p className="text-slate-600 dark:text-slate-400">Professional tools for modern healthcare practices</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {doctorFeatures.map((feature, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ y: -10, scale: 1.03, transition: { type: 'spring', stiffness: 300, damping: 18 } }}
                className="relative group h-full"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl overflow-hidden blur-2xl z-0">
                  <ShapeBlur
                    variation={1}
                    pixelRatioProp={window.devicePixelRatio || 1}
                    shapeSize={1.5}
                    roundness={0.5}
                    borderSize={0}
                    circleSize={0.3}
                    circleEdge={1}
                  />
                </div>
                <Card className="h-full relative z-10 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>



      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 py-12 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <div className="flex justify-center gap-6 mb-6">
            <Link to="/about" className="hover:text-slate-900 dark:hover:text-white transition-colors">About</Link>
            <Link to="/contact" className="hover:text-slate-900 dark:hover:text-white transition-colors">Contact</Link>
          </div>
          <p className="mb-4 max-w-2xl mx-auto">
            <strong>Note:</strong> Nirog Ai is a clinical decision support tool.
            Not intended for replacing professional medical advice.
          </p>
          <p>© 2026 Nirog Ai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
