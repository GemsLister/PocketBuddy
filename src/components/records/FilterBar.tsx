import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { ms, vs } from "react-native-size-matters";
import type { TransactionType } from "./TransactionItem";

type FilterBarProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: TransactionType | "all";
  onFilterChange: (filter: TransactionType | "all") => void;
};

type FilterChip = {
  id: TransactionType | "all";
  label: string;
};

const filters: FilterChip[] = [
  { id: "all", label: "All" },
  { id: "income", label: "Income" },
  { id: "expense", label: "Expense" },
  { id: "transfer", label: "Transfer" },
];

export default function FilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
}: FilterBarProps) {
  return (
    <View style={{ gap: vs(12) }}>
      {/* Search Input */}
      <View
        className="flex-row items-center bg-white"
        style={{
          paddingHorizontal: ms(14, 0.5),
          paddingVertical: vs(10),
          borderRadius: ms(14, 0.3),
          gap: ms(10, 0.5),
        }}
      >
        <Ionicons name="search-outline" size={ms(20, 0.5)} color="#a0b089" />
        <TextInput
          className="flex-1 font-nunito text-moss"
          style={{ fontSize: ms(15, 0.5) }}
          placeholder="Search transactions..."
          placeholderTextColor="#a0b089"
          value={searchQuery}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Filter Chips */}
      <View className="flex-row" style={{ gap: ms(8, 0.5) }}>
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          return (
            <TouchableOpacity
              key={filter.id}
              activeOpacity={0.7}
              onPress={() => onFilterChange(filter.id)}
              className={`${isActive ? "bg-moss" : "bg-white"}`}
              style={{
                paddingHorizontal: ms(16, 0.5),
                paddingVertical: vs(8),
                borderRadius: ms(20, 0.3),
              }}
            >
              <Text
                className={`font-nunito-semibold ${isActive ? "text-white" : "text-moss"}`}
                style={{ fontSize: ms(13, 0.5) }}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
