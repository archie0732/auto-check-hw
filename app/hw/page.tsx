import { Link } from '@/components/ui/typography';
import Header from '@/components/common/header';
import { NotebookPen, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

interface HwListResponse {
  success: boolean;
  data: {
    semester: string;
    hw_list: string[];
    count: number;
  }
}

export default async function Page() {
  const res = await fetch(`${process.env.MYURL}/api/md`);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }

  const hw = (await res.json()) as HwListResponse;

  if (!hw.success || !hw.data) {
    throw new Error('Failed to fetch homework list');
  }

  const { semester, hw_list, count } = hw.data;

  return (
    <>
      <Header title="作業列表" subtitle={`${semester} 學期 - 共 ${count} 個作業`} icon={NotebookPen} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {hw_list.map((hwId, index) => (
          <Card key={hwId} className="group relative bg-black/70 backdrop-blur border border-cyan-400/30 rounded-2xl overflow-hidden hover:border-cyan-400/80 hover:shadow-cyan-400/30 hover:shadow-lg transition-all duration-300 cursor-pointer">
            <Link href={`/hw/${hwId}`} className="block">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-400 group-hover:text-blue-200 transition-colors">
                    作業 {hwId.replace('hw-', '')}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm">查看詳情</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-200 group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {hw_list.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <NotebookPen className="w-16 h-16 mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">目前沒有作業</h3>
          <p className="text-sm">請稍後再來查看</p>
        </div>
      )}
    </>
  );
}
