'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppStore } from '@/store/app';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { StudentProfileData } from '../api/profile/_model/apitype';

export default function Page() {
  const { userID, setUserID, setAvatar, setUserName } = AppStore();
  const [studentID, setStudentID] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    if (studentID === '') {
      toast.warning('請輸入學號', { description: '你輸入的學號為空' });
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/profile/${studentID}`);

    if (!res.ok) {
      toast.error(`登入失敗，未找到使用者: ${studentID}`, { description: '請確認輸入學號是否正確，如果還是錯誤請來507找我' });
      setLoading(false);
      return;
    }

    const profile = await res.json() as StudentProfileData;

    toast.success('登入成功!');
    setAvatar(profile.student.avatar);
    setUserID(profile.student.id);
    setUserName(profile.student.name);
    setLoading(false);
  };

  if (userID !== 'none') {
    return (
      <div className={`
        m-10 flex items-center justify-center rounded-xl border-2 p-4
      `}
      >
        <div className="flex flex-col">
          <span className="text-center text-xl font-bold">你已經登入了</span>
          <img className="m-4 h-80 w-60 rounded-xl object-cover" src="https://p3-pc-sign.douyinpic.com/tos-cn-i-0813/o0iWHPjvkQGiBBIAbxCBAA4TAZlIAH07ESzRJ~tplv-dy-aweme-images:q75.webp?biz_tag=aweme_images&from=327834062&lk3s=138a59ce&s=PackSourceEnum_SEARCH&sc=image&se=false&x-expires=1744185600&x-signature=x%2Fqbf32JcYqjjyYkiqsR1H%2F75Es%3D" />
          <div className="flex items-end justify-end text-sm underline">圖源: pixiv</div>
        </div>
      </div>
    );
  }

  return (
    <Card className="m-10">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>一台電腦只能登入一個人的帳號!，不要在自己的電腦登入別人的帳號!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <span className="font-bold">學號</span>
        </div>
        <Input
          placeholder="你的學號"
          value={studentID}
          onChange={(e) => setStudentID(e.target.value)}
        />
        <div className="mt-2 flex justify-end">
          {loading ? <Button disabled><Loader2 className="animate-spin" /></Button> : <Button onClick={() => void login()}>登入</Button>}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col">
          <span className="font-bold">注意事項</span>
          <div className="flex flex-col text-sm text-gray-500">
            <span>- 不要用自己的電腦登其他人的帳號，抓到直接0分!</span>
            <span>- 有任何問題請至主顧507找我</span>
            <span>- 本次廢除遲交扣分問題，只要於計算總分前繳交都不扣分</span>
            <span>- 使用AI或參考其他人的程式碼，只要通過都算過</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
