import { HomeCheckHW } from '@/components/home/home-check';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Home() {
  return (
    <div>
      <div className="mt-10 flex justify-center">
        <div className="flex flex-col gap-2">
          <Tabs>
            <TabsList defaultValue="check">
              <TabsTrigger value="check">作業繳交</TabsTrigger>
              <TabsTrigger value="result">繳交結果</TabsTrigger>
            </TabsList>

            <TabsContent value="check">
              <HomeCheckHW />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
