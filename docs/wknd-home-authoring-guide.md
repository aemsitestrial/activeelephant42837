# WKND-Style Homepage — Authoring Guide

A step-by-step guide to assemble a WKND-style homepage in the Universal Editor
using the project's blocks. All block code is already built and deployed.

## Blocks available for this page

| Block | Purpose | Fields (per item) |
|-------|---------|-------------------|
| Carousel | Rotating full-width hero slides | Slide: Image, Alt Text, Text (headline + copy + button) |
| Teaser | Featured image + copy + CTA | Image, Alt Text, Text |
| Cards | Article / adventure grid | Card: Image, Text |
| Hero | Single full-width banner | Image, Alt Text, Text |
| Title / Text / Button | Default content | — |

## Page structure to build (top to bottom)

1. Header (automatic)
2. Carousel — hero slides
3. Teaser — featured adventure
4. Title "Recent Articles" + Cards (3 cards)
5. Title "Next Adventures" + Cards (3 cards)
6. Footer (automatic)

---

## Step 1 — Create the page
In the Universal Editor, create a page (e.g. `/wknd-home`). Header and footer
appear automatically.

## Step 2 — Carousel (hero)
1. Add a **Carousel** block to the first section.
2. Add 2–3 **Carousel Slide** items. For each slide:
   - **Image**: pick an asset with the asset picker (never paste a URL).
   - **Alt Text**: a short description.
   - **Text**: add a heading (H1/H2) and a short line of copy. Optionally add a
     button by typing link text and linking it.
3. Slides auto-rotate every 6s; visitors can use the arrows/dots.

## Step 3 — Teaser (featured)
1. Add a new section, then a **Teaser** block.
2. **Image**: pick the featured image.
3. **Text**: heading + paragraph + a "Read More" button (link).
On desktop the image sits left, copy right; it stacks on mobile.

## Step 4 — Recent Articles
1. New section. Add a **Title** (H2) = "Recent Articles".
2. Add a **Cards** block; add 3 **Card** items.
3. Each Card: pick an **Image** and enter **Text** (an H3 title + short snippet).

## Step 5 — Next Adventures
Repeat Step 4 with the Title "Next Adventures" and 3 more Cards.

## Step 6 — Styling
The buttons use the gold accent automatically. To make a section stand out,
select the **Section** and set its **Style** field to `highlight`.

## Step 7 — Preview & Publish
Use the editor's preview toggle to check rendering, then **Publish**.

---

## Tips
- Always set images through the **Image field's asset picker**, not by pasting a
  URL into text — pasted URLs render as links.
- The carousel, teaser, hero, and grid blocks all auto-convert remote AEM Assets
  image references into images, so external-delivery assets work too.
- Keep slide/teaser copy short so text stays readable over images.
