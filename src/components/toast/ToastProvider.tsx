import { Ionicons } from "@expo/vector-icons";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Animated, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ms, vs } from "react-native-size-matters";

// ---------- Types ----------
type ToastType = "success" | "error";

type ToastState = {
  message: string;
  type: ToastType;
  visible: boolean;
};

type ToastContextValue = {
  show: (message: string, type?: ToastType) => void;
};

// ---------- Context ----------
const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}

// ---------- Config ----------
const TOAST_DURATION = 3000; // ms visible
const ANIM_DURATION = 300; // ms slide in/out

const TOAST_STYLES: Record<
  ToastType,
  { bg: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  success: { bg: "#588157", icon: "checkmark-circle" },
  error: { bg: "#dc2626", icon: "alert-circle" },
};

// ---------- Provider ----------
export function ToastProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    visible: false,
  });

  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: ANIM_DURATION,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    });
  }, [translateY, opacity]);

  const show = useCallback(
    (message: string, type: ToastType = "success") => {
      // Clear any existing timer
      if (timerRef.current) clearTimeout(timerRef.current);

      // Reset animation values
      translateY.setValue(-120);
      opacity.setValue(0);

      setToast({ message, type, visible: true });

      // Animate in
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          damping: 15,
          stiffness: 120,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: ANIM_DURATION,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      timerRef.current = setTimeout(hide, TOAST_DURATION);
    },
    [translateY, opacity, hide],
  );

  const style = TOAST_STYLES[toast.type];

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {toast.visible && (
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: insets.top + vs(8),
            left: ms(16, 0.7),
            right: ms(16, 0.7),
            zIndex: 9999,
            transform: [{ translateY }],
            opacity,
          }}
        >
          <View
            style={{
              backgroundColor: style.bg,
              borderRadius: ms(14, 0.3),
              paddingVertical: vs(14),
              paddingHorizontal: ms(18, 0.5),
              flexDirection: "row",
              alignItems: "center",
              gap: ms(12, 0.3),
              // Subtle shadow
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <Ionicons name={style.icon} size={ms(22, 0.5)} color="#ffffff" />
            <Text
              className="font-nunito-semibold"
              style={{
                color: "#ffffff",
                fontSize: ms(14, 0.5),
                flex: 1,
              }}
              numberOfLines={2}
            >
              {toast.message}
            </Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}
