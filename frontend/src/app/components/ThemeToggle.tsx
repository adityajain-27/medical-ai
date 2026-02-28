import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    // Ensure mounted state so we don't get hydration mismatch, optional but a good practice
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-full opacity-0">
                <span className="sr-only">Toggle theme</span>
            </Button>
        );
    }

    const isDark = theme === 'dark';

    return (
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm"
                aria-label="Toggle theme"
            >
                {isDark ? (
                    <Sun className="h-[1.2rem] w-[1.2rem] transition-all" />
                ) : (
                    <Moon className="h-[1.2rem] w-[1.2rem] transition-all" />
                )}
            </Button>
        </motion.div>
    );
}
