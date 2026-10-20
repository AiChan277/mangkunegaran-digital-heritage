/**
 * Homepage editorial text. Section labels and buttons are UI strings in
 * i18n/locales/<lang>/home.json; the sentences below are editorial content
 * (id + en source, jv AI draft awaiting native review).
 */
import type { Localized } from "./schema";

export type HomeContent = {
  intro: { text: Localized; factIds: string[] }[];
  journeyIntro: Localized;
  arts: { text: Localized; factIds: string[] };
  continuity: { date: Localized; text: Localized; factIds: string[]; imageId?: string }[];
  multilingual: Localized;
};

export const HOME: HomeContent = {
  intro: [
    {
      text: {
        en: "Pura Mangkunegaran is the palace of the house of Mangkunegaran in Surakarta, Central Java. It was founded in 1757 by Raden Mas Said, remembered as Pangeran Sambernyawa, who became the first Mangkunegara.",
        id: "Pura Mangkunegaran adalah istana wangsa Mangkunegaran di Surakarta, Jawa Tengah. Istana ini didirikan pada 1757 oleh Raden Mas Said, yang dikenang sebagai Pangeran Sambernyawa, Mangkunegara yang pertama.",
        jv: "Pura Mangkunegaran punika puranipun trah Mangkunegaran ing Surakarta, Jawi Tengah. Pura punika kaadegaken ing taun 1757 dening Raden Mas Said, ingkang kèngetan minangka Pangeran Sambernyawa, Mangkunegara ingkang kapisan.",
      },
      factIds: ["f-founding-1757"],
    },
    {
      text: {
        en: "Its political sovereignty ended in the revolution of 1945–1946. The house has carried on as a guardian of Javanese culture — of dance, gamelan, batik and literature.",
        id: "Kedaulatan politiknya berakhir dalam revolusi 1945–1946. Wangsa ini terus berperan sebagai penjaga kebudayaan Jawa — tari, gamelan, batik, dan sastra.",
        jv: "Panguwaos politikipun rampung nalika revolusi 1945–1946. Trah punika tetep lumampah minangka pangreksa kabudayan Jawi — beksan, gamelan, bathik, saha sastra.",
      },
      factIds: ["f-social-revolution"],
    },
  ],
  journeyIntro: {
    en: "Like a kraton, the palace unfolds as a sequence: an open field, a great hall, a veranda, and the house at its heart.",
    id: "Seperti keraton, istana ini terbentang sebagai rangkaian: lapangan terbuka, balai agung, beranda, dan rumah di jantungnya.",
    jv: "Kados karaton, pura punika kababar minangka urut-urutan: ara-ara, bangsal ageng, emperan, saha dalem ing tengahipun.",
  },
  arts: {
    text: {
      en: "Court dances composed in the palace are still performed. Bedhaya Bedhah Madiun, created by Mangkunegara VII and first danced in 1939, was staged again in 2023.",
      id: "Tari-tari istana yang diciptakan di sini masih dipentaskan. Bedhaya Bedhah Madiun, karya Mangkunegara VII yang pertama kali ditarikan pada 1939, kembali dipentaskan pada 2023.",
      jv: "Beksan-beksan ingkang kaanggit ing pura taksih dipun pentasaken. Bedhaya Bedhah Madiun, anggitanipun Mangkunegara VII ingkang kapisan dipun beksakaken ing taun 1939, dipun pentasaken malih ing taun 2023.",
    },
    factIds: ["f-bedhah-madiun", "f-bedhah-2023"],
  },
  continuity: [
    {
      date: { en: "21 January 2023", id: "21 Januari 2023", jv: "21 Januari 2023" },
      text: {
        en: "Pracima Tuin, a garden on the western side of the palace, opens to the public.",
        id: "Pracima Tuin, taman di sisi barat istana, dibuka untuk umum.",
        jv: "Pracima Tuin, taman ing sisih kilèn pura, kabikak kangge umum.",
      },
      factIds: ["f-pracima-tuin"],
      imageId: "pracima-tuin",
    },
    {
      date: { en: "2023", id: "2023", jv: "2023" },
      text: {
        en: "Bedhaya Bedhah Madiun is performed for the 65th anniversary of Indonesia–Japan cooperation.",
        id: "Bedhaya Bedhah Madiun dipentaskan untuk 65 tahun kerja sama Indonesia–Jepang.",
        jv: "Bedhaya Bedhah Madiun dipun pentasaken kangge pengetan 65 taun gotong-royong Indonésia–Jepang.",
      },
      factIds: ["f-bedhah-2023"],
    },
    {
      date: { en: "27 April 2024", id: "27 April 2024", jv: "27 April 2024" },
      text: {
        en: "A panembrama first sung for King Chulalongkorn of Siam is revived to open the 267th-anniversary Royal Dinner.",
        id: "Panembrama yang dahulu dilantunkan untuk Raja Chulalongkorn dari Siam dihidupkan kembali untuk membuka Royal Dinner peringatan 267 tahun.",
        jv: "Panembrama ingkang rumiyin kalantunaken kangge Prabu Chulalongkorn saking Siam dipun gesangaken malih kangge mbikak Royal Dinner pengetan 267 taun.",
      },
      factIds: ["f-panembrama-2024", "f-chulalongkorn-1871"],
    },
  ],
  multilingual: {
    en: "In 1871, the palace welcomed a king from Siam with a song. Heritage has always travelled between languages. This site offers twelve: the national language, the language of the heritage itself, and languages spoken by neighbours across Southeast Asia and beyond — so that no one has to leave their own language at the gate.",
    id: "Pada 1871 istana menyambut seorang raja dari Siam dengan tembang. Warisan budaya selalu berkelana di antara bahasa. Situs ini menyediakan dua belas: bahasa nasional, bahasa warisan itu sendiri, dan bahasa para tetangga di Asia Tenggara dan sekitarnya — agar tak seorang pun harus meninggalkan bahasanya di gerbang.",
    jv: "Ing taun 1871 pura mapag satunggaling raja saking Siam kanthi tembang. Warisan kabudayan tansah lelana ing antawisipun basa. Situs punika nyawisaken kalih welas basa: basa nasional, basanipun warisan punika piyambak, saha basanipun para tangga ing Asia Kidul-Wétan lan sakiwa-tengenipun — supados boten wonten tiyang ingkang kedah nilar basanipun ing gapura.",
  },
};

export const HOME_FACT_IDS = [
  "f-founding-1757",
  "f-social-revolution",
  "f-sequence",
  "f-bedhah-madiun",
  "f-bedhah-2023",
  "f-pracima-tuin",
  "f-panembrama-2024",
  "f-chulalongkorn-1871",
  "f-pendhapa-size",
];
