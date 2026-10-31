"use client";

import { useSyncExternalStore } from "react";
import { Search, Bell, Sun, Moon, Menu } from "lucide-react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function Navbar({ onMenuClick, searchQuery, onSearchChange }) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  return (
    <header className="fixed top-0 right-0 left-0 z-30 flex h-20 items-center justify-between gap-2 border-b border-border bg-card px-2 sm:px-6 lg:left-64 lg:px-8">
      {/* Left Section */}
      <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="shrink-0 rounded-lg p-2 hover:bg-surface lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={22} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold sm:text-xl">
            Dashboard
          </h2>

          <p className="hidden text-sm text-muted sm:block">
            Manage your daily tasks
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-3">
        {/* Search */}
        <div className="flex min-w-0 items-center gap-1 rounded-lg bg-surface px-2 py-2 sm:gap-2 sm:px-3">
          <Search size={17} className="shrink-0 text-muted" />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            aria-label="Search tasks"
            className="w-12 min-w-0 bg-transparent text-xs outline-none sm:w-32 sm:text-sm md:w-40"
          />
        </div>

        {/* Notifications */}
        <button
          className="shrink-0 rounded-lg p-2 hover:bg-surface"
          aria-label="Notifications"
        >
          <Bell size={19} />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="shrink-0 rounded-lg p-2 hover:bg-surface"
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )
          ) : (
            <span className="block h-[19px] w-[19px]" />
          )}
        </button>
      </div>
    </header>
  );
}
