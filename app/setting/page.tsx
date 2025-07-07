import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, ArrowRight, Info } from 'lucide-react';

export default function SettingPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-[#181c2f] via-[#23274a] to-[#1a1d2e] py-12">
      <div className="relative w-full max-w-md p-8 rounded-3xl bg-black/80 backdrop-blur-xl border border-cyan-400/30 shadow-xl overflow-hidden">
        {/* 霓虹光暈 */}
        <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-500 rounded-3xl blur-lg opacity-40 pointer-events-none animate-pulse" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-cyan-400 drop-shadow" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent tracking-wide neon-text">系統設定</h1>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-cyan-300" />
            <span className="text-cyan-200 font-medium">作者：</span>
            <span className="text-cyan-100 font-mono">archie0732</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-purple-300" />
            <span className="text-purple-200 font-medium">版本：</span>
            <span className="text-purple-100 font-mono">v2.0.13</span>
          </div>
          <div className="border-t border-cyan-400/20 my-6" />
          <Link href="/admin" passHref legacyBehavior>
            <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-xl py-3 shadow-lg hover:from-cyan-400 hover:to-blue-400 hover:scale-105 transition-all flex items-center justify-center gap-2">
              <Settings className="w-5 h-5 mr-1" />
              前往管理員設定
              <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </Link>
          <div className="mt-8 text-xs text-gray-400 text-center select-none">
            &copy; {new Date().getFullYear()} archie0732. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
