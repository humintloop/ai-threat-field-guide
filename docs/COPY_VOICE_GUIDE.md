# AI Threat Field Guide: copy rules

## Reader and voice

Write for a security practitioner first, without excluding a risk professional or technically curious reader. Lead with what happened, then state the evidence boundary. Use a calm, precise voice: active verbs, short sentences, and ordinary security language.

Good: “Unit 42 recovered a session in which the agent changed targets after the first exploit path failed.”

Avoid: “The agent found a new thread in the operational tapestry.”

## Evidence labels

Every reader-facing claim belongs to one of these layers:

1. **MITRE ATLAS record** — canonical case metadata, case description, technique names, and official relationships in the pinned snapshot.
2. **Field Guide summary** — a concise, attributed synthesis of the cited sources.
3. **Field Guide interpretation** — an editorial comparison, trail, or pattern. It is never an official ATLAS relationship.

Use “mapped to this technique” for official ATLAS case-to-technique relationships. Use “reported,” “recorded,” “documented,” or “observed” only when the named source supports the claim. Keep failed outcomes and attribution limits in the first screenful where they matter.

## Preferred vocabulary

| Use | Avoid |
| --- | --- |
| MITRE ATLAS record | pinned account |
| sources | receipts |
| editorial pattern | named shape / recurring shape |
| case details | what’s on the file |
| technical details | technical read |
| case mapped to this technique | case used this method |
| cited sources | original reports, unless every item is primary |
| Field Guide interpretation | editorial reading, when the shorter label is sufficient |

## Pattern rules

Patterns are Field Guide labels. They may describe one case or compare several cases. Do not imply that a pattern is recurring unless it has more than one related case. Do not call a pattern an ATLAS technique.

## Source and uncertainty rules

- Do not promote a vendor attribution to an independent conclusion.
- Do not turn an attempt, demonstration, or partial result into a compromise.
- Say when an outcome is unknown rather than filling the gap.
- Never call the complete source index “original reports”; it includes ATLAS references, vendor reporting, advisories, research, and Field Guide-added links.
