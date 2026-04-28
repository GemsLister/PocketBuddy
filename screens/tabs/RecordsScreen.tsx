import ScreenContainer from "@/components/container/ScreenContainer";
import EmptyState from "@/components/records/EmptyState";
import FilterBar from "@/components/records/FilterBar";
import SummaryCard from "@/components/records/SummaryCard";
import TransactionItem, {
    Transaction,
    TransactionType,
} from "@/components/records/TransactionItem";
import { useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";

// ---------- Types (ready for backend integration) ----------
type SummaryStats = {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
};

// ---------- Helper Functions ----------
function calculateSummary(transactions: Transaction[]): SummaryStats {
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

function groupTransactionsByDate(transactions: Transaction[]) {
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

// ---------- Main Screen ----------
export default function RecordsScreen() {
  // TODO: Replace with backend data / global state
  const [transactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");

  // Calculate summary stats
  const summary = useMemo(
    () => calculateSummary(transactions),
    [transactions]
  );

  // Filter and search logic
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((t) => t.type === filterType);
    }

    // Search by category or description
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.category.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [transactions, filterType, searchQuery]);

  // Group transactions by date
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions]
  );

  const handleTransactionPress = (transaction: Transaction) => {
    // TODO: Navigate to transaction detail screen or open edit modal
    console.log("Transaction pressed:", transaction);
  };

  return (
    <ScreenContainer showAddButton={true}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20, 0.7),
          paddingTop: vs(20),
          paddingBottom: vs(100),
          gap: vs(20),
        }}
      >
        {/* --- Summary Cards --- */}
        <View style={{ gap: vs(12) }}>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(24, 0.5) }}
          >
            Overview
          </Text>
          <View className="flex-row" style={{ gap: ms(10, 0.5) }}>
            <SummaryCard
              title="Balance"
              amount={summary.totalBalance}
              icon="wallet-outline"
              type="balance"
            />
          </View>
          <View className="flex-row" style={{ gap: ms(10, 0.5) }}>
            <SummaryCard
              title="Income"
              amount={summary.totalIncome}
              icon="trending-up-outline"
              type="income"
            />
            <SummaryCard
              title="Expenses"
              amount={summary.totalExpenses}
              icon="trending-down-outline"
              type="expense"
            />
          </View>
        </View>

        {/* --- Filter Bar --- */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={filterType}
          onFilterChange={setFilterType}
        />

        {/* --- Transactions List --- */}
        <View style={{ gap: vs(16) }}>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(18, 0.5) }}
          >
            Transactions
          </Text>

          {filteredTransactions.length === 0 ? (
            <EmptyState
              message={
                searchQuery || filterType !== "all"
                  ? "No transactions found"
                  : "No transactions yet"
              }
            />
          ) : (
            <View style={{ gap: vs(20) }}>
              {Object.entries(groupedTransactions).map(([date, items]) => (
                <View key={date} style={{ gap: vs(10) }}>
                  {/* Date Header */}
                  <Text
                    className="font-nunito-semibold text-beige"
                    style={{ fontSize: ms(13, 0.5), marginLeft: ms(4, 0.3) }}
                  >
                    {date}
                  </Text>

                  {/* Transaction Items */}
                  <View style={{ gap: vs(8) }}>
                    {items.map((transaction) => (
                      <TransactionItem
                        key={transaction.id}
                        transaction={transaction}
                        onPress={handleTransactionPress}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
