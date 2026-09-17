# Design QA — Calmer Evidence Ledger Homepage

Date: 2026-09-17

## Comparison target

- Source visual truth: `/Users/aaron/.codex/generated_images/01a0ad5e-453a-79d0-8f80-b4aa8a5ff4a5/exec-3849cbd4-3a00-4280-a4eb-a71832e26248.png`
- Source pixels: 1487 × 1058.
- Implementation: `http://127.0.0.1:4173/`, captured in the Codex in-app browser at a 1440 × 1024 CSS viewport with device density 1.
- Mobile implementation: the same route, captured at a 390 × 844 CSS viewport with device density 1.
- State: desktop default/collapsed relationship summary, desktop expanded relationship summary, mobile default, and mobile navigation open.
- Normalization: the source and implementation were emitted together in the same browser comparison result. Their small pixel-size difference was treated as viewport framing rather than a density mismatch.

## Full-view comparison evidence

The selected concept and rendered desktop were compared together at the top of the page. The implementation preserves the concept's persistent rail, utility bar, two-column editorial hero, large evidence surface, source/case distinction, thin rules, near-black palette, and restrained red accent. The intentional simplification moves the relationship analysis out of the evidence card and into a collapsed disclosure below the hero. Recent records begin below the first viewport.

The complete page and scrolled mid/lower sections were also inspected. Recently documented records, the dataset ledger, three-pattern editorial block, evidence index, relationship network, and separately labeled research demonstration remain visually distinct and readable.

## Focused comparison evidence

- Featured evidence: the mock's source screenshot was replaced by a source excerpt because the seed has no rights-cleared local image or image provenance. It uses only the seeded source title, URL, publisher hostname, and provenance origin and is explicitly labeled `Source excerpt`.
- Relationship disclosure: verified case, Field Guide pattern, and MITRE ATLAS technique links were exercised in the open state. The first six techniques are shown, with the remainder deferred to the full case record.
- Mobile navigation: the 390 × 844 layout was inspected with the menu closed and open. Navigation remained available without horizontal overflow.
- Browser console: checked after desktop and mobile interaction; no errors were reported.

## Required fidelity surfaces

- Fonts and typography: Inter Tight Variable and IBM Plex Mono remain consistent with the target. The hero was reduced from the mock's more imposing scale so its explicit line breaks fit without creating five competing display lines. Metadata remains small but readable and uses the mono face only where it conveys provenance or taxonomy.
- Spacing and layout rhythm: the hero uses two clear zones, followed by a single low-profile disclosure. Large section gaps create publication pacing; dense information starts only after the lead evidence. Mobile stacks actions, evidence, and records in reading order.
- Colors and visual tokens: existing near-black, warm-white, charcoal, muted gray, and red-orange tokens match the selected direction. Red is reserved for active navigation, markers, and provenance cues.
- Image quality and asset fidelity: no generated or reconstructed image is presented as evidence. The missing rights-cleared source capture is handled as an attributed source excerpt instead of a placeholder or fabricated screenshot.
- Copy and content: visible titles, IDs, dates, counts, provenance labels, patterns, and techniques come from the generated pinned dataset. No source classification, mapping, or outcome was added for visual completeness.

## Comparison history

1. P2 — The first desktop pass retained a five-line hero and exposed all 22 ATLAS techniques when expanded, recreating the intimidating density the refinement was meant to solve.
   - Fix: reduced the desktop display scale, rebalanced hero columns, and limited the expanded relationship preview to six techniques plus a link to the complete case record.
   - Post-fix evidence: the settled 1440 × 1024 capture shows a calmer three-part hero rhythm; the expanded view preserves traceability without rendering the full technique set.
2. P2 — An immediate post-load capture showed incomplete reveal states.
   - Fix: QA captures now wait for the one-time entrance motion to settle before comparison. Reduced-motion behavior remains covered by the existing CSS rule.
   - Post-fix evidence: settled desktop and mobile captures show all above-the-fold content at full opacity.

## Findings

- No actionable P0, P1, or P2 issues remain.
- P3: a future rights-cleared visual manifest could replace the source excerpt with a true local source capture while retaining the same component anatomy.

## Primary interactions tested

- Opened and closed the relationship summary.
- Opened and closed the mobile navigation.
- Verified internal record links and external source affordances are represented as semantic links.
- Confirmed the source excerpt and record detail remain understandable without hover.

## Implementation checklist

- [x] Keep initial evidence and relationship information progressive.
- [x] Preserve seeded provenance and canonical relationships.
- [x] Keep incident and research-demonstration treatment separate.
- [x] Verify desktop and mobile composition.
- [x] Check browser console errors.
- [x] Run typecheck, tests, production build, and Pages output preparation.

final result: passed
