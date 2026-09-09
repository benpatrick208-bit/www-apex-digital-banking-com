import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarClock,
  Car,
  CreditCard,
  FileText,
  Gauge,
  Home,
  LineChart,
  Loader2,
  Lock,
  LogIn,
  PiggyBank,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { ApexLogo, ApexMark } from "@/components/apex-logo";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useBank } from "@/lib/bank-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apex Digital Bank — Online & Mobile Banking" },
      {
        name: "description",
        content:
          "Bank with Apex Digital Bank: checking, savings, credit cards, mortgages, auto loans, business banking and investing. Secure online banking sign-in. Open an account online in minutes.",
      },
      { property: "og:title", content: "Apex Digital Bank — Online & Mobile Banking" },
      {
        property: "og:description",
        content:
          "Checking, savings, credit cards, mortgages, auto loans, business banking and investing — all in one secure digital bank.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const quickLinks = [
  { icon: Wallet, label: "Checking", href: "/signup" },
  { icon: PiggyBank, label: "Savings", href: "/signup" },
  { icon: CreditCard, label: "Credit cards", href: "/signup" },
  { icon: Home, label: "Home loans", href: "/signup" },
  { icon: Car, label: "Auto", href: "/signup" },
  { icon: TrendingUp, label: "Investing", href: "/signup" },
  { icon: Briefcase, label: "Business", href: "/signup" },
  { icon: Building2, label: "Commercial", href: "/about" },
  { icon: Gauge, label: "Credit score", href: "/signup" },
  { icon: CalendarClock, label: "Schedule a meeting", href: "/about" },
];

const promos = [
  {
    eyebrow: "Apex Everyday Checking",
    title: "$0 monthly service fee",
    text: "Open an Apex checking account online, set up direct deposit and skip monthly maintenance fees for good.",
    cta: "Open now",
    href: "/signup",
  },
  {
    eyebrow: "Apex Card",
    title: "Visa or Mastercard, your choice",
    text: "Pick your network at sign-up and get a virtual card instantly — with freeze controls and real-time alerts.",
    cta: "Learn more",
    href: "/signup",
  },
  {
    eyebrow: "Apex Investing",
    title: "Commission-free online trades",
    text: "Invest on your own terms next to your everyday accounts, with no hidden platform fees.",
    cta: "Continue",
    href: "/signup",
  },
];

const products = [
  {
    icon: LogIn,
    title: "Online banking sign-in",
    text: "Secure 24/7 access to your accounts, transfers, statements and card controls from any device.",
    cta: "Sign in",
    href: "/login",
  },
  {
    icon: Wallet,
    title: "Checking accounts",
    text: "No monthly maintenance fee, instant alerts, early direct deposit and your account and routing numbers the moment you're approved.",
    cta: "Open checking",
    href: "/signup",
  },
  {
    icon: PiggyBank,
    title: "Savings accounts",
    text: "Grow your money with a competitive variable APY, automatic savings goals and round-the-clock access from any device.",
    cta: "Open savings",
    href: "/signup",
  },
  {
    icon: CreditCard,
    title: "Credit cards",
    text: "Choose a Visa or Mastercard with no hidden fees, instant freeze controls and real-time purchase alerts.",
    cta: "Explore cards",
    href: "/signup",
  },
  {
    icon: Home,
    title: "Mortgages",
    text: "Competitive home loan rates, fast pre-approval and a dedicated mortgage team to guide you from application to closing.",
    cta: "Get pre-approved",
    href: "/signup",
  },
  {
    icon: Car,
    title: "Auto loans",
    text: "Flexible financing for new and used vehicles with quick decisions, transparent rates and no prepayment penalties.",
    cta: "Apply now",
    href: "/signup",
  },
  {
    icon: Building2,
    title: "Business banking",
    text: "Business checking, employee cards, ACH payments and expense tools designed to keep your company moving.",
    cta: "Open business account",
    href: "/signup",
  },
  {
    icon: TrendingUp,
    title: "Investing",
    text: "Self-directed investing and managed portfolios so you can build wealth alongside your everyday banking.",
    cta: "Start investing",
    href: "/signup",
  },
];

const services = [
  {
    icon: ArrowLeftRight,
    title: "Transfers & payments",
    text: "Move money between your Apex accounts or to favorite recipients, schedule future and recurring transfers, and track every payment in real time.",
  },
  {
    icon: Smartphone,
    title: "Mobile deposit",
    text: "Snap a photo of a check and deposit it from anywhere. Funds availability is shown clearly before you confirm.",
  },
  {
    icon: LineChart,
    title: "Insights & budgets",
    text: "Spending breakdowns, monthly budgets, savings goals and downloadable PDF statements keep you in control of your money.",
  },
];

const steps = [
  {
    title: "Tell us about yourself",
    text: "Enter your full name, email and phone number and create a secure password and PIN — it takes about two minutes.",
  },
  {
    title: "Confirm your email",
    text: "We send a confirmation link to your inbox. One click verifies it's really you and activates your profile.",
  },
  {
    title: "Start banking",
    text: "Sign in to see your new checking and savings accounts, your 9-digit account number, routing number 084307761, and your virtual Visa or Mastercard.",
  },
];

const navGroups = ["Checking", "Savings & CDs", "Credit cards", "Home loans", "Auto", "Investing", "Business"];

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-foreground/10">
      <div className="surface-navy">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" aria-label="Apex Digital Bank home">
            <ApexLogo className="text-navy-foreground" markClassName="h-8 w-8 text-gold" wordClassName="text-xl" />
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-navy-foreground/85 lg:flex">
            <a href="#products" className="transition-colors hover:text-navy-foreground">
              Products
            </a>
            <a href="#services" className="transition-colors hover:text-navy-foreground">
              Services
            </a>
            <a href="#open-account" className="transition-colors hover:text-navy-foreground">
              Open an account
            </a>
            <Link to="/about" className="transition-colors hover:text-navy-foreground">
              About us
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="ghost"
              className="text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            >
              <Link to="/login">Sign in</Link>
            </Button>
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/signup">Open an account</Link>
            </Button>
          </div>
        </div>
        {/* Product nav bar */}
        <div className="hidden border-t border-navy-foreground/10 md:block">
          <ul className="mx-auto flex max-w-6xl items-center gap-6 overflow-x-auto px-6 py-2.5 text-sm text-navy-foreground/80">
            {navGroups.map((g) => (
              <li key={g}>
                <Link to="/signup" className="whitespace-nowrap transition-colors hover:text-navy-foreground">
                  {g}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

function SignInPanel() {
  const { signIn, signedIn, ready } = useBank();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [useToken, setUseToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && signedIn) navigate({ to: "/dashboard", replace: true });
  }, [ready, signedIn, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: "/dashboard", replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-elevated w-full rounded-2xl border border-border bg-card p-6 text-card-foreground">
      <h2 className="text-lg font-semibold tracking-tight">Sign in to online banking</h2>
      <form onSubmit={onSubmit} className="mt-4 space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="home-email">Email</Label>
          <Input
            id="home-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="home-password">Password</Label>
          <Input
            id="home-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <label className="flex items-center gap-2">
            <Checkbox checked={remember} onCheckedChange={(v) => setRemember(Boolean(v))} />
            Remember me
          </label>
          <label className="flex items-center gap-2">
            <Checkbox checked={useToken} onCheckedChange={(v) => setUseToken(Boolean(v))} />
            Use token
          </label>
        </div>
        <Button type="submit" size="lg" className="h-12 w-full text-base" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
        </Button>
      </form>
      <div className="mt-4 space-y-2 text-sm">
        <Link to="/login" className="block font-medium text-primary hover:underline">
          Forgot username or password?
        </Link>
        <p className="text-muted-foreground">
          Not enrolled?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="size-3.5 text-success" /> 256-bit encrypted connection
      </p>
    </div>
  );
}

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero with sign-in */}
        <section className="surface-navy relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:py-20">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold tracking-wide text-gold">
                <ShieldCheck className="size-3.5" /> Member FDIC · Equal Housing Lender
              </p>
              <h1 className="mt-5 text-4xl font-bold tracking-tight text-navy-foreground md:text-5xl lg:text-6xl">
                Banking, lending and investing — all in one place
              </h1>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-navy-foreground/80 md:text-lg">
                Checking, savings, credit cards, mortgages, auto loans, business banking and investing.
                Everything you need to manage, grow and protect your money.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/90">
                  <Link to="/signup">
                    Open an account <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>

              {/* Balance card illustration */}
              <div className="mt-10 max-w-md rounded-2xl border border-navy-foreground/20 bg-navy-foreground/5 p-6 text-navy-foreground backdrop-blur">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ApexMark className="h-7 w-7 text-gold" />
                    <span className="text-sm font-semibold lowercase tracking-tight">apex checking</span>
                  </div>
                  <span className="text-xs text-navy-foreground/70">Available balance</span>
                </div>
                <p className="mt-4 text-4xl font-bold tracking-tight">$2,450.00</p>
                <div className="gold-rule my-5 h-px w-full opacity-70" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-navy-foreground/10 p-3">
                    <p className="text-xs text-navy-foreground/70">Account number</p>
                    <p className="mt-0.5 font-semibold tracking-wider">••••••4217</p>
                  </div>
                  <div className="rounded-lg bg-navy-foreground/10 p-3">
                    <p className="text-xs text-navy-foreground/70">Routing number</p>
                    <p className="mt-0.5 font-semibold tracking-wider">084307761</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <SignInPanel />
            </div>
          </div>
        </section>

        {/* Quick links row */}
        <section className="border-b border-border bg-card">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <h2 className="text-xl font-semibold tracking-tight">Choose what's right for you</h2>
            <ul className="mt-6 grid grid-cols-3 gap-4 sm:grid-cols-5 lg:grid-cols-10">
              {quickLinks.map((q) => (
                <li key={q.label}>
                  <Link
                    to={q.href}
                    className="flex flex-col items-center gap-2 rounded-xl border border-transparent p-3 text-center transition-colors hover:border-border hover:bg-secondary/60"
                  >
                    <q.icon className="size-6 text-primary" />
                    <span className="text-xs font-medium leading-tight">{q.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Promo tiles */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-5 md:grid-cols-3">
            {promos.map((p) => (
              <article
                key={p.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]"
              >
                <div className="surface-navy px-6 py-8">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">{p.eyebrow}</p>
                  <h3 className="mt-2 text-xl font-bold tracking-tight text-navy-foreground">{p.title}</h3>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="flex-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                  <Button asChild variant="link" className="mt-4 h-auto justify-start p-0 text-sm font-semibold">
                    <Link to={p.href}>
                      {p.cta} <ArrowRight className="ml-1 size-3.5" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 md:py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Banking products for every goal</h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              From everyday banking to home loans, business accounts and investing — find the right fit and open online in minutes.
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <article
                key={p.title}
                className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <p.icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                <Button asChild variant="link" className="mt-4 h-auto justify-start p-0 text-sm font-semibold text-primary">
                  <Link to={p.href}>
                    {p.cta} <ArrowRight className="ml-1 size-3.5" />
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-20 bg-secondary/60">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our services</h2>
              <p className="mt-3 text-muted-foreground md:text-lg">
                Tools and features that make managing your money simple, secure and always within reach.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <article
                  key={s.title}
                  className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-elevated)]"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <s.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* How to open an account */}
        <section id="open-account" className="scroll-mt-20">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">How to open an account</h2>
              <p className="mt-3 text-muted-foreground md:text-lg">
                Three simple steps — no branch visit, no paperwork, no waiting in line.
              </p>
            </div>
            <ol className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map((step, i) => (
                <li key={step.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary text-base font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-12 px-6 text-base">
                <Link to="/signup">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <BadgeCheck className="size-4 text-success" /> No opening deposit required
              </p>
            </div>
          </div>
        </section>

        {/* Trust strip */}
        <section className="mx-auto max-w-6xl px-6 py-14">
          <div className="grid gap-6 rounded-2xl border border-border bg-card p-8 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "FDIC insured",
                text: "Deposits insured up to $250,000 per depositor, per ownership category.",
              },
              {
                icon: Lock,
                title: "Bank-grade security",
                text: "End-to-end encryption, PIN confirmation and instant card freeze controls.",
              },
              {
                icon: FileText,
                title: "Clear statements",
                text: "Download PDF statements any time — no fees, no surprises.",
              },
            ].map((t) => (
              <div key={t.title} className="flex gap-3">
                <t.icon className="mt-0.5 size-5 shrink-0 text-gold" />
                <div>
                  <h3 className="font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <SiteFooter tone="navy" />
    </div>
  );
}
