/**
 * History content (iteration 2): periods, timeline entries and rulers.
 *
 * Every entry has a stable id shared by all languages. Indonesian and English
 * are complete editorial texts; Javanese and the Tier 3 languages carry
 * draft translations of titles and summaries in history-translations/,
 * and fall back (visibly) for the extended text.
 *
 * Every claim cites fact ids from sources.ts. Where sources disagree the
 * entry says so in `uncertainty`.
 */
import {
  historyEntrySchema,
  historyPeriodSchema,
  parseAll,
  rulerSchema,
  type HistoryEntryInput,
  type HistoryPeriodInput,
  type Ruler,
} from "./schema";

const RAW_PERIODS: HistoryPeriodInput[] = [
  {
    id: "foundation",
    leadArchiveId: "arc-pendopo-1890",
    numeral: "I",
    range: "1725–1795",
    from: 1725,
    to: 1795,
    title: { en: "A domain born of war", id: "Wilayah yang lahir dari perang", jv: "Wewengkon ingkang lair saking perang" },
    intro: [
      {
        en: "In the mid-eighteenth century the Javanese kingdom of Mataram was divided against itself, and the Dutch East India Company (VOC) had become a power inside its court. Mangkunegaran was born from that crisis — not as a gift, but as the settlement that ended the long resistance of Raden Mas Said.",
        id: "Pada pertengahan abad ke-18 kerajaan Jawa Mataram terpecah dari dalam, dan Kongsi Dagang Hindia Timur Belanda (VOC) telah menjadi kekuatan di dalam istananya. Mangkunegaran lahir dari krisis itu — bukan sebagai hadiah, melainkan sebagai kesepakatan yang mengakhiri perlawanan panjang Raden Mas Said.",
        jv: "Ing tengahing abad kaping 18 karajan Mataram pecah saking salebeting piyambak, saha VOC sampun dados panguwaos ing salebeting kratonipun. Mangkunegaran lair saking prakawis punika — sanès minangka pisungsung, nanging minangka prajanjian ingkang mungkasi perlawananipun Raden Mas Said ingkang dangu.",
      },
      {
        en: "Mangkunegaran was, and remained, a separate house from the Kasunanan Surakarta, the Sunan's court in the same city. The two shared a Surakarta Javanese world but had their own rulers, palaces and histories.",
        id: "Mangkunegaran sejak awal adalah wangsa yang terpisah dari Kasunanan Surakarta, keraton Sunan di kota yang sama. Keduanya berbagi dunia Jawa Surakarta, tetapi memiliki penguasa, istana, dan sejarahnya sendiri.",
        jv: "Mangkunegaran wiwit wiwitan punika trah ingkang piyambakan, benten kaliyan Kasunanan Surakarta, kratonipun Sunan ing kitha ingkang sami. Kalihipun gesang ing jagad Jawi Surakarta, nanging kagungan pangageng, pura, saha sejarah piyambak-piyambak.",
      },
    ],
    factIds: ["f-mataram-instability", "f-founding-1757"],
  },
  {
    id: "court",
    leadArchiveId: "arc-palace-1902",
    numeral: "II",
    range: "1796–1915",
    from: 1796,
    to: 1915,
    title: { en: "Court, colony and enterprise", id: "Istana, kolonialisme, dan usaha", jv: "Pura, jaman kolonial, saha pakaryan" },
    intro: [
      {
        en: "Through the nineteenth century Mangkunegaran operated inside the colonial order of the Dutch East Indies. Its rulers kept an army that the colonial government formally recognised, built a palace library, and under Mangkunegara IV turned to sugar and coffee — an enterprise that made the house economically significant.",
        id: "Sepanjang abad ke-19 Mangkunegaran berjalan di dalam tatanan kolonial Hindia Belanda. Para penguasanya memelihara tentara yang diakui resmi oleh pemerintah kolonial, membangun perpustakaan istana, dan pada masa Mangkunegara IV beralih ke gula dan kopi — usaha yang menjadikan wangsa ini penting secara ekonomi.",
        jv: "Sadangunipun abad kaping 19 Mangkunegaran lumampah ing salebeting tatanan kolonial Hindia Walandi. Para pangagengipun ngrimat wadyabala ingkang dipun akeni resmi dening pamarentah kolonial, ngadegaken pustaka pura, saha ing jaman Mangkunegara IV ngolah gendhis saha kopi.",
      },
      {
        en: "This was also when Mangkunegaran arts began to travel: photographs record its gamelan in the Netherlands in 1879 and its dancers in Paris in 1889.",
        id: "Pada masa ini pula seni Mangkunegaran mulai berkelana: foto-foto merekam gamelannya di Belanda pada 1879 dan para penarinya di Paris pada 1889.",
      },
    ],
    factIds: ["f-legiun-1808", "f-colomadu", "f-arnhem-1879", "f-paris-1889"],
    sideNote: {
      en: "“Colonial” is not a backdrop here: the Legion's charter came from a Governor-General, and the sugar mills answered the spread of Western private plantations.",
      id: "“Kolonial” bukan sekadar latar: piagam Legiun berasal dari seorang Gubernur Jenderal, dan pabrik gula lahir sebagai jawaban atas meluasnya perkebunan swasta Barat.",
    },
  },
  {
    id: "modern",
    leadArchiveId: "arc-entrance-postcard",
    numeral: "III",
    range: "1916–1944",
    from: 1916,
    to: 1944,
    title: { en: "Culture as modern project", id: "Budaya sebagai proyek modern", jv: "Kabudayan minangka pakaryan modern" },
    intro: [
      {
        en: "Mangkunegara VII, who reigned from 1916 to 1944, treated Javanese culture as something to study, broadcast and renew. His court supported a cultural institute, Indonesia's first indigenous-run radio society, new court dances and a remodelled mosque.",
        id: "Mangkunegara VII, yang bertakhta 1916–1944, memperlakukan kebudayaan Jawa sebagai sesuatu yang perlu diteliti, disiarkan, dan diperbarui. Istananya mendukung lembaga kebudayaan, perkumpulan radio pertama yang dikelola bumiputra, tari-tarian istana baru, dan masjid yang dirombak.",
        jv: "Mangkunegara VII, ingkang jumeneng 1916–1944, nganggep kabudayan Jawi minangka bab ingkang prelu dipun tliti, dipun siaraken, saha dipun énggalaken.",
      },
    ],
    factIds: ["f-mn7-1916", "f-mn7-java-instituut", "f-srv-founding", "f-alwustho"],
  },
  {
    id: "republic",
    numeral: "IV",
    range: "1945–today",
    from: 1945,
    to: 2100,
    title: { en: "Within the Republic", id: "Di dalam Republik", jv: "Ing salebeting Républik" },
    intro: [
      {
        en: "Independence changed what Mangkunegaran was. Within a year of supporting the new Republic it lost its political authority, and by 1950 its former territory lay inside the province of Central Java. What continued was the house itself: its palace, its arts and its role as a guardian of culture.",
        id: "Kemerdekaan mengubah hakikat Mangkunegaran. Kurang dari setahun setelah mendukung Republik yang baru, ia kehilangan kewenangan politiknya, dan pada 1950 bekas wilayahnya masuk ke dalam Provinsi Jawa Tengah. Yang berlanjut adalah wangsa itu sendiri: istananya, seninya, dan perannya sebagai penjaga kebudayaan.",
        jv: "Kamardikan ngewahi kawontenanipun Mangkunegaran. Boten ngantos setaun sasampunipun nyengkuyung Républik énggal, Mangkunegaran kècalan panguwaos politikipun, saha ing taun 1950 tilas wewengkonipun mlebet Propinsi Jawi Tengah. Ingkang lajeng lumampah inggih trah punika piyambak: puranipun, kagunanipun, saha jejibahanipun minangka pangreksa kabudayan.",
      },
    ],
    factIds: ["f-independence-1945", "f-pp16-1946", "f-uu10-1950", "f-social-revolution"],
  },
];

const RAW_ENTRIES: HistoryEntryInput[] = [
  /* ── I · Foundation ─────────────────────────────────────────────────── */
  {
    id: "rms-birth",
    periodId: "foundation",
    year: 1725,
    date: { en: "7 April 1725", id: "7 April 1725" },
    title: { en: "Raden Mas Said is born", id: "Lahirnya Raden Mas Said" },
    summary: {
      en: "The future founder of Mangkunegaran is born in Kartasura, the court capital of Mataram.",
      id: "Pendiri Mangkunegaran kelak lahir di Kartasura, ibu kota istana Mataram.",
    },
    details: {
      happened: {
        en: "According to mangkunegaran.id, Raden Mas Said was born in Kartasura to Kanjeng Pangeran Arya Mangkoenagoro — known as Mangkoenagoro Sepuh — and Raden Ayu Wulan. His mother died after his birth, and the VOC exiled his father to Sri Lanka, so he grew up without either parent at court.",
        id: "Menurut mangkunegaran.id, Raden Mas Said lahir di Kartasura dari pasangan Kanjeng Pangeran Arya Mangkoenagoro — dikenal sebagai Mangkoenagoro Sepuh — dan Raden Ayu Wulan. Ibunya wafat setelah melahirkannya, dan VOC membuang ayahnya ke Sri Lanka, sehingga ia tumbuh tanpa kedua orang tuanya di istana.",
      },
      significance: {
        en: "His father's exile by the VOC is part of the background to his later resistance against the Company.",
        id: "Pembuangan ayahnya oleh VOC menjadi bagian dari latar perlawanannya kelak terhadap Kompeni.",
      },
      uncertainty: {
        en: "These biographical details come from a single source, the official site; we have not found an independent account to cross-check them.",
        id: "Rincian biografis ini berasal dari satu sumber, situs resmi; kami belum menemukan catatan independen untuk memeriksanya.",
      },
    },
    people: ["Raden Mas Said", "K.P.A. Mangkoenagoro (Mangkoenagoro Sepuh)", "Raden Ayu Wulan"],
    factIds: ["f-rms-birth"],
  },
  {
    id: "resistance",
    periodId: "foundation",
    year: 1740,
    date: { en: "1740s–1757", id: "1740-an–1757" },
    precision: "range",
    title: { en: "The long resistance", id: "Perlawanan panjang" },
    summary: {
      en: "As the VOC's influence over Mataram grows, Raden Mas Said takes up arms — remembered as Pangeran Sambernyawa.",
      id: "Ketika pengaruh VOC atas Mataram menguat, Raden Mas Said mengangkat senjata — dikenang sebagai Pangeran Sambernyawa.",
    },
    details: {
      context: {
        en: "The official history describes Mataram's political and social stability weakening as the VOC intervened in the affairs of the court.",
        id: "Sejarah resmi menggambarkan stabilitas politik dan sosial Mataram melemah ketika VOC mencampuri urusan istana.",
      },
      happened: {
        en: "Raden Mas Said began his resistance with a core of forty loyal followers and fought a guerrilla war. Its motto, Tiji Tibeh — mukti siji mukti kabeh, mati siji mati kabeh, roughly “one prospers, all prosper; one falls, all fall” — is still cited by Mangkunegaran today.",
        id: "Raden Mas Said memulai perlawanan dengan inti empat puluh pengikut setia dan berperang secara gerilya. Semboyannya, Tiji Tibeh — mukti siji mukti kabeh, mati siji mati kabeh — hingga kini masih dikutip oleh Mangkunegaran.",
      },
      significance: {
        en: "The resistance made Raden Mas Said a power that the Sunan, the new Sultan and the VOC eventually had to negotiate with.",
        id: "Perlawanan itu menjadikan Raden Mas Said kekuatan yang pada akhirnya harus diajak berunding oleh Sunan, Sultan yang baru, dan VOC.",
      },
      uncertainty: {
        en: "Exact start dates, battle counts and the meaning of the name Sambernyawa vary between popular accounts; the site gives only what the cited sources state.",
        id: "Tanggal awal, jumlah pertempuran, dan makna nama Sambernyawa berbeda-beda dalam kisah populer; situs ini hanya memuat yang dinyatakan sumber yang dikutip.",
      },
    },
    people: ["Raden Mas Said (Pangeran Sambernyawa)"],
    factIds: ["f-mataram-instability", "f-rms-struggle"],
    relatedArticles: ["legiun-mangkunegaran"],
  },
  {
    id: "estri",
    periodId: "foundation",
    year: 1741,
    date: { en: "During the resistance", id: "Masa perlawanan" },
    precision: "approximate",
    title: { en: "The women's troop", id: "Pasukan perempuan" },
    summary: { en: "Raden Mas Said forms Estri Ladrang Mangungkung, a troop of women soldiers who ride, shoot and fight beside him.", id: "Raden Mas Said membentuk Estri Ladrang Mangungkung, pasukan prajurit perempuan yang berkuda, bersenjata, dan bertempur di sisinya." },
    details: {
      happened: { en: "According to mangkunegaran.id, the troop began with 60 women trained to ride and to use the carbine (karbin wedung) and the bow. They escorted Raden Mas Said in battles against the VOC; at court events they also sang and danced Bedhaya, Srimpi and other dances for guests.", id: "Menurut mangkunegaran.id, pasukan ini awalnya beranggotakan 60 perempuan yang terlatih berkuda serta memakai karabin (karbin wedung) dan panah. Mereka mengawal Raden Mas Said dalam pertempuran melawan VOC; dalam acara istana mereka juga menyinden serta menarikan Bedhaya, Srimpi, dan tarian lain untuk para tamu." },
      significance: { en: "The official history presents the troop as evidence that women at Mangkunegaran were trusted with military as well as domestic roles.", id: "Sejarah resmi menampilkan pasukan ini sebagai bukti bahwa perempuan di Mangkunegaran dipercaya memegang peran militer, bukan hanya rumah tangga." },
      uncertainty: { en: "The source gives no founding date, and we have not found an independent account of the troop.", id: "Sumber tidak menyebut tahun pembentukan, dan kami belum menemukan catatan independen tentang pasukan ini." },
    },
    people: ["Raden Mas Said"],
    factIds: ["f-estri"],
  },
  {
    id: "giyanti",
    periodId: "foundation",
    year: 1755,
    date: { en: "13 February 1755", id: "13 Februari 1755" },
    title: { en: "Mataram is divided at Giyanti", id: "Mataram dibagi di Giyanti" },
    summary: {
      en: "The Treaty of Giyanti splits Mataram between Surakarta and Yogyakarta. Raden Mas Said is not a party, and fights on.",
      id: "Perjanjian Giyanti membagi Mataram antara Surakarta dan Yogyakarta. Raden Mas Said bukan pihak di dalamnya, dan terus berperang.",
    },
    details: {
      happened: {
        en: "At Giyanti the VOC, Pakubuwana III and Pangeran Mangkubumi agreed to divide Mataram: Pakubuwana III kept Surakarta, and Mangkubumi became Sultan Hamengkubuwana I of Yogyakarta.",
        id: "Di Giyanti, VOC, Pakubuwana III, dan Pangeran Mangkubumi sepakat membagi Mataram: Pakubuwana III tetap di Surakarta, dan Mangkubumi menjadi Sultan Hamengkubuwana I di Yogyakarta.",
      },
      significance: {
        en: "Giyanti explains why there are two courts in Surakarta's story — and why Mangkunegaran, created two years later, is a third house distinct from both.",
        id: "Giyanti menjelaskan mengapa sejarah Surakarta mengenal dua keraton — dan mengapa Mangkunegaran, yang lahir dua tahun kemudian, adalah wangsa ketiga yang berbeda dari keduanya.",
      },
    },
    people: ["Pakubuwana III", "Pangeran Mangkubumi (Hamengkubuwana I)", "VOC"],
    factIds: ["f-giyanti"],
  },
  {
    id: "salatiga",
    periodId: "foundation",
    year: 1757,
    date: { en: "March 1757", id: "Maret 1757" },
    title: { en: "The Salatiga settlement", id: "Perjanjian Salatiga" },
    summary: {
      en: "Raden Mas Said reaches terms with Pakubuwana III, with Hamengkubuwana I and the VOC represented. Mangkunegaran is founded and he becomes Mangkunegara I.",
      id: "Raden Mas Said mencapai kesepakatan dengan Pakubuwana III, dengan Hamengkubuwana I dan VOC turut terwakili. Mangkunegaran berdiri dan ia menjadi Mangkunegara I.",
    },
    details: {
      happened: {
        en: "Under the settlement he received the rank of Pangeran Miji, directly after the crown prince, and an entitlement of 4,000 cacah — households — in areas including Kaduang, Nglaroh, Matesih, Wiroko, Haribaya, Honggobayan, Sembuyan, Gunung Kidul, Kedu and parts of Pajang.",
        id: "Berdasarkan kesepakatan itu ia menerima kedudukan Pangeran Miji, langsung setelah putra mahkota, dan hak atas 4.000 cacah — rumah tangga — di wilayah antara lain Kaduang, Nglaroh, Matesih, Wiroko, Haribaya, Honggobayan, Sembuyan, Gunung Kidul, Kedu, dan sebagian Pajang.",
      },
      significance: {
        en: "Mangkunegaran began as an autonomous kadipaten with the right to keep its own army — a status that shaped it for almost two centuries.",
        id: "Mangkunegaran berawal sebagai kadipaten otonom yang berhak memiliki tentara sendiri — kedudukan yang membentuknya selama hampir dua abad.",
      },
      uncertainty: {
        en: "Sources differ on the day: 17 March 1757 (mangkunegaran.id) or 13 March (Surakarta city portal, 2015).",
        id: "Sumber berbeda soal tanggalnya: 17 Maret 1757 (mangkunegaran.id) atau 13 Maret (portal Kota Surakarta, 2015).",
      },
    },
    people: ["Raden Mas Said (Mangkunegara I)", "Pakubuwana III", "Hamengkubuwana I", "VOC"],
    factIds: ["f-salatiga-date", "f-salatiga-parties", "f-salatiga-terms", "f-founding-1757", "f-kadipaten-army"],
    milestone: true,
  },
  {
    id: "palace",
    periodId: "foundation",
    year: 1757,
    date: { en: "From 1757", id: "Sejak 1757" },
    title: { en: "Building the Pura", id: "Membangun Pura" },
    summary: {
      en: "Construction of the palace begins under Mangkunegara I, laid out like a kraton: pamedan, pendhapa, pringgitan, dalem and keputren.",
      id: "Pembangunan istana dimulai pada masa Mangkunegara I dengan tata ruang seperti keraton: pamedan, pendhapa, pringgitan, dalem, dan keputren.",
    },
    details: {
      happened: {
        en: "The Pura was laid out as a sequence of spaces enclosed by high walls: an open field, a great hall, a veranda and the main house, with the family quarters behind.",
        id: "Pura ditata sebagai rangkaian ruang yang dikelilingi tembok tinggi: lapangan terbuka, balai agung, beranda, dan rumah utama, dengan kediaman keluarga di belakangnya.",
      },
      significance: {
        en: "The buildings seen today are the result of many later rebuildings and additions; the historical photographs on this page show stages of that change.",
        id: "Bangunan yang terlihat kini adalah hasil banyak pembangunan ulang dan penambahan; foto-foto bersejarah di halaman ini memperlihatkan tahap-tahap perubahan itu.",
      },
    },
    people: ["Mangkunegara I"],
    factIds: ["f-palace-1757", "f-sequence"],
    archiveIds: ["arc-pendhapa-1874"],
  },
  {
    id: "national-hero",
    periodId: "foundation",
    year: 1795,
    date: { en: "Reigned 1757–1795", id: "Bertakhta 1757–1795" },
    title: { en: "The founder's legacy", id: "Warisan sang pendiri" },
    summary: {
      en: "Mangkunegara I reigns until 1795. In 1988 the Republic of Indonesia names him a National Hero.",
      id: "Mangkunegara I bertakhta hingga 1795. Pada 1988 Republik Indonesia menetapkannya sebagai Pahlawan Nasional.",
    },
    details: {
      happened: {
        en: "The official list of rulers gives his reign as 1757–1795. Almost two centuries later, the Indonesian government recognised him as a National Hero.",
        id: "Daftar resmi penguasa mencatat masa bertakhtanya 1757–1795. Hampir dua abad kemudian, pemerintah Indonesia mengakuinya sebagai Pahlawan Nasional.",
      },
      significance: {
        en: "The title connects the founder of a Javanese princely house with the national story of resistance to colonial power.",
        id: "Gelar itu menghubungkan pendiri sebuah wangsa Jawa dengan kisah nasional perlawanan terhadap kekuasaan kolonial.",
      },
      uncertainty: {
        en: "The official site gives the year 1988 but no decree number; we have not cited one.",
        id: "Situs resmi menyebut tahun 1988 tanpa nomor keputusan; kami tidak mencantumkannya.",
      },
    },
    people: ["Mangkunegara I"],
    factIds: ["f-rulers", "f-national-hero"],
  },

  /* ── II · Court, colony and enterprise ─────────────────────────────── */
  {
    id: "legion",
    periodId: "court",
    year: 1808,
    date: { en: "29 July 1808", id: "29 Juli 1808" },
    title: { en: "The Legion is named", id: "Legiun diresmikan" },
    summary: {
      en: "A decree of Governor-General Daendels formally designates the Mangkunegaran force as the Legiun Mangkunegaran, under Mangkunegara II.",
      id: "Surat keputusan Gubernur Jenderal Daendels meresmikan pasukan Mangkunegaran sebagai Legiun Mangkunegaran, pada masa Mangkunegara II.",
    },
    details: {
      context: {
        en: "The force had fought under Raden Mas Said before Mangkunegaran existed, and the right to an army was part of the domain's status.",
        id: "Pasukan ini telah bertempur di bawah Raden Mas Said sebelum Mangkunegaran ada, dan hak memiliki tentara adalah bagian dari kedudukan wilayah itu.",
      },
      happened: {
        en: "Mangkunegara II invited European officers to train the troops. Under Mangkunegara IV training centred on a military school, Soldat Sekul. The soldiers drilled on the Pamedan inside the palace gate.",
        id: "Mangkunegara II mengundang perwira Eropa untuk melatih pasukan. Pada masa Mangkunegara IV pelatihan berpusat di sekolah militer Soldat Sekul. Para prajurit berlatih di Pamedan di balik gerbang istana.",
      },
      significance: {
        en: "The Legion both protected the domain and, in the words of mangkunegaran.id, served as a source of legitimacy for the ruler — within a colonial framework that formally sanctioned it.",
        id: "Legiun melindungi wilayah sekaligus, menurut mangkunegaran.id, menjadi sumber legitimasi bagi penguasa — di dalam kerangka kolonial yang meresmikannya.",
      },
    },
    people: ["Mangkunegara II", "Herman Willem Daendels"],
    factIds: ["f-legiun-1808", "f-legiun-training", "f-legiun-origin", "f-pamedan"],
    archiveIds: ["arc-legion-officers-1922"],
    relatedArticles: ["legiun-mangkunegaran"],
  },
  {
    id: "sugar",
    periodId: "court",
    year: 1861,
    date: { en: "8 December 1861", id: "8 Desember 1861" },
    title: { en: "Sugar at Colomadu", id: "Gula di Colomadu" },
    summary: {
      en: "Mangkunegara IV breaks ground for the Colomadu sugar mill, which begins production in 1862.",
      id: "Mangkunegara IV meletakkan batu pertama pabrik gula Colomadu, yang mulai berproduksi pada 1862.",
    },
    details: {
      context: {
        en: "In the mid-nineteenth century Western private plantations were spreading through the region. Historian Wasino describes the Mangkunegaran sugar industry as a response to that expansion.",
        id: "Pada pertengahan abad ke-19 perkebunan swasta Barat menyebar di wilayah ini. Sejarawan Wasino menggambarkan industri gula Mangkunegaran sebagai jawaban atas perluasan itu.",
      },
      happened: {
        en: "With the approval of the Resident of Surakarta, Mangkunegara IV commissioned the Colomadu mill; ground was broken on 8 December 1861. Colomadu and a second mill, Tasikmadu, began as his personal enterprise and later became an enterprise of the praja, the state.",
        id: "Dengan persetujuan Residen Surakarta, Mangkunegara IV membangun pabrik gula Colomadu; batu pertama diletakkan pada 8 Desember 1861. Colomadu dan pabrik kedua, Tasikmadu, berawal sebagai usaha pribadinya dan kemudian menjadi usaha praja.",
      },
      significance: {
        en: "Sugar gave Mangkunegaran an economic base of its own and strengthened its position among the Javanese courts.",
        id: "Gula memberi Mangkunegaran landasan ekonomi sendiri dan memperkuat kedudukannya di antara istana-istana Jawa.",
      },
      uncertainty: {
        en: "Some sources date Tasikmadu to 1871; we have not verified that year and do not state it.",
        id: "Sebagian sumber menyebut Tasikmadu berdiri 1871; kami belum memverifikasi tahun itu dan tidak mencantumkannya.",
      },
    },
    people: ["Mangkunegara IV"],
    factIds: ["f-colomadu"],
    archiveIds: ["arc-mn4-1866", "arc-mn4-carriage-1870"],
    milestone: true,
  },
  {
    id: "library",
    periodId: "court",
    year: 1867,
    date: { en: "1867", id: "1867" },
    title: { en: "Rekso Pustoko", id: "Rekso Pustoko" },
    summary: {
      en: "Mangkunegara IV founds the palace library, which still keeps manuscripts, Javanese books, photographs and plantation records.",
      id: "Mangkunegara IV mendirikan perpustakaan istana, yang hingga kini menyimpan naskah, buku berbahasa Jawa, foto, dan arsip perkebunan.",
    },
    details: {
      happened: {
        en: "The library holds leather-bound manuscripts, books in Javanese, historical photographs and records of the plantations — the archive that historians such as Wasino later used to study Mangkunegaran's sugar enterprise.",
        id: "Perpustakaan ini menyimpan naskah bersampul kulit, buku berbahasa Jawa, foto bersejarah, dan arsip perkebunan — arsip yang kemudian digunakan sejarawan seperti Wasino untuk meneliti usaha gula Mangkunegaran.",
      },
      significance: {
        en: "Mangkunegara IV was also a writer: Serat Wedhatama, a hundred stanzas of moral guidance, is attributed to him.",
        id: "Mangkunegara IV juga seorang pujangga: Serat Wedhatama, seratus bait tuntunan budi pekerti, digubah olehnya.",
      },
    },
    people: ["Mangkunegara IV"],
    factIds: ["f-rekso-pustoko", "f-wedhatama", "f-colomadu"],
    archiveIds: ["arc-mn4-garden"],
  },
  {
    id: "siam",
    periodId: "court",
    year: 1871,
    date: { en: "1871", id: "1871" },
    title: { en: "A guest from Siam", id: "Tamu dari Siam" },
    summary: {
      en: "King Chulalongkorn of Siam visits Java; according to mangkunegaran.id he is welcomed at the palace with a panembrama.",
      id: "Raja Chulalongkorn dari Siam berkunjung ke Jawa; menurut mangkunegaran.id ia disambut di istana dengan panembrama.",
    },
    details: {
      happened: {
        en: "King Chulalongkorn — Rama V — travelled to Java in 1871, 1896 and 1901. Mangkunegaran's own account places his reception at the palace, in the reign of Mangkunegara IV, in 1871, with a welcome song composed for him.",
        id: "Raja Chulalongkorn — Rama V — berkunjung ke Jawa pada 1871, 1896, dan 1901. Catatan Mangkunegaran sendiri menempatkan penyambutannya di istana, pada masa Mangkunegara IV, pada 1871, dengan tembang penyambutan yang digubah untuknya.",
      },
      significance: {
        en: "The visit is an early example of the palace as a place of international exchange — the text was revived in 2024.",
        id: "Kunjungan ini contoh awal istana sebagai tempat pertukaran internasional — teksnya dihidupkan kembali pada 2024.",
      },
      uncertainty: {
        en: "The Queen Sirikit Museum of Textiles confirms the three journeys but does not name Mangkunegaran; the 1871 reception rests on mangkunegaran.id.",
        id: "Queen Sirikit Museum of Textiles mengonfirmasi tiga perjalanan itu tetapi tidak menyebut Mangkunegaran; penyambutan 1871 bersumber dari mangkunegaran.id.",
      },
    },
    people: ["King Chulalongkorn (Rama V)", "Mangkunegara IV"],
    factIds: ["f-chulalongkorn-1871", "f-panembrama"],
    relatedArticles: ["panembrama"],
  },
  {
    id: "tasikmadu",
    periodId: "court",
    year: 1871,
    date: { en: "11 June 1871", id: "11 Juni 1871" },
    title: { en: "A second sugar mill: Tasikmadu", id: "Pabrik gula kedua: Tasikmadu" },
    summary: { en: "With profits from Colomadu, Mangkunegara IV lays the first stone of the Tasikmadu sugar mill, completed in 1874.", id: "Dengan keuntungan dari Colomadu, Mangkunegara IV meletakkan batu pertama Pabrik Gula Tasikmadu, yang rampung pada 1874." },
    details: {
      context: { en: "Ten years after Colomadu was founded, its profits became the capital for a second mill on the lowlands west of the slopes of Mount Lawu.", id: "Sepuluh tahun setelah Colomadu berdiri, keuntungannya menjadi modal untuk pabrik kedua di dataran rendah sebelah barat lereng Gunung Lawu." },
      happened: { en: "The first stone was laid on 11 June 1871 and building was finished in 1874. The name joins tasik, sea, and madu, honey: a wish that its sugar would be as plentiful as a sea of honey. New buildings and machinery in 1912 raised output to 99,052 quintals, about twice the level of the first decade of the century.", id: "Batu pertama diletakkan pada 11 Juni 1871 dan pembangunan selesai pada 1874. Namanya menggabungkan tasik, laut, dan madu: harapan agar gulanya melimpah bagaikan lautan madu. Gedung dan mesin baru pada 1912 menaikkan produksi menjadi 99.052 kuintal, kira-kira dua kali lipat dasawarsa pertama abad itu." },
      significance: { en: "According to the official history, the mill's income paid for further enterprise and for nobles' and officials' salaries, and also for irrigation, schools and clinics in Mangkunegaran territory.", id: "Menurut sejarah resmi, pendapatan pabrik ini membiayai pengembangan usaha serta gaji bangsawan dan aparat, juga irigasi, sekolah, dan klinik di wilayah Mangkunegaran." },
      uncertainty: { en: "These details rest on a single source, mangkunegaran.id.", id: "Rincian ini bersandar pada satu sumber, mangkunegaran.id." },
    },
    people: ["Mangkunegara IV"],
    factIds: ["f-tasikmadu"],
  },
  {
    id: "arnhem",
    periodId: "court",
    year: 1879,
    date: { en: "1879", id: "1879" },
    title: { en: "A gamelan in Arnhem", id: "Gamelan di Arnhem" },
    summary: {
      en: "A large gamelan belonging to Kangjeng Pangeran Aria Gondasiwaja of the Mangkunegaran court is shown at the National Exhibition in Arnhem.",
      id: "Seperangkat gamelan besar milik Kangjeng Pangeran Aria Gondasiwaja dari istana Mangkunegaran dipamerkan di Pameran Nasional di Arnhem.",
    },
    details: {
      happened: {
        en: "A photograph by J. Ephraim Jr., now in the KITLV collection at Leiden University Libraries, records the ensemble and its musicians at the exhibition in the Netherlands.",
        id: "Sebuah foto karya J. Ephraim Jr., kini dalam koleksi KITLV di Perpustakaan Universitas Leiden, merekam ansambel itu beserta para pengrawitnya di pameran di Belanda.",
      },
      significance: {
        en: "It is a dated record of Mangkunegaran music outside Java, ten years before the court's dancers appeared in Paris.",
        id: "Ini catatan bertanggal tentang musik Mangkunegaran di luar Jawa, sepuluh tahun sebelum para penari istana tampil di Paris.",
      },
    },
    people: ["K.P.A. Gondasiwaja", "J. Ephraim Jr."],
    factIds: ["f-arnhem-1879"],
    archiveIds: ["arc-gamelan-arnhem-1879"],
  },
  {
    id: "paris",
    periodId: "court",
    year: 1889,
    date: { en: "1889", id: "1889" },
    title: { en: "Dancers in Paris", id: "Penari di Paris" },
    summary: {
      en: "Dancers from the Mangkunegaran court appear at the colonial section of the Exposition Universelle in Paris.",
      id: "Para penari dari istana Mangkunegaran tampil di bagian kolonial Exposition Universelle di Paris.",
    },
    details: {
      happened: {
        en: "Photographs in the KITLV collection show Mangkunegaran dancers at the 1889 world's fair. The catalogue names four of them: Taminah, Sariem, Soekia and Wakiem.",
        id: "Foto-foto dalam koleksi KITLV memperlihatkan penari Mangkunegaran di pameran dunia 1889. Katalognya menyebut empat di antaranya: Taminah, Sariem, Soekia, dan Wakiem.",
      },
      significance: {
        en: "Here the catalogue records the performers themselves by name, not only the court they came from.",
        id: "Di sini katalog mencatat nama para penampilnya sendiri, bukan hanya istana asal mereka.",
      },
    },
    people: ["Taminah", "Sariem", "Soekia", "Wakiem"],
    factIds: ["f-paris-1889", "f-arnhem-1879"],
    archiveIds: ["arc-dancers-paris-1889"],
  },

  /* ── III · Culture as modern project ───────────────────────────────── */
  {
    id: "schools",
    periodId: "court",
    year: 1900,
    date: { en: "Early 20th century", id: "Awal abad ke-20" },
    precision: "approximate",
    title: { en: "Schools and a scholarship fund", id: "Sekolah dan dana beasiswa" },
    summary: { en: "Mangkunegara VI opens schools, including one for girls, and starts a scholarship fund; Mangkunegara VII later expands it.", id: "Mangkunegara VI mendirikan sekolah, termasuk sekolah putri, dan merintis dana beasiswa; Mangkunegara VII kemudian memperluasnya." },
    details: {
      context: { en: "The official history links this to the Dutch “Ethical Policy” and notes that Surakarta's schools had mainly served European, aristocratic and wealthy families.", id: "Sejarah resmi mengaitkannya dengan Politik Etis dan mencatat bahwa sekolah di Surakarta sebelumnya terutama melayani keluarga Eropa, bangsawan, dan pengusaha besar." },
      happened: { en: "Mangkunegara VI founded the HIS Siswo school and Pawulangan Sisworini, a school for girls first focused on household education, and set up the Studiefonds, a scholarship for able children who could not pay. Mangkunegara VII added personal funds to the Studiefonds, created a committee (Comissie van Advies) to run it, and worked with the educator Van Deventer on a Van Deventer school in front of the palace.", id: "Mangkunegara VI mendirikan HIS Siswo dan Pawulangan Sisworini, sekolah putri yang awalnya berfokus pada pendidikan kerumahtanggaan, serta merintis Studiefonds, beasiswa bagi anak berprestasi yang tidak mampu. Mangkunegara VII menambahkan harta pribadi ke Studiefonds, membentuk Comissie van Advies untuk mengelolanya, dan bekerja sama dengan tokoh pendidikan Van Deventer mendirikan Sekolah Van Deventer di depan Pura." },
      significance: { en: "The palace used its position to widen schooling for ordinary families and for girls.", id: "Istana memakai kedudukannya untuk memperluas pendidikan bagi rakyat kecil dan perempuan." },
      uncertainty: { en: "The source gives no founding years for these schools.", id: "Sumber tidak menyebut tahun berdirinya sekolah-sekolah ini." },
    },
    people: ["Mangkunegara VI", "Mangkunegara VII", "Van Deventer"],
    factIds: ["f-education"],
  },
  {
    id: "electricity",
    periodId: "court",
    year: 1901,
    date: { en: "12 March 1901", id: "12 Maret 1901" },
    title: { en: "Electricity for Surakarta", id: "Listrik untuk Surakarta" },
    summary: { en: "Mangkunegara VI and Sunan Pakubuwana X initiate a private electricity company for Surakarta, the Solosche Electriciteit Maatschappij.", id: "Mangkunegara VI dan Sunan Pakubuwana X menggagas perusahaan listrik swasta untuk Surakarta, Solosche Electriciteit Maatschappij." },
    details: {
      happened: { en: "According to mangkunegaran.id, the company (SEM), a branch of the Batavia-based ANIEM, both produced and distributed electricity — to the palaces, government offices and street lighting — and slowly extended its network towards the villages.", id: "Menurut mangkunegaran.id, perusahaan ini (SEM), cabang ANIEM yang berpusat di Batavia, memproduksi sekaligus mendistribusikan listrik — ke istana, kantor pemerintahan, dan penerangan jalan — dan perlahan memperluas jaringannya hingga ke desa." },
      significance: { en: "Two separate houses, Mangkunegaran and the Kasunanan, acted together here on modern infrastructure for the city they shared.", id: "Dua wangsa yang terpisah, Mangkunegaran dan Kasunanan, di sini bertindak bersama dalam infrastruktur modern untuk kota yang mereka tempati bersama." },
    },
    people: ["Mangkunegara VI", "Pakubuwana X"],
    factIds: ["f-sem-1901"],
  },
  {
    id: "mn7-accession",
    periodId: "modern",
    year: 1916,
    date: { en: "1916", id: "1916" },
    title: { en: "Mangkunegara VII", id: "Mangkunegara VII" },
    summary: {
      en: "Mangkunegara VII becomes reigning prince; the Legion parades at the palace to mark his elevation.",
      id: "Mangkunegara VII menjadi penguasa; Legiun berparade di istana menandai kenaikannya.",
    },
    details: {
      happened: {
        en: "A 1916 photograph in the KITLV collection shows the Legion's parade in the palace grounds, with Mangkunegara VII and the Dutch Resident F.P. Sollewijn Gelpke at the centre. His reign lasted until 1944.",
        id: "Sebuah foto 1916 dalam koleksi KITLV memperlihatkan parade Legiun di halaman istana, dengan Mangkunegara VII dan Residen Belanda F.P. Sollewijn Gelpke di tengah. Masa bertakhtanya berlangsung hingga 1944.",
      },
      significance: {
        en: "Under Mangkunegara VII the court mosque was modernised to a design by the architect Herman Thomas Karsten; in 1949 it was renamed Al Wustho.",
        id: "Pada masa Mangkunegara VII masjid istana dirombak dengan rancangan arsitek Herman Thomas Karsten; pada 1949 masjid itu dinamai Al Wustho.",
      },
    },
    people: ["Mangkunegara VII", "F.P. Sollewijn Gelpke", "Herman Thomas Karsten"],
    factIds: ["f-mn7-1916", "f-rulers", "f-alwustho"],
    archiveIds: ["arc-legion-parade-1916", "arc-mn7-1931"],
    milestone: true,
  },
  {
    id: "java-instituut",
    periodId: "modern",
    year: 1918,
    date: { en: "1918–1919", id: "1918–1919" },
    precision: "range",
    title: { en: "The Java Instituut", id: "Java Instituut" },
    summary: {
      en: "After a congress on Javanese culture, Mangkunegara VII recommends a research institute; the Java Instituut is founded in 1919.",
      id: "Setelah kongres kebudayaan Jawa, Mangkunegara VII mengusulkan lembaga penelitian; Java Instituut berdiri pada 1919.",
    },
    details: {
      happened: {
        en: "At the Congress for Javanese Cultural Development (5–7 July 1918), where Mangkunegaran staged wayang wong, Mangkunegara VII recommended an institute for Javanese culture. The Java Instituut was founded on 4 August 1919.",
        id: "Dalam Kongres Pengembangan Kebudayaan Jawa (5–7 Juli 1918), tempat Mangkunegaran mementaskan wayang wong, Mangkunegara VII mengusulkan lembaga kebudayaan Jawa. Java Instituut berdiri pada 4 Agustus 1919.",
      },
      significance: {
        en: "It marks a shift from preserving culture inside the palace to studying and discussing it in public institutions.",
        id: "Peristiwa ini menandai pergeseran dari melestarikan budaya di dalam istana ke meneliti dan membicarakannya di lembaga publik.",
      },
    },
    people: ["Mangkunegara VII"],
    factIds: ["f-mn7-java-instituut"],
  },
  {
    id: "kali-samin",
    periodId: "modern",
    year: 1932,
    date: { en: "7 November 1932", id: "7 November 1932" },
    title: { en: "Power from the Samin river", id: "Listrik dari Kali Samin" },
    summary: { en: "A hydroelectric plant on the Kali Samin at Tawangmangu, proposed by Mangkunegara VII, is completed.", id: "Pembangkit listrik tenaga air di Kali Samin, Tawangmangu, yang digagas Mangkunegara VII, rampung." },
    details: {
      context: { en: "Between 1902 and 1931 the electricity company could not meet demand across Surakarta; Mangkunegara VII proposed a larger plant so that power would be affordable in Mangkunegaran territory.", id: "Antara 1902 dan 1931 perusahaan listrik belum mampu memenuhi kebutuhan di seluruh Surakarta; Mangkunegara VII menggagas pembangkit yang lebih besar agar listrik terjangkau di wilayah Mangkunegaran." },
      happened: { en: "A 1932 study by Mangkunegaran and the company chose the Kali Samin at Tawangmangu. Ir. Sarsito signed the agreement for Mangkunegaran; the plant was completed on 7 November 1932 and inaugurated by Gusti Kanjeng Putri Mangkoenagoro VII.", id: "Studi Mangkunegaran dan perusahaan listrik pada 1932 memilih Kali Samin di Tawangmangu. Ir. Sarsito menandatangani perjanjian untuk Mangkunegaran; pembangkit rampung pada 7 November 1932 dan diresmikan Gusti Kanjeng Putri Mangkoenagoro VII." },
      significance: { en: "According to the official history, the new supply lit the Mangkunegaran area at night and raised production at the Colomadu and Tasikmadu sugar mills.", id: "Menurut sejarah resmi, pasokan baru ini menerangi kawasan Mangkunegaran di malam hari dan menaikkan produksi Pabrik Gula Colomadu dan Tasikmadu." },
    },
    people: ["Mangkunegara VII", "Ir. Sarsito", "G.K.P. Mangkoenagoro VII"],
    factIds: ["f-kali-samin"],
  },
  {
    id: "srv",
    periodId: "modern",
    year: 1933,
    date: { en: "1 April 1933", id: "1 April 1933" },
    title: { en: "Radio from Surakarta", id: "Radio dari Surakarta" },
    summary: {
      en: "Solosche Radio Vereeniging is founded with Mangkunegara VII's support — described as the first radio station run by indigenous people in the Dutch East Indies.",
      id: "Solosche Radio Vereeniging berdiri dengan dukungan Mangkunegara VII — disebut stasiun radio pertama yang dikelola kaum bumiputra di Hindia Belanda.",
    },
    details: {
      happened: {
        en: "SRV grew out of a palace arts circle; Mangkunegara VII supplied its first equipment and later donated land in Kestalan for a studio, opened in 1936 by Gusti Nurul. In 1937 it broadcast gamelan for her dance at a royal wedding in the Netherlands.",
        id: "SRV tumbuh dari perkumpulan seni istana; Mangkunegara VII menyediakan peralatan pertamanya dan kemudian menyumbangkan tanah di Kestalan untuk studio, yang diresmikan Gusti Nurul pada 1936. Pada 1937 SRV menyiarkan gamelan untuk tariannya di sebuah pernikahan kerajaan di Belanda.",
      },
      significance: {
        en: "Radio carried Javanese music and theatre far beyond the palace walls.",
        id: "Radio membawa musik dan teater Jawa jauh melampaui tembok istana.",
      },
      uncertainty: {
        en: "Sources describe SRV's link to Radio Republik Indonesia (founded 1945) differently; we do not claim a direct institutional line.",
        id: "Sumber menggambarkan hubungan SRV dengan Radio Republik Indonesia (lahir 1945) secara berbeda; kami tidak mengklaim garis kelembagaan langsung.",
      },
    },
    people: ["Mangkunegara VII", "R.M. Sarsito Mangoenkoesoemo", "Gusti Nurul"],
    factIds: ["f-srv-founding", "f-srv-studio", "f-srv-1937", "f-srv-rri"],
    archiveIds: [],
    relatedArticles: ["solosche-radio-vereeniging"],
  },
  {
    id: "ponten",
    periodId: "modern",
    year: 1936,
    date: { en: "1936", id: "1936" },
    title: { en: "The Ponten bathhouse", id: "Ponten Mangkunegaran" },
    summary: { en: "To fight diseases spread by poor sanitation, Mangkunegara VII has a public bathhouse built at Ngebrusan, designed by Thomas Karsten.", id: "Untuk melawan penyakit akibat sanitasi buruk, Mangkunegara VII membangun pemandian umum di Ngebrusan, dirancang Thomas Karsten." },
    details: {
      happened: { en: "The roofless design let in air and sunlight so the interior would not stay damp, and water ran from openings instead of being scooped — hence the name ponten, from the Dutch fontein. After independence it fell out of use; it was restored in 2007 and designated a cultural heritage building in 2013.", id: "Rancangan tanpa atap memasukkan udara dan cahaya matahari agar bagian dalam tidak lembap, dan air mengalir dari lubang-lubang alih-alih ditimba — dari situlah nama ponten, dari kata Belanda fontein. Setelah kemerdekaan bangunan ini ditinggalkan; ia dipugar pada 2007 dan ditetapkan sebagai cagar budaya pada 2013." },
      significance: { en: "It shows the palace treating public health as part of its responsibilities in the late colonial period.", id: "Bangunan ini menunjukkan istana memandang kesehatan masyarakat sebagai bagian dari tanggung jawabnya pada akhir masa kolonial." },
    },
    people: ["Mangkunegara VII", "Thomas Karsten"],
    factIds: ["f-ponten"],
  },
  {
    id: "bedhah-madiun",
    periodId: "modern",
    year: 1939,
    date: { en: "1939", id: "1939" },
    title: { en: "Bedhaya Bedhah Madiun", id: "Bedhaya Bedhah Madiun" },
    summary: {
      en: "A court dance created by Mangkunegara VII is performed for the first time, at the commemoration of his accession.",
      id: "Tari istana ciptaan Mangkunegara VII pertama kali dipentaskan, dalam peringatan kenaikan takhtanya.",
    },
    details: {
      happened: {
        en: "Seven to nine women dance the story of Panembahan Senapati and Retna Dumilah of Madiun. The first performers included G.R.Ay. Siti Noeroel Kamaril Ngarasati Kusumawardhani.",
        id: "Tujuh hingga sembilan penari perempuan membawakan kisah Panembahan Senapati dan Retna Dumilah dari Madiun. Penari pertamanya antara lain G.R.Ay. Siti Noeroel Kamaril Ngarasati Kusumawardhani.",
      },
      significance: {
        en: "The dance is still performed; it was staged in 2023 for the 65th anniversary of Indonesia–Japan cooperation.",
        id: "Tari ini masih dipentaskan; pada 2023 ia dibawakan untuk peringatan 65 tahun kerja sama Indonesia–Jepang.",
      },
    },
    people: ["Mangkunegara VII", "G.R.Ay. Siti Noeroel"],
    factIds: ["f-bedhah-madiun", "f-bedhah-2023"],
    archiveIds: ["arc-palace-lit-1938"],
  },

  /* ── IV · Within the Republic ─────────────────────────────────────── */
  {
    id: "srv-1942",
    periodId: "modern",
    year: 1942,
    date: { en: "2 March 1942", id: "2 Maret 1942" },
    title: { en: "Radio under occupation", id: "Radio di masa pendudukan" },
    summary: { en: "The colonial government orders the radio society's equipment destroyed; under Japanese occupation the station restarts as Solo Hoso Kyoku.", id: "Pemerintah kolonial memerintahkan peralatan perkumpulan radio dihancurkan; di masa pendudukan Jepang stasiun itu hidup lagi sebagai Solo Hoso Kyoku." },
    details: {
      happened: { en: "On 2 March 1942 the colonial authorities ordered SRV's equipment destroyed. Under the Japanese occupation the station was restarted under a Japanese name, Solo Hoso Kyoku.", id: "Pada 2 Maret 1942 pemerintah kolonial memerintahkan peralatan SRV dihancurkan. Di masa pendudukan Jepang stasiun itu dijalankan kembali dengan nama Jepang, Solo Hoso Kyoku." },
      significance: { en: "The radio society Mangkunegara VII had supported did not survive the end of colonial rule in its original form.", id: "Perkumpulan radio yang didukung Mangkunegara VII tidak bertahan dalam bentuk aslinya melewati akhir kekuasaan kolonial." },
      uncertainty: { en: "This rests on a single source, mangkunegaran.id.", id: "Ini bersandar pada satu sumber, mangkunegaran.id." },
    },
    people: ["Mangkunegara VII"],
    factIds: ["f-srv-1942"],
    relatedArticles: ["solosche-radio-vereeniging"],
  },
  {
    id: "independence",
    periodId: "republic",
    year: 1945,
    date: { en: "August–September 1945", id: "Agustus–September 1945" },
    precision: "range",
    title: { en: "Supporting the Republic", id: "Mendukung Republik" },
    summary: {
      en: "Mangkunegara VIII congratulates the new Republic and, on 1 September 1945, declares Mangkunegaran's support for it.",
      id: "Mangkunegara VIII mengucapkan selamat kepada Republik yang baru dan, pada 1 September 1945, menyatakan dukungan Mangkunegaran kepadanya.",
    },
    details: {
      happened: {
        en: "On 18 August 1945 Mangkunegara VIII and Pakubuwana XII of the Kasunanan sent congratulations on independence. A declaration of 1 September 1945 placed Mangkunegaran behind the Republic, and on 6 September both rulers received a Presidential Charter of Position dated 19 August 1945.",
        id: "Pada 18 Agustus 1945 Mangkunegara VIII dan Pakubuwana XII dari Kasunanan mengirim ucapan selamat atas kemerdekaan. Maklumat 1 September 1945 menempatkan Mangkunegaran di belakang Republik, dan pada 6 September kedua penguasa menerima Piagam Kedudukan dari Presiden bertanggal 19 Agustus 1945.",
      },
      significance: {
        en: "The two Surakarta houses acted in parallel but remained distinct institutions; in Yogyakarta, the Sultanate and Pakualaman went on to form a special region.",
        id: "Dua wangsa Surakarta bertindak sejajar tetapi tetap merupakan lembaga yang berbeda; di Yogyakarta, Kasultanan dan Pakualaman kemudian membentuk daerah istimewa.",
      },
    },
    people: ["Mangkunegara VIII", "Pakubuwana XII", "Soekarno"],
    factIds: ["f-independence-1945", "f-nkri-1945"],
    milestone: true,
  },
  {
    id: "residency-1946",
    periodId: "republic",
    year: 1946,
    date: { en: "15 July 1946", id: "15 Juli 1946" },
    title: { en: "The end of political authority", id: "Berakhirnya kewenangan politik" },
    summary: {
      en: "Amid the social revolution in Surakarta, a government regulation makes Surakarta a residency under the Republic. Mangkunegaran loses its political authority.",
      id: "Di tengah revolusi sosial di Surakarta, sebuah peraturan pemerintah menjadikan Surakarta karesidenan di bawah Republik. Mangkunegaran kehilangan kewenangan politiknya.",
    },
    details: {
      context: {
        en: "In 1945–1946 an anti-monarchist movement in Surakarta demanded an end to the princely governments.",
        id: "Pada 1945–1946 gerakan antiswapraja di Surakarta menuntut diakhirinya pemerintahan kerajaan.",
      },
      happened: {
        en: "Government Regulation No. 16/SD of 15 July 1946 made Surakarta a residency directly under the Republic, pending a law on the status of the Kasunanan and Mangkunegaran. That law never came.",
        id: "Peraturan Pemerintah No. 16/SD tanggal 15 Juli 1946 menjadikan Surakarta karesidenan langsung di bawah Republik, sambil menunggu undang-undang tentang kedudukan Kasunanan dan Mangkunegaran. Undang-undang itu tidak pernah terbit.",
      },
      significance: {
        en: "From this point Mangkunegaran continued as a cultural and social institution rather than a government.",
        id: "Sejak saat itu Mangkunegaran berlanjut sebagai lembaga budaya dan sosial, bukan pemerintahan.",
      },
      uncertainty: {
        en: "mangkunegaran.id dates the social revolution as 1945–1946 on one page and 1945–1950 on another. Scholars also disagree on whether the 1946 regulation was meant to be temporary.",
        id: "mangkunegaran.id menyebut revolusi sosial terjadi 1945–1946 di satu halaman dan 1945–1950 di halaman lain. Para ahli juga berbeda pendapat apakah peraturan 1946 itu dimaksudkan sementara.",
      },
    },
    people: ["Mangkunegara VIII"],
    factIds: ["f-pp16-1946", "f-social-revolution", "f-revolution-dates"],
    milestone: true,
  },
  {
    id: "central-java-1950",
    periodId: "republic",
    year: 1950,
    date: { en: "1950", id: "1950" },
    title: { en: "Part of Central Java", id: "Bagian dari Jawa Tengah" },
    summary: {
      en: "Law No. 10 of 1950 places the Surakarta area in the new province of Central Java.",
      id: "Undang-Undang No. 10 Tahun 1950 menempatkan wilayah Surakarta dalam Provinsi Jawa Tengah yang baru.",
    },
    details: {
      happened: {
        en: "Unlike Yogyakarta, Surakarta did not become a special region. Later demands to restore a special status have not been taken up by the central government.",
        id: "Berbeda dengan Yogyakarta, Surakarta tidak menjadi daerah istimewa. Tuntutan kemudian untuk memulihkan status istimewa tidak ditindaklanjuti pemerintah pusat.",
      },
      significance: {
        en: "It completed the transition from princely domain to a cultural house within an ordinary province.",
        id: "Peristiwa ini menuntaskan peralihan dari wilayah kerajaan menjadi wangsa budaya di dalam provinsi biasa.",
      },
    },
    people: [],
    factIds: ["f-uu10-1950"],
  },
  {
    id: "mn9",
    periodId: "republic",
    year: 1987,
    date: { en: "1987–2021", id: "1987–2021" },
    precision: "range",
    title: { en: "Mangkunegara IX", id: "Mangkunegara IX" },
    summary: {
      en: "Mangkunegara VIII dies in 1987. His son succeeds him and is formally installed on 24 January 1988 — the first head of the house installed after independence.",
      id: "Mangkunegara VIII wafat pada 1987. Putranya menggantikannya dan dinobatkan resmi pada 24 Januari 1988 — pemimpin wangsa pertama yang dinobatkan setelah kemerdekaan.",
    },
    details: {
      happened: {
        en: "Mangkunegara IX led arts missions to France, England and Japan, created dance works such as Bedhaya Surya Sumirat, and opened the palace to artists from outside. Dance is performed every 35 days to mark his birth. He died on 13 August 2021.",
        id: "Mangkunegara IX memimpin misi kesenian ke Prancis, Inggris, dan Jepang, menciptakan karya tari seperti Bedhaya Surya Sumirat, dan membuka istana bagi seniman dari luar. Tari dipentaskan setiap 35 hari untuk memperingati kelahirannya. Ia wafat pada 13 Agustus 2021.",
      },
      significance: {
        en: "His reign shows the house's new role: not governing, but presenting and renewing Javanese performing arts.",
        id: "Masa bertakhtanya memperlihatkan peran baru wangsa ini: bukan memerintah, melainkan menampilkan dan memperbarui seni pertunjukan Jawa.",
      },
      uncertainty: {
        en: "The official rulers list dates his reign from 1987; his installation ceremony was in January 1988. One Wikipedia table ends Mangkunegara VIII's reign in 1962, which other sources do not support.",
        id: "Daftar resmi mencatat masa bertakhtanya sejak 1987; upacara penobatannya pada Januari 1988. Satu tabel Wikipedia mengakhiri masa Mangkunegara VIII pada 1962, yang tidak didukung sumber lain.",
      },
    },
    people: ["Mangkunegara VIII", "Mangkunegara IX"],
    factIds: ["f-mn9-installed", "f-mn9-arts", "f-mn8-reign"],
  },
  {
    id: "mn10",
    periodId: "republic",
    year: 2022,
    date: { en: "2022", id: "2022" },
    title: { en: "Mangkunegara X", id: "Mangkunegara X" },
    summary: {
      en: "Mangkunegara X becomes head of the house.",
      id: "Mangkunegara X menjadi pemimpin wangsa.",
    },
    details: {
      happened: {
        en: "He succeeded his father after Mangkunegara IX's death in 2021.",
        id: "Ia menggantikan ayahnya setelah Mangkunegara IX wafat pada 2021.",
      },
      significance: {
        en: "Recent projects — a revitalised western garden and the revival of a nineteenth-century welcome song — combine conservation with new public uses of the palace.",
        id: "Proyek-proyek terbaru — taman barat yang direvitalisasi dan dihidupkannya kembali tembang penyambutan abad ke-19 — memadukan pelestarian dengan pemanfaatan publik baru atas istana.",
      },
    },
    people: ["Mangkunegara X"],
    factIds: ["f-mn10", "f-mn9-arts", "f-pracima-tuin", "f-panembrama-2024"],
  },
  {
    id: "pracima-tuin",
    periodId: "republic",
    year: 2023,
    date: { en: "21 January 2023", id: "21 Januari 2023" },
    title: { en: "Pracima Tuin opens", id: "Pracima Tuin dibuka" },
    summary: {
      en: "A garden of about 1,000 m² on the western side of the palace opens on the site of a former tennis court.",
      id: "Taman seluas sekitar 1.000 m² di sisi barat istana dibuka di bekas lapangan tenis.",
    },
    details: {
      happened: {
        en: "Its buildings — Pracimasana, Pracimaloka and Pracimawisik — host dining, gatherings and cultural events.",
        id: "Bangunannya — Pracimasana, Pracimaloka, dan Pracimawisik — menjadi tempat jamuan, pertemuan, dan acara budaya.",
      },
      significance: {
        en: "The palace now invites the public in through new spaces as well as historic ones.",
        id: "Istana kini mengundang publik melalui ruang-ruang baru selain ruang bersejarahnya.",
      },
    },
    people: ["Mangkunegara X"],
    factIds: ["f-pracima-tuin"],
  },
  {
    id: "panembrama-2024",
    periodId: "republic",
    year: 2024,
    date: { en: "27 April 2024", id: "27 April 2024" },
    title: { en: "A welcome song returns", id: "Tembang penyambutan kembali" },
    summary: {
      en: "A panembrama adapted from the one sung for King Chulalongkorn opens the Royal Dinner marking Mangkunegaran's 267th anniversary.",
      id: "Panembrama yang diadaptasi dari tembang untuk Raja Chulalongkorn membuka Royal Dinner peringatan 267 tahun Mangkunegaran.",
    },
    details: {
      happened: {
        en: "The nineteenth-century text was transliterated, translated and adapted, then performed with the palace gamelan before guests from several countries, Thailand among them.",
        id: "Teks abad ke-19 itu dialihaksarakan, dialihbahasakan, dan disesuaikan, lalu dibawakan bersama gamelan istana di hadapan tamu dari berbagai negara, termasuk Thailand.",
      },
      significance: {
        en: "An archival text became living performance again — a small example of how heritage is kept, not just stored.",
        id: "Sebuah teks arsip kembali menjadi pertunjukan hidup — contoh kecil bagaimana warisan dirawat, bukan sekadar disimpan.",
      },
    },
    people: ["Mangkunegara X"],
    factIds: ["f-panembrama-2024", "f-chulalongkorn-1871"],
    relatedArticles: ["panembrama"],
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
      en: "One English Wikipedia table ends this reign in 1962; the official list and his own Wikipedia article give 1987.",
      id: "Satu tabel Wikipedia bahasa Inggris mengakhiri masa ini pada 1962; daftar resmi dan artikel Wikipedia tentang dirinya menyebut 1987.",
      jv: "Satunggal tabel Wikipedia basa Inggris mungkasi jaman punika ing taun 1962; pratélan resmi saha artikel Wikipedia bab panjenenganipun nyebat 1987.",
    },
  },
  {
    ordinal: "IX",
    name: "K.G.P.A.A. Mangkunegara IX",
    reign: "1987–2021",
    factIds: ["f-rulers", "f-mn9-installed"],
    disputed: {
      en: "Succeeded in 1987; formally installed on 24 January 1988.",
      id: "Menggantikan pada 1987; dinobatkan resmi 24 Januari 1988.",
      jv: "Nggentosi ing taun 1987; jumeneng resmi 24 Januari 1988.",
    },
  },
  { ordinal: "X", name: "K.G.P.A.A. Mangkunegara X", reign: "2022–", factIds: ["f-rulers", "f-mn10"] },
];

export const PERIODS = parseAll(historyPeriodSchema, RAW_PERIODS, "history periods");
export const ENTRIES = parseAll(historyEntrySchema, RAW_ENTRIES, "history entries");
export const RULERS = parseAll(rulerSchema, RAW_RULERS, "rulers");
export const ENTRY_BY_ID = new Map(ENTRIES.map((e) => [e.id, e]));

for (const e of ENTRIES) {
  if (!PERIODS.some((p) => p.id === e.periodId)) throw new Error(`Entry ${e.id}: unknown period ${e.periodId}`);
}
