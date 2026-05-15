-- ============================================================
-- Chat Tables for PocketBuddy AI Chatbot
-- ============================================================

-- 1. Chat Sessions – one per user conversation thread
create table chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text default 'New Chat',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index chat_sessions_user_id_idx on chat_sessions(user_id);

-- 2. Chat Messages – individual messages within a session
create table chat_messages (
  id uuid default gen_random_uuid() primary key,
  session_id uuid not null references chat_sessions(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamp with time zone default now()
);

create index chat_messages_session_id_idx on chat_messages(session_id);
create index chat_messages_created_at_idx on chat_messages(created_at);

-- ============================================================
-- Row Level Security
-- ============================================================

-- chat_sessions RLS
alter table chat_sessions enable row level security;

create policy "Users can read own chat sessions" on chat_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own chat sessions" on chat_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own chat sessions" on chat_sessions
  for delete using (auth.uid() = user_id);

-- chat_messages RLS (access via session ownership)
alter table chat_messages enable row level security;

create policy "Users can read messages in own sessions" on chat_messages
  for select using (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );

create policy "Users can insert messages in own sessions" on chat_messages
  for insert with check (
    exists (
      select 1 from chat_sessions
      where chat_sessions.id = chat_messages.session_id
        and chat_sessions.user_id = auth.uid()
    )
  );
