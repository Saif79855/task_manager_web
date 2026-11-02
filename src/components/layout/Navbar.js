"use client";

import { Menu } from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-14 items-center border-b border-slate-200 bg-white px-4 transition-colors duration-200 dark:border-slate-800 dark:bg-[#17182f] lg:hidden">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-xl p-2 text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10"
        aria-label="Open sidebar"
      >
        <Menu size={23} />
      </button>
    </header>
  );
}
