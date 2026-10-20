import type { ArticleInput as Article } from "../schema";

const shared = {
  id: "panembrama",
  heroImageId: "gamelan-archival",
  factIds: ["f-panembrama", "f-panembrama-2024", "f-chulalongkorn-1871", "f-chulalongkorn-batik", "f-pracima-tuin"],
  verifiedAt: "2026-10-20",
  related: ["solosche-radio-vereeniging", "legiun-mangkunegaran"],
} as const;

export const en: Article = {
  ...shared,
  related: [...shared.related],
  factIds: [...shared.factIds],
  lang: "en",
  translationStatus: "source",
  title: "A song for a guest from Siam",
  dek: "The panembrama is how the palace welcomes honoured guests. One sung for the King of Siam in the nineteenth century was brought back to life in 2024.",
  body: [
    {
      type: "p",
      text: "A [[panembrama]] is a song sung to welcome guests of honour, usually as the opening of an event. At Mangkunegaran the custom continues today.",
      factIds: ["f-panembrama"],
    },
    { type: "h2", text: "1871: a king in Java" },
    {
      type: "p",
      text: "King Chulalongkorn — Rama V of Siam — travelled to Java three times, in 1871, 1896 and 1901. According to mangkunegaran.id, he was received at the palace in 1871, during the reign of Mangkunegara IV, and a panembrama was composed for the occasion.",
      factIds: ["f-chulalongkorn-1871"],
    },
    {
      type: "p",
      text: "The visits left traces in Bangkok too. More than 300 Javanese batik cloths from the king's collection are preserved in the treasury of the Grand Palace.",
      factIds: ["f-chulalongkorn-batik"],
    },
    { type: "figure", imageId: "gamelan-archival", caption: "Singers with a gamelan ensemble at the Mangkunegaran court, photographed between 1870 and 1892.", wide: true },
    { type: "h2", text: "2024: the song returns" },
    {
      type: "p",
      text: "On 27 April 2024 a panembrama opened the Mangkunegaran Royal Dinner at Pracima Tuin, held for the 267th anniversary of the house. Its text came from the panembrama sung for King Chulalongkorn. It was transliterated, translated and adapted for the present day, then performed with the palace gamelan, with guests from several countries — Thailand among them — in attendance.",
      factIds: ["f-panembrama-2024", "f-pracima-tuin"],
    },
    {
      type: "note",
      text: "The Queen Sirikit Museum of Textiles confirms the king's three journeys to Java but does not name Mangkunegaran; the 1871 reception at the palace is reported by mangkunegaran.id.",
      factIds: ["f-chulalongkorn-1871"],
    },
  ],
};

export const id: Article = {
  ...shared,
  related: [...shared.related],
  factIds: [...shared.factIds],
  lang: "id",
  translationStatus: "source",
  title: "Tembang untuk tamu dari Siam",
  dek: "Panembrama adalah cara istana menyambut tamu kehormatan. Satu panembrama yang dilantunkan untuk Raja Siam pada abad ke-19 dihidupkan kembali pada 2024.",
  body: [
    {
      type: "p",
      text: "[[panembrama|Panembrama]] adalah tembang untuk menyambut tamu kehormatan, biasanya sebagai pembuka acara. Di Mangkunegaran tradisi ini masih berlangsung hingga kini.",
      factIds: ["f-panembrama"],
    },
    { type: "h2", text: "1871: seorang raja di Jawa" },
    {
      type: "p",
      text: "Raja Chulalongkorn — Rama V dari Siam — tiga kali berkunjung ke Jawa, pada 1871, 1896, dan 1901. Menurut mangkunegaran.id, ia disambut di istana pada 1871, pada masa Mangkunegara IV, dan sebuah panembrama digubah untuk kesempatan itu.",
      factIds: ["f-chulalongkorn-1871"],
    },
    {
      type: "p",
      text: "Kunjungan itu juga meninggalkan jejak di Bangkok. Lebih dari 300 kain batik Jawa koleksi sang raja tersimpan di perbendaharaan Grand Palace.",
      factIds: ["f-chulalongkorn-batik"],
    },
    { type: "figure", imageId: "gamelan-archival", caption: "Para pesindhèn bersama ansambel gamelan di istana Mangkunegaran, difoto antara 1870 dan 1892.", wide: true },
    { type: "h2", text: "2024: tembang itu kembali" },
    {
      type: "p",
      text: "Pada 27 April 2024 panembrama membuka Mangkunegaran Royal Dinner di Pracima Tuin, yang digelar untuk memperingati 267 tahun Mangkunegaran. Teksnya berasal dari panembrama untuk Raja Chulalongkorn — dialihaksarakan, dialihbahasakan, dan disesuaikan dengan masa kini — lalu dibawakan bersama gamelan istana, disaksikan tamu dari berbagai negara, termasuk Thailand.",
      factIds: ["f-panembrama-2024", "f-pracima-tuin"],
    },
    {
      type: "note",
      text: "Queen Sirikit Museum of Textiles mengonfirmasi tiga perjalanan sang raja ke Jawa, tetapi tidak menyebut Mangkunegaran; penyambutan di istana pada 1871 bersumber dari mangkunegaran.id.",
      factIds: ["f-chulalongkorn-1871"],
    },
  ],
};
