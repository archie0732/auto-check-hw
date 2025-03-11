'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { DarkModeButton } from '@/components/button/dark-mode';
import { LoginButton } from './login-button';

const headerOptions: { name: string; link: string }[] = [
  { name: '作業列表', link: '/hw' },
  { name: 'API', link: '/api' },
  { name: '關於', link: '/about' },
  { name: '設定', link: '/settings' },
];

export function AppHeader() {
  const [floating, setFloating] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const isFloating = window.scrollY != 0;
      if (floating != isFloating) {
        setFloating(isFloating);
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [floating]);

  return (
    <div
      className={`
        data-[floating]:border-border/40 data-[floating]:bg-background/80
        data-[floating]:backdrop-blur
        fixed top-0 right-0 left-0 z-50 flex h-16 border-b border-transparent
        px-8 py-2 transition-all
      `}
      data-floating={floating || null}
    >
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="font-bold"
            >
              作業繳交
            </Link>
            <ul className="flex items-center gap-4">
              {headerOptions.map((option) => (
                <Link href={option.link} key={option.name}>
                  {option.name}
                </Link>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2">
          <LoginButton />
          <DarkModeButton />
        </div>
      </div>
    </div>
  );
}
