import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createInitialState,
  uid,
  type BankState,
  type Goal,
  type Profile,
  type Recipient,
  type Txn,
} from "./bank-data";

const STATE_KEY = "apex.state.v1";
const SESSION_KEY = "apex.session.v1";

type Ctx = {
  ready: boolean;
  state: BankState;
  signedIn: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  register: (input: {
    fullName: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    pin: string;
  }) => Promise<void>;
  verifyPin: (pin: string) => boolean;
  transfer: (input: {
    fromAccountId: string;
    toAccountId?: string;
    recipientId?: string;
    amount: number;
    memo: string;
  }) => Promise<void>;
  depositCheck: (input: { accountId: string; amount: number }) => Promise<void>;
  addRecipient: (r: Omit<Recipient, "id">) => void;
  toggleFavorite: (id: string) => void;
  removeRecipient: (id: string) => void;
  schedule: (input: {
    recipientId: string;
    fromAccountId: string;
    amount: number;
    frequency: "once" | "weekly" | "monthly";
    nextDate: string;
  }) => void;
  toggleScheduled: (id: string) => void;
  cancelScheduled: (id: string) => void;
  addGoal: (g: Omit<Goal, "id" | "saved">) => void;
  contribute: (goalId: string, amount: number) => Promise<void>;
  setBudget: (category: string, limit: number) => void;
  readNotification: (id: string) => void;
  readAllNotifications: () => void;
  updateProfile: (p: Partial<Profile>) => void;
  changePassword: (current: string, next: string) => Promise<void>;
  toggleFreeze: () => void;
  setDarkMode: (on: boolean) => void;
  resetDemo: () => void;
};

const BankContext = createContext<Ctx | null>(null);

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function BankProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<BankState>(() => createInitialState());
  const [signedIn, setSignedIn] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (raw) setState({ ...createInitialState(), ...(JSON.parse(raw) as BankState) });
      setSignedIn(sessionStorage.getItem(SESSION_KEY) === "1");
    } catch {
      /* ignore corrupt storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch {
      /* quota */
    }
    document.documentElement.classList.toggle("dark", state.darkMode);
  }, [state, ready]);

  const patch = useCallback((fn: (s: BankState) => BankState) => setState((s) => fn(s)), []);

  const pushTxn = (s: BankState, t: Omit<Txn, "id">): BankState => ({
    ...s,
    txns: [{ ...t, id: uid() }, ...s.txns],
    accounts: s.accounts.map((a) =>
      a.id === t.accountId
        ? { ...a, balance: a.balance + t.amount, available: a.available + t.amount }
        : a,
    ),
  });

  const notify = (s: BankState, title: string, body: string, kind: "money" | "security"): BankState => ({
    ...s,
    notifications: [
      { id: uid(), title, body, date: new Date().toISOString(), read: false, kind },
      ...s.notifications,
    ],
  });

  const value: Ctx = useMemo(
    () => ({
      ready,
      state,
      signedIn,
      async signIn(username, password) {
        await wait(700);
        const ok =
          username.trim().toLowerCase() === state.profile.username.toLowerCase() &&
          password === state.password;
        if (!ok) throw new Error("The username or password you entered is incorrect.");
        sessionStorage.setItem(SESSION_KEY, "1");
        setSignedIn(true);
      },
      signOut() {
        sessionStorage.removeItem(SESSION_KEY);
        setSignedIn(false);
      },
      async register(input) {
        await wait(900);
        setState((s) => ({
          ...s,
          password: input.password,
          profile: {
            ...s.profile,
            fullName: input.fullName,
            username: input.username,
            email: input.email,
            phone: input.phone,
            pin: input.pin,
            memberSince: new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
          },
        }));
        sessionStorage.setItem(SESSION_KEY, "1");
        setSignedIn(true);
      },
      verifyPin: (pin) => pin === state.profile.pin,
      async transfer({ fromAccountId, toAccountId, recipientId, amount, memo }) {
        await wait(900);
        const from = state.accounts.find((a) => a.id === fromAccountId);
        if (!from) throw new Error("Select an account to transfer from.");
        if (amount <= 0) throw new Error("Enter an amount greater than $0.00.");
        if (amount > from.available)
          throw new Error("This transfer exceeds your available balance.");
        const recipient = state.recipients.find((r) => r.id === recipientId);
        const to = state.accounts.find((a) => a.id === toAccountId);
        const label = recipient ? recipient.name : to ? to.name : "recipient";
        patch((s) => {
          let next = pushTxn(s, {
            accountId: fromAccountId,
            date: new Date().toISOString(),
            description: `Transfer to ${label}${memo ? ` — ${memo}` : ""}`,
            merchant: label,
            category: "Transfers",
            amount: -amount,
            status: "posted",
            method: recipient ? "External transfer" : "Internal",
          });
          if (to) {
            next = pushTxn(next, {
              accountId: to.id,
              date: new Date().toISOString(),
              description: `Transfer from ${from.name}${memo ? ` — ${memo}` : ""}`,
              merchant: "Apex Digital Bank",
              category: "Transfers",
              amount,
              status: "posted",
              method: "Internal",
            });
          }
          return notify(
            next,
            "Transfer completed",
            `${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)} sent to ${label}.`,
            "money",
          );
        });
      },
      async depositCheck({ accountId, amount }) {
        await wait(1200);
        if (amount <= 0) throw new Error("Enter the check amount.");
        if (amount > 10000) throw new Error("Mobile deposit limit is $10,000.00 per check.");
        patch((s) =>
          notify(
            {
              ...s,
              txns: [
                {
                  id: uid(),
                  accountId,
                  date: new Date().toISOString(),
                  description: "Mobile Check Deposit",
                  merchant: "Apex Digital Bank",
                  category: "Deposits",
                  amount,
                  status: "pending",
                  method: "Mobile deposit",
                },
                ...s.txns,
              ],
            },
            "Deposit submitted",
            "Funds are typically available the next business day.",
            "money",
          ),
        );
      },
      addRecipient(r) {
        patch((s) => ({ ...s, recipients: [...s.recipients, { ...r, id: uid() }] }));
      },
      toggleFavorite(id) {
        patch((s) => ({
          ...s,
          recipients: s.recipients.map((r) => (r.id === id ? { ...r, favorite: !r.favorite } : r)),
        }));
      },
      removeRecipient(id) {
        patch((s) => ({ ...s, recipients: s.recipients.filter((r) => r.id !== id) }));
      },
      schedule(input) {
        patch((s) => ({
          ...s,
          scheduled: [...s.scheduled, { ...input, id: uid(), active: true }],
        }));
      },
      toggleScheduled(id) {
        patch((s) => ({
          ...s,
          scheduled: s.scheduled.map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
        }));
      },
      cancelScheduled(id) {
        patch((s) => ({ ...s, scheduled: s.scheduled.filter((x) => x.id !== id) }));
      },
      addGoal(g) {
        patch((s) => ({ ...s, goals: [...s.goals, { ...g, id: uid(), saved: 0 }] }));
      },
      async contribute(goalId, amount) {
        await wait(600);
        const checking = state.accounts.find((a) => a.type === "checking")!;
        if (amount > checking.available) throw new Error("Not enough available funds.");
        patch((s) => {
          const next = pushTxn(s, {
            accountId: checking.id,
            date: new Date().toISOString(),
            description: `Goal contribution — ${s.goals.find((g) => g.id === goalId)?.name ?? ""}`,
            merchant: "Apex Digital Bank",
            category: "Transfers",
            amount: -amount,
            status: "posted",
            method: "Internal",
          });
          return {
            ...next,
            goals: next.goals.map((g) => (g.id === goalId ? { ...g, saved: g.saved + amount } : g)),
          };
        });
      },
      setBudget(category, limit) {
        patch((s) => ({
          ...s,
          budgets: s.budgets.some((b) => b.category === category)
            ? s.budgets.map((b) => (b.category === category ? { ...b, limit } : b))
            : [...s.budgets, { category, limit }],
        }));
      },
      readNotification(id) {
        patch((s) => ({
          ...s,
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        }));
      },
      readAllNotifications() {
        patch((s) => ({
          ...s,
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        }));
      },
      updateProfile(p) {
        patch((s) => ({ ...s, profile: { ...s.profile, ...p } }));
      },
      async changePassword(current, next) {
        await wait(700);
        if (current !== state.password) throw new Error("Your current password is incorrect.");
        if (next.length < 8) throw new Error("Use at least 8 characters.");
        patch((s) =>
          notify(
            { ...s, password: next },
            "Password changed",
            "Your Apex Digital Bank password was updated.",
            "security",
          ),
        );
      },
      toggleFreeze() {
        patch((s) => ({ ...s, card: { ...s.card, frozen: !s.card.frozen } }));
      },
      setDarkMode(on) {
        patch((s) => ({ ...s, darkMode: on }));
      },
      resetDemo() {
        const fresh = createInitialState();
        setState({ ...fresh, darkMode: state.darkMode });
      },
    }),
    [state, signedIn, ready, patch],
  );

  return <BankContext.Provider value={value}>{children}</BankContext.Provider>;
}

export function useBank() {
  const ctx = useContext(BankContext);
  if (!ctx) throw new Error("useBank must be used inside BankProvider");
  return ctx;
}
