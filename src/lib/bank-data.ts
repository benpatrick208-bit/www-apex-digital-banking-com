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
  password: string;
  accounts: Account[];
  txns: Txn[];
  recipients: Recipient[];
  scheduled: Scheduled[];
  goals: Goal[];
  notifications: Notification[];
  budgets: { category: string; limit: number }[];
  card: { number: string; cvv: string; expiry: string; frozen: boolean };
  darkMode: boolean;
};

const day = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(9 + (n % 9), (n * 7) % 60, 0, 0);
  return d.toISOString();
};

const future = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
};

export const uid = () => Math.random().toString(36).slice(2, 10);

const seedTxns: Array<[number, string, string, string, number, Txn["method"]]> = [
  [0, "Whole Foods Market #221", "Whole Foods", "Groceries", -128.42, "Debit card"],
  [0, "Direct Deposit — NORTHWIND LLC", "Northwind LLC", "Income", 3250.0, "ACH credit"],
  [1, "Shell Oil 47829", "Shell", "Gas", -62.18, "Debit card"],
  [1, "Spotify Premium", "Spotify", "Subscriptions", -11.99, "Recurring card"],
  [2, "Blue Bottle Coffee", "Blue Bottle", "Dining", -8.75, "Debit card"],
  [2, "Zelle to M. Rivera", "M. Rivera", "Transfers", -240.0, "Zelle"],
  [3, "Con Edison Autopay", "Con Edison", "Utilities", -184.31, "ACH debit"],
  [4, "Amazon.com*RT4K9", "Amazon", "Shopping", -76.5, "Debit card"],
  [5, "Trader Joe's #542", "Trader Joe's", "Groceries", -94.06, "Debit card"],
  [6, "Delta Air Lines 006", "Delta", "Travel", -412.6, "Credit card"],
  [7, "Apex Savings Transfer", "Apex Digital Bank", "Transfers", -500.0, "Internal"],
  [8, "CVS Pharmacy 3392", "CVS", "Health", -34.19, "Debit card"],
  [9, "Uber Trip 4H2LP", "Uber", "Transport", -23.4, "Debit card"],
  [10, "Netflix Subscription", "Netflix", "Subscriptions", -22.99, "Recurring card"],
  [11, "Chipotle 1902", "Chipotle", "Dining", -17.85, "Debit card"],
  [12, "Rent — Halcyon Properties", "Halcyon Properties", "Housing", -2150.0, "ACH debit"],
  [13, "Direct Deposit — NORTHWIND LLC", "Northwind LLC", "Income", 3250.0, "ACH credit"],
  [14, "Verizon Wireless", "Verizon", "Utilities", -96.2, "ACH debit"],
  [16, "Costco Wholesale #118", "Costco", "Groceries", -212.77, "Debit card"],
  [18, "Equinox Membership", "Equinox", "Health", -215.0, "Recurring card"],
  [20, "Refund — Nordstrom", "Nordstrom", "Shopping", 89.99, "Card refund"],
  [22, "Mobile Check Deposit", "Apex Digital Bank", "Deposits", 750.0, "Mobile deposit"],
  [24, "Sweetgreen 88", "Sweetgreen", "Dining", -16.4, "Debit card"],
  [26, "Home Depot 6621", "Home Depot", "Home", -143.88, "Debit card"],
  [28, "Interest Paid", "Apex Digital Bank", "Income", 18.42, "Interest"],
];

export function createInitialState(overrides?: Partial<Profile> & { password?: string }): BankState {
  const checkingId = "acct-checking";
  const savingsId = "acct-savings";
  const creditId = "acct-credit";

  const txns: Txn[] = seedTxns.map(([d, description, merchant, category, amount, method], i) => ({
    id: `tx-${i}`,
    accountId: category === "Travel" ? creditId : category === "Deposits" ? checkingId : checkingId,
    date: day(d),
    description,
    merchant,
    category,
    amount,
    status: d === 0 && amount < 0 ? "pending" : "posted",
    method,
  }));

  txns.push(
    {
      id: "tx-s1",
      accountId: savingsId,
      date: day(7),
      description: "Transfer from Everyday Checking",
      merchant: "Apex Digital Bank",
      category: "Transfers",
      amount: 500,
      status: "posted",
      method: "Internal",
    },
    {
      id: "tx-s2",
      accountId: savingsId,
      date: day(28),
      description: "Interest Paid",
      merchant: "Apex Digital Bank",
      category: "Income",
      amount: 61.13,
      status: "posted",
      method: "Interest",
    },
  );

  return {
    profile: {
      fullName: overrides?.fullName ?? "Benjamin Patrick",
      username: overrides?.username ?? "bpatrick",
      email: overrides?.email ?? "b.patrick@example.com",
      phone: overrides?.phone ?? "(212) 555-0148",
      address: overrides?.address ?? "418 Hudson St, Apt 9C, New York, NY 10014",
      memberSince: overrides?.memberSince ?? "March 2019",
      creditScore: overrides?.creditScore ?? 782,
      pin: overrides?.pin ?? "2468",
    },
    password: overrides?.password ?? "apex1234",
    accounts: [
      {
        id: checkingId,
        name: "Everyday Checking",
        type: "checking",
        number: "4417 8820 9931",
        routing: "021000418",
        balance: 12480.63,
        available: 12352.21,
      },
      {
        id: savingsId,
        name: "Apex High-Yield Savings",
        type: "savings",
        number: "4417 8820 7742",
        routing: "021000418",
        balance: 28950.11,
        available: 28950.11,
        apy: 4.25,
      },
      {
        id: creditId,
        name: "Apex Sapphire Credit",
        type: "credit",
        number: "4417 9002 3318",
        routing: "021000418",
        balance: -1842.6,
        available: 13157.4,
        limit: 15000,
      },
    ],
    txns,
    recipients: [
      {
        id: "r1",
        name: "Maria Rivera",
        bank: "Chase Bank",
        accountMask: "••4192",
        routing: "021000021",
        favorite: true,
      },
      {
        id: "r2",
        name: "Halcyon Properties",
        bank: "Wells Fargo",
        accountMask: "••8830",
        routing: "121000248",
        favorite: true,
      },
      {
        id: "r3",
        name: "Daniel Okafor",
        bank: "Apex Digital Bank",
        accountMask: "••2207",
        routing: "021000418",
        favorite: false,
      },
      {
        id: "r4",
        name: "Sunrise Childcare",
        bank: "Citibank",
        accountMask: "••6641",
        routing: "021000089",
        favorite: false,
      },
    ],
    scheduled: [
      {
        id: "s1",
        recipientId: "r2",
        fromAccountId: checkingId,
        amount: 2150,
        frequency: "monthly",
        nextDate: future(9),
        active: true,
      },
      {
        id: "s2",
        recipientId: "r4",
        fromAccountId: checkingId,
        amount: 480,
        frequency: "weekly",
        nextDate: future(3),
        active: true,
      },
    ],
    goals: [
      { id: "g1", name: "Emergency Fund", target: 20000, saved: 14200, targetDate: "Dec 2026" },
      { id: "g2", name: "Kyoto Trip", target: 6500, saved: 2380, targetDate: "Apr 2027" },
      { id: "g3", name: "New Car Down Payment", target: 12000, saved: 5100, targetDate: "Sep 2027" },
    ],
    notifications: [
      {
        id: "n1",
        title: "Direct deposit received",
        body: "$3,250.00 from NORTHWIND LLC posted to Everyday Checking.",
        date: day(0),
        read: false,
        kind: "money",
      },
      {
        id: "n2",
        title: "New sign-in from Safari",
        body: "We noticed a sign-in from New York, NY. Not you? Secure your account.",
        date: day(1),
        read: false,
        kind: "security",
      },
      {
        id: "n3",
        title: "Savings APY increased",
        body: "Your High-Yield Savings now earns 4.25% APY.",
        date: day(4),
        read: true,
        kind: "offer",
      },
      {
        id: "n4",
        title: "Scheduled transfer upcoming",
        body: "$2,150.00 to Halcyon Properties is scheduled for next week.",
        date: day(6),
        read: true,
        kind: "money",
      },
    ],
    budgets: [
      { category: "Groceries", limit: 800 },
      { category: "Dining", limit: 350 },
      { category: "Shopping", limit: 400 },
      { category: "Utilities", limit: 350 },
      { category: "Transport", limit: 200 },
      { category: "Health", limit: 300 },
    ],
    card: { number: "4417 3390 8812 5507", cvv: "419", expiry: "08/29", frozen: false },
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
