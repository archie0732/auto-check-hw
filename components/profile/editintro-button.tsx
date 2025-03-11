'use client';

import { Loader2, PenBox } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { useState } from 'react';
import { AppStore } from '@/store/app';
import { toast } from 'sonner';
import { Button } from '../ui/button';

interface Props {
  profileID: string;
}

export function EditIntro({ profileID }: Props) {
  const [intro, setIntro] = useState('');
  const [loading, setLoading] = useState(false);
  const { userID } = AppStore();

  if (profileID !== userID) return (<div />);

  const submit = async () => {
    setLoading(true);
    const res = await fetch(`/api/profile/${userID}/update`, { method: 'POST', body: JSON.stringify({ type: 'intro', uploadData: intro }) });

    if (!res.ok) {
      toast.error(`更新資料時發生錯誤`, { description: `${await res.json()}` });
      setLoading(false);
    }

    toast.success('更新成功，請刷新畫面查看');
    setLoading(false);
  };
  return (
    <Dialog>
      <DialogTrigger>
        <PenBox />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            編輯自我介紹
          </DialogTitle>
        </DialogHeader>
        <Input placeholder="填寫你現在的心情" type="text" value={intro} onChange={(e) => setIntro(e.target.value)} />
        <div className="flex justify-end">
          <Button onClick={() => void submit()} disabled={loading}>
            {loading
              ? (
                  <Loader2 className="animate-spin" />
                )
              : '儲存'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
