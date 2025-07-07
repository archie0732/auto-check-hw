'use client';

import { AppStore } from '@/store/app';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { PenBox, UserRoundSearch, LogIn } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const LoginButton = () => {
  const router = useRouter();
  const { username, userID, avatar } = AppStore();
  void username;
  return (
    <div className="flex justify-center">
      {
        userID === 'none'
          ? (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <Button
                variant="outline"
                onClick={() => router.push('/login')}
                className="relative bg-black/60 backdrop-blur-sm border-cyan-500/30 hover:border-cyan-400/60 text-cyan-400 hover:text-cyan-300 transition-all duration-300 cyber-button"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            </div>
          )
          : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="relative group cursor-pointer">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-full blur opacity-50 group-hover:opacity-75 transition duration-300 animate-pulse"></div>
                  <div className="relative w-10 h-10 rounded-full border-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors overflow-hidden">
                    <img
                      src={avatar || '/avatar.jpg'}
                      alt={username || 'User'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full opacity-0 group-hover:opacity-20 transition duration-300"></div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-cyan-500/30">
                <div className="flex items-center justify-between p-3 border-b border-cyan-500/20">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur opacity-30"></div>
                    <img
                      src={avatar || '/avatar.jpg'}
                      alt={username || 'User'}
                      className="relative h-10 w-10 rounded-full border-2 border-cyan-400/50 object-cover"
                    />
                  </div>
                  <span className="font-bold text-cyan-400 ml-3">{username}</span>
                </div>
                <DropdownMenuSeparator className="bg-cyan-500/20" />
                <DropdownMenuItem
                  className="flex gap-2 text-sm no-underline hover:bg-cyan-500/10 focus:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => router.push(`/profile/${userID}`)}
                >
                  <UserRoundSearch size={16} className="text-cyan-400" />
                  個人檔案
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex gap-2 text-sm hover:bg-cyan-500/10 focus:bg-cyan-500/10 text-gray-300 hover:text-cyan-400 transition-colors"
                  onClick={() => router.push('/issue')}
                >
                  <PenBox size={16} className="text-cyan-400" />
                  問題回報
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
      }
    </div>
  );
};
