import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { GraphData, GraphKind } from "../data/graph";

const xByKind: Record<GraphKind, number> = { case: 110, pattern: 500, technique: 900 };

export function RelationshipGraph({ data, className = "", ariaLabel = "Case, pattern, and technique relationships" }: { data: GraphData; className?: string; ariaLabel?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const instance = useRef<Core | null>(null);
  const navigate = useNavigate();

  const elements = useMemo<ElementDefinition[]>(() => {
    const counts: Record<GraphKind, number> = { case: 0, pattern: 0, technique: 0 };
    const totals: Record<GraphKind, number> = { case: 0, pattern: 0, technique: 0 };
    data.nodes.forEach((node) => { totals[node.kind] += 1; });
    const height = Math.max(460, Math.max(...Object.values(totals)) * 76);
    const nodes = data.nodes.map((node) => {
      const index = counts[node.kind]++;
      const spacing = height / (totals[node.kind] + 1);
      return { data: node, position: { x: xByKind[node.kind], y: spacing * (index + 1) } };
    });
    const edges = data.edges.map((edge) => ({ data: edge }));
    return [...nodes, ...edges];
  }, [data]);

  useEffect(() => {
    if (!ref.current) return;
    instance.current?.destroy();
    const cy = cytoscape({
      container: ref.current,
      elements,
      layout: { name: "preset", fit: true, padding: 34 },
      minZoom: 0.45,
      maxZoom: 1.65,
      wheelSensitivity: 0.18,
      style: [
        { selector: "node", style: { "background-color": "#161c26", "border-color": "#2e3c4e", "border-width": 1, color: "#d4e4ef", label: "data(label)", "font-family": "JetBrains Mono", "font-size": 11, "text-wrap": "wrap", "text-max-width": 150, "text-valign": "center", "text-halign": "center", width: 170, height: 52, shape: "round-rectangle", "transition-property": "opacity, border-color, background-color", "transition-duration": "180ms" } },
        { selector: 'node[kind = "case"]', style: { "background-color": "#11161f", "border-color": "#e5484d", width: 190, height: 60 } },
        { selector: 'node[kind = "pattern"]', style: { "background-color": "#161326", "border-color": "#a78bfa" } },
        { selector: 'node[kind = "technique"]', style: { "background-color": "#101820", "border-color": "#4b9fe8" } },
        { selector: "edge", style: { width: 1, "line-color": "#222c3a", "target-arrow-color": "#222c3a", "target-arrow-shape": "triangle", "curve-style": "bezier", opacity: 0.72, "transition-property": "opacity, line-color, width", "transition-duration": "180ms" } },
        { selector: ".is-dimmed", style: { opacity: 0.12 } },
        { selector: ".is-active", style: { opacity: 1, "border-color": "#d4e4ef", "line-color": "#e5484d", "target-arrow-color": "#e5484d", width: 2 } },
      ] as cytoscape.StylesheetJson,
    });

    cy.on("mouseover", "node", (event) => {
      const node = event.target;
      cy.elements().addClass("is-dimmed");
      node.closedNeighborhood().removeClass("is-dimmed").addClass("is-active");
    });
    cy.on("mouseout", "node", () => cy.elements().removeClass("is-dimmed is-active"));
    cy.on("tap", "node", (event) => navigate(event.target.data("href")));
    instance.current = cy;
    return () => cy.destroy();
  }, [elements, navigate]);

  return <div ref={ref} className={`relationship-graph ${className}`} role="img" aria-label={ariaLabel} />;
}
