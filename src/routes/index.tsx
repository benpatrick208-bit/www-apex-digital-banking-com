import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Lock, User } from "lucide-react";
import { ApexLogo } from "@/components/apex-logo";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBank } from "@/lib/bank-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Sign in to Apex Digital Bank to check balances, move money, deposit checks and manage your cards.",
      },
      { property: "og:title", content: "Sign in — Apex Digital Bank" },
      {
        property: "og:description",
        content: "Secure online banking sign in for Apex Digital Bank customers.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, signedIn, ready, state } = useBank();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [useToken, setUseToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && signedIn) navigate({ to: "/dashboard", replace: true });
  }, [ready, signedIn, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(username, password);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="relative flex-1">
        {/* Top half solid blue */}
        <div className="surface-navy relative h-[46vh] min-h-[260px] w-full md:h-[52vh]">
          <div className="mx-auto flex h-full max-w-6xl items-start px-6 pt-10 md:pt-14">
            <ApexLogo
              className="text-navy-foreground"
              markClassName="h-10 w-10 md:h-12 md:w-12"
              wordClassName="text-3xl md:text-4xl"
            />
          </div>
        </div>

        {/* Login card overlapping the split */}
        <div className="mx-auto -mt-28 w-full max-w-md px-5 md:-mt-36 md:max-w-lg">
          <div className="card-elevated rounded-2xl border border-border bg-card p-6 md:p-9">
            <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Sign in to your account
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Welcome back. Your session is encrypted end to end.
            </p>

            {error ? (
              <Alert variant="destructive" className="mt-5">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <form className="mt-6 space-y-4" onSubmit={onSubmit}>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    autoComplete="username"
                    className="h-12 pl-9"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className="h-12 pl-9"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-1">
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(v) => setRemember(v === true)}
                    aria-label="Remember me"
                  />
                  Remember me
                </label>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <Checkbox
                    checked={useToken}
                    onCheckedChange={(v) => setUseToken(v === true)}
                    aria-label="Use token"
                  />
                  Use token
                </label>
              </div>

              {useToken ? (
                <div className="space-y-2">
                  <Label htmlFor="token">Security token code</Label>
                  <Input
                    id="token"
                    inputMode="numeric"
                    className="h-12 tracking-[0.4em]"
                    placeholder="000000"
                  />
                </div>
              ) : null}

              <Button type="submit" size="lg" className="h-13 w-full text-base" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-5 text-center">
              <span className="cursor-pointer text-sm font-medium text-primary hover:underline">
                Forgot username or password?
              </span>
            </div>

            <p className="mt-5 rounded-lg bg-muted px-3 py-2 text-center text-xs text-muted-foreground">
              Demo credentials — username <strong>{state.profile.username}</strong>, password{" "}
              <strong>apex1234</strong>, PIN <strong>2468</strong>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3 pb-12 text-sm text-muted-foreground">
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
            <span aria-hidden>•</span>
            <Link to="/signup" className="hover:text-foreground">
              Open an account
            </Link>
            <span aria-hidden>•</span>
            <span className="cursor-pointer hover:text-foreground">Privacy</span>
            <span aria-hidden className="tracking-widest">
              •••
            </span>
          </div>
        </div>
      </main>

      <SiteFooter tone="navy" />
    </div>
  );
}
