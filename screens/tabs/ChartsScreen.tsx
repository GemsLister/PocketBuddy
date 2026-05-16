import ScreenContainer from "@/src/components/container/ScreenContainer";
import type { Transaction } from "@/src/components/records/TransactionItem";
import TransactionItem from "@/src/components/records/TransactionItem";
import { supabase } from "@/src/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";
import Svg, { Circle, G, Path as SvgPath } from "react-native-svg";

// ---------- Constants ----------
const COLORS = {
  leaf: "#588157",
  moss: "#385a41",
  beige: "#a0b089",
  red: "#dc2626",
  cardBg: "#ffffff",
  trackBg: "#f1f3ee",
} as const;

const EXPENSE_PALETTE = [
  "#dc2626", // red
  "#f59e0b", // amber
  "#8b5cf6", // violet
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#ec4899", // pink
];

const expenseCategories = new Set([
  "Foods",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Self-Care",
]);

// ---------- Types ----------
type PieItem = { label: string; value: number; color: string; percent: number };

type MonthlyFlow = {
  label: string; // "May 2026"
  key: string; // "2026-05"
  income: number;
  expense: number;
};

// ---------- Utility ----------
function toNumber(val: any) {
  if (typeof val === "string") return parseFloat(val);
  if (typeof val === "number") return val;
  return 0;
}

function formatCurrency(value: number): string {
  return `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2 })}`;
}

// ---------- SVG Geometry ----------
function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(angleInRadians),
    y: cy + r * Math.sin(angleInRadians),
  };
}

function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
) {
  const startOuter = polarToCartesian(cx, cy, rOuter, endAngle);
  const endOuter = polarToCartesian(cx, cy, rOuter, startAngle);
  const startInner = polarToCartesian(cx, cy, rInner, endAngle);
  const endInner = polarToCartesian(cx, cy, rInner, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  return [
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

// ---------- Donut Chart Component ----------
function DonutChart({
  items,
  centerLabel,
  centerValue,
}: {
  items: PieItem[];
  centerLabel: string;
  centerValue: string;
}) {
  const size = ms(200, 0.5);
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 10;
  const rInner = rOuter * 0.65;

  const total =
    items.reduce((sum, it) => sum + Math.max(0, it.value), 0) || 1;
  let currentAngle = 0;

  return (
    <View style={{ alignItems: "center", position: "relative" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={(rOuter + rInner) / 2}
          fill="none"
          stroke={COLORS.trackBg}
          strokeWidth={rOuter - rInner}
        />
        <G>
          {items.map((it, idx) => {
            const value = Math.max(0, it.value);
            const sliceAngle = (value / total) * 360;
            if (sliceAngle <= 0.0001) return null;

            const gapDeg = items.length > 1 ? 2 : 0;
            const startAngle = currentAngle + gapDeg / 2;
            const endAngle = currentAngle + sliceAngle - gapDeg / 2;
            currentAngle += sliceAngle;

            return (
              <SvgPath
                key={`${it.label}-${idx}`}
                d={arcPath(cx, cy, rOuter, rInner, startAngle, endAngle)}
                fill={it.color}
              />
            );
          })}
        </G>
      </Svg>
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          className="font-nunito text-beige"
          style={{ fontSize: ms(11, 0.4) }}
        >
          {centerLabel}
        </Text>
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(16, 0.4) }}
        >
          {centerValue}
        </Text>
      </View>
    </View>
  );
}

// ---------- Legend Item ----------
function LegendItem({ item }: { item: PieItem }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: vs(6),
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: ms(10, 0.3),
          flex: 1,
        }}
      >
        <View
          style={{
            width: ms(10, 0.3),
            height: ms(10, 0.3),
            borderRadius: ms(5, 0.3),
            backgroundColor: item.color,
          }}
        />
        <Text
          className="font-nunito-semibold text-moss"
          style={{ fontSize: ms(13, 0.4) }}
          numberOfLines={1}
        >
          {item.label}
        </Text>
      </View>
      <View style={{ alignItems: "flex-end" }}>
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(13, 0.4) }}
        >
          {formatCurrency(item.value)}
        </Text>
        <Text
          className="font-nunito text-beige"
          style={{ fontSize: ms(11, 0.4) }}
        >
          {item.percent.toFixed(1)}%
        </Text>
      </View>
    </View>
  );
}

// ---------- Monthly Flow Row ----------
function MonthFlowRow({
  month,
  maxValue,
}: {
  month: MonthlyFlow;
  maxValue: number;
}) {
  const incomeWidth = maxValue > 0 ? (month.income / maxValue) * 100 : 0;
  const expenseWidth = maxValue > 0 ? (month.expense / maxValue) * 100 : 0;
  const net = month.income - month.expense;
  const isPositive = net >= 0;

  return (
    <View style={{ gap: vs(6) }}>
      {/* Month Header */}
      <View
        className="flex-row items-center justify-between"
      >
        <Text
          className="font-nunito-semibold text-moss"
          style={{ fontSize: ms(14, 0.4) }}
        >
          {month.label}
        </Text>
        <Text
          className="font-nunito-bold"
          style={{
            fontSize: ms(13, 0.4),
            color: isPositive ? COLORS.leaf : COLORS.red,
          }}
        >
          {isPositive ? "+" : ""}
          {formatCurrency(net)}
        </Text>
      </View>

      {/* Income Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: ms(8, 0.3),
        }}
      >
        <Ionicons
          name="trending-up-outline"
          size={ms(14, 0.4)}
          color={COLORS.leaf}
        />
        <View
          style={{
            flex: 1,
            height: ms(8, 0.3),
            backgroundColor: COLORS.trackBg,
            borderRadius: ms(4, 0.3),
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.min(100, incomeWidth)}%`,
              backgroundColor: COLORS.leaf,
              borderRadius: ms(4, 0.3),
            }}
          />
        </View>
        <Text
          className="font-nunito text-moss"
          style={{
            fontSize: ms(11, 0.4),
            width: ms(80, 0.4),
            textAlign: "right",
          }}
        >
          {formatCurrency(month.income)}
        </Text>
      </View>

      {/* Expense Bar */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: ms(8, 0.3),
        }}
      >
        <Ionicons
          name="trending-down-outline"
          size={ms(14, 0.4)}
          color={COLORS.red}
        />
        <View
          style={{
            flex: 1,
            height: ms(8, 0.3),
            backgroundColor: COLORS.trackBg,
            borderRadius: ms(4, 0.3),
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.min(100, expenseWidth)}%`,
              backgroundColor: COLORS.red,
              borderRadius: ms(4, 0.3),
            }}
          />
        </View>
        <Text
          className="font-nunito text-moss"
          style={{
            fontSize: ms(11, 0.4),
            width: ms(80, 0.4),
            textAlign: "right",
          }}
        >
          {formatCurrency(month.expense)}
        </Text>
      </View>
    </View>
  );
}

// ---------- Section Card ----------
function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        backgroundColor: COLORS.cardBg,
        borderRadius: ms(16, 0.3),
        padding: ms(18, 0.5),
        gap: vs(14),
      }}
    >
      <View
        className="flex-row items-center"
        style={{ gap: ms(8, 0.3) }}
      >
        <Ionicons name={icon} size={ms(18, 0.4)} color={COLORS.moss} />
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(16, 0.5) }}
        >
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
}

// ---------- Main Screen ----------
export default function ChartsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        if (queryError) throw new Error(queryError.message);

        const mapped: Transaction[] = (data ?? []).map((row: any) => {
          const dbType = row.type as Transaction["type"];
          const category = String(row.category ?? "");
          const normalizedType: Transaction["type"] = expenseCategories.has(
            category,
          )
            ? "expense"
            : dbType;

          return {
            id: row.id,
            type: normalizedType,
            category: row.category,
            amount: toNumber(row.amount),
            description: row.note ?? undefined,
            date: row.transaction_date,
            icon:
              normalizedType === "income"
                ? "cash-outline"
                : "fast-food-outline",
          };
        });

        if (isMounted) setTransactions(mapped);
      } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        if (isMounted) setError(message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadTransactions();
    return () => {
      isMounted = false;
    };
  }, []);

  // ---------- 1. Monthly Cash Flow ----------
  const monthlyFlow = useMemo((): MonthlyFlow[] => {
    const map = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      if (!map.has(key)) map.set(key, { income: 0, expense: 0 });
      const entry = map.get(key)!;
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
    });

    const months: MonthlyFlow[] = Array.from(map.entries())
      .map(([key, v]) => {
        const [year, month] = key.split("-");
        const date = new Date(Number(year), Number(month) - 1);
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
        return { label, key, income: v.income, expense: v.expense };
      })
      .sort((a, b) => b.key.localeCompare(a.key)) // newest first
      .slice(0, 6); // last 6 months

    return months;
  }, [transactions]);

  const maxFlowValue = useMemo(() => {
    if (!monthlyFlow.length) return 1;
    return Math.max(
      ...monthlyFlow.map((m) => Math.max(m.income, m.expense)),
      1,
    );
  }, [monthlyFlow]);

  // ---------- 2. Expense Breakdown (expenses only) ----------
  const expensePieItems = useMemo((): PieItem[] => {
    const map = new Map<string, number>();
    transactions.forEach((t) => {
      if (t.type !== "expense") return;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    });

    const sorted = Array.from(map.entries())
      .map(([cat, amount]) => ({ cat, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6);

    const total = sorted.reduce((s, r) => s + r.amount, 0) || 1;

    if (sorted.length === 0) {
      return [
        { label: "No expenses", value: 1, color: COLORS.beige, percent: 100 },
      ];
    }

    return sorted.map((r, i) => ({
      label: r.cat,
      value: r.amount,
      color: EXPENSE_PALETTE[i % EXPENSE_PALETTE.length],
      percent: (r.amount / total) * 100,
    }));
  }, [transactions]);

  const totalExpenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0),
    [transactions],
  );

  // ---------- 3. Top Largest Expenses ----------
  const topExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === "expense")
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <ScreenContainer>
        <View
          className="flex-1 items-center justify-center"
          style={{ gap: vs(12) }}
        >
          <ActivityIndicator size="large" color={COLORS.leaf} />
          <Text className="font-nunito text-beige">Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

  // ---------- Error ----------
  if (error) {
    return (
      <ScreenContainer>
        <View style={{ padding: vs(24) }}>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(18, 0.5) }}
          >
            Error
          </Text>
          <Text
            className="font-nunito text-beige"
            style={{ marginTop: vs(12) }}
          >
            {error}
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // ---------- Render ----------
  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20, 0.7),
          paddingTop: vs(20),
          paddingBottom: vs(100),
          gap: vs(16),
        }}
      >
        {/* Page Header */}
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(24, 0.5) }}
        >
          Insights
        </Text>

        {/* ---- Section 1: Monthly Cash Flow ---- */}
        <SectionCard title="Monthly Cash Flow" icon="bar-chart-outline">
          {monthlyFlow.length === 0 ? (
            <Text className="font-nunito text-beige">
              No data yet. Start adding transactions!
            </Text>
          ) : (
            <View style={{ gap: vs(18) }}>
              {monthlyFlow.map((m) => (
                <MonthFlowRow
                  key={m.key}
                  month={m}
                  maxValue={maxFlowValue}
                />
              ))}
            </View>
          )}
        </SectionCard>

        {/* ---- Section 2: Expense Breakdown ---- */}
        <SectionCard title="Where Money Goes" icon="pie-chart-outline">
          <DonutChart
            items={expensePieItems}
            centerLabel="Spent"
            centerValue={formatCurrency(totalExpenses)}
          />
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: COLORS.trackBg,
              paddingTop: vs(10),
            }}
          >
            {expensePieItems.map((item) => (
              <LegendItem key={item.label} item={item} />
            ))}
          </View>
        </SectionCard>

        {/* ---- Section 3: Top Largest Expenses ---- */}
        <SectionCard title="Biggest Expenses" icon="flash-outline">
          {topExpenses.length === 0 ? (
            <Text className="font-nunito text-beige">
              No expenses recorded yet.
            </Text>
          ) : (
            <View style={{ gap: vs(8) }}>
              {topExpenses.map((t, idx) => (
                <View key={t.id} className="flex-row items-center" style={{ gap: ms(8, 0.3) }}>
                  {/* Rank Badge */}
                  <View
                    style={{
                      width: ms(24, 0.4),
                      height: ms(24, 0.4),
                      borderRadius: ms(12, 0.4),
                      backgroundColor: idx === 0 ? COLORS.red : COLORS.trackBg,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                      className="font-nunito-bold"
                      style={{
                        fontSize: ms(11, 0.4),
                        color: idx === 0 ? "#fff" : COLORS.moss,
                      }}
                    >
                      {idx + 1}
                    </Text>
                  </View>
                  {/* Transaction Card */}
                  <View style={{ flex: 1 }}>
                    <TransactionItem transaction={t} />
                  </View>
                </View>
              ))}
            </View>
          )}
        </SectionCard>
      </ScrollView>
    </ScreenContainer>
  );
}
