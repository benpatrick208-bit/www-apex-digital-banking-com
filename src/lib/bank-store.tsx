import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Context,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  emptyState,
  type BankState,
  type Goal,
  type Profile,
  type Recipient,
} from "./bank-data";

type Ctx = {
  ready: boolean;
  state: BankState;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  register: (input: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    pin: string;
    brand: "visa" | "mastercard";
  }) => Promise<{ needsConfirmation: boolean }>;
  verifyPin: (pin: string) => boolean;
  transfer: (input: {
    fromAccountId: string;
    toAccountId?: string;
    recipientId?: string;
    amount: number;
    memo: string;
  }) => Promise<void>;
  depositCheck: (input: { accountId: string; amount: number }) => Promise<void>;
  addRecipient: (r: Omit<Recipient, "id">) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  removeRecipient: (id: string) => Promise<void>;
  schedule: (input: {
    recipientId: string;
    fromAccountId: string;
    amount: number;
    frequency: "once" | "weekly" | "monthly";
    nextDate: string;
  }) => Promise<void>;
  toggleScheduled: (id: string) => Promise<void>;
  cancelScheduled: (id: string) => Promise<void>;
  addGoal: (g: Omit<Goal, "id" | "saved">) => Promise<void>;
  contribute: (goalId: string, amount: number) => Promise<void>;
  setBudget: (category: string, limit: number) => Promise<void>;
  readNotification: (id: string) => Promise<void>;
  readAllNotifications: () => Promise<void>;
  updateProfile: (p: Partial<Profile>) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  changePin: (currentPin: string, nextPin: string) => Promise<void>;
  toggleFreeze: () => Promise<void>;
  setDarkMode: (on: boolean) => Promise<void>;
  refresh: () => Promise<void>;
};

// Kept on globalThis so hot-reloads reuse the same context instance
// (a fresh context would make useBank see no provider and blank the page).
const g = globalThis as unknown as { __apexBankContext?: Context<Ctx | null> };
const BankContext = g.__apexBankContext ?? createContext<Ctx | null>(null);
g.__apexBankContext = BankContext;

const num = (v: unknown) => Number(v ?? 0);

const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

/** Creates the customer's profile, accounts, card and budgets once, after email confirmation. */
async function ensureProvisioned() {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;
  const meta = (user.user_metadata ?? {}) as Record<string, string | undefined>;
  const { error } = await supabase.rpc("provision_customer", {
    _full_name: meta['full_name'] ?? "",
    _username: meta['username'] ?? "",
    _phone: meta['phone'] ?? "",
    _pin: meta['pin'] ?? "0000",
    _brand: meta['card_brand'] === "mastercard" ? "mastercard" : "visa",
  });
  if (error) throw new Error(error.message);
}

export function BankProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankState>(() => emptyState());
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);
  const userId = useRef<string | null>(null);
  const cardId = useRef<string | null>(null);

  const load = useCallback(async () => {
    const uid = userId.current;
    if (!uid) {
      setState(emptyState());
      return;
    }
    const [profile, accounts, txns, recipients, scheduled, goals, budgets, notifications, cards] =
      await Promise.all([
        supabase.from("profiles").select("*").eq("id", uid).maybeSingle(),
        supabase.from("accounts").select("*").eq("user_id", uid).order("created_at"),
        supabase.from("transactions").select("*").eq("user_id", uid).order("date", { ascending: false }),
        supabase.from("recipients").select("*").eq("user_id", uid).order("created_at"),
        supabase.from("scheduled_transfers").select("*").eq("user_id", uid).order("next_date"),
        supabase.from("goals").select("*").eq("user_id", uid).order("created_at"),
        supabase.from("budgets").select("*").eq("user_id", uid).order("category"),
        supabase.from("notifications").select("*").eq("user_id", uid).order("date", { ascending: false }),
        supabase.from("cards").select("*").eq("user_id", uid).limit(1),
      ]);

    const card = cards.data?.[0];
    cardId.current = card?.id ?? null;
    const base = emptyState();

    setState({
      ...base,
      profile: {
        fullName: profile.data?.full_name ?? "",
        username: profile.data?.username ?? "",
        email: profile.data?.email ?? "",
        phone: profile.data?.phone ?? "",
        address: profile.data?.address ?? "",
        memberSince: profile.data?.member_since ?? "",
        creditScore: profile.data?.credit_score ?? 650,
        pin: profile.data?.pin ?? "0000",
      },
      accounts: (accounts.data ?? []).map((a) => ({
        id: a.id,
        name: a.name,
        type: a.type as "checking" | "savings" | "credit",
        number: a.number,
        routing: a.routing,
        balance: num(a.balance),
        available: num(a.available),
        ...(a.apy != null ? { apy: num(a.apy) } : {}),
        ...(a.credit_limit != null ? { limit: num(a.credit_limit) } : {}),
      })),
      txns: (txns.data ?? []).map((t) => ({
        id: t.id,
        accountId: t.account_id,
        date: t.date,
        description: t.description,
        merchant: t.merchant,
        category: t.category,
        amount: num(t.amount),
        status: t.status as "posted" | "pending",
        method: t.method,
      })),
      recipients: (recipients.data ?? []).map((r) => ({
        id: r.id,
        name: r.name,
        bank: r.bank,
        accountMask: r.account_mask,
        routing: r.routing,
        favorite: r.favorite,
      })),
      scheduled: (scheduled.data ?? []).map((s) => ({
        id: s.id,
        recipientId: s.recipient_id,
        fromAccountId: s.from_account_id,
        amount: num(s.amount),
        frequency: s.frequency as "once" | "weekly" | "monthly",
        nextDate: s.next_date,
        active: s.active,
      })),
      goals: (goals.data ?? []).map((g) => ({
        id: g.id,
        name: g.name,
        target: num(g.target),
        saved: num(g.saved),
        targetDate: g.target_date,
      })),
      budgets: (budgets.data ?? []).map((b) => ({
        category: b.category,
        limit: num(b.limit_amount),
      })),
      notifications: (notifications.data ?? []).map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        date: n.date,
        read: n.read,
        kind: n.kind as "money" | "security" | "offer",
      })),
      card: card
        ? {
            number: card.number,
            cvv: card.cvv,
            expiry: card.expiry,
            frozen: card.frozen,
            brand:
              (card as { brand?: string }).brand === "mastercard" ? "mastercard" : "visa",
          }
        : base.card,
      darkMode: profile.data?.dark_mode ?? false,
    });
  }, []);

  useEffect(() => {
    let active = true;

    const apply = async (uid: string | null) => {
      userId.current = uid;
      setSignedIn(!!uid);
      if (uid) {
        await ensureProvisioned();
        await load();
      } else setState(emptyState());
      if (active) setReady(true);
    };

    supabase.auth.getSession().then(({ data }) => {
      void apply(data.session?.user.id ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      void apply(session?.user.id ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [load]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state.darkMode]);

  const notify = useCallback(
    async (title: string, body: string, kind: "money" | "security") => {
      const uid = userId.current;
      if (!uid) return;
      await supabase.from("notifications").insert({ user_id: uid, title, body, kind });
    },
    [],
  );

  const value: Ctx = useMemo(() => {
    const uid = () => {
      const id = userId.current;
      if (!id) throw new Error("Please sign in again to continue.");
      return id;
    };

    const adjust = async (accountId: string, delta: number) => {
      const account = state.accounts.find((a) => a.id === accountId);
      if (!account) throw new Error("Account not found.");
      const { error } = await supabase
        .from("accounts")
        .update({ balance: account.balance + delta, available: account.available + delta })
        .eq("id", accountId);
      if (error) throw new Error(error.message);
    };

    return {
      ready,
      state,
      signedIn,
      refresh: load,

      async signIn(email, password) {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw new Error("The email or password you entered is incorrect.");
      },

      async signOut() {
        await supabase.auth.signOut();
        userId.current = null;
        setSignedIn(false);
        setState(emptyState());
      },

      async register(input) {
        const { data, error } = await supabase.auth.signUp({
          email: input.email.trim(),
          password: input.password,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              full_name: input.fullName,
              username: input.username,
              phone: input.phone,
              pin: input.pin,
              card_brand: input.brand,
            },
          },
        });
        if (error) throw new Error(error.message);
        if (!data.session) return { needsConfirmation: true };

        userId.current = data.session.user.id;
        await ensureProvisioned();
        setSignedIn(true);
        await load();
        return { needsConfirmation: false };
      },

      verifyPin: (pin) => pin === state.profile.pin,

      async transfer({ fromAccountId, toAccountId, recipientId, amount, memo }) {
        const from = state.accounts.find((a) => a.id === fromAccountId);
        if (!from) throw new Error("Select an account to transfer from.");
        if (!(amount > 0)) throw new Error("Enter an amount greater than $0.00.");
        if (amount > from.available)
          throw new Error("This transfer exceeds your available balance.");
        const recipient = state.recipients.find((r) => r.id === recipientId);
        const to = state.accounts.find((a) => a.id === toAccountId);
        const label = recipient ? recipient.name : to ? to.name : "recipient";

        await adjust(fromAccountId, -amount);
        await supabase.from("transactions").insert({
          user_id: uid(),
          account_id: fromAccountId,
          description: `Transfer to ${label}${memo ? ` — ${memo}` : ""}`,
          merchant: label,
          category: "Transfers",
          amount: -amount,
          status: "posted",
          method: recipient ? "External transfer" : "Internal",
        });

        if (to) {
          await adjust(to.id, amount);
          await supabase.from("transactions").insert({
            user_id: uid(),
            account_id: to.id,
            description: `Transfer from ${from.name}${memo ? ` — ${memo}` : ""}`,
            merchant: "Apex Digital Bank",
            category: "Transfers",
            amount,
            status: "posted",
            method: "Internal",
          });
        }

        await notify("Transfer completed", `${usd(amount)} sent to ${label}.`, "money");
        await load();
      },

      async depositCheck({ accountId, amount }) {
        if (!(amount > 0)) throw new Error("Enter a deposit amount greater than $0.00.");
        if (!Number.isFinite(amount)) throw new Error("Enter a valid deposit amount.");
        await adjust(accountId, amount);
        await supabase.from("transactions").insert({
          user_id: uid(),
          account_id: accountId,
          description: "Mobile Check Deposit",
          merchant: "Apex Digital Bank",
          category: "Deposits",
          amount,
          status: "posted",
          method: "Mobile deposit",
        });
        await notify("Deposit posted", `${usd(amount)} was added to your account.`, "money");
        await load();
      },

      async addRecipient(r) {
        await supabase.from("recipients").insert({
          user_id: uid(),
          name: r.name,
          bank: r.bank,
          account_mask: r.accountMask,
          routing: r.routing,
          favorite: r.favorite,
        });
        await load();
      },

      async toggleFavorite(id) {
        const current = state.recipients.find((r) => r.id === id);
        await supabase.from("recipients").update({ favorite: !current?.favorite }).eq("id", id);
        await load();
      },

      async removeRecipient(id) {
        await supabase.from("recipients").delete().eq("id", id);
        await load();
      },

      async schedule(input) {
        await supabase.from("scheduled_transfers").insert({
          user_id: uid(),
          recipient_id: input.recipientId,
          from_account_id: input.fromAccountId,
          amount: input.amount,
          frequency: input.frequency,
          next_date: input.nextDate,
        });
        await load();
      },

      async toggleScheduled(id) {
        const current = state.scheduled.find((s) => s.id === id);
        await supabase.from("scheduled_transfers").update({ active: !current?.active }).eq("id", id);
        await load();
      },

      async cancelScheduled(id) {
        await supabase.from("scheduled_transfers").delete().eq("id", id);
        await load();
      },

      async addGoal(g) {
        await supabase.from("goals").insert({
          user_id: uid(),
          name: g.name,
          target: g.target,
          target_date: g.targetDate,
        });
        await load();
      },

      async contribute(goalId, amount) {
        const checking = state.accounts.find((a) => a.type === "checking");
        if (!checking) throw new Error("No checking account found.");
        if (amount > checking.available) throw new Error("Not enough available funds.");
        const goal = state.goals.find((g) => g.id === goalId);
        await adjust(checking.id, -amount);
        await supabase.from("transactions").insert({
          user_id: uid(),
          account_id: checking.id,
          description: `Goal contribution — ${goal?.name ?? ""}`,
          merchant: "Apex Digital Bank",
          category: "Transfers",
          amount: -amount,
          status: "posted",
          method: "Internal",
        });
        await supabase
          .from("goals")
          .update({ saved: (goal?.saved ?? 0) + amount })
          .eq("id", goalId);
        await load();
      },

      async setBudget(category, limit) {
        await supabase
          .from("budgets")
          .upsert(
            { user_id: uid(), category, limit_amount: limit },
            { onConflict: "user_id,category" },
          );
        await load();
      },

      async readNotification(id) {
        await supabase.from("notifications").update({ read: true }).eq("id", id);
        await load();
      },

      async readAllNotifications() {
        await supabase.from("notifications").update({ read: true }).eq("user_id", uid());
        await load();
      },

      async updateProfile(p) {
        const { error } = await supabase
          .from("profiles")
          .update({
            ...(p.fullName !== undefined ? { full_name: p.fullName } : {}),
            ...(p.username !== undefined ? { username: p.username } : {}),
            ...(p.email !== undefined ? { email: p.email } : {}),
            ...(p.phone !== undefined ? { phone: p.phone } : {}),
            ...(p.address !== undefined ? { address: p.address } : {}),
            ...(p.pin !== undefined ? { pin: p.pin } : {}),
          })
          .eq("id", uid());
        if (error) throw new Error(error.message);
        await load();
      },

      async changePin(currentPin, nextPin) {
        if (currentPin !== state.profile.pin)
          throw new Error("Your current PIN is incorrect.");
        if (!/^\d{4}$/.test(nextPin))
          throw new Error("Your new PIN must be 4 digits.");
        if (nextPin === currentPin)
          throw new Error("Choose a PIN different from your current one.");
        const { error } = await supabase
          .from("profiles")
          .update({ pin: nextPin })
          .eq("id", uid());
        if (error) throw new Error(error.message);
        await notify(
          "Transaction PIN changed",
          "Your Apex Digital Bank transaction PIN was updated.",
          "security",
        );
        await load();
      },

      async changePassword(current, next) {
        if (next.length < 8) throw new Error("Use at least 8 characters.");
        const { error } = await supabase.auth.updateUser({
          password: next,
          current_password: current,
        } as Parameters<typeof supabase.auth.updateUser>[0]);
        if (error) throw new Error(error.message);
        await notify(
          "Password changed",
          "Your Apex Digital Bank password was updated.",
          "security",
        );
        await load();
      },

      async toggleFreeze() {
        if (!cardId.current) return;
        await supabase.from("cards").update({ frozen: !state.card.frozen }).eq("id", cardId.current);
        await load();
      },

      async setDarkMode(on) {
        setState((s) => ({ ...s, darkMode: on }));
        await supabase.from("profiles").update({ dark_mode: on }).eq("id", uid());
      },
    };
  }, [state, signedIn, ready, load, notify]);

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used inside BankProvider");
  return ctx;
}
