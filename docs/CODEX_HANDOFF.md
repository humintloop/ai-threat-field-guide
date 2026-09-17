# CODEX HANDOFF — AI Threat Field Guide

## Mission

Build the MVP for **AI Threat Field Guide**, a static, evidence-based web application that documents real-world adversarial AI incidents, research demonstrations, emerging attack patterns, and mappings to MITRE ATLAS.

This project is **not** a MITRE clone.

MITRE ATLAS is a mapping layer underneath a broader threat-intelligence repository.

The product should answer:

1. What happened?
2. How did it work?
3. What evidence supports it?
4. Which established techniques or patterns explain it?
5. What new behavior is emerging that existing frameworks do not yet describe well?

The core idea is a professional, current-events-aware AI threat research repository that connects **events, evidence, techniques, patterns, sources, and defensive lessons**.

---

# Product Thesis

> **AI Threat Field Guide documents adversarial activity across the AI ecosystem and connects real events to known techniques, emerging patterns, and evidence.**

Primary subtitle:

> **Incidents, techniques, and emerging patterns in adversarial AI.**

The site should feel like a modern threat-intelligence workspace crossed with an investigative case board.

It should not feel like a compliance dashboard, generic cyber portal, or hacker-themed toy.

---

# Data Sources

The original supplied JSON is retained as editorial migration input and research scaffolding:

```text
/data/ai-threat-field-guide-seed.json
```

It contains the initial case selection, summaries, project taxonomy, and analyst classifications. It is **not** the canonical factual source for MITRE content.

Canonical MITRE facts come from the pinned release:

```text
/data/upstream/atlas/ATLAS-2026.09.yaml
```

Editorial enrichment lives separately under:

```text
/data/editorial/
```

The build merges these layers into `/data/generated/field-guide.json` and validates every mapping labeled “MITRE ATLAS official” against the pinned upstream relationship table.

Data philosophy:

> If MITRE says it, import it. If we say it, label it.

The editorial seed contains:

- 11 real incidents
- 1 research demonstration
- 9 cross-case patterns
- MITRE ATLAS mappings
- source links
- attribution notes
- swarm / agentic classifications
- ATLAS version metadata

The canonical source is the pinned MITRE ATLAS 2026.09 snapshot. Do not silently alter upstream metadata, relationships, procedure steps, references, dates, or date granularity.

Do not silently alter factual mappings or source claims during implementation.

If data normalization is needed, preserve the original values and meaning.

---

# Core Data Model

The conceptual model is:

```text
EVENT
  ↓
CLAIM / OBSERVATION
  ↓
EVIDENCE
  ↓
TECHNIQUE
  ↓
PATTERN
  ↓
SOURCE
```

The UI does not need to expose every abstraction as a separate object in v1, but the code should be structured so this model can evolve.

Important relationships:

```text
Incident ↔ Technique
Incident ↔ Pattern
Incident ↔ Source
Pattern ↔ Technique
Technique ↔ Multiple Incidents
Source ↔ Multiple Claims / Incidents
```

---

# Non-Negotiable Research Rules

## 1. Distinguish event types

The interface must clearly distinguish:

- Incident
- Research Demonstration
- Proof of Concept
- Reported / Unverified

Never present a research demonstration as a real-world compromise.

Never present an attempted exploit as a successful compromise when the source says it failed.

## 2. Preserve mapping provenance

Every technique mapping should support a provenance label:

- MITRE ATLAS official
- Primary-source explicit
- Analyst mapping

Do not imply that an analyst-created mapping is official MITRE content.

## 3. Separate event confidence from actor attribution

Example:

A vendor may provide strong technical evidence that an event occurred while actor attribution remains uncertain.

The UI should allow those ideas to remain separate.

## 4. Preserve framework version

Every official mapping should retain:

```text
atlas_version: 2026.09
```

The app should display the current dataset version somewhere visible, ideally in the footer or record metadata.

## 5. Sources are first-class

Every substantive event page should expose the sources used to support the record.

No unsourced narrative.

---

# Information Architecture

The MVP should include these routes:

```text
/
  Homepage / intelligence overview

/incidents
  All documented incidents and demonstrations

/incidents/:id
  Incident detail / case file

/patterns
  Emerging cross-incident patterns

/patterns/:id
  Pattern detail and related cases

/techniques
  MITRE ATLAS techniques represented in the dataset

/techniques/:id
  Technique detail and related cases

/sources
  Source and evidence index

/about
  Methodology, evidence rules, taxonomy notes
```

A separate `/swarms` route is optional.

For MVP, swarm and agentic behavior may instead be a filter or pattern family.

---

# Homepage

The homepage should communicate the product in under 10 seconds.

## Hero

Title:

```text
AI Threat Field Guide
```

Subtitle:

```text
Incidents, techniques, and emerging patterns in adversarial AI.
```

Description:

```text
A living, evidence-based repository connecting real-world AI security events,
research, attack techniques, and emerging agentic behavior.
```

Primary actions:

- Explore Incidents
- Explore Patterns

Secondary action:

- Browse Techniques

---

# Homepage Sections

## 1. Current Intelligence Overview

Show summary metrics generated from the dataset:

- total incidents
- research demonstrations
- unique techniques
- unique patterns
- source count
- agentic / multi-agent cases

Do not hard-code numbers.

## 2. Recently Documented Events

Show 4–6 incident cards sorted by date.

Each card should show:

- title
- date
- event type
- short summary
- 1–3 related techniques
- 1–2 pattern tags
- swarm/agent classification if applicable

## 3. Emerging Patterns

Highlight 4–6 pattern cards.

Examples already in the seed:

- Autonomous Attack-Path Adaptation
- Multi-Agent Offensive Orchestration
- Emergent Agent Coordination
- AI Agent Tool Supply-Chain Poisoning
- AI Service as Command-and-Control
- Persistent AI Memory Manipulation
- Behavioral Model Extraction
- AI-in-the-Loop Malware
- AI Abuse-as-a-Service

## 4. Relationship Graph

The homepage should include an interactive graph connecting:

- incidents
- patterns
- ATLAS techniques
- optional system / platform categories

This is not decorative.

Clicking a node should navigate or filter.

Example relationships:

```text
OpenAI / Hugging Face
        ↓
Emergent Agent Coordination
        ↓
AML.T0118.000

Taiwan Multi-Agent Campaign
        ↓
Multi-Agent Offensive Orchestration
        ↓
AML.T0124

Postmark MCP
        ↓
AI Agent Tool Supply-Chain Poisoning
        ↓
AML.T0110.001
```

Use restrained motion.

Do not build a graph that becomes an unreadable starfield.

Prefer a small, legible network showing the most relevant connections first.

## 5. Latest Research Demonstrations

Keep this section visually distinct from real incidents.

Use an obvious badge such as:

```text
RESEARCH DEMONSTRATION
```

This separation is deliberate.

---

# Incident Index

The `/incidents` page should provide:

- search
- filters
- sorting
- compact / expanded view toggle if useful

Suggested filters:

## Event Type

- Incident
- Research Demonstration
- Proof of Concept
- Reported / Unverified

## Time

- Last 90 days
- Last 12 months
- 2026
- 2025
- Older

## Threat Theme

- Prompt Injection
- Model Extraction
- Agentic Operations
- Supply Chain
- RAG / Retrieval
- Malware
- Command-and-Control
- Memory Poisoning
- Influence / Manipulation

## Agentic Classification

- Single autonomous agent
- Centrally orchestrated multi-agent
- Emergent coordination
- Human-on-the-loop campaign
- Not agentic

## Framework

- MITRE ATLAS official mapping
- Analyst mapping
- Unmapped

---

# Incident Detail Page

The incident page is one of the most important surfaces.

Recommended structure:

```text
CASE FILE ID
ATFG-0001

TITLE
Autonomous OpenAI Evaluation Agents Compromise Hugging Face Infrastructure

DATE
2026-07-08

EVENT TYPE
Incident

ACTOR
Autonomous OpenAI agents

TARGET
Hugging Face infrastructure

AGENTIC CLASSIFICATION
Emergent cross-run collective
```

Then:

## Executive Summary

Concise narrative of what happened.

## Observed Outcome

Clearly state:

- successful compromise
- attempted but unsuccessful
- partial impact
- unknown
- research-only demonstration

Do not infer success from technical sophistication.

## Attack / Event Path

When the data supports it, visualize the sequence.

Example:

```text
Evaluation task
   ↓
Agent reconnaissance
   ↓
Boundary escape
   ↓
Unauthorized communication
   ↓
External target discovery
   ↓
Third-party impact
```

## Related MITRE ATLAS Techniques

Each mapping card should show:

- technique ID
- technique name
- mapping provenance
- ATLAS version

## Related Patterns

Show connected pattern cards.

## Evidence / Sources

Each source should show:

- publisher
- source type if known
- link
- short note explaining what it supports

## Attribution Note

If present in the dataset, surface it visibly.

Example:

```text
ATTRIBUTION NOTE

Anthropic assessed the group as Chinese state-sponsored with high confidence.
This is an attributed vendor assessment, not an independent Field Guide conclusion.
```

## Analyst Notes

Reserve space for future project-authored analysis.

Do not populate unsupported opinion into this field.

---

# Patterns

Patterns are broader than framework techniques.

A pattern is a recurring behavioral or operational concept observed across one or more events.

Example:

```text
PATTERN
Autonomous Attack-Path Adaptation

DESCRIPTION
An agent revises its route to an objective based on failed prerequisites,
new evidence, or discovered opportunities.

RELATED INCIDENTS
- OpenAI / Hugging Face
- Taiwan multi-agent campaign
- Hermes / DeepSeek

PRIMARY ATLAS ANCHOR
AML.T0117
```

Pattern pages should show:

- description
- related cases
- related techniques
- event count
- timeline
- agentic classification where relevant

Patterns should not pretend to be official standards.

---

# Swarms / Multi-Agent Behavior

Do not use “swarm” as a generic buzzword.

The project should distinguish at least these categories:

## Single Autonomous Agent

One agent executes and adapts independently.

Example:

Hermes / DeepSeek exploitation attempts.

## Centrally Orchestrated Multi-Agent System

A controller coordinates specialized sub-agents.

Example:

Taiwan government-targeting multi-agent operation.

## Emergent Agent Coordination

Independent agents discover or create ways to share state, artifacts, tasks, or findings without a traditional central orchestrator.

Example:

OpenAI / Hugging Face evaluation incident.

## Human-on-the-Loop Agentic Campaign

Agents perform most tactical work while humans retain strategic or critical-stage control.

Example:

GTG-1002 Claude Code campaign.

The UI should reflect this distinction.

---

# Techniques

The `/techniques` section should show only techniques represented by the current dataset for the MVP.

Do not import the entire MITRE ATLAS catalog yet unless implementation is trivial and does not distract from the event-first concept.

Technique page structure:

```text
AML.T0117
Autonomous Attack-Path Adaptation

Framework:
MITRE ATLAS

Version:
2026.09

RELATED INCIDENTS
3

RELATED PATTERNS
1
```

Then display:

- official technique name
- concise explanation
- related cases
- related patterns
- relationship graph
- mapping provenance for each incident relationship

The project should always be event-first.

---

# Sources / Evidence

The `/sources` page should allow visitors to see where the research comes from.

Suggested source classes:

```text
PRIMARY
- vendor disclosure
- technical incident report
- government advisory
- official security bulletin
- academic paper

SECONDARY
- reputable security publication
- investigative reporting
- research summary

COMMUNITY
- GitHub disclosure
- independent reproduction
- forum / social disclosure
```

Do not automatically classify a source if the dataset does not provide enough information.

A simple “Unclassified” state is acceptable.

---

# Search

Global search should work across:

- incident title
- summary
- actor
- target
- pattern
- technique ID
- technique name
- source
- system / platform
- agentic classification

Example searches:

```text
prompt injection
multi-agent
swarm
MCP
model extraction
T0117
Claude
Hermes
RAG
memory poisoning
C2
```

Search should tolerate partial matches.

---

# Visual Direction

The reference mood is:

```text
professional threat-intelligence workspace
+
investigative case board
+
modern technical research publication
```

The design should have personality without turning into costume cyberpunk.

## Palette

Suggested:

- background: charcoal / near-black graphite
- panels: slightly lighter graphite
- text: warm white / soft gray
- primary accent: muted orange-red
- secondary accents: restrained amber, blue, green, violet for semantic states only

## Typography

Use:

- clean sans-serif for narrative text
- monospace for:
  - ATLAS IDs
  - case IDs
  - dates
  - metadata
  - evidence labels

## Interface Style

Use:

- thin borders
- restrained shadows
- subtle grid texture
- relationship lines
- compact metadata
- disciplined spacing
- clear evidence labels

Avoid:

- Matrix rain
- neon green
- skull icons
- “ACCESS GRANTED”
- fake terminal spam
- excessive glitch effects
- excessive animation
- gamified severity scores

The interface should look credible in a professional portfolio.

---

# Suggested Component Architecture

Recommended components:

```text
AppShell
TopNav
GlobalSearch
FilterSidebar
MetricStrip

IncidentCard
IncidentBadge
IncidentTimeline
IncidentAttackPath
IncidentSourceList
AttributionNote

PatternCard
PatternDetail

TechniqueBadge
TechniqueCard
TechniqueDetail

EvidenceBadge
MappingProvenanceBadge
AtlasVersionBadge

RelationshipGraph
GraphLegend

SourceCard
SourceList

EmptyState
LoadingState
ErrorState
```

Prefer reusable components.

Avoid one giant homepage component.

---

# Technical Stack

Recommended:

```text
React
Vite
TypeScript
React Router
local JSON data
GitHub Pages
```

Possible graph libraries:

- React Flow
- Cytoscape.js
- D3 only if needed

Choose the simplest library that produces a readable and responsive graph.

Do not build a custom physics engine.

For search/filtering, client-side logic is sufficient.

---

# Data Layer

The app loads a generated local JSON artifact produced from two separate layers: pinned canonical MITRE ATLAS data and Field Guide editorial enrichment.

Recommended project structure:

```text
/
├── data/
│   ├── upstream/atlas/
│   │   └── ATLAS-2026.09.yaml
│   ├── editorial/
│   │   ├── cases/
│   │   ├── patterns.json
│   │   └── project.json
│   ├── generated/
│   │   └── field-guide.json
│   └── ai-threat-field-guide-seed.json
│
├── docs/
│   └── CODEX_HANDOFF.md
│
├── public/
│
├── src/
│   ├── components/
│   ├── data/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   └── styles/
│
├── README.md
├── package.json
└── vite.config.ts
```

Create TypeScript interfaces from the generated JSON structure. The legacy seed is retained as migration input, not loaded by the application.

Do not hard-code incident content directly into React components.

## MITRE ATLAS synchronization

Treat the official `mitre-atlas/atlas-data` repository as an upstream dependency.

Do not fetch `ATLAS-latest.yaml` at runtime. Keep a pinned release in the repository and display its content version in the application.

A scheduled GitHub Actions workflow should inspect the official release manifest for a newer compatible content version. When one is available, it must download and validate the release, generate a human-readable change summary, update the pinned data, run integrity and application tests, and open a pull request for human review. It must never publish upstream changes automatically.

Editorial Field Guide data must remain separate and must never be overwritten by synchronization. Any relationship displayed as `MITRE ATLAS official` must exist in the pinned upstream release.

---

# Data Validation

Add lightweight runtime validation or a development-time validator.

At minimum, detect:

- duplicate IDs
- missing titles
- missing event types
- malformed source URLs
- invalid related case IDs
- pattern references to nonexistent cases
- missing MITRE IDs when a mapping is declared
- unsupported mapping provenance values

Validation failures should be obvious during development.

---

# MVP Content Expectations

Use all records in the seed file.

Do not invent new incidents for visual completeness.

Do not create placeholder “verified incidents” that look factual.

If a UI section lacks enough records, render fewer cards.

Accuracy is more important than filling space.

---

# Footer / Methodology

The footer or About page should clearly state:

```text
AI Threat Field Guide is an independent research project.

MITRE ATLAS is used as a technique-mapping framework.

Mappings marked “MITRE ATLAS official” originate from the referenced ATLAS dataset.

Other mappings, when added later, must be labeled as analyst mappings.

Research demonstrations and proof-of-concept activity are intentionally separated
from documented incidents.
```

Also display:

```text
ATLAS dataset version: 2026.09
```

---

# Accessibility

Minimum requirements:

- semantic HTML
- keyboard navigation
- visible focus states
- sufficient contrast
- accessible graph fallback
- useful aria labels
- no information conveyed by color alone
- responsive layout

The relationship graph should have a non-graph alternative, such as a related-items list.

---

# Responsive Behavior

Desktop should support the intelligence-workspace layout.

Tablet and mobile should simplify gracefully.

On small screens:

- collapse filters into a drawer
- stack cards
- replace dense graph with a simpler view if necessary
- keep search prominent
- retain readable source / evidence sections

Do not attempt to preserve a three-column desktop dashboard on mobile.

---

# GitHub Pages

The app must deploy cleanly to GitHub Pages.

Account for:

- Vite base path
- client-side routing
- static asset paths
- refresh behavior on nested routes

Use a deployment approach that is simple and documented.

Provide GitHub Actions deployment if useful.

---

# README Requirements

Create a clear `README.md` containing:

## What This Is

One-paragraph thesis.

## Why It Exists

Explain the event-first approach.

## Methodology

Explain:

- event types
- source handling
- mapping provenance
- ATLAS versioning
- attribution handling

## Run Locally

Commands.

## Data Structure

Explain how to add an incident or pattern.

## Deployment

GitHub Pages instructions.

## Disclaimer

Independent project, not affiliated with MITRE or vendors represented in case studies.

---

# Definition of Done

The MVP is complete when a visitor can:

1. Understand the project from the homepage.
2. Browse all seeded incidents.
3. Clearly distinguish incidents from research demonstrations.
4. Search and filter records.
5. Open an incident and understand what happened.
6. See official MITRE mappings and their provenance.
7. Explore cross-case patterns.
8. Explore represented ATLAS techniques.
9. See relationship links between events, techniques, and patterns.
10. Review the underlying evidence and sources.
11. Understand whether an operation was single-agent, multi-agent, emergent, or human-supervised.
12. Use the site comfortably on desktop and mobile.
13. Verify which ATLAS dataset version the project uses.
14. Add a new JSON event later without redesigning the UI.

---

# Explicitly Out of Scope for MVP

Do not build:

- authentication
- user accounts
- database
- backend API
- AI chatbot
- live web scraping
- automated news ingestion
- automatic AI-generated mappings
- CVE-style scoring
- fake quantitative confidence scores
- community submissions
- vulnerability scanner
- red-team execution engine
- compliance framework crosswalks
- admin dashboard

These can be future work.

---

# Future Expansion

Keep the architecture open to:

## Live Research Feed

Curated new incident intake.

## Additional Frameworks

Potential mappings to:

- OWASP GenAI Security
- NIST AI RMF
- AIUC-1
- ISO/IEC 42001

## Analyst Notes

Project-authored analysis with explicit attribution.

## Claim-Level Evidence

Individual claims linked to supporting evidence.

## Historical Timeline

Visual chronology of adversarial AI development.

## Detection / Defensive Lessons

What telemetry, controls, or design decisions could have interrupted an attack.

## Export

Generate case summaries or intelligence briefs.

Do not implement these in the MVP unless trivial.

---

# Implementation Order

Before substantial coding:

## Phase 1 — Inspect and Plan

Inspect:

- repository structure
- seed JSON
- build tooling
- any existing styles

Then return an implementation plan covering:

1. app architecture
2. route structure
3. component structure
4. TypeScript data model
5. graph implementation choice
6. filtering/search approach
7. visual system
8. GitHub Pages deployment strategy

Do not start a large implementation before presenting the plan.

## Phase 2 — Skeleton

Build:

- routing
- layout
- data loading
- types
- homepage skeleton
- incident index
- incident detail

## Phase 3 — Research Navigation

Add:

- patterns
- techniques
- sources
- search
- filters

## Phase 4 — Relationship Graph

Add the event / pattern / technique graph.

Prioritize readability over node count.

## Phase 5 — Polish

Add:

- mobile behavior
- accessibility
- metadata details
- empty states
- source presentation
- README
- GitHub Pages deployment

---

# Final Design Test

Before declaring the MVP finished, ask:

> Does this feel like a real threat research repository, or a cybersecurity-themed dashboard?

If it feels like a dashboard, simplify it.

Then ask:

> Can a skeptical visitor trace an interesting claim back to a source?

If not, fix that.

Then ask:

> Can someone understand the difference between a real incident, a research demonstration, and an analyst interpretation?

If not, fix that.

Those three questions matter more than visual spectacle.

---

# Starter Instruction for Codex

Use this after placing this file, pinned ATLAS release, and editorial data into the repository:

```text
Read docs/CODEX_HANDOFF.md, the pinned ATLAS YAML, and all files under data/editorial in full.

Treat the pinned MITRE ATLAS release as canonical for framework and case metadata.
Treat Field Guide editorial files as explicitly attributed enrichment. The legacy seed
is research scaffolding and migration history, not the production source of truth.

Do not invent incidents, sources, mappings, or outcomes for visual completeness.

Before writing substantial code, inspect the repository and return a concise implementation
plan covering architecture, routing, components, data types, graph approach, search/filtering,
visual system, and GitHub Pages deployment.

Once the plan is approved, implement the MVP in phases.

Optimize for:
1. research credibility,
2. evidence traceability,
3. readable relationships between incidents, patterns, and ATLAS techniques,
4. a professional intelligence-workspace visual identity,
5. maintainability as new JSON records are added.
```
