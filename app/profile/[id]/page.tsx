import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { CheckCircle, XCircle, PenLineIcon, User } from 'lucide-react';
import Link from 'next/link';
import { AvatarImage } from '@/components/ui/avatar';

interface ProfileResponse {
  success: boolean;
  data: {
    student: {
      id: string;
      intro: string;
      avatar: string;
      hw: string[];
      name: string;
      root: boolean;
    }
  }
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  let profile: ProfileResponse['data']['student'] | null = null;
  let error = '';

  try {
    const res = await fetch(`${process.env.MYURL}/api/profile/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('找不到這個使用者');
    const json = await res.json();
    console.log('API 回傳:', json);
    if (!json.data || !json.data.student) throw new Error('API 回傳格式錯誤');
    profile = json.data.student;
  } catch (e: any) {
    error = e.message || '取得個人資料時發生錯誤';
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <Card className="w-full max-w-lg bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-red-400 text-center py-8">{error}</div>
            <div className="flex justify-center mt-4">
              <Link href="/">
                <span className="text-blue-400 hover:underline">回首頁</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile || !Array.isArray(profile.hw)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
        <Card className="w-full max-w-lg bg-gray-800/60 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/70 text-center py-8">資料異常或載入中...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sci-fi style avatar fallback
  const avatarUrl = profile.avatar || '/avatar.jpg';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 py-10">
      <div className="container mx-auto max-w-3xl">
        <Card className="bg-gray-800/60 border-gray-700 shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <AvatarImage
                src={avatarUrl}
                alt="avatar"
                className="h-32 w-32 rounded-full border-4 border-blue-500 shadow-lg object-cover bg-gray-900"
              />
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center space-x-2">
                  <User className="w-7 h-7 text-blue-400" />
                  <span>{profile.name}</span>
                  {profile.root && <span className="ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-purple-500 to-blue-500 text-xs text-white font-semibold">Admin</span>}
                </h1>
                <div className="text-blue-300 mt-2 text-sm">ID: {profile.id}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mt-6 mb-8 p-6 rounded-lg bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 shadow-inner">
              <div className="flex items-center mb-2">
                <PenLineIcon className="w-5 h-5 text-blue-400 mr-2" />
                <span className="text-lg text-white font-semibold">自我介紹</span>
              </div>
              <div className="text-white/80 text-base min-h-[2rem]">
                {profile.intro ? profile.intro.split('\n').map((line, i) => (
                  <p key={i} className="mb-1">{line}</p>
                )) : <span className="text-gray-400">這個人什麼都沒寫</span>}
              </div>
            </div>
            <div className="mb-2 text-xl font-bold text-white">作業繳交狀況</div>
            <div className="overflow-x-auto rounded-lg p-4 bg-gray-900/40 border border-blue-900/30">
              <table className="min-w-full text-center text-sm text-white">
                <thead>
                  <tr>
                    {profile.hw.map((_, index) => (
                      <th key={index} className="px-3 py-2 hover:underline">
                        <Link href={index === 0 ? '/hw/hw-test' : `/hw/hw${index}`}>
                          {index === 0 ? '測試作業' : `作業${index}`}
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {profile.hw.map((status, index) => (
                      <td key={index} className="px-3 py-2">
                        <Link href={index === 0 ? '/hw/hw-test' : `/hw/hw${index}`}>
                          {status === '1'
                            ? <CheckCircle className="mx-auto h-5 w-5 text-green-400" />
                            : <XCircle className="mx-auto h-5 w-5 text-red-400" />}
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
