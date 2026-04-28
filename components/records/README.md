# Records Components

This folder contains all components related to the **Records** tab (transaction history view).

## Components

### 1. **SummaryCard.tsx** (~60 lines)
Displays summary statistics (Balance, Income, Expenses).

**Props:**
- `title`: Card title
- `amount`: Numeric value to display
- `icon`: Ionicons name
- `type`: "balance" | "income" | "expense" (determines color scheme)

**Usage:**
```tsx
<SummaryCard
  title="Balance"
  amount={5000}
  icon="wallet-outline"
  type="balance"
/>
```

---

### 2. **TransactionItem.tsx** (~95 lines)
Individual transaction card with icon, category, description, and amount.

**Props:**
- `transaction`: Transaction object
- `onPress`: Optional callback when pressed

**Types:**
```typescript
type Transaction = {
  id: string;
  type: "income" | "expense" | "transfer";
  category: string;
  amount: number;
  description?: string;
  date: string; // ISO format
  icon: keyof typeof Ionicons.glyphMap;
};
```

**Usage:**
```tsx
<TransactionItem
  transaction={transaction}
  onPress={(t) => console.log(t)}
/>
```

---

### 3. **FilterBar.tsx** (~85 lines)
Search input and filter chips for transaction filtering.

**Props:**
- `searchQuery`: Current search text
- `onSearchChange`: Search input callback
- `activeFilter`: Currently active filter
- `onFilterChange`: Filter change callback

**Usage:**
```tsx
<FilterBar
  searchQuery={searchQuery}
  onSearchChange={setSearchQuery}
  activeFilter="all"
  onFilterChange={setFilterType}
/>
```

---

### 4. **EmptyState.tsx** (~40 lines)
Displayed when no transactions exist or match filters.

**Props:**
- `message`: Optional custom message (default: "No transactions yet")

**Usage:**
```tsx
<EmptyState message="No transactions found" />
```

---

## Backend Integration

All components are ready for backend integration:

1. **Replace mock data** in `RecordsScreen.tsx`:
   ```typescript
   // Current (frontend only)
   const [transactions] = useState<Transaction[]>([]);
   
   // Future (with backend)
   const { data: transactions } = useTransactions(); // Custom hook
   // OR
   const [transactions, setTransactions] = useState<Transaction[]>([]);
   useEffect(() => {
     fetchTransactions().then(setTransactions);
   }, []);
   ```

2. **Supabase integration example**:
   ```typescript
   const fetchTransactions = async () => {
     const { data, error } = await supabase
       .from('transactions')
       .select('*')
       .order('date', { ascending: false });
     
     if (error) throw error;
     return data;
   };
   ```

3. **Type definitions** are already structured to match expected database schema.

---

## Design Specifications

**Colors:**
- Income: `bg-leaf` (#588157), `text-leaf`
- Expense: `bg-red-50`, `text-red-600`
- Transfer: `bg-blue-50`, `text-blue-600`
- Balance: `bg-moss` (#385a41), `text-white`

**Spacing:**
- Uses `ms()` and `vs()` from `react-native-size-matters`
- Consistent with existing project patterns

**Typography:**
- `font-nunito` (Regular)
- `font-nunito-semibold` (SemiBold)
- `font-nunito-bold` (Bold)

---

## File Structure

```
components/records/
├── SummaryCard.tsx      (60 lines)
├── TransactionItem.tsx  (95 lines)
├── FilterBar.tsx        (85 lines)
├── EmptyState.tsx       (40 lines)
├── index.ts             (Barrel exports)
└── README.md            (This file)
```

Total: ~280 lines across 4 components (all under 100 lines each)

---

## Future Enhancements

- [ ] Add sorting options (date, amount, category)
- [ ] Add date range picker
- [ ] Add transaction detail modal/screen
- [ ] Add swipe actions (edit, delete)
- [ ] Add pull-to-refresh
- [ ] Add infinite scroll/pagination
- [ ] Add export functionality
- [ ] Add transaction categories management
