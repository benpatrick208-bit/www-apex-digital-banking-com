import { cn } from "@/lib/utils";

/** Payment network mark for a card: Visa wordmark or Mastercard circles. */
export function CardBrandMark({
  brand,
  className,
}: {
  brand: "visa" | "mastercard";
  className?: string;
}) {
  if (brand === "mastercard") {
    return (
      <svg viewBox="0 0 48 30" aria-label="Mastercard" className={cn("h-7 w-11", className)}>
        <circle cx="19" cy="15" r="11" fill="#EB001B" />
        <circle cx="29" cy="15" r="11" fill="#F79E1B" opacity="0.9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 30" aria-label="Visa" className={cn("h-7 w-11", className)}>
      <text
        x="24"
        y="21"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontSize="17"
        fontStyle="italic"
        fontWeight="700"
        fill="currentColor"
      >
        VISA
      </text>
    </svg>
  );
}
