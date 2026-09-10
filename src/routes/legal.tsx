import { createFileRoute, Link } from "@tanstack/react-router";
import { ApexLogo, ApexMark } from "@/components/apex-logo";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Legal Disclosures — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Important legal disclosures, terms, FDIC insurance information, and regulatory notices for Apex Digital Bank.",
      },
      { property: "og:title", content: "Legal Disclosures — Apex Digital Bank" },
      {
        property: "og:description",
        content:
          "Important legal disclosures, terms, FDIC insurance information, and regulatory notices.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LegalPage,
});

const sections = [
  {
    title: "FDIC Insurance Disclosure",
    content: [
      "Deposit products are offered by Apex Digital Bank, N.A., Member FDIC. Deposits are insured up to the maximum amount allowed by law, currently $250,000 per depositor, per insured bank, for each account ownership category.",
    ],
  },
  {
    title: "Rates, Yields & Fees",
    content: [
      "Annual Percentage Yields (APY) and interest rates shown are accurate as of the date displayed and are variable, meaning rates may change at any time without notice.",
      "Fees may reduce earnings on interest-bearing accounts. Account terms, fee schedules, and balance requirements are described in the applicable account agreement and fee schedule.",
    ],
  },
  {
    title: "Credit Products",
    content: [
      "Credit cards, loans, mortgages, auto loans, lines of credit, and other credit products are subject to credit approval, income verification, identity verification, and applicable terms and conditions.",
      "Displayed credit limits, interest rates, and approvals do not constitute a binding offer of credit until final approval and account opening.",
    ],
  },
  {
    title: "Mobile Deposit & Transfers",
    content: [
      "Mobile check deposit availability is subject to eligibility, deposit limits, funds-availability policies, and review. Message and data rates may apply when using mobile services.",
      "Transfers to external institutions are subject to verification, processing times, and daily cut-off times.",
    ],
  },
  {
    title: "Credit Score & Financial Insights",
    content: [
      "Credit score information and financial insights provided in the application are for educational purposes only and may differ from the scores and metrics a lender or other third party uses.",
      "Budgets, spending insights, savings goals, and projections are estimates and are not financial, tax, or investment advice.",
    ],
  },
  {
    title: "Privacy & Security",
    content: [
      "We use industry-standard security practices to protect your information. Never share your password, PIN, or one-time codes — Apex Digital Bank will never ask for them by phone, text, or email.",
      "Our Privacy Notice describes how personal information is collected, used, shared, and protected.",
    ],
  },
  {
    title: "Investing & Insurance Disclosures",
    content: [
      "Investing involves risk, including the possible loss of principal. Past performance is no guarantee of future results. Investment and insurance products are not deposits, are not FDIC insured, are not guaranteed by any bank, and are not obligations of any bank.",
      "Insurance products are subject to underwriting, eligibility, and state availability.",
    ],
  },
  {
    title: "Business & Commercial Services",
    content: [
      "Business banking, commercial lending, treasury, and merchant services are subject to business verification, account agreements, and applicable fees.",
    ],
  },
  {
    title: "Equal Housing Lender",
    content: [
      "Apex Digital Bank is an equal housing lender. Credit decisions are made without regard to race, color, religion, national origin, sex, marital status, age, or any other prohibited basis.",
    ],
  },
  {
    title: "Regulatory & Contact Information",
    content: [
      "For questions about your accounts or these disclosures, contact Apex Digital Bank customer support.",
      "© 2026 Apex Digital Bank, N.A. All rights reserved. NMLS ID #402118.",
    ],
  },
];

function LegalPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-navy-foreground/10 bg-navy/95 backdrop-blur">
        <div className="surface-navy">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
            <Link to="/" aria-label="Apex Digital Bank home">
              <ApexLogo
                className="text-navy-foreground"
                markClassName="h-8 w-8 text-gold"
                wordClassName="text-xl"
              />
            </Link>
            <nav className="hidden items-center gap-7 text-sm font-medium text-navy-foreground/85 md:flex">
              <Link to="/" className="transition-colors hover:text-navy-foreground">
                Home
              </Link>
              <Link to="/about" className="transition-colors hover:text-navy-foreground">
                About
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
          <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-24">
            <ApexMark className="mx-auto h-14 w-14 text-gold" />
            <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-5xl">
              Legal Disclosures
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed opacity-85 md:text-lg">
              Important regulatory, privacy, and product notices for the Apex Digital Bank
              demonstration experience.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12 md:py-20">
          <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
            <div className="flex items-start gap-3 border-b border-border pb-6">
              <ApexMark className="h-8 w-8 shrink-0 text-gold" />
              <div>
                <p className="text-base font-semibold lowercase tracking-tight">apex digital bank</p>
                <p className="mt-1 text-xs opacity-80">Member FDIC · Equal Housing Lender</p>
              </div>
            </div>

            <div className="mt-8 space-y-10">
              {sections.map((section) => (
                <div key={section.title}>
                  <h2 className="text-lg font-semibold tracking-tight md:text-xl">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
                    {section.content.map((paragraph, idx) => (
                      <p key={idx}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-border pt-6 text-xs leading-relaxed opacity-75">
              <p>
                The content on this page is provided for demonstration and educational purposes.
                It does not create a contractual relationship or any legal obligation. For a live
                financial product, consult the official disclosures, agreements, and fee schedules
                provided by the actual institution.
              </p>
              <p className="mt-3">
                © {new Date().getFullYear()} Apex Digital Bank, N.A. All rights reserved. NMLS
                ID #402118.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter tone="navy" />
    </div>
  );
}
