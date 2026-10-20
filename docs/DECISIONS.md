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
