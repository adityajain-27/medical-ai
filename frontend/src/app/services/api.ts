const AI_BASE_URL = 'http://localhost:8000';
const NODE_BASE_URL = 'http://localhost:5000';

export interface AIResult {
    triage: {
        color: 'RED' | 'YELLOW' | 'GREEN';
        urgency_score: number;
        label: string;
        reason: string;
    };
    soap_note: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    };
    conditions: Array<{
        name: string;
        probability: string;
        icd_code: string;
    }>;
    red_flags: string[];
    disclaimer: string;
    drug_interactions: string[];
}

// ── Helper ──
function authHeaders(token: string) {
    return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

// ── AI endpoints ──
export async function analyzeSymptoms(
    symptoms: string,
    medications: string[] = [],
    followupAnswers: Record<string, string> = {}
): Promise<AIResult> {
    const response = await fetch(`${AI_BASE_URL}/assess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, medications, followup_answers: followupAnswers }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.detail || `AI service error: ${response.status}`);
    }
    return response.json();
}

export async function analyzeSymptomsWithImage(
    symptoms: string,
    medications: string[] = [],
    imageFile: File
): Promise<AIResult> {
    const formData = new FormData();
    formData.append('symptoms', symptoms);
    formData.append('medications', medications.join(','));
    formData.append('image', imageFile);
    const response = await fetch(`${AI_BASE_URL}/assess/image`, {
        method: 'POST',
        body: formData,
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.detail || `AI service error: ${response.status}`);
    }
    return response.json();
}

export async function getFollowupQuestions(
    symptoms: string,
    medications: string[] = []
): Promise<string[]> {
    const response = await fetch(`${AI_BASE_URL}/followup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms, medications }),
    });
    if (!response.ok) return [];
    const data = await response.json();
    return data.questions || [];
}

export async function chatWithAI(
    message: string,
    history: Array<{ role: string; content: string }> = []
): Promise<string> {
    const response = await fetch(`${AI_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history }),
    });
    if (!response.ok) return 'Sorry, I could not connect to the AI service.';
    const data = await response.json();
    return data.reply || 'No response.';
}

// ── Auth ──
export async function login(email: string, password: string) {
    const response = await fetch(`${NODE_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Invalid credentials');
    return response.json();
}

export async function register(
    name: string,
    email: string,
    password: string,
    role: string,
    extras?: { position?: string; qualification?: string }
) {
    const response = await fetch(`${NODE_BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, ...extras }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err?.message || 'Registration failed');
    }
    return response.json();
}

export async function saveAssessment(token: string, symptoms: string, _result: AIResult) {
    const response = await fetch(`${NODE_BASE_URL}/api/assess`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ symptoms, medications: [] }),
    });
    return response.ok ? response.json() : null;
}

export async function getUserProfile(token: string) {
    const res = await fetch(`${NODE_BASE_URL}/api/auth/me`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to load profile');
    return res.json();
}

export async function getAssessmentHistory(token: string) {
    const res = await fetch(`${NODE_BASE_URL}/api/assess/history`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to load history');
    return res.json();
}

// ── Credits ──
export async function getCredits(token: string): Promise<{ credits: number; packages: Array<{ id: string; credits: number; price: number; label: string }> }> {
    const res = await fetch(`${NODE_BASE_URL}/api/credits`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to load credits');
    return res.json();
}

export async function buyCredits(token: string, packageId: string): Promise<{ credits: number; added: number; message: string }> {
    const res = await fetch(`${NODE_BASE_URL}/api/credits/buy`, {
        method: 'POST',
        headers: authHeaders(token),
        body: JSON.stringify({ packageId }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Purchase failed');
    }
    return res.json();
}

// ── Doctor API ──
export async function getDoctorStats(token: string) {
    const res = await fetch(`${NODE_BASE_URL}/api/doctor/stats`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to load stats');
    return res.json();
}

export async function getDoctorPatients(token: string) {
    const res = await fetch(`${NODE_BASE_URL}/api/doctor/patients`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to load patients');
    return res.json();
}

export async function getPatientAssessments(token: string, patientId: string) {
    const res = await fetch(`${NODE_BASE_URL}/api/doctor/patients/${patientId}/assessments`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to load assessments');
    return res.json();
}

export async function getAssessmentById(token: string, assessmentId: string) {
    const res = await fetch(`${NODE_BASE_URL}/api/assess/${assessmentId}`, { headers: authHeaders(token) });
    if (!res.ok) throw new Error('Failed to load assessment');
    return res.json();
}
