"use client";

import { AlertTriangle, X } from "lucide-react";

export default function DeleteTaskModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  taskDescription,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10">
            <AlertTriangle size={24} className="text-danger" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-2 text-muted hover:bg-surface disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <h2 id="delete-modal-title" className="mt-5 text-lg font-semibold">
          Delete Task?
        </h2>

        <p className="mt-2 text-sm text-muted">
          Are you sure you want to delete{" "}
          <span className="font-medium text-foreground">{taskDescription}</span>
          ? This action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-surface disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-lg bg-danger px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
