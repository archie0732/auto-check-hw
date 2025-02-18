'use client';

import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '../ui/button';
import { DarkModeButton } from '../button/dark-mode';

const headerOptions: { name: string; link: string }[] = [
  { name: '作業繳交', link: '/' },
  { name: '成績查看', link: '/hw' },
  { name: 'API', link: '/api' },
  { name: '關於TA', link: '/ta' },
  { name: '設定', link: '/settings' },
];

export function AppHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="relative">
      <div className={`
        mt-0 flex select-none items-center justify-between border p-2
      `}
      >
        <div className="flex items-center gap-2">
          <Button
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            variant="outline"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>

          <div className={`
            hidden items-center gap-2
            md:flex
          `}
          >
            {headerOptions.map((option) => (
              <Link href={option.link} key={option.name}>
                <div
                  className="p-2"

                >
                  {option.name}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <DarkModeButton />
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`
          absolute left-0 top-full w-full border-x border-b bg-white
          dark:bg-black
          md:hidden
        `}
        >
          {headerOptions.map((option) => (
            <Link
              href={option.link}
              key={option.name}
              onClick={toggleMobileMenu}
            >
              <div className={`
                border-t p-4
                dark:hover:bg-gray-800
                hover:bg-gray-100
              `}
              >
                {option.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
