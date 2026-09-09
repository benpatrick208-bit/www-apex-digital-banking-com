CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  username text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  member_since text NOT NULL DEFAULT to_char(now(), 'FMMonth YYYY'),
  credit_score integer NOT NULL DEFAULT 650,
  pin text NOT NULL DEFAULT '0000',
  dark_mode boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile" ON public.profiles FOR ALL TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('checking','savings','credit')),
  number text NOT NULL,
  routing text NOT NULL DEFAULT '021000418',
  balance numeric(14,2) NOT NULL DEFAULT 0,
  available numeric(14,2) NOT NULL DEFAULT 0,
  apy numeric(5,2),
  credit_limit numeric(14,2),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.accounts TO authenticated;
GRANT ALL ON public.accounts TO service_role;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own accounts" ON public.accounts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  date timestamptz NOT NULL DEFAULT now(),
  description text NOT NULL,
  merchant text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Other',
  amount numeric(14,2) NOT NULL,
  status text NOT NULL DEFAULT 'posted' CHECK (status IN ('posted','pending')),
  method text NOT NULL DEFAULT 'Internal'
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO authenticated;
GRANT ALL ON public.transactions TO service_role;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own transactions" ON public.transactions FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX transactions_user_date_idx ON public.transactions (user_id, date DESC);

CREATE TABLE public.recipients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  bank text NOT NULL DEFAULT '',
  account_mask text NOT NULL DEFAULT '',
  routing text NOT NULL DEFAULT '',
  favorite boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recipients TO authenticated;
GRANT ALL ON public.recipients TO service_role;
ALTER TABLE public.recipients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own recipients" ON public.recipients FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.scheduled_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id uuid NOT NULL REFERENCES public.recipients(id) ON DELETE CASCADE,
  from_account_id uuid NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL,
  frequency text NOT NULL CHECK (frequency IN ('once','weekly','monthly')),
  next_date timestamptz NOT NULL,
  active boolean NOT NULL DEFAULT true
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.scheduled_transfers TO authenticated;
GRANT ALL ON public.scheduled_transfers TO service_role;
ALTER TABLE public.scheduled_transfers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own scheduled" ON public.scheduled_transfers FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target numeric(14,2) NOT NULL,
  saved numeric(14,2) NOT NULL DEFAULT 0,
  target_date text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.goals TO authenticated;
GRANT ALL ON public.goals TO service_role;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own goals" ON public.goals FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category text NOT NULL,
  limit_amount numeric(14,2) NOT NULL DEFAULT 0,
  UNIQUE (user_id, category)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.budgets TO authenticated;
GRANT ALL ON public.budgets TO service_role;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own budgets" ON public.budgets FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  read boolean NOT NULL DEFAULT false,
  kind text NOT NULL DEFAULT 'money' CHECK (kind IN ('money','security','offer'))
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifications" ON public.notifications FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  number text NOT NULL,
  cvv text NOT NULL,
  expiry text NOT NULL,
  frozen boolean NOT NULL DEFAULT false
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own cards" ON public.cards FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.provision_customer(
  _full_name text DEFAULT '',
  _username text DEFAULT '',
  _phone text DEFAULT '',
  _pin text DEFAULT '0000'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _email text;
  _base text;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _uid;

  INSERT INTO public.profiles (id, full_name, username, email, phone, pin)
  VALUES (_uid, _full_name, COALESCE(NULLIF(_username, ''), split_part(COALESCE(_email, ''), '@', 1)), COALESCE(_email, ''), _phone, _pin)
  ON CONFLICT (id) DO NOTHING;

  IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE user_id = _uid) THEN
    _base := lpad((floor(random() * 100000000)::bigint)::text, 8, '0');
    INSERT INTO public.accounts (user_id, name, type, number, balance, available)
    VALUES (_uid, 'Everyday Checking', 'checking', '4417 ' || substr(_base, 1, 4) || ' ' || substr(_base, 5, 4), 0, 0);
    INSERT INTO public.accounts (user_id, name, type, number, balance, available, apy)
    VALUES (_uid, 'Apex High-Yield Savings', 'savings', '4417 ' || substr(_base, 1, 4) || ' ' || lpad((floor(random() * 10000)::int)::text, 4, '0'), 0, 0, 4.25);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.cards WHERE user_id = _uid) THEN
    INSERT INTO public.cards (user_id, number, cvv, expiry)
    VALUES (
      _uid,
      '4417 ' || lpad((floor(random() * 10000)::int)::text, 4, '0') || ' ' || lpad((floor(random() * 10000)::int)::text, 4, '0') || ' ' || lpad((floor(random() * 10000)::int)::text, 4, '0'),
      lpad((floor(random() * 1000)::int)::text, 3, '0'),
      to_char(now() + interval '4 years', 'MM/YY')
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.budgets WHERE user_id = _uid) THEN
    INSERT INTO public.budgets (user_id, category, limit_amount) VALUES
      (_uid, 'Groceries', 800),
      (_uid, 'Dining', 350),
      (_uid, 'Shopping', 400),
      (_uid, 'Utilities', 350),
      (_uid, 'Transport', 200),
      (_uid, 'Health', 300);
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.provision_customer(text, text, text, text) TO authenticated;