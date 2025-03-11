'use client';
import { AppStore } from '@/store/app';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Props {
  profileID: string;
}

export function EditProfileButton({ profileID }: Props) {
  const [newusername, setNewuserName] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const { userID, username, avatar, setUserName, setAvatar } = AppStore();

  const submit = async (type: 'name' | 'avatar') => {
    if (profileID !== userID) return;
    setLoading(true);

    const res = await fetch(`/api/profile/${userID}/update`, { method: 'POST', body: JSON.stringify({ type: type, uploadData: type === 'name' ? newusername : newAvatar }) });

    if (!res.ok) {
      toast.error('登入時發生問題', { description: res.statusText });
      setLoading(false);
      return;
    }
    toast('修改成功，請刷新頁面查看');
    setLoading(false);

    if (type === 'name') {
      setUserName(newusername);
    }
    else {
      setAvatar(newAvatar);
    }
  };

  if (profileID !== userID) {
    return (<div />);
  }

  return (
    <Dialog>
      <DialogTrigger disabled={profileID !== userID}>
        <div className={`
          mt-5 rounded-lg border
          hover:bg-gray-300
          dark:bg-gray-900 dark:hover:bg-gray-800
        `}
        >
          編輯
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>編輯</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="username">
          <TabsList>
            <TabsTrigger value="username">編輯名稱</TabsTrigger>
            <TabsTrigger value="avatar">變更頭像</TabsTrigger>
          </TabsList>

          <TabsContent value="username" className="rounded-lg p-2">
            <span>使用者名稱</span>
            <Input placeholder={username} className="mt-2 mb-2" value={newusername} onChange={(e) => setNewuserName(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={() => void submit('name')}>
                {loading ? <Loader2 className="animate-spin" /> : '儲存'}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="avatar" className="rounded-lg p-2">
            <span>頭像連結</span>
            <Input placeholder={avatar} value={newAvatar} onChange={(e) => setNewAvatar(e.target.value)} />
            <div className="mt-2">
              <span>預覽</span>
              <img
                src={newAvatar === '' ? avatar : newAvatar}
                className="mt-2 h-40 w-40 rounded-full border-4 object-cover"
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => void submit('avatar')} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : '儲存'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
