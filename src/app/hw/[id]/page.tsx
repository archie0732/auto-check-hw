import { QuestionDetailAPI } from '@/app/api/_model/apitype';
import Markdown from '@/components/md/md-reader';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

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

  return (
    <div className="p-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl uppercase">{detail.name}</CardTitle>
        </CardHeader>

        <div className="m-6 rounded-md p-6">

          <Tabs defaultValue="question">
            <TabsList>
              <TabsTrigger value="question">題目</TabsTrigger>
              <TabsTrigger value="check">答題</TabsTrigger>
            </TabsList>

            <TabsContent value="question">
              <Card>
                <div className="p-5">
                  <Markdown>{content}</Markdown>
                </div>
                <CardFooter className="flex items-end justify-end">
                  <span className="text-gray-500">
                    {detail.time}
                    ，
                    {detail.author}
                  </span>
                </CardFooter>
              </Card>
              <div className="m-2 flex justify-between">
                <div className="flex flex-col">
                  <Link href={detail.ans_link} target="_blank">
                    <Button disabled variant="outline">解答尚未公布</Button>
                  </Link>
                </div>

                <div className="flex flex-col">
                  <div className="flex gap-1">
                    <span className="font-bold">繳交</span>
                    <span>0/10</span>
                  </div>

                  <div className="flex gap-1">
                    <span className="font-bold">通過</span>
                    <span>0/10</span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="check">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">作業繳交結果</CardTitle>
                  <CardDescription>{detail.name}</CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
}
