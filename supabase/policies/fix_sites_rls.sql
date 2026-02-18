-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can register sites" ON public.sites;

-- Re-create the policy with a stricter check
-- Ensure the user is inserting a row where 'user_id' matches their own ID.
CREATE POLICY "Authenticated users can register sites"
ON public.sites
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);
