---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/home"]
---

# Landing page + app world (Lumen Lightbox)

Scope: `/` (Persuade) sets the world; `/home/*` and auth pages inherit it at Operate restraint.
Audience: hobbyist photographers (plus portfolio reviewers). Action: sign up ("Start your lightbox"). Proof: the user's own photos with Lumen's tags; sample tags labeled as sample.
Constraints: no hype, no invented stats; light and dark mode; WCAG 2.2 AA; flows unchanged.
User steers: keep Lumen's flash yellow; headline smaller than the photos; dark mode must hold.

## Direction contract

THESIS: Lumen is a lit table you lay photos out on and Lumen labels them. Refuses the split hero with a product screenshot and the three-feature-card row.

OWN-WORLD: Backlit white table (#FFFFFF) / unlit charcoal table in dark (#141414); grey slide mounts (light #DADAD6, dark #2A2A28) framing every photo; flash yellow (existing --primary, ~#F2C21B) only as fills under black text: tape labels, the primary action; black marker type (#151515 / #F2F2EE). Hanken Grotesk 900 for headings, 500 for UI; Kalam only on tape labels. One 1.5px line weight, square corners, no gradients, no glow, no soft halos.

STORY: The visitor sees their kind of photo already read (subjects, setting, mood, composition), understands Lumen groups by what's in the picture, signs up free and private.

FIRST VIEWPORT: Top band: wordmark left, "How it reads photos" + "Log in" right; 72px (4.5rem) headline "Lay out your photos. Lumen reads them." left, yellow "Start your lightbox" button right with "Free, and private to you." Below, a row of 320px mounted photos bleeding off the right edge, two yellow tape labels grouping them. Photos take most of the viewport.

FORM: Lightbox, grounded candidate from the safer re-roll, pinned by user steers; seed:6f4ba0e3167a7762. Signature interaction: hovering/focusing a mount turns it over to its typed tag record; opening a photo in the app lifts its mount off the table (one orchestrated transition).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
