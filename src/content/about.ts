/**
 * About / case-study page text (editorial: id + en; other locales fall back).
 * Measured results are intentionally absent until they are measured on the
 * deployed site — the page renders nothing in that slot until then.
 */
import type { Localized } from "./schema";

type Section = { id: string; title: Localized; paragraphs: Localized[] };

export const ABOUT_SECTIONS: Section[] = [
  {
    id: "project",
    title: { en: "The project", id: "Proyek ini" },
    paragraphs: [
      {
        en: "Mangkunegaran — A Living Heritage is an independent concept: a redesign of how Pura Mangkunegaran's heritage could be presented online, made by Kelompok 7 as a group project for a Pancasila course. It is not the palace's website and has no connection with the palace.",
        id: "Mangkunegaran — A Living Heritage adalah sebuah konsep independen: rancangan ulang tentang bagaimana warisan Pura Mangkunegaran dapat disajikan secara daring, dibuat oleh Kelompok 7 sebagai tugas kelompok mata kuliah Pancasila. Situs ini bukan situs resmi istana dan tidak memiliki hubungan dengan istana.",
      },
      {
        en: "Everything on the site is drawn from published sources, and every date or historical claim links to them. Where sources disagree, the page says so. Where we could not verify something — opening hours, for instance — we leave it out and point to the official website.",
        id: "Semua isi situs diambil dari sumber yang telah dipublikasikan, dan setiap tanggal atau klaim sejarah tertaut ke sumbernya. Jika sumber-sumber berbeda pendapat, halaman menyebutkannya. Jika sesuatu tidak dapat kami verifikasi — jam buka, misalnya — kami tidak mencantumkannya dan mengarahkan ke situs resmi.",
      },
    ],
  },
  {
    id: "pancasila",
    title: { en: "Pancasila and diversity", id: "Pancasila dan keberagaman" },
    paragraphs: [
      {
        en: "Indonesia's national motto, Bhinneka Tunggal Ika, holds that unity does not require sameness. We took that literally as a design brief. The site speaks Indonesian, the language that unites the country; Javanese, the language of the heritage itself; and ten more languages spoken by neighbours and visitors. No language is treated as a translation of lesser rank: each one has its own address, its own page titles, and an honest label telling readers what has and hasn't been translated yet.",
        id: "Semboyan nasional Indonesia, Bhinneka Tunggal Ika, mengajarkan bahwa persatuan tidak menuntut keseragaman. Kami menjadikannya landasan desain. Situs ini berbicara dalam bahasa Indonesia, bahasa pemersatu bangsa; bahasa Jawa, bahasa warisan itu sendiri; dan sepuluh bahasa lain yang digunakan para tetangga dan pengunjung. Tidak ada bahasa yang diperlakukan sebagai terjemahan kelas dua: masing-masing memiliki alamatnya sendiri, judul halamannya sendiri, dan label jujur tentang apa yang sudah dan belum diterjemahkan.",
      },
      {
        en: "Regional identity sits alongside the national one rather than beneath it. Page titles carry Aksara Jawa, Javanese terms keep their own spelling and pronunciation markup, and Javanese text is written in krama, the register of respect — flagged for review by a native speaker rather than presented as finished.",
        id: "Identitas daerah berdiri berdampingan dengan identitas nasional, bukan di bawahnya. Judul halaman disertai Aksara Jawa, istilah Jawa mempertahankan ejaannya sendiri beserta penanda pelafalannya, dan teks berbahasa Jawa ditulis dalam krama, ragam bahasa penghormatan — ditandai untuk ditinjau penutur asli, bukan disajikan sebagai hasil akhir.",
      },
      {
        en: "Fair access to information is a matter of social justice. The site is built to work on an inexpensive phone over a slow connection, to be fully usable by keyboard and screen reader, and to explain visiting rules with pictograms that do not depend on reading any one language.",
        id: "Akses informasi yang adil adalah soal keadilan sosial. Situs ini dibangun agar dapat dibuka di ponsel murah dengan koneksi lambat, dapat digunakan sepenuhnya dengan papan ketik dan pembaca layar, serta menjelaskan aturan kunjungan dengan piktogram yang tidak bergantung pada kemampuan membaca satu bahasa tertentu.",
      },
    ],
  },
  {
    id: "challenge",
    title: { en: "The challenge", id: "Tantangannya" },
    paragraphs: [
      {
        en: "Heritage websites often have to choose between depth and reach: rich content in one language, or thin content in many. We wanted both — a slow, editorial reading experience in Indonesian and English, open doors in twelve languages, and no invented facts anywhere.",
        id: "Situs warisan budaya sering harus memilih antara kedalaman dan jangkauan: konten kaya dalam satu bahasa, atau konten tipis dalam banyak bahasa. Kami menginginkan keduanya — pengalaman membaca yang tenang dan editorial dalam bahasa Indonesia dan Inggris, pintu yang terbuka dalam dua belas bahasa, dan tanpa satu pun fakta karangan.",
      },
    ],
  },
  {
    id: "research",
    title: { en: "Research approach", id: "Pendekatan riset" },
    paragraphs: [
      {
        en: "We started from the institution's own published pages, then cross-checked each claim against at least one other source: archived city-government pages, a museum, national radio, journalism and, only for corroboration, Wikipedia. Every claim lives in a fact ledger with its sources, access date and a confidence level. The build fails if a page cites a claim that is not in the ledger.",
        id: "Kami memulai dari halaman-halaman yang diterbitkan institusi itu sendiri, lalu memeriksa silang setiap klaim dengan setidaknya satu sumber lain: arsip situs pemerintah kota, museum, radio nasional, jurnalisme, dan — hanya sebagai penguat — Wikipedia. Setiap klaim tercatat dalam buku fakta beserta sumber, tanggal akses, dan tingkat keyakinannya. Proses build gagal jika sebuah halaman mengutip klaim yang tidak ada dalam buku fakta.",
      },
    ],
  },
  {
    id: "design",
    title: { en: "Design system", id: "Sistem desain" },
    paragraphs: [
      {
        en: "The visual direction is a museum catalogue rather than a tourism brochure: an editorial serif for display, a readable sans-serif designed in Jakarta for text, a twelve-column grid, oversized numerals and thin brass rules. The geometry of the single ornament echoes a tiered joglo roof. The palette is our own design direction and makes no claim about official colours.",
        id: "Arah visualnya adalah katalog museum, bukan brosur wisata: huruf serif editorial untuk judul, huruf sans-serif yang mudah dibaca dan dirancang di Jakarta untuk teks, grid dua belas kolom, angka berukuran besar, dan garis kuningan yang tipis. Geometri satu-satunya ornamen menggemakan atap joglo bertingkat. Paletnya adalah arah desain kami sendiri dan bukan klaim tentang warna resmi.",
      },
    ],
  },
  {
    id: "i18n",
    title: { en: "Twelve languages, honestly", id: "Dua belas bahasa, dengan jujur" },
    paragraphs: [
      {
        en: "Every page exists at its own address in every language, prerendered to static HTML with the correct language tag, so search engines and link previews see real content. Interface text is translated into all twelve languages. Editorial text is written in Indonesian and English; the home and history pages also have Javanese drafts. When a page has no version in your language, it is shown in English (or Indonesian, for Javanese readers) with a notice — never mislabelled. Thai, Khmer, Lao, Burmese and Javanese scripts load their fonts only when needed.",
        id: "Setiap halaman memiliki alamatnya sendiri dalam setiap bahasa, dirender sebelumnya menjadi HTML statis dengan tag bahasa yang tepat, sehingga mesin pencari dan pratinjau tautan melihat konten yang sebenarnya. Teks antarmuka diterjemahkan ke dua belas bahasa. Teks editorial ditulis dalam bahasa Indonesia dan Inggris; halaman beranda dan sejarah juga memiliki draf berbahasa Jawa. Jika sebuah halaman belum tersedia dalam bahasa Anda, halaman ditampilkan dalam bahasa Inggris (atau bahasa Indonesia bagi pembaca bahasa Jawa) disertai pemberitahuan — tidak pernah diberi label yang keliru. Huruf Thai, Khmer, Lao, Myanmar, dan Aksara Jawa hanya memuat fontnya saat dibutuhkan.",
      },
      {
        en: "All translated text was drafted with the help of an AI assistant from the cited sources. Indonesian and English are the editorial source languages; every other language is marked as a draft until a native speaker reviews it.",
        id: "Seluruh teks terjemahan disusun dengan bantuan asisten AI berdasarkan sumber yang dikutip. Bahasa Indonesia dan Inggris adalah bahasa sumber editorial; bahasa lainnya ditandai sebagai draf sampai ditinjau penutur asli.",
      },
    ],
  },
  {
    id: "access",
    title: { en: "Accessibility and performance", id: "Aksesibilitas dan performa" },
    paragraphs: [
      {
        en: "The site targets WCAG 2.2 AA: a skip link, landmarks, visible focus, keyboard-operable menus, lightbox and site plan, and text alternatives for every meaningful image. Pages are static files served from a global CDN, images are delivered as AVIF and WebP at several sizes, there are no third-party scripts, and motion is limited to opacity and transforms that respect reduced-motion settings. Content is fully readable with JavaScript turned off.",
        id: "Situs ini menargetkan WCAG 2.2 AA: tautan lewati, landmark, fokus yang terlihat, menu, lightbox, dan denah yang dapat dioperasikan dengan papan ketik, serta teks alternatif untuk setiap gambar bermakna. Halaman berupa berkas statis yang disajikan dari CDN global, gambar dikirim dalam format AVIF dan WebP dalam beberapa ukuran, tidak ada skrip pihak ketiga, dan animasi dibatasi pada opasitas dan transformasi yang menghormati pengaturan kurangi gerakan. Konten tetap dapat dibaca sepenuhnya tanpa JavaScript.",
      },
    ],
  },
];

/** Type specimen lines: deliberately the same in every language. */
export const SPECIMEN = {
  display: "Newsreader — Pendhapa Ageng, 1757",
  text: "Plus Jakarta Sans — Tiếng Việt · Bahasa · Español",
  scripts: [
    { lang: "jv-Java", text: "ꦩꦁꦏꦸꦤꦼꦒꦫꦤ꧀" },
    { lang: "th", text: "ไทย" },
    { lang: "km", text: "ខ្មែរ" },
    { lang: "lo", text: "ລາວ" },
    { lang: "my", text: "မြန်မာ" },
  ],
};

export const FONT_CREDITS = [
  { name: "Newsreader", by: "Production Type", license: "SIL Open Font License 1.1", url: "https://fonts.google.com/specimen/Newsreader" },
  { name: "Plus Jakarta Sans", by: "Tokotype", license: "SIL Open Font License 1.1", url: "https://fonts.google.com/specimen/Plus+Jakarta+Sans" },
  { name: "Noto Sans Javanese, Thai, Khmer, Lao, Myanmar", by: "Google / Noto project", license: "SIL Open Font License 1.1", url: "https://notofonts.github.io/" },
];

export const CODE_CREDITS = [
  { name: "React", license: "MIT" },
  { name: "React Router", license: "MIT" },
  { name: "Lucide icons", license: "ISC" },
  { name: "Zod", license: "MIT" },
  { name: "Fontsource", license: "MIT (packaging); fonts under their own licences" },
];
