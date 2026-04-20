import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Background, Controls, MarkerType, MiniMap, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Edit,
  Pause,
  Play,
  ShieldCheck,
  Trash2,
  Workflow,
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import CustomNode from '../components/workflow/nodes/CustomNode';
import { nodeTypes } from '../mock/data';
import useWorkflowStore from '../stores/workflowStore';

const nodeTypesMap = Object.fromEntries(nodeTypes.map((node) => [node.type, CustomNode]));

const WorkflowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteWorkflow, getWorkflowById, toggleWorkflowStatus } = useWorkflowStore();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const workflow = getWorkflowById(id);

  if (!workflow) {
    return (
      <div className="enterprise-card flex h-72 flex-col items-center justify-center text-center font-urbanist">
        <Workflow size={28} className="text-[#5C5C5C]" />
        <h2 className="mt-3 text-lg font-semibold text-[#292D32]">Workflow not found</h2>
        <p className="mt-1 text-sm text-[#5C5C5C]">The requested workflow does not exist in your workspace.</p>
        <button
          type="button"
          onClick={() => navigate('/workflows')}
          className="mt-4 rounded-xl bg-[#292D32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3C4249]"
        >
          Back to Workflows
        </button>
      </div>
    );
  }

  const executions = workflow.executions || [];
  const successful = executions.filter((execution) => execution.status === 'success').length;
  const successRate = executions.length ? ((successful / executions.length) * 100).toFixed(0) : '0';

  const nodes = (workflow.nodes || []).map((node) => ({
    ...node,
    data: {
      ...node.data,
      label: node.data?.label || node.type,
    },
  }));

  const edges = (workflow.edges || []).map((edge) => ({
    ...edge,
    markerEnd: { type: MarkerType.ArrowClosed, color: '#D0FFA4' },
    style: { stroke: '#D0FFA4', strokeWidth: 2.2 },
  }));

  const formatDate = (value) => {
    if (!value) return 'Never';
    return new Date(value).toLocaleString();
  };

  return (
    <div className="space-y-5 font-urbanist">
      <header className="enterprise-card p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => navigate('/workflows')}
              className="rounded-xl border border-[#E2E8F0] bg-white p-2 text-[#5C5C5C] hover:border-[#D0FFA4]"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-[#292D32]">{workflow.name}</h1>
                <span
                  className={[
                    'rounded-full px-2 py-1 text-xs font-semibold',
                    workflow.status === 'active'
                      ? 'bg-[#D0FFA4] text-[#292D32]'
                      : 'border border-[#E2E8F0] bg-white text-[#5C5C5C]',
                  ].join(' ')}
                >
                  {workflow.status === 'active' ? 'Running' : 'Paused'}
                </span>
              </div>
              <p className="mt-1 text-sm text-[#5C5C5C]">
                {workflow.description || 'No description available for this workflow.'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => toggleWorkflowStatus(id)}
              className={[
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold',
                workflow.status === 'active'
                  ? 'border border-[#E2E8F0] bg-white text-[#5C5C5C] hover:border-[#D0FFA4]'
                  : 'bg-[#D0FFA4] text-[#292D32] hover:bg-[#BDEB94]',
              ].join(' ')}
            >
              {workflow.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
              {workflow.status === 'active' ? 'Disable' : 'Enable'}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/create-workflow?id=${workflow.id}`)}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#292D32] hover:border-[#D0FFA4]"
            >
              <Edit size={14} />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-[#EF4444] hover:bg-red-100"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <StatCard label="Nodes" value={String(workflow.nodes?.length || 0)} />
        <StatCard label="Executions" value={String(executions.length)} />
        <StatCard label="Success Rate" value={`${successRate}%`} />
        <StatCard label="Last Run" value={workflow.lastExecution ? new Date(workflow.lastExecution).toLocaleDateString() : 'Never'} />
      </section>

      <section className="enterprise-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#292D32]">Workflow Canvas</h2>
            <p className="text-sm text-[#5C5C5C]">Read-only topology for branch logic, connector sequencing, and fallback coverage.</p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D0FFA4] px-3 py-1 text-xs font-semibold text-[#292D32]">
            <ShieldCheck size={12} />
            Governed
          </span>
        </div>
        <div className="h-[420px] bg-white">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypesMap}
            fitView
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
          >
            <Background gap={24} color="#E2E8F0" />
            <Controls showInteractive={false} />
            <MiniMap nodeColor="#D0FFA4" maskColor="rgba(246, 245, 250, 0.7)" />
          </ReactFlow>
        </div>
      </section>

      <section className="enterprise-card overflow-hidden">
        <div className="border-b border-[#E2E8F0] px-5 py-4">
          <h2 className="text-lg font-semibold text-[#292D32]">Execution History</h2>
          <p className="text-sm text-[#5C5C5C]">Operational telemetry for workflow reliability monitoring.</p>
        </div>

        {executions.length === 0 ? (
          <div className="p-8 text-center">
            <Clock size={20} className="mx-auto text-[#5C5C5C]" />
            <p className="mt-2 text-sm text-[#5C5C5C]">No executions recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#E2E8F0]">
              <thead className="bg-white">
                <tr className="text-left text-xs uppercase tracking-[0.06em] text-[#5C5C5C]">
                  <th className="px-5 py-3">Timestamp</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Trigger</th>
                </tr>
              </thead>
               <tbody className="divide-y divide-[#E2E8F0] bg-[#F6F5FA]">
                {executions.map((execution) => (
                  <tr key={execution.id}>
                    <td className="px-5 py-3 text-sm text-[#292D32]">{formatDate(execution.timestamp)}</td>
                    <td className="px-5 py-3">
                      <span
                        className={[
                          'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold',
                          execution.status === 'success'
                            ? 'bg-[#D0FFA4] text-[#292D32]'
                            : 'bg-[#D0FFA4] text-[#292D32]',
                        ].join(' ')}
                      >
                        {execution.status === 'success' ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                        {execution.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-sm text-[#5C5C5C]">{execution.duration}</td>
                    <td className="px-5 py-3 text-sm text-[#5C5C5C]">{execution.trigger}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Workflow">
        <p className="mb-5 text-sm text-[#5C5C5C]">
          Delete <strong className="text-[#292D32]">{workflow.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteModal(false)}
            className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#5C5C5C] hover:border-[#D0FFA4]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              deleteWorkflow(id);
              navigate('/workflows');
            }}
            className="rounded-xl bg-[#EF4444] px-4 py-2 text-sm font-semibold text-white hover:bg-[#DC2626]"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <article className="enterprise-card p-4">
    <p className="text-xs uppercase tracking-[0.06em] text-[#5C5C5C]">{label}</p>
    <p className="mt-2 text-xl font-bold text-[#292D32]">{value}</p>
  </article>
);

export default WorkflowDetail;
