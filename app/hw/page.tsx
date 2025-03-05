import { Link } from '@/components/ui/typography';
import { QuestionDetailAPI } from '../api/_model/apitype';
import Header from '@/components/common/header';
import { NotebookPen } from 'lucide-react';

export default async function Page() {
  const res = await fetch(`${process.env.MYURL}/api/md`);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }

  const hw = await res.json() as QuestionDetailAPI[];

  return (
    <div className="container mx-auto my-8 flex flex-col gap-4">
      <Header title="作業列表" subtitle="所有作業都在這邊" icon={NotebookPen} />
      <div className="flex flex-col gap-2">
        {hw.map((v) => (
          <div key={v.slug}>
            <Link href={v.url}>{v.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
