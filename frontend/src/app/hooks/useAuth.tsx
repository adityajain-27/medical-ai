import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'patient' | 'doctor';
    position?: string;
    qualification?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string, role: string, extras?: { position?: string; qualification?: string }) => Promise<void>;
    logout: () => void;
    isDoctor: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);
const NODE_BASE_URL = 'http://localhost:5000';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) { setLoading(false); return; }
        fetch(`${NODE_BASE_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(r => r.ok ? r.json() : Promise.reject())
            .then(data => { setUser(data.user); })
            .catch(() => { setToken(null); localStorage.removeItem('token'); })
            .finally(() => setLoading(false));
    }, [token]);

    const login = async (email: string, password: string) => {
        const res = await fetch(`${NODE_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Login failed');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const signup = async (name: string, email: string, password: string, role: string, extras?: { position?: string; qualification?: string }) => {
        const res = await fetch(`${NODE_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role, ...extras }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.message || 'Registration failed');
        }
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user, token, loading, login, signup, logout,
            isDoctor: user?.role === 'doctor',
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
