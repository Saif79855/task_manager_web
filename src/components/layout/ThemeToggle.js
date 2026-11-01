"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsMounted();

  const isDark = mounted && theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex size-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-surface"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {mounted ? (
        isDark ? (
          <Sun size={19} />
        ) : (
          <Moon size={19} />
        )
      ) : (
        <span className="block h-[19px] w-[19px]" />
      )}
    </button>
  );
}
