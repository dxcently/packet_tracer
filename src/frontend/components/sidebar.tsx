import React, { Component } from 'react';

class Sidebar extends Component {
  onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  render() {
    return (
      <aside className="w-64 p-5 border-r border-gray-700 bg-gray-900 font-sans flex flex-col gap-4 text-gray-100">
        <div>
          <h3 className="text-lg font-bold m-0">Network Devices</h3>
          <div className="text-xs text-gray-400 mt-1">Drag items to the canvas</div>
        </div>
        
        <div 
          onDragStart={(e) => this.onDragStart(e, 'server')} 
          draggable 
          className="p-3 border-2 border-blue-500 rounded bg-gray-800 flex items-center gap-3 cursor-grab hover:bg-gray-700 transition-colors shadow-sm"
        >
          <span className="text-lg">🖥️</span> Server
        </div>
        
        <div 
          onDragStart={(e) => this.onDragStart(e, 'switch')} 
          draggable 
          className="p-3 border-2 border-green-500 rounded bg-gray-800 flex items-center gap-3 cursor-grab hover:bg-gray-700 transition-colors shadow-sm"
        >
          <span className="text-lg">🔀</span> Switch
        </div>
      </aside>
    );
  }
}

export default Sidebar;