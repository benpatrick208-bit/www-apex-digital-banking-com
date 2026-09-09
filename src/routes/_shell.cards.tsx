import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Eye, EyeOff, Snowflake, Wifi } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { PinDialog } from "@/components/pin-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useBank } from "@/lib/bank-store";
import { money } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/cards")({
  head: () => ({
    meta: [
      { title: "Cards — Apex Digital Bank" },
      {
        name: "description",
        content:
          "View your Apex virtual debit card details, freeze or unfreeze the card, and manage limits.",
      },
      { property: "og:title", content: "Cards — Apex Digital Bank" },
      { property: "og:description", content: "Manage your Apex virtual debit card." },
    ],
  }),
  component: CardsPage,
});

function CardsPage() {
  const { state, toggleFreeze } = useBank();
  const [revealed, setRevealed] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const card = state.card;
  const checking = state.accounts.find((a) => a.type === "checking");

  const masked = `•••• •••• •••• ${card.number.slice(-4)}`;

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  return (
    <div>
      <PageHeader
        title="Cards"
        description="Your Apex virtual debit card, linked to Everyday Checking."
        action={
          <Button variant={card.frozen ? "default" : "outline"} onClick={toggleFreeze}>
            <Snowflake className="size-4" />
            {card.frozen ? "Unfreeze card" : "Freeze card"}
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <div className="space-y-4">
          <div
            className={
              "relative aspect-[1.586/1] w-full overflow-hidden rounded-2xl bg-primary p-6 text-primary-foreground shadow-xl transition-opacity " +
              (card.frozen ? "opacity-60" : "")
            }
          >
            <div className="absolute -right-16 -top-16 size-56 rounded-full bg-gold/20" />
            <div className="absolute -bottom-20 -left-10 size-52 rounded-full bg-white/5" />
            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="text-lg font-semibold tracking-tight">apex</span>
                <Wifi className="size-5 rotate-90 opacity-80" />
              </div>
              <div>
                <div className="mb-4 h-8 w-11 rounded-md bg-gold/80" />
                <p className="font-mono text-lg tracking-[0.18em] md:text-xl">
                  {revealed ? card.number : masked}
                </p>
              </div>
              <div className="flex items-end justify-between text-xs">
                <div>
                  <p className="opacity-70">Card holder</p>
                  <p className="text-sm font-medium uppercase">{state.profile.fullName}</p>
                </div>
                <div className="text-right">
                  <p className="opacity-70">Expires</p>
                  <p className="text-sm font-medium">{card.expiry}</p>
                </div>
                <div className="text-right">
                  <p className="opacity-70">CVV</p>
                  <p className="text-sm font-medium">{revealed ? card.cvv : "•••"}</p>
                </div>
              </div>
            </div>
            {card.frozen ? (
              <div className="absolute inset-0 grid place-items-center bg-background/40 backdrop-blur-[2px]">
                <Badge className="gap-1 bg-background text-foreground">
                  <Snowflake className="size-3.5" /> Frozen
                </Badge>
              </div>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => (revealed ? setRevealed(false) : setPinOpen(true))}
            >
              {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              {revealed ? "Hide details" : "Reveal details"}
            </Button>
            <Button
              variant="outline"
              disabled={!revealed}
              onClick={() => copy(card.number.replace(/\s/g, ""), "Card number")}
            >
              <Copy className="size-4" /> Copy number
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Card details</CardTitle>
              <CardDescription>Virtual debit card · Visa</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row label="Status" value={card.frozen ? "Frozen" : "Active"} />
              <Separator />
              <Row label="Linked account" value={checking?.name ?? "Everyday Checking"} />
              <Separator />
              <Row label="Available to spend" value={money(checking?.available ?? 0)} />
              <Separator />
              <Row label="Daily purchase limit" value={money(3000)} />
              <Separator />
              <Row label="ATM withdrawal limit" value={money(1000)} />
              <Separator />
              <Row label="Contactless" value="Enabled" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card controls</CardTitle>
              <CardDescription>
                Freezing blocks new purchases instantly. Recurring payments already scheduled will
                decline until you unfreeze.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => toast.success("A new card is on its way")}>
                Replace card
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Travel notice added for 30 days")}
              >
                Add travel notice
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.success("Dispute request started — we'll email you")}
              >
                Dispute a charge
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <PinDialog
        open={pinOpen}
        onOpenChange={setPinOpen}
        title="Confirm with your PIN"
        description="Enter your 4-digit PIN to reveal your full card details."
        onConfirmed={() => {
          setPinOpen(false);
          setRevealed(true);
        }}
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
