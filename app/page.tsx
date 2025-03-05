import { AnnoGetAPI } from '@/app/api/anno/_model/apitype';
import Link from 'next/link';
import { Megaphone } from 'lucide-react';
import Header from '@/components/common/header';

export default async function Home() {
  const res = await fetch(`${process.env.MYURL}/api/anno/get`);

  if (!res.ok) {
    throw new Error('fetch anno error');
  }

  const data = await res.json() as AnnoGetAPI;

  return (
    <div className="container mx-auto my-8 flex flex-col gap-4">
      <Header title="公告" subtitle="公布作業與其他通知" icon={Megaphone} />
      <div className="flex flex-col gap-4">
        {
          data.yanami.reverse().map((d, i) =>
            (
              <Link href={d.in_link === '' ? d.out_link : d.in_link} key={i}>
                <div
                  className={`
                    group scale-99 rounded-lg border p-6 transition-all
                    hover:scale-100 hover:shadow-md
                  `}
                >
                  <div className="flex flex-col">
                    <span className={`
                      text-lg font-bold
                      group-hover:underline
                    `}
                    >
                      {
                        d.title
                      }
                    </span>
                    <span className="text-sm text-gray-500">
                      {d.description}
                      {' '}
                      ,
                      {d.time}
                    </span>
                  </div>
                </div>
              </Link>
            ),
          )
        }
      </div>
    </div>
  );
}
