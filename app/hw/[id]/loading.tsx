import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Loading: React.FC = () => {
  return (
    <div className="my-8">
      <div className="my-4 flex items-center justify-between gap-2">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-18" />
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
      <Tabs defaultValue="question">
        <TabsList>
          <TabsTrigger value="question">題目</TabsTrigger>
          <TabsTrigger value="answer">解答</TabsTrigger>
          <TabsTrigger value="handout">提交</TabsTrigger>
        </TabsList>

        <TabsContent value="question">
          Loading...
        </TabsContent>

        <TabsContent value="answer">
          Loading
        </TabsContent>

        <TabsContent value="handout">
          Loading...
        </TabsContent>
      </Tabs>
    </div>
  );
};
Loading.displayName = 'HomeworkLoading';

export default Loading;
