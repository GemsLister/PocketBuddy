import { Transaction } from "@/src/components/records/TransactionItem";

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
