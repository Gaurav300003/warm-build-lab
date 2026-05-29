
-- Roles enum + table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users read own roles" on public.user_roles
  for select to authenticated using (auth.uid() = user_id);

create policy "Admins read all roles" on public.user_roles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create policy "Admins manage roles" on public.user_roles
  for all to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);
create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);
create policy "Admins view all profiles" on public.profiles
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Shared updated_at trigger fn
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

-- Contact messages
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  subject text not null,
  message text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.contact_messages to anon, authenticated;
grant all on public.contact_messages to service_role;
alter table public.contact_messages enable row level security;
create policy "Anyone can submit contact" on public.contact_messages
  for insert to anon, authenticated with check (true);
create policy "Admins read contact" on public.contact_messages
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update contact" on public.contact_messages
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete contact" on public.contact_messages
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Membership applications
create table public.membership_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  profession text not null,
  licence_no text not null,
  website text,
  office_address text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.membership_applications to anon, authenticated;
grant all on public.membership_applications to service_role;
alter table public.membership_applications enable row level security;
create trigger membership_updated before update on public.membership_applications
  for each row execute function public.set_updated_at();
create policy "Anyone can apply membership" on public.membership_applications
  for insert to anon, authenticated with check (true);
create policy "Admins read membership" on public.membership_applications
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update membership" on public.membership_applications
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete membership" on public.membership_applications
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Bhawan bookings
create table public.bhawan_bookings (
  id uuid primary key default gen_random_uuid(),
  applicant text not null,
  phone text not null,
  email text,
  purpose text not null,
  booking_date date not null,
  hall text not null,
  start_time time not null,
  end_time time not null,
  attendees int not null,
  is_member boolean not null default false,
  member_id text,
  notes text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant insert on public.bhawan_bookings to anon, authenticated;
grant all on public.bhawan_bookings to service_role;
alter table public.bhawan_bookings enable row level security;
create trigger bhawan_updated before update on public.bhawan_bookings
  for each row execute function public.set_updated_at();
create policy "Anyone can request booking" on public.bhawan_bookings
  for insert to anon, authenticated with check (true);
create policy "Admins read bookings" on public.bhawan_bookings
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update bookings" on public.bhawan_bookings
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete bookings" on public.bhawan_bookings
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));

-- Ad enquiries
create table public.ad_enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text not null,
  phone text not null,
  email text not null,
  ad_package text not null,
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
grant insert on public.ad_enquiries to anon, authenticated;
grant all on public.ad_enquiries to service_role;
alter table public.ad_enquiries enable row level security;
create policy "Anyone can enquire ad" on public.ad_enquiries
  for insert to anon, authenticated with check (true);
create policy "Admins read ads" on public.ad_enquiries
  for select to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins update ads" on public.ad_enquiries
  for update to authenticated using (public.has_role(auth.uid(), 'admin'));
create policy "Admins delete ads" on public.ad_enquiries
  for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
