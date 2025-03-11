import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>About me</CardTitle>
        </CardHeader>
        <div className="p-4">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <Skeleton
                className="h-60 w-60 rounded-full border-4 object-cover"
              />
              <Skeleton className="mt-2 gap-2 text-center text-2xl font-bold" />

              <Skeleton />
            </div>
            <div className={`
              flex flex-grow flex-col rounded-lg border-2 border-gray-500
              bg-gray-800 p-4
            `}
            >
              <div className="flex justify-between">
                <span className="flex text-lg font-semibold">
                  Introduce
                </span>
                <Skeleton />
              </div>
              <p className="mt-2 text-gray-500" />
            </div>
          </div>

          <div className="mt-3">
            <h2 className="mb-2 text-xl font-bold">作業繳交狀況</h2>
            <div className="overflow-x-auto rounded-lg bg-gray-800 p-4">
              <table className="min-w-full text-center text-sm text-white">
                <thead>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
