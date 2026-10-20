import { useMatches } from "react-router";
import { useMemo } from "react";
import type { Namespace } from "./config";
import { interpolate, lookup, type MessageBundle } from "./messages";

/** Merge the message bundles of every matched route. */
function useBundle(): MessageBundle {
  const matches = useMatches();
  return useMemo(() => {
    const merged: MessageBundle = {};
    for (const m of matches) {
      const data = m.loaderData as { messages?: MessageBundle } | undefined;
      if (data?.messages) Object.assign(merged, data.messages);
    }
    return merged;
  }, [matches]);
}

export type TFunction = (key: string, vars?: Record<string, string | number>) => string;

/**
 * Translate UI strings. Keys may be namespaced ("common:nav.history").
 * A missing key renders the key itself in development so it is easy to spot;
 * scripts/check-i18n.ts makes sure no shipped locale has missing keys.
 */
export function useT(defaultNs: Namespace = "common"): TFunction {
  const bundle = useBundle();
  return useMemo<TFunction>(
    () => (key, vars) => {
      const text = lookup(bundle, key, defaultNs);
      if (text === undefined) {
        if (import.meta.env.DEV) console.warn(`[i18n] missing key ${key}`);
        return key;
      }
      return interpolate(text, vars);
    },
    [bundle, defaultNs],
  );
}
