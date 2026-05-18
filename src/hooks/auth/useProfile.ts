import { supabase } from "@/src/lib/supabase";
import { useEffect, useState } from "react";

type UserProfile = {
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
};

export const useProfile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (profileError) throw profileError;

      setUser({
        name: data.username,
        email: data.email,
        avatarUrl: data.avatar_url,
        bio: data.bio,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { user, loading, error, refreshProfile: fetchProfile };
};
