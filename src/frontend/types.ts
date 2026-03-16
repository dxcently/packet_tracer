export type NodeStatus = "online" | "offline" | "disconnected";

export interface NodeData {
  label: string;
  ip: string;
  mac: string;
  status: NodeStatus;
  subnet: string;
}
