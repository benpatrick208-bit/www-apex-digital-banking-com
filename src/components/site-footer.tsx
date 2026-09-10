import { Link } from "@tanstack/react-router";
import { ApexMark } from "@/components/apex-logo";

export function SiteFooter({ tone = "light" }: { tone?: "light" | "navy" }) {
  const year = new Date().getFullYear();
  return (
    <footer
      className={
        tone === "navy"
          ? "surface-navy mt-auto w-full"
          : "mt-auto w-full border-t border-border bg-card"
      }
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <ApexMark className="h-8 w-8 text-gold" />
            <div>
              <p className="text-base font-semibold lowercase tracking-tight">apex digital bank</p>
              <p className="mt-1 text-xs opacity-80">Member FDIC · Equal Housing Lender</p>
            </div>
          </div>
          <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-sm sm:grid-cols-3">
            {[
              { label: "Privacy Notice", to: "/legal" },
              { label: "Online Security", to: "/legal" },
              { label: "Terms of Use", to: "/legal" },
              { label: "Accessibility", to: "/legal" },
              { label: "Fee Schedule", to: "/legal" },
              { label: "Contact Us", to: "/about" },
            ].map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="opacity-85 transition-opacity hover:opacity-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="gold-rule my-7 h-px w-full opacity-60" />

        <div className="space-y-3 text-xs leading-relaxed opacity-75">
          <p>
            Apex Digital Bank, N.A. Deposit products are offered by Apex Digital Bank, N.A., Member
            FDIC. Deposits are insured up to the maximum amount allowed by law, currently $250,000
            per depositor, per insured bank, for each account ownership category.
          </p>
          <p>
            Annual Percentage Yields (APY) are accurate as of the date shown and are variable,
            meaning rates may change at any time without notice. Fees may reduce earnings. Credit
            products, lines of credit, and card accounts are subject to credit approval, income
            verification, and applicable terms and conditions.
          </p>
          <p>
            Mobile deposit availability is subject to eligibility, deposit limits, and funds
            availability policies. Message and data rates may apply. Credit score information is
            provided for educational purposes only and may differ from the score a lender uses.
            Budgets, insights, and projections are estimates and are not financial advice.
          </p>
          <p>
            This experience uses simulated demonstration data. No real accounts, balances,
            transfers, or funds are involved. Never share your password, PIN, or one-time codes —
            Apex Digital Bank will never ask for them by phone, text, or email.
          </p>
          <p className="pt-1">
            © {year} Apex Digital Bank, N.A. All rights reserved. NMLS ID #402118.
          </p>
        </div>
      </div>
    </footer>
  );
}
