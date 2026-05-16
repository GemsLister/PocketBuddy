import { Transaction } from "@/src/components/records/TransactionItem";
import type { MarkedDates } from "react-native-calendars/src/types";

// ---------- Calendar Helpers ----------

const CALENDAR_COLORS = {
  income: "#588157",
  expense: "#dc2626",
  selected: "#588157",
} as const;

/** Normalise a Date or ISO string into "YYYY-MM-DD". */
export function toDateKey(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Pretty-print a YYYY-MM-DD key for section headers. */
export function formatDateHeader(dateKey: string): string {
  const d = new Date(dateKey + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Build the `markedDates` object consumed by react-native-calendars. */
export function buildMarkedDates(
  transactions: Transaction[],
  selectedDate: string | null,
): MarkedDates {
  const dotMap = new Map<string, Set<string>>();

  transactions.forEach((t) => {
    const key = toDateKey(t.date);
    if (!dotMap.has(key)) dotMap.set(key, new Set());
    const colour =
      t.type === "income" ? CALENDAR_COLORS.income : CALENDAR_COLORS.expense;
    dotMap.get(key)!.add(colour);
  });

  const marked: MarkedDates = {};

  dotMap.forEach((colours, dateKey) => {
    const dots = Array.from(colours).map((c) => ({ key: c, color: c }));
    marked[dateKey] = {
      dots,
      marked: true,
      selected: dateKey === selectedDate,
      selectedColor: CALENDAR_COLORS.selected,
    };
  });

  // Ensure the selected date always appears even without transactions
  if (selectedDate && !marked[selectedDate]) {
    marked[selectedDate] = {
      selected: true,
      selectedColor: CALENDAR_COLORS.selected,
      dots: [],
      marked: false,
    };
  }

  return marked;
}

// ---------- Summary Helpers ----------

type SummaryStats = {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
};

export function calculateSummary(transactions: Transaction[]): SummaryStats {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    totalIncome: income,
    totalExpenses: expenses,
    totalBalance: income - expenses,
  };
}

export function groupTransactionsByDate(transactions: Transaction[]) {
  const groups: { [date: string]: Transaction[] } = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
  });

  return groups;
}
