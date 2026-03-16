import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { NodeData, NodeStatus } from "../types.ts";

interface NodeEditPanelProps {
  nodeId: string;
  nodeType: string;
  data: NodeData;
  onSave: (nodeId: string, data: NodeData) => void;
  onClose: () => void;
}

const inputClasses =
  "bg-stealth-black-400 border border-green-wildfire-700 text-green-wildfire-200 font-orbit text-sm px-3 py-2 rounded-sm focus:outline-none focus:border-green-wildfire-500 placeholder:text-stealth-black-50 w-full";

const labelClasses =
  "font-orbit text-[10px] uppercase text-green-wildfire-400 tracking-widest";

const NodeEditPanel: React.FC<NodeEditPanelProps> = ({
  nodeId,
  nodeType,
  data,
  onSave,
  onClose,
}) => {
  const [formData, setFormData] = useState<NodeData>({ ...data });

  useEffect(() => {
    setFormData({ ...data });
  }, [nodeId, data]);

  const handleSave = () => {
    onSave(nodeId, formData);
    onClose();
  };

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-stealth-black-500 border-l border-green-wildfire-500 z-50 flex flex-col p-5 gap-4 shadow-[-4px_0_20px_rgba(0,255,0,0.15)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="font-orbit text-green-wildfire-300 uppercase tracking-widest text-sm font-bold">
          Edit {nodeType} Node
        </h2>
        <button
          onClick={onClose}
          className="text-green-wildfire-400 hover:text-green-wildfire-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-1">
        <label className={labelClasses}>Name</label>
        <input
          type="text"
          value={formData.label}
          onChange={(e) => setFormData({ ...formData, label: e.target.value })}
          className={inputClasses}
        />
      </div>

      {/* IP Address */}
      <div className="flex flex-col gap-1">
        <label className={labelClasses}>IP Address</label>
        <input
          type="text"
          value={formData.ip}
          onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
          placeholder="0.0.0.0"
          className={inputClasses}
        />
      </div>

      {/* MAC Address */}
      <div className="flex flex-col gap-1">
        <label className={labelClasses}>MAC Address</label>
        <input
          type="text"
          value={formData.mac}
          onChange={(e) => setFormData({ ...formData, mac: e.target.value })}
          placeholder="00:00:00:00:00:00"
          className={inputClasses}
        />
      </div>

      {/* Status */}
      <div className="flex flex-col gap-1">
        <label className={labelClasses}>Status</label>
        <select
          value={formData.status}
          onChange={(e) =>
            setFormData({ ...formData, status: e.target.value as NodeStatus })
          }
          className={inputClasses}
        >
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="disconnected">Disconnected</option>
        </select>
      </div>

      {/* Subnet */}
      <div className="flex flex-col gap-1">
        <label className={labelClasses}>Subnet</label>
        <input
          type="text"
          value={formData.subnet}
          onChange={(e) => setFormData({ ...formData, subnet: e.target.value })}
          placeholder="192.168.1.0/24"
          className={inputClasses}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-auto">
        <button
          onClick={handleSave}
          className="flex-1 px-3 py-2 text-xs font-orbit font-bold uppercase tracking-widest border border-green-wildfire-500 text-green-wildfire-300 bg-green-wildfire-950 hover:bg-green-wildfire-900 rounded-sm transition-colors"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-2 text-xs font-orbit font-bold uppercase tracking-widest border border-stealth-black-300 text-stealth-black-50 bg-stealth-black-500 hover:bg-stealth-black-400 rounded-sm transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NodeEditPanel;
