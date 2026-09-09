import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ApexLogo } from "@/components/apex-logo";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBank } from "@/lib/bank-store";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Open an account — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Open an Apex Digital Bank checking and high-yield savings account online in a few minutes.",
      },
      { property: "og:title", content: "Open an account — Apex Digital Bank" },
      {
        property: "og:description",
        content: "Register for online banking with Apex Digital Bank.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { register } = useBank();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirm: "",
    pin: "",
  });
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) return setError("Your password must be at least 8 characters.");
    if (form.password !== form.confirm) return setError("Your passwords don't match.");
    if (!/^\d{4}$/.test(form.pin)) return setError("Your PIN must be 4 digits.");
    if (!agree) return setError("Please accept the account agreement to continue.");
    setLoading(true);
    try {
      await register({
        fullName: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        pin: form.pin,
      });
      setDone(true);
      setTimeout(() => navigate({ to: "/dashboard", replace: true }), 1300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="surface-navy px-6 py-8">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link to="/">
            <ApexLogo className="text-navy-foreground" />
          </Link>
          <Link to="/" className="text-sm font-medium text-navy-foreground/85 hover:underline">
            Sign in
          </Link>
        </div>
      </div>

      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-10">
        {done ? (
          <div className="card-elevated flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center">
            <CheckCircle2 className="size-12 text-success" />
            <h1 className="mt-4 text-2xl font-semibold">Your account is ready</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Taking you to your dashboard…
            </p>
          </div>
        ) : (
          <div className="card-elevated rounded-2xl border border-border bg-card p-6 md:p-9">
            <h1 className="text-2xl font-semibold tracking-tight">Open your Apex account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Everyday Checking and High-Yield Savings, opened together. No monthly maintenance fee.
            </p>

            {error ? (
              <Alert variant="destructive" className="mt-5">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={submit}>
              <Field label="Full legal name" className="sm:col-span-2">
                <Input value={form.fullName} onChange={set("fullName")} required />
              </Field>
              <Field label="Email address">
                <Input type="email" value={form.email} onChange={set("email")} required />
              </Field>
              <Field label="Mobile phone">
                <Input value={form.phone} onChange={set("phone")} placeholder="(555) 555-0100" required />
              </Field>
              <Field label="Username">
                <Input value={form.username} onChange={set("username")} required />
              </Field>
              <Field label="4-digit PIN">
                <Input
                  inputMode="numeric"
                  maxLength={4}
                  value={form.pin}
                  onChange={set("pin")}
                  required
                />
              </Field>
              <Field label="Password">
                <Input type="password" value={form.password} onChange={set("password")} required />
              </Field>
              <Field label="Confirm password">
                <Input type="password" value={form.confirm} onChange={set("confirm")} required />
              </Field>

              <label className="flex items-start gap-3 pt-1 text-sm sm:col-span-2">
                <Checkbox
                  checked={agree}
                  onCheckedChange={(v) => setAgree(v === true)}
                  className="mt-0.5"
                />
                <span className="text-muted-foreground">
                  I agree to the Deposit Account Agreement, Electronic Communications Consent, and
                  Privacy Notice, and I confirm the information provided is accurate.
                </span>
              </label>

              <Button type="submit" size="lg" className="sm:col-span-2" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Opening your account…
                  </>
                ) : (
                  "Open account"
                )}
              </Button>
            </form>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label>{label}</Label>
      {children}
    </div>
  );
}
