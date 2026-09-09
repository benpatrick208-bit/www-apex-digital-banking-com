import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { useBank } from "@/lib/bank-store";

export const Route = createFileRoute("/_shell")({
  ssr: false,
  component: ShellLayout,
});

function ShellLayout() {
  const { ready, signedIn } = useBank();
  const navigate = useNavigate();

  useEffect(() => {
    if (ready && !signedIn) navigate({ to: "/login", replace: true });
  }, [ready, signedIn, navigate]);

  if (!ready || !signedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
