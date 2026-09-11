ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS account_locked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS security_pin text NOT NULL DEFAULT '0000';