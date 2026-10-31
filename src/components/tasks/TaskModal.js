"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  initialTask = null,
}) {
  const [title, setTitle] = useState(initialTask?.description || "");

  const inputRef = useRef(null);

  const isEditMode = Boolean(initialTask);

  // Autofocus when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const frameId = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    return () => cancelAnimationFrame(frameId);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const description = title.trim();

    if (!description) return;

    onSubmit({ description });
  };

  const handleClose = () => {
    if (isSubmitting) return;

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {isEditMode ? "Edit Task" : "Create New Task"}
          </h2>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-muted hover:bg-surface disabled:opacity-60"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium"
            >
              Task Title
            </label>

            <input
              ref={inputRef}
              id="task-title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-60"
            />
          </div>

          {error && <p className="text-sm text-danger">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-border px-4 py-2 text-sm disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
