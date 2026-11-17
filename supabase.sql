
CREATE TABLE IF NOT EXISTS public.vote_counter (
    id INTEGER PRIMARY KEY,
    count BIGINT NOT NULL DEFAULT 0
);

INSERT INTO public.vote_counter (id, count)
VALUES (1, 0)
ON CONFLICT (id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.increment_vote_count()
RETURNS BIGINT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE public.vote_counter
    SET count = count + 1
    WHERE id = 1
    RETURNING count;
$$;

REVOKE ALL ON FUNCTION public.increment_vote_count()
FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.increment_vote_count()
TO service_role;
