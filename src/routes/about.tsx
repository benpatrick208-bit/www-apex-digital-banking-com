import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Landmark, Lock, ShieldCheck, Users } from "lucide-react";
import { ApexLogo, ApexMark } from "@/components/apex-logo";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About us — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Learn about Apex Digital Bank: our mission, our security-first approach, and the digital banking services we offer.",
      },
      { property: "og:title", content: "About us — Apex Digital Bank" },
      {
        property: "og:description",
        content: "A security-first digital bank built for the way you live.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const values = [
  {
    icon: ShieldCheck,
    title: "Security first",
    text: "Every session is encrypted end to end, sensitive actions are confirmed with your PIN, and deposits are FDIC insured up to $250,000 per depositor.",
  },
  {
    icon: Users,
    title: "People over paperwork",
    text: "Open an account in minutes, reach a human when you need one, and manage everything from your phone or desktop.",
  },
  {
    icon: Lock,
    title: "Privacy by design",
    text: "We never sell your data, we never ask for your password or one-time codes by phone or email, and you control your cards in real time.",
  },
  {
    icon: Landmark,
    title: "Honest banking",
    text: "Clear fees, clear rates, clear statements. What you see in the app is exactly what you get.",
  },
];

function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-navy-foreground/10 bg-navy/95 backdrop-blur">
        <div className="surface-navy">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link to="/" aria-label="Apex Digital Bank home">
              <ApexLogo className="text-navy-foreground" markClassName="h-8 w-8 text-gold" wordClassName="text-xl" />
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium text-navy-foreground/85 md:flex">
              <Link to="/" className="transition-colors hover:text-navy-foreground">
                Home
              </Link>
              <Link to="/login" className="transition-colors hover:text-navy-foreground">
                Sign in
              </Link>
            </nav>
            <Button asChild className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Link to="/signup">Open an account</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="surface-navy">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
            <ApexMark className="mx-auto h-14 w-14 text-gold" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              About Apex Digital Bank
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed opacity-85 md:text-lg">
              Apex Digital Bank, N.A. is a digital-first national bank. We believe banking should
              be simple, transparent and always within reach — so we built a bank that lives
              where you do: on your phone, tablet and computer.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl">Our mission</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                We started Apex with one idea: your money should work as hard as you do. That
                means no monthly maintenance fees on checking, a competitive yield on savings,
                instant transfers to the people you pay most, and tools — budgets, goals and
                spending insights — that help you stay ahead instead of catch up.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                As a digital bank, we invest in technology and security instead of branches, and
                pass those savings back to you through better rates and fewer fees.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "$250k", label: "FDIC insurance per depositor" },
                { stat: "0", label: "Monthly maintenance fees" },
                { stat: "2 min", label: "To open an account online" },
                { stat: "24/7", label: "Access from any device" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card p-5 text-center"
                >
                  <p className="text-2xl font-bold tracking-tight text-primary md:text-3xl">
                    {s.stat}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground md:text-sm">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-secondary/60">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">What we stand for</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2">
              {values.map((v) => (
                <article key={v.title} className="rounded-2xl border border-border bg-card p-6">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <v.icon className="size-5.5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Ready to bank at your apex?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground md:text-lg">
            Open your checking and savings accounts online in minutes and choose your Visa or
            Mastercard virtual debit card.
          </p>
          <Button asChild size="lg" className="mt-8 h-12 px-8 text-base">
            <Link to="/signup">
              Open an account <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>
      </main>

      <SiteFooter tone="navy" />
    </div>
  );
}
