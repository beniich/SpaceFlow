import { useState, useEffect, useCallback } from "react";
import { DEMO_TREE, buildIndex } from "../lib/demoData";

export function useBimData(modelId) {
  const [tree, setTree] = useState(null);
  const [elements, setElements] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncStatus, setSyncStatus] = useState("1 min ago");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/bim/${modelId}/tree`, {
        credentials: "include",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const t = data.tree || DEMO_TREE;
      setTree(t);
      setElements(buildIndex(t));
      setSyncStatus("just now");
    } catch {
      setTree(DEMO_TREE);
      setElements(buildIndex(DEMO_TREE));
      setError("Using demo data");
    } finally {
      setLoading(false);
    }
  }, [modelId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { tree, elements, loading, error, syncStatus, refresh: fetchData };
}
