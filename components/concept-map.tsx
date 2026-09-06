"use client";
import { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Handle,
  Position,
  MarkerType,
  type Node,
  type NodeProps,
  type Viewport,
  type ReactFlowInstance,
} from "@xyflow/react";
import { concepts, relationships, byId } from "@/content/black-holes";
import { routeReadingLinks } from "@/content/routes";
import type { ConceptId } from "@/content/schema";
import { Button } from "@/components/ui/button";
type ConceptNode = Node<{
  label: string;
  active: boolean;
  visited: boolean;
  saved: boolean;
  choose: () => void;
}>;
function MapNode({ data }: NodeProps<ConceptNode>) {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <Button
        variant="outline"
        className={`concept-node nodrag nopan ${data.active ? "active" : ""}`}
        aria-pressed={data.active}
        onClick={data.choose}
      >
        <span className="node-orbit" aria-hidden="true" />
        <strong>{data.label}</strong>
        <span className="node-status">
          {data.active ? "Selected" : data.visited ? "✓ Visited" : "Explore"}
          {data.saved ? " · ★ Saved" : ""}
        </span>
      </Button>
      <Handle type="source" position={Position.Right} />
    </>
  );
}
const nodeTypes = { concept: MapNode };
export interface MapProps {
  active: ConceptId;
  visits: ConceptId[];
  saved: ConceptId[];
  select: (id: ConceptId) => void;
  viewport: Viewport;
  setViewport: (v: Viewport) => void;
  resetVersion: number;
  visibleIds?: ConceptId[];
}
export function ConceptMap({
  active,
  visits,
  saved,
  select,
  viewport,
  setViewport,
  resetVersion,
  visibleIds,
}: MapProps) {
  const [instance, setInstance] =
    useState<ReactFlowInstance<ConceptNode> | null>(null);
  useEffect(() => {
    if (instance) void instance.fitView({ padding: 0.18 });
  }, [instance, resetVersion]);
  const nodes: ConceptNode[] = (
    visibleIds ? visibleIds.map((id) => byId[id]) : concepts
  ).map((c, i) => ({
    id: c.id,
    type: "concept",
    width: 185,
    height: 100,
    style: { pointerEvents: "auto" },
    position: visibleIds
      ? { x: (i % 3) * 260, y: Math.floor(i / 3) * 175 }
      : c.position,
    data: {
      label: c.label,
      active: c.id === active,
      visited: visits.includes(c.id),
      saved: saved.includes(c.id),
      choose: () => select(c.id),
    },
  }));
  const edges = useMemo(
    () => [
      ...relationships.map((r) => ({
        id: r.id,
        source: r.from,
        target: r.to,
        label: r.type.replaceAll("_", " "),
        markerEnd: { type: MarkerType.ArrowClosed, color: "#718aa7" },
        style: { stroke: "#718aa7" },
        labelStyle: { fill: "#cbd5e1", fontSize: 10 },
        labelBgStyle: { fill: "#111827" },
      })),
      ...routeReadingLinks
        .filter(
          ([a, b], i, all) =>
            all.findIndex(([x, y]) => x === a && y === b) === i,
        )
        .map(([from, to]) => ({
          id: `reading-${from}-${to}`,
          source: from,
          target: to,
          style: { stroke: "#687185", strokeDasharray: "5 6" },
        })),
    ],
    [],
  );
  return (
    <ReactFlow
      onInit={setInstance}
      aria-label="Black-hole concept map"
      nodes={nodes}
      edges={edges.filter(
        (e) =>
          nodes.some((n) => n.id === e.source) &&
          nodes.some((n) => n.id === e.target),
      )}
      fitView
      fitViewOptions={{ padding: 0.18 }}
      nodeTypes={nodeTypes}
      viewport={viewport}
      onViewportChange={setViewport}
      nodesDraggable={false}
      nodesConnectable={false}
      nodesFocusable={false}
      edgesFocusable={false}
      elementsSelectable={false}
      deleteKeyCode={null}
      minZoom={0.35}
      maxZoom={1.6}
      zoomOnScroll={false}
      preventScrolling={false}
      colorMode="dark"
    />
  );
}
