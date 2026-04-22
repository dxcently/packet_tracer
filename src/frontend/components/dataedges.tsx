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
  data,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isAnimating = data?.isAnimating !== false;

  return (
    <>
      <BaseEdge
        path={edgePath}
        style={{
          stroke: "#022c22",
          strokeWidth: 5,
          // Dim the background track when off
          opacity: isAnimating ? 0.4 : 0.1,
        }}
      />

      <path
        d={edgePath}
        fill="none"
        className={isAnimating ? "animate-flow" : ""}
        style={{
          // Change color to a muted gray-green and lower opacity when off
          stroke: isAnimating
            ? "var(--color-green-wildfire-500)"
            : "var(--color-green-wildfire-900)",
          strokeWidth: 2,
          strokeLinecap: "round",
          animationPlayState: isAnimating ? "running" : "paused",
          // Reduce or remove the glow effect when dimmed
          filter: isAnimating
            ? "drop-shadow(0 0 4px rgba(0,255,0,0.7))"
            : "none",
          opacity: isAnimating ? 1 : 0.5,
          transition: "all 0.3s ease", // Smooth transition when toggling
        }}
      />

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
          animationPlayState: isAnimating ? "running" : "paused",
          display: isAnimating ? "block" : "none",
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
