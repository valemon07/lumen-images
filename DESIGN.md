---
name: Lumen
description: A lit table you lay photos out on, and Lumen labels them.
colors:
  flash-yellow: "oklch(0.852 0.199 91.936)"
  marker-ink: "oklch(0.2 0 0)"
  lit-table: "oklch(1 0 0)"
  slide-mount: "oklch(0.88 0.004 106)"
  table-wash: "oklch(0.955 0.003 106)"
  pencil-grey: "oklch(0.47 0.008 106)"
  hairline: "oklch(0.86 0.004 106)"
  field-stroke: "oklch(0.62 0.008 106)"
  safelight-red: "oklch(0.53 0.2 27)"
  unlit-table: "oklch(0.185 0 0)"
  unlit-card: "oklch(0.22 0.002 106)"
  unlit-mount: "oklch(0.285 0.003 106)"
  unlit-wash: "oklch(0.26 0.003 106)"
  chalk-ink: "oklch(0.955 0.004 106)"
  unlit-pencil: "oklch(0.74 0.008 106)"
  unlit-hairline: "oklch(0.32 0.004 106)"
  unlit-field-stroke: "oklch(0.55 0.008 106)"
  unlit-safelight-red: "oklch(0.68 0.19 25)"
typography:
  display:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "4.5rem"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "3rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.035em"
  page-title:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.035em"
  title:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.55
  body:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Hanken Grotesk, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.4
  tape:
    fontFamily: "Kalam, cursive"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.375
rounded:
  none: "0px"
  sm: "0.15rem"
  base: "0.25rem"
spacing:
  gutter-sm: "16px"
  gutter-md: "32px"
  gutter-lg: "64px"
  grid-gap: "16px"
  table-gap: "24px"
  section: "128px"
components:
  button-primary:
    backgroundColor: "{colors.flash-yellow}"
    textColor: "{colors.marker-ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-primary-lg:
    backgroundColor: "{colors.flash-yellow}"
    textColor: "{colors.marker-ink}"
    rounded: "{rounded.sm}"
    padding: "0 24px"
    height: "48px"
  button-outline:
    backgroundColor: "{colors.lit-table}"
    textColor: "{colors.marker-ink}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  button-destructive:
    backgroundColor: "{colors.safelight-red}"
    textColor: "{colors.lit-table}"
    rounded: "{rounded.sm}"
    padding: "0 14px"
    height: "36px"
  input:
    backgroundColor: "{colors.lit-table}"
    textColor: "{colors.marker-ink}"
    rounded: "{rounded.sm}"
    padding: "4px 10px"
    height: "32px"
  mount:
    backgroundColor: "{colors.slide-mount}"
    rounded: "{rounded.none}"
    padding: "6%"
  tape:
    backgroundColor: "{colors.flash-yellow}"
    textColor: "{colors.marker-ink}"
    typography: "{typography.tape}"
    rounded: "{rounded.none}"
    padding: "2px 10px"
  chip:
    backgroundColor: "{colors.lit-table}"
    textColor: "{colors.marker-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  dialog:
    backgroundColor: "{colors.lit-table}"
    textColor: "{colors.marker-ink}"
    rounded: "{rounded.sm}"
    padding: "24px"
---

# Design System: Lumen

## Overview

**Creative North Star: "The Lightbox"**

Lumen is a lit table. Photos lie on it in grey slide mounts, Lumen writes down what it sees in each one, and yellow tape groups the ones that belong together. In light mode the table is backlit white; in dark mode it is the same table with the light switched off, charcoal under grey-brown mounts. The photographs are the brightest, most colourful thing on any screen, and everything else is ink, grey and one flash of yellow.

The system is flat and drawn. Structure comes from black marker rules (1.5px), hairline dividers, mounts and white space, never from cards, gradients or glow. Type is a single grotesque used at two extremes: heavy, tightly tracked headlines and plain medium-weight UI. The only hand-drawn element is the tape label. Density is generous on the landing page and calm but working in the signed-in app, which inherits the same world at a quieter volume.

Motion is reserved for the mount. On the landing page a mount turns over to show its reading; in the app, opening a photo lifts its mount off the table into the dialog. Nothing else is choreographed.

**Key Characteristics:**
- Backlit white / unlit charcoal table, grey slide mounts around every photo.
- Flash yellow only as a fill under ink: the primary action, tape labels, text selection.
- Hanken Grotesk 900 for headlines, 500 to 600 for UI; Kalam 700 only on tape.
- One structural line weight (1.5px ink), plus 1px hairlines for dividers and fields.
- Near-square corners; mounts and tape are fully square.
- One authored motion per surface, always about the mount.

## Colors

A neutral, very slightly warm grey table (hue 106, chroma under 0.01) with one saturated flash yellow and a darkroom red for destruction.

### Primary
- **Flash Yellow** (oklch(0.852 0.199 91.936)): the primary action fill ("Start your lightbox", "Upload photos"), tape labels, the sidebar's active primary, and `::selection`. Identical in light and dark; it is the one colour that does not dim when the light goes off. Always carries Marker Ink text on top.

### Neutral
- **Lit Table** (oklch(1 0 0)): page, card and popover background in light mode.
- **Slide Mount** (oklch(0.88 0.004 106)): the grey frame around every photo and the skeleton fill. Hover darkens it by mixing 10% foreground in oklch.
- **Table Wash** (oklch(0.955 0.003 106)): secondary, muted and accent surfaces; empty bar tracks; ghost and outline hover.
- **Marker Ink** (oklch(0.2 0 0)): all text in light mode, the 1.5px structural rules, focus ring, data bars, and the text on every yellow fill in both modes.
- **Pencil Grey** (oklch(0.47 0.008 106)): secondary text, counts, captions, row labels in readings.
- **Hairline** (oklch(0.86 0.004 106)): 1px dividers between reading rows and list items.
- **Field Stroke** (oklch(0.62 0.008 106)): input borders, dashed empty-state outlines, scrollbar thumb.
- **Safelight Red** (oklch(0.53 0.2 27), text oklch(1 0 0)): destructive actions only.
- **Dark mode** (the unlit table): Unlit Table (oklch(0.185 0 0)) page, Unlit Card (oklch(0.22 0.002 106)) cards and popovers, Unlit Mount (oklch(0.285 0.003 106)), Unlit Wash (oklch(0.26 0.003 106)), Chalk Ink (oklch(0.955 0.004 106)) text, rules and ring, Unlit Pencil (oklch(0.74 0.008 106)), Unlit Hairline (oklch(0.32 0.004 106)), Unlit Field Stroke (oklch(0.55 0.008 106)), and Unlit Safelight Red (oklch(0.68 0.19 25)) with near-black text (oklch(0.17 0 0)).

### Named Rules
**The Flash Under Ink Rule.** Yellow is only ever a fill with Marker Ink (oklch(0.2 0 0)) on top. It is never text, never a line on white, never an icon colour, never a data bar.

**The Photos Are The Colour Rule.** Apart from yellow and the destructive red, the UI is achromatic. If a screen looks colourful, the colour should be coming from the photographs.

**The Ink Data Rule.** Bars and quantities are drawn in foreground ink on a Table Wash track. Yellow labels a group; it never measures one.

## Typography

**Display Font:** Hanken Grotesk (with sans-serif)
**Body Font:** Hanken Grotesk (with sans-serif)
**Label Font:** Kalam 700 (with cursive), tape labels only

**Character:** one grotesque pushed to extremes, black-weight and tightly tracked for anything that names a place, plain and unadorned for everything you operate. Kalam is the handwriting on the tape and nowhere else.

### Hierarchy
- **Display** (900, 4.5rem at lg, 3.75rem sm, 2.75rem mobile, line-height 0.95, -0.04em): landing hero and the signed-in home headline ("Your lightbox"). Max about 13ch; always smaller in visual weight than the photo row under it.
- **Headline** (900, 3rem at sm, 2.25rem mobile, line-height 1, -0.035em): landing section heads.
- **Page Title** (900, 2.25rem at sm, 1.875rem mobile, line-height 1, -0.035em): signed-in page h1, sitting on a 1.5px ink rule. Auth page titles use the same weight at 2.25rem with -0.04em.
- **Title** (700, 1.25rem, -0.025em): section heads inside a page ("Latest on the table"), above a 1.5px ink rule with a right-aligned link.
- **Lead** (400, 1.125rem, Pencil Grey, max 60ch): the paragraph under a headline.
- **Body** (400, 1rem): reading tables, forms, general copy.
- **Label** (500 to 600, 0.875rem; 0.75rem for group labels): buttons, nav, captions, counts. Sentence case, no uppercase tracking.
- **Wordmark** (900, 1.5rem, tight tracking): "Lumen", set in type.

### Named Rules
**The One Hand Rule.** Kalam appears only inside a tape label. Headings, buttons, captions and empty states never borrow it.

**The Tabular Count Rule.** Numbers in tables, times and counts (`data-numeric`) use tabular figures.

## Layout

A single full-width canvas with fixed side gutters (16px mobile, 32px from 640px, 64px from 1024px). The landing page is a headline band with the action on the right, then a horizontal, snap-scrolling row of square mounts (15rem, 18rem, 21rem wide) that bleeds off the right edge, then sections spaced 96px (128px at lg). Two-column sections split 7:5 photo to text.

The signed-in app uses the shadcn sidebar (wordmark, grouped nav with small grey group labels) beside a content column. Every page opens with a header: page title on a 1.5px ink rule, actions right-aligned. Photo grids are square mounts with 16px gaps; section heads are Title type on a 1.5px rule. Auth pages are a top bar with the wordmark and a single centred 24rem column.

## Elevation & Depth

The table is flat. Depth is conveyed by the mount (a grey frame around the photo), by ink rules, and by the lift transition, not by shadow at rest. Only things that float above the table (dialogs, popovers, dropdowns, sheets, the album chooser) carry one tight, low drop shadow plus a 1px hairline border.

### Shadow Vocabulary
- **Float** (`box-shadow: 0 12px 32px -16px rgb(0 0 0 / 0.35)`): overlays only. The negative spread keeps it a contact shadow, not a halo.

### Named Rules
**The Flat Table Rule.** Nothing on the table casts a shadow. Mounts, tape, buttons and sections stay flat; only overlays float.

## Shapes

Corners are near-square. The base radius is 0.25rem and controls render at the small step (0.15rem, about 2.4px): buttons, inputs, dialogs, popovers, menus. Mounts, tape, chips, skeletons, data bars and empty-state outlines are fully square (0). Tape sits rotated by 1 to 2 degrees (-2deg, -1deg or 1deg) as if pressed on by hand. Empty and drop zones use a 1.5px dashed Field Stroke outline. Avatars and pills are not part of the language.

## Components

### Buttons
Square-shouldered and inked.
- **Shape:** near-square (0.15rem), 1.5px border, semibold 0.875rem label; 36px tall, 48px with 1rem text at large.
- **Primary:** Flash Yellow fill, Marker Ink text, 1.5px ink border (yellow border in dark). Hover mixes 12% foreground into the yellow. Disabled drops to Table Wash with grey text and a hairline border, never a faded yellow.
- **Outline:** background fill with a 1.5px ink border; hover to Table Wash. The default secondary action.
- **Destructive:** Safelight Red fill and border with light text; hover mixes 14% foreground. Inline delete triggers use the outline shape in red, filling red on hover.
- **Ghost / Link:** ghost hovers to Table Wash; link is ink text with a 2px yellow underline that turns ink on hover.
- **Focus:** 2px foreground outline, 2px offset, everywhere.

### Mount (signature)
The grey slide mount is the photo's frame everywhere a photo appears.
- **Style:** Slide Mount fill, square, aspect 1:1 in grids, photo `object-contain` inside with 6% padding (9% on the landing row and group thumbnails, 4% in the dialog).
- **Hover:** fill darkens by mixing 10% foreground in oklch.
- **Loading:** a pulsing 10% foreground window inset 12% until the image loads; the image fades in over 300ms.
- **Landing turn:** hover (fine pointers) or press flips the mount 180deg on Y (500ms, cubic-bezier(0.16, 1, 0.3, 1), 1400px perspective) to its reading: a square card with a 1.5px ink border, "Read by Lumen · sample", and a label/value list. Reduced motion swaps the flip for a 200ms cross-fade.
- **App lift:** opening a photo carries the mount into the dialog with one fixed View Transition name, `lifted-mount`, held by one element at a time: the clicked grid card for the old snapshot, the dialog mount only while lifting. The group is clipped and moves over 420ms (cubic-bezier(0.16, 1, 0.3, 1)); both snapshots are contained (`object-fit: contain`), and the old square card fades out in 120ms so it never ghosts over the dialog's text. The root cross-fades in 180ms. The dialog shows the grid's already-loaded image until the large one arrives, so the lift never lands on an empty mount. The dialog's own enter animation is disabled so the lift is the only motion. Reduced motion or no support opens instantly.

### Tape (signature)
- **Style:** Flash Yellow fill, Marker Ink text in Kalam 700 at 1.125rem (1rem on album tiles), 2px by 10 to 12px padding, square, rotated 1 to 2 degrees.
- **Use:** names a group of photos: shared labels on the landing table, album names, insight categories, home habit labels. It labels, it never counts.

### Reading
- **Style:** a two-column definition list (8rem label column), Pencil Grey labels, semibold values, 1px hairline under each row, headed by a 1.5px ink rule. Same order and wording everywhere: Subjects, Setting, Time of day, Weather, Mood, Composition, Palette.

### Chips
- **Style:** 1px Hairline border, square, 2px by 8px, 0.875rem text, transparent fill. Used for flat lists of tied labels; no selected state.

### Cards / Containers
- **Corner Style:** none; content groups are sections divided by rules, not boxes.
- **Dialogs:** popover background, 0.15rem radius, 1px hairline, 24px padding, Float shadow.

### Inputs / Fields
- **Style:** 32px tall, 1px Field Stroke border, transparent fill, 0.15rem radius.
- **Focus:** border turns to ring ink plus the global 2px outline.
- **Error:** no field-error state is part of the system yet. The inherited shadcn `aria-invalid` ring (3px destructive at 20%/40%) on Input and Button is a leftover no surface triggers; it is not a rule to inherit.

### Navigation
- **Landing:** wordmark left, plain text links right, underline on hover.
- **App sidebar:** 0.75rem semibold grey group labels, 0.875rem medium items with 16px line icons.

### Data bars (Insights)
- **Style:** 8px square track in Table Wash, foreground ink fill, minimum 2% so a nonzero count stays visible; counts in tabular grey to the right.

## Do's and Don'ts

### Do:
- **Do** put every photo in a Slide Mount, square, with the photo contained, never cropped to fill.
- **Do** use Flash Yellow (oklch(0.852 0.199 91.936)) only as a fill under Marker Ink: one primary action per view, tape labels, selection.
- **Do** separate sections with a 1.5px ink rule under a heavy title, and rows with 1px hairlines.
- **Do** set headlines in Hanken Grotesk 900 with negative tracking (-0.035em to -0.04em) and keep them visually lighter than the photos beside them.
- **Do** draw quantities in foreground ink on a Table Wash track.
- **Do** give every authored motion a reduced-motion fallback (cross-fade or instant).
- **Do** keep dark mode the same table unlit: same yellow, mounts one step above the page.

### Don't:
- **Don't** set yellow text, yellow lines or yellow icons on white, and don't colour data bars yellow.
- **Don't** use Kalam outside a tape label.
- **Don't** add gradients, glows or soft halos; the only shadow is the tight Float under overlays.
- **Don't** wrap content in rounded, shadowed cards; use mounts, rules and space.
- **Don't** add a second orchestrated transition; motion belongs to the mount.
- **Don't** round mounts, tape, chips or bars.
