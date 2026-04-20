import React from 'react';
import {
  BookCopy,
  Bot,
  Clock,
  GitBranch,
  Globe,
  Mail,
  MessageSquare,
  Sheet,
  ShieldAlert,
  Sparkles,
  Table2,
  Zap,
} from 'lucide-react';
import { nodeTypes } from '../../mock/data';

const iconMap = {
  Zap,
  GitBranch,
  Table2,
  ShieldAlert,
  BookCopy,
  Sheet,
  Bot,
  MessageSquare,
  Mail,
  Globe,
  Clock,
};

const getNodeColor = (type) => {
  if (['trigger', 'error_handler'].includes(type)) return '#EFF0A3';
  if (['condition', 'data_mapper', 'webhook'].includes(type)) return '#D8DFE9';
  if (['delay'].includes(type)) return '#F6F5FA';
  return '#CFDECA';
};

const NodeSidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="enterprise-card h-full w-full min-w-[270px] max-w-[290px] overflow-hidden">
      <div className="border-b border-[#D8DFE9] p-5">
        <div className="mb-1 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[#212121]" />
          <h3 className="text-sm font-semibold text-[#212121]">Workflow Nodes</h3>
        </div>
        <p className="text-xs text-[#5C5C5C]">
          Drag nodes into the canvas to compose secure multi-step enterprise automations.
        </p>
      </div>

      <div className="max-h-[calc(100vh-18rem)] space-y-2 overflow-y-auto p-4">
        {nodeTypes.map((node) => {
          const Icon = iconMap[node.icon] || Zap;
          return (
            <button
              key={node.type}
              type="button"
              draggable
              onDragStart={(event) => onDragStart(event, node.type)}
              className="flex w-full cursor-grab items-start gap-3 rounded-2xl border border-[#D8DFE9] bg-white p-3 text-left transition-colors hover:border-[#CFDECA]"
            >
              <span
                className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8DFE9]"
                style={{ backgroundColor: getNodeColor(node.type) }}
              >
                <Icon size={16} className="text-[#212121]" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-[#212121]">{node.label}</span>
                <span className="mt-0.5 block text-xs text-[#5C5C5C]">{node.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-[#D8DFE9] p-4">
        <div className="rounded-xl border border-[#D8DFE9] bg-white p-3 text-xs text-[#5C5C5C]">
          Use <strong className="text-[#212121]">Condition Branch</strong>, <strong className="text-[#212121]">Error Handler</strong>, and{' '}
          <strong className="text-[#212121]">Data Mapper</strong> to model enterprise logic safely.
        </div>
      </div>
    </aside>
  );
};

export default NodeSidebar;
