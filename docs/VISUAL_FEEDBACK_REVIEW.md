# Visual Feedback Review

Date: 2026-09-17

## Audit scope

This review evaluates the current homepage, incident archive, case-reading page, and source index against the supplied recommendation to make the Field Guide feel more like an exploratory publication and less like a designed database.

Evidence was captured from the running local product during this review at desktop width. The browser capture surface displayed the screenshots inline in the audit session but did not expose persistent screenshot file paths.

## Step 1 — Homepage entry

Health: good structure; visually repetitive.

The hero has strong hierarchy, clear orientation, and a distinctive editorial voice. The featured case, however, repeats the same relationship-graph language used later on the homepage and inside records. This makes the graph feel like a general-purpose texture instead of a special investigative tool.

The supplied feedback is correct that the featured area needs a different class of object. It should not automatically be a publisher screenshot: a documented artifact, an explicitly labeled source capture, or an original evidence-derived diagram would all work.

## Step 2 — Pattern and homepage discovery

Health: clear and usable; too uniform.

The three-column pattern grid is highly scannable but reads like a component catalogue. A single dominant pattern feature followed by smaller supporting records would create editorial pacing without making every tile unique. Arbitrary asymmetry would weaken comparison and mobile reflow, so the composition should remain systematic.

## Step 3 — Incident archive and case record

Health: strong research credibility; text-heavy.

The archive makes dates, event type, summaries, and relationships easy to compare. The case header and metadata matrix clearly separate canonical and Field Guide fields. Those are core strengths and should remain stable.

Selected cases would benefit from one evidence object near the top, especially where a public report figure, package listing, repository artifact, or official disclosure exists. Visuals should not become mandatory for every record: missing imagery is preferable to a weak, generic, or misleading asset.

## Step 4 — Sources

Health: credible and traceable; low browsing reward.

The source index is explicit about origin and does not infer unavailable classifications. It is excellent as an audit trail but visually flat as a discovery surface. Publisher grouping and selected source previews could improve exploration, provided hostname grouping remains transparent and every preview is manually curated.

## Assessment of the supplied recommendations

### Adopt

1. Replace the featured-case graph with a curated evidence object.
2. Move the detailed graph deeper into the record and keep `/network` as its primary exploration surface.
3. Introduce a reusable `StoryVisual` component and a validated visual metadata schema before adding assets.
4. Create more homepage pacing with one visual feature followed by compact archive rows.
5. Add restrained clip or crop reveals for major visuals, with reduced-motion parity.

### Modify

1. Do not make every important story visual. Make every visual evidentiary, and allow records to remain text-only.
2. Use one or two repeatable asymmetric compositions rather than giving every pattern tile a different treatment.
3. Group sources by publisher only as a derived navigation layer; preserve the individual source record and associated case beneath it.
4. Treat original diagrams as analyst interpretation. Label them `Field Guide diagram` and cite the exact relationships or procedure steps used.

### Reject for now

1. Cursor-following thumbnails. They add pointer-only behavior, distraction, and accessibility cost without improving traceability.
2. Broad parallax across article content. A single low-amplitude feature treatment is enough.
3. Runtime page screenshots or automatically scraped Open Graph images. They can change silently and undermine the pinned-data model.
4. Generic cyber, AI-generated, or decorative security imagery.

## Required data architecture

Before interface work, add an editorial visual manifest with fields equivalent to:

- stable visual ID;
- case or source association;
- kind: `source_capture`, `field_guide_diagram`, or `artifact`;
- repository-local asset path;
- original source URL;
- publisher or creator;
- capture/publication date when known;
- caption and useful alt text;
- provenance label;
- crop/focal-point metadata;
- rights or usage note;
- last-verified date.

The application should never fetch or generate these previews at runtime. The data build should fail for missing assets, missing attribution, invalid case references, or unsupported provenance values.

## Recommended sequence

1. Curate a three-case pilot: one source capture, one real artifact, and one Field Guide diagram.
2. Add and validate the visual manifest.
3. Build `StoryVisual` with source, artifact, and diagram variants.
4. Replace only the homepage featured graph and add one visual break within Recently Documented.
5. Evaluate the result before restructuring the pattern grid or source index.

## Accessibility and evidence limits

Source screenshots must have readable captions and must not be the only way to obtain their information. Hover-revealed details need focus and touch equivalents. Clip reveals and parallax must collapse to static presentation under reduced motion. This review does not establish full WCAG compliance or content-usage rights; those require keyboard/assistive-technology testing and per-asset rights review.
