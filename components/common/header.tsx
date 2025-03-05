import { LucideIcon } from 'lucide-react';

const Header: React.FC<{
  title: string;
  subtitle: string;
  icon: LucideIcon;
}> = ({ title, subtitle, icon: Icon }) => (
  <div className="flex items-center gap-2">
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1 text-xl font-bold">
        <Icon size={24} strokeWidth={2} />
        {title}
      </div>
      <div className="text-muted-foreground text-sm">{subtitle}</div>
    </div>
  </div>
);
Header.displayName = 'Header';

export default Header;
