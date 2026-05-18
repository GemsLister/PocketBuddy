import Calculator from "@/src/components/calculator/Calculator";
import { useToast } from "@/src/components/toast/ToastProvider";
import { useSaveTransaction } from "@/src/hooks/transaction/useSaveTransaction";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps, ReactNode, useState } from "react";
import {
    Dimensions,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { ms, vs } from "react-native-size-matters";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_PADDING = ms(20, 0.7);
const GRID_GAP = ms(12, 0.5);
const COLUMN_COUNT = SCREEN_WIDTH > 600 ? 4 : 3; // 4 columns for tablets, 3 for phones
const ITEM_WIDTH =
  (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP * (COLUMN_COUNT - 1)) /
  COLUMN_COUNT;

type IoniconsName = ComponentProps<typeof Ionicons>["name"];

type CategoryItem = {
  name: string;
  icon: IoniconsName | ReactNode;
};

type CategoriesProps = {
  icons: CategoryItem[];
  view: string;
  type: "income" | "expense";
};

// ---------- Constants ----------
const COLORS = {
  leaf: "#588157",
  moss: "#385a41",
  beige: "#a0b089",
  cream: "#dcd8cc",
  white: "#ffffff",
  red: "#dc2626",
  trackBg: "#f1f3ee",
} as const;

export default function CategoriesContainer({
  icons,
  view,
  type,
}: CategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [showCalculator, setShowCalculator] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { saveTransaction } = useSaveTransaction();
  const toast = useToast();

  const canSave = selectedCategory && amount && parseFloat(amount) > 0;

  const handleSave = async () => {
    if (!canSave || !selectedCategory) return;

    setIsSaving(true);
    const result = await saveTransaction({
      type,
      category: selectedCategory,
      amount,
      note,
    });

    if (result.success) {
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      toast.show(`${typeLabel} saved successfully!`, "success");
      // Reset form
      setSelectedCategory(null);
      setAmount("");
      setNote("");
    } else {
      toast.show(result.error || `Failed to save ${type}`, "error");
    }
    setIsSaving(false);
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: ms(20, 0.7),
        paddingTop: vs(8),
        paddingBottom: vs(24),
        gap: vs(24),
      }}
    >
      {/* ---- Amount Display ---- */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowCalculator(true)}
        style={{
          backgroundColor: COLORS.white,
          borderRadius: ms(16, 0.3),
          paddingVertical: vs(24),
          paddingHorizontal: ms(20, 0.5),
          alignItems: "center",
          gap: vs(4),
        }}
      >
        <Text
          className="font-nunito text-beige"
          style={{ fontSize: ms(13, 0.4) }}
        >
          Tap to enter amount
        </Text>
        <Text
          className="font-nunito-bold"
          style={{
            fontSize: ms(36, 0.5),
            color: amount ? COLORS.moss : COLORS.cream,
          }}
        >
          ₱{amount || "0.00"}
        </Text>
      </TouchableOpacity>

      {/* ---- Category Grid ---- */}
      <View style={{ gap: vs(12) }}>
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(16, 0.5) }}
        >
          Category
        </Text>
        <View
          className="flex-row flex-wrap"
          style={{ gap: GRID_GAP, justifyContent: "flex-start" }}
        >
          {icons.map((item, index) => {
            const isSelected = selectedCategory === item.name;
            return (
              <Pressable
                key={index}
                onPress={() => setSelectedCategory(item.name)}
                style={{
                  width: ITEM_WIDTH,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: vs(8),
                  paddingVertical: vs(12),
                  borderRadius: ms(16, 0.3),
                  backgroundColor: isSelected ? COLORS.leaf : COLORS.white,
                  borderWidth: isSelected ? 0 : 1,
                  borderColor: COLORS.trackBg,
                  shadowColor: isSelected ? COLORS.leaf : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.2 : 0.05,
                  shadowRadius: 4,
                  elevation: isSelected ? 4 : 1,
                }}
              >
                <View
                  style={{
                    width: ms(40, 0.5),
                    height: ms(40, 0.5),
                    borderRadius: ms(20, 0.5),
                    backgroundColor: isSelected
                      ? "rgba(255,255,255,0.2)"
                      : COLORS.trackBg,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {typeof item.icon === "string" ? (
                    <Ionicons
                      name={item.icon as IoniconsName}
                      size={ms(22, 0.5)}
                      color={isSelected ? "#ffffff" : COLORS.moss}
                    />
                  ) : (
                    item.icon
                  )}
                </View>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className={`font-nunito-semibold text-center ${isSelected ? "text-white" : "text-moss"}`}
                  style={{ fontSize: ms(11, 0.5), width: "90%" }}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ---- Note Input ---- */}
      <View style={{ gap: vs(10) }}>
        <Text
          className="font-nunito-bold text-moss"
          style={{ fontSize: ms(16, 0.5) }}
        >
          Note
        </Text>
        <TextInput
          className="font-nunito text-moss"
          style={{
            fontSize: ms(14, 0.5),
            backgroundColor: COLORS.white,
            borderRadius: ms(12, 0.3),
            paddingVertical: vs(12),
            paddingHorizontal: ms(14, 0.5),
          }}
          placeholder="Add a note (optional)"
          placeholderTextColor={COLORS.beige}
          value={note}
          onChangeText={setNote}
        />
      </View>

      {/* ---- Spacer ---- */}
      <View style={{ flex: 1 }} />

      {/* ---- Save Button ---- */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleSave}
        disabled={!canSave || isSaving}
        style={{
          backgroundColor: canSave ? COLORS.moss : COLORS.cream,
          borderRadius: ms(14, 0.3),
          paddingVertical: vs(14),
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: ms(8, 0.3),
        }}
      >
        <Ionicons
          name="checkmark-circle-outline"
          size={ms(20, 0.5)}
          color={canSave ? "#ffffff" : COLORS.beige}
        />
        <Text
          className="font-nunito-bold"
          style={{
            fontSize: ms(16, 0.5),
            color: canSave ? "#ffffff" : COLORS.beige,
          }}
        >
          {isSaving ? "Saving..." : "Save Transaction"}
        </Text>
      </TouchableOpacity>

      {/* ---- Calculator Modal ---- */}
      <Calculator
        visible={showCalculator}
        onClose={() => setShowCalculator(false)}
        onConfirm={(value) => {
          setAmount(value);
          setShowCalculator(false);
        }}
      />
    </View>
  );
}
