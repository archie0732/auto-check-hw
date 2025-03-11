'use client';

import { AppStore } from '@/store/app';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { PenBox, UserRoundSearch } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const LoginButton = () => {
  const router = useRouter();
  const { username, userID, avatar } = AppStore();
  void username;
  return (
    <div className="flex justify-center">
      {
        userID === 'none'
          ? <Button variant="outline" onClick={() => router.push('/login')}>Login</Button>
          : (
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img
                    src={avatar}
                    className="flex h-8 w-8 rounded-full border-2"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <div className="flex items-center justify-between p-2">
                    <img
                      src={avatar}
                      className="h-10 w-10 rounded-full border-2"
                    />
                    <span className="font-bold">{username}</span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex gap-1 text-sm no-underline" onClick={() => router.push(`/profile/${userID}`)}>
                    <UserRoundSearch size={20} />
                    個人檔案
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/issue')}>
                    <PenBox />
                    問題回報
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )
      }
    </div>
  );
};
