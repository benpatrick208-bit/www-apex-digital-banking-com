export type AccountType = "checking" | "savings" | "credit";

export type Account = {
  id: string;
  name: string;
  type: AccountType;
  number: string;
  routing: string;
  balance: number;
  available: number;
  apy?: number;
  limit?: number;
};

export type Txn = {
  id: string;
  accountId: string;
  date: string; // ISO
  description: string;
  merchant: string;
  category: string;
  amount: number; // negative = debit
  status: "posted" | "pending";
  method: string;
};

export type Recipient = {
  id: string;
  name: string;
  bank: string;
  accountMask: string;
  routing: string;
  favorite: boolean;
};

export type Scheduled = {
  id: string;
  recipientId: string;
  fromAccountId: string;
  amount: number;
  frequency: "once" | "weekly" | "monthly";
  nextDate: string;
  active: boolean;
};

export type Goal = {
  id: string;
  name: string;
  target: number;
  saved: number;
  targetDate: string;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  kind: "security" | "money" | "offer";
};

export type Profile = {
  fullName: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  memberSince: string;
  creditScore: number;
  pin: string;
};

export type BankState = {
  profile: Profile;
  accounts: Account[];
  txns: Txn[];
  recipients: Recipient[];
  scheduled: Scheduled[];
  goals: Goal[];
  notifications: Notification[];
  budgets: { category: string; limit: number }[];
  card: {
    number: string;
    cvv: string;
    expiry: string;
    frozen: boolean;
    brand: "visa" | "mastercard";
  };
  darkMode: boolean;
};

export const uid = () => Math.random().toString(36).slice(2, 10);

export function emptyState(): BankState {
  return {
    profile: {
      fullName: "",
      username: "",
      email: "",
      phone: "",
      address: "",
      memberSince: "",
      creditScore: 650,
      pin: "0000",
    },
    accounts: [],
    txns: [],
    recipients: [],
    scheduled: [],
    goals: [],
    notifications: [],
    budgets: [],
    card: {
      number: "•••• •••• •••• ••••",
      cvv: "•••",
      expiry: "--/--",
      frozen: false,
      brand: "visa",
    },
    darkMode: false,
  };
}

export const money = (n: number, opts?: { signed?: boolean }) => {
  const s = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Math.abs(n),
  );
  if (opts?.signed) return `${n < 0 ? "−" : "+"}${s}`;
  return n < 0 ? `−${s}` : s;
};

export const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
