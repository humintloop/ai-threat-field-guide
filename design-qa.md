# Design QA — AI Threat Field Guide

Date: 2026-09-16

## Visual sources

- Source visual truth: live Trail of Bits homepage at `https://trailofbits.com/`, captured and inspected in the browser QA session.
- Implementation captures: live production preview at `http://127.0.0.1:4173/`, including `/incidents`, `/incidents/ATFG-RD-0001`, and `/network?q=EchoLeak`, captured and inspected in the same browser QA session.

## Comparison

- Visual hierarchy: matched the reference's persistent rail, slim utility bar, oversized editorial headline, featured research surface, compact section markers, and publication-like archive rows. The Field Guide graph replaces decorative source artwork so the visual remains data-driven.
- Composition: preserves the reference's wide/open hero rhythm followed by denser research indexes, while using original Field Guide navigation, content structure, graph layouts, and branding.
- Typography: Inter Tight Variable provides the large editorial display voice; IBM Plex Mono is limited to evidence metadata, dates, IDs, and provenance.
- Spacing: desktop margins, section separation, rules, and archive-row density were checked at the live preview width. Long case titles wrap without clipping.
- Color and contrast: near-black canvas, warm-white type, raised charcoal surfaces, restrained red-orange state accents, and cool graph-node distinctions remain legible without relying on color alone.
- Responsive behavior: CSS breakpoints replace the side rail with a compact menu, collapse metadata and record layouts, disable the canvas graph below tablet size, and expose the equivalent list-first relationship view.
- Content accuracy: no illustrative incident media was added. Counts, dates, case types, mappings, procedure steps, sources, and version labels are rendered from the generated canonical/editorial dataset.
- Interactions: global search, URL-backed incident filters, URL-backed network filtering, route reset-to-top, keyboard links, active navigation, hover transitions, and reduced-motion rules were inspected or exercised.
- Accessibility: the incident archive passes an automated axe check; the graph is paired with a keyboard-accessible relationship list that mirrors the currently filtered edges.

## Iterations completed

1. Fixed route transitions retaining the previous page's scroll position.
2. Replaced the partial pattern-only network fallback with an exact filtered edge list covering both Field Guide and MITRE ATLAS relationships.
3. Added technique links to the small-screen case-network fallback.
4. Split production vendor chunks so the build no longer emits an oversized-bundle warning.
5. Clarified evidence copy to distinguish pinned ATLAS references from attributed Field Guide additions.

final result: passed
