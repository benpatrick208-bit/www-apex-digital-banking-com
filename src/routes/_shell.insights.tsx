import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBank } from "@/lib/bank-store";
import { money } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/insights")({
  head: () => ({
    meta: [
      { title: "Insights — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Track your credit score, monthly budgets and spending breakdown by category with Apex insights.",
      },
      { property: "og:title", content: "Insights — Apex Digital Bank" },
      { property: "og:description", content: "Credit score, budgets and spending insights." },
    ],
  }),
  component: InsightsPage,
});

const scoreBand = (score: number) =>
  score >= 800
    ? "Exceptional"
    : score >= 740
      ? "Very good"
      : score >= 670
        ? "Good"
        : score >= 580
          ? "Fair"
          : "Poor";

export function InsightsPage() {
  const { state, setBudget } = useBank();
  const score = state.profile.creditScore;
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const now = new Date();
  const thisMonth = useMemo(
    () =>
      state.txns.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }),
    [state.txns, now],
  );

  const spentBy = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of thisMonth) {
      if (t.amount >= 0) continue;
      map.set(t.category, (map.get(t.category) ?? 0) + Math.abs(t.amount));
    }
    return map;
  }, [thisMonth]);

  const categories = useMemo(
    () => [...spentBy.entries()].sort((a, b) => b[1] - a[1]),
    [spentBy],
  );
  const totalSpent = categories.reduce((sum, [, v]) => sum + v, 0);
  const income = thisMonth.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  const pct = Math.min(1, Math.max(0, (score - 300) / 550));

  return (
    <div>
      <PageHeader
        title="Insights"
        description="Your credit health, budgets and where your money went this month."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Credit score</CardTitle>
            <CardDescription>FICO® Score 8 · updated today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Gauge value={pct} score={score} />
              <p className="mt-3 text-sm font-medium">{scoreBand(score)}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="size-3.5" /> Up 8 points since last month
              </p>
            </div>
            <div className="mt-6 space-y-3 text-sm">
              <Factor label="Payment history" value="100% on-time" tone="good" />
              <Factor label="Credit utilization" value="12% of limit" tone="good" />
              <Factor label="Age of credit" value="7 yrs 4 mo" tone="good" />
              <Factor label="Hard inquiries" value="1 in 12 months" tone="warn" />
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending this month</CardTitle>
            <CardDescription>
              {money(totalSpent)} spent · {money(income)} received
            </CardDescription>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-sm text-muted-foreground">No spending recorded yet this month.</p>
            ) : (
              <div className="space-y-4">
                {categories.map(([category, amount]) => (
                  <div key={category}>
                    <div className="mb-1.5 flex items-center justify-between text-sm">
                      <span className="font-medium">{category}</span>
                      <span className="text-muted-foreground">
                        {money(amount)} · {Math.round((amount / totalSpent) * 100)}%
                      </span>
                    </div>
                    <Progress value={(amount / totalSpent) * 100} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Monthly budgets</CardTitle>
          <CardDescription>Tap a budget to adjust its limit.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          {state.budgets.map((b) => {
            const spent = spentBy.get(b.category) ?? 0;
            const over = spent > b.limit;
            return (
              <div key={b.category} className="rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{b.category}</span>
                  <span
                    className={
                      "text-sm " + (over ? "text-destructive" : "text-muted-foreground")
                    }
                  >
                    {money(spent)} of {money(b.limit)}
                  </span>
                </div>
                <Progress className="mt-2" value={Math.min(100, (spent / b.limit) * 100)} />
                <div className="mt-3 flex items-center gap-2">
                  {editing === b.category ? (
                    <>
                      <Input
                        autoFocus
                        inputMode="decimal"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        className="h-8 w-28"
                      />
                      <Button
                        size="sm"
                        onClick={() => {
                          const next = Number(draft);
                          if (!next || next <= 0) {
                            toast.error("Enter a limit greater than $0.00");
                            return;
                          }
                          setBudget(b.category, next);
                          setEditing(null);
                          toast.success(`${b.category} budget updated`);
                        }}
                      >
                        Save
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        {over ? (
                          <TrendingDown className="size-3.5 text-destructive" />
                        ) : (
                          <TrendingUp className="size-3.5" />
                        )}
                        {over
                          ? `${money(spent - b.limit)} over budget`
                          : `${money(b.limit - spent)} left`}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto"
                        onClick={() => {
                          setEditing(b.category);
                          setDraft(String(b.limit));
                        }}
                      >
                        Edit limit
                      </Button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}

function Gauge({ value, score }: { value: number; score: number }) {
  const r = 70;
  const c = Math.PI * r;
  return (
    <div className="relative">
      <svg viewBox="0 0 180 100" className="w-56">
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke="currentColor"
          className="text-muted"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M 20 95 A 70 70 0 0 1 160 95"
          fill="none"
          stroke="currentColor"
          className="text-primary"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={`${c * value} ${c}`}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <span className="text-4xl font-semibold tabular-nums">{score}</span>
      </div>
    </div>
  );
}

function Factor({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "good" | "warn";
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={
          "font-medium " +
          (tone === "good" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")
        }
      >
        {value}
      </span>
    </div>
  );
}
