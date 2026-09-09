import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBank } from "@/lib/bank-store";
import { longDate, money } from "@/lib/bank-data";
import { buildPdf, downloadBlob } from "@/lib/pdf";

export const Route = createFileRoute("/_shell/statements")({
  head: () => ({
    meta: [
      { title: "Statements — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Download monthly PDF account statements for your Apex Digital Bank checking, savings and credit accounts.",
      },
      { property: "og:title", content: "Statements — Apex Digital Bank" },
      {
        property: "og:description",
        content: "Download monthly PDF statements for your Apex accounts.",
      },
    ],
  }),
  component: StatementsPage,
});

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const parts = key.split("-").map(Number);
  const y = parts[0] ?? 2026;
  const m = parts[1] ?? 1;
  return new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function StatementsPage() {
  const { state } = useBank();
  const [accountId, setAccountId] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const account = state.accounts.find((a) => a.id === accountId) ?? state.accounts[0];

  const periods = useMemo(() => {
    const keys: string[] = [];
    const d = new Date();
    for (let i = 0; i < 6; i++) {
      keys.push(monthKey(new Date(d.getFullYear(), d.getMonth() - i, 1)));
    }
    return keys;
  }, []);

  const rowsFor = (key: string) =>
    state.txns
      .filter((t) => t.accountId === accountId && monthKey(new Date(t.date)) === key)
      .sort((a, b) => +new Date(a.date) - +new Date(b.date));

  const generate = async (key: string) => {
    setBusy(key);
    await new Promise((r) => setTimeout(r, 700));
    const rows = rowsFor(key);
    const credits = rows.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
    const debits = rows.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

    const lines = [
      { text: "APEX DIGITAL BANK", size: 18, bold: true, gap: 4 },
      { text: "Member FDIC · Equal Housing Lender", size: 9, gap: 14 },
      { text: `Account Statement — ${monthLabel(key)}`, size: 13, bold: true, gap: 12 },
      { text: `${state.profile.fullName}`, size: 10, gap: 2 },
      { text: state.profile.address, size: 10, gap: 12 },
      { text: `Account: ${account.name}`, size: 10, bold: true, gap: 2 },
      { text: `Account number: ****${account.number.slice(-4)}`, size: 10, gap: 2 },
      { text: `Routing number: ${account.routing}`, size: 10, gap: 14 },
      { text: "SUMMARY", size: 11, bold: true, gap: 8 },
      { text: `Deposits and credits: ${money(credits)}`, size: 10, gap: 2 },
      { text: `Withdrawals and debits: ${money(debits)}`, size: 10, gap: 2 },
      { text: `Ending balance: ${money(account.balance)}`, size: 10, gap: 16 },
      { text: "TRANSACTIONS", size: 11, bold: true, gap: 8 },
      {
        text: "DATE        DESCRIPTION                                   AMOUNT",
        size: 9,
        bold: true,
        gap: 6,
      },
      ...(rows.length
        ? rows.map((t) => ({
            text: `${longDate(t.date).padEnd(14)}${t.description.slice(0, 40).padEnd(46)}${money(t.amount, { signed: true })}`,
            size: 9,
            gap: 4,
          }))
        : [{ text: "No transactions posted during this period.", size: 9, gap: 4 }]),
      { text: " ", size: 9, gap: 14 },
      {
        text: "This statement is provided for informational purposes. Please review and report",
        size: 8,
        gap: 2,
      },
      {
        text: "any discrepancies within 60 days. Apex Digital Bank, 1 Harbor Plaza, New York, NY.",
        size: 8,
        gap: 2,
      },
    ];

    try {
      downloadBlob(buildPdf(lines), `apex-statement-${key}-${account.number.slice(-4)}.pdf`);
      toast.success(`${monthLabel(key)} statement downloaded`);
    } catch {
      toast.error("We couldn't generate that statement. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Statements"
        description="Download official monthly statements as PDF documents."
      />

      <Card>
        <CardHeader>
          <CardTitle>Select an account</CardTitle>
          <CardDescription>Statements are available for the last six months.</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={accountId} onValueChange={setAccountId}>
            <SelectTrigger className="w-full sm:w-96">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {state.accounts.map((a) => (
                <SelectItem key={a.id} value={a.id}>
                  {a.name} · ****{a.number.slice(-4)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Available statements</CardTitle>
          <CardDescription>{account.name}</CardDescription>
        </CardHeader>
        <CardContent className="divide-y">
          {periods.map((key) => {
            const count = rowsFor(key).length;
            return (
              <div key={key} className="flex flex-wrap items-center gap-3 py-3">
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <FileText className="size-4" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{monthLabel(key)}</p>
                  <p className="text-xs text-muted-foreground">
                    {count} transaction{count === 1 ? "" : "s"} · PDF
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  disabled={busy === key}
                  onClick={() => generate(key)}
                >
                  {busy === key ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Download
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
