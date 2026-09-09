import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Plus, Target } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useBank } from "@/lib/bank-store";
import { money } from "@/lib/bank-data";

export const Route = createFileRoute("/_shell/goals")({
  head: () => ({
    meta: [
      { title: "Savings Goals — Apex Digital Bank" },
      {
        name: "description",
        content: "Create savings goals, track progress and move money toward what matters.",
      },
      { property: "og:title", content: "Savings Goals — Apex Digital Bank" },
      { property: "og:description", content: "Track and fund your Apex savings goals." },
    ],
  }),
  component: GoalsPage,
});

function GoalsPage() {
  const { state, addGoal, contribute } = useBank();
  const [newOpen, setNewOpen] = useState(false);
  const [name, setName] = useState("");
  const [target, setTarget] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [fundId, setFundId] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [pending, setPending] = useState(false);

  const checking = state.accounts.find((a) => a.type === "checking");
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);

  const createGoal = () => {
    const t = Number(target);
    if (!name.trim() || !t || t <= 0) {
      toast.error("Add a goal name and a target amount.");
      return;
    }
    addGoal({ name: name.trim(), target: t, targetDate: targetDate.trim() || "No date" });
    setNewOpen(false);
    setName("");
    setTarget("");
    setTargetDate("");
    toast.success("Goal created");
  };

  const fund = async () => {
    if (!fundId) return;
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter an amount greater than $0.00");
      return;
    }
    setPending(true);
    try {
      await contribute(fundId, value);
      toast.success(`${money(value)} added to your goal`);
      setFundId(null);
      setAmount("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Transfer failed.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Savings goals"
        description={`${money(totalSaved)} saved toward ${money(totalTarget)} across ${state.goals.length} goals.`}
        action={
          <Dialog open={newOpen} onOpenChange={setNewOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" /> New goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a savings goal</DialogTitle>
                <DialogDescription>
                  Set a target and fund it from Everyday Checking whenever you like.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-name">Goal name</Label>
                  <Input
                    id="goal-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Home deposit"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-target">Target amount</Label>
                  <Input
                    id="goal-target"
                    inputMode="decimal"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder="10000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-date">Target date</Label>
                  <Input
                    id="goal-date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    placeholder="Dec 2027"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setNewOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createGoal}>Create goal</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {state.goals.map((g) => {
          const progress = Math.min(100, (g.saved / g.target) * 100);
          const complete = g.saved >= g.target;
          return (
            <Card key={g.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-4 text-primary" />
                      {g.name}
                    </CardTitle>
                    <CardDescription>Target {g.targetDate}</CardDescription>
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {Math.round(progress)}%
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={progress} />
                <p className="mt-3 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{money(g.saved)}</span> of{" "}
                  {money(g.target)}
                  {complete ? " · goal reached" : ` · ${money(g.target - g.saved)} to go`}
                </p>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  onClick={() => {
                    setFundId(g.id);
                    setAmount("");
                  }}
                >
                  Add money
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!fundId} onOpenChange={(v) => !v && setFundId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add money to your goal</DialogTitle>
            <DialogDescription>
              Transferred from {checking?.name ?? "Everyday Checking"} ·{" "}
              {money(checking?.available ?? 0)} available.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="fund-amount">Amount</Label>
            <Input
              id="fund-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="250.00"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setFundId(null)}>
              Cancel
            </Button>
            <Button onClick={fund} disabled={pending}>
              {pending ? <Loader2 className="size-4 animate-spin" /> : null}
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
