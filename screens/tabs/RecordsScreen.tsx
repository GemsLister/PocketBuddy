import ScreenContainer from "@/src/components/container/ScreenContainer";
import EmptyState from "@/src/components/records/EmptyState";
import FilterBar from "@/src/components/records/FilterBar";
import SummaryCard from "@/src/components/records/SummaryCard";
import TransactionItem, {
  Transaction,
  TransactionType,
} from "@/src/components/records/TransactionItem";
import { supabase } from "@/src/lib/supabase";
import {
  calculateSummary,
  groupTransactionsByDate,
} from "@/src/utils/transactionHelpers";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import { ms, vs } from "react-native-size-matters";

// ---------- Main Screen ----------
export default function RecordsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");

  // Calculate summary stats
  const summary = useMemo(() => calculateSummary(transactions), [transactions]);

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
          t.description?.toLowerCase().includes(query),
      );
    }

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [transactions, filterType, searchQuery]);

  // Group transactions by date
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions],
  );

  useEffect(() => {
    let isMounted = true;

    const loadTransactions = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          throw new Error("User not authenticated. Please log in again.");
        }

        const { data, error: queryError } = await supabase
          .from("transactions")
          .select("id, type, category, amount, note, transaction_date")
          .eq("user_id", session.user.id)
          .order("transaction_date", { ascending: false });

        if (queryError) {
          throw new Error(queryError.message);
        }

        const mapped: Transaction[] = (data ?? []).map((row: any) => {
          // Guardrail para sa imong case: naa'y expense categories nga naay maling `type` = "income" sa DB.
          // Optional: temp fix ni hangtod ma-correct ang data sa Supabase.
          const expenseCategories = new Set([
            "Foods",
            "Transport",
            "Bills",
            "Shopping",
            "Health",
            "Self-Care",
          ]);

          const dbType = row.type as TransactionType;
          const category = String(row.category ?? "");

          const normalizedType: TransactionType = expenseCategories.has(
            category,
          )
            ? "expense"
            : dbType;

          return {
            id: row.id,
            type: normalizedType,
            category: row.category,
            amount:
              typeof row.amount === "string"
                ? parseFloat(row.amount)
                : row.amount,
            description: row.note ?? undefined,
            date: row.transaction_date,
            icon:
              normalizedType === "income"
                ? "cash-outline"
                : "fast-food-outline",
          };
        });

        if (isMounted) {
          setTransactions(mapped);
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        if (isMounted) {
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleTransactionPress = (transaction: Transaction) => {
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

          {isLoading ? (
            <View style={{ paddingVertical: vs(30) }}>
              <ActivityIndicator size="large" color="#588157" />
              <Text
                className="font-nunito text-beige"
                style={{ marginTop: vs(12) }}
              >
                Loading...
              </Text>
            </View>
          ) : filteredTransactions.length === 0 ? (
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
