"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Clock,
  Settings,
  LogOut,
  X,
} from "lucide-react";

import { logoutUserThunk } from "@/features/auth/authSlice";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },
  {
    label: "All Tasks",
    icon: ListTodo,
    key: "allTasks",
  },
  {
    label: "Completed",
    icon: CheckCircle2,
    key: "completed",
  },
  {
    label: "Pending",
    icon: Clock,
    key: "pending",
  },
];

export default function Sidebar({ isOpen, onClose, activeMenu, onNavigate }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      await dispatch(logoutUserThunk()).unwrap();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch({ type: "auth/logout" });

      onClose?.();
      router.replace("/login");
    }
  };

  const handleNavigation = (menu) => {
    onNavigate(menu);
    onClose?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col overflow-y-auto border-r border-border bg-card p-5 transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="mb-10 flex shrink-0 items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">TaskFlow</h1>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-surface lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavigation(item.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="mt-6 shrink-0 space-y-2 border-t border-border pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-muted hover:bg-surface"
          >
            <Settings size={20} />
            Settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-danger hover:bg-surface disabled:opacity-60"
          >
            <LogOut size={20} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
