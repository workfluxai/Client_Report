create table profiles (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  stripe_customer_id text,
  subscription_tier text default 'starter',
  runs_this_week int default 0,
  clients_count int default 0,
  created_at timestamp default now()
);