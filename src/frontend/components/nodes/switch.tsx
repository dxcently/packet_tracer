import {
  Handle,
  Position,
} from '@xyflow/react';

const SwitchNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 border-2 border-green-500 rounded-lg bg-gray-800 text-gray-100 flex items-center gap-2 shadow-lg">
    <Handle type="target" position={Position.Top} id="top" className="w-3 h-3 bg-green-500 border-gray-800" />
    <Handle type="source" position={Position.Left} id="left" className="w-3 h-3 bg-green-500 border-gray-800" />
    <span className="text-xl">🔀</span>
    <strong className="font-sans text-sm">{data.label}</strong>
    <Handle type="source" position={Position.Right} id="right" className="w-3 h-3 bg-green-500 border-gray-800" />
    <Handle type="source" position={Position.Bottom} id="bottom" className="w-3 h-3 bg-green-500 border-gray-800" />
  </div>
);

export default SwitchNode;