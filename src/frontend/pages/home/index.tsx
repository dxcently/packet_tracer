import React, { useCallback } from "react";
import ReactDOM from "react-dom/client";
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  type Connection,
  type Edge,
} from "@xyflow/react";

import Sidebar from "../../components/sidebar.tsx";

import SwitchNode from "../../components/nodes/switch.tsx";
import ServerNode from "../../components/nodes/server.tsx";
import ComputerNode from "../../components/nodes/computer.tsx";
import RouterNode from "../../components/nodes/router.tsx";
import NASNode from "../../components/nodes/nas.tsx";

const nodeTypes = {
  server: ServerNode,
  switch: SwitchNode,
  computer: ComputerNode,
  router: RouterNode,
  nas: NASNode,
};

function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) =>
      setEdges((eds) =>
        addEdge(
          { ...params, animated: true, style: { stroke: "#9ca3af" } },
          eds,
        ),
      ),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} ${Math.floor(Math.random() * 100)}`,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes],
  );

  const exportToJson = useCallback(() => {
    const topology = {
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data,
      })),
      edges: edges.map(
        ({ id, source, target, sourceHandle, targetHandle }) => ({
          id,
          source,
          target,
          sourceHandle,
          targetHandle,
        }),
      ),
    };
    const blob = new Blob([JSON.stringify(topology, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "topology.json";
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }, [nodes, edges]);

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
      className="bg-stealth-black-400"
    >
      <Background color="#374151" />
      <Controls />
      <Panel position="top-right">
        <button
          onClick={exportToJson}
          className="px-3 py-1.5 text-xs font-orbit font-bold uppercase tracking-widest border border-green-wildfire-500 text-green-wildfire-300 bg-green-wildfire-950 hover:bg-green-wildfire-900 rounded-sm shadow-[0_0_8px_rgba(0,255,0,0.2)] transition-colors"
        >
          Export JSON
        </button>
      </Panel>
    </ReactFlow>
  );
}

function Home() {
  return (
    <div className="flex w-screen h-screen overflow-hidden bg-stealth-black-400">
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
root.render(<Home />);

