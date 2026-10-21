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
/** Sources added in iteration 2 (deeper history, archives). */
const ACCESSED2 = "2026-10-21";

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

  /* Iteration 2 — official history articles */
  { id: "src-mn-sejarah-singkat", title: "Sejarah Singkat Mangkunegaran", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/sejarah-singkat-mangkunegaran-1", published: "2024-08-26", accessed: ACCESSED2, kind: "primary" },
  { id: "src-mn-mn1", title: "Nilai Kepahlawanan K.G.P.A.A. Mangkoenagoro I", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/nilai-kepahlawanan-k-g-p-a-a-mangkoenagoro-i", published: "2024-08-26", accessed: ACCESSED2, kind: "primary" },
  { id: "src-mn-mn9", title: "K.G.P.A.A. Mangkoenagoro IX", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/k-g-p-a-a-mangkoenagoro-ix-1", published: "2024-08-13", accessed: ACCESSED2, kind: "primary" },
  { id: "src-mn-alwustho", title: "Masjid Al Wustho Mangkunegaran", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/masjid-al-wustho-mangkunegaran", published: "2024-08-13", accessed: ACCESSED2, kind: "primary" },

  /* Design-correction pass (2026-10-21) — further official history articles */
  { id: "src-mn-tasikmadu", title: "Manisnya Gula Tasikmadu", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/manisnya-gula-tasikmadu", published: "2024-08-12", accessed: ACCESSED2, kind: "primary" },
  { id: "src-mn-estri", title: "Pasukan Estri Ladrang Mangungkung", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/pasukan-estri-ladrang-mangungkung", published: "2024-08-12", accessed: ACCESSED2, kind: "primary" },
  { id: "src-mn-listrik", title: "Pengadaan Listrik di Wilayah Mangkunegaran", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/pengadaan-listrik-di-wilayah-mangkunegaran", published: "2024-08-12", accessed: ACCESSED2, kind: "primary", note: "Gives Mangkunegara VI's reign as 1896–1911; the official rulers list gives 1896–1916. Not used for reign years." },
  { id: "src-mn-pendidikan", title: "Pendidikan di Mangkunegaran Awal Abad ke-20", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/pendidikan-di-mangkunegaran-awal-abad-ke-20", published: "2024-08-13", accessed: ACCESSED2, kind: "primary" },
  { id: "src-mn-ponten", title: "Ponten Mangkunegaran: Kamar Mandi Umum Peninggalan K.G.P.A.A. Mangkoenagoro VII", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/history/ponten-mangkunegaran-kamar-mandi-umum-peninggalan-k-g-p-a-a-mangkoenagoro-vii", published: "2024-08-13", accessed: ACCESSED2, kind: "primary" },
  { id: "src-mn-colors", title: "mangkunegaran.id home page (stylesheet colours)", publisher: "Pura Mangkunegaran — mangkunegaran.id", url: "https://mangkunegaran.id/", accessed: ACCESSED2, kind: "supporting", note: "Design reference only: the computed colours of the official site (Tailwind 'bush-500' rgb(17 48 27), 'crayola-500' rgb(228 197 136)). Not a brand specification." },

  /* Iteration 2 — scholarship and reference */
  { id: "src-wasino-2005", title: "Mangkunegara IV, Raja-Pengusaha, Pendiri Industri Gula Mangkunegaran (1861–1881)", publisher: "Wasino — Humaniora 17(1), Universitas Gadjah Mada, 2005 (doi:10.22146/jh.825)", url: "https://journal.ugm.ac.id/jurnal-humaniora/article/view/825", published: "2005-01-01", accessed: ACCESSED2, kind: "secondary", note: "Abstract read; full text not reviewed." },
  { id: "src-huda-surakarta", title: "Pengakuan Kembali Surakarta sebagai Daerah Istimewa dalam Perspektif Historis dan Yuridis", publisher: "Ni’matul Huda — Faculty of Law, Universitas Islam Indonesia", url: "https://law.uii.ac.id/wp-content/uploads/2013/12/%27matul-huda.pdf", accessed: ACCESSED2, kind: "secondary" },
  { id: "src-puro-colomadu", title: "Sejarah Pabrik Gula Colomadu: Awal Pembangunan Pabrik Gula Colomadu", publisher: "puromangkunegaran.com (archived copy)", url: "https://web.archive.org/web/20200808114732/https://puromangkunegaran.com/sejarah-pabrik-gula-colomadu-awal-pembangunan-pabrik-gula-colomadu/", accessed: ACCESSED2, kind: "secondary", archived: true },
  { id: "src-detik-giyanti", title: "Isi Perjanjian Giyanti, Cikal Bakal Perpecahan Keraton Jogja dan Solo", publisher: "detikJogja (citing Soedjipto Abimanyu, Kitab Terlengkap Sejarah Mataram)", url: "https://www.detik.com/jogja/budaya/d-8207082/isi-perjanjian-giyanti-cikal-bakal-perpecahan-keraton-jogja-dan-solo", published: "2025-11-12", accessed: ACCESSED2, kind: "secondary" },
  { id: "src-wiki-en-giyanti", title: "Treaty of Giyanti", publisher: "Wikipedia (English)", url: "https://en.wikipedia.org/wiki/Treaty_of_Giyanti", accessed: ACCESSED2, kind: "supporting", note: "Cites Ricklefs (1974), Brown (2003) and the Library of Congress country study." },
  { id: "src-wiki-en-mn8", title: "Mangkunegara VIII", publisher: "Wikipedia (English)", url: "https://en.wikipedia.org/wiki/Mangkunegara_VIII", accessed: ACCESSED2, kind: "supporting" },

  /* Iteration 2 — archival records (Leiden University Libraries, KITLV collection) */
  { id: "src-kitlv-3940", title: "Danseressen uit de kraton Mangkoenegoro te Soerakarta, op de koloniale expositie van de Wereldtentoonstelling van 1889 te Parijs (KITLV 3940)", publisher: "Leiden University Libraries, KITLV collection", url: "http://hdl.handle.net/1887.1/item:790221", published: "1889-01-01", accessed: ACCESSED2, kind: "primary" },
  { id: "src-kitlv-3977", title: "Grote gamelan van Kangjeng Pangeran Aria Gondasiwaja van de kraton Mangkoenegaran te Soerakarta op de Nationale Tentoonstelling in Arnhem (KITLV 3977)", publisher: "Leiden University Libraries, KITLV collection", url: "http://hdl.handle.net/1887.1/item:789455", published: "1879-01-01", accessed: ACCESSED2, kind: "primary" },
  { id: "src-kitlv-37543", title: "Parade van het legioen van de Mangkoe Nagoro in de Istana Mangkoenegoro ter gelegenheid van de verheffing van Mangkoe Nagoro VII tot regerend vorst (KITLV 37543)", publisher: "Leiden University Libraries, KITLV collection", url: "https://hdl.handle.net/1887.1/item:909006", published: "1916-01-01", accessed: ACCESSED2, kind: "primary" },
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
  { id: "f-mn8-reign", claim: "The end of Mangkunegara VIII's reign: 1987 (mangkunegaran.id; English Wikipedia's article on him) vs 1962 (the rulers table in English Wikipedia's Mangkunegaran article).", usedOn: ["history"], sourceIds: ["src-mn-about", "src-wiki-en-mn8", "src-wiki-en-mangkunegaran"], confidence: "disputed", notes: "The weight of evidence favours 1987, the year of his death; the 1962 date is unexplained." },
  { id: "f-mn10", claim: "Mangkunegara X has led Mangkunegaran since 2022.", usedOn: ["history", "home"], sourceIds: ["src-mn-about", "src-wiki-en-mangkunegaran"], confidence: "confirmed" },

  /* 20th century */
  { id: "f-nkri-1945", claim: "Mangkunegara VIII declared Mangkunegaran part of the Republic of Indonesia; a royal decree dated 1 September 1945 formalised it.", usedOn: ["history"], sourceIds: ["src-mn-about", "src-huda-surakarta", "src-wiki-en-mangkunegaran"], confidence: "confirmed" },
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

  /* Design-correction pass — further official history */
  { id: "f-estri", claim: "Raden Mas Said formed a women's troop, Estri Ladrang Mangungkung, first of 60 women trained to ride and to use carbines (karbin wedung) and bows; they escorted him in battles against the VOC and also sang and danced at court events.", usedOn: ["history"], sourceIds: ["src-mn-estri"], confidence: "single-source" },
  { id: "f-tasikmadu", claim: "Mangkunegara IV used profits from Colomadu to build a second sugar mill, Tasikmadu: first stone 11 June 1871, completed 1874; new buildings and machines in 1912 raised output to 99,052 quintals, about double the first decade of the century.", usedOn: ["history"], sourceIds: ["src-mn-tasikmadu"], confidence: "single-source" },
  { id: "f-education", claim: "Mangkunegara VI founded the HIS Siswo school, the girls' school Pawulangan Sisworini and the Studiefonds scholarship; Mangkunegara VII added personal funds to the Studiefonds, created a Comissie van Advies to run it, and worked with Van Deventer on a Van Deventer school in front of the palace.", usedOn: ["history"], sourceIds: ["src-mn-pendidikan"], confidence: "single-source" },
  { id: "f-sem-1901", claim: "On 12 March 1901 Mangkunegara VI and Pakubuwana X initiated the Solosche Electriciteit Maatschappij (SEM), a branch of the Batavia-based ANIEM, which produced and distributed electricity in Surakarta.", usedOn: ["history"], sourceIds: ["src-mn-listrik"], confidence: "single-source" },
  { id: "f-kali-samin", claim: "A hydroelectric plant on the Kali Samin at Tawangmangu, proposed by Mangkunegara VII and agreed between Mangkunegaran (Ir. Sarsito) and SEM, was completed on 7 November 1932 and inaugurated by Gusti Kanjeng Putri Mangkoenagoro VII.", usedOn: ["history"], sourceIds: ["src-mn-listrik"], confidence: "single-source" },
  { id: "f-ponten", claim: "Ponten Mangkunegaran, a roofless public bathhouse at Ngebrusan designed by Thomas Karsten, was built in 1936 under Mangkunegara VII to improve sanitation; it was restored in 2007 and designated a cultural heritage building in 2013.", usedOn: ["history"], sourceIds: ["src-mn-ponten"], confidence: "single-source" },
  { id: "f-color-reference", claim: "The official website's stylesheet uses a deep green rgb(17 48 27) and a sand gold rgb(228 197 136); this site's royal green and antique gold are sampled from them as a design reference.", usedOn: ["about"], sourceIds: ["src-mn-colors"], confidence: "single-source", notes: "Sampled 2026-10-21 from computed styles. Not a claim about an official colour specification." },

  /* Radio */
  { id: "f-srv-founding", claim: "Solosche Radio Vereeniging (SRV) was founded on 1 April 1933 in Surakarta, with Mangkunegara VII's support and R.M. Sarsito Mangoenkoesoemo as chair; it is described as the first radio station run by indigenous people in the Dutch East Indies.", usedOn: ["history", "stories/solosche-radio-vereeniging", "home"], sourceIds: ["src-mn-srv", "src-rri-srv", "src-mn-mn7"], confidence: "confirmed" },
  { id: "f-srv-studio", claim: "SRV's own studio in Kestalan, on land donated by Mangkunegara VII, was begun on 15 September 1935 and opened on 23 September 1936 by Gusti Nurul.", usedOn: ["stories/solosche-radio-vereeniging"], sourceIds: ["src-mn-srv"], confidence: "single-source" },
  { id: "f-srv-1937", claim: "In 1937 SRV broadcast the gamelan accompanying Gusti Nurul's dance at the wedding of Princess Juliana and Prince Bernhard in the Netherlands.", usedOn: ["stories/solosche-radio-vereeniging"], sourceIds: ["src-mn-srv"], confidence: "single-source" },
  { id: "f-srv-1942", claim: "On 2 March 1942 the colonial government ordered SRV's equipment destroyed; under Japanese occupation the station was restarted as Solo Hoso Kyoku.", usedOn: ["stories/solosche-radio-vereeniging", "history"], sourceIds: ["src-mn-srv"], confidence: "single-source" },
  { id: "f-srv-rri", claim: "Radio Republik Indonesia dates its founding to 11 September 1945; RRI Surakarta now occupies the former SRV building.", usedOn: ["stories/solosche-radio-vereeniging"], sourceIds: ["src-mn-srv", "src-rri-srv"], confidence: "confirmed", notes: "The building detail comes from mangkunegaran.id only." },

  /* Visiting (official reservation page) */
  { id: "f-visit-dress", claim: "Visitors may not wear shorts or short skirts, parang or lereng batik, head coverings, sunglasses, velvet or flip-flops, and should dress modestly.", usedOn: ["visit"], sourceIds: ["src-mn-tiket", "src-cnn-2026"], confidence: "confirmed", notes: "CNN Indonesia (March 2026) confirms the parang/lereng and velvet rules." },
  { id: "f-visit-photo", claim: "Professional cameras need permission.", usedOn: ["visit"], sourceIds: ["src-mn-tiket"], confidence: "single-source", notes: "CNN Indonesia also reports a tripod/monopod ban; not shown because the official page does not list it." },
  { id: "f-visit-conduct", claim: "No outside food or drink, weapons or sharp objects, or smoking; do not step on grass or plants; use the bins.", usedOn: ["visit"], sourceIds: ["src-mn-tiket"], confidence: "single-source" },
  { id: "f-visit-tour", claim: "Visits are accompanied by a Mangkunegaran guide (juru cerita); arrive 15 minutes before the session; payment is cashless; children aged 0–4 enter free.", usedOn: ["visit"], sourceIds: ["src-mn-tiket"], confidence: "single-source" },
  { id: "f-visit-hours", claim: "Opening hours differ between sources (09.00–16.00 on the official reservation page; 09.00–14.30 in CNN Indonesia, March 2026).", usedOn: ["visit"], sourceIds: ["src-mn-tiket", "src-cnn-2026"], confidence: "disputed", notes: "Not displayed as a time; the Visit page links to the official page instead." },
  { id: "f-visit-shoes", claim: "Footwear must be removed in certain areas.", usedOn: ["visit"], sourceIds: ["src-cnn-2026"], confidence: "single-source", notes: "Not shown as a pictogram because the official page does not list it." },
  { id: "f-address", claim: "Address: Jl. Ronggowarsito, Keprabon, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57131.", usedOn: ["visit"], sourceIds: ["src-mn-about"], confidence: "confirmed" },
  /* Iteration 2 — deeper history */
  { id: "f-mataram-instability", claim: "Mataram's political stability weakened as the VOC intervened in court affairs; Raden Mas Said rose against the VOC.", usedOn: ["history", "audio"], sourceIds: ["src-mn-sejarah-singkat", "src-mn-mn1"], confidence: "confirmed" },
  { id: "f-rms-birth", claim: "Raden Mas Said was born in Kartasura on 7 April 1725 to Kanjeng Pangeran Arya Mangkoenagoro (Mangkoenagoro Sepuh) and Raden Ayu Wulan; his mother died after his birth and the VOC exiled his father to Sri Lanka.", usedOn: ["history", "audio"], sourceIds: ["src-mn-mn1"], confidence: "single-source" },
  { id: "f-rms-struggle", claim: "Raden Mas Said led a guerrilla resistance that began with a core of forty followers; its motto was Tiji Tibeh (mukti siji mukti kabeh, mati siji mati kabeh).", usedOn: ["history", "audio"], sourceIds: ["src-mn-mn1", "src-mn-sejarah-singkat"], confidence: "confirmed" },
  { id: "f-giyanti", claim: "The Treaty of Giyanti (13 February 1755) divided Mataram between Pakubuwana III in Surakarta and Hamengkubuwana I in Yogyakarta; Raden Mas Said was not a party and fought on.", usedOn: ["history", "audio"], sourceIds: ["src-detik-giyanti", "src-wiki-en-giyanti"], confidence: "confirmed" },
  { id: "f-salatiga-terms", claim: "Under the Salatiga settlement Raden Mas Said became Pangeran Miji, ranking directly after the crown prince, with an entitlement of 4,000 cacah in areas including Kaduang, Nglaroh, Matesih, Wiroko, Haribaya, Honggobayan, Sembuyan, Gunung Kidul, Kedu and parts of Pajang.", usedOn: ["history", "audio"], sourceIds: ["src-mn-sejarah-singkat", "src-mn-about"], confidence: "confirmed" },
  { id: "f-national-hero", claim: "The Indonesian government named Mangkunegara I a National Hero in 1988.", usedOn: ["history", "audio"], sourceIds: ["src-mn-mn1", "src-wiki-id"], confidence: "confirmed", notes: "mangkunegaran.id gives the year but no decree number." },
  { id: "f-colomadu", claim: "Mangkunegara IV founded the Colomadu sugar mill (ground broken 8 December 1861, producing from 1862); with Tasikmadu, the sugar works began as his personal enterprise and later became a praja (state) enterprise.", usedOn: ["history", "audio"], sourceIds: ["src-wasino-2005", "src-puro-colomadu"], confidence: "confirmed", notes: "Some sources not read directly give 1871 for Tasikmadu; the site does not state that year." },
  { id: "f-arnhem-1879", claim: "In 1879 a large gamelan belonging to Kangjeng Pangeran Aria Gondasiwaja of the Mangkunegaran court was shown at the National Exhibition in Arnhem, the Netherlands.", usedOn: ["history"], sourceIds: ["src-kitlv-3977"], confidence: "single-source", notes: "Primary photographic record with catalogue description." },
  { id: "f-paris-1889", claim: "Dancers from the Mangkunegaran court appeared at the colonial exhibition of the 1889 Exposition Universelle in Paris; the catalogue names four of them as Taminah, Sariem, Soekia and Wakiem.", usedOn: ["history", "audio"], sourceIds: ["src-kitlv-3940"], confidence: "single-source", notes: "Primary photographic record with catalogue description." },
  { id: "f-mn7-1916", claim: "In 1916 the Mangkunegaran Legion paraded at the palace for the elevation of Mangkunegara VII to reigning prince.", usedOn: ["history"], sourceIds: ["src-kitlv-37543", "src-mn-about"], confidence: "confirmed" },
  { id: "f-alwustho", claim: "Under Mangkunegara VII the court mosque was modernised to a design by Herman Thomas Karsten; it was renamed Al Wustho in 1949.", usedOn: ["history"], sourceIds: ["src-mn-alwustho"], confidence: "single-source" },
  { id: "f-independence-1945", claim: "On 18 August 1945 Mangkunegara VIII and Pakubuwana XII sent congratulations on Indonesia's independence; on 6 September 1945 they received the Presidential Charter of Position (Piagam Kedudukan) dated 19 August 1945.", usedOn: ["history", "audio"], sourceIds: ["src-huda-surakarta"], confidence: "single-source" },
  { id: "f-pp16-1946", claim: "Government Regulation No. 16/SD of 15 July 1946 made Surakarta a residency directly under the Republic, ending the political authority of the Kasunanan and Mangkunegaran.", usedOn: ["history", "audio"], sourceIds: ["src-huda-surakarta", "src-mn-sejarah-singkat"], confidence: "confirmed" },
  { id: "f-uu10-1950", claim: "Law No. 10 of 1950 placed the Surakarta area in the new province of Central Java; demands for a special status for Surakarta have not been taken up.", usedOn: ["history", "audio"], sourceIds: ["src-huda-surakarta"], confidence: "single-source" },
  { id: "f-revolution-dates", claim: "mangkunegaran.id dates the social revolution in Surakarta both as 1945–1946 (About page) and as 1945–1950 (Sejarah Singkat).", usedOn: ["history"], sourceIds: ["src-mn-about", "src-mn-sejarah-singkat"], confidence: "disputed", notes: "The two pages of the official site differ; the 15 July 1946 regulation is the dated legal turning point." },
  { id: "f-mn9-installed", claim: "Mangkunegara IX succeeded in 1987 and was formally installed on 24 January 1988, the first head of Mangkunegaran installed after Indonesian independence.", usedOn: ["history", "audio"], sourceIds: ["src-mn-mn9", "src-mn-about"], confidence: "confirmed", notes: "The official rulers list dates his reign from 1987; the installation ceremony was in January 1988." },
  { id: "f-mn9-arts", claim: "Mangkunegara IX led Mangkunegaran arts missions to France, England and Japan, created dance works such as Bedhaya Surya Sumirat, and dance is performed every 35 days to mark his birth; he died on 13 August 2021 and was succeeded by his son.", usedOn: ["history", "audio"], sourceIds: ["src-mn-mn9"], confidence: "single-source" },
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
