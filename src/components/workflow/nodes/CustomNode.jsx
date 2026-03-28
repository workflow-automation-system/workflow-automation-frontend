import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, Mail, Globe, Clock } from 'lucide-react';
import { nodeTypes } from '../../../mock/data';

const iconMap = {
  Zap,
  Mail,
  Globe,
  Clock,
};

const CustomNode = ({ data, selected }) => {
  const nodeConfig = nodeTypes.find((n) => n.type === data?.type);
  const Icon = iconMap[nodeConfig?.icon] || Zap;
  const color = nodeConfig?.color || '#3b82f6';

  return (
    <div
      className={`
        px-4 py-3 rounded-lg border-2 bg-[var(--surface)] min-w-[180px]
        ${selected ? 'border-[var(--primary)] shadow-lg' : 'border-[var(--border)]'}
      `}
    >
      {/* Input Handle */}
      {data?.type !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-[var(--primary)] !border-2 !border-[var(--background)]"
        />
      )}

      {/* Node Content */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}20` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[var(--text-primary)]">
            {data?.label || nodeConfig?.label || 'Node'}
          </h4>
          {data?.type === 'trigger' && data?.eventType && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {data.eventType}
            </p>
          )}
          {data?.type === 'email' && data?.to && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {data.to}
            </p>
          )}
          {data?.type === 'webhook' && data?.method && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {data.method} Request
            </p>
          )}
          {data?.type === 'delay' && data?.duration && (
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {data.duration} {data.unit}
            </p>
          )}
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-[var(--primary)] !border-2 !border-[var(--background)]"
      />
    </div>
  );
};

export default CustomNode;