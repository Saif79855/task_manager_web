"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { Eye, EyeOff, CheckSquare, AlertCircle } from "lucide-react";

import { login } from "@/features/auth/authSlice";
import GuestRoute from "@/components/auth/GuestRoute";
import ThemeToggle from "@/components/layout/ThemeToggle";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await dispatch(login(credentials)).unwrap();

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <GuestRoute>
      <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-8 sm:py-10">
        {/* Theme Toggle */}
        <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-xl bg-primary/10 p-3">
                <CheckSquare size={32} className="text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold">Welcome Back</h1>

            <p className="mt-2 text-sm text-muted">
              Sign in to continue to TaskFlow
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                autoComplete="email"
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted transition hover:text-foreground focus-visible:outline-2 focus-visible:outline-primary"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm text-danger"
              >
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-muted">
            Do not have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </GuestRoute>
  );
}
