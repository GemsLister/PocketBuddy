-- Create transactions table
create table transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null, -- 'income', 'expense', 'transfer'
  category text not null, -- 'Salary', 'Freelance', 'Business', etc.
  amount decimal(12, 2) not null,
  note text,
  transaction_date timestamp with time zone not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for faster queries
create index transactions_user_id_idx on transactions(user_id);
create index transactions_created_at_idx on transactions(created_at);

-- Enable RLS on transactions table
alter table transactions enable row level security;

-- Policy: Users can read their own transactions
create policy "Users can read own transactions" on transactions
  for select using (auth.uid() = user_id);

-- Policy: Users can insert their own transactions
create policy "Users can insert own transactions" on transactions
  for insert with check (auth.uid() = user_id);

-- Policy: Users can update their own transactions
create policy "Users can update own transactions" on transactions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Policy: Users can delete their own transactions
create policy "Users can delete own transactions" on transactions
  for delete using (auth.uid() = user_id);
