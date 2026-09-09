ALTER TABLE public.cards ADD COLUMN IF NOT EXISTS brand text NOT NULL DEFAULT 'visa';

ALTER TABLE public.accounts ALTER COLUMN routing SET DEFAULT '084307761';
UPDATE public.accounts SET routing = '084307761' WHERE routing <> '084307761';

DROP FUNCTION IF EXISTS public.provision_customer(text, text, text, text);

CREATE OR REPLACE FUNCTION public.provision_customer(
  _full_name text DEFAULT '',
  _username text DEFAULT '',
  _phone text DEFAULT '',
  _pin text DEFAULT '0000',
  _brand text DEFAULT 'visa'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _email text;
  _brand_clean text := CASE WHEN lower(coalesce(_brand,'visa')) = 'mastercard' THEN 'mastercard' ELSE 'visa' END;
  _prefix text;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO _email FROM auth.users WHERE id = _uid;

  INSERT INTO public.profiles (id, full_name, username, email, phone, pin)
  VALUES (_uid, _full_name, COALESCE(NULLIF(_username, ''), split_part(COALESCE(_email, ''), '@', 1)), COALESCE(_email, ''), _phone, _pin)
  ON CONFLICT (id) DO UPDATE SET
    full_name = CASE WHEN public.profiles.full_name = '' THEN EXCLUDED.full_name ELSE public.profiles.full_name END,
    email = EXCLUDED.email,
    phone = CASE WHEN public.profiles.phone = '' THEN EXCLUDED.phone ELSE public.profiles.phone END;

  IF NOT EXISTS (SELECT 1 FROM public.accounts WHERE user_id = _uid) THEN
    INSERT INTO public.accounts (user_id, name, type, number, routing, balance, available)
    VALUES (_uid, 'Everyday Checking', 'checking', lpad((floor(random() * 1000000000)::bigint)::text, 9, '0'), '084307761', 0, 0);
    INSERT INTO public.accounts (user_id, name, type, number, routing, balance, available, apy)
    VALUES (_uid, 'Apex High-Yield Savings', 'savings', lpad((floor(random() * 1000000000)::bigint)::text, 9, '0'), '084307761', 0, 0, 4.25);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.cards WHERE user_id = _uid) THEN
    _prefix := CASE WHEN _brand_clean = 'mastercard' THEN '5412' ELSE '4417' END;
    INSERT INTO public.cards (user_id, number, cvv, expiry, brand)
    VALUES (
      _uid,
      _prefix || ' ' || lpad((floor(random() * 10000)::int)::text, 4, '0') || ' ' || lpad((floor(random() * 10000)::int)::text, 4, '0') || ' ' || lpad((floor(random() * 10000)::int)::text, 4, '0'),
      lpad((floor(random() * 1000)::int)::text, 3, '0'),
      to_char(now() + interval '4 years', 'MM/YY'),
      _brand_clean
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

REVOKE EXECUTE ON FUNCTION public.provision_customer(text, text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.provision_customer(text, text, text, text, text) TO authenticated;