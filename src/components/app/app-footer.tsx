import { GithubIcon } from 'lucide-react';

export function AppFooter() {
  return (
    <div className={`
      flex flex-col justify-between gap-2 border-t p-4 text-gray-600
      md:flex-row
    `}
    >
      <div className="flex justify-center">
        <span>hw-check &copy; 2025</span>
      </div>
      <div className="flex justify-center">
        <div className="rounded-full border-2 border-gray-600 p-0.5">
          <GithubIcon />
        </div>
      </div>

    </div>
  );
}
