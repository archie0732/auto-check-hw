'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Menu, X, BookOpen, Code, Users, Settings, Home } from 'lucide-react';

import { LoginButton } from './login-button';
import { AppStore } from '@/store/app';

const headerOptions: { name: string; link: string; icon: React.ReactNode }[] = [
  { name: '列表', link: '/hw', icon: <BookOpen className="w-4 h-4" /> },
  { name: '解題', link: '/slove', icon: <Code className="w-4 h-4" /> },
  { name: 'TA', link: '/about-ta', icon: <Users className="w-4 h-4" /> },
  { name: '設定', link: '/setting', icon: <Settings className="w-4 h-4" /> },
];

export function AppHeader() {
  const [floating, setFloating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { userID, avatar, username } = AppStore();

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

  // 關閉手機選單當點擊外部
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <div
        className={`
          data-[floating]:border-cyan-500/20 data-[floating]:bg-black/80
          data-[floating]:backdrop-blur-xl
          fixed top-0 right-0 left-0 z-50 flex h-16 border-b border-transparent
          px-4 lg:px-8 py-2 transition-all duration-300
          ${mobileMenuOpen ? 'hidden' : ''}
        `}
        data-floating={floating || null}
      >
        {/* 科幻背景效果 */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-purple-900/10 to-blue-900/10"></div>
        <div className="absolute inset-0 cyber-grid opacity-5"></div>

        <div className="relative z-10 flex flex-1 items-center justify-between">
          {/* 左側 - Logo 和桌面選單 */}
          <div className="flex items-center gap-2">
            {/* 手機端選單按鈕 */}
            <button
              className="mobile-menu-button lg:hidden relative p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-30"></div>
              {mobileMenuOpen ? (
                <X className="relative w-5 h-5 text-cyan-400" />
              ) : (
                <Menu className="relative w-5 h-5 text-cyan-400" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="font-bold text-lg relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                <span className="relative text-white group-hover:text-cyan-300 transition-colors">
                  作業繳交
                </span>
              </Link>

              {/* 桌面端選單 */}
              <ul className="hidden lg:flex items-center gap-6">
                {headerOptions.map((option) => (
                  <li key={option.name}>
                    <Link
                      href={option.link}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 group relative"
                    >
                      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                      <span className="relative text-gray-300 group-hover:text-cyan-400 transition-colors">
                        {option.icon}
                      </span>
                      <span className="relative text-gray-300 group-hover:text-cyan-400 transition-colors">
                        {option.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 右側 - 按鈕 */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <LoginButton />
            </Link>
          </div>
        </div>
      </div>

      {/* 手機端側邊選單 */}
      {mobileMenuOpen && (
        <div className="mobile-menu fixed inset-0 z-50 lg:hidden">
          {/* 背景遮罩 */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          ></div>

          {/* 側邊選單 */}
          <div className="absolute left-0 top-0 h-full w-80 bg-black/90 backdrop-blur-xl border-r border-cyan-500/30 transform transition-transform duration-300">
            {/* 選單背景效果 */}
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/20 via-purple-900/20 to-blue-900/20"></div>
            <div className="absolute inset-0 cyber-grid opacity-5"></div>

            <div className="relative z-10 p-6">
              {/* 右上角關閉按鈕 */}
              <button
                className="absolute top-4 right-4 p-2 rounded-full bg-white text-black hover:bg-gray-200 transition z-20"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="關閉選單"
              >
                <X className="w-6 h-6" />
              </button>
              {/* 選單標題 */}
              <div className="mb-8 flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-50 animate-pulse"></div>
                  <Home className="relative w-6 h-6 text-cyan-400" />
                </div>
                <span className="text-xl font-bold text-white">選單</span>
              </div>
              <div className="h-px bg-gradient-to-r from-cyan-500/50 to-transparent"></div>

              {/* 選單項目 */}
              <nav className="space-y-2">
                {headerOptions.map((option) => (
                  <Link
                    key={option.name}
                    href={option.link}
                    className="group relative block"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative flex items-center gap-3 p-4 rounded-xl border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover:bg-white/5">
                      <div className="relative">
                        <div className="absolute -inset-1 bg-cyan-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <span className="relative text-cyan-400 group-hover:text-cyan-300 transition-colors">
                          {option.icon}
                        </span>
                      </div>
                      <span className="text-gray-300 group-hover:text-cyan-400 transition-colors font-medium">
                        {option.name}
                      </span>
                    </div>
                  </Link>
                ))}
              </nav>

              {/* 用戶資訊區域 */}
              {userID !== 'none' && (
                <div className="mt-8 pt-6 border-t border-cyan-500/20">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-black/40 border border-cyan-500/20">
                    <div className="relative">
                      <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-50 animate-pulse"></div>
                      <img
                        src={avatar || '/avatar.jpg'}
                        alt={username || 'User'}
                        className="relative w-12 h-12 rounded-full border-2 border-cyan-400/50 object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-cyan-400 font-medium">{username || 'User'}</div>
                      <div className="text-gray-400 text-sm">已登入</div>
                    </div>
                  </div>
                </div>
              )}
              {/* 關閉選單按鈕 */}
              <button
                className="mt-8 w-full py-2 rounded bg-white text-black font-bold text-lg hover:bg-gray-200 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                關閉選單
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
