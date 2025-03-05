import { QuestionDetailAPI } from '@/app/api/_model/apitype';
import Markdown from '@/components/md/md-reader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function Page({ params }: Props) {
  const id = (await params).id;
  const res = await fetch(`${process.env.MYURL}/api/md/${id}`);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }

  const { content, detail } = await res.json() as { content: string; detail: QuestionDetailAPI };

  await new Promise((r) => setTimeout(r, 5000));

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
      <Tabs defaultValue="question">
        <TabsList>
          <TabsTrigger value="question">題目</TabsTrigger>
          <TabsTrigger value="answer">解答</TabsTrigger>
          <TabsTrigger value="handout">提交</TabsTrigger>
        </TabsList>

        <TabsContent value="question">
          <Markdown>{content}</Markdown>
        </TabsContent>

        <TabsContent value="answer">
          <Card>
            <CardContent>
              解答尚未公布
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="handout">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">作業繳交結果</CardTitle>
              <CardDescription>{detail.name}</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
