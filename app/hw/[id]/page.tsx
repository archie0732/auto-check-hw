'use client';

export const dynamic = 'force-dynamic';
import Markdown from '@/components/md/md-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HandoutTab } from '@/components/hw/hw-submit';
import { HwDetailData } from '@/app/api/md/[slug]/route';
import { useEffect, useState } from 'react';
import { AppStore } from '@/store/app';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NextRequest } from 'next/server';

interface ApiResponse {
  success: boolean;
  data: HwDetailData;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

function HomeworkStatusEditor({ hwId }: { hwId: string }) {
  const { userID } = AppStore();
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userID || userID === 'none') return;
    fetch(`/api/profile/${userID}`)
      .then(res => res.json())
      .then(data => {
        const student = data.data?.student;
        if (Array.isArray(student?.hw)) {
          const idx = Number(hwId.replace('hw-', '')) - 1;
          setStatus(student.hw[idx] ?? '');
        }
      });
  }, [userID, hwId]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setLoading(true);
    try {
      const idx = Number(hwId.replace('hw-', '')) - 1;
      const res = await fetch(`/api/profile/${userID}/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'hw', hw: idx, uploadData: newStatus }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        toast.error(result?.data?.message || '儲存失敗');
      } else {
        setStatus(newStatus);
        toast.success('狀態已更新');
      }
    } catch (e: any) {
      toast.error(e.message || '儲存失敗');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <label className="block mb-2 text-cyan-300 font-semibold">作業狀態</label>
      <select
        className={`
          bg-black/80 border border-cyan-400/30 rounded px-3 py-2
          focus:outline-none focus:ring-2 focus:ring-cyan-400
          ${status === '1' ? 'text-green-400' : 'text-red-400'}
          shadow-[0_0_8px_#0ff4,0_0_16px_#0ff2]
          transition
        `}
        value={status}
        onChange={handleChange}
        disabled={loading}
      >
        <option value="">未繳交</option>
        <option value="-1">未通過</option>
        <option value="1">已完成</option>
      </select>
    </div>
  );
}

function EditStudentHwStatus() {
  const [studentId, setStudentId] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [hwStatus, setHwStatus] = useState<string[]>([]);
  const [error, setError] = useState('');

  // 查詢 profile
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    setProfile(null);
    try {
      const res = await fetch(`/api/profile/${studentId}`);
      if (!res.ok) throw new Error('查無此 id');
      const data = await res.json();
      const student = data.data?.student;
      setProfile(student);
      if (Array.isArray(student?.hw)) {
        setHwStatus([...student.hw]);
      } else {
        setHwStatus([]);
      }
    } catch (e: any) {
      setError(e.message || '查詢失敗');
    } finally {
      setLoading(false);
    }
  };

  // 修改本地狀態
  const handleChange = (idx: number, value: string) => {
    setHwStatus(prev => prev.map((s, i) => i === idx ? value : s));
  };

  // 儲存
  const handleSave = async () => {
    setLoading(true);
    try {
      for (let idx = 0; idx < hwStatus.length; idx++) {
        const res = await fetch(`/api/profile/${studentId}/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'hw', hw: idx, uploadData: hwStatus[idx] }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) {
          toast.error(result?.data?.message || `儲存失敗 (hw-${idx + 1})`);
          return;
        }
      }
      toast.success('儲存成功');
    } catch (e: any) {
      toast.error(e.message || '儲存失敗');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    if (status === '1') return 'text-green-400 font-bold';
    if (status === '') return 'text-red-400 font-bold';
    if (status === '-1') return 'text-orange-400 font-bold';
    return '';
  };

  return (
    <div className="my-6 p-4 bg-black/60 border border-cyan-400/20 rounded-xl">
      <div className="font-bold text-cyan-300 mb-2">查詢並修改學生作業狀態</div>
      <div className="flex gap-2 mb-2">
        <Input
          placeholder="請輸入學生 id"
          value={studentId}
          onChange={e => setStudentId(e.target.value)}
          disabled={loading}
        />
        <Button onClick={fetchProfile} disabled={loading || !studentId}>
          查詢
        </Button>
      </div>
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      {profile && hwStatus.length > 0 && (
        <div className="mt-2">
          <div className="mb-2 font-bold">作業狀態</div>
          <table className="w-full text-sm border border-cyan-500/30 rounded-xl overflow-hidden shadow-lg bg-black/60 backdrop-blur">
            <thead>
              <tr className="bg-gradient-to-r from-cyan-900/60 via-purple-900/60 to-blue-900/60">
                <th className="border-b border-cyan-400/30 px-2 py-2 text-cyan-300 font-semibold">作業</th>
                <th className="border-b border-cyan-400/30 px-2 py-2 text-cyan-300 font-semibold">狀態</th>
              </tr>
            </thead>
            <tbody>
              {hwStatus.map((status, idx) => (
                <tr key={idx} className="hover:bg-cyan-900/10 transition">
                  <td className="border-b border-cyan-400/10 px-2 py-2">
                    <span className="font-mono text-cyan-200">
                      {idx === 0 ? "作業 test" : `作業 ${idx}`}
                    </span>
                  </td>
                  <td className="border-b border-cyan-400/10 px-2 py-2">
                    <select
                      className={`bg-black/80 border border-cyan-400/30 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400 ${getStatusColor(status)} shadow-[0_0_8px_#0ff4,0_0_16px_#0ff2] transition`}
                      value={status}
                      onChange={e => handleChange(idx, e.target.value)}
                    >
                      <option value="">未繳交</option>
                      <option value="-1">未通過</option>
                      <option value="1">已完成</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button className="mt-4 w-full" onClick={handleSave} disabled={loading}>
            儲存
          </Button>
        </div>
      )}
    </div>
  );
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`${process.env.MYURL}/api/md/${id}`);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }

  const response = await res.json() as ApiResponse;

  if (!response.success || !response.data) {
    throw new Error('Failed to fetch homework details');
  }

  const { content, detail } = response.data;

  // 動態計算完成率
  let percent = 0;
  // Remove or comment out this block:
  // if (Array.isArray(detail.hw)) {
  //   const total = detail.hw.length;
  //   const finished = detail.hw.filter((s: string) => s === '1').length;
  //   percent = total > 0 ? Math.round((finished / total) * 100) : 0;
  // }

  return (
    <div className="my-8">
      <div className="my-4 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="text-cyan-300/80 font-mono text-sm">{detail.time}</div>
          <div className="text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm tracking-wide">
            {detail.name}
          </div>
        </div>
        <div className="relative w-32">
          <Progress
            value={0}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 border border-cyan-400/40 rounded-full h-3"
            barClassName="bg-cyan-400/80"
          />
        </div>
      </div>
      <Tabs defaultValue="detail">
        <TabsList className="bg-black/70 backdrop-blur border border-cyan-400/20 rounded-xl mb-4">
          <TabsTrigger value="detail" className="text-cyan-300 data-[state=active]:bg-cyan-900/40 data-[state=active]:text-white">題目</TabsTrigger>
          <TabsTrigger value="answer" className="text-purple-300 data-[state=active]:bg-purple-900/40 data-[state=active]:text-white">解答</TabsTrigger>
          <TabsTrigger value="handout" className="text-blue-300 data-[state=active]:bg-blue-900/40 data-[state=active]:text-white">提交</TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <Card className="bg-black/70 backdrop-blur border border-cyan-400/20 rounded-2xl">
            <CardContent>
              <Markdown>{content}</Markdown>
              <EditStudentHwStatus />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="answer">
          <Card className="bg-black/70 backdrop-blur border border-purple-400/20 rounded-2xl">
            <CardContent>
              解答尚未公布
            </CardContent>
          </Card>
        </TabsContent>

        <HandoutTab id={id} />
      </Tabs>
    </div>
  );
}
