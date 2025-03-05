import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Page from './page';

interface Props extends React.HtmlHTMLAttributes<HTMLDivElement> {
  params: Promise<{ id: string }>;
};

const Layout: React.FC<Props> = async ({ params }) => {
  const { id } = await params;
  return (
    <div className="container mx-auto my-8 flex flex-col gap-4">
      <div>
        <Link href="/hw/" className="flex items-center gap-1 text-sm">
          <ArrowLeft size={16} />
          <span>返回</span>
        </Link>
      </div>
      <div>
        <Page id={id} />
      </div>
    </div>
  );
};
Layout.displayName = 'HomeworkLayout';

export default Layout;
