DROP POLICY IF EXISTS "Public demo access to profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public demo access to projects" ON public.projects;
DROP POLICY IF EXISTS "Public demo access to matches" ON public.matches;

REVOKE ALL ON public.profiles FROM anon, authenticated;
REVOKE ALL ON public.projects FROM anon, authenticated;
REVOKE ALL ON public.matches FROM anon, authenticated;

GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.projects TO service_role;
GRANT ALL ON public.matches TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;