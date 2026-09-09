import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBank } from "@/lib/bank-store";
import { money, shortDate } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/accounts")({
  head: () => ({
    meta: [
      { title: "Accounts — Apex Digital Bank" },
      {
        name: "description",
        content:
          "View Apex checking, high-yield savings and credit account details, numbers and recent activity.",
      },
      { property: "og:title", content: "Accounts — Apex Digital Bank" },
      { property: "og:description", content: "Account details, numbers and recent activity." },
    ],
  }),
  component: AccountsPage,
});

function AccountsPage() {
  const { state } = useBank();
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s/g, ""));
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn't copy — try selecting the number instead.");
    }
  };

  return (
    <>
      <PageHeader title="Accounts" description="Every Apex account you hold, in one place." />

      <div className="space-y-4">
        {state.accounts.map((a) => {
          const show = !!revealed[a.id];
          const recent = state.txns.filter((t) => t.accountId === a.id).slice(0, 4);
          return (
            <Card key={a.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg">{a.name}</CardTitle>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {a.type === "credit" ? "Credit card account" : "Deposit account"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="capitalize">
                    {a.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-end gap-x-10 gap-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {a.type === "credit" ? "Current balance" : "Balance"}
                    </p>
                    <p className="text-3xl font-semibold">{money(a.balance)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Available</p>
                    <p className="text-lg font-medium">{money(a.available)}</p>
                  </div>
                  {a.apy ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Interest rate</p>
                      <p className="text-lg font-medium text-success">{a.apy}% APY</p>
                    </div>
                  ) : null}
                  {a.limit ? (
                    <div>
                      <p className="text-xs text-muted-foreground">Credit limit</p>
                      <p className="text-lg font-medium">{money(a.limit)}</p>
                    </div>
                  ) : null}
                </div>

                <Separator className="my-4" />

                <div className="grid gap-3 sm:grid-cols-2">
                  <DetailRow
                    label="Account number"
                    value={show ? a.number : `•••• •••• ${a.number.slice(-4)}`}
                    onCopy={() => copy(a.number, "Account number")}
                  />
                  <DetailRow
                    label="Routing number"
                    value={show ? a.routing : "•••••••••"}
                    onCopy={() => copy(a.routing, "Routing number")}
                  />
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => setRevealed((r) => ({ ...r, [a.id]: !show }))}
                >
                  {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  {show ? "Hide numbers" : "Show numbers"}
                </Button>

                <Separator className="my-4" />

                <p className="mb-2 text-sm font-medium">Latest activity</p>
                <div className="divide-y divide-border">
                  {recent.length === 0 ? (
                    <p className="py-2 text-sm text-muted-foreground">No activity yet.</p>
                  ) : (
                    recent.map((t) => (
                      <div key={t.id} className="flex items-center justify-between gap-3 py-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{shortDate(t.date)}</p>
                        </div>
                        <p
                          className={`text-sm font-medium ${t.amount > 0 ? "text-success" : ""}`}
                        >
                          {money(t.amount, { signed: true })}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <Link
                  to="/transactions"
                  className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
                >
                  See all transactions
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}

function DetailRow({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string;
  onCopy: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2">
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate font-mono text-sm">{value}</p>
      </div>
      <Button variant="ghost" size="icon" aria-label={`Copy ${label}`} onClick={onCopy}>
        <Copy className="size-4" />
      </Button>
    </div>
  );
}
