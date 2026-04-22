import React from "react";
import { BaseEdge, EdgeProps, getBezierPath } from "@xyflow/react";
import { Package } from "lucide-react";

export default function DataEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter
            id="electric-wave-smooth"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="turbulence"
              baseFrequency="0.02 0.05"
              numOctaves="1"
              seed="5"
            >
              {/* Note: Fast seed changes cause 'teleporting' waves. 
                  Removed the aggressive seed animation for a smoother look, 
                  or use a very subtle frequency shift. */}
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" scale="3" />
          </filter>
        </defs>
      </svg>

      {/* 1. Background Cable */}
      <BaseEdge
        path={edgePath}
        style={{ stroke: "#022c22", strokeWidth: 5, opacity: 0.4 }}
      />

      {/* 2. The Wavy Flowing Line */}
      <path
        d={edgePath}
        fill="none"
        className="animate-flow" // Class from theme.css handles the seamless loop
        style={{
          stroke: "var(--color-green-wildfire-500)",
          strokeWidth: 2,
          filter:
            "url(#electric-wave-smooth) drop-shadow(0 0 4px rgba(0,255,0,0.7))",
          strokeLinecap: "round",
        }}
      />

      {/* 3. The Icon */}
      <foreignObject
        width={40}
        height={40}
        x={-20}
        y={-20}
        className="overflow-visible pointer-events-none"
        style={{
          offsetPath: `path("${edgePath}")`,
          offsetRotate: "auto -90deg",
          animation: "dash-move 4s linear infinite",
        }}
      >
        <div className="flex items-center justify-center w-full h-full">
          <div className="flex items-center justify-center bg-black border border-green-wildfire-500 p-1.5 rounded-sm shadow-[0_0_12px_rgba(0,255,0,0.3)] text-green-wildfire-200">
            <Package size={18} strokeWidth={2.5} />
          </div>
        </div>
      </foreignObject>
    </>
  );
}
