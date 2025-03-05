import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

type Props = React.HtmlHTMLAttributes<HTMLDivElement>;

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <div className="container mx-auto my-8 flex flex-col gap-4">
      <div>
        <Link href="/hw/" className="flex items-center gap-1 text-sm">
          <ArrowLeft size={16} />
          <span>返回</span>
        </Link>
      </div>
      <div>{children}</div>
    </div>
  );
};
Layout.displayName = 'HomeworkLayout';

export default Layout;
