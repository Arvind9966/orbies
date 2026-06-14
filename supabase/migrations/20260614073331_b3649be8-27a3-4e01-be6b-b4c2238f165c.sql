GRANT SELECT ON public.waitlist_signups TO anon, authenticated;
CREATE POLICY "Public read waitlist" ON public.waitlist_signups FOR SELECT TO anon, authenticated USING (true);