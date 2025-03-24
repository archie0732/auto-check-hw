export const dynamic = 'force-dynamic';
import Markdown from '@/components/md/md-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { HandoutTab } from '@/components/hw/hw-submit';
import { QuestionDetailAPI } from '@/app/api/_model/apitype';

interface DataType { content: string; detail: QuestionDetailAPI }

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const res = await fetch(`${process.env.MYURL}/api/md/${id}`);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }

  const data = await res.json() as DataType;

  const { content, detail } = data;

  return (
    <div className="my-8">
      <div className="my-4 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <div className="text-muted-foreground">{detail.time}</div>
          <div className="text-4xl font-bold">{detail.name}</div>
        </div>
        <div className="relative w-32">
          <Progress
            value={60}
            className={`
              bg-sky-600
              dark:bg-sky-400
            `}
          />
          <Progress
            value={32}
            className={`
              bg-green-500
              dark:bg-green-300
            `}
            barClassName="absolute top-0 left-0 w-full h-full bg-transparent"
          />
        </div>
      </div>
      <Tabs defaultValue="detail">
        <TabsList>
          <TabsTrigger value="detail">題目</TabsTrigger>
          <TabsTrigger value="answer">解答</TabsTrigger>
          <TabsTrigger value="handout">提交</TabsTrigger>
        </TabsList>

        <TabsContent value="detail">
          <Markdown>{content}</Markdown>
        </TabsContent>

        <TabsContent value="answer">
          <Card>
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
