'use client';

import Markdown from '@/components/md/md-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileInput from '@/components/input/file';
import { useEffect, useState } from 'react';
import { QuestionDetailAPI } from '@/app/api/_model/apitype';
import Loading from './loading';
import { Button } from '@/components/ui/button';

type Props = Readonly<{
  id: string;
}>;

interface DataType { content: string; detail: QuestionDetailAPI }

const HandoutTab: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');

  const onFileSelect = (file: File) => {
    setFile(file);
    file.text()
      .then((v) => setFileContent(v))
      .catch(console.error);
  };

  const submit = () => {
    if (!file) return;

    // TODO: code submission logic
  };

  return (
    <TabsContent value="handout">
      <div className={`
        flex flex-col gap-8
        md:grid md:grid-cols-[2fr_1fr]
      `}
      >
        <div className="flex flex-col gap-4">
          <FileInput extensions={['.c', '.cpp']} onSelect={onFileSelect} />
          <Markdown>
            {`\`\`\`cpp\n${fileContent}\n\`\`\``}
          </Markdown>
        </div>
        <div className="flex flex-col gap-4">
          <Button onClick={submit} disabled={file == null}>提交</Button>
          <div>
            已選擇檔案：
            {file?.name}
          </div>
        </div>
      </div>
    </TabsContent>
  );
};

export default function Page({ id }: Props) {
  const [data, setData] = useState<DataType | null>(null);
  const [tabIndex, setTabIndex] = useState('detail');

  useEffect(() => {
    void (async () => {
      const res = await fetch(`/api/md/${id}`);

      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
      }

      setData(await res.json() as DataType);
    })();

    const hash = document.location.hash;

    if (!hash) return;
    if (!['#detail', '#answer', '#handout'].includes(hash)) return;
    setTabIndex(hash.slice(1));
  }, []);

  const onTabChange = (index: string) => {
    setTabIndex(index);
    document.location.hash = index;
  };

  if (!data) {
    return <Loading />;
  }

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
      <Tabs value={tabIndex} onValueChange={onTabChange}>
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

        <HandoutTab />
      </Tabs>
    </div>
  );
}
