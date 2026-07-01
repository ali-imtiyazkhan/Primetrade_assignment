'use client';

import { useState, useEffect } from 'react';

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('darkMode');
    if (stored === 'true' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem('darkMode', String(next));
    document.documentElement.classList.toggle('dark', next);
  }

  return (
    <button onClick={toggle} className="text-slate-300 hover:text-white transition cursor-pointer text-sm" title="Toggle dark mode">
      {dark ? '☀️ Light' : '🌙 Dark'}
    </button>
  );
}
