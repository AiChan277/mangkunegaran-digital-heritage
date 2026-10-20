/** Short sourced definitions shown as inline term popovers. */
import { glossarySchema, parseAll, type GlossaryEntry } from "./schema";

const RAW: GlossaryEntry[] = [
  {
    id: "kadipaten",
    term: "kadipaten",
    definition: {
      en: "A princely domain ruled by an adipati. Mangkunegaran was an autonomous kadipaten with the right to its own army.",
      id: "Wilayah kepangeranan yang dipimpin seorang adipati. Mangkunegaran adalah kadipaten otonom yang berhak memiliki tentara sendiri.",
      jv: "Wewengkon kapangéranan ingkang dipun pandhegani adipati. Mangkunegaran punika kadipaten ingkang mardika lan kagungan wadyabala piyambak.",
    },
    factIds: ["f-kadipaten-army"],
  },
  {
    id: "pamedan",
    term: "pamedan",
    definition: {
      en: "The open field inside the palace gate, once used to train Mangkunegaran soldiers.",
      id: "Lapangan terbuka di balik gerbang istana, dahulu tempat latihan prajurit Mangkunegaran.",
      jv: "Ara-ara ing salebeting gapura pura, rumiyin papan gladhèn prajurit Mangkunegaran.",
    },
    factIds: ["f-pamedan"],
  },
  {
    id: "pendhapa",
    term: "pendhapa",
    definition: {
      en: "The great open hall at the front of the palace. Mangkunegaran's Pendhapa Ageng covers about 3,500 m².",
      id: "Balai terbuka besar di bagian depan istana. Pendhapa Ageng Mangkunegaran luasnya sekitar 3.500 m².",
      jv: "Bangsal ageng ingkang mengo wonten ing ngajeng pura. Pendhapa Ageng Mangkunegaran jembaripun watawis 3.500 m².",
    },
    factIds: ["f-pendhapa-size", "f-sequence"],
  },
  {
    id: "pringgitan",
    term: "pringgitan",
    definition: {
      en: "The open veranda behind the pendhapa, used for wayang kulit performances.",
      id: "Beranda terbuka di belakang pendhapa, tempat pertunjukan wayang kulit.",
      jv: "Emperan mengo ing wingking pendhapa, papan pagelaran wayang kulit.",
    },
    factIds: ["f-pringgitan"],
  },
  {
    id: "dalem",
    term: "dalem",
    definition: {
      en: "The main house of the palace. The Dalem Ageng was traditionally the royal bridal chamber and is now a museum.",
      id: "Rumah utama istana. Dalem Ageng dahulu kamar pengantin kerajaan dan kini menjadi museum.",
      jv: "Griya ageng ing pura. Dalem Ageng rumiyin senthong penganten dalem, sapunika dados museum.",
    },
    factIds: ["f-dalem-ageng"],
  },
  {
    id: "panembrama",
    term: "panembrama",
    definition: {
      en: "A song sung to welcome honoured guests, usually opening an event.",
      id: "Tembang yang dinyanyikan untuk menyambut tamu kehormatan, biasanya sebagai pembuka acara.",
      jv: "Tembang kangge mapag tamu agung, limrahipun minangka pambuka adicara.",
    },
    factIds: ["f-panembrama"],
  },
];

export const GLOSSARY = parseAll(glossarySchema, RAW, "glossary");
export const GLOSSARY_BY_ID = new Map(GLOSSARY.map((g) => [g.id, g]));
