import type { ArticleInput as Article } from "../schema";

const shared = {
  id: "solosche-radio-vereeniging",
  heroImageId: "wayang-archival",
  factIds: ["f-srv-founding", "f-srv-studio", "f-srv-1937", "f-srv-1942", "f-srv-rri", "f-mn7-java-instituut"],
  verifiedAt: "2026-10-20",
  related: ["panembrama", "legiun-mangkunegaran"],
} as const;

export const en: Article = {
  ...shared,
  related: [...shared.related],
  factIds: [...shared.factIds],
  lang: "en",
  translationStatus: "source",
  title: "On air from Surakarta",
  dek: "In 1933 a radio society backed by Mangkunegara VII began broadcasting Javanese music and theatre. Its story runs from the palace to the founding of Indonesia's national radio.",
  body: [
    {
      type: "p",
      text: "Solosche Radio Vereeniging — the Solo Radio Society, or SRV — was founded on 1 April 1933 at a meeting in Surakarta chaired by R.M. Sarsito Mangoenkoesoemo. It is described as the first radio station in the Dutch East Indies run by indigenous people, and its programmes centred on Javanese arts.",
      factIds: ["f-srv-founding"],
    },
    {
      type: "p",
      text: "The station grew out of a palace arts circle that played gamelan and klenengan at Mangkunegaran. Mangkunegara VII supplied its first broadcasting equipment. He had already championed Javanese culture in public life: after the 1918 Congress for Javanese Cultural Development he proposed the research institute that became the Java Instituut.",
      factIds: ["f-srv-founding", "f-mn7-java-instituut"],
    },
    { type: "h2", text: "A studio of its own" },
    {
      type: "p",
      text: "Members soon decided that SRV needed its own building. Mangkunegara VII donated land in Kestalan; construction began on 15 September 1935, and the studio was opened on 23 September 1936 by Gusti Nurul.",
      factIds: ["f-srv-studio"],
    },
    {
      type: "p",
      text: "In 1937 SRV broadcast the gamelan that accompanied Gusti Nurul's dance at the wedding of Princess Juliana and Prince Bernhard in the Netherlands — music played in Java, heard by a dancer on the other side of the world.",
      factIds: ["f-srv-1937"],
    },
    { type: "figure", imageId: "wayang-archival", caption: "Wayang performance at the Mangkunegaran court, photographed 1921–1926.", wide: true },
    { type: "h2", text: "War, and a new name" },
    {
      type: "p",
      text: "On 2 March 1942, as Japanese forces approached, the colonial government ordered SRV's equipment destroyed. Some was hidden. Under the occupation the station was restarted as Solo Hoso Kyoku.",
      factIds: ["f-srv-1942"],
    },
    {
      type: "p",
      text: "After independence, Radio Republik Indonesia dated its founding to 11 September 1945. According to mangkunegaran.id, RRI Surakarta today occupies the building SRV once built.",
      factIds: ["f-srv-rri"],
    },
    {
      type: "note",
      text: "Sources describe SRV's link to RRI differently: mangkunegaran.id and RRI call SRV a forerunner of the national radio, while RRI's own founding date is 1945. We report both and do not claim a direct institutional line.",
      factIds: ["f-srv-rri"],
    },
  ],
};

export const id: Article = {
  ...shared,
  related: [...shared.related],
  factIds: [...shared.factIds],
  lang: "id",
  translationStatus: "source",
  title: "Mengudara dari Surakarta",
  dek: "Pada 1933 sebuah perkumpulan radio yang didukung Mangkunegara VII mulai menyiarkan musik dan teater Jawa. Kisahnya membentang dari istana hingga lahirnya radio nasional Indonesia.",
  body: [
    {
      type: "p",
      text: "Solosche Radio Vereeniging — Perkumpulan Radio Solo, atau SRV — didirikan pada 1 April 1933 dalam rapat di Surakarta yang dipimpin R.M. Sarsito Mangoenkoesoemo. SRV disebut sebagai stasiun radio pertama di Hindia Belanda yang dikelola kaum bumiputra, dengan siaran yang berpusat pada seni Jawa.",
      factIds: ["f-srv-founding"],
    },
    {
      type: "p",
      text: "Stasiun ini tumbuh dari perkumpulan seni istana yang memainkan gamelan dan klenengan di Mangkunegaran. Mangkunegara VII menyediakan peralatan siaran pertamanya. Ia memang telah lama memperjuangkan kebudayaan Jawa: setelah Kongres Pengembangan Kebudayaan Jawa 1918, ia mengusulkan lembaga penelitian yang kemudian menjadi Java Instituut.",
      factIds: ["f-srv-founding", "f-mn7-java-instituut"],
    },
    { type: "h2", text: "Studio sendiri" },
    {
      type: "p",
      text: "Para anggota segera memutuskan bahwa SRV membutuhkan gedung sendiri. Mangkunegara VII menyumbangkan tanah di Kestalan; pembangunan dimulai 15 September 1935, dan studio diresmikan pada 23 September 1936 oleh Gusti Nurul.",
      factIds: ["f-srv-studio"],
    },
    {
      type: "p",
      text: "Pada 1937 SRV menyiarkan gamelan yang mengiringi tarian Gusti Nurul pada pernikahan Putri Juliana dan Pangeran Bernhard di Belanda — musik dimainkan di Jawa, didengar seorang penari di belahan dunia lain.",
      factIds: ["f-srv-1937"],
    },
    { type: "figure", imageId: "wayang-archival", caption: "Pertunjukan wayang di lingkungan istana Mangkunegaran, difoto 1921–1926.", wide: true },
    { type: "h2", text: "Perang dan nama baru" },
    {
      type: "p",
      text: "Pada 2 Maret 1942, ketika pasukan Jepang mendekat, pemerintah kolonial memerintahkan peralatan SRV dihancurkan. Sebagian disembunyikan. Pada masa pendudukan, stasiun ini dihidupkan kembali dengan nama Solo Hoso Kyoku.",
      factIds: ["f-srv-1942"],
    },
    {
      type: "p",
      text: "Setelah kemerdekaan, Radio Republik Indonesia menetapkan hari lahirnya pada 11 September 1945. Menurut mangkunegaran.id, RRI Surakarta kini menempati gedung yang dahulu dibangun SRV.",
      factIds: ["f-srv-rri"],
    },
    {
      type: "note",
      text: "Sumber menggambarkan hubungan SRV dengan RRI secara berbeda: mangkunegaran.id dan RRI menyebut SRV sebagai cikal bakal radio nasional, sementara RRI sendiri lahir pada 1945. Kami melaporkan keduanya tanpa mengklaim garis kelembagaan yang langsung.",
      factIds: ["f-srv-rri"],
    },
  ],
};
