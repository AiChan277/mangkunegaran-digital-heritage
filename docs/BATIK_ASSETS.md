# Batik ornament assets

Generated from `src/content/ornaments.ts` by `scripts/generate-docs.ts`. The files are built by `scripts/build-batik.py`; the original CC0 source file is kept in `assets-src/batik/`.

## Why kawung

- **Not parang.** mangkunegaran.id (“Motif Batik Mangkunegaran”, 13 Aug 2024) says that inside Pura Mangkunegaran parang is still a *larangan* motif reserved for the core family, and the official reservation page asks visitors not to wear parang or lereng. An unofficial site should not use it as decoration. (The earlier parang-style accent on this site has been removed.)
- **Mangkunegaran's own motifs** named in that article — Buketan Pakis, Sapanti Nata, Wahyu Tumurun, Parang Kesit Barong, Parang Sondhen, Parang Klithik Glebag Seruni, Liris Cemeng, Buketan Paris — have no openly licensed vector or reference image that we could verify.
- **Not truntum:** popular accounts link it to the Kasunanan court (not verified here), and the site must not mix the two courts' symbols.
- **Kawung** is a classical Javanese motif documented in a dated museum sample and available as a CC0 vector. It is **not** presented as a Mangkunegaran motif and no royal meaning is claimed for it.

## Assets

| id | file | motif | use | origin | modifications |
|---|---|---|---|---|---|
| `kawung-tile` | `public/ornament/kawung-tile.svg` | Kawung | Repeating field in page heroes (masked, low contrast) | adapted | Redrawn from the CC0 geometry as a 48-unit tile; leaves made rounder, two focal dots added to each leaf and leaf tips trimmed so a small lozenge stays open where four leaves meet, following the museum's description of RV-847-85. An adaptation, not a reproduction of the sample. |
| `kawung-border` | `public/ornament/kawung-border.svg` | Kawung | Thin border where a hero meets the paper content | adapted | Redrawn from the CC0 geometry as a 48-unit tile; leaves made rounder, two focal dots added to each leaf and leaf tips trimmed so a small lozenge stays open where four leaves meet, following the museum's description of RV-847-85. An adaptation, not a reproduction of the sample. One half-row of the tile, cut as a strip. |
| `kawung-flower` | `public/ornament/kawung-flower.svg` | Kawung (single flower of four leaves) | Section and period markers on dividers | adapted | Redrawn from the CC0 geometry as a 48-unit tile; leaves made rounder, two focal dots added to each leaf and leaf tips trimmed so a small lozenge stays open where four leaves meet, following the museum's description of RV-847-85. An adaptation, not a reproduction of the sample. A single four-leaf group. |

## Sources

- **Base vector:** Ragam Hias Jawa - Kawung (Polos).svg — Pinerineks (Wikimedia Commons user), own work, 2020-10-14. CC0 1.0 (no attribution required). https://commons.wikimedia.org/wiki/File:Ragam_Hias_Jawa_-_Kawung_(Polos).svg
- **Reference:** Batikpatroon 'Kawung picis' (RV-847-85) — Unknown batik maker, Nationaal Museum van Wereldculturen (Wereldmuseum), Netherlands, before 1891. Public domain (photograph as published on Wikimedia Commons) (no attribution required). https://commons.wikimedia.org/wiki/File:Collectie_NMvWereldculturen,_RV-847-85,_Batikpatroon,_%27Kawung_picis%27,_voor_1891.jpg

**Attribution used on the site and in the files:** Kawung ornament adapted by Kelompok 7 from a CC0 vector by Pinerineks (Wikimedia Commons), with reference to NMvW RV-847-85 'Kawung picis' (before 1891).

## How the ornament is used

- The SVG files are applied as CSS masks so they take the colour of their surface; CSS only colours, sizes and positions them. No batik is drawn with CSS gradients or pseudo-element shapes.
- `kawung-tile` — a low-contrast field behind hero text (13% opacity, faded towards the content).
- `kawung-border` — one thin row where every royal-green hero meets the paper content, above a gold hairline.
- `kawung-flower` — a single four-leaf mark in the gold `HeritageDivider` between sections, History chapters and in the footer.
- Motion: one entrance per page (fade and a 24 px slide for the field, fade for the border). Nothing loops; all of it is off under `prefers-reduced-motion`.
