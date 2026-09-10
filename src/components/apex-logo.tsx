import { cn } from "@/lib/utils";

/**
 * Apex Digital Bank mark: a peaked "A" summit with a gold growth swoosh
 * and rising gold bars. The peak uses currentColor so it adapts to context;
 * the swoosh and bars stay gold.
 */
export function ApexMark({ className }: { className?: string | undefined }) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={cn("h-9 w-9", className)}>
      {/* Peak / letter A */}
      <path
        d="M50 8 L94 90 L70 90 L50 46 L30 90 L6 90 Z"
        fill="currentColor"
      />
      {/* Gold growth swoosh */}
      <path
        d="M4 90 C 24 56, 58 36, 98 40 C 62 50, 30 68, 18 90 Z"
        fill="#C79A2E"
      />
      {/* Rising bars */}
      <g fill="#C79A2E">
        <rect x="34" y="76" width="5" height="14" rx="1" />
        <rect x="43" y="70" width="5" height="20" rx="1" />
        <rect x="52" y="64" width="5" height="26" rx="1" />
        <rect x="61" y="58" width="5" height="32" rx="1" />
      </g>
    </svg>
  );
}

export function ApexLogo({
  className,
  markClassName,
  wordClassName,
  showTagline = true,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
  showTagline?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ApexMark className={markClassName} />
      <span className="inline-flex flex-col justify-center leading-none">
        <span className={cn("text-2xl font-bold tracking-tight", wordClassName)}>Apex</span>
        {showTagline ? (
          <span className="mt-0.5 text-[0.6em] font-medium uppercase tracking-[0.22em] opacity-90">
            Digital Bank
          </span>
        ) : null}
      </span>
    </span>
  );
}
