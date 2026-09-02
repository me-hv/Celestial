"use client";

import React, { useRef, useEffect, useState, useMemo } from "react";
import { ResearchRelation, ResearchTargetReference } from "@/domain/research/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, RotateCcw, Share2 } from "lucide-react";

interface NodeItem {
  id: string;
  label: string;
  domain: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface LinkItem {
  source: string;
  target: string;
  relationType: string;
  label: string;
}

interface ScientificGraph2DProps {
  centerTarget: ResearchTargetReference;
  relations: ResearchRelation[];
  onSelectNode?: (slug: string) => void;
  className?: string;
}

const DOMAIN_COLORS: Record<string, string> = {
  SOLAR_SYSTEM: "#06B6D4",
  EXOPLANET: "#3B82F6",
  STELLAR: "#F59E0B",
  DEEP_SKY: "#8B5CF6",
  GALACTIC: "#10B981",
  COSMIC_WEB: "#EC4899",
  MISSION: "#00F0FF",
  SPACECRAFT: "#F59E0B",
  DISCOVERY: "#10B981",
  OBSERVATORY: "#6366F1",
};

export const ScientificGraph2D: React.FC<ScientificGraph2DProps> = ({
  centerTarget,
  relations,
  onSelectNode,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<NodeItem | null>(null);

  // Build nodes & links
  const { nodes, links } = useMemo(() => {
    const nodeMap = new Map<string, NodeItem>();

    // Center node
    nodeMap.set(centerTarget.id, {
      id: centerTarget.id,
      label: centerTarget.canonicalName,
      domain: centerTarget.domain,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      radius: 24,
      color: DOMAIN_COLORS[centerTarget.domain] || "#06B6D4",
    });

    const linkList: LinkItem[] = [];

    // Neighbor nodes
    const angleStep = (2 * Math.PI) / Math.max(1, relations.length);
    relations.forEach((rel, i) => {
      const angle = i * angleStep;
      const dist = 160 + (i % 2) * 50;

      const isSourceCenter = rel.sourceId === centerTarget.id;
      const otherId = isSourceCenter ? rel.targetId : rel.sourceId;
      const otherLabel = isSourceCenter ? rel.targetName : rel.sourceName;
      const otherDomain = isSourceCenter ? rel.targetDomain : rel.sourceDomain;

      if (!nodeMap.has(otherId)) {
        nodeMap.set(otherId, {
          id: otherId,
          label: otherLabel,
          domain: otherDomain,
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          vx: 0,
          vy: 0,
          radius: 18,
          color: DOMAIN_COLORS[otherDomain] || "#8B5CF6",
        });
      }

      linkList.push({
        source: rel.sourceId,
        target: rel.targetId,
        relationType: rel.relationType,
        label: rel.relationType.replace(/_/g, " "),
      });
    });

    return { nodes: Array.from(nodeMap.values()), links: linkList };
  }, [centerTarget, relations]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2 + pan.x, height / 2 + pan.y);
      ctx.scale(zoom, zoom);

      // Draw Grid Background
      ctx.strokeStyle = "rgba(255, 255, 255, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = -width; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, -height);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = -height; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(-width, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Links
      ctx.lineWidth = 1.5;
      for (const link of links) {
        const sourceNode = nodes.find((n) => n.id === link.source);
        const targetNode = nodes.find((n) => n.id === link.target);
        if (sourceNode && targetNode) {
          ctx.strokeStyle = "rgba(6, 182, 212, 0.35)";
          ctx.beginPath();
          ctx.moveTo(sourceNode.x, sourceNode.y);
          ctx.lineTo(targetNode.x, targetNode.y);
          ctx.stroke();

          // Link relation label
          const midX = (sourceNode.x + targetNode.x) / 2;
          const midY = (sourceNode.y + targetNode.y) / 2;
          ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
          ctx.font = "9px monospace";
          ctx.textAlign = "center";
          ctx.fillText(link.label, midX, midY - 4);
        }
      }

      // Draw Nodes
      for (const node of nodes) {
        const isHovered = hoveredNode?.id === node.id;
        const isCenter = node.id === centerTarget.id;

        // Glow ring
        if (isHovered || isCenter) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 6, 0, 2 * Math.PI);
          ctx.fillStyle = node.color + "33";
          ctx.fill();
        }

        // Main node body
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "#0A0E1A";
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isCenter ? 3 : 2;
        ctx.stroke();

        // Node Title
        ctx.fillStyle = isCenter ? "#F8FAFC" : "#E2E8F0";
        ctx.font = isCenter ? "bold 12px sans-serif" : "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y + node.radius + 14);

        // Domain tag
        ctx.fillStyle = "rgba(148, 163, 184, 0.6)";
        ctx.font = "8px monospace";
        ctx.fillText(node.domain, node.x, node.y + node.radius + 24);
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [nodes, links, zoom, pan, hoveredNode, centerTarget]);

  // Pointer interactions
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - canvas.width / 2 - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - canvas.height / 2 - pan.y) / zoom;

    const found = nodes.find((n) => {
      const dx = n.x - mouseX;
      const dy = n.y - mouseY;
      return Math.sqrt(dx * dx + dy * dy) <= n.radius + 4;
    });

    setHoveredNode(found || null);
  };

  const handlePointerUp = (_e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging && hoveredNode && onSelectNode) {
      onSelectNode(hoveredNode.id);
    }
    setIsDragging(false);
  };

  return (
    <div
      className={`relative w-full h-[380px] bg-celestial-void/90 rounded-2xl border border-celestial-muted/80 overflow-hidden select-none ${className}`}
      role="region"
      aria-label="2D Scientific Relationship Graph"
    >
      <canvas
        ref={canvasRef}
        width={700}
        height={380}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {/* Floating Header */}
      <div className="absolute top-3 left-3 pointer-events-none flex items-center gap-2">
        <Badge variant="cyan" className="font-mono text-[10px] tracking-wider uppercase">
          <Share2 className="w-3 h-3 mr-1 inline" /> Scientific Relation Graph
        </Badge>
        <span className="text-[11px] font-mono text-celestial-subtle">
          {nodes.length} connected entities • {links.length} relations
        </span>
      </div>

      {/* Controls */}
      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-celestial-surface/80 p-1 rounded-xl border border-celestial-muted/80 backdrop-blur-md">
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => setZoom((z) => Math.min(2.5, z * 1.2))}
          aria-label="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => setZoom((z) => Math.max(0.4, z / 1.2))}
          aria-label="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-7 w-7 p-0"
          onClick={() => {
            setZoom(1.0);
            setPan({ x: 0, y: 0 });
          }}
          aria-label="Reset View"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
