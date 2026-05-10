import { supabase } from "@/src/lib/supabase";

// ✅ Properly named type for transaction parameters
type SaveTransactionParams = {
  type: "income" | "expense" | "transfer";
  category: string;
  amount: string;
  note?: string;
};

// ✅ Define return type for better type safety
type SaveTransactionResult = {
  success: boolean;
  data?: unknown;
  error?: string;
};

// ✅ Define hook return type
type UseSaveTransactionReturn = {
  saveTransaction: (
    params: SaveTransactionParams,
  ) => Promise<SaveTransactionResult>;
};

export const useSaveTransaction = (): UseSaveTransactionReturn => {
  const saveTransaction = async ({
    type,
    category,
    amount,
    note = "",
  }: SaveTransactionParams): Promise<SaveTransactionResult> => {
    try {
      // Step 1: Get the current session/user
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.user) {
        throw new Error("User not authenticated. Please log in again.");
      }

      const user = session.user;

      // Step 2: Validate inputs
      if (!category || !amount) {
        throw new Error("Category and amount are required");
      }

      const numAmount = parseFloat(amount);
      if (isNaN(numAmount) || numAmount <= 0) {
        throw new Error("Amount must be a valid positive number");
      }

      // Step 3: Save transaction to database
      const { data, error } = await supabase.from("transactions").insert([
        {
          user_id: user.id,
          type: type,
          category: category,
          amount: numAmount,
          note: note || null,
          transaction_date: new Date().toISOString(),
        },
      ]);

      if (error) {
        throw new Error(`Failed to save transaction: ${error.message}`);
      }

      console.log(`${type} transaction saved successfully:`, data);
      return { success: true, data };
    } catch (error) {
      console.error("Error saving transaction:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  return { saveTransaction };
};
