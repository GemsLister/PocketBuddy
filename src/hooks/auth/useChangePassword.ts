import { supabase } from "@/src/lib/supabase";
import { useState } from "react";

export const useChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Supabase updates password only with the current session/user;
  // it does not accept current password directly, so we rely on re-auth
  // at the UI level if needed.
  const changePassword = async ({ newPassword }: { newPassword: string }) => {
    try {
      setLoading(true);
      setError(null);

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      return { ok: true };
    } catch (e: any) {
      setError(e?.message ?? "Failed to change password");
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, loading, error };
};
