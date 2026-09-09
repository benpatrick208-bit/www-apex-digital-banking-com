import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Smartphone,
  CreditCard,
  Receipt,
} from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useBank } from "@/lib/bank-store";
import { money, shortDate } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Apex Digital Bank" },
      {
        name: "description",
        content: "Your Apex balances, recent activity, spending and upcoming payments at a glance.",
      },
      { property: "og:title", content: "Dashboard — Apex Digital Bank" },
      { property: "og:description", content: "Balances, activity and upcoming payments." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { state } = useBank();
  const [hidden, setHidden] = useState(false);
  const accounts = state.accounts;
  const deposits = accounts.filter((a) => a.type !== "credit");
  const total = deposits.reduce((sum, a) => sum + a.balance, 0);
  const recent = state.txns.slice(0, 6);

  const thisMonth = useMemo(() => {
    const now = new Date();
    const rows = state.txns.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    return {
      in: rows.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0),
      out: rows.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0),
    };
  }, [state.txns]);

  const upcoming = state.scheduled
    .filter((s) => s.active)
    .sort((a, b) => a.nextDate.localeCompare(b.nextDate));

  const mask = (v: string) => (hidden ? "••••••" : v);

  return (
    <>
      <PageHeader
        title={
          state.profile.fullName
            ? `Welcome back, ${state.profile.fullName}`
            : "Dashboard"
        }
        description="A complete view of your money with Apex."
        action={
          <Button variant="outline" size="sm" onClick={() => setHidden((h) => !h)}>
            {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
            {hidden ? "Show balances" : "Hide balances"}
          </Button>
        }
      />

      <div className="surface-navy card-elevated relative overflow-hidden rounded-2xl p-6 md:p-8">
        <div className="absolute -right-16 -top-16 size-56 rounded-full bg-gold/10" />
        <p className="text-sm text-navy-foreground/70">Total deposit balance</p>
        <p className="mt-1 text-4xl font-semibold tracking-tight md:text-5xl">
          {mask(money(total))}
        </p>
        <div className="gold-rule mt-5 h-px w-40" />
        <div className="mt-5 flex flex-wrap gap-6">
          <div>
            <p className="text-xs text-navy-foreground/70">Money in this month</p>
            <p className="text-lg font-medium">{mask(money(thisMonth.in))}</p>
          </div>
          <div>
            <p className="text-xs text-navy-foreground/70">Money out this month</p>
            <p className="text-lg font-medium">{mask(money(thisMonth.out))}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { to: "/transfers", label: "Transfer", icon: ArrowLeftRight },
          { to: "/deposit", label: "Deposit", icon: Smartphone },
          { to: "/cards", label: "Cards", icon: CreditCard },
          { to: "/transactions", label: "Activity", icon: Receipt },
        ].map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col items-center gap-2 py-5">
                <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <a.icon className="size-5" />
                </span>
                <span className="text-sm font-medium">{a.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {accounts.map((a) => (
          <Card key={a.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{a.name}</CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {a.type}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">•••• {a.number.slice(-4)}</p>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold">{mask(money(a.balance))}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {a.type === "credit"
                  ? `${money(a.available)} available of ${money(a.limit ?? 0)}`
                  : `${money(a.available)} available`}
              </p>
              {a.type === "credit" && a.limit ? (
                <Progress
                  className="mt-3 h-1.5"
                  value={(Math.abs(a.balance) / a.limit) * 100}
                />
              ) : null}
              {a.apy ? (
                <p className="mt-3 text-xs font-medium text-success">{a.apy}% APY</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Link to="/transactions" className="text-sm font-medium text-primary hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-3 py-3">
                <span
                  className={`inline-flex size-9 shrink-0 items-center justify-center rounded-full ${
                    t.amount > 0 ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {t.amount > 0 ? (
                    <ArrowDownLeft className="size-4" />
                  ) : (
                    <ArrowUpRight className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{t.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {shortDate(t.date)} · {t.category}
                    {t.status === "pending" ? " · Pending" : ""}
                  </p>
                </div>
                <p
                  className={`text-sm font-semibold ${t.amount > 0 ? "text-success" : "text-foreground"}`}
                >
                  {money(t.amount, { signed: true })}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Upcoming payments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcoming.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing scheduled.</p>
            ) : (
              upcoming.map((s) => {
                const r = state.recipients.find((x) => x.id === s.recipientId);
                return (
                  <div key={s.id} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{r?.name ?? "Recipient"}</p>
                      <p className="text-xs capitalize text-muted-foreground">
                        {s.frequency} · {shortDate(s.nextDate)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold">{money(s.amount)}</p>
                  </div>
                );
              })
            )}
            <Link
              to="/transfers"
              className="block pt-1 text-sm font-medium text-primary hover:underline"
            >
              Manage scheduled transfers
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
