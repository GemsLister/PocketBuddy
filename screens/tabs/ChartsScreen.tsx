import ScreenContainer from "@/src/components/container/ScreenContainer";
import type { Transaction } from "@/src/components/records/TransactionItem";
import { supabase } from "@/src/lib/supabase";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { ms, vs } from "react-native-size-matters";
import Svg, { Circle, G, Path as SvgPath } from "react-native-svg";

const expenseCategories = new Set([
  "Foods",
  "Transport",
  "Bills",
  "Shopping",
  "Health",
  "Self-Care",
]);

type CategoryTotalsRow = {
  category: string;
  income: number;
  expense: number;
  net: number;
};

function toNumber(val: any) {
  if (typeof val === "string") return parseFloat(val);
  if (typeof val === "number") return val;
  return 0;
}

type PieItem = { label: string; value: number; color: string };

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
    // outer arc
    `M ${startOuter.x} ${startOuter.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArcFlag} 0 ${endOuter.x} ${endOuter.y}`,
    // inner arc
    `L ${endInner.x} ${endInner.y}`,
    `A ${rInner} ${rInner} 0 ${largeArcFlag} 1 ${startInner.x} ${startInner.y}`,
    "Z",
  ].join(" ");
}

function PieChartRing({ items }: { items: PieItem[] }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 100;
  const rInner = 70;

  const total = items.reduce((sum, it) => sum + Math.max(0, it.value), 0) || 1;
  let currentAngle = 0;

  // Start at top (-90deg handled in polarToCartesian)
  return (
    <View style={{ alignItems: "center" }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle
          cx={cx}
          cy={cy}
          r={rOuter}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={14}
        />
        <G>
          {items.map((it, idx) => {
            const value = Math.max(0, it.value);
            const sliceAngle = (value / total) * 360;
            if (sliceAngle <= 0.0001) return null;

            const startAngle = currentAngle;
            const endAngle = currentAngle + sliceAngle;
            currentAngle = endAngle;

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
    </View>
  );
}

export default function ChartsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOTE: chart.js works for React Native only when you have a rendering layer (canvas).
  // This project currently does not use a chart renderer wrapper, so we only compute
  // the aggregated values here.
  // If you want, we can wire actual rendering using `react-native-svg` + custom render.

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

  const categoryTotals = useMemo((): CategoryTotalsRow[] => {
    const map = new Map<string, { income: number; expense: number }>();

    transactions.forEach((t) => {
      if (!map.has(t.category)) map.set(t.category, { income: 0, expense: 0 });
      const curr = map.get(t.category)!;
      if (t.type === "income") curr.income += t.amount;
      else curr.expense += t.amount;
    });

    const rows: CategoryTotalsRow[] = Array.from(map.entries()).map(
      ([category, v]) => ({
        category,
        income: v.income,
        expense: v.expense,
        net: v.income - v.expense,
      }),
    );

    rows.sort((a, b) => Math.abs(b.net) - Math.abs(a.net));
    return rows;
  }, [transactions]);

  const top = categoryTotals.slice(0, 6);

  const pieItems = useMemo(() => {
    if (!top.length) {
      return [{ label: "No data", value: 1, color: "#a0b089" }];
    }

    return top.map((r) => ({
      label: r.category,
      value: r.income + r.expense,
      color: r.net >= 0 ? "#588157" : "#dc2626",
    }));
  }, [top]);

  const barLabels = top.map((r) => r.category);
  const barIncome = top.map((r) => r.income);
  const barExpense = top.map((r) => r.expense);

  if (isLoading) {
    return (
      <ScreenContainer>
        <View style={{ padding: vs(24), gap: vs(12) }}>
          <ActivityIndicator size="large" color="#588157" />
          <Text className="font-nunito text-beige">Loading...</Text>
        </View>
      </ScreenContainer>
    );
  }

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

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: ms(20, 0.7),
          paddingTop: vs(20),
          paddingBottom: vs(100),
        }}
      >
        <View style={{ gap: vs(16) }}>
          <Text
            className="font-nunito-bold text-moss"
            style={{ fontSize: ms(22, 0.5) }}
          >
            Charts
          </Text>

          {/* Pie (SVG) */}
          <View style={{ gap: vs(10) }}>
            <Text
              className="font-nunito-semibold text-beige"
              style={{ fontSize: ms(14, 0.5) }}
            >
              Pie: Top categories impact (Income + Expense)
            </Text>

            {/* Pie chart ring */}
            <PieChartRing items={pieItems} />

            {/* Legend */}
            <View style={{ gap: vs(8) }}>
              {pieItems.map((it) => (
                <View
                  key={it.label}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: ms(10, 0.2),
                    }}
                  >
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: it.color,
                      }}
                    />
                    <Text
                      className="font-nunito text-beige"
                      style={{ fontSize: ms(13, 0.4) }}
                      numberOfLines={1}
                    >
                      {it.label}
                    </Text>
                  </View>
                  <Text
                    className="font-nunito-bold text-moss"
                    style={{ fontSize: ms(13, 0.4) }}
                  >
                    ₱
                    {it.value.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Bar (computed) */}
          <View style={{ gap: vs(10) }}>
            <Text
              className="font-nunito-semibold text-beige"
              style={{ fontSize: ms(14, 0.5) }}
            >
              Bar: Income vs Expense per category
            </Text>

            <View style={{ gap: vs(10) }}>
              {barLabels.length === 0 ? (
                <Text className="font-nunito text-beige">No data</Text>
              ) : (
                barLabels.map((label, idx) => (
                  <View key={label} style={{ gap: vs(6) }}>
                    <Text
                      className="font-nunito-semibold text-moss"
                      style={{ fontSize: ms(13, 0.4) }}
                    >
                      {label}
                    </Text>
                    <View
                      style={{
                        height: 10,
                        backgroundColor: "#e5e7eb",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: 10,
                          width: `${Math.min(100, (barIncome[idx] / Math.max(...barIncome, 1)) * 100)}%`,
                          backgroundColor: "#588157",
                        }}
                      />
                    </View>
                    <View
                      style={{
                        height: 10,
                        backgroundColor: "#e5e7eb",
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      <View
                        style={{
                          height: 10,
                          width: `${Math.min(100, (barExpense[idx] / Math.max(...barExpense, 1)) * 100)}%`,
                          backgroundColor: "#dc2626",
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        className="font-nunito text-beige"
                        style={{ fontSize: ms(12, 0.4) }}
                      >
                        Income: ₱
                        {barIncome[idx].toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                      <Text
                        className="font-nunito text-beige"
                        style={{ fontSize: ms(12, 0.4) }}
                      >
                        Expense: ₱
                        {barExpense[idx].toLocaleString("en-PH", {
                          minimumFractionDigits: 2,
                        })}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
