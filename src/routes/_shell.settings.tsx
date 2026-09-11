import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, LogOut, Moon, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBank } from "@/lib/bank-store";

export const Route = createFileRoute("/_shell/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Settings — Apex Digital Bank" },
      {
        name: "description",
        content:
          "Update your Apex Digital Bank profile details, change your password, switch dark mode and manage security preferences.",
      },
      { property: "og:title", content: "Profile & Settings — Apex Digital Bank" },
      {
        property: "og:description",
        content: "Manage your profile, password, appearance and security settings.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const {
    state,
    updateProfile,
    changePassword,
    changePin,
    setAccountLocked,
    changeSecurityPin,
    setDarkMode,
    signOut,
  } = useBank();
  const navigate = useNavigate();
  const p = state.profile;

  const [form, setForm] = useState({
    fullName: p.fullName,
    email: p.email,
    phone: p.phone,
    address: p.address,
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [savingPw, setSavingPw] = useState(false);

  const [pin, setPin] = useState({ current: "", next: "", confirm: "" });
  const [savingPin, setSavingPin] = useState(false);

  const [freezePin, setFreezePin] = useState("");
  const [savingFreeze, setSavingFreeze] = useState(false);
  const [secPin, setSecPin] = useState({ current: "", next: "", confirm: "" });
  const [savingSecPin, setSavingSecPin] = useState(false);

  const toggleFreeze = async (locked: boolean) => {
    if (freezePin.length !== 4) {
      toast.error("Enter your 4-digit security PIN first.");
      return;
    }
    setSavingFreeze(true);
    try {
      await setAccountLocked(locked, freezePin);
      setFreezePin("");
      toast.success(locked ? "Account frozen" : "Account unfrozen");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update your account.");
    } finally {
      setSavingFreeze(false);
    }
  };

  const saveSecurityPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (secPin.next !== secPin.confirm) {
      toast.error("The new security PINs don't match.");
      return;
    }
    setSavingSecPin(true);
    try {
      await changeSecurityPin(secPin.current, secPin.next);
      setSecPin({ current: "", next: "", confirm: "" });
      toast.success("Security PIN changed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't change security PIN.");
    } finally {
      setSavingSecPin(false);
    }
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Name and email are required.");
      return;
    }
    setSavingProfile(true);
    try {
      await updateProfile(form);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save your details.");
    } finally {
      setSavingProfile(false);
    }
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pw.next !== pw.confirm) {
      toast.error("The new passwords don't match.");
      return;
    }
    setSavingPw(true);
    try {
      await changePassword(pw.current, pw.next);
      setPw({ current: "", next: "", confirm: "" });
      toast.success("Password changed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSavingPw(false);
    }
  };

  const savePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.next !== pin.confirm) {
      toast.error("The new PINs don't match.");
      return;
    }
    setSavingPin(true);
    try {
      await changePin(pin.current, pin.next);
      setPin({ current: "", next: "", confirm: "" });
      toast.success("Transaction PIN changed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't change PIN.");
    } finally {
      setSavingPin(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Profile & settings"
        description={`Member since ${p.memberSince} · username ${p.username}`}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal details</CardTitle>
            <CardDescription>Keep your contact information current.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={saveProfile}>
              <div className="space-y-1.5">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Mailing address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={savingProfile}>
                {savingProfile ? <Loader2 className="size-4 animate-spin" /> : null}
                Save changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary" /> Security
              </CardTitle>
              <CardDescription>Change the password used to sign in.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={savePassword}>
                <div className="space-y-1.5">
                  <Label htmlFor="current">Current password</Label>
                  <Input
                    id="current"
                    type="password"
                    value={pw.current}
                    onChange={(e) => setPw({ ...pw, current: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="next">New password</Label>
                  <Input
                    id="next"
                    type="password"
                    value={pw.next}
                    onChange={(e) => setPw({ ...pw, next: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirm">Confirm new password</Label>
                  <Input
                    id="confirm"
                    type="password"
                    value={pw.confirm}
                    onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={savingPw}>
                  {savingPw ? <Loader2 className="size-4 animate-spin" /> : null}
                  Update password
                </Button>
              </form>

              <Separator className="my-6" />

              <form className="space-y-4" onSubmit={savePin}>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Transaction PIN</h3>
                  <p className="text-xs text-muted-foreground">
                    Change the 4-digit PIN used to authorize transfers and deposits.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pinCurrent">Current PIN</Label>
                  <Input
                    id="pinCurrent"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin.current}
                    onChange={(e) => setPin({ ...pin, current: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pinNext">New PIN</Label>
                  <Input
                    id="pinNext"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin.next}
                    onChange={(e) => setPin({ ...pin, next: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pinConfirm">Confirm new PIN</Label>
                  <Input
                    id="pinConfirm"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin.confirm}
                    onChange={(e) => setPin({ ...pin, confirm: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={savingPin}>
                  {savingPin ? <Loader2 className="size-4 animate-spin" /> : null}
                  Change PIN
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-4 text-primary" /> Account freeze
              </CardTitle>
              <CardDescription>
                Freezing blocks all transfers and deposits. It uses a separate security PIN,
                not your transaction PIN.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">
                    {state.profile.accountLocked ? "Account is frozen" : "Account is active"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {state.profile.accountLocked
                      ? "Transfers and deposits are blocked."
                      : "Transfers and deposits are allowed."}
                  </p>
                </div>
                <Switch
                  checked={state.profile.accountLocked}
                  disabled={savingFreeze || freezePin.length !== 4}
                  onCheckedChange={(on) => toggleFreeze(on)}
                  aria-label="Freeze account"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="freezePin">Security PIN</Label>
                <Input
                  id="freezePin"
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="4-digit security PIN"
                  value={freezePin}
                  onChange={(e) => setFreezePin(e.target.value.replace(/\D/g, ""))}
                />
                <p className="text-xs text-muted-foreground">
                  Enter your security PIN, then use the switch above.
                </p>
              </div>

              <Separator />

              <form className="space-y-4" onSubmit={saveSecurityPin}>
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">Change security PIN</h3>
                  <p className="text-xs text-muted-foreground">
                    Starts as 0000 — set your own, different from your transaction PIN.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="secCurrent">Current security PIN</Label>
                  <Input
                    id="secCurrent"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={secPin.current}
                    onChange={(e) => setSecPin({ ...secPin, current: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="secNext">New security PIN</Label>
                  <Input
                    id="secNext"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={secPin.next}
                    onChange={(e) => setSecPin({ ...secPin, next: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="secConfirm">Confirm new security PIN</Label>
                  <Input
                    id="secConfirm"
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={secPin.confirm}
                    onChange={(e) => setSecPin({ ...secPin, confirm: e.target.value })}
                    required
                  />
                </div>
                <Button type="submit" disabled={savingSecPin}>
                  {savingSecPin ? <Loader2 className="size-4 animate-spin" /> : null}
                  Change security PIN
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>Appearance and account controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Moon className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Dark mode</p>
                    <p className="text-xs text-muted-foreground">
                      Easier on the eyes at night.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={state.darkMode}
                  onCheckedChange={(on) => setDarkMode(on)}
                  aria-label="Toggle dark mode"
                />
              </div>

              <Separator />

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="ghost"
                  onClick={async () => {
                    await signOut();
                    navigate({ to: "/login", replace: true });
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
