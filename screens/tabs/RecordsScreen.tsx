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
  buildMarkedDates,
  calculateSummary,
  formatDateHeader,
  groupTransactionsByDate,
  toDateKey,
} from "@/src/utils/transactionHelpers";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { ms, vs } from "react-native-size-matters";

// ---------- View Mode Type ----------
type ViewMode = "list" | "calendar";

// ---------- Main Screen ----------
export default function RecordsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<TransactionType | "all">("all");

  // Calendar state
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedDate, setSelectedDate] = useState<string>(
    toDateKey(new Date()),
  );

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

  // Group transactions by date (for list view)
  const groupedTransactions = useMemo(
    () => groupTransactionsByDate(filteredTransactions),
    [filteredTransactions],
  );

  // Calendar: marked dates (based on ALL transactions, ignoring filters)
  const markedDates = useMemo(
    () => buildMarkedDates(transactions, selectedDate),
    [transactions, selectedDate],
  );

  // Calendar: transactions for the selected date
  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    return transactions
      .filter((t) => toDateKey(t.date) === selectedDate)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }, [transactions, selectedDate]);

  // Calendar: summary for the selected date
  const selectedDaySummary = useMemo(
    () => calculateSummary(selectedDayTransactions),
    [selectedDayTransactions],
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

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
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

        {/* --- Filter Bar (only in list mode) --- */}
        {viewMode === "list" && (
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={filterType}
            onFilterChange={setFilterType}
          />
        )}

        {/* --- View Mode Toggle + Transactions Header --- */}
        <View style={{ gap: vs(16) }}>
          <View className="flex-row items-center justify-between">
            <Text
              className="font-nunito-bold text-moss"
              style={{ fontSize: ms(18, 0.5) }}
            >
              Transactions
            </Text>

            {/* Toggle Buttons */}
            <View
              className="flex-row bg-white"
              style={{
                borderRadius: ms(10, 0.3),
                overflow: "hidden",
              }}
            >
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setViewMode("list")}
                style={{
                  paddingHorizontal: ms(12, 0.5),
                  paddingVertical: vs(6),
                  backgroundColor:
                    viewMode === "list" ? "#385a41" : "transparent",
                  borderRadius: ms(10, 0.3),
                }}
              >
                <Ionicons
                  name="list-outline"
                  size={ms(18, 0.5)}
                  color={viewMode === "list" ? "#ffffff" : "#385a41"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setViewMode("calendar")}
                style={{
                  paddingHorizontal: ms(12, 0.5),
                  paddingVertical: vs(6),
                  backgroundColor:
                    viewMode === "calendar" ? "#385a41" : "transparent",
                  borderRadius: ms(10, 0.3),
                }}
              >
                <Ionicons
                  name="calendar-outline"
                  size={ms(18, 0.5)}
                  color={viewMode === "calendar" ? "#ffffff" : "#385a41"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* --- LIST VIEW --- */}
          {viewMode === "list" && (
            <>
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
                        style={{
                          fontSize: ms(13, 0.5),
                          marginLeft: ms(4, 0.3),
                        }}
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
            </>
          )}

          {/* --- CALENDAR VIEW --- */}
          {viewMode === "calendar" && (
            <>
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
              ) : (
                <View style={{ gap: vs(16) }}>
                  {/* Calendar Widget */}
                  <View
                    style={{
                      borderRadius: ms(16, 0.3),
                      overflow: "hidden",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Calendar
                      markingType="multi-dot"
                      markedDates={markedDates}
                      onDayPress={handleDayPress}
                      theme={{
                        backgroundColor: "#ffffff",
                        calendarBackground: "#ffffff",
                        textSectionTitleColor: "#a0b089",
                        selectedDayBackgroundColor: "#588157",
                        selectedDayTextColor: "#ffffff",
                        todayTextColor: "#588157",
                        dayTextColor: "#385a41",
                        textDisabledColor: "#dcd8cc",
                        arrowColor: "#588157",
                        monthTextColor: "#385a41",
                        textMonthFontFamily: "Nunito-Bold",
                        textDayFontFamily: "Nunito-Regular",
                        textDayHeaderFontFamily: "Nunito-SemiBold",
                        textMonthFontSize: ms(16, 0.5),
                        textDayFontSize: ms(14, 0.5),
                        textDayHeaderFontSize: ms(12, 0.5),
                      }}
                    />
                  </View>

                  {/* Dot Legend */}
                  <View
                    className="flex-row items-center justify-center"
                    style={{ gap: ms(20, 0.5) }}
                  >
                    <View
                      className="flex-row items-center"
                      style={{ gap: ms(6, 0.3) }}
                    >
                      <View
                        style={{
                          width: ms(8, 0.3),
                          height: ms(8, 0.3),
                          borderRadius: ms(4, 0.3),
                          backgroundColor: "#588157",
                        }}
                      />
                      <Text
                        className="font-nunito-semibold text-beige"
                        style={{ fontSize: ms(12, 0.5) }}
                      >
                        Income
                      </Text>
                    </View>
                    <View
                      className="flex-row items-center"
                      style={{ gap: ms(6, 0.3) }}
                    >
                      <View
                        style={{
                          width: ms(8, 0.3),
                          height: ms(8, 0.3),
                          borderRadius: ms(4, 0.3),
                          backgroundColor: "#dc2626",
                        }}
                      />
                      <Text
                        className="font-nunito-semibold text-beige"
                        style={{ fontSize: ms(12, 0.5) }}
                      >
                        Expense
                      </Text>
                    </View>
                  </View>

                  {/* Selected Day Header */}
                  <Text
                    className="font-nunito-bold text-moss"
                    style={{ fontSize: ms(16, 0.5) }}
                  >
                    {formatDateHeader(selectedDate)}
                  </Text>

                  {/* Selected Day Summary Cards */}
                  {selectedDayTransactions.length > 0 && (
                    <View className="flex-row" style={{ gap: ms(10, 0.5) }}>
                      <View
                        className="flex-1 bg-white"
                        style={{
                          padding: ms(12, 0.5),
                          borderRadius: ms(12, 0.3),
                          gap: vs(4),
                        }}
                      >
                        <Text
                          className="font-nunito text-beige"
                          style={{ fontSize: ms(12, 0.5) }}
                        >
                          Income
                        </Text>
                        <Text
                          className="font-nunito-bold"
                          style={{ fontSize: ms(16, 0.5), color: "#588157" }}
                        >
                          +₱
                          {selectedDaySummary.totalIncome.toLocaleString(
                            "en-PH",
                          )}
                        </Text>
                      </View>
                      <View
                        className="flex-1 bg-white"
                        style={{
                          padding: ms(12, 0.5),
                          borderRadius: ms(12, 0.3),
                          gap: vs(4),
                        }}
                      >
                        <Text
                          className="font-nunito text-beige"
                          style={{ fontSize: ms(12, 0.5) }}
                        >
                          Expenses
                        </Text>
                        <Text
                          className="font-nunito-bold"
                          style={{ fontSize: ms(16, 0.5), color: "#dc2626" }}
                        >
                          -₱
                          {selectedDaySummary.totalExpenses.toLocaleString(
                            "en-PH",
                          )}
                        </Text>
                      </View>
                    </View>
                  )}

                  {/* Selected Day Transactions */}
                  {selectedDayTransactions.length === 0 ? (
                    <EmptyState message="No transactions on this day" />
                  ) : (
                    <View style={{ gap: vs(8) }}>
                      {selectedDayTransactions.map((transaction) => (
                        <TransactionItem
                          key={transaction.id}
                          transaction={transaction}
                          onPress={handleTransactionPress}
                        />
                      ))}
                    </View>
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
