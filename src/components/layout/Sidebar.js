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
  PanelsTopLeft,
} from "lucide-react";

import { logoutUserThunk } from "@/features/auth/authSlice";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    key: "dashboard",
  },
  {
    label: "Board",
    icon: PanelsTopLeft,
    key: "board",
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-dvh w-64 flex-col overflow-y-auto border-r border-white/10 bg-[#15162f] px-4 py-6 text-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-10 flex shrink-0 items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-900/30">
              <CheckCircle2 size={25} className="text-white" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white">
              TaskFlow
            </h1>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Workspace
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavigation(item.key)}
                aria-current={isActive ? "page" : undefined}
                className={`group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-950/30"
                    : "text-slate-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon
                  size={19}
                  className={`shrink-0 transition ${
                    isActive
                      ? "text-white"
                      : "text-slate-400 group-hover:text-white"
                  }`}
                />

                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="mt-6 shrink-0 space-y-2 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={onClose}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/10 hover:text-white"
          >
            <Settings size={19} />
            Settings
          </button>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-400 transition hover:bg-rose-500/10 hover:text-rose-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={19} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>
    </>
  );
}
