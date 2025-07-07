import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center">
      <Card className="w-full max-w-3xl bg-gray-800/60 border-gray-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-white">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-8">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-blue-500 bg-gray-900" />
            <div className="flex-1">
              <Skeleton className="h-8 w-40 mb-2 bg-blue-900/40" />
              <Skeleton className="h-4 w-24 bg-blue-900/30" />
            </div>
          </div>
          <div className="mt-6 mb-8 p-6 rounded-lg bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-700/30 shadow-inner">
            <div className="flex items-center mb-2">
              <Skeleton className="h-5 w-24 bg-blue-900/40 mr-2" />
              <Skeleton className="h-5 w-16 bg-blue-900/40" />
            </div>
            <Skeleton className="h-4 w-full mb-2 bg-blue-900/20" />
            <Skeleton className="h-4 w-2/3 mb-2 bg-blue-900/20" />
            <Skeleton className="h-4 w-1/2 bg-blue-900/20" />
          </div>
          <div className="mb-2 text-xl font-bold text-white">作業繳交狀況</div>
          <div className="overflow-x-auto rounded-lg p-4 bg-gray-900/40 border border-blue-900/30">
            <table className="min-w-full text-center text-sm text-white">
              <thead>
                <tr>
                  {[...Array(5)].map((_, i) => (
                    <th key={i} className="px-3 py-2">
                      <Skeleton className="h-4 w-16 bg-blue-900/30 mx-auto" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {[...Array(5)].map((_, i) => (
                    <td key={i} className="px-3 py-2">
                      <Skeleton className="h-5 w-5 rounded-full bg-blue-900/30 mx-auto" />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
