"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const formatDateTimeLocal = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  initialTask = null,
}) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(
    initialTask?.description || "",
  );
  const [deadline, setDeadline] = useState(
    formatDateTimeLocal(initialTask?.deadline),
  );

  const [titleError, setTitleError] = useState("");
  const [deadlineError, setDeadlineError] = useState("");

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

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    let isValid = true;

    // Title validation
    if (!trimmedTitle) {
      setTitleError("Task title is required.");
      isValid = false;
    } else if (trimmedTitle.length < 3) {
      setTitleError("Title must be at least 3 characters.");
      isValid = false;
    } else if (trimmedTitle.length > 100) {
      setTitleError("Title cannot exceed 100 characters.");
      isValid = false;
    } else {
      setTitleError("");
    }

    // Description validation
    if (trimmedDescription.length > 500) {
      isValid = false;
    }

    // Deadline validation
    let formattedDeadline = null;

    if (deadline) {
      const deadlineDate = new Date(deadline);

      if (isNaN(deadlineDate.getTime())) {
        setDeadlineError("Please enter a valid deadline.");
        isValid = false;
      } else {
        setDeadlineError("");
        formattedDeadline = deadlineDate.toISOString();
      }
    } else {
      setDeadlineError("");
    }

    if (!isValid) return;

    onSubmit({
      title: trimmedTitle,
      description: trimmedDescription,
      deadline: formattedDeadline,
    });
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

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Task Title */}
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium"
            >
              Task Title *
            </label>

            <input
              ref={inputRef}
              id="task-title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setTitleError("");
              }}
              maxLength={100}
              aria-required="true"
              aria-invalid={Boolean(titleError)}
              aria-describedby={titleError ? "title-error" : undefined}
              disabled={isSubmitting}
              placeholder="Enter task title"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-60"
            />

            {titleError && (
              <p
                id="title-error"
                role="alert"
                className="mt-1 text-sm text-danger"
              >
                {titleError}
              </p>
            )}

            <p className="mt-1 text-right text-xs text-muted">
              {title.length}/100
            </p>
          </div>

          {/* Task Description */}
          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="task-description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              disabled={isSubmitting}
              placeholder="Add more details about this task..."
              className="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-60"
            />

            <p className="mt-1 text-right text-xs text-muted">
              {description.length}/500
            </p>
          </div>

          {/* Task Deadline */}
          <div>
            <label
              htmlFor="task-deadline"
              className="mb-2 block text-sm font-medium"
            >
              Deadline
            </label>

            <input
              id="task-deadline"
              name="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => {
                setDeadline(e.target.value);
                setDeadlineError("");
              }}
              aria-invalid={Boolean(deadlineError)}
              aria-describedby={deadlineError ? "deadline-error" : undefined}
              disabled={isSubmitting}
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary disabled:opacity-60"
            />

            {deadlineError && (
              <p
                id="deadline-error"
                role="alert"
                className="mt-1 text-sm text-danger"
              >
                {deadlineError}
              </p>
            )}
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
