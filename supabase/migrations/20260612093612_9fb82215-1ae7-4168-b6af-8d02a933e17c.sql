DROP POLICY IF EXISTS "Anyone can insert a signup" ON public.waitlist_signups;
CREATE POLICY "Anyone can insert a signup" ON public.waitlist_signups FOR INSERT WITH CHECK (
  char_length(name) BETWEEN 1 AND 100
  AND char_length(mobile) BETWEEN 7 AND 20
  AND char_length(city) BETWEEN 1 AND 100
  AND char_length(interest) BETWEEN 1 AND 500
);