import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnnoGetAPI } from './api/anno/_model/apitype';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default async function Home() {
  const res = await fetch(`${process.env.MYURL}/api/anno/get`);

  if (!res.ok) {
    throw new Error('fetch anno error');
  }

  const data = await res.json() as AnnoGetAPI;

  return (
    <div className="mt-10 w-screen p-2">
      <Tabs defaultValue="anno">
        <TabsList>
          <TabsTrigger value="anno">公告</TabsTrigger>
          <TabsTrigger value="check">作業繳交</TabsTrigger>
        </TabsList>

        <TabsContent value="anno">
          <Card>
            <CardHeader>
              <CardTitle>公告</CardTitle>
              <CardDescription>公布作業與其他通知</CardDescription>
            </CardHeader>

            <div>

              {
                data.yanami.reverse().map((d, i) =>
                  (
                    <Link href={d.in_link === '' ? d.out_link : d.in_link} key={i}>
                      <div
                        className={`
                          group m-2 scale-95 rounded-md border p-6 duration-300
                          hover:scale-100 hover:border-3 hover:shadow-sm
                          hover:transition-all
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

          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
