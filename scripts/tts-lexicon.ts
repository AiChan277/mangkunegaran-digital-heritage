/**
 * Respellings applied ONLY to the text sent to the synthetic voice.
 *
 * The scripts in content/audio/ and everything shown on the site keep the
 * original spelling. The Edge voices accept no pronunciation markup, so names
 * the voice would misread are respelled in the voice's own orthography.
 * Derived from the pronunciation guide at the end of each script; every entry
 * is a draft until someone listens to the result (and a native Javanese
 * speaker reviews the terms, as the scripts already note).
 *
 * Matching is case-sensitive, on whole words, longest term first.
 */
export const LEXICON: Record<string, Record<string, string>> = {
  // The Indonesian voice reads most Javanese names correctly as written.
  // Only old (Dutch-era) spellings, "dh", and Dutch/Thai names are changed.
  id: {
    Mangkoenagoro: "Mangkunagoro",
    Soekia: "Sukia",
    Sariem: "Sarim",
    Wakiem: "Wakim",
    Pendhapa: "Pendapa",
    pendhapa: "pendapa",
    Wedhatama: "Wedatama",
    Bedhaya: "Bedaya",
    Bedhah: "Bedah",
    Daendels: "Dandels",
    "Solosche Radio Vereeniging": "Solose Radio Fereniging",
    "Pracima Tuin": "Pracima Taun",
    Chulalongkorn: "Culalongkorn",
    Instituut: "Institut",
  },
  // The English voice applies English spelling rules to every name, so most
  // Javanese terms are respelled after the script's pronunciation guide.
  en: {
    "mukti siji mukti kabeh, mati siji mati kabeh": "mooktee seejee mooktee kahbeh, mahtee seejee mahtee kahbeh",
    "Raden Mas Said": "Rahden Mahs Sah-eed",
    "Raden Ayu Wulan": "Rahden Ah-yoo Woolahn",
    "Tiji Tibeh": "Teejee Teebeh",
    "Pangeran Miji": "Pahngeh-ran Meejee",
    "Pendhapa Ageng": "Pendahpa Ahgeng",
    "Dalem Ageng": "Dahlem Ahgeng",
    "wayang kulit": "wah-yahng koolit",
    "Gunung Kidul": "Goonoong Keedool",
    "Rekso Pustoko": "Rekso Poostoko",
    "Serat Wedhatama": "Serraht Wedah-tahma",
    "Bedhaya Bedhah Madiun": "Bedah-ya Bedah Mahdee-oon",
    "Solosche Radio Vereeniging": "Solosuh Radio Fer-ay-nigging",
    "Pracima Tuin": "Prah-cheema Town",
    "Java Instituut": "Java Institoot",
    "Bhinneka Tunggal Ika": "Binneh-kah Toong-gahl Eeka",
    Mangkunegaran: "Mungkoo-neh-gahran",
    Mangkunegara: "Mungkoo-neh-gahra",
    Mangkoenagoro: "Mungkoo-nah-goro",
    Mangkubumi: "Mungkoo-boomee",
    Hamengkubuwana: "Hahmeng-koo-boo-wahna",
    Pakubuwana: "Pahkoo-boo-wahna",
    Sambernyawa: "Sahmber-nyahwa",
    Kasunanan: "Kah-soo-nahnan",
    Sunan: "Soonahn",
    Surakarta: "Soorah-karta",
    Kartasura: "Kartah-soora",
    Yogyakarta: "Jog-jakarta",
    Salatiga: "Sahlah-teega",
    Giyanti: "Gee-yahntee",
    Mataram: "Mahtah-rahm",
    Kanjeng: "Kahnjeng",
    Gusti: "Goostee",
    Adipati: "Ahdee-pahtee",
    Arya: "Ahrya",
    Sepuh: "Seh-pooh",
    cacah: "chah-chah",
    Kaduang: "Kahdoo-ahng",
    Nglaroh: "Nglah-roh",
    Matesih: "Mahteh-see",
    Kedu: "Kehdoo",
    Pajang: "Pahjahng",
    kadipaten: "kahdee-pahten",
    Pura: "Poora",
    kraton: "krahton",
    pamedan: "pah-meh-dahn",
    pendhapa: "pendahpa",
    Wonogiri: "Wonoh-geeree",
    pringgitan: "pring-geetahn",
    Legiun: "Leh-gee-oon",
    Daendels: "Dahndels",
    Colomadu: "Cholo-mahdoo",
    Wasino: "Wah-seeno",
    praja: "prahja",
    Taminah: "Tah-meenah",
    Sariem: "Sah-reem",
    Soekia: "Soo-keeya",
    Wakiem: "Wah-keem",
  },
};

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Text as it should be sent to the voice for `lang`. */
export function respell(text: string, lang: string): string {
  const entries = Object.entries(LEXICON[lang] ?? {}).sort((a, b) => b[0].length - a[0].length);
  if (!entries.length) return text;
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${entries.map(([k]) => escape(k)).join("|")})(?![\\p{L}\\p{N}])`, "gu");
  const map = new Map(entries);
  return text.replace(pattern, (m) => map.get(m)!);
}
