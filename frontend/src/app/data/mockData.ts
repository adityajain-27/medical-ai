export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export type SubscriptionPlan = 'FREE' | 'STARTER' | 'PRO';

export interface Condition {
  name: string;
  probability: number;
  description?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  riskLevel: RiskLevel;
  lastVisit: string;
  symptoms: string;
  conditions?: Condition[];
  confidenceScore?: number;
  redFlags?: string[];
  recommendedTests?: string[];
  soapNote?: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  status?: 'pending' | 'reviewed' | 'completed';
  priority?: number;
  doctorNotes?: string;
}

export interface HealthEntry {
  date: string;
  riskLevel: RiskLevel;
  condition: string;
  symptoms: string;
}

export interface SubscriptionInfo {
  plan: SubscriptionPlan;
  reportsUsed: number;
  reportsLimit: number | null; // null means unlimited
  nextBillingDate: string;
  price: number;
  status: 'active' | 'cancelled' | 'expired';
}

export interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
  downloadUrl?: string;
}

export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  subscription: SubscriptionInfo;
}

// Doctor profile data
export const mockDoctorProfile: DoctorProfile = {
  id: 'DR-1001',
  name: 'Dr. James Anderson',
  email: 'james.anderson@nirog.ai',
  specialty: 'Emergency Medicine',
  licenseNumber: 'MED-234567',
  subscription: {
    plan: 'STARTER',
    reportsUsed: 43,
    reportsLimit: 100,
    nextBillingDate: '2026-03-27',
    price: 999,
    status: 'active',
  },
};

// Subscription plans
export const subscriptionPlans = [
  {
    name: 'Starter',
    price: 999,
    currency: '₹',
    interval: 'month',
    features: [
      '100 patient analyses per month',
      'Basic dashboard access',
      'Risk prioritization',
      'SOAP note generation',
      'Email support',
      'Export reports',
    ],
    reportsLimit: 100,
    popular: false,
  },
  {
    name: 'Pro',
    price: 2499,
    currency: '₹',
    interval: 'month',
    features: [
      'Unlimited patient analyses',
      'Advanced analytics dashboard',
      'Priority support (24/7)',
      'Custom integrations',
      'API access',
      'Team collaboration',
      'Advanced reporting',
    ],
    reportsLimit: null,
    popular: true,
  },
];

// Invoice history
export const mockInvoices: Invoice[] = [
  {
    id: 'INV-2026-02',
    date: '2026-02-01',
    amount: 999,
    status: 'paid',
    plan: 'Starter Plan',
  },
  {
    id: 'INV-2026-01',
    date: '2026-01-01',
    amount: 999,
    status: 'paid',
    plan: 'Starter Plan',
  },
  {
    id: 'INV-2025-12',
    date: '2025-12-01',
    amount: 999,
    status: 'paid',
    plan: 'Starter Plan',
  },
];

export const mockPatients: Patient[] = [
  {
    id: 'PT-2847',
    name: 'Sarah Martinez',
    age: 34,
    gender: 'Female',
    riskLevel: 'HIGH',
    lastVisit: '2026-02-26 09:15 AM',
    symptoms: 'Severe chest pain radiating to left arm, shortness of breath, cold sweats',
    confidenceScore: 94,
    status: 'pending',
    priority: 1,
    conditions: [
      { name: 'Acute Myocardial Infarction', probability: 87 },
      { name: 'Unstable Angina', probability: 78 },
      { name: 'Pulmonary Embolism', probability: 45 },
    ],
    redFlags: [
      'Chest pain with radiation to arm',
      'Associated diaphoresis',
      'Elevated cardiac risk profile',
    ],
    recommendedTests: [
      'ECG (STAT)',
      'Troponin I/T',
      'Complete Blood Count',
      'Chest X-Ray',
      'Cardiac Catheterization',
    ],
    soapNote: {
      subjective: '34-year-old female presenting with acute onset severe chest pain radiating to left arm, associated with shortness of breath and diaphoresis. Symptoms began 45 minutes ago. Patient reports no prior cardiac history.',
      objective: 'BP: 145/92 mmHg, HR: 102 bpm, RR: 22/min, SpO2: 94% on room air. Patient appears anxious and in distress. Diaphoretic. Cardiac exam reveals regular tachycardia, no murmurs. Lungs clear bilaterally.',
      assessment: 'Acute coronary syndrome - likely acute myocardial infarction. High-risk presentation with classic symptoms and radiation pattern.',
      plan: 'IMMEDIATE: ECG, IV access, oxygen therapy, aspirin 325mg, nitroglycerin SL. STAT troponin, CBC, BMP. Cardiology consult. Consider thrombolytic therapy vs. cardiac catheterization. Admit to CCU.',
    },
  },
  {
    id: 'PT-2891',
    name: 'Michael Chen',
    age: 42,
    gender: 'Male',
    riskLevel: 'MEDIUM',
    lastVisit: '2026-02-26 08:30 AM',
    symptoms: 'Persistent headache for 3 days, blurred vision, nausea',
    confidenceScore: 82,
    status: 'reviewed',
    priority: 3,
    conditions: [
      { name: 'Migraine with Aura', probability: 72 },
      { name: 'Hypertensive Crisis', probability: 65 },
      { name: 'Intracranial Mass', probability: 28 },
    ],
    redFlags: [
      'New onset visual disturbances',
      'Persistent severe headache',
    ],
    recommendedTests: [
      'Blood Pressure Monitoring',
      'CT Head (non-contrast)',
      'Complete Metabolic Panel',
      'Ophthalmology Consult',
    ],
    soapNote: {
      subjective: '42-year-old male with 3-day history of severe bifrontal headache, associated with blurred vision and episodic nausea. No vomiting. Patient denies fever, trauma, or similar episodes in the past.',
      objective: 'BP: 168/98 mmHg, HR: 88 bpm, Temp: 98.6°F. Alert and oriented. Visual acuity slightly reduced bilaterally. Neurological exam unremarkable - no focal deficits. Fundoscopic exam shows mild papilledema.',
      assessment: 'Severe headache with hypertension and visual changes. Differential includes hypertensive emergency vs. migraine vs. intracranial pathology.',
      plan: 'Blood pressure management with labetalol. CT head to rule out mass lesion. Ophthalmology referral for formal fundoscopic evaluation. Consider LP if CT negative. Anti-hypertensive optimization.',
    },
    doctorNotes: 'Patient responded well to BP management. Scheduled for CT scan tomorrow morning.',
  },
  {
    id: 'PT-2765',
    name: 'Jennifer Thompson',
    age: 28,
    gender: 'Female',
    riskLevel: 'LOW',
    lastVisit: '2026-02-25 02:45 PM',
    symptoms: 'Mild sore throat, runny nose, fatigue for 2 days',
    confidenceScore: 91,
    status: 'completed',
    priority: 5,
    conditions: [
      { name: 'Upper Respiratory Infection', probability: 89 },
      { name: 'Viral Pharyngitis', probability: 85 },
      { name: 'Allergic Rhinitis', probability: 42 },
    ],
    redFlags: [],
    recommendedTests: [
      'Rapid Strep Test',
      'Complete Blood Count (if symptoms worsen)',
    ],
    soapNote: {
      subjective: '28-year-old female with 2-day history of sore throat, rhinorrhea, and fatigue. No fever. Symptoms started gradually. No exposure to sick contacts. Denies difficulty breathing or swallowing.',
      objective: 'Temp: 98.2°F, BP: 118/76 mmHg, HR: 72 bpm. Pharynx mildly erythematous without exudate. Nasal mucosa congested. Lungs clear. No lymphadenopathy.',
      assessment: 'Viral upper respiratory infection - low complexity case.',
      plan: 'Symptomatic treatment with rest, hydration, acetaminophen as needed. Throat lozenges. Return if symptoms worsen or fever develops. Expected duration 5-7 days.',
    },
    doctorNotes: 'Standard URI. Patient advised to rest and return if fever develops.',
  },
  {
    id: 'PT-2910',
    name: 'Robert Williams',
    age: 67,
    gender: 'Male',
    riskLevel: 'HIGH',
    lastVisit: '2026-02-26 10:00 AM',
    symptoms: 'Sudden onset confusion, right-sided weakness, slurred speech',
    confidenceScore: 96,
    status: 'pending',
    priority: 1,
    conditions: [
      { name: 'Acute Ischemic Stroke', probability: 92 },
      { name: 'Hemorrhagic Stroke', probability: 78 },
      { name: 'Transient Ischemic Attack', probability: 65 },
    ],
    redFlags: [
      'Sudden neurological deficit',
      'Facial droop',
      'Speech impairment',
      'Age > 65 with vascular risk factors',
    ],
    recommendedTests: [
      'CT Head STAT',
      'MRI Brain with DWI',
      'Carotid Doppler Ultrasound',
      'ECG',
      'Coagulation Panel',
    ],
    soapNote: {
      subjective: '67-year-old male brought in by EMS with sudden onset right-sided weakness and confusion started 90 minutes ago. Wife reports patient was normal this morning, then suddenly developed slurred speech and inability to move right arm.',
      objective: 'BP: 180/105 mmHg, HR: 88 bpm irregular, Temp: 98.4°F. NIHSS Score: 12. Right facial droop present. Right upper extremity strength 2/5. Speech slurred. Alert but disoriented to time.',
      assessment: 'Acute stroke syndrome - likely left MCA territory ischemic stroke. Patient within thrombolytic window.',
      plan: 'STROKE CODE activated. STAT CT head to rule out hemorrhage. tPA candidate if no contraindications. Neurology and IR consult. Monitor neurological status q15min. Admit to stroke unit.',
    },
  },
  {
    id: 'PT-2654',
    name: 'Emily Rodriguez',
    age: 19,
    gender: 'Female',
    riskLevel: 'MEDIUM',
    lastVisit: '2026-02-25 04:20 PM',
    symptoms: 'Severe abdominal pain, fever, vomiting',
    confidenceScore: 85,
    status: 'reviewed',
    priority: 2,
    conditions: [
      { name: 'Acute Appendicitis', probability: 81 },
      { name: 'Ovarian Torsion', probability: 58 },
      { name: 'Ectopic Pregnancy', probability: 52 },
    ],
    redFlags: [
      'Right lower quadrant pain',
      'Rebound tenderness',
      'Fever',
    ],
    recommendedTests: [
      'CT Abdomen/Pelvis with Contrast',
      'Pregnancy Test',
      'Complete Blood Count',
      'Urinalysis',
      'Pelvic Ultrasound',
    ],
    doctorNotes: 'Surgery consult requested. Monitoring for appendicitis progression.',
  },
  {
    id: 'PT-2443',
    name: 'David Park',
    age: 55,
    gender: 'Male',
    riskLevel: 'LOW',
    lastVisit: '2026-02-24 11:30 AM',
    symptoms: 'Mild ankle swelling, minor pain after jogging',
    confidenceScore: 88,
    status: 'completed',
    priority: 5,
    conditions: [
      { name: 'Ankle Sprain', probability: 86 },
      { name: 'Tendinitis', probability: 68 },
      { name: 'Stress Fracture', probability: 25 },
    ],
    redFlags: [],
    recommendedTests: [
      'X-Ray Ankle (if severe pain)',
      'Physical Therapy Referral',
    ],
    doctorNotes: 'Minor sprain. RICE protocol prescribed.',
  },
];

export const mockHealthTimeline: HealthEntry[] = [
  {
    date: '2026-02-26',
    riskLevel: 'HIGH',
    condition: 'Acute Myocardial Infarction',
    symptoms: 'Severe chest pain, shortness of breath',
  },
  {
    date: '2026-02-15',
    riskLevel: 'MEDIUM',
    condition: 'Hypertension',
    symptoms: 'Elevated blood pressure, headache',
  },
  {
    date: '2026-01-28',
    riskLevel: 'LOW',
    condition: 'Upper Respiratory Infection',
    symptoms: 'Cough, runny nose',
  },
  {
    date: '2026-01-10',
    riskLevel: 'LOW',
    condition: 'Annual Checkup',
    symptoms: 'Routine examination',
  },
  {
    date: '2025-12-05',
    riskLevel: 'MEDIUM',
    condition: 'Acute Gastritis',
    symptoms: 'Abdominal pain, nausea',
  },
  {
    date: '2025-11-20',
    riskLevel: 'LOW',
    condition: 'Seasonal Allergies',
    symptoms: 'Sneezing, watery eyes',
  },
];

export const riskTrendData = [
  { date: 'Nov', score: 15 },
  { date: 'Dec', score: 35 },
  { date: 'Jan', score: 25 },
  { date: 'Feb', score: 75 },
];

// Analytics data for charts
export const monthlyPatientVolume = [
  { month: 'Oct', patients: 42, highRisk: 8 },
  { month: 'Nov', patients: 58, highRisk: 12 },
  { month: 'Dec', patients: 73, highRisk: 15 },
  { month: 'Jan', patients: 65, highRisk: 11 },
  { month: 'Feb', patients: 89, highRisk: 22 },
];

export const conditionDistribution = [
  { condition: 'Cardiovascular', count: 45, percentage: 28 },
  { condition: 'Respiratory', count: 32, percentage: 20 },
  { condition: 'Neurological', count: 28, percentage: 17 },
  { condition: 'Gastrointestinal', count: 25, percentage: 15 },
  { condition: 'Musculoskeletal', count: 20, percentage: 12 },
  { condition: 'Other', count: 13, percentage: 8 },
];