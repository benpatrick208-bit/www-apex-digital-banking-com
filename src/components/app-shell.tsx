import { useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Bell,
  CreditCard,
  FileText,
  Home,
  LineChart,
  LogOut,
  Menu,
  Moon,
  PiggyBank,
  Receipt,
  Settings,
  Smartphone,
  Sun,
  Wallet,
  X,
} from "lucide-react";
import { ApexLogo, ApexMark } from "@/components/apex-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useBank } from "@/lib/bank-store";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/transactions", label: "Transactions", icon: Receipt },
  { to: "/transfers", label: "Transfers", icon: ArrowLeftRight },
  { to: "/deposit", label: "Deposit", icon: Smartphone },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/insights", label: "Insights", icon: LineChart },
  { to: "/goals", label: "Goals", icon: PiggyBank },
  { to: "/statements", label: "Statements", icon: FileText },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

const mobileNav = nav.filter((n) =>
  ["/dashboard", "/accounts", "/transfers", "/cards", "/insights"].includes(n.to),
);

export function AppShell({ children }: { children: React.ReactNode }) {
  const { state, signOut, setDarkMode } = useBank();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const unread = state.notifications.filter((n) => !n.read).length;
  const initials = state.profile.fullName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/", replace: true });
  };

  const NavList = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
            )}
          >
            <item.icon className="size-4.5 shrink-0" />
            {item.label}
            {active ? <span className="ml-auto h-4 w-1 rounded-full bg-gold" /> : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar px-4 py-6 lg:flex">
        <Link to="/dashboard" className="px-2 text-sidebar-foreground">
          <ApexLogo markClassName="h-8 w-8 text-gold" />
        </Link>
        <div className="mt-6 flex-1 overflow-y-auto">
          <NavList />
        </div>
        <div className="mt-4 rounded-xl bg-sidebar-accent/50 p-3">
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-gold text-gold-foreground text-xs font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-sidebar-foreground">
                {state.profile.fullName}
              </p>
              <p className="truncate text-xs text-sidebar-foreground/60">
                @{state.profile.username}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="mt-2 w-full justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar px-4 py-5">
            <div className="flex items-center justify-between">
              <ApexLogo markClassName="h-7 w-7 text-gold" className="text-sidebar-foreground" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-sidebar-foreground"
              >
                <X className="size-5" />
              </Button>
            </div>
            <div className="mt-5 flex-1 overflow-y-auto">
              <NavList onNavigate={() => setOpen(false)} />
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="justify-start text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <LogOut className="size-4" /> Sign out
            </Button>
          </div>
        </div>
      ) : null}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" />
          </Button>
          <Link to="/dashboard" className="flex items-center gap-2 lg:hidden">
            <ApexMark className="h-7 w-7 text-primary" />
            <span className="text-lg font-semibold lowercase tracking-tight">apex</span>
          </Link>
          <p className="hidden text-sm text-muted-foreground lg:block">
            Welcome back, {state.profile.fullName.split(" ")[0]}
          </p>
          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => setDarkMode(!state.darkMode)}
            >
              {state.darkMode ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Link to="/notifications" className="relative">
              <Button variant="ghost" size="icon" aria-label="Notifications">
                <Bell className="size-5" />
              </Button>
              {unread > 0 ? (
                <Badge className="pointer-events-none absolute -right-0.5 -top-0.5 h-5 min-w-5 justify-center rounded-full bg-gold px-1 text-[11px] text-gold-foreground">
                  {unread}
                </Badge>
              ) : null}
            </Link>
            <Link to="/settings" aria-label="Profile">
              <Avatar className="ml-1 size-9">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 pb-28 pt-6 md:px-6 lg:pb-12">{children}</main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
        {mobileNav.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
