# Mangkunegaran — A Living Heritage · *Concept*

A multilingual, accessible, editorial website that reimagines how **Pura Mangkunegaran** (Surakarta, Central Java, Indonesia) could present its heritage online.

It has two jobs:

1. **An educational concept redesign** for a Pancasila course: showing how Indonesian cultural heritage can be shared through accessible, multilingual digital design.
2. **A portfolio sample for Kelompok 7**, built to hold up when someone opens it on a cheap Android phone over 4G.

> [!IMPORTANT]
> **Disclaimer** (shown in the footer of every page and on the About page)
>
> **EN:** Independent concept redesign by Kelompok 7 for educational and portfolio purposes. Not affiliated with, endorsed by, or operated by Pura Mangkunegaran. For official information, visit [mangkunegaran.id](https://mangkunegaran.id).
>
> **ID:** Konsep desain ulang independen oleh Kelompok 7 untuk tujuan edukasi dan portofolio. Tidak berafiliasi dengan, tidak didukung oleh, dan tidak dikelola oleh Pura Mangkunegaran. Informasi resmi: [mangkunegaran.id](https://mangkunegaran.id).

> [!NOTE]
> **Status: v1 built and tested locally, not yet deployed.** All pages exist in all 12 languages and pass the automated checks (see [Verification](#verification)). Deploying needs a Cloudflare login, and two settings need owner input: `SITE_URL` and a Javanese reviewer. See [Needs owner input](#needs-owner-input).

---

## Table of contents

- [Ground rules](#ground-rules)
- [What's on the site](#whats-on-the-site)
- [History and visual identity](#history-and-visual-identity)
- [Community-requested features](#community-requested-features)
- [Languages](#languages)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Scripts](#scripts)
- [Project variables](#project-variables)
- [Content workflows](#content-workflows)
- [Design system](#design-system)
- [Accessibility and performance](#accessibility-and-performance)
- [Deployment (Cloudflare)](#deployment-cloudflare)
- [Verification](#verification)
- [Needs owner input](#needs-owner-input)
- [Documentation](#documentation)
- [Credits and licences](#credits-and-licences)

---

## Ground rules

These override everything else in the project, including feature requests.

| Rule | What it means in practice |
|---|---|
| **No impersonation** | No official emblem, crest, seal or logo anywhere (favicon, OG images, loaders included). The site has its own wordmark and its own design, and says "Concept" next to the name everywhere. |
| **No fabrication** | No invented dates, events, quotes, titles, meanings, hours, prices, booking links, contacts, testimonials or statistics. If it can't be verified, it's left out. |
| **Every fact has a source** | Each claim cites a fact in the ledger (`src/content/sources.ts`, mirrored in `docs/FACT_LEDGER.md`). The build fails if a page cites an unknown fact, or if Wikipedia is a fact's only source. |
| **Where sources disagree, say so** | e.g. the Treaty of Salatiga (17 vs 13 March 1757) and opening hours (not shown at all: the official page and the press disagree). |
| **Rights-safe images only** | Openly licensed (Wikimedia Commons) or public-domain photos, self-hosted, credited where shown. No AI-generated "historical" images. |
| **Honest translations** | The status of every language is stated in the language panel and in the translation-status table on the About page. Missing content falls back to English (Indonesian for Javanese), marked with the correct `lang`. Pages carry no warning banners. |
| **Two separate institutions** | Pura Mangkunegaran and Keraton Kasunanan Surakarta Hadiningrat are distinct; their histories are never merged. |

**Spelling convention:** the institution is *Mangkunegaran*, as on the official site. Rulers are written *Mangkunegara I–X*; the official site writes *Mangkoenagoro*. Variants such as *Mangkunagaran* appear only in source titles.

---

## What's on the site

All pages are prerendered static HTML at locale-prefixed URLs (`/id/history`, `/th/gallery`, …).

| Route | Contents |
|---|---|
| `/` | Picks a language (saved choice → browser language → Indonesian) and redirects. Without JavaScript it is a plain list of the 12 languages. |
| `/:lang` | Home: hero, sourced introduction, architectural journey (Pamedan → Pendhapa Ageng → Pringgitan → Dalem Ageng), stories, arts band, photo mosaic, dated "cultural continuity" ledger, multilingual section |
| `/:lang/history` | Four historical chapters (1725 → today), each with an introduction, an archival lead image and its own audio control (synthetic AI narration in Indonesian and English, labelled as such); a 30-entry sourced timeline whose entries open to show background, what happened, people, why it matters, what is uncertain and per-entry sources; an archival exhibition of 14 catalogued items plus 2 unverified candidates; the list of rulers |
| `/:lang/architecture` | Seven spaces with sources, an original line diagram, and an archival photo |
| `/:lang/culture` | Batik Mangkunegaran, Bedhaya Bedhah Madiun, Serat Wedhatama (with a stanza chart), gamelan and wayang |
| `/:lang/stories` and `/:lang/stories/:slug` | Three sourced stories: Solosche Radio Vereeniging, the panembrama for the King of Siam, and the Legion of Mangkunegaran — with reading-progress bar, footnoted sources, related reading |
| `/:lang/gallery` | 21 photographs with an accessible lightbox (keyboard, swipe, licence shown inside) |
| `/:lang/visit` | Link to the official booking page (hours/prices not reproduced), address, 17 visitor pictograms, interactive site plan |
| `/:lang/about` | Case study, Pancasila and diversity, full fact ledger, image/font credits, translation status table |
| 404 | A localized 404 per language plus a bilingual site-wide one |

---

## History and visual identity

| Part | What it is | Where |
|---|---|---|
| Timeline | 4 chapters (periods), 30 entries with stable ids. Each entry has a short summary and opens (native `<details>`, works without JavaScript) to background, what happened, people, why it matters, what is uncertain, its own sources, archive figures and related stories. Turning points are marked with a filled green marker **and** the words "Turning point". Seven entries were added from further mangkunegaran.id history articles (the Estri Ladrang Mangungkung troop, Tasikmadu, schools and the Studiefonds, the 1901 electricity company, the Kali Samin hydro plant, the Ponten bathhouse, the 1942 end of SRV). | `src/content/history.ts`, `src/app/routes/history.tsx` |
| Translations | Indonesian and English are complete. Every other language has AI-draft titles, dates and summaries keyed by the same entry ids; longer text falls back to English (Indonesian for Javanese), and every fallback paragraph carries its real `lang`. | `src/content/history-translations/` |
| Chapter audio | Audio belongs to each historical chapter, not to a separate section. Each chapter has an Indonesian and an English entry in `src/content/chapter-audio.ts` (stable chapter id, language, audio URL, status, transcript reference, measured duration, credits). Every chapter has a **synthetic (AI) narration** made by `scripts/generate-voice-over.ts` with Microsoft Edge neural voices (id-ID-ArdiNeural, en-GB-RyanNeural); no human narrator has recorded it. The player says "AI voice" in every language, shows play/pause, seek, current time and measured duration, mute, loading and error states, and downloads nothing until play is pressed (mono MP3, 48 kbps, 0.3–1.8 MB per chapter). A chapter without a file would show "Not yet recorded" and no play button. The narration text written in iteration 2 (`content/audio/`) is referenced, not duplicated. | `src/components/ChapterAudioPlayer.tsx`, `docs/AUDIO.md` |
| Archive | 14 confirmed items (13 Leiden University Libraries / KITLV photographs and a postcard under CC BY 4.0, 1 public-domain Rijksmuseum painting) shown unfiltered and uncropped with catalogue date, creator, institution, licence and a link to the catalogue record; 2 candidates linked but not reproduced. | `src/content/archive.ts`, `docs/ARCHIVE_RESEARCH.md` |
| Identity | Royal green `#11301b` and antique gold `#e4c588`, sampled from mangkunegaran.id's own stylesheet as a design reference (not an official specification), over the existing ivory paper. Every public page opens with a royal-green `PageHero` in a page-specific variant and ends in a kawung border and a gold hairline. Batik is a documented vector (kawung), never CSS-drawn; parang is deliberately not used. | `src/styles/tokens.css`, `src/components/PageHero.tsx`, `docs/BATIK_ASSETS.md` |

---

## Community-requested features

Requested in the team's group chat, all built — adjusted where needed to follow the ground rules.

1. **Language switcher** — since iteration 2, a floating button in the bottom corner (clear of phone safe areas) opens a panel listing every language by its native name, with a search box, the current language, and a plain statement of how complete each translation is ("Complete", "AI-draft translation · some pages in Indonesian", "AI-draft interface · most content in English"). **No flags**: a flag stands for a country, not a language (Javanese has none; Spanish and English span many countries). Works by mouse, touch and keyboard (arrows, Home/End, type to filter, Esc, outside click), returns focus to the button, keeps you on the same page, and remembers your choice. The footer keeps a plain list of language links that works without JavaScript. → `src/components/LanguageControl.tsx`
2. **Visitor pictograms** — 17 original icons for the rules on the **official reservation page**: dress (modest clothing; no shorts, parang/lereng batik, velvet, head coverings, sunglasses, flip-flops), professional cameras need permission, no outside food, smoking, weapons, keep off the grass, use the bins, guided visits, arrive 15 minutes early, cashless payment, children 0–4 free. A ring with a bar = not allowed; a plain ring = please do. Each has a text label in all 12 languages. Rules we couldn't verify on the official page (e.g. tripods, footwear) are not shown. → `src/components/Pictogram.tsx`, `src/content/etiquette.ts`
3. **🔊 Listen button** — real, not a placeholder: it reads the section aloud with the browser's built-in speech engine (no cost, no server). It only appears when the browser has a voice for that language, so it's never a dead button. → `src/components/ListenButton.tsx`
4. **Aksara Jawa titles** — every page title and space name has its Javanese-script form (e.g. ꦥꦼꦤ꧀ꦝꦥ ꦲꦒꦼꦁ), labelled "awaiting native review" until a Javanese speaker checks it. → `src/content/aksara.ts`
5. **Interactive site plan (denah)** — an original schematic plan on the Visit page; tap a number to see the place's name, Aksara Jawa, photo, summary and relevant pictograms. A text list of the same places sits beside it. Drawn from written descriptions (not traced from any map), labelled "not to scale", and never implies a space is open to visitors. → `src/components/SitePlan.tsx`
6. **Extras** — tap/hover definitions for Javanese terms (*kadipaten, pamedan, pendhapa, pringgitan, dalem, panembrama*), and each place has its own link (`/en/architecture#pendhapa-ageng`).

---

## Languages

| Code | Native name | Tier | Interface | Editorial content |
|---|---|---|---|---|
| `id` | Bahasa Indonesia | 1 | original | all pages |
| `en` | English | 1 | original | all pages |
| `jv` | Basa Jawa | 2 | AI draft (krama) | Home + History (AI draft); other pages shown in Indonesian |
| `ms` `th` `vi` `fil` `km` `lo` `my` `tet` `es` | Bahasa Melayu, ไทย, Tiếng Việt, Filipino, ខ្មែរ, ລາວ, မြန်မာ, Tetun, Español | 3 | AI draft | History: period and entry titles, dates and summaries (AI draft); everything else shown in English |

Thai, Khmer, Lao and Burmese pages load their Noto font only on pages in that language; language names elsewhere use the device's own fonts. Full table: `docs/TRANSLATION_STATUS.md` (generated).

---

## Tech stack

| Area | Choice |
|---|---|
| Framework | React 19 + TypeScript 5.9 (strict) + Vite 8 |
| Rendering | React Router 8 framework mode, `ssr: false`, every locale × route prerendered (146 HTML files) |
| Styling | CSS Modules + global tokens, bundled into one small stylesheet |
| i18n | Small custom loader (route loaders read `locales/<lang>/<namespace>.json` at build time) — see `docs/DECISIONS.md` for why not i18next |
| Content | Typed TypeScript modules validated with Zod when loaded (an invalid entry fails the build) |
| Icons | `lucide-react` + original pictogram SVGs |
| Fonts | Newsreader + Plus Jakarta Sans + Noto Sans (Javanese, Thai, Khmer, Lao, Myanmar), self-hosted WOFF2 via Fontsource |
| Images | `sharp` pipeline → AVIF + WebP at several widths |
| Tests | Playwright + axe-core; Lighthouse |
| Hosting | Cloudflare Workers static assets (or Pages) |

No backend, database, CMS, analytics, third-party scripts or secret keys.

---

## Project structure

```
.
├─ src/
│  ├─ app/
│  │  ├─ root.tsx            html shell, <html lang>, global styles
│  │  ├─ routes.ts           route table (one subtree per locale)
│  │  └─ routes/             home, history, architecture, culture, stories, story,
│  │                         gallery, visit, about, 404s, root language picker
│  ├─ components/            Header, LanguageControl (floating), Footer, Picture,
│  │                         Lightbox, SitePlan, Pictogram, ListenButton,
│  │                         PageHero, BatikOrnament, HeritageDivider,
│  │                         ArchivalImage, ChapterAudioPlayer, ScriptTitle,
│  │                         Glossary (terms), Refs + SourceList (footnotes), …
│  ├─ content/
│  │  ├─ schema.ts           Zod schemas
│  │  ├─ sources.ts          fact ledger + sources
│  │  ├─ assets.ts           image manifest (licence, author, alt text)
│  │  ├─ home.ts history.ts spaces.ts culture.ts about.ts
│  │  ├─ history-translations/   draft titles + summaries per language
│  │  ├─ archive.ts          archival exhibition manifest (confirmed + candidates)
│  │  ├─ chapter-audio.ts audio-script.ts   per-chapter audio config + script parser
│  │  ├─ ornaments.ts        batik asset record (source, licence, adaptation)
│  │  ├─ etiquette.ts aksara.ts glossary.ts
│  │  ├─ articles/           one file per story (en + id records)
│  │  └─ images.generated.json   sizes + placeholder colours (generated)
│  ├─ i18n/
│  │  ├─ config.ts           locales, native names, fallbacks, status registry
│  │  └─ locales/<lang>/<namespace>.json
│  ├─ lib/ hooks/ styles/    helpers, useReveal/useSpeech, tokens/base/fonts/lang CSS
│  └─ site.ts                project variables (from .env)
├─ public/                   images/ (generated), og/ (generated), icons, _headers, manifest
├─ content/audio/<lang>/     narration text referenced by chapter audio (Markdown)
├─ assets-src/batik/         original CC0 kawung vector (source of public/ornament/)
├─ images-raw/               licensed originals + _commons-metadata.json; archive/ scans
├─ scripts/
│  ├─ translations/<lang>.json   translator-friendly files (all namespaces)
│  ├─ split-translations.ts  → src/i18n/locales/<lang>/*.json
│  ├─ check-i18n.ts check-sources.ts postbuild.ts
│  ├─ optimize-images.ts generate-og.ts generate-docs.ts serve-static.ts
│  ├─ generate-voice-over.ts tts-lexicon.ts   synthetic chapter narration
├─ tests/                    Playwright specs (smoke, layout, interaction, history, a11y, scripts)
├─ docs/                     FACT_LEDGER, ASSET_MANIFEST, TRANSLATION_STATUS, ARCHIVE_RESEARCH,
│                            AUDIO (generated), DECISIONS
├─ wrangler.jsonc  .env.example  .nvmrc  eslint.config.js  playwright.config.ts
```

---

## Getting started

Requirements: **Node.js 24** (see `.nvmrc`) and npm.

```bash
npm install
```

```bash
cp .env.example .env
```

```bash
npm run dev
```

Open the URL it prints (usually `http://localhost:5173/id`).

To see the real production build the way Cloudflare serves it:

```bash
npm run build
```

```bash
npm run serve
```

Then open `http://localhost:4173`.

---

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Checks sources and translations, prerenders all 146 pages, then adds per-page CSP, 404 pages, sitemap and robots.txt |
| `npm run serve` | Serves `build/client` locally like Cloudflare (clean URLs, nearest 404, compression) |
| `npm run preview` | Build, then run it in Cloudflare's local runtime (`wrangler dev`) |
| `npm run typecheck` | Route type generation + `tsc` |
| `npm run lint` | ESLint, including the rule that blocks hardcoded UI text in components |
| `npm run check:i18n` | Every locale has every key, no extras, no empty values, matching `{{variables}}` |
| `npm run check:sources` | Every fact, source, image, Aksara and glossary reference resolves; every image has a licence and alt text |
| `npm run i18n:split` | Turn `scripts/translations/<lang>.json` into the per-namespace locale files |
| `npm run images` | Convert `images-raw/` into AVIF/WebP sizes in `public/images/` |
| `npm run og` | Regenerate app icons and Open Graph cards |
| `npm run voice-over:sample` | About one minute per candidate voice in `sample-audio/` (git-ignored), for choosing a voice |
| `npm run voice-over` | Synthetic (AI) chapter narration from `content/audio/` into `public/audio/`; prints measured durations for `src/content/chapter-audio.ts` |
| `npx tsx scripts/generate-docs.ts` | Regenerate the fact ledger, asset manifest and translation status docs |
| `npm run test:e2e` | Playwright suite against the production build (run `npm run build` first) |
| `npm run test:a11y` | axe-core scan of the Indonesian and English pages |
| `npm run verify` | typecheck → lint → build → tests |
| `npm run deploy` | Build and deploy to Cloudflare Workers |
| `npm run deploy:pages` | Build and deploy to Cloudflare Pages |

First-time test setup: `npx playwright install chromium webkit firefox`.

---

## Project variables

Set in `.env` (copy from `.env.example`). Blank values are allowed; whatever depends on them is skipped, never faked.

| Variable | Current value | Used for | If blank |
|---|---|---|---|
| `SITE_URL` | *(blank)* | canonical URLs, hreflang, sitemap, `og:url` / `og:image` | those tags and `sitemap.xml` are omitted |
| `STUDIO_NAME` | Kelompok 7 | disclaimer, footer, JSON-LD author/publisher | defaults to Kelompok 7 |
| `STUDIO_URL` | *(blank)* | credit link | credit shown without a link |
| `CONTACT_EMAIL` | *(blank)* | About page | not shown |
| `JAVANESE_REVIEWER` | *(blank)* | who approved Javanese text | all Javanese stays "awaiting native review" |
| `IMAGE_STRATEGY` | open-license | documentation only | — |
| `DEPLOY_TARGET` | workers | documentation only | — |

---

## Content workflows

### Add a fact to the ledger
1. Add a source to `SOURCES` in `src/content/sources.ts` (title, publisher, URL, access date, kind).
2. Add a fact to `FACTS`: a short claim, where it's used, its source ids, and confidence (`confirmed` = 2+ sources, `single-source`, or `disputed`). Wikipedia can corroborate but never be the only source.
3. If sources disagree, mark it `disputed`, explain in `notes`, and say so on the page.
4. Run `npx tsx scripts/generate-docs.ts` to refresh `docs/FACT_LEDGER.md`.

### Add a story
1. Create `src/content/articles/<slug>.ts` exporting `en` and `id` records (copy an existing story). Blocks: `p`, `h2`, `figure`, `quote`, `note`; paragraphs list their `factIds`, which become numbered footnotes.
2. Add the slug to `src/content/articles/slugs.ts` and register it in `src/content/articles/index.ts`.
3. Write `[[term]]` or `[[term|label]]` to link a glossary term.
4. `npm run build` — the story is prerendered in all 12 languages (falling back where needed).

### Add an image (with licence steps)
1. Find an openly licensed photo (usually Wikimedia Commons) and confirm the subject is identified correctly. Avoid photos where the palace crest is the subject.
2. Save the original as `images-raw/<id>.jpg` — never hotlink.
3. Add an entry to `src/content/assets.ts`: subject, source page, original file URL, author, exact licence + URL, attribution text, alt text in `en` and `id`, intended use, focal point.
4. Run `npm run images`, then `npm run check:sources`.

### Add or review a translation
- Interface text: edit `scripts/translations/<lang>.json`, then `npm run i18n:split` and `npm run check:i18n`. English lives directly in `src/i18n/locales/en/`.
- After a native speaker reviews a language, update its status in `src/i18n/config.ts` (`uiStatus` / `contentStatus`) and regenerate the docs.
- Javanese: once reviewed, set `JAVANESE_REVIEWER` and change Aksara entries in `src/content/aksara.ts` to `reviewed`.
- Never use `text-transform: uppercase` on non-Latin scripts; `lang.css` handles per-script line heights.

### Add a site-plan hotspot or visitor rule
- Hotspot: give the space in `src/content/spaces.ts` a `plan: { x, y, factIds }`, only if a non-Wikipedia source states where it is.
- Rule: verify it on the official reservation page, add a fact, add an entry in `src/content/etiquette.ts`, add the label to `visit.rules.items` in every language.

---

## Design system

"Modern Javanese Editorial": a museum catalogue, not a tourism brochure.

- **Palette** (`src/styles/tokens.css`): royal green `#11301b` and antique gold `#e4c588` (sampled from mangkunegaran.id as a design reference — not an official colour specification), ivory paper `#f5efe2` / `#ebe2cf`, brass `#a8833a` for ornament with `#76591f` for small gold text, ink, terracotta. Header, page heroes, bands and footer are royal green; reading content stays on paper. All text pairs pass WCAG AA (ratios noted in the file, checked by axe).
- **Type:** Newsreader (display) and Plus Jakarta Sans (text, designed in Jakarta), with metric-matched fallbacks so text doesn't jump when fonts load.
- **Layout:** 12-column grid, asymmetric compositions, oversized numerals, thin gold rules. One shared `PageHero` with page variants (photographic, archival, literary, practical, institutional).
- **Batik:** one motif family — kawung — as SVG files in `public/ornament/` (a hero field, a border row, a single flower in the gold divider). Sources, licence and adaptation notes in `docs/BATIK_ASSETS.md`.
- **Motion:** transform/opacity only, one easing curve, hero intro under 1.2 s, scroll reveals that never hide content without JavaScript or with reduced motion.

---

## Accessibility and performance

- WCAG 2.2 AA target: skip link, landmarks, one `h1` per page, visible focus, 44 px targets, keyboard-operable menu/drawer/lightbox/site plan, `lang` on every foreign term, readable with JavaScript off.
- Strict CSP: `_headers` plus a per-page `<meta>` CSP with sha256 hashes of the page's inline scripts.
- Measured locally (see below): JS on the home page ≈ 129 KB gzipped (target 120 KB; the React + React Router runtime alone is ≈ 107 KB — see `docs/DECISIONS.md`).

---

## Deployment (Cloudflare)

Static output is in **`build/client`**. You need a Cloudflare account and `npx wrangler login` once.

### Workers with static assets (default)
`wrangler.jsonc` serves `build/client` with `html_handling: "drop-trailing-slash"` and `not_found_handling: "404-page"`.

```bash
npm run deploy
```

### Cloudflare Pages
Build command `npm run build`, output directory `build/client`. Or from the CLI:

```bash
npm run deploy:pages
```

After the first deploy, put the URL in `.env` as `SITE_URL`, rebuild and redeploy: that turns on canonical links, hreflang, `sitemap.xml` and absolute Open Graph images.

---

## Verification

Results from the last local run (2026-10-21, after the design-system correction). Nothing here was measured on a deployed site.

| Check | Result |
|---|---|
| `tsc` | ✅ 0 errors |
| ESLint (incl. no hardcoded UI text) | ✅ 0 errors |
| `check:i18n` | ✅ 12 locales × 9 namespaces, 269 keys each |
| `check:sources` | ✅ 72 facts, 39 sources, 36 images resolve; history links, archive manifest, chapter audio, narration scripts and batik asset record validated (2 facts recorded but not cited on a page) |
| Build | ✅ 146 prerendered pages (12 locales × 12 routes + 2), each with `lang`, title and one `h1` |
| Playwright smoke (144 pages) | ✅ 200, correct `lang`, title, one `h1`, disclaimer, no console errors |
| No horizontal overflow (360/768/1280/1920 px × id/en/th/my/vi) | ✅ |
| Language switch keeps page + back/forward; root redirect; no-JS root | ✅ |
| Floating language panel: keyboard only, filter, Esc, outside click, focus return, phone bottom sheet, translation status shown | ✅ |
| History: progressive disclosure (with and without JS), draft-translation fallbacks with `lang`, one audio control per chapter and none per entry, unrecorded audio shows no play button/duration/progress, narration language switch + script, new sourced entries, archive record links and licences | ✅ |
| Royal-green hero on every public route (12 routes checked incl. 404, id and th), one `h1` inside it, paper below | ✅ |
| Batik: masks reference the kawung SVG files, which are served as SVG; no CSS repeating gradients; ornament motion runs once and is off under reduced motion | ✅ |
| Drawer, lightbox, site plan by keyboard | ✅ |
| 404 pages (localized + root) | ✅ |
| Content visible without JS, with reduced motion, after fast scrolling | ✅ |
| axe-core, 22 Indonesian + English pages, History with every entry and the transcript open, Thai History, the open language panel | ✅ 0 serious/critical |
| Script rendering (jv, th, km, lo, my) | ✅ Chromium and WebKit, fonts confirmed loaded; ⚠️ **not run in Firefox** — Firefox would not launch in this environment (`spawn UNKNOWN`) |
| Audio playback controls | ⚠️ **not exercised** — synthetic recordings now exist (2026-10-21) and a Playwright test for the AI label and no-download-before-play was added, but the Playwright suite has not been re-run since |
| Lighthouse | ⚠️ **local only, iteration 1** — see below; not re-run after iteration 2; must be re-run on the deployed URL |

**Lighthouse (mobile emulation, simulated slow 4G + 4× CPU), local production build served with compression, 2026-10-20:**

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/en` | 85 | 100 | 100 | 100 | 3.7 s | 0 | 0 ms |
| `/en/stories/panembrama` | 91 | 100 | 100 | 100 | 3.2 s | 0 | 0 ms |
| `/en/gallery` | 88 | 100 | 100 | 100 | 3.9 s | 0 | 0 ms |

LCP misses the 2.5 s target in this setup; the main cost is the ~107 KB framework JavaScript competing with the hero photo on a slow connection. These numbers are not shown on the About page, which waits for measurements from the deployed site.

---

## Needs owner input

- **`SITE_URL`** — the final domain (turns on canonical, hreflang, sitemap, OG image URLs).
- **A native Javanese reviewer** for the Javanese text and all Aksara Jawa titles (currently marked as drafts).
- **A listen-through** of the synthetic narration (pronunciation of Javanese and Dutch names; then set `status: "reviewed"`), and optionally **human narrators** to replace it. A historian to review the scripts and timeline.
- **Manual archive research** in Delpher (it refuses automated access) and a reading of the Darmo-Kondo 1916 candidate.
- **Native reviewers** for the other AI-drafted languages, if wanted.
- **A Cloudflare login** to deploy, then a Lighthouse run on the live URL.
- Optional: `STUDIO_URL` / `CONTACT_EMAIL`, and permission requests if official palace photographs are ever wanted.

---

## Documentation

| File | Purpose |
|---|---|
| `docs/FACT_LEDGER.md` | Every claim, its sources, access date and confidence (generated) |
| `docs/ASSET_MANIFEST.md` | Every image, licence, author, alt text and attribution (generated) |
| `docs/TRANSLATION_STATUS.md` | Status of each language, the History draft translations and each Aksara Jawa title (generated) |
| `docs/ARCHIVE_RESEARCH.md` | Archive method, confirmed items with records and licences, candidates and why they are not confirmed (generated) |
| `docs/AUDIO.md` | Chapter audio status per chapter and language, how to regenerate the synthetic narration, and how to record one chapter with a human narrator (generated) |
| `docs/BATIK_ASSETS.md` | Batik ornament record: why kawung (and not parang), sources, licences, adaptation (generated) |
| `docs/DECISIONS.md` | Trade-offs: no flags, real speech, i18n approach, JS budget, what was left out and why |

---

## Credits and licences

- **Photographs:** Wikimedia Commons contributors and the Tropenmuseum / Nationaal Museum van Wereldculturen collection, under CC BY-SA 3.0 / 4.0 or public domain; every credit is on the image and on the About page.
- **Archive:** Leiden University Libraries, KITLV collection (CC BY 4.0) and the Rijksmuseum, Amsterdam (public domain); each item links to its catalogue record.
- **Fonts:** Newsreader (Production Type), Plus Jakarta Sans (Tokotype), Noto Sans scripts (Google) — SIL Open Font License 1.1.
- **Code libraries:** React, React Router, Zod (MIT), Lucide (ISC), Fontsource (MIT).
- **Licences:** code under [MIT](LICENSE); original text, translations and artwork under CC BY-SA 4.0; photographs and fonts under their own licences — see [CONTENT-LICENSE.md](CONTENT-LICENSE.md).
- **Official information** about Pura Mangkunegaran: [mangkunegaran.id](https://mangkunegaran.id).

Made by Kelompok 7 as an independent concept for education and portfolio use.
