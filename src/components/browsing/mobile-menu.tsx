'use client';

import { Menu } from "lucide-react";
import { useState } from "react";

interface MobileMenuProps {
  children: React.ReactNode;
}

export function MobileMenu({ children }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className={`
        fixed top-16 left-0 right-0 bg-white border-b
        md:relative md:top-0 md:border-none
        ${isOpen ? 'flex' : 'hidden'} 
        md:flex flex-col md:flex-row
        space-y-4 md:space-y-0 md:space-x-4
        p-4 md:p-0
        z-50
      `}>
        {children}
      </div>
    </>
  );
} 