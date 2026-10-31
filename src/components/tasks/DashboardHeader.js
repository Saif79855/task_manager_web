import { Plus } from "lucide-react";

export default function DashboardHeader({ onAddTask }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold">Welcome back!</h1>

        <p className="mt-1 text-sm text-muted">
          Here what is happening with your tasks today.
        </p>
      </div>

      <button
        onClick={onAddTask}
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
      >
        <Plus size={18} />
        Add New Task
      </button>
    </div>
  );
}
