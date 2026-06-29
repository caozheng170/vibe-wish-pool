-- Supabase SQL: 可重复执行（SQL Editor 中 Run）

-- 1. 枚举类型（已存在则跳过）
DO $$ BEGIN
  CREATE TYPE wish_status AS ENUM ('red', 'yellow', 'blue', 'green');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 2. 表
CREATE TABLE IF NOT EXISTS public.wishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) >= 2),
  description text NOT NULL CHECK (char_length(description) >= 10),
  status wish_status NOT NULL DEFAULT 'red',
  ai_path smallint CHECK (ai_path BETWEEN 1 AND 5),
  ai_analysis jsonb,
  owner_reply text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wishes_status_idx ON public.wishes(status);
CREATE INDEX IF NOT EXISTS wishes_created_idx ON public.wishes(created_at DESC);

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- 3. RLS 策略（先删后建，避免重复报错）
DROP POLICY IF EXISTS "wishes_select_public" ON public.wishes;
CREATE POLICY "wishes_select_public"
  ON public.wishes FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "wishes_insert_own" ON public.wishes;
CREATE POLICY "wishes_insert_own"
  ON public.wishes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishes_update_own_analysis" ON public.wishes;
CREATE POLICY "wishes_update_own_analysis"
  ON public.wishes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. 更新时间触发器
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS wishes_updated_at ON public.wishes;
CREATE TRIGGER wishes_updated_at
  BEFORE UPDATE ON public.wishes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
