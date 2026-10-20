/**
 * Fact ledger (typed mirror of docs/FACT_LEDGER.md).
 *
 * Every date or historical assertion rendered on the site references a fact
 * id from FACTS. Each fact lists the sources it was checked against.
 * scripts/check-sources.ts fails the build if any id does not resolve.
 *
 * Spelling convention: the institution is written "Mangkunegaran", as on
 * mangkunegaran.id. Ruler titles follow common English usage
 * ("Mangkunegara I…X"); the official site writes "Mangkoenagoro". Variants
 * such as "Mangkunagaran" appear only in source titles.
 */
import { factSchema, parseAll, sourceSchema, type Fact, type Source } from "./schema";

const ACCESSED = "2026-10-20";

const RAW_SOURCES: Source[] = [
  /* Primary: the institution's own sites */
  { id: "src-mn-about", title: "Tentang (About)", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/about-us", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-history", title: "Sejarah (History) — index page", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-srv", title: "Solosche Radio Vereeniging: Cikal Bakal Radio Republik Indonesia", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/solosche-radio-vereeniging-cikal-bakal-radio-republik-indonesia", published: "2024-10-07", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-legiun", title: "Lahirnya Pasukan Elite Legiun Mangkunegaran", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/lahirnya-pasukan-elite-legiun-mangkunegaran", published: "2024-08-14", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-mn7", title: "Peran K.G.P.A.A. Mangkoenagoro VII dalam Mengembangkan Budaya Jawa", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/peran-k-g-p-a-a-mangkoenagoro-vii-dalam-mengembangkan-budaya-jawa", published: "2024-08-15", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-batik", title: "Motif Batik Mangkunegaran", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/cultural-art/motif-batik-mangkunegaran", published: "2024-08-13", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-wedhatama", title: "Serat Wedhatama: Karya Sastra Penuh Filosofi", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/cultural-art/serat-wedhatama-karya-sastra-penuh-filosofi", published: "2024-08-11", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-bedhah-madiun", title: "Beksan Bedhaya Bedhah Madiun", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/cultural-art/beksan-bedhaya-bedhah-madiun", published: "2024-08-12", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-panembrama", title: "Panembrama: Tembang Penghormatan Tamu, Dulu dan Kini", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/cultural-art/panembrama-tembang-penghormatan-tamu-dulu-dan-kini", published: "2024-10-04", accessed: ACCESSED, kind: "primary" },
  { id: "src-mn-tiket", title: "Reservasi / Tiket — visitor terms and dress code", publisher: "Pura Mangkunegaran — mangkunegaran.co.id (linked as “Reservasi” from mangkunegaran.id)", url: "https://mangkunegaran.co.id/tiket/", accessed: ACCESSED, kind: "primary", note: "Page shows no publication date. Rules may change; always check before visiting." },

  /* Secondary and supporting */
  { id: "src-puro-arsitektur", title: "Arsitektur Puro Mangkunegaran", publisher: "puromangkunegaran.com (archived copy)", url: "https://web.archive.org/web/20190414131858/https://puromangkunegaran.com/arsitektur/", published: "2017-04-05", accessed: ACCESSED, kind: "secondary", archived: true },
  { id: "src-surakarta-portal", title: "Pura Mangkunegaran — Portal Informasi Kota Surakarta", publisher: "Pemerintah Kota Surakarta (archived copy)", url: "https://web.archive.org/web/20150717103915/http://www.surakarta.go.id/konten/pura-mangkunegaran-0", accessed: ACCESSED, kind: "supporting", archived: true },
  { id: "src-aroengbinang", title: "Pura Mangkunegaran Solo", publisher: "The Aroengbinang Project (archived copy)", url: "https://web.archive.org/web/20150822232215/http://www.thearoengbinangproject.com/pura-mangkunegaran-solo/", accessed: ACCESSED, kind: "secondary", archived: true },
  { id: "src-rri-srv", title: "Exploring Solosche Radio Vereeniging, Pioneer of Indonesian Radio Broadcasting", publisher: "Radio Republik Indonesia (rri.co.id)", url: "https://rri.co.id/en/national/2304419/exploring-solosche-radio-vereeniging-pioneer-of-indonesian-radio-broadcasting", published: "2026-04-01", accessed: ACCESSED, kind: "secondary" },
  { id: "src-qsmt-rama5", title: "A Royal Fascination Revealed: King Rama V's Visits to Java and his Batik Collection", publisher: "Queen Sirikit Museum of Textiles", url: "https://qsmtthailand.org/research/a-royal-fascination-revealed-king-rama-vs-visits-to-java-and-his-batik-collection/", accessed: ACCESSED, kind: "secondary" },
  { id: "src-gnfi-pracima", title: "Pracima Tuin Mangkunegaran, Ruang Publik Baru di Surakarta yang Kini Sudah Dibuka", publisher: "Good News From Indonesia", url: "https://www.goodnewsfromindonesia.id/2023/01/24/pracima-tuin-mangkunegaran-ruang-publik-baru-di-surakarta-yang-kini-sudah-dibuka", published: "2023-01-24", accessed: ACCESSED, kind: "secondary" },
  { id: "src-cnn-2026", title: "Rekomendasi 8 Destinasi Wisata Seru dan Edukatif saat Mudik di Solo", publisher: "CNN Indonesia", url: "https://www.cnnindonesia.com/gaya-hidup/20260317125957-269-1338981/rekomendasi-8-destinasi-wisata-seru-dan-edukatif-saat-mudik-di-solo/2", published: "2026-03-19", accessed: ACCESSED, kind: "secondary" },
  { id: "src-wiki-id", title: "Pura Mangkunagaran", publisher: "Wikipedia bahasa Indonesia", url: "https://id.wikipedia.org/wiki/Pura_Mangkunagaran", accessed: ACCESSED, kind: "supporting", note: "Used only to corroborate claims that also have a non-Wikipedia source." },
  { id: "src-wiki-en-palace", title: "Mangkunegaran Palace", publisher: "Wikipedia (English)", url: "https://en.wikipedia.org/wiki/Mangkunegaran_Palace", accessed: ACCESSED, kind: "supporting", note: "Used only to corroborate claims that also have a non-Wikipedia source." },
  { id: "src-wiki-en-mangkunegaran", title: "Mangkunegaran", publisher: "Wikipedia (English)", url: "https://en.wikipedia.org/wiki/Mangkunegaran", accessed: ACCESSED, kind: "supporting", note: "Used only to corroborate or to show where sources differ." },
];

const RAW_FACTS: Fact[] = [
  /* Founding */
  { id: "f-founding-1757", claim: "Mangkunegaran was founded in 1757 by Raden Mas Said (Pangeran Sambernyawa), who became Mangkunegara I.", usedOn: ["home", "history"], sourceIds: ["src-mn-about", "src-mn-history", "src-surakarta-portal", "src-wiki-en-mangkunegaran"], confidence: "confirmed" },
  { id: "f-salatiga-date", claim: "The Treaty of Salatiga was signed in March 1757; the exact day differs between sources (17 March vs 13 March).", usedOn: ["history"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran", "src-surakarta-portal"], confidence: "disputed", notes: "mangkunegaran.id and English Wikipedia give 17 March 1757; the 2015 Surakarta city portal gives 13 March." },
  { id: "f-salatiga-parties", claim: "The treaty was agreed between Raden Mas Said and Pakubuwana III, with Hamengkubuwana I and the VOC represented.", usedOn: ["history"], sourceIds: ["src-mn-about", "src-wiki-id"], confidence: "confirmed", notes: "mangkunegaran.id says Patih Danurejo witnessed on behalf of Hamengkubuwana I and the VOC." },
  { id: "f-kadipaten-army", claim: "Mangkunegaran was an autonomous kadipaten entitled to keep its own army.", usedOn: ["history", "stories/legiun-mangkunegaran"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran"], confidence: "confirmed" },
  { id: "f-palace-1757", claim: "Construction of the palace began in 1757 under Mangkunegara I.", usedOn: ["history", "architecture"], sourceIds: ["src-puro-arsitektur", "src-surakarta-portal", "src-wiki-en-palace"], confidence: "confirmed" },

  /* Rulers */
  { id: "f-rulers", claim: "The ten rulers Mangkunegara I–X and their reign years as listed on mangkunegaran.id.", usedOn: ["history"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran"], confidence: "confirmed", notes: "Reign years follow the official list. One difference with Wikipedia is logged in f-mn8-reign." },
  { id: "f-mn8-reign", claim: "The end of Mangkunegara VIII's reign: 1987 (mangkunegaran.id) vs 1962 (English Wikipedia).", usedOn: ["history"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran"], confidence: "disputed" },
  { id: "f-mn10", claim: "Mangkunegara X has led Mangkunegaran since 2022.", usedOn: ["history", "home"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran"], confidence: "confirmed" },

  /* 20th century */
  { id: "f-nkri-1945", claim: "Mangkunegara VIII declared Mangkunegaran part of the Republic of Indonesia; a royal decree dated 1 September 1945 formalised it.", usedOn: ["history"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran"], confidence: "confirmed" },
  { id: "f-social-revolution", claim: "During the social revolution in Surakarta (1945–1946) Mangkunegaran lost its political sovereignty; the house continues as a guardian of culture.", usedOn: ["history", "home"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran"], confidence: "confirmed" },
  { id: "f-mn7-java-instituut", claim: "After the Congress for Javanese Cultural Development (5–7 July 1918), Mangkunegara VII recommended a research institute; the Java Instituut was founded on 4 August 1919.", usedOn: ["history"], sourceIds: ["src-mn-mn7"], confidence: "single-source" },
  { id: "f-mn7-kumudawati", claim: "The Kumudawati ornament is listed among the works of Mangkunegara VII.", usedOn: ["architecture", "gallery"], sourceIds: ["src-mn-mn7"], confidence: "single-source" },

  /* Legion */
  { id: "f-legiun-1808", claim: "The Mangkunegaran force was formally designated the Legiun Mangkunegaran by a decree of Governor-General Daendels dated 29 July 1808, under Mangkunegara II.", usedOn: ["history", "stories/legiun-mangkunegaran"], sourceIds: ["src-mn-legiun"], confidence: "single-source" },
  { id: "f-legiun-training", claim: "Mangkunegara II invited European officers to train the Legion; under Mangkunegara IV training centred on a military school, Soldat Sekul.", usedOn: ["stories/legiun-mangkunegaran"], sourceIds: ["src-mn-legiun"], confidence: "single-source" },
  { id: "f-legiun-origin", claim: "The force had fought under Raden Mas Said before Mangkunegaran was established.", usedOn: ["stories/legiun-mangkunegaran"], sourceIds: ["src-mn-legiun"], confidence: "single-source" },

  /* Architecture */
  { id: "f-sequence", claim: "Like a kraton, the palace has a pamedan, pendhapa, pringgitan, dalem and keputren, enclosed by high walls.", usedOn: ["home", "architecture"], sourceIds: ["src-puro-arsitektur", "src-wiki-en-palace"], confidence: "confirmed" },
  { id: "f-pamedan", claim: "The Pamedan is an open field once used to train Mangkunegaran soldiers; the Kavallerie-Artillerie building stands to its east.", usedOn: ["architecture", "stories/legiun-mangkunegaran"], sourceIds: ["src-puro-arsitektur", "src-wiki-id", "src-wiki-en-palace"], confidence: "confirmed" },
  { id: "f-pendhapa-size", claim: "Pendhapa Ageng: a joglo-roofed hall of about 3,500 m² that can hold roughly five to ten thousand people.", usedOn: ["home", "architecture"], sourceIds: ["src-puro-arsitektur", "src-wiki-en-palace", "src-wiki-id"], confidence: "confirmed" },
  { id: "f-pendhapa-nails", claim: "The Pendhapa Ageng was built without nails.", usedOn: ["architecture"], sourceIds: ["src-puro-arsitektur", "src-wiki-id"], confidence: "confirmed" },
  { id: "f-pendhapa-wood", claim: "Its wooden pillars came from a forest in the Wonogiri hills; sources name different forests.", usedOn: ["architecture"], sourceIds: ["src-puro-arsitektur", "src-wiki-en-palace"], confidence: "disputed", notes: "puromangkunegaran.com: Donoloyo forest; Wikipedia: Kethu forest. The site says only “the Wonogiri hills”." },
  { id: "f-gamelan-pendhapa", claim: "Gamelan sets, including one named Kyai Kanyut Mesem, are kept in the Pendhapa Ageng and played on particular occasions.", usedOn: ["architecture", "culture"], sourceIds: ["src-surakarta-portal", "src-puro-arsitektur", "src-wiki-id"], confidence: "confirmed", notes: "Spelling varies (Kanyut / Kenyut). Sources differ on which occasions, so the site does not list them." },
  { id: "f-pringgitan", claim: "The Pringgitan, an open veranda behind the Pendhapa, is used for wayang kulit performances.", usedOn: ["architecture", "culture"], sourceIds: ["src-puro-arsitektur", "src-surakarta-portal", "src-wiki-en-palace"], confidence: "confirmed" },
  { id: "f-dalem-ageng", claim: "The Dalem Ageng (about 1,000 m²), traditionally the royal bridal chamber, is now a museum.", usedOn: ["architecture"], sourceIds: ["src-aroengbinang", "src-wiki-en-palace", "src-wiki-id"], confidence: "confirmed" },
  { id: "f-dalem-collections", claim: "The museum displays jewellery, weapons, clothing, medals, wayang equipment, coins and portraits of the Mangkunegaran rulers.", usedOn: ["architecture"], sourceIds: ["src-puro-arsitektur", "src-wiki-en-palace"], confidence: "confirmed" },
  { id: "f-pracimayasa", claim: "Pracimayasa (also called Beranda Dalem) is an eight-sided family reception room behind the Dalem Ageng, facing the garden.", usedOn: ["architecture"], sourceIds: ["src-wiki-en-palace", "src-wiki-id", "src-aroengbinang"], confidence: "confirmed", notes: "The eight-sided form is stated by both Wikipedias; the Aroengbinang account confirms the Beranda Dalem." },
  { id: "f-rekso-pustoko", claim: "The Rekso Pustoko library was founded in 1867 under Mangkunegara IV; it holds leather-bound manuscripts, Javanese books, historical photographs and plantation records.", usedOn: ["architecture", "culture"], sourceIds: ["src-aroengbinang", "src-surakarta-portal", "src-wiki-en-palace"], confidence: "confirmed" },
  { id: "f-pracima-tuin", claim: "Pracima Tuin, a garden of about 1,000 m² on the western side of the palace, opened on 21 January 2023 on the site of a former tennis court.", usedOn: ["architecture", "home"], sourceIds: ["src-gnfi-pracima", "src-wiki-id"], confidence: "confirmed" },

  /* Culture */
  { id: "f-batik-style", claim: "Mangkunegaran batik is known for complex patterns; named creations include Buketan Pakis, Sapanti Nata, Wahyu Tumurun and Buketan Paris (by Nyai Tumenggung Mardusari).", usedOn: ["culture"], sourceIds: ["src-mn-batik"], confidence: "single-source" },
  { id: "f-batik-parang", claim: "Inside the palace the parang motif is a restricted (larangan) motif worn only by the core family.", usedOn: ["culture", "visit"], sourceIds: ["src-mn-batik"], confidence: "single-source" },
  { id: "f-bedhah-madiun", claim: "Bedhaya Bedhah Madiun was created by Mangkunegara VII and first performed in 1939, danced by 7–9 women; it tells of Panembahan Senapati and Retna Dumilah.", usedOn: ["culture", "history"], sourceIds: ["src-mn-bedhah-madiun", "src-mn-mn7"], confidence: "confirmed" },
  { id: "f-bedhah-2023", claim: "Bedhaya Bedhah Madiun was staged in 2023 for the 65th anniversary of Indonesia–Japan cooperation.", usedOn: ["home", "culture"], sourceIds: ["src-mn-bedhah-madiun"], confidence: "single-source" },
  { id: "f-wedhatama", claim: "Serat Wedhatama, composed by Mangkunegara IV, has 100 stanzas in five macapat metres: Pangkur 14, Sinom 18, Pocung 15, Gambuh 35, Kinanthi 18.", usedOn: ["culture"], sourceIds: ["src-mn-wedhatama"], confidence: "single-source" },
  { id: "f-panembrama", claim: "Panembrama is a song sung to welcome honoured guests; the custom continues at Mangkunegaran today.", usedOn: ["culture", "stories/panembrama"], sourceIds: ["src-mn-panembrama"], confidence: "single-source" },
  { id: "f-panembrama-2024", claim: "On 27 April 2024 a panembrama opened the Mangkunegaran Royal Dinner at Pracima Tuin, marking the 267th anniversary (Adeging Mangkunegaran); its text was adapted from the panembrama sung for King Chulalongkorn (Rama V) of Siam.", usedOn: ["home", "stories/panembrama"], sourceIds: ["src-mn-panembrama"], confidence: "single-source" },
  { id: "f-chulalongkorn-1871", claim: "King Chulalongkorn of Siam visited Java in 1871, 1896 and 1901; mangkunegaran.id dates his reception at the palace, during the reign of Mangkunegara IV, to 1871.", usedOn: ["history", "stories/panembrama", "home"], sourceIds: ["src-qsmt-rama5", "src-mn-panembrama"], confidence: "confirmed", notes: "QSMT confirms the three Java visits but does not name Mangkunegaran; the 1871 palace reception rests on mangkunegaran.id." },
  { id: "f-chulalongkorn-batik", claim: "More than 300 Javanese batik textiles from King Chulalongkorn's collection are preserved at the Grand Palace in Bangkok.", usedOn: ["stories/panembrama"], sourceIds: ["src-qsmt-rama5"], confidence: "single-source" },

  /* Radio */
  { id: "f-srv-founding", claim: "Solosche Radio Vereeniging (SRV) was founded on 1 April 1933 in Surakarta, with Mangkunegara VII's support and R.M. Sarsito Mangoenkoesoemo as chair; it is described as the first radio station run by indigenous people in the Dutch East Indies.", usedOn: ["history", "stories/solosche-radio-vereeniging", "home"], sourceIds: ["src-mn-srv", "src-rri-srv", "src-mn-mn7"], confidence: "confirmed" },
  { id: "f-srv-studio", claim: "SRV's own studio in Kestalan, on land donated by Mangkunegara VII, was begun on 15 September 1935 and opened on 23 September 1936 by Gusti Nurul.", usedOn: ["stories/solosche-radio-vereeniging"], sourceIds: ["src-mn-srv"], confidence: "single-source" },
  { id: "f-srv-1937", claim: "In 1937 SRV broadcast the gamelan accompanying Gusti Nurul's dance at the wedding of Princess Juliana and Prince Bernhard in the Netherlands.", usedOn: ["stories/solosche-radio-vereeniging"], sourceIds: ["src-mn-srv"], confidence: "single-source" },
  { id: "f-srv-1942", claim: "On 2 March 1942 the colonial government ordered SRV's equipment destroyed; under Japanese occupation the station was restarted as Solo Hoso Kyoku.", usedOn: ["stories/solosche-radio-vereeniging"], sourceIds: ["src-mn-srv"], confidence: "single-source" },
  { id: "f-srv-rri", claim: "Radio Republik Indonesia dates its founding to 11 September 1945; RRI Surakarta now occupies the former SRV building.", usedOn: ["stories/solosche-radio-vereeniging"], sourceIds: ["src-mn-srv", "src-rri-srv"], confidence: "confirmed", notes: "The building detail comes from mangkunegaran.id only." },

  /* Visiting (official reservation page) */
  { id: "f-visit-dress", claim: "Visitors may not wear shorts or short skirts, parang or lereng batik, head coverings, sunglasses, velvet or flip-flops, and should dress modestly.", usedOn: ["visit"], sourceIds: ["src-mn-tiket", "src-cnn-2026"], confidence: "confirmed", notes: "CNN Indonesia (March 2026) confirms the parang/lereng and velvet rules." },
  { id: "f-visit-photo", claim: "Professional cameras need permission.", usedOn: ["visit"], sourceIds: ["src-mn-tiket"], confidence: "single-source", notes: "CNN Indonesia also reports a tripod/monopod ban; not shown because the official page does not list it." },
  { id: "f-visit-conduct", claim: "No outside food or drink, weapons or sharp objects, or smoking; do not step on grass or plants; use the bins.", usedOn: ["visit"], sourceIds: ["src-mn-tiket"], confidence: "single-source" },
  { id: "f-visit-tour", claim: "Visits are accompanied by a Mangkunegaran guide (juru cerita); arrive 15 minutes before the session; payment is cashless; children aged 0–4 enter free.", usedOn: ["visit"], sourceIds: ["src-mn-tiket"], confidence: "single-source" },
  { id: "f-visit-hours", claim: "Opening hours differ between sources (09.00–16.00 on the official reservation page; 09.00–14.30 in CNN Indonesia, March 2026).", usedOn: ["visit"], sourceIds: ["src-mn-tiket", "src-cnn-2026"], confidence: "disputed", notes: "Not displayed as a time; the Visit page links to the official page instead." },
  { id: "f-visit-shoes", claim: "Footwear must be removed in certain areas.", usedOn: ["visit"], sourceIds: ["src-cnn-2026"], confidence: "single-source", notes: "Not shown as a pictogram because the official page does not list it." },
  { id: "f-address", claim: "Address: Jl. Ronggowarsito, Keprabon, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57131.", usedOn: ["visit"], sourceIds: ["src-mn-about"], confidence: "confirmed" },
];

export const SOURCES = parseAll(sourceSchema, RAW_SOURCES, "sources");
export const FACTS = parseAll(factSchema, RAW_FACTS, "facts");

export const SOURCE_BY_ID = new Map(SOURCES.map((s) => [s.id, s]));
export const FACT_BY_ID = new Map(FACTS.map((f) => [f.id, f]));

/** Resolve fact ids to the unique, ordered list of sources behind them. */
export function sourcesForFacts(factIds: readonly string[]): Source[] {
  const seen = new Set<string>();
  const out: Source[] = [];
  for (const fid of factIds) {
    const fact = FACT_BY_ID.get(fid);
    if (!fact) throw new Error(`Unknown fact id: ${fid}`);
    for (const sid of fact.sourceIds) {
      if (seen.has(sid)) continue;
      const src = SOURCE_BY_ID.get(sid);
      if (!src) throw new Error(`Unknown source id: ${sid}`);
      seen.add(sid);
      out.push(src);
    }
  }
  return out;
}
