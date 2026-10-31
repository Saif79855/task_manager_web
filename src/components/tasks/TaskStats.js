"use client";

import { useSelector } from "react-redux";
import { ListTodo, CheckCircle2, Clock } from "lucide-react";

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
      color: "text-primary",
      bg: "bg-primary/10",
      description: "All your tasks",
    },
    {
      title: "Completed",
      count: completedTasks,
      icon: CheckCircle2,
      color: "text-success",
      bg: "bg-success/10",
      description: `${completedPercentage}% of total tasks`,
    },
    {
      title: "Pending",
      count: pendingTasks,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: `${pendingPercentage}% of total tasks`,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted">{stat.title}</p>

                <h2 className="mt-2 text-3xl font-bold">{stat.count}</h2>

                <p className="mt-2 text-xs text-muted">{stat.description}</p>
              </div>

              <div className={`rounded-xl p-3 ${stat.bg}`}>
                <Icon size={24} className={stat.color} />
              </div>
            </div>

            {stat.title !== "Total Tasks" && (
              <div className="mt-5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted/20">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      stat.title === "Completed"
                        ? "bg-success"
                        : "bg-orange-500"
                    }`}
                    style={{
                      width: `${
                        stat.title === "Completed"
                          ? completedPercentage
                          : pendingPercentage
                      }%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
