import { HomeIcon, UsersIcon, BriefcaseBusiness } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col">
      <nav className="flex-1 space-y-4 p-6">
        <Link
          href="/admin"
          className="flex items-center space-x-2 rounded p-2 hover:bg-black hover:text-white"
          aria-label="Dashboard"
        >
          <HomeIcon className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/admin/fund"
          className="flex items-center space-x-2 rounded p-2 hover:bg-black hover:text-white"
          aria-label="Fundraising"
        >
          <UsersIcon className="h-5 w-5" />
          <span>Fundraising</span>
        </Link>
        <Link
          href="/admin/financial_statement"
          className="flex items-center space-x-2 rounded p-2 hover:bg-black hover:text-white"
          aria-label="Financial Statements"
        >
          <BriefcaseBusiness className="h-5 w-5" />
          <span>Financial Statements</span>
        </Link>
      </nav>
    </div>
  );
}
