# Ready-to-paste implementation prompt

Review `docs/COPY_VOICE_GUIDE.md` and `docs/CONTENT_MODEL_DECISIONS.md`, then preserve their decisions while implementing any future copy changes.

The project’s canonical source boundary is non-negotiable: retain the build pipeline, pinned ATLAS data, and the separation between `data/upstream/atlas/` and `data/editorial/`. Do not change technique mappings, event types, or source URLs to make copy read better.

When editing copy:

1. Prefer direct security language that works for practitioners and risk readers.
2. Keep failure, uncertainty, attribution limits, and event classification visible.
3. Mark Field Guide interpretation as editorial and do not present it as an ATLAS fact.
4. Refer to source items as “sources” or “cited sources,” never blanket-label the index “original reports.”
5. Use “patterns,” not “recurring” or “named shapes.” State a pattern’s related-case count.
6. Say “mapped to this technique,” not “used this method,” for ATLAS relationships.

After changes, run `npm run typecheck`, `npm run test`, and `npm run build`.
