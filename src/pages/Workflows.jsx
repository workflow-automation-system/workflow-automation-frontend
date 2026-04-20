import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Clock,
  Edit,
  Eye,
  GitBranch,
  MoreVertical,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import Modal from '../components/ui/Modal';
import useWorkflowStore from '../stores/workflowStore';

const Workflows = () => {
  const navigate = useNavigate();
  const { workflows, deleteWorkflow, toggleWorkflowStatus } = useWorkflowStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [deleteModal, setDeleteModal] = React.useState({ open: false, workflow: null });

  const filteredWorkflows = React.useMemo(() => {
    let result = workflows;

    if (statusFilter !== 'all') {
      result = result.filter((workflow) => workflow.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (workflow) =>
          workflow.name.toLowerCase().includes(query) ||
          workflow.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [workflows, statusFilter, searchQuery]);

  const stats = React.useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter((workflow) => workflow.status === 'active').length;
    const executions = workflows.reduce((acc, workflow) => acc + (workflow.executions?.length || 0), 0);
    return { total, active, executions };
  }, [workflows]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diff < 1) return 'Less than 1 hour ago';
    if (diff < 24) return `${diff} hour${diff === 1 ? '' : 's'} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-5 font-urbanist">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#212121]">Workflows</h1>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Build and operate enterprise automations with controlled branching, retry logic, and execution history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/create-workflow')}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#212121] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3A3A3A]"
        >
          <Plus size={16} />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="enterprise-card p-5">
          <p className="text-sm text-[#5C5C5C]">Total Workflows</p>
          <p className="mt-2 text-3xl font-bold text-[#212121]">{stats.total}</p>
        </div>
        <div className="enterprise-card p-5">
          <p className="text-sm text-[#5C5C5C]">Active Scenarios</p>
          <p className="mt-2 text-3xl font-bold text-[#212121]">{stats.active}</p>
        </div>
        <div className="enterprise-card p-5">
          <p className="text-sm text-[#5C5C5C]">Execution Count</p>
          <p className="mt-2 text-3xl font-bold text-[#212121]">{stats.executions.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A8A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search workflows"
            className="w-full rounded-2xl border border-[#D8DFE9] bg-white py-3 pl-10 pr-4 text-sm text-[#212121] focus:border-[#CFDECA] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={[
                'rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
                statusFilter === status
                  ? 'border-[#212121] bg-[#212121] text-white'
                  : 'border-[#D8DFE9] bg-white text-[#5C5C5C] hover:border-[#CFDECA]',
              ].join(' ')}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredWorkflows.length === 0 ? (
        <section className="enterprise-card p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#D8DFE9] bg-white">
            <GitBranch size={24} className="text-[#5C5C5C]" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-[#212121]">No workflows found</h2>
          <p className="mt-1 text-sm text-[#5C5C5C]">Adjust your filters or create a new workflow.</p>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onView={() => navigate(`/workflow/${workflow.id}`)}
              onEdit={() => navigate(`/create-workflow?id=${workflow.id}`)}
              onToggle={() => toggleWorkflowStatus(workflow.id)}
              onDelete={() => setDeleteModal({ open: true, workflow })}
              formatDate={formatDate}
            />
          ))}
        </section>
      )}

      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, workflow: null })}
        title="Delete Workflow"
      >
        <p className="mb-5 text-sm text-[#5C5C5C]">
          Delete <strong className="text-[#212121]">{deleteModal.workflow?.name}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteModal({ open: false, workflow: null })}
            className="rounded-xl border border-[#D8DFE9] bg-white px-4 py-2 text-sm font-semibold text-[#5C5C5C] hover:border-[#CFDECA]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (deleteModal.workflow) {
                deleteWorkflow(deleteModal.workflow.id);
              }
              setDeleteModal({ open: false, workflow: null });
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

const WorkflowCard = ({ workflow, onView, onEdit, onToggle, onDelete, formatDate }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <article className="enterprise-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#D8DFE9] bg-[#CFDECA]">
              <GitBranch size={18} className="text-[#212121]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#212121]">{workflow.name}</p>
              <span
                className={[
                  'inline-flex rounded-full px-2 py-1 text-[11px] font-semibold',
                  workflow.status === 'active' ? 'bg-[#CFDECA] text-[#212121]' : 'bg-white text-[#5C5C5C] border border-[#D8DFE9]',
                ].join(' ')}
              >
                {workflow.status === 'active' ? 'Running' : 'Paused'}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="rounded-lg p-1.5 text-[#5C5C5C] hover:bg-white"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-[#D8DFE9] bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onView();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#212121] hover:bg-[#F6F5FA]"
                >
                  <Eye size={14} />
                  View
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#212121] hover:bg-[#F6F5FA]"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onToggle();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#212121] hover:bg-[#F6F5FA]"
                >
                  {workflow.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                  {workflow.status === 'active' ? 'Disable' : 'Enable'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onDelete();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#EF4444] hover:bg-red-50"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-sm text-[#5C5C5C]">
          {workflow.description || 'No description has been provided for this workflow.'}
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-[#5C5C5C]">
          <span className="inline-flex items-center gap-1">
            <GitBranch size={12} />
            {workflow.nodes?.length || 0} nodes
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {formatDate(workflow.lastExecution)}
          </span>
        </div>
      </div>

      <div className="border-t border-[#D8DFE9] px-5 py-3">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#212121] hover:text-[#3A3A3A]"
        >
          Open Workflow
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
};

export default Workflows;
