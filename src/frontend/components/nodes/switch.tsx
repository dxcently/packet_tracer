import { Handle, Position } from "@xyflow/react";
import { EthernetPort } from "lucide-react";
import type { NodeData } from "../../types.ts";

const statusClasses: Record<string, string> = {
  online: "bg-green-wildfire-500 animate-pulse shadow-[0_0_5px_#00ff00]",
  offline: "bg-red-red-500",
  disconnected: "bg-stealth-black-300",
};

const statusLabel: Record<string, string> = {
  online: "Online",
  offline: "Offline",
  disconnected: "Disconnected",
};

const SwitchNode = ({ data }: { data: NodeData }) => {
  const status = data.status ?? "online";
  return (
    <div className="w-72 px-4 py-3 border-2 border-green-wildfire-500 rounded-sm bg-green-wildfire-950 text-green-wildfire-200 shadow-[0_0_12px_rgba(0,255,0,0.25)]">
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

      {/* Header row */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-xl drop-shadow-[0_0_5px_rgba(0,255,0,0.5)]">
            <EthernetPort size={24} />
          </span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-green-wildfire-400 font-orbit font-bold tracking-widest">
              Switch Node
            </span>
            <strong className="font-orbit text-sm truncate max-w-[150px] tracking-normal">
              {data.label}
            </strong>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <div className={`w-2 h-2 rounded-full ${statusClasses[status]}`} />
          <span className="font-orbit text-[8px] text-green-wildfire-400 tracking-wide">
            {statusLabel[status]}
          </span>
        </div>
      </div>

      {/* Extra info */}
      {(data.ip || data.mac || data.subnet) && (
        <div className="mt-2 pt-2 border-t border-green-wildfire-900 flex flex-col gap-0.5">
          {data.ip && (
            <span className="font-orbit text-[9px] text-green-wildfire-400 tracking-wide">
              IP: {data.ip}
            </span>
          )}
          {data.mac && (
            <span className="font-orbit text-[9px] text-green-wildfire-400 tracking-wide">
              MAC: {data.mac}
            </span>
          )}
          {data.subnet && (
            <span className="font-orbit text-[9px] text-green-wildfire-400 tracking-wide">
              Subnet: {data.subnet}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SwitchNode;
