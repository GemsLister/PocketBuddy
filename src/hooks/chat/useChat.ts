import { supabase } from "@/src/lib/supabase";
import { useCallback, useEffect, useRef, useState } from "react";

// ---------- Types ----------
export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  isError?: boolean;
};

type UseChatReturn = {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  sessionId: string | null;
  rateLimitSeconds: number | null;
  sendMessage: (text: string) => Promise<void>;
  clearChat: () => void;
};

// ---------- Helpers ----------
/** Try to extract the retry delay (in seconds) from a 429 error message. */
function parseRetrySeconds(errorMsg: string): number | null {
  // Match patterns like "retry in 34.556254375s" or "retryDelay": "34s"
  const match = errorMsg.match(/retry\s*(?:in|Delay["\s:]*)\s*"?(\d+(?:\.\d+)?)\s*s/i);
  if (match) {
    return Math.ceil(parseFloat(match[1]));
  }
  return null;
}

/** Check if an error message indicates a 429 rate limit. */
function isRateLimitError(errorMsg: string): boolean {
  return (
    errorMsg.includes("429") ||
    errorMsg.includes("RESOURCE_EXHAUSTED") ||
    errorMsg.includes("exceeded your current quota") ||
    errorMsg.includes("rate limit")
  );
}

// ---------- Hook ----------
export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [rateLimitSeconds, setRateLimitSeconds] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ---------- Countdown timer ----------
  useEffect(() => {
    // Clear any existing timer when rateLimitSeconds changes
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (rateLimitSeconds !== null && rateLimitSeconds > 0) {
      timerRef.current = setInterval(() => {
        setRateLimitSeconds((prev) => {
          if (prev === null || prev <= 1) {
            // Timer done — clear everything
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = null;
            setError(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [rateLimitSeconds !== null && rateLimitSeconds > 0]);

  // Load existing session on mount
  useEffect(() => {
    let mounted = true;

    const loadLatestSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.user) {
          if (mounted) setIsLoading(false);
          return;
        }

        // Get the most recent chat session
        const { data: sessions } = await supabase
          .from("chat_sessions")
          .select("id")
          .eq("user_id", session.user.id)
          .order("updated_at", { ascending: false })
          .limit(1);

        if (sessions && sessions.length > 0) {
          const sid = sessions[0].id;
          if (mounted) setSessionId(sid);

          // Load messages for this session
          const { data: msgs } = await supabase
            .from("chat_messages")
            .select("id, role, content, created_at")
            .eq("session_id", sid)
            .neq("role", "system")
            .order("created_at", { ascending: true });

          if (mounted && msgs) {
            setMessages(
              msgs.map((m: any) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                created_at: m.created_at,
              })),
            );
          }
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load chat";
        if (mounted) setError(msg);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadLatestSession();
    return () => {
      mounted = false;
    };
  }, []);

  // Send a message to the Edge Function
  const sendMessage = useCallback(
    async (text: string) => {
      if (isSending || (rateLimitSeconds !== null && rateLimitSeconds > 0))
        return;
      setIsSending(true);
      setError(null);

      // Optimistic update: show user message immediately
      const tempUserMsg: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content: text,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempUserMsg]);

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) throw new Error("Not authenticated");

        const response = await supabase.functions.invoke("chat", {
          body: { message: text, session_id: sessionId },
        });

        if (response.error) {
          throw new Error(response.error.message || "Failed to get response");
        }

        const { reply, session_id: returnedSessionId } = response.data;

        // Update session ID if this was a new session
        if (!sessionId && returnedSessionId) {
          setSessionId(returnedSessionId);
        }

        // Replace temp user message with real data + add assistant reply
        setMessages((prev) => {
          const withoutTemp = prev.filter((m) => m.id !== tempUserMsg.id);
          return [
            ...withoutTemp,
            { ...tempUserMsg, id: `user-${Date.now()}` },
            {
              id: `assistant-${Date.now()}`,
              role: "assistant" as const,
              content: reply,
              created_at: new Date().toISOString(),
            },
          ];
        });
      } catch (e) {
        const rawMsg =
          e instanceof Error ? e.message : "Something went wrong";

        // Check if this is a rate limit error
        if (isRateLimitError(rawMsg)) {
          const retrySec = parseRetrySeconds(rawMsg);
          // Default to 60 seconds if we can't parse the exact time
          setRateLimitSeconds(retrySec ?? 60);
          setError("API quota reached. Please wait for the timer to reset.");
        } else {
          setError(rawMsg);
        }

        // Mark the optimistic message as failed
        setMessages((prev) =>
          prev.map((m) =>
            m.id === tempUserMsg.id ? { ...m, isError: true } : m,
          ),
        );
      } finally {
        setIsSending(false);
      }
    },
    [isSending, sessionId, rateLimitSeconds],
  );

  // Clear chat and start a new session
  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setError(null);
    setRateLimitSeconds(null);
  }, []);

  return {
    messages,
    isLoading,
    isSending,
    error,
    sessionId,
    rateLimitSeconds,
    sendMessage,
    clearChat,
  };
}

