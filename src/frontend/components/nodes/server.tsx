import {
  Handle,
  Position,
} from '@xyflow/react';

const ServerNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 border-2 border-blue-500 rounded-lg bg-gray-800 text-gray-100 flex items-center gap-2 shadow-lg">
    <span className="text-xl">🖥️</span>
    <strong className="font-sans text-sm">{data.label}</strong>
    <Handle type="source" position={Position.Bottom} id="a" className="w-3 h-3 bg-blue-500 border-gray-800" />
    <Handle type="target" position={Position.Top} id="b" className="w-3 h-3 bg-blue-500 border-gray-800" />
  </div>
);

export default ServerNode;