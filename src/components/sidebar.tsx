import { HomeIcon, UsersIcon, BriefcaseBusiness } from "lucide-react";

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col">
      <nav className="flex-1 space-y-4 p-6">
        <a
          href="/admin"
          className="flex items-center space-x-2 rounded p-2 hover:bg-black hover:text-white"
          aria-label="Dashboard"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </a>
        <a
          href="/admin/fund"
          className="flex items-center space-x-2 rounded p-2 hover:bg-black hover:text-white"
          aria-label="Fundraising"
        >
          <UsersIcon className="h-5 w-5" />
          <span>Fundraising</span>
        </a>
        <a
          href="/admin/investment"
          className="flex items-center space-x-2 rounded p-2 hover:bg-black hover:text-white"
          aria-label="Investment"
        >
          <BriefcaseBusiness className="h-5 w-5" />
          <span>Investment</span>
        </a>
      </nav>
    </div>
  );
}
