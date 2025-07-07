'use client';

export const dynamic = 'force-dynamic';
import Markdown from '@/components/md/md-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HandoutTab } from '@/components/hw/hw-submit';
import { HwDetailData } from '@/app/api/md/[slug]/route';
import { useEffect, useState } from 'react';

interface ApiResponse {
  success: boolean;
  data: HwDetailData;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const [id, setId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [data, setData] = useState<HwDetailData | null>(null);

  useEffect(() => {
    const getParams = async () => {
      try {
        const { id: paramId } = await params;
        setId(paramId);

        // 獲取作業數據
        const res = await fetch(`/api/md/${paramId}`);
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
        }

        const response = await res.json() as ApiResponse;
        if (!response.success || !response.data) {
          throw new Error('Failed to fetch homework details');
        }

        setData(response.data);
      } catch (err: any) {
        setError(err.message || '載入失敗');
      } finally {
        setLoading(false);
      }
    };

    getParams();
  }, [params]);

  if (loading) {
    return (
      <div className="my-8 flex items-center justify-center">
        <div className="text-cyan-300">載入中...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="my-8 flex items-center justify-center">
        <div className="text-red-400">錯誤: {error || '無法載入作業資料'}</div>
      </div>
    );
  }

  const { content, detail } = data;

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
