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
      p-3 border-2 border-green-wildfire-500 rounded bg-green-wildfire-900 
      flex items-center gap-3 cursor-grab transition-all duration-300 
      text-green-wildfire-200 group 
      hover:bg-green-wildfire-800 hover:border-red-red-500 
      hover:text-red-red-200 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]
    `;
    const signOut = async () => {
      //await fetch('/api/user/logout', {method: 'POST'});
      window.location.href = "../login/index.html";
    };

    const { isAnimating, onToggleAnimation } = this.props as any;

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
        <div className="mt-auto flex flex-col gap-3">
          {/* SIMULATE BUTTON */}
          <button
            onClick={onToggleAnimation}
            className={`w-full py-2 border-2 rounded font-bold uppercase tracking-widest transition-all duration-300 cursor-pointer active:scale-95 ${
              isAnimating
                ? "border-green-wildfire-500 text-green-wildfire-400 bg-green-wildfire-900/50 shadow-[0_0_10px_rgba(0,255,0,0.2)]"
                : "border-stealth-black-400 text-stealth-black-100 bg-stealth-black-500/20 opacity-60"
            }`}
          >
            {isAnimating ? "Simulate: ON" : "Simulate: OFF"}
          </button>

          {/* SIGN OUT BUTTON - Fixed to be a single clickable block */}
          <button
            onClick={signOut}
            className="w-full text-lg border-2 py-2 text-center border-green-wildfire-500 text-green-wildfire-400 tracking-widest uppercase bg-green-wildfire-900 hover:bg-green-wildfire-950 cursor-pointer active:scale-95 transition-transform"
          >
            Sign out
          </button>
        </div>{" "}
      </aside>
    );
  }
}

export default Sidebar;
