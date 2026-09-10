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
      <svg viewBox="0 0 48 38" aria-label="Mastercard" className={cn("h-9 w-14", className)}>
        <circle cx="19" cy="14" r="12" fill="#EB001B" />
        <circle cx="29" cy="14" r="12" fill="#F79E1B" />
        <path
          d="M24 4.2a12 12 0 0 0 0 19.6A12 12 0 0 0 24 4.2Z"
          fill="#FF5F00"
        />
        <text
          x="24"
          y="35"
          textAnchor="middle"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="8"
          fontWeight="500"
          fill="currentColor"
        >
          mastercard
        </text>
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
