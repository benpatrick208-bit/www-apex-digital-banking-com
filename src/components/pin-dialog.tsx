import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useBank } from "@/lib/bank-store";

export function PinDialog({
  open,
  onOpenChange,
  title = "Confirm with your PIN",
  description,
  onConfirmed,
  pending,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title?: string;
  description?: string;
  onConfirmed: () => void;
  pending?: boolean;
}) {
  const { verifyPin } = useBank();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setPin("");
      setError("");
    }
  }, [open]);

  const submit = (value: string) => {
    if (verifyPin(value)) {
      setError("");
      onConfirmed();
    } else {
      setError("That PIN doesn't match. Try again.");
      setPin("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <span className="mb-1 inline-flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-5" />
          </span>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description ?? "Enter your 4-digit security PIN to authorize this action."}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3 py-2">
          <InputOTP
            maxLength={4}
            value={pin}
            onChange={(v) => {
              setPin(v);
              if (v.length === 4) submit(v);
            }}
            disabled={pending}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button
            className="w-full"
            disabled={pin.length !== 4 || pending}
            onClick={() => submit(pin)}
          >
            {pending ? "Authorizing…" : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
