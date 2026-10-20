import type { ArticleInput as Article } from "../schema";

const shared = {
  id: "legiun-mangkunegaran",
  heroImageId: "legion-archival",
  factIds: ["f-kadipaten-army", "f-legiun-origin", "f-legiun-1808", "f-legiun-training", "f-pamedan"],
  verifiedAt: "2026-10-20",
  related: ["solosche-radio-vereeniging", "panembrama"],
} as const;

export const en: Article = {
  ...shared,
  related: [...shared.related],
  factIds: [...shared.factIds],
  lang: "en",
  translationStatus: "source",
  title: "The Legion of Mangkunegaran",
  dek: "Mangkunegaran was a domain with the right to its own army. Its soldiers trained on the field just inside the palace gate.",
  body: [
    {
      type: "p",
      text: "When Mangkunegaran was founded in 1757 it became an autonomous [[kadipaten]] with the right to keep its own army. That force had roots older than the domain itself: it had fought under Raden Mas Said before Mangkunegaran existed.",
      factIds: ["f-kadipaten-army", "f-legiun-origin"],
    },
    { type: "h2", text: "A name in 1808" },
    {
      type: "p",
      text: "A decree of Governor-General Herman Willem Daendels, dated 29 July 1808, formally designated the force as the Legiun Mangkunegaran. The ruler at the time was Mangkunegara II, who invited European officers — Dutch, French and English — to train the troops.",
      factIds: ["f-legiun-1808", "f-legiun-training"],
    },
    { type: "figure", imageId: "legion-archival", caption: "Officers of the Mangkunegaran army, photographed by Woodbury & Page around 1870.", wide: true },
    {
      type: "p",
      text: "Under Mangkunegara IV, training centred on a military school known as Soldat Sekul. According to mangkunegaran.id, the Legion both protected the domain and served as a source of legitimacy for the ruler.",
      factIds: ["f-legiun-training"],
    },
    { type: "h2", text: "The field inside the gate" },
    {
      type: "p",
      text: "The soldiers drilled on the [[pamedan]], the open field just inside the palace gate. The two-storey Kavallerie-Artillerie building still stands on its eastern side.",
      factIds: ["f-pamedan"],
    },
    { type: "figure", imageId: "pamedan", caption: "The Pamedan, with the Kavallerie-Artillerie building at its edge, 2016." },
  ],
};

export const id: Article = {
  ...shared,
  related: [...shared.related],
  factIds: [...shared.factIds],
  lang: "id",
  translationStatus: "source",
  title: "Legiun Mangkunegaran",
  dek: "Mangkunegaran adalah wilayah yang berhak memiliki tentara sendiri. Para prajuritnya berlatih di lapangan tepat di balik gerbang istana.",
  body: [
    {
      type: "p",
      text: "Ketika berdiri pada 1757, Mangkunegaran menjadi [[kadipaten]] otonom yang berhak memiliki tentara sendiri. Pasukan itu bahkan lebih tua dari wilayahnya: ia telah bertempur di bawah Raden Mas Said sebelum Mangkunegaran ada.",
      factIds: ["f-kadipaten-army", "f-legiun-origin"],
    },
    { type: "h2", text: "Sebuah nama pada 1808" },
    {
      type: "p",
      text: "Surat keputusan Gubernur Jenderal Herman Willem Daendels tertanggal 29 Juli 1808 meresmikan pasukan ini sebagai Legiun Mangkunegaran. Penguasa saat itu, Mangkunegara II, mengundang perwira Eropa — Belanda, Prancis, dan Inggris — untuk melatih para prajurit.",
      factIds: ["f-legiun-1808", "f-legiun-training"],
    },
    { type: "figure", imageId: "legion-archival", caption: "Para perwira tentara Mangkunegaran, difoto Woodbury & Page sekitar 1870.", wide: true },
    {
      type: "p",
      text: "Pada masa Mangkunegara IV, pelatihan berpusat di sekolah militer bernama Soldat Sekul. Menurut mangkunegaran.id, Legiun berfungsi melindungi wilayah sekaligus menjadi sumber legitimasi bagi penguasa.",
      factIds: ["f-legiun-training"],
    },
    { type: "h2", text: "Lapangan di balik gerbang" },
    {
      type: "p",
      text: "Para prajurit berlatih di [[pamedan]], lapangan terbuka tepat di balik gerbang istana. Gedung Kavallerie-Artillerie dua lantai masih berdiri di sisi timurnya.",
      factIds: ["f-pamedan"],
    },
    { type: "figure", imageId: "pamedan", caption: "Pamedan, dengan gedung Kavallerie-Artillerie di tepinya, 2016." },
  ],
};
