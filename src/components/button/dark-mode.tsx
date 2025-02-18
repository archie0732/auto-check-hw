'use client';

import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';

export function DarkModeButton() {
  const { setTheme } = useTheme();
  const trogggleTheme = () => {
    setTheme((theme) => theme === 'dark' ? 'light' : 'dark');
  };
  return (
    <Button onClick={trogggleTheme} variant="outline">
      <SunIcon className={`
        scale-100 transition-all
        dark:scale-0
      `}
      />
      <MoonIcon className={`
        absolute scale-0 transition-all
        dark:scale-100
      `}
      />
    </Button>
  );
}
