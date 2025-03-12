'use client';

import Markdown from '@/components/md/md-reader';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileInput from '@/components/input/file';
import { useEffect, useState } from 'react';
import { CheckHWResultData, QuestionDetailAPI, QuestionDetailData } from '@/app/api/_model/apitype';
import Loading from './loading';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AppStore } from '@/store/app';
import { StudentProfileData } from '@/app/api/profile/_model/apitype';
import { CheckCheck, Loader2 } from 'lucide-react';

type Props = Readonly<{
  id: string;
}>;

interface DataType { content: string; detail: QuestionDetailAPI }
interface HandoutData { id: string }

const HandoutTab: React.FC<HandoutData> = ({ id }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isSubmit, setSubmit] = useState<string>('');
  const [questionDetail, setQuestiondetail] = useState<QuestionDetailData>();
  const [loading, setLoading] = useState(false);

  const { userID } = AppStore();

  useEffect(() => {
    void fetchQuestionDetail();
  }, []);

  const onFileSelect = (file: File) => {
    setFile(file);
    file.text()
      .then((v) => setFileContent(v))
      .catch(console.error);
  };

  const submit = () => {
    if (!file) return;
    if (!questionDetail) return;

    const checkHW = async () => {
      setLoading(true);
      if (userID === 'none') {
        setLoading(false);
        throw new Error('您尚未登入!');
      }

      // TODO: code submission logic
      const content = await file.text();
      const res = await fetch('/api/cpp/', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'jjdl', code: content, input: questionDetail.detail.check_input }) });

      if (!res.ok) {
        toast.error('發生錯誤，可能是你的檔案編碼問題或是副檔名錯誤(只支援utf-8，ascii code 不支援!)');
        setLoading(false);
        throw new Error(`check hw error ${await (res.json())}`);
      }

      const receive = await res.json() as CheckHWResultData;

      if (receive.error) {
        setLoading(false);
        throw new Error(receive.error);
      }

      if (JSON.stringify(questionDetail.detail.check_output.trim()) != JSON.stringify(receive.userans)) {
        setLoading(false);
        throw new Error('輸出答案錯誤');
      }
      // check hw
      const uploadResult = await fetch(`/api/profile/${userID}/update`, { method: 'POST', body: JSON.stringify({ type: 'hw', hw: questionDetail.detail.id, uploadData: '' }) });

      if (!uploadResult.ok) {
        setLoading(false);
        throw new Error(uploadResult.statusText);
      }

      setSubmit('1');
      setLoading(false);
    };

    toast.promise(checkHW, {
      loading: '批改中.....',
      success: () => { return '答案正確，已完成作業'; },
      error: (e: Error) => e.message,
    });
  };

  const fetchQuestionDetail = async () => {
    let res = await fetch(`/api/md/${id}`);
    if (!res.ok) {
      throw new Error('fetch question detail error');
    }
    const detail = await res.json() as QuestionDetailData;
    setQuestiondetail(detail);

    console.log('debug', questionDetail);

    // user

    if (userID === 'none') return;
    res = await fetch(`/api/profile/${userID}`);
    if (!res.ok) {
      throw new Error(`cannot find the user ${await res.json()}`);
    }
    const student = await res.json() as StudentProfileData;
    setSubmit(student.student.hw[detail.detail.id]);
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
          {isSubmit === '1'
            ? (
                <Button disabled>
                  <CheckCheck />
                  已完成本作業
                </Button>
              )
            : (
                <Button onClick={() => void submit()} disabled={file == null || loading}>
                  {loading
                    ? (
                        <Loader2 className="animate-spin" />
                      )
                    : '提交'}
                </Button>
              )}
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

        <HandoutTab id={id} />
      </Tabs>
    </div>
  );
}
