import { Handle, Position } from "@xyflow/react";
import { PcCase } from "lucide-react";

const ServerNode = ({ data }: { data: any }) => (
  <div className="w-48 h-16 px-4 border-2 border-green-wildfire-500 rounded-sm bg-green-wildfire-950 text-green-wildfire-200 flex items-center justify-between gap-3 shadow-[0_0_12px_rgba(0,255,0,0.25)]">
    {/* Connection Handles */}
    <Handle
      type="target"
      position={Position.Top}
      id="top"
      className="w-3 h-3 bg-green-wildfire-500 border-stealth-black-900"
    />
    <Handle
      type="source"
      position={Position.Left}
      id="left"
      className="w-3 h-3 bg-green-wildfire-500 border-stealth-black-900"
    />

    <div className="flex items-center gap-3">
      <span className="text-xl drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
        <PcCase size={24} />
      </span>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase text-green-wildfire-400 font-orbit font-bold tracking-widest">
          Server Node
        </span>
        <strong className="font-orbit text-sm truncate max-w-[100px] tracking-normal">
          {data.label}
        </strong>
      </div>
    </div>

    {/* Status Indicator */}
    <div className="w-2 h-2 rounded-full bg-green-wildfire-500 animate-pulse shadow-[0_0_5px_#00ff00]"></div>

    <Handle
      type="source"
      position={Position.Right}
      id="right"
      className="w-3 h-3 bg-green-wildfire-500 border-stealth-black-900"
    />
    <Handle
      type="source"
      position={Position.Bottom}
      id="bottom"
      className="w-3 h-3 bg-green-wildfire-500 border-stealth-black-900"
    />
  </div>
);

export default ServerNode;
