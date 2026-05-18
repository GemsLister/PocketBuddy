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

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the current authenticated user
        const {
          data: { user: authUser },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !authUser) {
          setError("User not authenticated");
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch the user's profile from the profiles table
        const { data, error: profileError } = await supabase
          .from("profiles")
          .select("username, email, bio, avatar_url")
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          console.log("Profile fetch error:", profileError);
          setError(profileError.message);
          setUser(null);
        } else if (data) {
          setUser({
            name: data.username,
            email: data.email,
            bio: data.bio ?? "",
            avatarUrl: data.avatar_url ?? undefined,
          });

          setError(null);
        }
      } catch (err) {
        console.log("Error fetching profile:", err);
        setError("Failed to fetch profile");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  return { user, loading, error };
};
