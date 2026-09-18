# Prototype Instructions

## Durable product direction

- Use Trail of Bits as an interaction and pacing reference only: persistent navigation, publication-style indexes, technical visual surfaces, and crisp hover feedback. Do not copy its warm cream-on-charcoal skin, Inter Tight display face, or orange-red brand accent.
- Visual identity is the maker’s, not Trail of Bits and not a clone of Elicit. Pull cool night surfaces, JetBrains Mono labels, semantic status color, and 2px instrument chrome from Elicit; pull geometric display (Jost) and quiet atmosphere from Thumper. Keep this site as an essay with oversized type and air — a night instrument you can read, not a lab console.
- Borrow pacing, density, motion grammar, and tactile behavior without copying branding, artwork, layouts, or content.
- Research credibility, explicit provenance, and the distinction between incidents, research demonstrations, and analyst interpretation take priority over visual spectacle.
- Treat pinned MITRE ATLAS data as canonical and Field Guide material as a separate editorial layer.
- Prefer progressive disclosure over analyst-console density: introduction, one featured evidence object, a compact expandable relationship summary, then recent records.
- Use attributed source excerpts when the dataset lacks a rights-cleared local image; never imply that a reconstructed or generated visual is an evidentiary source capture.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Curiosity pilot direction (2026-09-17)

- Build for technically curious readers who do not necessarily know security frameworks. Favor guided rabbit holes: every onward click should reveal an unexpected, explained connection.
- Keep oversized typography and interactive explanations on cool night surfaces, Jost display, JetBrains Mono labels, `#e5484d` as a precision mark, and semantic trail colors. Use a curious expert voice with concise visual explanation.
- The first complete trail is “Who’s directing the attack?”: shared-artifact coordination (AML.CS0068), orchestrated teamwork (AML.CS0071), then a single adaptive agent (AML.CS0070).
- Lead with a hook and narrative with nearby receipts; technical mappings, procedure paths, and metadata belong in expandable sections. Event type, unsuccessful outcomes, and attribution limits remain visible.
- Authored trails are a separate editorial layer, never canonical ATLAS relationships. Label diagrams as explanations, not source captures.
- Keep Home and Cases in primary navigation. Recurring, Techniques, Network, Sources, and About live under Reference. Keep routes and search usable. Validate this three-case pilot before extending its narrative treatment to all records.

## Critique to keep (2026-09-17)

- The homepage is the trail map, not a single incident: one question, three separate cases, three organizations. Cards show a signature of the arrangement. The playable mechanism opens the case, immediately after the hook. Mark the first card as the start; the other two are skips.
- Give the mechanism full width and make steps visually transform (isolated runs → shared board → coordination). Captions-only boxes that clip on desktop are not enough.
- How it works steps stay distinct on the three chooser tabs (cool setup, the case trail color, `#e5484d`). The diagram keeps the case color and changes shape. Sequential arrows live with the heading, not in a second bar under the diagram. Each step: short verbs in the boxes, an “in this step” caption, then a paragraph of evidence—do not restate the tab title or narrate the picture. A click must restyle the reading block (step color, wash, arrival) so the copy is as noticeable as the diagram.
- Soften the cliff off the trail. Standard records reached from the trail (e.g. LAMEHUG) keep an explicit “leaving the essay” notice and the pinned-account heading, not a sudden MITRE dump.
- Recast chrome for a non-framework reader: Recurring lives under Reference; trail breadcrumbs use the mechanism name. Maker credit sits in the footer. Receipts name the report title from the case source records.
- Trail copy should land for a non-specialist, a manager, and a practitioner in the same sentence. Name artifacts, counts, and products where the pinned record names them, not on every chrome string. Unsuccessful outcomes and attribution limits stay visible. Ban AI-sounding antithesis and aphorisms (“X is not Y”, paired “The A was B. The C became D.”). Field Guide interpretation stays labeled editorial.
- Copy must follow the pinned record. Do not fill gaps with implied intent, success, or attribution.
- Case titles are plain sentences from the pinned account, not fragment slogans or MITRE-abstract stiffening at display size. Keep the unsuccessful 0004 outcome scoped to autonomous attempts in the recovered session; manual workspace activity stays a separate line.
- Homepage cards keep an arrangement signature. Put product sequences, counts, and the plot on the case page. A short unsuccessful hint may stay on the 0004 card so adaptation is not read as success.
