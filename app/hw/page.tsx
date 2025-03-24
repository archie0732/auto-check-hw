import { Link } from '@/components/ui/typography';
import Header from '@/components/common/header';
import { NotebookPen } from 'lucide-react';
import { HWList } from '../api/_model/apitype';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const res = await fetch(`${process.env.MYURL}/api/md`);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }

  const hw = (await res.json()) as HWList;

  return (
    <>
      <Header title="作業列表" subtitle="所有作業都在這邊" icon={NotebookPen} />
      <div className="flex flex-col gap-2">
        {hw.yannami.map((v) => (
          <div key={'1111' + v.id}>
            <Link href={v.link}>{v.title}</Link>
          </div>
        ))}
      </div>
    </>
  );
}
