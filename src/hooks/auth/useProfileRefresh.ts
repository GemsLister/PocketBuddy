import { useCallback, useState } from "react";

/**
 * Small helper to trigger refetches from screens that use useProfile.
 */
export const useProfileRefresh = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return { refreshKey, refresh };
};
