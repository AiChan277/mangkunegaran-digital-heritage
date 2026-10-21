/**
 * Draft translations of history titles and summaries, keyed by stable entry
 * ids. Indonesian and English are the editorial originals in history.ts.
 */
import { historyTranslationSchema, type HistoryTranslation } from "../schema";
import { ENTRIES, PERIODS } from "../history";
import { jv } from "./jv";
import { ms } from "./ms";
import { th } from "./th";
import { vi } from "./vi";
import { fil } from "./fil";
import { km } from "./km";
import { lo } from "./lo";
import { my } from "./my";
import { tet } from "./tet";
import { es } from "./es";

const ALL = [jv, ms, th, vi, fil, km, lo, my, tet, es];

export const HISTORY_TRANSLATIONS: Record<string, HistoryTranslation> = Object.fromEntries(
  ALL.map((t) => {
    const parsed = historyTranslationSchema.parse(t);
    // Every period and entry must be covered, and nothing extra.
    for (const p of PERIODS) if (!parsed.periods[p.id]) throw new Error(`history ${t.lang}: missing period ${p.id}`);
    for (const e of ENTRIES) if (!parsed.entries[e.id]) throw new Error(`history ${t.lang}: missing entry ${e.id}`);
    for (const id of Object.keys(parsed.entries)) if (!ENTRIES.some((e) => e.id === id)) throw new Error(`history ${t.lang}: unknown entry ${id}`);
    return [t.lang, parsed];
  }),
);
