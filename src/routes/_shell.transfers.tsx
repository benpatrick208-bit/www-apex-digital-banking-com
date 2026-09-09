import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Loader2, Star, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { PinDialog } from "@/components/pin-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBank } from "@/lib/bank-store";
import { money, shortDate } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/transfers")({
  head: () => ({
    meta: [
      { title: "Transfers — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Move money between Apex accounts, pay recipients, schedule transfers and manage favorites.",
      },
      { property: "og:title", content: "Transfers — Apex Digital Bank" },
      { property: "og:description", content: "Send money, schedule payments and manage recipients." },
    ],
  }),
  component: TransfersPage,
});

function TransfersPage() {
  const { state, transfer, addRecipient, toggleFavorite, removeRecipient, schedule, toggleScheduled, cancelScheduled } =
    useBank();

  const [mode, setMode] = useState<"internal" | "external">("internal");
  const [from, setFrom] = useState(state.accounts[0]?.id ?? "");
  const [to, setTo] = useState(state.accounts[1]?.id ?? "");
  const [recipientId, setRecipientId] = useState(state.recipients[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [error, setError] = useState("");
  const [pinOpen, setPinOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const value = Number(amount);
    if (!value || value <= 0) {
      setError("Enter an amount greater than $0.00.");
      return;
    }
    if (mode === "internal" && from === to) {
      setError("Choose two different accounts.");
      return;
    }
    setPinOpen(true);
  };

  const confirm = async () => {
    setPending(true);
    try {
      await transfer({
        fromAccountId: from,
        ...(mode === "internal" ? { toAccountId: to } : { recipientId }),
        amount: Number(amount),
        memo,
      });
      setPinOpen(false);
      setAmount("");
      setMemo("");
      toast.success("Transfer completed", { description: "Your money is on its way." });
    } catch (err) {
      setPinOpen(false);
      const msg = err instanceof Error ? err.message : "Transfer failed.";
      setError(msg);
      toast.error(msg);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <PageHeader title="Transfers" description="Send money and manage who you pay." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Make a transfer</CardTitle>
            <CardDescription>Transfers between Apex accounts post instantly.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="internal">Between my accounts</TabsTrigger>
                <TabsTrigger value="external">To someone else</TabsTrigger>
              </TabsList>

              <form onSubmit={submit} className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>From</Label>
                    <Select value={from} onValueChange={setFrom}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {state.accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name} — {money(a.available)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <TabsContent value="internal" className="m-0 space-y-2">
                    <Label>To</Label>
                    <Select value={to} onValueChange={setTo}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {state.accounts.map((a) => (
                          <SelectItem key={a.id} value={a.id}>
                            {a.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>

                  <TabsContent value="external" className="m-0 space-y-2">
                    <Label>Recipient</Label>
                    <Select value={recipientId} onValueChange={setRecipientId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a recipient" />
                      </SelectTrigger>
                      <SelectContent>
                        {state.recipients.map((r) => (
                          <SelectItem key={r.id} value={r.id}>
                            {r.name} · {r.bank} {r.accountMask}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TabsContent>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        id="amount"
                        inputMode="decimal"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-7 text-lg"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="memo">Memo (optional)</Label>
                    <Input
                      id="memo"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      placeholder="What's this for?"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {[50, 100, 250, 500].map((v) => (
                    <Button
                      key={v}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(String(v))}
                    >
                      ${v}
                    </Button>
                  ))}
                </div>

                {error ? (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : null}

                <Button type="submit" size="lg" className="w-full" disabled={pending}>
                  {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                  Review and send
                </Button>
              </form>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <RecipientsCard
            recipients={state.recipients}
            onToggle={toggleFavorite}
            onRemove={removeRecipient}
            onAdd={addRecipient}
          />
          <ScheduleCard
            onSchedule={schedule}
            onToggle={toggleScheduled}
            onCancel={cancelScheduled}
          />
        </div>
      </div>

      <PinDialog
        open={pinOpen}
        onOpenChange={setPinOpen}
        pending={pending}
        description={`Authorize ${money(Number(amount) || 0)} from your ${
          state.accounts.find((a) => a.id === from)?.name ?? "account"
        }.`}
        onConfirmed={confirm}
      />
    </>
  );
}

function RecipientsCard({
  recipients,
  onToggle,
  onRemove,
  onAdd,
}: {
  recipients: ReturnType<typeof useBank>["state"]["recipients"];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (r: { name: string; bank: string; accountMask: string; routing: string; favorite: boolean }) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [bank, setBank] = useState("");
  const [acct, setAcct] = useState("");
  const [routing, setRouting] = useState("");

  const sorted = [...recipients].sort((a, b) => Number(b.favorite) - Number(a.favorite));

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Recipients</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setAdding((v) => !v)}>
          <UserPlus className="size-4" /> Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {adding ? (
          <form
            className="space-y-2 rounded-lg bg-muted/60 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || acct.length < 4) {
                toast.error("Add a name and at least the last 4 digits.");
                return;
              }
              onAdd({
                name: name.trim(),
                bank: bank.trim() || "External bank",
                accountMask: `••${acct.slice(-4)}`,
                routing: routing.trim() || "021000418",
                favorite: false,
              });
              setName("");
              setBank("");
              setAcct("");
              setRouting("");
              setAdding(false);
              toast.success("Recipient added");
            }}
          >
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            <Input value={bank} onChange={(e) => setBank(e.target.value)} placeholder="Bank name" />
            <Input
              value={acct}
              onChange={(e) => setAcct(e.target.value)}
              placeholder="Account number"
              inputMode="numeric"
            />
            <Input
              value={routing}
              onChange={(e) => setRouting(e.target.value)}
              placeholder="Routing number"
              inputMode="numeric"
            />
            <Button type="submit" size="sm" className="w-full">
              Save recipient
            </Button>
          </form>
        ) : null}

        {sorted.map((r) => (
          <div key={r.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggle(r.id)}
              aria-label={r.favorite ? "Remove favorite" : "Mark favorite"}
              className="text-muted-foreground transition-colors hover:text-gold"
            >
              <Star className={`size-4 ${r.favorite ? "fill-gold text-gold" : ""}`} />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{r.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {r.bank} {r.accountMask}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Remove ${r.name}`}
              onClick={() => onRemove(r.id)}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ScheduleCard({
  onSchedule,
  onToggle,
  onCancel,
}: {
  onSchedule: ReturnType<typeof useBank>["schedule"];
  onToggle: (id: string) => void;
  onCancel: (id: string) => void;
}) {
  const { state } = useBank();
  const [open, setOpen] = useState(false);
  const [recipientId, setRecipientId] = useState(state.recipients[0]?.id ?? "");
  const [fromAccountId, setFrom] = useState(state.accounts[0]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<"once" | "weekly" | "monthly">("monthly");
  const [date, setDate] = useState("");

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-base">Scheduled transfers</CardTitle>
        <Button variant="ghost" size="sm" onClick={() => setOpen((v) => !v)}>
          <CalendarClock className="size-4" /> New
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {open ? (
          <form
            className="space-y-2 rounded-lg bg-muted/60 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              const value = Number(amount);
              if (!value || !date) {
                toast.error("Add an amount and a start date.");
                return;
              }
              onSchedule({
                recipientId,
                fromAccountId,
                amount: value,
                frequency,
                nextDate: new Date(date).toISOString(),
              });
              setAmount("");
              setDate("");
              setOpen(false);
              toast.success("Transfer scheduled");
            }}
          >
            <Select value={recipientId} onValueChange={setRecipientId}>
              <SelectTrigger>
                <SelectValue placeholder="Recipient" />
              </SelectTrigger>
              <SelectContent>
                {state.recipients.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fromAccountId} onValueChange={setFrom}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {state.accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>
                    {a.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              inputMode="decimal"
            />
            <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">One time</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button type="submit" size="sm" className="w-full">
              Schedule transfer
            </Button>
          </form>
        ) : null}

        {state.scheduled.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing scheduled yet.</p>
        ) : (
          state.scheduled.map((s) => {
            const r = state.recipients.find((x) => x.id === s.recipientId);
            return (
              <div key={s.id} className="rounded-lg border border-border p-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">{r?.name ?? "Recipient"}</p>
                    <p className="text-xs capitalize text-muted-foreground">
                      {money(s.amount)} · {s.frequency} · next {shortDate(s.nextDate)}
                    </p>
                  </div>
                  <Badge variant={s.active ? "secondary" : "outline"}>
                    {s.active ? "Active" : "Paused"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={s.active}
                      onCheckedChange={() => onToggle(s.id)}
                      aria-label="Pause or resume"
                    />
                    <span className="text-xs text-muted-foreground">
                      {s.active ? "Running" : "Paused"}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onCancel(s.id)}>
                    Cancel
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
