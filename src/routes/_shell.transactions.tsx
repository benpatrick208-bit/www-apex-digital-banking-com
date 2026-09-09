import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Search } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBank } from "@/lib/bank-store";
import { longDate, money } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — Apex Digital Bank" },
      {
        name: "description",
        content: "Search and filter every Apex transaction by account, category and description.",
      },
      { property: "og:title", content: "Transactions — Apex Digital Bank" },
      { property: "og:description", content: "Search and filter your Apex account activity." },
    ],
  }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const { state } = useBank();
  const [q, setQ] = useState("");
  const [account, setAccount] = useState("all");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => Array.from(new Set(state.txns.map((t) => t.category))).sort(),
    [state.txns],
  );

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return state.txns.filter((t) => {
      if (account !== "all" && t.accountId !== account) return false;
      if (category !== "all" && t.category !== category) return false;
      if (!needle) return true;
      return (
        t.description.toLowerCase().includes(needle) ||
        t.merchant.toLowerCase().includes(needle) ||
        t.category.toLowerCase().includes(needle) ||
        String(Math.abs(t.amount)).includes(needle)
      );
    });
  }, [state.txns, q, account, category]);

  const totalOut = rows.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0);
  const totalIn = rows.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);

  return (
    <>
      <PageHeader title="Transactions" description="Search your full account history." />

      <Card>
        <CardContent className="grid gap-3 py-4 md:grid-cols-[1fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search description, merchant or amount"
              className="pl-9"
              aria-label="Search transactions"
            />
          </div>
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="md:w-56" aria-label="Filter by account">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All accounts</SelectItem>
              {state.accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="md:w-44" aria-label="Filter by category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>{rows.length} transactions</span>
        <span className="text-success">In {money(totalIn)}</span>
        <span>Out {money(totalOut)}</span>
      </div>

      <Card className="mt-3">
        <CardContent className="divide-y divide-border py-0">
          {rows.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No transactions match your search.
            </p>
          ) : (
            rows.map((t) => {
              const acct = state.accounts.find((a) => a.id === t.accountId);
              return (
                <div key={t.id} className="flex items-center gap-3 py-3.5">
                  <span
                    className={`inline-flex size-10 shrink-0 items-center justify-center rounded-full ${
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
                    <p className="truncate text-xs text-muted-foreground">
                      {longDate(t.date)} · {t.category} · {acct?.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${t.amount > 0 ? "text-success" : ""}`}
                    >
                      {money(t.amount, { signed: true })}
                    </p>
                    {t.status === "pending" ? (
                      <Badge variant="outline" className="mt-1 text-[10px]">
                        Pending
                      </Badge>
                    ) : (
                      <p className="text-[11px] text-muted-foreground">{t.method}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </>
  );
}
