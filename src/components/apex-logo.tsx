import { cn } from "@/lib/utils";

/** Original Apex octagon mark: an octagon holding an upward apex chevron. */
export function ApexMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className={cn("h-9 w-9", className)}>
      <polygon
        points="14,2 34,2 46,14 46,34 34,46 14,46 2,34 2,14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M13 32 L24 14 L35 32"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M18.5 32 L24 23 L29.5 32" fill="currentColor" opacity="0.55" />
    </svg>
  );
}

export function ApexLogo({
  className,
  markClassName,
  wordClassName,
}: {
  className?: string;
  markClassName?: string;
  wordClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <ApexMark className={markClassName} />
      <span
        className={cn(
          "text-2xl font-semibold lowercase tracking-tight",
          wordClassName,
        )}
      >
        apex
      </span>
    </span>
  );
}
