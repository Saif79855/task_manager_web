"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Trash2,
  Pencil,
  ArrowUpDown,
  ListTodo,
  SearchX,
  ClipboardList,
  Plus,
  RotateCcw,
  Clock,
  LayoutGrid,
  MoreHorizontal,
} from "lucide-react";

import { fetchTasks, editTask, removeTask } from "@/features/tasks/taskSlice";

import DeleteTaskModal from "@/components/tasks/DeleteTaskModal";
import TaskSkeleton from "@/components/tasks/TaskSkeleton";

export default function TaskList({
  onEditTask,
  searchQuery,
  onAddTask,
  onSearchChange,
  activeFilter,
  onFilterChange,
}) {
  const dispatch = useDispatch();

  const { tasks, loading, updating, deleting, error } = useSelector(
    (state) => state.tasks,
  );

  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const selectedTask = tasks.find((task) => task._id === selectedTaskId);

  // Toggle task completion
  const handleToggleTask = async (task) => {
    try {
      await dispatch(
        editTask({
          id: task._id,
          taskData: {
            completed: !task.completed,
          },
        }),
      ).unwrap();

      toast.success(
        task.completed
          ? "Task marked as pending!"
          : "Task completed successfully!",
      );
    } catch (error) {
      console.error("Task update failed:", error);

      toast.error(typeof error === "string" ? error : "Failed to update task.");
    }
  };

  // Delete handlers
  const handleOpenDeleteModal = (task) => {
    setSelectedTaskId(task._id);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setSelectedTaskId(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedTaskId) return;

    try {
      await dispatch(removeTask(selectedTaskId)).unwrap();

      toast.success("Task deleted successfully!");
      setSelectedTaskId(null);
    } catch (error) {
      console.error("Task deletion failed:", error);

      toast.error(
        typeof error === "string"
          ? error
          : "Failed to delete task. Please try again.",
      );
    }
  };

  // Search and sorting
  const searchedTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = tasks.filter((task) => {
      return (
        (task.title || "").toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query)
      );
    });

    return [...result].sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      if (sortOrder === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }

      if (sortOrder === "az") {
        return (a.title || "").localeCompare(b.title || "");
      }

      return 0;
    });
  }, [tasks, searchQuery, sortOrder]);

  // Preserve existing sidebar filters
  const filteredTasks = useMemo(() => {
    return searchedTasks.filter((task) => {
      return (
        activeFilter === "all" ||
        (activeFilter === "completed" && task.completed) ||
        (activeFilter === "pending" && !task.completed)
      );
    });
  }, [searchedTasks, activeFilter]);

  // Three board columns
  const allTasks = searchedTasks;
  const pendingTasks = searchedTasks.filter((task) => !task.completed);
  const completedTasks = searchedTasks.filter((task) => task.completed);

  // Date formatting
  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "";

    return new Date(deadline).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  // Overdue detection
  const isTaskOverdue = (task) => {
    if (!task.deadline || task.completed) return false;

    const deadlineDate = new Date(task.deadline);

    return (
      !isNaN(deadlineDate.getTime()) &&
      deadlineDate.getTime() < currentTime.getTime()
    );
  };

  // Empty state
  const getEmptyState = () => {
    if (searchQuery.trim()) {
      return {
        icon: SearchX,
        title: "No matching tasks",
        description: `We couldn't find any tasks matching "${searchQuery}".`,
        action: "Clear Search",
        onClick: () => onSearchChange?.(""),
      };
    }

    if (activeFilter !== "all") {
      return {
        icon: ClipboardList,
        title: `No ${activeFilter} tasks`,
        description: `You don't have any ${activeFilter} tasks right now.`,
        action: "Show All Tasks",
        onClick: () => onFilterChange("all"),
      };
    }

    return {
      icon: ListTodo,
      title: "No tasks yet",
      description: "Start organizing your day by creating your first task.",
      action: "Create Your First Task",
      onClick: () => onAddTask?.(),
    };
  };

  const emptyState = getEmptyState();
  const EmptyIcon = emptyState.icon;

  // Task card
  const renderTaskCard = (task) => {
    const overdue = isTaskOverdue(task);

    return (
      <article
        key={task._id}
        className={`group rounded-2xl border p-4 shadow-sm transition-colors duration-200 ${
          overdue
            ? "border-red-300 bg-red-50 dark:border-red-500/30 dark:bg-red-500/10"
            : "border-slate-300 bg-white dark:border-slate-700 dark:bg-[#242541]"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <button
              type="button"
              onClick={() => handleToggleTask(task)}
              disabled={updating}
              aria-label={
                task.completed
                  ? "Mark task as pending"
                  : "Mark task as completed"
              }
              className="mt-0.5 shrink-0 disabled:opacity-50"
            >
              {task.completed ? (
                <CheckCircle2 size={20} className="text-emerald-500" />
              ) : (
                <Circle
                  size={20}
                  className="text-slate-400 transition hover:text-violet-600 dark:text-slate-500 dark:hover:text-violet-400"
                />
              )}
            </button>

            <h3
              className={`break-words text-sm font-bold leading-5 ${
                task.completed
                  ? "text-slate-600 line-through dark:text-slate-400"
                  : "text-slate-950 dark:text-white"
              }`}
            >
              {task.title}
            </h3>
          </div>

          <button
            type="button"
            aria-label="Task actions"
            className="shrink-0 rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
          >
            <MoreHorizontal size={19} />
          </button>
        </div>

        {task.description && (
          <p className="mt-2 break-words pl-7 text-xs leading-5 text-slate-800 dark:text-slate-400">
            {task.description}
          </p>
        )}

        {task.deadline && (
          <div className="mt-3 flex flex-wrap items-center gap-2 pl-7">
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                overdue
                  ? "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400"
                  : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
              }`}
            >
              <CalendarDays size={13} />
              <span>{formatDeadline(task.deadline)}</span>
            </div>

            {overdue && (
              <span className="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-bold text-red-700 dark:bg-red-500/15 dark:text-red-400">
                Overdue
              </span>
            )}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 dark:border-slate-700">
          <div className="flex min-w-0 items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-400">
            <Clock size={13} />
            <span>{formatDate(task.createdAt)}</span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => onEditTask(task)}
              aria-label="Edit task"
              title="Edit task"
              className="rounded-lg p-2 text-violet-600 transition hover:bg-violet-50 dark:text-violet-400 dark:hover:bg-violet-500/10"
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              onClick={() => handleOpenDeleteModal(task)}
              aria-label="Delete task"
              title="Delete task"
              className="rounded-lg p-2 text-red-500 dark:text-red-400 dark:hover:bg-red-500/10"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </article>
    );
  };

  // Reusable Kanban column
  const renderColumn = ({
    title,
    tasks: columnTasks,
    icon: Icon,
    theme,
    countColor,
  }) => {
    return (
      <section
        className={`flex h-[520px] min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl border shadow-sm sm:h-[560px] xl:h-[620px] ${theme.container}`}
      >
        {/* Fixed column header */}
        <div
          className={`flex shrink-0 items-center justify-between gap-2 border-b px-4 py-4 ${theme.header}`}
        >
          <div className="flex min-w-0 items-center gap-2.5">
            <Icon size={21} className={theme.icon} />

            <h3 className="truncate text-base font-bold text-white">{title}</h3>

            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${countColor}`}
            >
              {columnTasks.length}
            </span>
          </div>

          <span className="shrink-0 text-white/80">
            <MoreHorizontal size={21} />
          </span>
        </div>

        {/* Independently scrollable task area */}
        <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 sm:p-4">
          {columnTasks.length > 0 ? (
            columnTasks.map(renderTaskCard)
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-3 text-center dark:border-slate-700">
              <Icon size={26} className={`${theme.icon} mb-2 opacity-70`} />

              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                No tasks here
              </p>

              <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
                Tasks will appear here
              </p>
            </div>
          )}
        </div>
      </section>
    );
  };

  // Column configurations
  const columns = [
    {
      title: "All Tasks",
      tasks: allTasks,
      icon: LayoutGrid,
      countColor:
        "bg-white/20 text-white dark:bg-violet-500/20 dark:text-violet-300",
      theme: {
        container:
          "border-blue-300 bg-blue-50 dark:border-violet-500/20 dark:bg-[#292342]",
        header:
          "border-blue-600 bg-[#2463EB] dark:border-violet-500/20 dark:bg-[#352b55]",
        icon: "text-white dark:text-violet-300",
      },
    },
    {
      title: "Pending",
      tasks: pendingTasks,
      icon: Clock,
      countColor:
        "bg-white/20 text-white dark:bg-blue-500/20 dark:text-blue-300",
      theme: {
        container:
          "border-orange-300 bg-orange-50 dark:border-blue-500/20 dark:bg-[#202b45]",
        header:
          "border-orange-500 bg-[#F59A0A] dark:border-blue-500/20 dark:bg-[#263957]",
        icon: "text-white dark:text-blue-300",
      },
    },
    {
      title: "Completed",
      tasks: completedTasks,
      icon: CheckCircle2,
      countColor:
        "bg-white/20 text-white dark:bg-emerald-500/20 dark:text-emerald-300",
      theme: {
        container:
          "border-emerald-300 bg-emerald-50 dark:border-emerald-500/20 dark:bg-[#1d3936]",
        header:
          "border-emerald-600 bg-[#16A05A] dark:border-emerald-500/20 dark:bg-[#21463d]",
        icon: "text-white dark:text-emerald-300",
      },
    },
  ];

  // Show columns according to active sidebar filter
  const visibleColumns =
    activeFilter === "completed"
      ? columns.filter((column) => column.title === "Completed")
      : activeFilter === "pending"
        ? columns.filter((column) => column.title === "Pending")
        : columns;

  return (
    <>
      <section className="mt-8 min-w-0">
        {/* Board heading */}
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <LayoutGrid
                size={21}
                className="text-violet-600 dark:text-violet-400"
              />

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Task Board
              </h2>
            </div>

            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Manage your tasks with a simple kanban board.
            </p>
          </div>

          {/* Sorting */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <ArrowUpDown
              size={17}
              className="shrink-0 text-slate-500 dark:text-slate-400"
            />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort tasks"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-violet-500 dark:border-slate-700 dark:bg-[#20213e] dark:text-slate-200 sm:w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A - Z</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && <TaskSkeleton />}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-violet-200 bg-white px-4 py-14 text-center dark:border-slate-700 dark:bg-[#1b1c38]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 dark:bg-violet-500/10">
              <EmptyIcon
                size={29}
                className="text-violet-600 dark:text-violet-400"
              />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {emptyState.title}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              {emptyState.description}
            </p>

            <button
              type="button"
              onClick={emptyState.onClick}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
            >
              {searchQuery.trim() || activeFilter !== "all" ? (
                <RotateCcw size={16} />
              ) : (
                <Plus size={17} />
              )}

              {emptyState.action}
            </button>
          </div>
        )}

        {/* Kanban Board */}
        {!loading && !error && filteredTasks.length > 0 && (
          <div
            className={`grid min-w-0 items-stretch gap-4 ${
              visibleColumns.length === 1
                ? "grid-cols-1"
                : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
            }`}
          >
            {visibleColumns.map((column) => (
              <div key={column.title} className="min-w-0">
                {renderColumn(column)}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete confirmation */}
      <DeleteTaskModal
        isOpen={Boolean(selectedTaskId)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isDeleting={deleting}
        taskDescription={selectedTask?.title || ""}
      />
    </>
  );
}
