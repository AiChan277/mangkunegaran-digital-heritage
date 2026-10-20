/** Culture page: editorial features on verified topics. */
import { cultureFeatureSchema, parseAll, type CultureFeature } from "./schema";

const RAW: CultureFeature[] = [
  {
    id: "batik",
    aksaraId: "bathik",
    title: { en: "Batik Mangkunegaran", id: "Batik Mangkunegaran" },
    kicker: { en: "Cloth", id: "Kain" },
    summary: {
      en: "Intricate patterns, their own motifs, and rules about who may wear what.",
      id: "Pola yang rumit, motif khas, dan aturan tentang siapa yang boleh mengenakan apa.",
    },
    body: [
      {
        en: "After the settlement of 1757, Surakarta had two courts — the Kasunanan and Mangkunegaran — and each developed its own batik. Mangkunegaran batik is known for complex, finely worked patterns.",
        id: "Setelah kesepakatan 1757, Surakarta memiliki dua istana — Kasunanan dan Mangkunegaran — dan masing-masing mengembangkan batiknya sendiri. Batik Mangkunegaran dikenal dengan pola yang kompleks dan rumit.",
      },
      {
        en: "Motifs created at Mangkunegaran include Buketan Pakis, Sapanti Nata and Wahyu Tumurun; Buketan Paris is credited to Nyai Tumenggung Mardusari.",
        id: "Motif yang lahir di Mangkunegaran antara lain Buketan Pakis, Sapanti Nata, dan Wahyu Tumurun; Buketan Paris dibuat oleh Nyai Tumenggung Mardusari.",
      },
      {
        en: "Inside the palace the parang motif is a larangan, a restricted motif worn only by the core family. Visitors today are asked not to wear parang or lereng batik.",
        id: "Di dalam istana, motif parang adalah motif larangan yang hanya dikenakan keluarga inti. Pengunjung kini diminta tidak mengenakan batik parang atau lereng.",
      },
    ],
    factIds: ["f-batik-style", "f-batik-parang", "f-visit-dress"],
    imageId: "dancers-male",
    imageCaption: { en: "Batik worn in rehearsal at the Pendhapa Ageng.", id: "Batik dikenakan saat latihan di Pendhapa Ageng." },
  },
  {
    id: "bedhaya",
    aksaraId: "bedhaya",
    title: { en: "Bedhaya Bedhah Madiun", id: "Bedhaya Bedhah Madiun" },
    kicker: { en: "Dance", id: "Tari" },
    summary: {
      en: "A court dance by Mangkunegara VII, first performed in 1939.",
      id: "Tari istana karya Mangkunegara VII, pertama kali dipentaskan pada 1939.",
    },
    body: [
      {
        en: "Mangkunegara VII conceived and created Bedhaya Bedhah Madiun. It was first performed in 1939 at the commemoration of his accession, danced by G.R.Ay. Siti Noeroel Kamaril Ngarasati Kusumawardhani and her sisters.",
        id: "Mangkunegara VII menggagas dan menciptakan Bedhaya Bedhah Madiun. Tari ini pertama kali dipentaskan pada 1939 dalam peringatan kenaikan takhtanya, ditarikan G.R.Ay. Siti Noeroel Kamaril Ngarasati Kusumawardhani bersama saudari-saudarinya.",
      },
      {
        en: "Seven to nine women dance the story of Panembahan Senapati and Retna Dumilah of Madiun: sent to fight him, she falls in love with him instead, and they marry.",
        id: "Tujuh hingga sembilan penari perempuan membawakan kisah Panembahan Senapati dan Retna Dumilah dari Madiun: diutus untuk melawannya, ia justru jatuh cinta, lalu keduanya menikah.",
      },
      {
        en: "The dance is still staged: in 2023 it was performed for the 65th anniversary of Indonesia–Japan cooperation.",
        id: "Tari ini masih dipentaskan: pada 2023 ia dibawakan untuk peringatan 65 tahun kerja sama Indonesia–Jepang.",
      },
    ],
    factIds: ["f-bedhah-madiun", "f-bedhah-2023"],
    imageId: "dancers-female",
    imageCaption: { en: "Dancers rehearsing in the Pendhapa Ageng.", id: "Penari berlatih di Pendhapa Ageng." },
  },
  {
    id: "wedhatama",
    aksaraId: "wedhatama",
    title: { en: "Serat Wedhatama", id: "Serat Wedhatama" },
    kicker: { en: "Literature", id: "Sastra" },
    summary: {
      en: "One hundred stanzas of guidance by Mangkunegara IV, written in five sung metres.",
      id: "Seratus bait tuntunan karya Mangkunegara IV dalam lima tembang macapat.",
    },
    body: [
      {
        en: "Serat Wedhatama was composed by Mangkunegara IV. Its title joins wedha, guidance, and tama, excellence. Its themes include restraint of desire, humility about wealth and rank, and continued learning.",
        id: "Serat Wedhatama digubah oleh Mangkunegara IV. Judulnya memadukan wedha, tuntunan, dan tama, utama. Tema-temanya meliputi pengendalian hawa nafsu, kerendahan hati terhadap harta dan pangkat, serta semangat terus belajar.",
      },
      {
        en: "Its hundred stanzas are set in five macapat metres, each with its own melody and mood. The library Mangkunegara IV founded, Rekso Pustoko, still keeps manuscripts in Javanese.",
        id: "Seratus baitnya tersusun dalam lima tembang macapat, masing-masing dengan lagu dan suasananya sendiri. Perpustakaan yang didirikan Mangkunegara IV, Rekso Pustoko, masih menyimpan naskah berbahasa Jawa.",
      },
    ],
    factIds: ["f-wedhatama", "f-rekso-pustoko"],
    figures: [
      { label: "Pangkur", value: 14 },
      { label: "Sinom", value: 18 },
      { label: "Pocung", value: 15 },
      { label: "Gambuh", value: 35 },
      { label: "Kinanthi", value: 18 },
    ],
  },
  {
    id: "gamelan-wayang",
    aksaraId: "gamelan",
    title: { en: "Gamelan and wayang", id: "Gamelan dan wayang" },
    kicker: { en: "Music and theatre", id: "Musik dan teater" },
    summary: {
      en: "Bronze ensembles in the great hall, shadow theatre on the veranda behind it.",
      id: "Ansambel perunggu di balai agung, teater bayangan di beranda di belakangnya.",
    },
    body: [
      {
        en: "Gamelan sets are kept in the Pendhapa Ageng, among them Kyai Kanyut Mesem, and are played on particular occasions. Behind the hall, the Pringgitan is the stage for wayang kulit.",
        id: "Perangkat gamelan disimpan di Pendhapa Ageng, di antaranya Kyai Kanyut Mesem, dan dimainkan pada kesempatan tertentu. Di belakang balai, Pringgitan menjadi panggung wayang kulit.",
      },
      {
        en: "Music also travelled beyond the walls. In 1937 the palace-backed radio station SRV broadcast gamelan to accompany Gusti Nurul's dance at a royal wedding in the Netherlands. In 2024 the palace's own gamelan accompanied a revived panembrama.",
        id: "Musik juga melintasi tembok istana. Pada 1937 stasiun radio SRV yang didukung istana menyiarkan gamelan untuk mengiringi tarian Gusti Nurul di sebuah pernikahan kerajaan di Belanda. Pada 2024 gamelan istana mengiringi panembrama yang dihidupkan kembali.",
      },
    ],
    factIds: ["f-gamelan-pendhapa", "f-pringgitan", "f-srv-1937", "f-panembrama-2024"],
    imageId: "gamelan",
    imageCaption: { en: "Gamelan practice in the Pendhapa Ageng, 2007.", id: "Latihan gamelan di Pendhapa Ageng, 2007." },
  },
];

export const CULTURE = parseAll(cultureFeatureSchema, RAW, "culture");
