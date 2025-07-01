-- Create activity_log table for admin actions
create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null default now(),
  user_id uuid,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb
);

-- Optional: index for faster queries
create index if not exists idx_activity_log_timestamp on activity_log (timestamp desc);
create index if not exists idx_activity_log_entity on activity_log (entity);
create index if not exists idx_activity_log_user_id on activity_log (user_id); 