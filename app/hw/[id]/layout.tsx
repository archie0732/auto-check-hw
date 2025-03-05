import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Page from './page';
import { Button } from '@/components/ui/button';

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  params: Promise<{ id: string }>;
};

const Layout: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  return (
    <>
      <div>
        <Button variant="ghost" asChild className="-ml-3">
          <Link href="/hw/" className="flex items-center gap-1 text-sm">
            <ArrowLeft size={16} />
            <span>返回</span>
          </Link>
        </Button>
      </div>
      <div>
        <Page id={id} />
      </div>
    </>
  );
};
Layout.displayName = 'HomeworkLayout';

export default Layout;
