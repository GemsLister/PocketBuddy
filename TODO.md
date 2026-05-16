# PocketBuddy - TODO

- [x] Fetch user transactions from Supabase in `RecordsScreen` (instead of using empty local state).
- [x] Map Supabase rows to `Transaction` shape expected by `SummaryCard`/`TransactionItem`.
- [x] Display Overview cards: Balance, Income, Expenses using fetched data.
- [x] Ensure amounts and dates render correctly (including `transaction_date` -> `date`, icon mapping).
- [x] Added guardrail in `RecordsScreen` to treat known expense categories as `expense` even if DB `type` is wrong.
- [ ] Run typecheck/lint/tests (at least `npm test` / `npm run lint` / `tsc`) to verify build.

> Note: `npm run lint` currently fails due to pre-existing errors in other files (unrelated to `RecordsScreen`).

- [x] Charts tab: computed Pie + Bar (top categories impact) using chart.js dependency style approach (rendered as computed lists/bars to avoid missing native chart renderer).
