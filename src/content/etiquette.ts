/**
 * Visitor rules shown as pictograms on the Visit page.
 * Only rules listed on the official reservation page are included.
 * Labels are UI strings (visit:rules.<id>) so they exist in all 12 locales.
 */
import { etiquetteSchema, parseAll, type Etiquette } from "./schema";

export const ETIQUETTE_VERIFIED_AT = "2026-10-20";

/** Postal address as published on mangkunegaran.id (fact f-address). */
export const ADDRESS_LINES = ["Jl. Ronggowarsito, Keprabon,", "Kec. Banjarsari, Kota Surakarta,", "Jawa Tengah 57131"];

/** Facts cited directly by the Visit page (hours disagreement, address). */
export const VISIT_FACT_IDS = { hours: "f-visit-hours", address: "f-address" } as const;

const RAW: Etiquette[] = [
  { id: "modest-dress", icon: "modest-dress", group: "dress", factIds: ["f-visit-dress"] },
  { id: "no-shorts", icon: "no-shorts", group: "dress", factIds: ["f-visit-dress"] },
  { id: "no-parang", icon: "no-parang", group: "dress", factIds: ["f-visit-dress", "f-batik-parang"] },
  { id: "no-velvet", icon: "no-velvet", group: "dress", factIds: ["f-visit-dress"] },
  { id: "no-headwear", icon: "no-headwear", group: "dress", factIds: ["f-visit-dress"] },
  { id: "no-sunglasses", icon: "no-sunglasses", group: "dress", factIds: ["f-visit-dress"] },
  { id: "no-flipflops", icon: "no-flipflops", group: "dress", factIds: ["f-visit-dress"] },
  { id: "camera-permission", icon: "camera-permission", group: "photo", factIds: ["f-visit-photo"] },
  { id: "no-food", icon: "no-food", group: "conduct", factIds: ["f-visit-conduct"] },
  { id: "no-smoking", icon: "no-smoking", group: "conduct", factIds: ["f-visit-conduct"] },
  { id: "no-weapons", icon: "no-weapons", group: "conduct", factIds: ["f-visit-conduct"] },
  { id: "keep-off-grass", icon: "keep-off-grass", group: "conduct", factIds: ["f-visit-conduct"] },
  { id: "litter", icon: "litter", group: "conduct", factIds: ["f-visit-conduct"] },
  { id: "guide", icon: "guide", group: "tour", factIds: ["f-visit-tour"] },
  { id: "arrive-early", icon: "arrive-early", group: "tour", factIds: ["f-visit-tour"] },
  { id: "cashless", icon: "cashless", group: "tour", factIds: ["f-visit-tour"] },
  { id: "children-free", icon: "children-free", group: "tour", factIds: ["f-visit-tour"] },
];

export const ETIQUETTE = parseAll(etiquetteSchema, RAW, "etiquette");
export const ETIQUETTE_BY_ID = new Map(ETIQUETTE.map((e) => [e.id, e]));
