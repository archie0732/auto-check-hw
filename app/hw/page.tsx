import { Link } from '@/components/ui/typography';
import { QuestionDetailAPI } from '../api/_model/apitype';

export default async function Page() {
  const res = await fetch(`${process.env.MYURL}/api/md`);

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}: ${await res.text()}`);
  }

  const hw = await res.json() as QuestionDetailAPI[];

  return (
    <div className="container mx-auto my-8 flex flex-col gap-4">
      {hw.map((v) => (
        <div key={v.slug}>
          <Link href={v.url}>{v.name}</Link>
        </div>
      ))}
    </div>
  );
}
