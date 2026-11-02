"use client";

import { useSelector } from "react-redux";
import { ListTodo, CheckCircle2, Clock, TrendingUp } from "lucide-react";

export default function TaskStats() {
  const tasks = useSelector((state) => state.tasks.tasks);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = totalTasks - completedTasks;

  const completedPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const pendingPercentage =
    totalTasks > 0 ? Math.round((pendingTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Total Tasks",
      count: totalTasks,
      icon: ListTodo,
      iconColor: "text-violet-600 dark:text-violet-400",
      iconBg: "bg-violet-100 dark:bg-violet-500/15",
      description: "All your tasks",
      accent: "bg-violet-500",
    },
    {
      title: "Completed",
      count: completedTasks,
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
      description: `${completedPercentage}% of total tasks`,
      accent: "bg-emerald-500",
    },
    {
      title: "Pending",
      count: pendingTasks,
      icon: Clock,
      iconColor: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-500/15",
      description: `${pendingPercentage}% of total tasks`,
      accent: "bg-orange-500",
    },
  ];

  return (
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp
          size={17}
          className="text-violet-600 dark:text-violet-400"
        />

        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
          Overview
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          const percentage =
            stat.title === "Completed"
              ? completedPercentage
              : pendingPercentage;

          return (
            <div
              key={stat.title}
              className="flex min-h-[148px] flex-col justify-between rounded-2xl border border-slate-300 bg-white p-4 shadow-sm transition-colors duration-200 dark:border-slate-700 dark:bg-[#1b1c38]"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-400">
                    {stat.title}
                  </p>

                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
                    {stat.count}
                  </h3>

                  <p className="mt-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div className={`shrink-0 rounded-xl p-2.5 ${stat.iconBg}`}>
                  <Icon size={21} className={stat.iconColor} />
                </div>
              </div>

              {stat.title !== "Total Tasks" && (
                <div className="mt-3">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-400">
                      Progress
                    </span>

                    <span className="text-xs font-bold text-slate-900 dark:text-slate-300">
                      {percentage}%
                    </span>
                  </div>

                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${stat.accent}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
