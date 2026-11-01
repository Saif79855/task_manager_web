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

  // Toggle task status
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

  // Open delete modal
  const handleOpenDeleteModal = (task) => {
    setSelectedTaskId(task._id);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    if (deleting) return;

    setSelectedTaskId(null);
  };

  // Confirm deletion
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

  // Search, filter and sort
  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        (task.title || "").toLowerCase().includes(query) ||
        (task.description || "").toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "completed" && task.completed) ||
        (activeFilter === "pending" && !task.completed);

      return matchesSearch && matchesFilter;
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
  }, [tasks, searchQuery, activeFilter, sortOrder]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Format deadline with date and time
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

  // Check whether a task is overdue
  const isTaskOverdue = (task) => {
    if (!task.deadline || task.completed) return false;

    const deadlineDate = new Date(task.deadline);

    return (
      !isNaN(deadlineDate.getTime()) &&
      deadlineDate.getTime() < currentTime.getTime()
    );
  };

  const filters = [
    { label: "All Tasks", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
  ];

  // Empty state content
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

  return (
    <>
      <div className="mt-8 min-w-0 rounded-xl border border-border bg-card p-4 sm:p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Recent Tasks</h2>

            <p className="mt-1 text-sm text-muted">
              Keep track of your daily activities
            </p>
          </div>

          {/* Sorting */}
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <ArrowUpDown size={17} className="shrink-0 text-muted" />

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort tasks"
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary sm:flex-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="az">A - Z</option>
            </select>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition sm:px-4 ${
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted hover:bg-surface"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && <TaskSkeleton />}

        {/* Error */}
        {!loading && error && (
          <p className="py-4 text-sm text-danger">{error}</p>
        )}

        {/* Empty States */}
        {!loading && !error && filteredTasks.length === 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-surface">
              <EmptyIcon size={30} className="text-muted" />
            </div>

            <h3 className="text-lg font-semibold">{emptyState.title}</h3>

            <p className="mt-2 max-w-sm text-sm text-muted">
              {emptyState.description}
            </p>

            <button
              type="button"
              onClick={emptyState.onClick}
              className="mt-5 flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
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

        {/* Task List */}
        {!loading && !error && filteredTasks.length > 0 && (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const overdue = isTaskOverdue(task);

              return (
                <div
                  key={task._id}
                  className={`flex min-w-0 flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 ${
                    overdue ? "border-danger/50 bg-danger/5" : "border-border"
                  }`}
                >
                  {/* Task Details */}
                  <div className="flex min-w-0 items-start gap-3">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task)}
                      disabled={updating}
                      aria-label={
                        task.completed
                          ? "Mark task as pending"
                          : "Mark task as completed"
                      }
                      className="mt-0.5 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="text-success" size={22} />
                      ) : (
                        <Circle
                          className="text-muted transition hover:text-primary"
                          size={22}
                        />
                      )}
                    </button>

                    <div className="min-w-0">
                      {/* Task Title */}
                      <h3
                        className={`break-words font-medium ${
                          task.completed
                            ? "text-muted line-through"
                            : "text-foreground"
                        }`}
                      >
                        {task.title}
                      </h3>

                      {/* Task Description */}
                      {task.description && (
                        <p className="mt-1 break-words text-sm text-muted">
                          {task.description}
                        </p>
                      )}

                      <p className="mt-1 text-xs text-muted">
                        {task.completed ? "Completed" : "Pending"}
                      </p>

                      {/* Task Deadline */}
                      {task.deadline && (
                        <div
                          className={`mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm ${
                            overdue ? "text-danger" : "text-muted"
                          }`}
                        >
                          <Clock size={15} className="shrink-0" />

                          <span>Deadline: {formatDeadline(task.deadline)}</span>

                          {overdue && (
                            <span className="rounded-md bg-danger/10 px-2 py-1 font-semibold">
                              Overdue
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date and Actions */}
                  <div className="flex min-w-0 items-center justify-between gap-2 border-t border-border pt-2 sm:shrink-0 sm:justify-end sm:gap-4 sm:border-0 sm:pt-0">
                    <div className="flex min-w-0 items-center gap-2 text-xs text-muted sm:text-sm">
                      <CalendarDays size={16} className="shrink-0" />
                      <span>{formatDate(task.createdAt)}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => onEditTask(task)}
                        aria-label="Edit task"
                        title="Edit task"
                        className="rounded-lg p-2 text-primary transition hover:bg-primary/10"
                      >
                        <Pencil size={18} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenDeleteModal(task)}
                        aria-label="Delete task"
                        title="Delete task"
                        className="rounded-lg p-2 text-danger transition hover:bg-danger/10"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
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
