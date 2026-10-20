/**
 * History page content: eras (narrative), timeline entries and the list of
 * rulers. Javanese (jv) text is an AI draft in krama, awaiting native review.
 */
import { parseAll, rulerSchema, timelineEntrySchema, type Localized, type Ruler, type TimelineEntry } from "./schema";

export type Era = {
  id: string;
  range: string;
  title: Localized;
  paragraphs: Localized[];
  factIds: string[];
  /** Timeline entries (by year) that belong to this era. */
  from: number;
  to: number;
  imageId?: string;
};

export const ERAS: Era[] = [
  {
    id: "founding",
    range: "1757–1866",
    from: 1757,
    to: 1866,
    title: {
      en: "A domain of its own",
      id: "Sebuah wilayah yang berdiri sendiri",
      jv: "Wewengkon ingkang jumeneng piyambak",
    },
    paragraphs: [
      {
        en: "Mangkunegaran begins with a settlement. In 1757 Raden Mas Said — remembered as Pangeran Sambernyawa — came to terms with the Sunan of Surakarta and was invested as the first Mangkunegara. The new [[kadipaten]] kept the right to its own army.",
        id: "Mangkunegaran berawal dari sebuah kesepakatan. Pada 1757 Raden Mas Said — yang dikenang sebagai Pangeran Sambernyawa — mencapai kesepakatan dengan Sunan Surakarta dan dikukuhkan sebagai Mangkunegara pertama. [[kadipaten|Kadipaten]] baru ini berhak memiliki tentaranya sendiri.",
        jv: "Mangkunegaran kawiwitan saking satunggaling prajanjian. Ing taun 1757 Raden Mas Said — ingkang kèngetan kanthi asma Pangeran Sambernyawa — sarujuk kaliyan Sunan Surakarta lan jumeneng Mangkunegara ingkang kapisan. [[kadipaten|Kadipaten]] énggal punika kagungan wewenang ngagem wadyabala piyambak.",
      },
      {
        en: "Mangkunegaran is a separate house from the Kasunanan Surakarta, the Sunan's court in the same city. The two share a Surakarta Javanese world but have their own rulers, palaces and histories.",
        id: "Mangkunegaran adalah wangsa yang terpisah dari Kasunanan Surakarta, keraton Sunan di kota yang sama. Keduanya berbagi dunia Jawa Surakarta, tetapi memiliki penguasa, istana, dan sejarahnya sendiri.",
        jv: "Mangkunegaran punika trah ingkang piyambakan, benten kaliyan Kasunanan Surakarta, kratonipun Sunan ing kitha ingkang sami. Kalihipun sami-sami gesang ing jagad Jawi Surakarta, nanging kagungan pangageng, pura, saha sejarah piyambak-piyambak.",
      },
    ],
    factIds: ["f-founding-1757", "f-kadipaten-army", "f-salatiga-parties"],
    imageId: "pendhapa-archival",
  },
  {
    id: "modern",
    range: "1867–1944",
    from: 1867,
    to: 1944,
    title: {
      en: "Libraries, radio and the stage",
      id: "Perpustakaan, radio, dan panggung",
      jv: "Pustaka, radio, saha panggung",
    },
    paragraphs: [
      {
        en: "From the late nineteenth century the palace became a workshop for Javanese culture in a changing world. Mangkunegara IV founded the Rekso Pustoko library; Mangkunegara VII supported the founding of a Javanese cultural institute, a radio station and new court dances.",
        id: "Sejak akhir abad ke-19 istana menjadi bengkel kebudayaan Jawa di tengah dunia yang berubah. Mangkunegara IV mendirikan perpustakaan Rekso Pustoko; Mangkunegara VII mendukung berdirinya lembaga kebudayaan Jawa, sebuah stasiun radio, dan tari-tarian istana yang baru.",
        jv: "Wiwit pungkasaning abad kaping 19 pura dados papan pangolahing kabudayan Jawi ing satengahing jaman ingkang ewah. Mangkunegara IV ngadegaken pustaka Rekso Pustoko; Mangkunegara VII nyengkuyung madegipun lembaga kabudayan Jawi, stasiun radio, saha beksan énggal.",
      },
    ],
    factIds: ["f-rekso-pustoko", "f-mn7-java-instituut", "f-srv-founding", "f-bedhah-madiun"],
    imageId: "wayang-archival",
  },
  {
    id: "republic",
    range: "1945–today",
    from: 1945,
    to: 2100,
    title: {
      en: "Within the Republic",
      id: "Dalam Republik",
      jv: "Ing salebeting Républik",
    },
    paragraphs: [
      {
        en: "In 1945 Mangkunegara VIII declared Mangkunegaran part of the new Republic of Indonesia. The social revolution that followed in Surakarta ended its political sovereignty; the house has continued as a guardian of Javanese culture.",
        id: "Pada 1945 Mangkunegara VIII menyatakan Mangkunegaran menjadi bagian dari Republik Indonesia yang baru. Revolusi sosial yang kemudian terjadi di Surakarta mengakhiri kedaulatan politiknya; wangsa ini terus berperan sebagai penjaga kebudayaan Jawa.",
        jv: "Ing taun 1945 Mangkunegara VIII ngandika bilih Mangkunegaran dados perangan Républik Indonésia ingkang énggal. Revolusi sosial ingkang lajeng kadadosan ing Surakarta mungkasi panguwaos politikipun; trah punika tetep lumampah minangka pangreksa kabudayan Jawi.",
      },
    ],
    factIds: ["f-nkri-1945", "f-social-revolution", "f-mn10"],
    imageId: "aerial-archival",
  },
];

const RAW_TIMELINE: TimelineEntry[] = [
  {
    id: "salatiga",
    date: { en: "March 1757", id: "Maret 1757", jv: "Maret 1757" },
    year: 1757,
    title: { en: "The Treaty of Salatiga", id: "Perjanjian Salatiga", jv: "Prajanjian Salatiga" },
    text: {
      en: "Raden Mas Said, known as Pangeran Sambernyawa, reaches a settlement with Pakubuwana III, with Hamengkubuwana I and the VOC represented. Mangkunegaran is founded and he becomes Mangkunegara I.",
      id: "Raden Mas Said, yang dikenal sebagai Pangeran Sambernyawa, mencapai kesepakatan dengan Pakubuwana III, dengan Hamengkubuwana I dan VOC turut terwakili. Mangkunegaran berdiri dan ia menjadi Mangkunegara I.",
      jv: "Raden Mas Said, ingkang kawentar kanthi asma Pangeran Sambernyawa, sarujuk kaliyan Pakubuwana III, kanthi wakil saking Hamengkubuwana I saha VOC. Mangkunegaran madeg lan panjenenganipun jumeneng Mangkunegara I.",
    },
    disputed: {
      en: "Sources differ on the day: 17 March (mangkunegaran.id) or 13 March (Surakarta city portal, 2015).",
      id: "Sumber berbeda soal tanggalnya: 17 Maret (mangkunegaran.id) atau 13 Maret (portal Kota Surakarta, 2015).",
      jv: "Sumber-sumber béda bab tanggalipun: 17 Maret (mangkunegaran.id) utawi 13 Maret (portal Kitha Surakarta, 2015).",
    },
    factIds: ["f-salatiga-date", "f-salatiga-parties", "f-founding-1757"],
  },
  {
    id: "palace",
    date: { en: "1757", id: "1757", jv: "1757" },
    year: 1757,
    title: { en: "Building the palace", id: "Membangun istana", jv: "Wiwitipun pura" },
    text: {
      en: "Construction begins under Mangkunegara I, laid out like a kraton: a pamedan, pendhapa, pringgitan, dalem and keputren, enclosed by high walls.",
      id: "Pembangunan dimulai pada masa Mangkunegara I dengan tata ruang seperti keraton: pamedan, pendhapa, pringgitan, dalem, dan keputren, dikelilingi tembok tinggi.",
      jv: "Pambangunan dipun wiwiti ing jaman Mangkunegara I kanthi tata papan kados karaton: pamedan, pendhapa, pringgitan, dalem, saha keputren, dipun ubengi bètèng inggil.",
    },
    factIds: ["f-palace-1757", "f-sequence"],
  },
  {
    id: "legion",
    date: { en: "29 July 1808", id: "29 Juli 1808", jv: "29 Juli 1808" },
    year: 1808,
    title: { en: "The Legion is named", id: "Legiun diresmikan", jv: "Legiun kaparingan nama" },
    text: {
      en: "A decree of Governor-General Daendels formally designates the Mangkunegaran force as the Legiun Mangkunegaran, during the reign of Mangkunegara II.",
      id: "Surat keputusan Gubernur Jenderal Daendels meresmikan pasukan Mangkunegaran sebagai Legiun Mangkunegaran, pada masa Mangkunegara II.",
      jv: "Serat keputusan Gubernur Jendral Daendels ngresmèkaken wadyabala Mangkunegaran minangka Legiun Mangkunegaran, ing jaman Mangkunegara II.",
    },
    factIds: ["f-legiun-1808"],
    imageId: "legion-archival",
  },
  {
    id: "library",
    date: { en: "1867", id: "1867", jv: "1867" },
    year: 1867,
    title: { en: "Rekso Pustoko library", id: "Perpustakaan Rekso Pustoko", jv: "Pustaka Rekso Pustoko" },
    text: {
      en: "Mangkunegara IV founds the palace library. It holds leather-bound manuscripts, Javanese books, historical photographs and plantation records.",
      id: "Mangkunegara IV mendirikan perpustakaan istana. Koleksinya meliputi naskah bersampul kulit, buku berbahasa Jawa, foto bersejarah, dan arsip perkebunan.",
      jv: "Mangkunegara IV ngadegaken pustaka pura. Isinipun naskah kanthi wiwaraning kulit, buku basa Jawi, foto sejarah, saha cathetan perkebunan.",
    },
    factIds: ["f-rekso-pustoko"],
  },
  {
    id: "siam",
    date: { en: "1871", id: "1871", jv: "1871" },
    year: 1871,
    title: { en: "A guest from Siam", id: "Tamu dari Siam", jv: "Tamu saking Siam" },
    text: {
      en: "King Chulalongkorn (Rama V) of Siam visits Java. According to mangkunegaran.id he was received at the palace, in the reign of Mangkunegara IV, with a welcoming panembrama.",
      id: "Raja Chulalongkorn (Rama V) dari Siam berkunjung ke Jawa. Menurut mangkunegaran.id, ia disambut di istana pada masa Mangkunegara IV dengan tembang panembrama.",
      jv: "Prabu Chulalongkorn (Rama V) saking Siam rawuh ing tanah Jawi. Miturut mangkunegaran.id, panjenenganipun dipun tampi ing pura ing jaman Mangkunegara IV kanthi tembang panembrama.",
    },
    factIds: ["f-chulalongkorn-1871", "f-panembrama"],
  },
  {
    id: "java-instituut",
    date: { en: "1918–1919", id: "1918–1919", jv: "1918–1919" },
    year: 1918,
    title: { en: "The Java Instituut", id: "Java Instituut", jv: "Java Instituut" },
    text: {
      en: "After the Congress for Javanese Cultural Development (5–7 July 1918), Mangkunegara VII recommends a research institute. The Java Instituut is founded on 4 August 1919.",
      id: "Setelah Kongres Pengembangan Kebudayaan Jawa (5–7 Juli 1918), Mangkunegara VII mengusulkan lembaga penelitian. Java Instituut berdiri pada 4 Agustus 1919.",
      jv: "Sasampunipun Kongres Pangrembakaning Kabudayan Jawi (5–7 Juli 1918), Mangkunegara VII ngaturaken pamrayogi supados wonten lembaga panaliten. Java Instituut kaadegaken tanggal 4 Agustus 1919.",
    },
    factIds: ["f-mn7-java-instituut"],
  },
  {
    id: "srv",
    date: { en: "1 April 1933", id: "1 April 1933", jv: "1 April 1933" },
    year: 1933,
    title: { en: "Radio from Surakarta", id: "Radio dari Surakarta", jv: "Radio saking Surakarta" },
    text: {
      en: "Solosche Radio Vereeniging is founded with Mangkunegara VII's support — described as the first radio station run by indigenous people in the Dutch East Indies.",
      id: "Solosche Radio Vereeniging berdiri dengan dukungan Mangkunegara VII — disebut sebagai stasiun radio pertama yang dikelola kaum bumiputra di Hindia Belanda.",
      jv: "Solosche Radio Vereeniging kaadegaken kanthi panyengkuyung Mangkunegara VII — kasebat stasiun radio kapisan ingkang dipun kelola tiyang pribumi ing Hindia Walandi.",
    },
    factIds: ["f-srv-founding"],
  },
  {
    id: "bedhah-madiun",
    date: { en: "1939", id: "1939", jv: "1939" },
    year: 1939,
    title: { en: "Bedhaya Bedhah Madiun", id: "Bedhaya Bedhah Madiun", jv: "Bedhaya Bedhah Madiun" },
    text: {
      en: "A court dance created by Mangkunegara VII is performed for the first time.",
      id: "Tari istana ciptaan Mangkunegara VII dipentaskan untuk pertama kalinya.",
      jv: "Beksan anggitanipun Mangkunegara VII kapisan dipun pentasaken.",
    },
    factIds: ["f-bedhah-madiun"],
  },
  {
    id: "republic",
    date: { en: "1 September 1945", id: "1 September 1945", jv: "1 Sèptèmber 1945" },
    year: 1945,
    title: { en: "Joining the Republic", id: "Bergabung dengan Republik", jv: "Manunggal kaliyan Républik" },
    text: {
      en: "Mangkunegara VIII declares Mangkunegaran part of the Republic of Indonesia; a royal decree of 1 September 1945 formalises it.",
      id: "Mangkunegara VIII menyatakan Mangkunegaran bagian dari Republik Indonesia; maklumat tertanggal 1 September 1945 meresmikannya.",
      jv: "Mangkunegara VIII ngandika bilih Mangkunegaran dados perangan Républik Indonésia; dhawuh tanggal 1 Sèptèmber 1945 ngresmèkaken.",
    },
    factIds: ["f-nkri-1945"],
  },
  {
    id: "revolution",
    date: { en: "1945–1946", id: "1945–1946", jv: "1945–1946" },
    year: 1946,
    title: { en: "From sovereignty to stewardship", id: "Dari kedaulatan ke pelestarian", jv: "Saking panguwaos dhateng pangreksa" },
    text: {
      en: "During the social revolution in Surakarta Mangkunegaran loses its political sovereignty. It continues as a guardian of culture.",
      id: "Dalam revolusi sosial di Surakarta, Mangkunegaran kehilangan kedaulatan politiknya. Ia terus berperan sebagai penjaga kebudayaan.",
      jv: "Nalika revolusi sosial ing Surakarta, Mangkunegaran kècalan panguwaos politikipun. Lajeng tetep dados pangreksa kabudayan.",
    },
    factIds: ["f-social-revolution"],
  },
  {
    id: "mn10",
    date: { en: "2022", id: "2022", jv: "2022" },
    year: 2022,
    title: { en: "Mangkunegara X", id: "Mangkunegara X", jv: "Mangkunegara X" },
    text: {
      en: "Mangkunegara X becomes head of the house.",
      id: "Mangkunegara X menjadi pemimpin wangsa.",
      jv: "Mangkunegara X jumeneng pangageng trah.",
    },
    factIds: ["f-mn10"],
  },
  {
    id: "pracima-tuin",
    date: { en: "21 January 2023", id: "21 Januari 2023", jv: "21 Januari 2023" },
    year: 2023,
    title: { en: "Pracima Tuin opens", id: "Pracima Tuin dibuka", jv: "Pracima Tuin kabikak" },
    text: {
      en: "A garden of about 1,000 m² on the western side of the palace opens on the site of a former tennis court.",
      id: "Taman seluas sekitar 1.000 m² di sisi barat istana dibuka di bekas lapangan tenis.",
      jv: "Taman jembaripun watawis 1.000 m² ing sisih kilèn pura kabikak, ing papan ingkang rumiyin lapangan tenis.",
    },
    factIds: ["f-pracima-tuin"],
    imageId: "pracima-tuin",
  },
  {
    id: "panembrama-2024",
    date: { en: "27 April 2024", id: "27 April 2024", jv: "27 April 2024" },
    year: 2024,
    title: { en: "A welcome song returns", id: "Tembang penyambutan kembali", jv: "Tembang pambagya wangsul" },
    text: {
      en: "A panembrama adapted from the one sung for King Chulalongkorn opens the Royal Dinner marking Mangkunegaran's 267th anniversary.",
      id: "Panembrama yang diadaptasi dari tembang untuk Raja Chulalongkorn membuka Royal Dinner peringatan 267 tahun Mangkunegaran.",
      jv: "Panembrama ingkang dipun anggit malih saking tembang kangge Prabu Chulalongkorn mbikak Royal Dinner pengetan adeging Mangkunegaran kaping 267.",
    },
    factIds: ["f-panembrama-2024"],
  },
];

/** Rulers as listed on mangkunegaran.id (Pengageng Mangkunegaran). */
const RAW_RULERS: Ruler[] = [
  { ordinal: "I", name: "K.G.P.A.A. Mangkunegara I", reign: "1757–1795", factIds: ["f-rulers"] },
  { ordinal: "II", name: "K.G.P.A.A. Mangkunegara II", reign: "1796–1835", factIds: ["f-rulers"] },
  { ordinal: "III", name: "K.G.P.A.A. Mangkunegara III", reign: "1835–1853", factIds: ["f-rulers"] },
  { ordinal: "IV", name: "K.G.P.A.A. Mangkunegara IV", reign: "1853–1881", factIds: ["f-rulers"] },
  { ordinal: "V", name: "K.G.P.A.A. Mangkunegara V", reign: "1881–1896", factIds: ["f-rulers"] },
  { ordinal: "VI", name: "K.G.P.A.A. Mangkunegara VI", reign: "1896–1916", factIds: ["f-rulers"] },
  { ordinal: "VII", name: "K.G.P.A.A. Mangkunegara VII", reign: "1916–1944", factIds: ["f-rulers"] },
  {
    ordinal: "VIII",
    name: "K.G.P.A.A. Mangkunegara VIII",
    reign: "1944–1987",
    factIds: ["f-rulers", "f-mn8-reign"],
    disputed: {
      en: "English Wikipedia ends this reign in 1962; the official list gives 1987.",
      id: "Wikipedia bahasa Inggris mengakhiri masa ini pada 1962; daftar resmi menyebut 1987.",
      jv: "Wikipedia basa Inggris mungkasi jaman punika ing taun 1962; pratélan resmi nyebat 1987.",
    },
  },
  { ordinal: "IX", name: "K.G.P.A.A. Mangkunegara IX", reign: "1987–2021", factIds: ["f-rulers"] },
  { ordinal: "X", name: "K.G.P.A.A. Mangkunegara X", reign: "2022–", factIds: ["f-rulers", "f-mn10"] },
];

export const TIMELINE = parseAll(timelineEntrySchema, RAW_TIMELINE, "timeline");
export const RULERS = parseAll(rulerSchema, RAW_RULERS, "rulers");
