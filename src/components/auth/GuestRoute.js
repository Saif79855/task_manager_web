"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

export default function GuestRoute({ children }) {
  const router = useRouter();

  const { isAuthenticated, authInitialized } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (authInitialized && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [authInitialized, isAuthenticated, router]);

  if (!authInitialized || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted">Checking authentication...</p>
      </div>
    );
  }

  return children;
}
