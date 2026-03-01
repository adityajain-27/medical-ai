import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useAuth } from './useAuth';

const NODE_BASE_URL = import.meta.env.VITE_NODE_URL || 'http://localhost:5000';

interface CreditContextType {
    credits: number | null;
    loading: boolean;
    isDoctor: boolean;
    deductCredits: () => Promise<{ success: boolean; insufficientCredits: boolean }>;
    addCredits: (packageId: string) => Promise<{ added: number; credits: number }>;
    refreshCredits: () => Promise<void>;
}

const CreditContext = createContext<CreditContextType | null>(null);

export function CreditProvider({ children }: { children: ReactNode }) {
    const { token, user } = useAuth();
    const isDoctor = user?.role === 'doctor';
    const [credits, setCredits] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshCredits = useCallback(async () => {
        // Doctors don't use the credit system
        if (!token || isDoctor) { setCredits(null); return; }
        setLoading(true);
        try {
            const res = await fetch(`${NODE_BASE_URL}/api/credits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
                setCredits(data.credits);
            }
        } catch {
            // silently fail — credits will show null
        } finally {
            setLoading(false);
        }
    }, [token, isDoctor]);

    useEffect(() => {
        refreshCredits();
    }, [refreshCredits]);

    const deductCredits = async (): Promise<{ success: boolean; insufficientCredits: boolean }> => {
        // Doctors never need credits
        if (isDoctor) return { success: true, insufficientCredits: false };
        if (!token) return { success: false, insufficientCredits: false };
        try {
            const res = await fetch(`${NODE_BASE_URL}/api/credits/deduct`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            });
            // 402 = truly not enough credits
            if (res.status === 402) return { success: false, insufficientCredits: true };
            // Any other error — don't block the user, just skip deduction locally
            if (!res.ok) {
                console.warn('Credit deduction failed with status', res.status, '— proceeding without deduction');
                return { success: true, insufficientCredits: false };
            }
            const data = await res.json();
            setCredits(data.credits);
            return { success: true, insufficientCredits: false };
        } catch (err) {
            console.warn('Credit deduction network error — proceeding without deduction', err);
            return { success: true, insufficientCredits: false };
        }
    };

    const addCredits = async (packageId: string) => {
        if (!token) throw new Error('Not authenticated');
        const res = await fetch(`${NODE_BASE_URL}/api/credits/buy`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ packageId }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Purchase failed');
        }
        const data = await res.json();
        setCredits(data.credits);
        return { added: data.added, credits: data.credits };
    };

    return (
        <CreditContext.Provider value={{ credits, loading, isDoctor, deductCredits, addCredits, refreshCredits }}>
            {children}
        </CreditContext.Provider>
    );
}

export function useCredits() {
    const ctx = useContext(CreditContext);
    if (!ctx) throw new Error('useCredits must be used within CreditProvider');
    return ctx;
}
