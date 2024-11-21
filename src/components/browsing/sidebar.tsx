"use client";

import { HomeIcon, UsersIcon, BriefcaseBusiness, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useState } from "react";

const routes = [
  {
    label: "Dashboard",
    icon: HomeIcon,
    href: "/admin",
    ariaLabel: "Dashboard",
  },
  {
    label: "Fundraising",
    icon: UsersIcon,
    href: "/admin/fund",
    ariaLabel: "Fundraising",
  },
  {
    label: "Financial Statements",
    icon: BriefcaseBusiness,
    href: "/admin/financial_statement",
    ariaLabel: "Financial Statements",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-white">
      <nav className="flex-1 space-y-4 p-6">
        {routes.map((route) => {
          const Icon = route.icon;
          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center space-x-2 rounded p-2 hover:bg-black hover:text-white",
                pathname === route.href && "bg-black text-white"
              )}
              aria-label={route.ariaLabel}
              onClick={() => setOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span>{route.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="absolute left-4 top-4 md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden h-full w-64 border-r bg-white md:block">
        <SidebarContent />
      </div>
    </>
  );
}
