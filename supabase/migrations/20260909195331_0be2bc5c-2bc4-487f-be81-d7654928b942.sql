REVOKE EXECUTE ON FUNCTION public.provision_customer(text, text, text, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.provision_customer(text, text, text, text) TO authenticated;