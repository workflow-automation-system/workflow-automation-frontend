import React from 'react';
import { Handle, Position } from '@xyflow/react';
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
  Table2,
  Zap,
} from 'lucide-react';
import { nodeTypes } from '../../../mock/data';

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

const nodeBg = {
  trigger: '#EFF0A3',
  condition: '#D8DFE9',
  data_mapper: '#D8DFE9',
  error_handler: '#EFF0A3',
  notion: '#CFDECA',
  google_sheets: '#CFDECA',
  chatgpt: '#CFDECA',
  slack: '#CFDECA',
  email: '#CFDECA',
  webhook: '#D8DFE9',
  delay: '#F6F5FA',
};

const getSubtitle = (type, data) => {
  switch (type) {
    case 'trigger':
      return data?.eventType || 'Manual event';
    case 'condition':
      return data?.expression || 'branch expression';
    case 'data_mapper':
      return data?.mappingMode || 'strict mapping';
    case 'error_handler':
      return data?.policy || 'retry policy';
    case 'notion':
      return data?.action || 'create page';
    case 'google_sheets':
      return data?.worksheet || 'Sheet1';
    case 'chatgpt':
      return data?.model || 'gpt model';
    case 'slack':
      return data?.channel || '#channel';
    case 'email':
      return data?.to || 'recipient';
    case 'webhook':
      return data?.method || 'GET';
    case 'delay':
      return data?.duration ? `${data.duration} ${data.unit}` : '5 minutes';
    default:
      return 'Configure node';
  }
};

const CustomNode = ({ data, selected, type }) => {
  const nodeConfig = nodeTypes.find((node) => node.type === type);
  const Icon = iconMap[nodeConfig?.icon] || Zap;

  return (
    <div
      className={[
        'min-w-[230px] rounded-2xl border bg-[#F6F5FA] px-4 py-3 shadow-card transition-all',
        selected ? 'border-[#CFDECA] ring-2 ring-[#CFDECA]/40' : 'border-[#D8DFE9]',
      ].join(' ')}
    >
      {type !== 'trigger' && (
        <Handle
          type="target"
          position={Position.Left}
          className="!h-3 !w-3 !border-2 !border-white !bg-[#CFDECA]"
        />
      )}

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#D8DFE9]"
          style={{ backgroundColor: nodeBg[type] || '#CFDECA' }}
        >
          <Icon size={16} className="text-[#212121]" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#212121]">
            {data?.label || nodeConfig?.label || 'Node'}
          </p>
          <p className="truncate text-xs text-[#5C5C5C]">{getSubtitle(type, data)}</p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!h-3 !w-3 !border-2 !border-white !bg-[#CFDECA]"
      />
    </div>
  );
};

export default CustomNode;
