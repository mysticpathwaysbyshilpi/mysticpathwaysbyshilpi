'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import en from '../locales/en.json';
import hi from '../locales/hi.json';

type Language = 'en' | 'hi';
type Theme = 'pink' | 'gold' | 'dark' | 'mint';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  t: (path: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const dictionaries = { en, hi };

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('pink');

  // Initialize from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    const savedTheme = localStorage.getItem('theme') as Theme;

    if (savedLanguage) setLanguage(savedLanguage);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'pink');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = dictionaries[language];
    for (const key of keys) {
      if (current && current[key]) {
        current = current[key];
      } else {
        return path;
      }
    }
    return current;
  };

  return (
    <AppContext.Provider value={{ language, setLanguage: handleSetLanguage, theme, setTheme: handleSetTheme, t }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
