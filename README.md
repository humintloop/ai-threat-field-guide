# AI Threat Field Guide

An editorial research archive for tracing documented AI security cases through recurring threat patterns and official MITRE ATLAS techniques. The interface is designed as an intelligence workspace rather than a dashboard: every relationship is inspectable, provenance is visible, and incidents remain distinct from research demonstrations.

## Data model

The application never fetches live data at runtime. Its production dataset is generated from two versioned layers:

- `data/upstream/atlas/ATLAS-2026.09.yaml` — the pinned canonical MITRE ATLAS release.
- `data/editorial/` — Field Guide IDs, summaries, topics, pattern synthesis, and explicitly attributed analyst fields.
- `data/generated/field-guide.json` — validated build artifact consumed by the React application.
- `data/ai-threat-field-guide-seed.json` — retained migration input; it is not loaded by the application.

`scripts/build-data.mjs` validates case IDs, official case-to-technique relationships, editorial references, URLs, and pattern anchors before producing the normalized artifact. A relationship labeled `MITRE ATLAS official` can only be emitted when it exists in the pinned upstream release.

## Local development

Requires Node.js 22 or newer.

```bash
npm ci
npm run dev
```

The data build runs automatically before development, tests, type checking, and production builds.

Useful checks:

```bash
npm run typecheck
npm test
npm run build
npm run test:sites
npm run check:atlas
```

## Maintaining the dataset

### Add or edit an editorial case

1. Add or update the overlay matching its canonical case ID in `data/editorial/cases/`.
2. Attribute every non-canonical field with its declared provenance.
3. Do not duplicate canonical titles, dates, descriptions, sources, or relationships in the overlay.
4. Run `npm run build:data` and review the generated diff.

### Add or edit a pattern

Update `data/editorial/patterns.json`. Every related case must exist, and the primary technique must be an official relationship for at least one related case. Patterns are editorial synthesis, not MITRE classifications, and are labeled accordingly in the interface.

### Update MITRE ATLAS

The weekly `Check for MITRE ATLAS updates` workflow inspects the official release manifest. When it finds a newer compatible release, it downloads the YAML, validates its shape and relationships, generates a human-readable change summary, runs all checks, and opens a review pull request. It never publishes an upstream change automatically and never overwrites editorial files.

To check manually without changing files:

```bash
npm run check:atlas
```

To prepare a compatible update locally:

```bash
node scripts/check-atlas-update.mjs --apply
```

Review the upstream diff, generated data, changed relationships, and editorial compatibility before merging.

## Search, routing, and accessibility

Search covers case content, actors, targets, editorial topics, canonical patterns, ATLAS technique names and IDs, source domains, and agentic classifications. Incident filters and sort order are stored in URL parameters. The relationship network uses fixed case → pattern → technique columns and is paired with an equivalent accessible list; small screens receive the list-first presentation.

Interactive motion is brief and purposeful. With `prefers-reduced-motion`, transforms, graph movement, stagger, and number interpolation are removed. Keyboard users receive the same navigation and relationship information as pointer users.

## Deployment

`.github/workflows/deploy-pages.yml` validates and builds the site on pushes to `main`, then deploys `dist/client` with GitHub Pages' official actions. Vite derives the repository base path from `GITHUB_REPOSITORY`, and the build emits a `404.html` fallback so nested client routes can load directly.

In repository settings, select **GitHub Actions** as the Pages source.

## Methodology and limits

The Field Guide is a research-navigation tool, not a claim of completeness. Canonical MITRE content and editorial interpretation are visibly separated. Missing actors, outcomes, dates, source classifications, and attribution are left missing rather than inferred for presentation. See `docs/CODEX_HANDOFF.md` for the complete product and evidence specification.
