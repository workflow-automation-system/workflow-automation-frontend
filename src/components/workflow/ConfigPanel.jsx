import React from 'react';
import { X, Trash2 } from 'lucide-react';
import { nodeTypes } from '../../mock/data';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const ConfigPanel = ({ node, onClose, onUpdate, onDelete }) => {
  const nodeConfig = nodeTypes.find((n) => n.type === node.type);

  const handleChange = (field, value) => {
    onUpdate(node.id, { [field]: value });
  };

  const renderConfigFields = () => {
    switch (node.type) {
      case 'trigger':
        return (
          <>
            <Input
              label="Label"
              value={node.data?.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Enter trigger name"
            />
            <Select
              label="Event Type"
              value={node.data?.eventType || 'manual'}
              onChange={(value) => handleChange('eventType', value)}
              options={[
                { value: 'manual', label: 'Manual Trigger' },
                { value: 'webhook', label: 'Webhook' },
                { value: 'schedule', label: 'Schedule' },
                { value: 'order_created', label: 'Order Created' },
                { value: 'customer_created', label: 'Customer Created' },
              ]}
            />
          </>
        );

      case 'email':
        return (
          <>
            <Input
              label="Label"
              value={node.data?.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Enter email name"
            />
            <Input
              label="To"
              type="email"
              value={node.data?.to || ''}
              onChange={(e) => handleChange('to', e.target.value)}
              placeholder="recipient@example.com"
            />
            <Input
              label="Subject"
              value={node.data?.subject || ''}
              onChange={(e) => handleChange('subject', e.target.value)}
              placeholder="Email subject"
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Body
              </label>
              <textarea
                value={node.data?.body || ''}
                onChange={(e) => handleChange('body', e.target.value)}
                placeholder="Email body content..."
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent min-h-[100px] resize-y"
              />
            </div>
          </>
        );

      case 'webhook':
        return (
          <>
            <Input
              label="Label"
              value={node.data?.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Enter webhook name"
            />
            <Input
              label="URL"
              value={node.data?.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://api.example.com/endpoint"
            />
            <Select
              label="Method"
              value={node.data?.method || 'GET'}
              onChange={(value) => handleChange('method', value)}
              options={[
                { value: 'GET', label: 'GET' },
                { value: 'POST', label: 'POST' },
                { value: 'PUT', label: 'PUT' },
                { value: 'DELETE', label: 'DELETE' },
                { value: 'PATCH', label: 'PATCH' },
              ]}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">
                Headers (JSON)
              </label>
              <textarea
                value={JSON.stringify(node.data?.headers || {}, null, 2)}
                onChange={(e) => {
                  try {
                    const headers = JSON.parse(e.target.value);
                    handleChange('headers', headers);
                  } catch {
                    // Invalid JSON, skip
                  }
                }}
                placeholder='{"Authorization": "Bearer token"}'
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent min-h-[80px] resize-y font-mono text-sm"
              />
            </div>
          </>
        );

      case 'delay':
        return (
          <>
            <Input
              label="Label"
              value={node.data?.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Enter delay name"
            />
            <Input
              label="Duration"
              type="number"
              value={node.data?.duration || ''}
              onChange={(e) => handleChange('duration', parseInt(e.target.value, 10) || 0)}
              placeholder="5"
            />
            <Select
              label="Unit"
              value={node.data?.unit || 'minutes'}
              onChange={(value) => handleChange('unit', value)}
              options={[
                { value: 'seconds', label: 'Seconds' },
                { value: 'minutes', label: 'Minutes' },
                { value: 'hours', label: 'Hours' },
                { value: 'days', label: 'Days' },
              ]}
            />
          </>
        );

      default:
        return (
          <Input
            label="Label"
            value={node.data?.label || ''}
            onChange={(e) => handleChange('label', e.target.value)}
            placeholder="Enter node name"
          />
        );
    }
  };

  return (
    <div className="w-80 bg-[var(--surface)] border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${nodeConfig?.color}20` || 'var(--surface)' }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: nodeConfig?.color || 'var(--text-primary)' }}
            />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">
            {nodeConfig?.label || 'Node'} Configuration
          </h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
        {renderConfigFields()}
      </div>

      <div className="p-4 border-t border-[var(--border)]">
        <Button variant="danger" onClick={onDelete} className="w-full">
          <Trash2 size={16} className="mr-2" />
          Delete Node
        </Button>
      </div>
    </div>
  );
};

export default ConfigPanel;