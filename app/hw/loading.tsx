import Header from '@/components/common/header';
import { Skeleton } from '@/components/ui/skeleton';
import { NotebookPen } from 'lucide-react';

const Loading: React.FC = () => {
  return (
    <div className="container mx-auto my-8 flex flex-col gap-4">
      <Header title="作業列表" subtitle="所有作業都在這邊" icon={NotebookPen} />
      <div className="flex flex-col gap-2">
        {[7, 5, 6, 8, 6, 9, 4, 5].map((v, i) => (
          <div key={`item-${i}`}>
            <Skeleton className="h-6 rounded-lg" style={{ width: `${v}rem` }} />
          </div>
        ))}
      </div>
    </div>
  );
};
Loading.displayName = 'HomeworkListLoading';

export default Loading;
