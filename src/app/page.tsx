import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AnnoGetAPI } from './api/anno/_model/apitype';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Home() {
  const res = await fetch(`${process.env.MYURL}/api/anno/get`);

  if (!res.ok) {
    throw new Error('fetch anno error');
  }

  const data = await res.json() as AnnoGetAPI;

  return (
    <div className="mt-10 w-screen p-2">
      <Tabs>
        <TabsList defaultValue="anno">
          <TabsTrigger value="anno">公告</TabsTrigger>
          <TabsTrigger value="check">作業繳交</TabsTrigger>
        </TabsList>

        <TabsContent value="anno">
          <Card>
            <CardHeader>
              <CardTitle>公告</CardTitle>
              <CardDescription>公布作業與其他通知</CardDescription>
            </CardHeader>

            <span>{JSON.stringify(data.yanami[0].description)}</span>

            <div>

              {
                data.yanami.map((d, i) =>
                  (
                    <div
                      key={i}
                      className={`
                        group m-2 scale-100 rounded-md border p-4
                        hover:scale-105 hover:transition-all
                      `}
                    >
                      <span className="font-bold">
                        {
                          d.title
                        }
                      </span>

                    </div>
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
