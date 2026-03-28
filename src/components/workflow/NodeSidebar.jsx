import React from 'react';
import { Zap, Mail, Globe, Clock } from 'lucide-react';
import { nodeTypes } from '../../mock/data';

const iconMap = {
  Zap,
  Mail,
  Globe,
  Clock,
};

const NodeSidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div className="w-64 bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="p-4 border-b border-[var(--border)]">
        <h3 className="font-semibold text-[var(--text-primary)]">Nodes</h3>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Drag nodes to the canvas
        </p>
      </div>
      <div className="p-3 space-y-2">
        {nodeTypes.map((node) => {
          const Icon = iconMap[node.icon] || Zap;
          return (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className="flex items-center gap-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--background)] cursor-grab hover:shadow-md transition-shadow"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${node.color}20` }}
              >
                <Icon size={20} style={{ color: node.color }} />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-[var(--text-primary)] text-sm">
                  {node.label}
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  {node.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NodeSidebar;