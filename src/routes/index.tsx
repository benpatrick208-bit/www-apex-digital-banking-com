import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Building2,
  Car,
  CreditCard,
  FileText,
  Home,
  Landmark,
  LineChart,
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

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-navy-foreground/10 bg-navy/95 backdrop-blur">
      <div className="surface-navy">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" aria-label="Apex Digital Bank home">
            <ApexLogo className="text-navy-foreground" markClassName="h-8 w-8 text-gold" wordClassName="text-xl" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-navy-foreground/85 md:flex">
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
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="surface-navy relative overflow-hidden">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
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
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="h-12 bg-gold px-6 text-base text-gold-foreground hover:bg-gold/90">
                  <Link to="/signup">
                    Open an account <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-navy-foreground/30 bg-transparent px-6 text-base text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
                >
                  <Link to="/login">Sign in to online banking</Link>
                </Button>
              </div>
            </div>

            {/* Balance card illustration */}
            <div className="relative mx-auto w-full max-w-md">
              <div className="card-elevated rounded-2xl border border-navy-foreground/15 bg-card p-6 text-card-foreground">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ApexMark className="h-7 w-7 text-primary" />
                    <span className="text-sm font-semibold lowercase tracking-tight">apex checking</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Available balance</span>
                </div>
                <p className="mt-4 text-4xl font-bold tracking-tight">$2,450.00</p>
                <div className="gold-rule my-5 h-px w-full opacity-70" />
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Account number</p>
                    <p className="mt-0.5 font-semibold tracking-wider">••••••4217</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground">Routing number</p>
                    <p className="mt-0.5 font-semibold tracking-wider">084307761</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="size-3.5 text-success" /> 256-bit encrypted · real-time alerts on
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 md:py-24">
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
                  <p.icon className="size-5.5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
                <Button asChild variant="link" className="mt-4 h-auto justify-start p-0 text-sm font-semibold text-primary">
                  <Link to={p.href}>{p.cta} <ArrowRight className="ml-1 size-3.5" /></Link>
                </Button>
              </article>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="services" className="scroll-mt-20 bg-secondary/60">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
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
                    <s.icon className="size-5.5" />
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
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                How to open an account
              </h2>
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
