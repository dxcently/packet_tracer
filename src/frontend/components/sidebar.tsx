import React, { Component } from "react";
import {
  Server,
  Router,
  PcCase,
  EthernetPort,
  LaptopMinimal,
} from "lucide-react";

class Sidebar extends Component {
  onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  render() {
    // Hover now triggers the red-red-200 glow and text color
    const itemClasses = `
      p-3 border-2 border-green-wildfire-500 rounded bg-stealth-black-800 
      flex items-center gap-3 cursor-grab transition-all duration-300 
      text-green-wildfire-200 group 
      hover:bg-stealth-black-700 hover:border-red-red-500 
      hover:text-red-red-200 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]
    `;

    return (
      <aside className="w-64 p-5 border-r border-stealth-black-500 bg-stealth-black-900 font-orbit flex flex-col gap-4">
        <div>
          <h3 className="text-lg font-bold m-0 text-green-wildfire-400 uppercase tracking-wider">
            Network Devices
          </h3>
          <div className="text-xs text-green-wildfire-300/70 mt-1">
            Drag items to the canvas
          </div>
        </div>

        <div
          onDragStart={(e) => this.onDragStart(e, "server")}
          draggable
          className={itemClasses}
        >
          <span className="group-hover:drop-shadow-[0_0_5px_#ff0000]">
            <PcCase size={20} />
          </span>
          Server
        </div>

        <div
          onDragStart={(e) => this.onDragStart(e, "switch")}
          draggable
          className={itemClasses}
        >
          <span className="group-hover:drop-shadow-[0_0_5px_#ff0000]">
            <EthernetPort size={20} />
          </span>
          Switch
        </div>

        <div
          onDragStart={(e) => this.onDragStart(e, "computer")}
          draggable
          className={itemClasses}
        >
          <span className="group-hover:drop-shadow-[0_0_5px_#ff0000]">
            <LaptopMinimal size={20} />
          </span>
          Computer
        </div>

        <div
          onDragStart={(e) => this.onDragStart(e, "router")}
          draggable
          className={itemClasses}
        >
          <span className="group-hover:drop-shadow-[0_0_5px_#ff0000]">
            <Router size={20} />
          </span>
          Router
        </div>

        <div
          onDragStart={(e) => this.onDragStart(e, "nas")}
          draggable
          className={itemClasses}
        >
          <span className="group-hover:drop-shadow-[0_0_5px_#ff0000]">
            <Server size={20} />
          </span>
          NAS
        </div>
      </aside>
    );
  }
}

export default Sidebar;
