-- 管理员可更新任意许愿（status / owner_reply 等）
-- ⚠️ 将 REPLACE_WITH_ADMIN_EMAIL 换成你的邮箱（与 VITE_ADMIN_EMAIL 一致）
create policy "wishes_update_admin"
  on public.wishes for update
  using (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  )
  with check (
    lower(coalesce(auth.jwt() ->> 'email', '')) = lower('REPLACE_WITH_ADMIN_EMAIL')
  );
