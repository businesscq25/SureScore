'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { QuestionMode } from '@/lib/types';
import { getDarkMode, setDarkMode, getQuestionMode, setQuestionMode } from '@/lib/storage';

interface ThemeContextValue {
  dark: boolean;
  toggleDark: () => void;
  mode: QuestionMode;
  setMode: (m: QuestionMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  dark: false,
  toggleDark: () => {},
  mode: 'mid',
  setMode: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mode, setModeState] = useState<QuestionMode>('mid');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDark(getDarkMode());
    setModeState(getQuestionMode());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.documentElement.classList.toggle('dark', dark);
  }, [dark, mounted]);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    setDarkMode(next);
  };

  const handleSetMode = (m: QuestionMode) => {
    setModeState(m);
    setQuestionMode(m);
  };

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleDark, mode, setMode: handleSetMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
