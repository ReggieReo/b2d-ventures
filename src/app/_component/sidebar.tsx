import { HomeIcon, UsersIcon, SettingsIcon } from "lucide-react";

export function Sidebar() {
  return (
    <div className="w-64 h-screen flex flex-col">
      <nav className="flex-1 p-6 space-y-4">
        <a
          href="#"
          className="flex items-center space-x-2 hover:bg-black hover:text-white p-2 rounded"
        >
          <HomeIcon className="w-5 h-5" />
          <span>Dashboard</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2  hover:bg-black hover:text-white p-2 rounded"
        >
          <UsersIcon className="w-5 h-5" />
          <span>Investors</span>
        </a>
        <a
          href="#"
          className="flex items-center space-x-2 hover:bg-black hover:text-white p-2 rounded"
        >
          <SettingsIcon className="w-5 h-5" />
          <span>Settings</span>
        </a>
      </nav>
    </div>
  );
}
