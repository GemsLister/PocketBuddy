import * as Button from "@/components/buttons/buttonsIndex";
import type { ReactNode } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ms } from "react-native-size-matters";

type ScreenContainerProps = {
  children: ReactNode;
  showAddButton?: boolean;
};

export default function ScreenContainer({
  children,
  showAddButton = true,
}: ScreenContainerProps) {
  return (
    <SafeAreaView className="flex-1 justify-between">
      {children}
      {showAddButton && (
        <View className="items-end" style={{ paddingHorizontal: ms(25, 0.8) }}>
          <Button.AddButton />
        </View>
      )}
    </SafeAreaView>
  );
}
