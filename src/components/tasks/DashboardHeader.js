"use client";

import { useSyncExternalStore } from "react";
import { Plus, Search, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function DashboardHeader({
  onAddTask,
  searchQuery,
  onSearchChange,
}) {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = mounted && theme === "dark";

  return (
    <div className="mb-8 flex min-w-0 flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      {/* Left: Heading */}
      <div className="min-w-0">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Task Board
        </h1>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 sm:text-base">
          Organize your work, track progress and get things done.
        </p>
      </div>

      {/* Right: Search, Add Task and Theme */}
      <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center lg:shrink-0">
        {/* Search */}
        <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-[#20213e] sm:w-56 lg:w-64">
          <Search
            size={19}
            className="shrink-0 text-slate-400 dark:text-slate-500"
          />

          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search tasks..."
            aria-label="Search tasks"
            className="w-full min-w-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
          />
        </div>

        {/* Add Task */}
        <button
          type="button"
          onClick={onAddTask}
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
        >
          <Plus size={19} />
          Add Task
        </button>

        {/* Theme Toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          disabled={!mounted}
          aria-label="Toggle theme"
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="flex h-12 w-full shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-[#20213e] dark:text-slate-200 dark:hover:bg-slate-700 sm:w-12"
        >
          {mounted ? (
            isDark ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )
          ) : (
            <span className="h-5 w-5" />
          )}
        </button>
      </div>
    </div>
  );
}
