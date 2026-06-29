-- 管理员策略（邮箱与 VITE_ADMIN_EMAIL 一致）
DROP POLICY IF EXISTS "wishes_update_admin" ON public.wishes;
CREATE POLICY "wishes_update_admin"
  ON public.wishes FOR UPDATE
  USING (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('4701823@qq.com')
  )
  WITH CHECK (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('4701823@qq.com')
  );
