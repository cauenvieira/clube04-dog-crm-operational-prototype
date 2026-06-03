import { useEffect, useState, useCallback } from "react";
import { loadLeads, saveLeads, type Lead } from "./mock-data";

let listeners = new Set<() => void>();
let cached: Lead[] | null = null;

function emit() { listeners.forEach((l) => l()); }

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => cached ?? []);

  useEffect(() => {
    if (!cached) {
      cached = loadLeads();
      setLeads(cached);
    } else {
      setLeads(cached);
    }
    const listener = () => setLeads([...(cached ?? [])]);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  const update = useCallback((updater: (prev: Lead[]) => Lead[]) => {
    cached = updater(cached ?? []);
    saveLeads(cached);
    emit();
  }, []);

  return { leads, update };
}
