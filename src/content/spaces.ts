/**
 * Architectural spaces, in the order a visitor meets them.
 * Site-plan coordinates are schematic: they show the sequence and relative
 * position described in the sources, not measured locations.
 */
import { parseAll, spaceSchema, type SpaceInput } from "./schema";

const RAW: SpaceInput[] = [
  {
    id: "pamedan",
    order: 1,
    name: "Pamedan",
    aksaraId: "pamedan",
    kicker: { en: "The parade ground", id: "Lapangan latihan" },
    summary: {
      en: "An open field just inside the gate, where the soldiers of Mangkunegaran once trained.",
      id: "Lapangan terbuka tepat di balik gerbang, tempat prajurit Mangkunegaran dahulu berlatih.",
    },
    body: [
      {
        en: "Past the main gate the ground opens into the Pamedan, a wide lawn once used to drill the troops of the Mangkunegaran force. The two-storey Kavallerie-Artillerie building stands on its eastern side.",
        id: "Setelah gerbang utama terbentang Pamedan, halaman rumput luas yang dahulu dipakai untuk melatih pasukan Mangkunegaran. Gedung Kavallerie-Artillerie dua lantai berdiri di sisi timurnya.",
      },
    ],
    factIds: ["f-pamedan", "f-sequence"],
    imageId: "pamedan",
    plan: { x: 50, y: 78, factIds: ["f-sequence", "f-pamedan"] },
    etiquetteIds: ["keep-off-grass"],
  },
  {
    id: "pendhapa-ageng",
    order: 2,
    name: "Pendhapa Ageng",
    aksaraId: "pendhapa-ageng",
    kicker: { en: "The great hall", id: "Balai agung" },
    summary: {
      en: "A joglo-roofed hall of about 3,500 m², built without nails, where gamelan and dance are practised.",
      id: "Balai beratap joglo seluas sekitar 3.500 m², dibangun tanpa paku, tempat gamelan dan tari dilatih.",
    },
    body: [
      {
        en: "The Pendhapa Ageng is an open hall under a joglo roof, about 3,500 m² in area and able to hold some five to ten thousand people. It was put together without nails.",
        id: "Pendhapa Ageng adalah balai terbuka beratap joglo seluas sekitar 3.500 m² yang mampu menampung lima hingga sepuluh ribu orang. Bangunan ini didirikan tanpa paku.",
      },
      {
        en: "Its square wooden pillars were cut from a forest in the Wonogiri hills; sources name different forests, so we name only the hills.",
        id: "Tiang-tiang kayunya yang persegi diambil dari hutan di perbukitan Wonogiri; sumber menyebut nama hutan yang berbeda, sehingga kami hanya menyebut perbukitannya.",
      },
      {
        en: "Gamelan sets are kept in the hall, among them one named Kyai Kanyut Mesem, played on particular occasions. A painted ornament known as Kumudawati is listed among the works of Mangkunegara VII.",
        id: "Beberapa perangkat gamelan disimpan di balai ini, di antaranya Kyai Kanyut Mesem, yang dimainkan pada kesempatan tertentu. Ornamen lukis bernama Kumudawati tercatat sebagai salah satu karya Mangkunegara VII.",
      },
    ],
    factIds: ["f-pendhapa-size", "f-pendhapa-nails", "f-pendhapa-wood", "f-gamelan-pendhapa", "f-mn7-kumudawati"],
    imageId: "pendhapa-floor",
    plan: { x: 50, y: 52, factIds: ["f-sequence"] },
    etiquetteIds: ["camera-permission", "guide"],
  },
  {
    id: "pringgitan",
    order: 3,
    name: "Pringgitan",
    aksaraId: "pringgitan",
    kicker: { en: "The veranda of shadows", id: "Beranda wayang" },
    summary: {
      en: "An open veranda behind the Pendhapa, used for wayang kulit performances.",
      id: "Beranda terbuka di belakang Pendhapa, tempat pertunjukan wayang kulit.",
    },
    body: [
      {
        en: "Behind the Pendhapa Ageng lies the Pringgitan, an open veranda where wayang kulit — shadow-puppet theatre — is performed. From here a flight of steps leads up to the Dalem Ageng.",
        id: "Di belakang Pendhapa Ageng terdapat Pringgitan, beranda terbuka tempat wayang kulit dipentaskan. Dari sini anak tangga naik menuju Dalem Ageng.",
      },
    ],
    factIds: ["f-pringgitan", "f-sequence"],
    imageId: "pringgitan",
    plan: { x: 50, y: 36, factIds: ["f-sequence", "f-pringgitan"] },
    etiquetteIds: ["guide"],
  },
  {
    id: "dalem-ageng",
    order: 4,
    name: "Dalem Ageng",
    aksaraId: "dalem-ageng",
    kicker: { en: "The great house", id: "Rumah agung" },
    summary: {
      en: "Once the royal bridal chamber, now a museum of the house's heirlooms and portraits.",
      id: "Dahulu kamar pengantin kerajaan, kini museum pusaka dan potret wangsa.",
    },
    body: [
      {
        en: "The Dalem Ageng, about 1,000 m², was traditionally the royal bridal chamber. Today it is a museum.",
        id: "Dalem Ageng, seluas sekitar 1.000 m², secara tradisional adalah kamar pengantin kerajaan. Kini bangunan ini menjadi museum.",
      },
      {
        en: "Its displays include jewellery, weapons, clothing, medals, wayang equipment, coins, and portraits of the Mangkunegaran rulers.",
        id: "Koleksinya meliputi perhiasan, senjata, pakaian, medali, perlengkapan wayang, uang logam, serta potret para penguasa Mangkunegaran.",
      },
    ],
    factIds: ["f-dalem-ageng", "f-dalem-collections"],
    plan: { x: 50, y: 24, factIds: ["f-sequence", "f-pringgitan"] },
    etiquetteIds: ["camera-permission", "guide"],
  },
  {
    id: "pracimayasa",
    order: 5,
    name: "Pracimayasa",
    aksaraId: "pracimayasa",
    kicker: { en: "The family veranda", id: "Beranda keluarga" },
    summary: {
      en: "An eight-sided reception room behind the Dalem Ageng, facing the garden.",
      id: "Ruang penerimaan bersegi delapan di belakang Dalem Ageng, menghadap taman.",
    },
    body: [
      {
        en: "Behind the Dalem Ageng is the Pracimayasa, also called the Beranda Dalem — an eight-sided room where the family received guests, looking out over a garden.",
        id: "Di belakang Dalem Ageng terdapat Pracimayasa, disebut juga Beranda Dalem — ruangan bersegi delapan tempat keluarga menerima tamu, menghadap ke taman.",
      },
    ],
    factIds: ["f-pracimayasa"],
    imageId: "pracimayasa-garden",
    plan: { x: 50, y: 11, factIds: ["f-pracimayasa"] },
  },
  {
    id: "pracima-tuin",
    order: 6,
    name: "Pracima Tuin",
    kicker: { en: "The western garden", id: "Taman barat" },
    summary: {
      en: "A garden on the western side of the palace, opened in January 2023.",
      id: "Taman di sisi barat istana yang dibuka pada Januari 2023.",
    },
    body: [
      {
        en: "Pracima Tuin — the name points to its place in the west of the complex — opened on 21 January 2023. It covers about 1,000 m² on what was once a tennis court.",
        id: "Pracima Tuin — namanya merujuk letaknya di bagian barat kompleks — dibuka pada 21 Januari 2023. Luasnya sekitar 1.000 m² di bekas lapangan tenis.",
      },
    ],
    factIds: ["f-pracima-tuin"],
    imageId: "pracima-tuin",
    plan: { x: 16, y: 30, factIds: ["f-pracima-tuin"] },
  },
  {
    id: "rekso-pustoko",
    order: 7,
    name: "Rekso Pustoko",
    aksaraId: "rekso-pustoko",
    kicker: { en: "The library", id: "Perpustakaan" },
    summary: {
      en: "The palace library, founded in 1867 under Mangkunegara IV.",
      id: "Perpustakaan istana, didirikan pada 1867 pada masa Mangkunegara IV.",
    },
    body: [
      {
        en: "Rekso Pustoko was founded in 1867 under Mangkunegara IV. It keeps leather-bound manuscripts, books in Javanese, historical photographs and plantation records.",
        id: "Rekso Pustoko didirikan pada 1867 pada masa Mangkunegara IV. Perpustakaan ini menyimpan naskah bersampul kulit, buku berbahasa Jawa, foto bersejarah, dan arsip perkebunan.",
      },
    ],
    factIds: ["f-rekso-pustoko"],
  },
];

export const SPACES = parseAll(spaceSchema, RAW, "spaces");
export const SPACE_BY_ID = new Map(SPACES.map((s) => [s.id, s]));
