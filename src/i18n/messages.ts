/**
 * Loads UI strings for route loaders (build-time prerender + .data files).
 * Only the namespaces a route needs are serialised into that page.
 */
import type { Locale, Namespace } from "./config";

export type Messages = { [key: string]: string | Messages };
export type MessageBundle = Partial<Record<Namespace, Messages>>;

const modules = import.meta.glob<{ default: Messages }>("./locales/*/*.json");

export async function loadMessages(locale: Locale, namespaces: readonly Namespace[]): Promise<MessageBundle> {
  const bundle: MessageBundle = {};
  await Promise.all(
    namespaces.map(async (ns) => {
      const load = modules[`./locales/${locale}/${ns}.json`];
      if (!load) throw new Error(`Missing locale file: ${locale}/${ns}.json`);
      bundle[ns] = (await load()).default;
    }),
  );
  return bundle;
}

/** Resolve "ns:path.to.key" (or "path.to.key" in a default namespace). */
export function lookup(bundle: MessageBundle, key: string, defaultNs: Namespace): string | undefined {
  const [ns, path] = key.includes(":") ? (key.split(":", 2) as [Namespace, string]) : [defaultNs, key];
  let node: string | Messages | undefined = bundle[ns];
  for (const part of path.split(".")) {
    if (!node || typeof node === "string") return undefined;
    node = node[part];
  }
  return typeof node === "string" ? node : undefined;
}

export function interpolate(text: string, vars?: Record<string, string | number>): string {
  if (!vars) return text;
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, name: string) => String(vars[name] ?? ""));
}

/** Translator for use inside loaders (e.g. to build page titles). */
export function createT(bundle: MessageBundle, defaultNs: Namespace = "common") {
  return (key: string, vars?: Record<string, string | number>) => {
    const text = lookup(bundle, key, defaultNs);
    if (text === undefined) throw new Error(`Missing i18n key "${key}"`);
    return interpolate(text, vars);
  };
}
