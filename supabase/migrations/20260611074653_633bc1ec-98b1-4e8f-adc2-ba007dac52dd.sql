ALTER TABLE public.waitlist_signups ADD COLUMN IF NOT EXISTS city text NOT NULL DEFAULT '';

DROP POLICY IF EXISTS "Anyone can insert a signup" ON public.waitlist_signups;

CREATE POLICY "Anyone can insert a signup"
ON public.waitlist_signups
FOR INSERT
TO anon, authenticated
WITH CHECK (
  char_length(name) >= 1 AND char_length(name) <= 100
  AND char_length(mobile) >= 7 AND char_length(mobile) <= 20
  AND char_length(city) >= 1 AND char_length(city) <= 100
  AND interest = ANY (ARRAY['Events','Trips','Communities','Networking','Meet New People','Volunteering','Startup Opportunities','Sports & Fitness'])
);