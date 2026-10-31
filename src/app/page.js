import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Search,
  SlidersHorizontal,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: ClipboardList,
    title: "Organize Your Tasks",
    description:
      "Create, update, and manage all your tasks from one simple dashboard.",
  },
  {
    icon: CheckCircle2,
    title: "Track Your Progress",
    description:
      "Mark tasks as completed and keep track of what still needs your attention.",
  },
  {
    icon: Search,
    title: "Find Tasks Quickly",
    description: "Search through your tasks and find exactly what you need.",
  },
  {
    icon: SlidersHorizontal,
    title: "Stay in Control",
    description: "Filter and sort tasks to keep your daily workflow organized.",
  },
];

export default function Home() {
  return (
    <main className="min-h-dvh overflow-hidden bg-background text-foreground">
      {/* Navbar */}
      <header className="border-b border-border">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <CheckCircle2 size={21} />
            </div>
            <span className="text-xl font-bold tracking-tight">TaskFlow</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
            >
              Login
            </Link>

            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2 text-sm font-medium">
            <Zap size={16} className="text-primary" />
            <span>Make every day more productive</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Take control of your tasks.
            <span className="mt-2 block text-primary">Get things done.</span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Organize your work, manage your priorities, and track your progress
            with TaskFlow — a simple way to stay on top of your day.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start Managing Tasks
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-xl border border-border px-7 py-3.5 text-sm font-semibold transition-colors hover:bg-muted"
            >
              Sign In
            </Link>
          </div>

          {/* Dashboard preview */}
          <div className="mx-auto mt-20 max-w-4xl rounded-2xl border border-border bg-card p-3 shadow-2xl sm:p-5">
            <div className="rounded-xl border border-border bg-background p-5 text-left sm:p-8">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Your workspace
                  </p>
                  <h2 className="mt-1 text-xl font-bold">My Tasks</h2>
                </div>
                <span className="rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary">
                  TaskFlow
                </span>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3">
                {[
                  { label: "Total Tasks", value: "12" },
                  { label: "Completed", value: "08" },
                  { label: "Pending", value: "04" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-border bg-muted/30 p-3 sm:p-5"
                  >
                    <p className="text-xs text-muted-foreground sm:text-sm">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-bold sm:text-3xl">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3">
                {[
                  { title: "Complete project documentation", done: true },
                  { title: "Review pending tasks", done: true },
                  { title: "Prepare weekly goals", done: false },
                ].map((task) => (
                  <div
                    key={task.title}
                    className="flex items-center gap-3 rounded-xl border border-border p-4"
                  >
                    <CheckCircle2
                      size={19}
                      className={
                        task.done
                          ? "shrink-0 text-primary"
                          : "shrink-0 text-muted-foreground"
                      }
                    />
                    <span
                      className={
                        task.done
                          ? "text-sm text-muted-foreground line-through"
                          : "text-sm font-medium"
                      }
                    >
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                Illustrative dashboard preview
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-muted/20 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to stay organized
            </h2>
            <p className="mt-4 text-muted-foreground">
              Simple tools to help you manage your tasks and make progress every
              day.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-border bg-card p-6 transition-transform hover:-translate-y-1"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon size={22} />
                  </div>

                  <h3 className="mt-5 font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to get organized?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 opacity-90 sm:text-base">
            Start managing your tasks and take the next step toward a more
            productive day.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-background px-6 py-3 font-semibold text-foreground transition-opacity hover:opacity-90"
          >
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} TaskFlow. All rights reserved.</p>
          <p>Organize better. Get things done.</p>
        </div>
      </footer>
    </main>
  );
}
