# Decisions

Significant trade-offs made while building v1 (October 2026). Newest last.

## Stack and rendering

**React Router 8 framework mode, `ssr: false`, every route prerendered.** Each locale gets an explicit route subtree (`/id`, `/en`, …) instead of a `:lang` parameter. This lets unknown prefixes fall through to a 404, and lets each locale have its own prerendered `404.html`, which Cloudflare's `not_found_handling: "404-page"` serves as the nearest 404. Cost: the client route manifest lists 12 copies of each route (~3.6 KB gzipped).

**Custom i18n layer instead of i18next.** The brief asked for i18next + react-i18next. We use a ~1 KB message loader instead: each route loader reads only that page's namespace JSON for that locale at build time, and the strings arrive inside the prerendered HTML / `.data` payload. That avoids shipping i18next (~15 KB gzipped) and its client-side initialisation, which would conflict with prerendered hydration. The file layout (`locales/<lang>/<namespace>.json`), key checks and lint rule follow the brief.

**TypeScript 5.9, not 7.0.** `typescript-eslint` 8.72 supports TypeScript `<6.1`; TypeScript 7 would break linting. Revisit when typescript-eslint supports it.

**Zod validation at module load.** Every content collection calls `parseAll(schema, data)` when imported. Route loaders run at build time, so an invalid entry fails the build; `scripts/check-sources.ts` additionally checks every cross-reference.

## Budgets

**Initial JS on the home page is ~129 KB gzipped (target 120 KB).** Measured from the production build: React 19 + React Router runtime ≈ 107 KB, site code ≈ 22 KB. The overage is the framework floor plus the 12-locale route manifest. Options if it must come down: drop client hydration on purely static pages (losing client-side navigation and the language menu's keyboard behaviour), or move to a lighter framework. We kept the current stack.

**Fonts.** Newsreader uses the weight-only variable files (122 KB for regular + italic, Latin) instead of the optical-size files (279 KB). No font is preloaded, so the hero photograph gets the bandwidth; metric-matched fallbacks (computed from the font files) keep layout shift at zero. Noto script fonts are named in the font stack only on pages in that language; language names shown elsewhere (selector, footer, home) use the device's own fonts, so Latin pages never download Thai/Khmer/Lao/Myanmar fonts. Noto Sans Javanese (34 KB) does load on every page, because every page title carries its Aksara Jawa form.

**One stylesheet.** `cssCodeSplit: false` bundles all CSS into one file (~10 KB compressed) instead of a chain of nine small render-blocking files; this moved first paint from ~2.6 s to ~1.8 s in local Lighthouse runs.

**No hreflang/canonical until `SITE_URL` is set.** hreflang requires absolute URLs; relative ones are invalid and Lighthouse flags them. They switch on automatically once the domain is known.

## Content honesty

**Opening hours and prices are not shown.** The official reservation page and CNN Indonesia (March 2026) give different hours (09.00–16.00 vs 09.00–14.30). Per the "sources differ" rule we show neither and link to the official page.

**Dates where sources disagree are shown with both values**: the Treaty of Salatiga (17 vs 13 March 1757) and the end of Mangkunegara VIII's reign (1987 vs 1962).

**Wood source for the Pendhapa pillars.** Sources name different forests (Donoloyo vs Kethu); the site says only "a forest in the Wonogiri hills".

**Rekso Pustoko is not on the site plan.** Its location ("left of the pamedan") is stated only by Wikipedia, so it gets an Architecture section but no hotspot.

**No compass on the site plan.** The palace's south-facing orientation is stated only by Wikipedia. The plan shows the gate at the bottom and says it is schematic.

**Visitor pictograms only for rules on the official reservation page.** "Remove footwear in some areas" and "no tripods" (CNN Indonesia) are recorded in the ledger but not shown, because the official page does not list them. Photography is shown as "professional cameras need permission", not as a blanket ban.

**All text drafted with an AI assistant.** Indonesian and English are the editorial source languages; every other language, and all Aksara Jawa, is labelled as a draft until a native speaker reviews it.

## Community-requested features

**Language switcher uses native names, not flags.** Flags stand for countries, not languages (Spanish, English and Malay span many countries; Javanese has none). A short code badge (`ID`, `JV`, `TH`…) gives the at-a-glance look.

**The 🔊 Listen button is real, not a placeholder.** It uses the browser's built-in speech engine (Web Speech API) and appears only when the browser has a voice for the text's language. A dummy icon would have broken the "no fake features" rule.

**Aksara Jawa titles are presentational for screen readers** (`aria-hidden`), because the Latin heading already carries the accessible name and screen readers rarely voice Javanese script well. Each is marked "awaiting native review".

**The site plan is an original schematic**, drawn from written descriptions, not traced from official, copyrighted or satellite plans.

## Images

**Three photos excluded** where the palace crest is the main subject (Pendhapa gable detail, Pracimayasa interior, uncropped Pringgitan). The Pringgitan photo is used as a crop below the crest. The crest appears incidentally, small, in some wide architectural views — as part of the building, never as branding.

**No photograph of the Dalem Ageng interior** was available under an open licence; the homepage step uses a typographic panel instead.

## Security

**Two-layer CSP.** `_headers` sends a policy for all pages; `scripts/postbuild.ts` adds a per-page `<meta>` CSP whose `script-src` lists the sha256 of that page's inline hydration scripts. Browsers enforce both, so the effective script policy is strict and hash-based. `style-src` allows `'unsafe-inline'` for React style attributes (focal points, placeholder colours).

## Iteration 2 — History experience

**Floating language control instead of a header dropdown.** A fixed button in the bottom inline-end corner opens a modal `<dialog>` (`showModal()`): the browser handles focus containment, Esc and the top layer, and focus returns to the button on close. A click on the backdrop closes it. Below 560 px wide (or 520 px tall, e.g. at high zoom) the panel becomes a bottom sheet. The button keeps clear of `env(safe-area-inset-*)`, and the footer has extra end padding so the button never covers the last line of a page. The footer's plain language list stays, so every page links to every language without JavaScript.

**Translation status in the panel is stated in words**, not just a badge: "Complete", "AI-draft translation · some pages in Indonesian" (Javanese), "AI-draft interface · most content in English" (Tier 3). The dot beside each also changes shape (filled / half / hollow), so colour is not the only cue.

**History translations are partial on purpose.** Only short fields (titles, dates, summaries) were drafted for the ten non-editorial languages; extended explanations stay in English (Indonesian for Javanese) rather than be machine-drafted at length without review. A new status, `partial`, records this in `src/i18n/config.ts`, the About table and `docs/TRANSLATION_STATUS.md`. Every fallback paragraph carries its real `lang`.

**Heritage colour layers are tokens, not new colours everywhere.** Paper, royal green and muted gold were added as semantic tokens on top of the iteration-1 palette, with contrast ratios computed and noted in `tokens.css`. Muted gold (`--gold-muted`, 3.1:1 on paper) is used only for ornament; large numerals use `--gold-display` (≥3.4:1 on both paper tones) and small gold text uses `--gold-text` (≥5:1). The green is "pareanom-inspired"; nothing claims it is an official colour.

**(Superseded — see “Design-system correction”.) The parang accent is original and small.** It is a 24 × 16 px S-curve tile drawn for this project (not a reproduction of a specific batik pattern), masked onto a strip at most 280 px wide that drifts one tile every 9 seconds using `transform` only. It is clipped (`overflow: hidden`, `contain: paint`), so it cannot cause overflow or layout shift, and it stops under `prefers-reduced-motion`. The tile is a file in `public/ornament/` rather than a `data:` URI so the CSP can keep `img-src 'self'`.

**No recording means no player pretending to have one.** (The standalone documentary section was later replaced by per-chapter audio — see below.) The documentary scripts are complete and fact-checked, but nobody has narrated them. Generating a synthetic voice or a placeholder file would be a fake feature, so the player shows "Not yet recorded" with a disabled play button and the full transcript. Duration is shown as an estimate from the word count, labelled as such. The playable code path (real `<audio>` with custom controls) exists but has not been exercised against a real file.

**Scripts are Markdown, parsed at build time.** The loader imports each script with `?raw` and parses chapters, narration and pauses with `src/content/audio-script.ts`; `check:sources` parses the same files and fails if chapter ids, track ids, versions or statuses disagree, or if a script cites an unknown fact.

**Archive scans are shown as published.** No vintage filter, no crops, no tonal changes; each sits on a plain mount with the institution's own catalogue date and title. Where two catalogues date the same view differently (Woodbury & Page pendhapa: "before 1874" vs "c. 1880"), both are shown. Candidates are linked only. Delpher refused automated requests (HTTP 403) and was not worked around.

**Page weight.** The English History page is ~62 KB gzipped HTML plus ~30 KB of route data, mostly the two transcripts and 23 entries' extended text, which are in the HTML so they work without JavaScript and are indexable. The History route's own JavaScript is ~6 KB gzipped.

## Design-system correction — identity across the whole site

**Royal green comes from the official site, as a reference.** The deep green `#11301b` and the sand gold `#e4c588` were sampled from mangkunegaran.id's computed styles (its Tailwind colours `bush-500` and `crayola-500`) on 2026-10-21. They are recorded in the fact ledger as a *design reference*; nothing on the site claims they are an official colour specification. The previous green `#2e4a3b` was replaced everywhere through the tokens (`--green-pareanom` now aliases the new green), so no component carries its own colour.

**One hero component, many compositions.** `PageHero` is used by every public page (and the 404s and language picker); the home hero shares its field, frame and edge. Variants change composition, not identity: architecture and culture pair the text with a framed photograph, history with an archival photograph, gallery with a strip of three archival images, stories and articles centre the title as in a publication, visit puts the official booking action first, about stays institutional. The header and footer are royal green too, so the identity frames every page. Each hero ends in a kawung border, a gold hairline and generous paper whitespace.

**Batik: kawung, not parang.** The official article “Motif Batik Mangkunegaran” says parang remains a *larangan* motif inside the Pura, reserved for the core family, and the reservation page asks visitors not to wear parang or lereng. The iteration-2 parang-style accent — an original S-curve, i.e. a generic path that only resembled batik — was removed. The Mangkunegaran creations named in that article have no openly licensed vector or reference we could verify. Kawung is used instead: a CC0 vector from Wikimedia Commons, adapted with reference to a dated museum sample (NMvW RV-847-85, before 1891), documented in `src/content/ornaments.ts` and `docs/BATIK_ASSETS.md`, and never presented as a Mangkunegaran motif. Truntum was not used because popular accounts tie it to the Kasunanan.

**The SVG is the artwork; CSS only places it.** Ornaments are CSS masks over the SVG files, so they take their surface colour. No pattern is drawn with gradients or pseudo-element shapes (a test checks there are no `repeating-*-gradient` rules). The files are static assets so the CSP keeps `img-src 'self'`. Motion: one entrance per page (fade plus a 24 px slide for the field), never a loop, off under reduced motion.

**Audio belongs to chapters.** The standalone documentary section is gone. Each historical chapter (period) has one audio control; individual timeline events do not, because they are too short to justify narration. Audio configuration is data (`src/content/chapter-audio.ts`): a new language or a real recording is a data change. With no recording, the control shows “Not yet recorded” and no play button, no duration and no waveform — the previous “about 11 minutes (estimated)” label was removed because an estimate for a recording that does not exist could be mistaken for one. The narration text written in iteration 2 is referenced as the chapter's script, not duplicated, and no new script collection was created. The scripts' sections were renamed to match the chapters (version 1.1); the wording is unchanged.

**History depth comes from the official history archive.** Seven entries were added from mangkunegaran.id articles read on 2026-10-21. Each is single-source and says so where it matters. One official article gives Mangkunegara VI's reign as 1896–1911 while the official rulers list gives 1896–1916; the new entries avoid restating either.

**Page weight.** The English History page is now ~66 KB gzipped HTML plus ~33 KB of route data (30 entries' extended text and both narration texts, in the HTML so they work without JavaScript). The three ornament SVGs total 3.4 KB.

## Translation warnings removed from pages

At the owner's request, pages no longer show translation warning banners, per-entry “AI-draft translation” tags or the footer draft line. Translation status is still stated in two places: the floating language panel (“Complete”, “AI-draft translation · some pages in Indonesian”, “AI-draft interface · most content in English”) and the translation-status table on the About page (`docs/TRANSLATION_STATUS.md`). Fallback text keeps its real `lang` attribute, so screen readers and browsers still treat it as English or Indonesian.

