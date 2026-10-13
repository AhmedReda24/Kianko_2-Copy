-- =====================================================================
-- KIANKO — Supabase schema
-- شغّله في: Supabase Dashboard → SQL Editor → New query → Run
-- بعده شغّل seed.sql
-- =====================================================================

-- ---------- 1) جداول المحتوى (قراءة عامة، التعديل من لوحة Supabase) ----------
create table if not exists public.locations (
  id text primary key default gen_random_uuid()::text,
  type text not null check (type in ('company','branch','office')),
  name text not null, name_ar text not null,
  city text, city_ar text,
  address text, address_ar text,
  phone text, email text,
  hours text, hours_ar text,
  img text, map_embed text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  category text not null check (category in ('management','building')),
  badge text, badge_ar text,
  name text not null, name_ar text not null,
  description text, description_ar text,
  specs jsonb not null default '[]', specs_ar jsonb not null default '[]',
  datasheet_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.accreditations (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  title_en text, title_ar text,
  desc_en text, desc_ar text,
  file_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.certificates (   -- سلايدر الصفحة الرئيسية
  id text primary key default gen_random_uuid()::text,
  kind text not null check (kind in ('accreditation','experience')),
  title text not null, title_ar text not null,
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.jobs (
  id text primary key default gen_random_uuid()::text,
  title text not null, title_ar text not null,
  dept text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

create table if not exists public.projects (
  id text primary key default gen_random_uuid()::text,
  name text not null, name_ar text not null,
  location text, location_ar text,
  year int,
  image_url text,
  sort_order int not null default 0,
  is_published boolean not null default true
);

-- ---------- 2) جداول الفورمات (إدخال فقط من الموقع، القراءة من اللوحة) ----------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text not null check (char_length(phone) between 5 and 40),
  location_id text,
  message text not null check (char_length(message) between 5 and 4000),
  lang text check (lang in ('en','ar')),
  status text not null default 'new' check (status in ('new','read','replied'))
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 200 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  phone text not null check (char_length(phone) between 5 and 40),
  job_id text references public.jobs(id) on delete set null,
  cv_path text not null check (char_length(cv_path) between 3 and 300),
  lang text check (lang in ('en','ar')),
  status text not null default 'new' check (status in ('new','reviewed','shortlisted','rejected'))
);

-- ---------- 3) الصلاحيات (RLS) ----------
alter table public.locations        enable row level security;
alter table public.products         enable row level security;
alter table public.accreditations   enable row level security;
alter table public.certificates     enable row level security;
alter table public.jobs             enable row level security;
alter table public.projects         enable row level security;
alter table public.contact_messages enable row level security;
alter table public.job_applications enable row level security;

-- قراءة عامة للمحتوى المنشور فقط
do $$
declare t text;
begin
  foreach t in array array['locations','products','accreditations','certificates','jobs','projects']
  loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (is_published)', t);
    execute format('grant select on public.%I to anon, authenticated', t);
  end loop;
end $$;

-- الفورمات: إدخال فقط (مفيش select / update / delete للزوار)
drop policy if exists "anyone can send message" on public.contact_messages;
create policy "anyone can send message" on public.contact_messages
  for insert to anon, authenticated with check (status = 'new');
grant insert on public.contact_messages to anon, authenticated;

drop policy if exists "anyone can apply" on public.job_applications;
create policy "anyone can apply" on public.job_applications
  for insert to anon, authenticated with check (status = 'new');
grant insert on public.job_applications to anon, authenticated;

-- ---------- 4) التخزين (Storage) ----------
-- cvs: خاص — الزوار يرفعوا بس، ومحدش يقدر يقرا غير من اللوحة
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'cvs', 'cvs', false, 5242880,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document']
)
on conflict (id) do update
  set file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types,
      public = false;

drop policy if exists "anyone can upload cv" on storage.objects;
create policy "anyone can upload cv" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'cvs');

-- site-files: عام — ارفع فيه صور الشهادات والداتا شيت من اللوحة وانسخ اللينك في الجداول
insert into storage.buckets (id, name, public)
values ('site-files', 'site-files', true)
on conflict (id) do nothing;
