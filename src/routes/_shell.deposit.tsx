import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBank } from "@/lib/bank-store";
import { money } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/deposit")({
  head: () => ({
    meta: [
      { title: "Mobile Deposit — Apex Digital Bank" },
      {
        name: "description",
        content: "Deposit a check with Apex mobile deposit: capture front and back, then submit.",
      },
      { property: "og:title", content: "Mobile Deposit — Apex Digital Bank" },
      { property: "og:description", content: "Deposit checks from anywhere with Apex." },
    ],
  }),
  component: DepositPage,
});

function DepositPage() {
  const { state, depositCheck } = useBank();
  const [accountId, setAccountId] = useState(
    state.accounts.find((a) => a.type === "checking")?.id ?? state.accounts[0]?.id ?? "",
  );
  const [amount, setAmount] = useState("");
  const [front, setFront] = useState(false);
  const [back, setBack] = useState(false);
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!front || !back) {
      setError("Capture both the front and the back of the check.");
      return;
    }
    setPending(true);
    try {
      await depositCheck({ accountId, amount: Number(amount) });
      setDone(true);
      toast.success("Deposit submitted");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Deposit failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  if (done) {
    return (
      <>
        <PageHeader title="Mobile deposit" />
        <Card className="mx-auto max-w-md text-center">
          <CardContent className="py-10">
            <span className="mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle2 className="size-7" />
            </span>
            <h2 className="text-xl font-semibold">Deposit submitted</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {money(Number(amount))} is pending. Funds are typically available the next business
              day.
            </p>
            <Button
              className="mt-6"
              variant="outline"
              onClick={() => {
                setDone(false);
                setAmount("");
                setFront(false);
                setBack(false);
              }}
            >
              <RotateCcw className="size-4" /> Deposit another check
            </Button>
          </CardContent>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Mobile deposit" description="Deposit a check in under a minute." />

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="text-base">Check details</CardTitle>
          <CardDescription>
            Endorse the back with your signature and “For Apex mobile deposit only”.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <Label>Deposit to</Label>
              <Select value={accountId} onValueChange={setAccountId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {state.accounts
                    .filter((a) => a.type !== "credit")
                    .map((a) => (
                      <SelectItem key={a.id} value={a.id}>
                        {a.name} — {money(a.balance)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="check-amount">Check amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="check-amount"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-7 text-lg"
                />
              </div>
              <p className="text-xs text-muted-foreground">Limit $10,000.00 per check.</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <CaptureTile label="Front of check" captured={front} onCapture={() => setFront(true)} />
              <CaptureTile label="Back of check" captured={back} onCapture={() => setBack(true)} />
            </div>

            {error ? (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              {pending ? "Submitting deposit…" : "Submit deposit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}

function CaptureTile({
  label,
  captured,
  onCapture,
}: {
  label: string;
  captured: boolean;
  onCapture: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onCapture}
      className={`flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors ${
        captured
          ? "border-success/60 bg-success/5 text-success"
          : "border-border bg-muted/50 text-muted-foreground hover:border-primary/60 hover:text-primary"
      }`}
    >
      {captured ? <CheckCircle2 className="size-7" /> : <Camera className="size-7" />}
      <span className="text-sm font-medium">{captured ? `${label} captured` : `Capture ${label.toLowerCase()}`}</span>
    </button>
  );
}
