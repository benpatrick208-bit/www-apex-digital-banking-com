import { createFileRoute } from "@tanstack/react-router";
import { BellRing, CheckCheck, Gift, ShieldAlert, Wallet } from "lucide-react";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useBank } from "@/lib/bank-store";
import { longDate } from "@/lib/bank-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_shell/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Apex Digital Bank" },
      {
        name: "description",
        content: "Account alerts, security notices and money movement updates from Apex.",
      },
      { property: "og:title", content: "Notifications — Apex Digital Bank" },
      { property: "og:description", content: "Stay on top of your Apex account activity." },
    ],
  }),
  component: NotificationsPage,
});

const icons = {
  money: Wallet,
  security: ShieldAlert,
  offer: Gift,
} as const;

function NotificationsPage() {
  const { state, readNotification, readAllNotifications } = useBank();
  const unread = state.notifications.filter((n) => !n.read).length;

  return (
    <div>
      <PageHeader
        title="Notifications"
        description={unread ? `${unread} unread alerts` : "You're all caught up."}
        action={
          <Button variant="outline" onClick={readAllNotifications} disabled={!unread}>
            <CheckCheck className="size-4" /> Mark all read
          </Button>
        }
      />

      {state.notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-16 text-center">
            <BellRing className="size-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {state.notifications.map((n) => {
            const Icon = icons[n.kind];
            return (
              <button
                key={n.id}
                type="button"
                onClick={() => readNotification(n.id)}
                className={cn(
                  "flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-colors hover:bg-accent/50",
                  !n.read && "border-primary/30 bg-primary/5",
                )}
              >
                <span
                  className={cn(
                    "grid size-10 shrink-0 place-items-center rounded-full",
                    n.kind === "security"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{n.title}</span>
                    {!n.read ? <span className="size-2 rounded-full bg-primary" /> : null}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{n.body}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {longDate(n.date)}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
