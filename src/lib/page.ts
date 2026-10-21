/**
 * Shared loader logic: locale validation, message loading, content
 * language + fallback state, and numbered source references.
 */
import { data } from "react-router";
import { contentLangFor, contentStatus, isLocale, type ContentLang, type Locale, type Namespace } from "~/i18n/config";
import { createT, loadMessages, type MessageBundle } from "~/i18n/messages";
import { FACT_BY_ID } from "~/content/sources";
import { sources, type SourceView } from "~/content/resolve";

/** Locale from a request URL's first path segment; 404 if it is not one. */
export function requireLocale(request: Request): Locale {
  // Client navigations request "/en/history.data"; strip the suffix first.
  const pathname = new URL(request.url).pathname.replace(/\.data$/, "");
  const first = pathname.split("/").filter(Boolean)[0];
  if (!isLocale(first)) throw data("Not found", { status: 404 });
  return first;
}

export type ContentState = {
  /** Language the editorial content on this page is written in. */
  lang: ContentLang;
  /** True when the visitor's language has no editorial version of this page. */
  fallback: boolean;
  /** True when the content shown is an unreviewed AI draft (e.g. Javanese). */
  draft: boolean;
  /** True when only some fields are translated (AI draft) and the rest falls back. */
  partial: boolean;
};

export function contentState(locale: Locale, page: string): ContentState {
  const lang = contentLangFor(locale, page);
  const status = contentStatus(locale, page);
  return { lang, fallback: status === "missing", draft: status === "ai-draft", partial: status === "partial" };
}

export async function pageSetup(request: Request, page: string, namespaces: Namespace[]) {
  const locale = requireLocale(request);
  const messages: MessageBundle = await loadMessages(locale, ["common", ...namespaces]);
  const t = createT(messages, namespaces[0] ?? "common");
  // Only page namespaces are sent with the page; "common" comes from the layout.
  const pageMessages: MessageBundle = {};
  for (const ns of namespaces) pageMessages[ns] = messages[ns];
  return { locale, t, messages: pageMessages, content: contentState(locale, page) };
}

export type Refs = {
  sources: SourceView[];
  /** fact id → 1-based source numbers on this page */
  byFact: Record<string, number[]>;
};

/** Number the sources behind a page's facts, in order of first use. */
export function buildRefs(factIds: readonly string[]): Refs {
  const unique = [...new Set(factIds)];
  const list = sources(unique);
  const index = new Map(list.map((s, i) => [s.id, i + 1]));
  const byFact: Record<string, number[]> = {};
  for (const fid of unique) {
    const fact = FACT_BY_ID.get(fid);
    if (!fact) throw new Error(`Unknown fact id: ${fid}`);
    byFact[fid] = fact.sourceIds.map((sid) => index.get(sid)).filter((n): n is number => typeof n === "number");
  }
  return { sources: list, byFact };
}
