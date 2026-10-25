# Local Taste Skill modifications

The installed `design-taste-frontend` skill is used as-is for its house rules,
lint, and inspector. Two local habits exist because of what the inspector
cannot do on this project.

## 1. The inspector's stitched full-page sheets are not layout evidence

`scripts/inspect.mjs` composites a full-page image from horizontal strips.
On this single-page portfolio the strips do not correspond to one viewport, so
the sheet misrepresents section rhythm, sticky previews, and column balance.
The inspector's numeric findings are still trusted; its screenshots are not.

Local replacement, written for this repo:

- `.taste-skill/shot.mjs` — captures the hero and Selected Work at 1440, 768,
  and 390 in real Chrome pages, one page per width, true viewport,
  `Page.captureScreenshot`, and records `scrollWidth` versus `innerWidth`.
- `.taste-skill/shot-sections.mjs` — the same method for any named sections,
  scrolling each to the top of its viewport before the capture.

Run them against the local preview server, not against a live site.

## 2. The inspector's picture floor does not fit this project

`few-pictures` counts raster images that are visible at measurement time. The
Selected Work screenshots are inside a sticky preview and a per-row mobile
image, so the inspector counts one. Adding stock photography to satisfy the
count would contradict the no-unlicensed-media rule and the approved design, so
this FAIL is reported rather than fixed.

## 3. Headings must keep one face

`mixed-font-headline` fires when a block that reads as a heading contains text
in two families, including a link label paired with its URL inside one list
item. Fix by setting the second family explicitly rather than by removing the
link.
