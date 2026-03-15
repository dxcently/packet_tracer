import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
} from '@xyflow/react';

import Sidebar from '../../components/sidebar.tsx';

import SwitchNode from '../../components/nodes/switch.tsx'
import ServerNode from '../../components/nodes/server.tsx'

const nodeTypes = {
  server: ServerNode,
  switch: SwitchNode,
};

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#9ca3af' } }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Math.floor(Math.random() * 100)}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onDrop={onDrop}
      onDragOver={onDragOver}
      nodeTypes={nodeTypes}
      fitView
      colorMode="dark"
      className="bg-gray-950"
    >
      <Background color="#374151" />
      <Controls />
    </ReactFlow>
  );
}

function Home() {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-gray-950">
      <ReactFlowProvider>
        <Sidebar />
        <div className="flex-grow h-full relative">
          <FlowCanvas />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

const root = ReactDOM.createRoot(document.querySelector("#root")!);
root.render(<Home/>);