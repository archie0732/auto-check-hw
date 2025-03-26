'use client';
import { CheckHWResultData, QuestionDetailData } from '@/app/api/_model/apitype';
import { StudentProfileData } from '@/app/api/profile/_model/apitype';
import { AppStore } from '@/store/app';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { TabsContent } from '../ui/tabs';
import FileInput from '@/components/input/file';
import Markdown from '../md/md-reader';
import { Button } from '../ui/button';
import { CheckCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HandoutData { id: string }

export const HandoutTab: React.FC<HandoutData> = ({ id }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [isSubmit, setSubmit] = useState<string>('');
  const [questionDetail, setQuestiondetail] = useState<QuestionDetailData>();
  const [loading, setLoading] = useState(false);

  const { userID } = AppStore();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`/api/md/${id}`);
      if (!res.ok) {
        throw new Error('fetch question detail error');
      }
      const detail = await res.json() as QuestionDetailData;
      setQuestiondetail(detail);
    };

    void fetchData();
  }, [id]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (userID === 'none' || !questionDetail) return;

      const res = await fetch(`/api/profile/${userID}`);
      if (!res.ok) {
        throw new Error(`cannot find the user ${await res.json()}`);
      }
      const student = await res.json() as StudentProfileData;

      setSubmit(student.student.hw[questionDetail.detail.id] === '1' ? '1' : '0');
    };

    void fetchUserProfile();
  }, [userID, questionDetail]);

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
      const time = new Date();
      const now = `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}\n`;
      const encodeTime = Buffer.from(now, 'utf-8').toString('base64');
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
        // console.log('sample: ', JSON.stringify(questionDetail.detail.check_output.trim()));
        // console.log('user:', JSON.stringify(receive.userans));
        router.push(`/result?t=${encodeTime}&token=${Buffer.from(JSON.stringify(receive.userans ?? ''), 'utf-8').toString('base64')}&et=${Buffer.from(JSON.stringify(content), 'utf-8').toString('base64')}`);
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
      router.push(`/result?t=su&token=${encodeTime}`);
    };

    toast.promise(checkHW, {
      loading: '批改中.....',
      success: () => { return '答案正確，已完成作業'; },
      error: (e: Error) => e.message,
    });
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
