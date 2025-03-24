import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Props = Readonly<{
  children: React.ReactNode;
}>;

const Layout: React.FC<Props> = ({ children }) => {
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
        {children}
      </div>
    </>
  );
};
Layout.displayName = 'HomeworkLayout';

export default Layout;
