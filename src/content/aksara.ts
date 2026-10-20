/**
 * Aksara Jawa (Javanese script) titles. Transliterations follow the Latin
 * spelling used on this site and are AI-drafted: every entry stays
 * "awaiting-review" until a native reader (JAVANESE_REVIEWER) approves it.
 * Conjuncts are written as consonant + pangkon + consonant, which fonts
 * render as pasangan.
 */
import { aksaraSchema, parseAll, type Aksara } from "./schema";

const RAW: Aksara[] = [
  { id: "mangkunegaran", latin: "Mangkunegaran", javanese: "ꦩꦁꦏꦸꦤꦼꦒꦫꦤ꧀", status: "awaiting-review" },
  { id: "sejarah", latin: "Sejarah", javanese: "ꦱꦼꦗꦫꦃ", status: "awaiting-review", note: "History" },
  { id: "wewangunan", latin: "Wewangunan", javanese: "ꦮꦼꦮꦔꦸꦤꦤ꧀", status: "awaiting-review", note: "Buildings (Architecture page)" },
  { id: "kabudayan", latin: "Kabudayan", javanese: "ꦏꦧꦸꦢꦪꦤ꧀", status: "awaiting-review", note: "Culture" },
  { id: "cariyos", latin: "Cariyos", javanese: "ꦕꦫꦶꦪꦺꦴꦱ꧀", status: "awaiting-review", note: "Stories (krama)" },
  { id: "galeri", latin: "Galeri", javanese: "ꦒꦭꦺꦫꦶ", status: "awaiting-review", note: "Gallery" },
  { id: "sowan", latin: "Sowan", javanese: "ꦱꦺꦴꦮꦤ꧀", status: "awaiting-review", note: "To visit respectfully (Visit page)" },
  { id: "babagan", latin: "Babagan", javanese: "ꦧꦧꦒꦤ꧀", status: "awaiting-review", note: "About" },
  { id: "pamedan", latin: "Pamedan", javanese: "ꦥꦩꦺꦢꦤ꧀", status: "awaiting-review" },
  { id: "pendhapa-ageng", latin: "Pendhapa Ageng", javanese: "ꦥꦼꦤ꧀ꦝꦥ ꦲꦒꦼꦁ", status: "awaiting-review" },
  { id: "pringgitan", latin: "Pringgitan", javanese: "ꦥꦿꦶꦁꦒꦶꦠꦤ꧀", status: "awaiting-review" },
  { id: "dalem-ageng", latin: "Dalem Ageng", javanese: "ꦢꦊꦩ꧀ ꦲꦒꦼꦁ", status: "awaiting-review" },
  { id: "pracimayasa", latin: "Pracimayasa", javanese: "ꦥꦿꦕꦶꦩꦪꦱ", status: "awaiting-review" },
  { id: "rekso-pustoko", latin: "Rekso Pustoko", javanese: "ꦫꦺꦏ꧀ꦱꦥꦸꦱ꧀ꦠꦏ", status: "awaiting-review", note: "Written in the traditional Reksa Pustaka form, pronounced rekso pustoko" },
  { id: "bathik", latin: "Bathik", javanese: "ꦧꦛꦶꦏ꧀", status: "awaiting-review" },
  { id: "bedhaya", latin: "Bedhaya", javanese: "ꦧꦼꦝꦪ", status: "awaiting-review" },
  { id: "wedhatama", latin: "Wedhatama", javanese: "ꦮꦺꦝꦠꦩ", status: "awaiting-review" },
  { id: "gamelan", latin: "Gamelan", javanese: "ꦒꦩꦼꦭꦤ꧀", status: "awaiting-review" },
];

export const AKSARA = parseAll(aksaraSchema, RAW, "aksara");
export const AKSARA_BY_ID = new Map(AKSARA.map((a) => [a.id, a]));
