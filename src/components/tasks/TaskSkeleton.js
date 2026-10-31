export default function TaskSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="flex items-center justify-between gap-4 rounded-lg border border-border p-4"
        >
          {/* Task Details */}
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="h-6 w-6 shrink-0 rounded-full bg-surface" />

            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-surface" />
              <div className="h-3 w-1/3 rounded bg-surface" />
            </div>
          </div>

          {/* Date */}
          <div className="hidden h-4 w-24 rounded bg-surface sm:block" />

          {/* Actions */}
          <div className="flex gap-2">
            <div className="h-8 w-8 rounded-lg bg-surface" />
            <div className="h-8 w-8 rounded-lg bg-surface" />
          </div>
        </div>
      ))}
    </div>
  );
}
