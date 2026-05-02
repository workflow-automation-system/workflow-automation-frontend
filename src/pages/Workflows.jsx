import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
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
import Toast from '../components/ui/Toast';
import useWorkflowStore from '../stores/workflowStore';

const STATUS_FILTERS = [
  { key: 'ALL', label: 'All' },
  { key: 'ACTIVE', label: 'Active' },
  { key: 'INACTIVE', label: 'Inactive' },
];

const ALLOWED_STATUSES = ['ACTIVE', 'INACTIVE'];

const useDebouncedValue = (value, delay = 250) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const timeout = window.setTimeout(() => setDebouncedValue(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);

  return debouncedValue;
};

const formatDate = (value) => {
  if (!value) return 'Never';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Never';

  return date.toLocaleDateString();
};

const getNodeCount = (workflow) => {
  if (Number.isFinite(workflow?.nodeCount)) {
    return workflow.nodeCount;
  }

  return Array.isArray(workflow?.nodes) ? workflow.nodes.length : 0;
};

const isActiveWorkflow = (workflow) => workflow?.status === 'ACTIVE';

const Workflows = () => {
  const navigate = useNavigate();
  const {
    workflows,
    createWorkflow,
    deleteWorkflow,
    executeWorkflow,
    fetchWorkflows,
    isLoading,
    error,
    toggleWorkflowStatus,
    clearError,
  } = useWorkflowStore();

  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('ALL');
  const [actionWorkflowId, setActionWorkflowId] = React.useState(null);
  const [deleteModal, setDeleteModal] = React.useState({ open: false, workflow: null });
  const [createModal, setCreateModal] = React.useState({
    open: false,
    name: '',
    description: '',
    status: 'ACTIVE',
  });
  const [toast, setToast] = React.useState({ open: false, message: '', tone: 'info' });

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 250);

  const showToast = React.useCallback((message, tone = 'info') => {
    setToast({ open: true, message, tone });
  }, []);

  const closeToast = React.useCallback(() => {
    setToast((current) => ({ ...current, open: false }));
  }, []);

  const refreshWorkflows = React.useCallback(async () => {
    try {
      await fetchWorkflows();
    } catch (err) {
      showToast(err.message || 'Failed to fetch workflows', 'error');
    } finally {
      setHasLoadedOnce(true);
    }
  }, [fetchWorkflows, showToast]);

  React.useEffect(() => {
    refreshWorkflows();
  }, [refreshWorkflows]);

  React.useEffect(() => () => clearError?.(), [clearError]);

  const filteredWorkflows = React.useMemo(() => {
    let result = Array.isArray(workflows) ? workflows : [];

    if (statusFilter !== 'ALL') {
      result = result.filter((workflow) => workflow.status === statusFilter);
    }

    const query = debouncedSearchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((workflow) => workflow.name?.toLowerCase().includes(query));
    }

    return result;
  }, [debouncedSearchQuery, statusFilter, workflows]);

  const stats = React.useMemo(() => {
    const total = workflows.length;
    const active = workflows.filter((workflow) => isActiveWorkflow(workflow)).length;
    const executions = workflows.reduce((accumulator, workflow) => {
      if (Number.isFinite(workflow.executionCount)) {
        return accumulator + workflow.executionCount;
      }

      if (Array.isArray(workflow.executions)) {
        return accumulator + workflow.executions.length;
      }

      return accumulator;
    }, 0);

    return { total, active, executions };
  }, [workflows]);

  const handleCreateWorkflow = async () => {
    const name = createModal.name.trim();
    const description = createModal.description.trim();
    const status = createModal.status.toUpperCase();

    if (!name) {
      showToast('Workflow name is required.', 'error');
      return;
    }

    if (!ALLOWED_STATUSES.includes(status)) {
      showToast('Status must be ACTIVE or INACTIVE.', 'error');
      return;
    }

    setActionWorkflowId('create');

    try {
      await createWorkflow({ name, description, status });
      setCreateModal({ open: false, name: '', description: '', status: 'ACTIVE' });
      await refreshWorkflows();
      showToast('Workflow created successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to create workflow', 'error');
    } finally {
      setActionWorkflowId(null);
    }
  };

  const handleDeleteWorkflow = async () => {
    const workflowId = deleteModal.workflow?.id;
    if (!workflowId) {
      return;
    }

    setActionWorkflowId(workflowId);

    try {
      await deleteWorkflow(workflowId);
      setDeleteModal({ open: false, workflow: null });
      showToast('Workflow deleted successfully.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to delete workflow', 'error');
    } finally {
      setActionWorkflowId(null);
    }
  };

  const handleToggleStatus = async (workflow) => {
    setActionWorkflowId(workflow.id);

    try {
      await toggleWorkflowStatus(workflow.id);
      showToast(
        workflow.status === 'ACTIVE' ? 'Workflow paused successfully.' : 'Workflow resumed successfully.',
        'success'
      );
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
    } finally {
      setActionWorkflowId(null);
    }
  };

  const handleExecuteWorkflow = async (workflow) => {
    setActionWorkflowId(workflow.id);

    try {
      await executeWorkflow(workflow.id);
      showToast('Workflow execution started.', 'success');
    } catch (err) {
      showToast(err.message || 'Failed to execute workflow', 'error');
    } finally {
      setActionWorkflowId(null);
    }
  };

  return (
    <div className="space-y-5 font-urbanist">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#292D32]">Workflows</h1>
          <p className="mt-1 text-sm text-[#5C5C5C]">
            Build and operate enterprise automations with controlled branching, retry logic, and execution history.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            clearError?.();
            setCreateModal((current) => ({ ...current, open: true }));
          }}
          className="inline-flex items-center gap-2 rounded-2xl bg-[#292D32] px-5 py-3 text-sm font-semibold text-white hover:bg-[#3C4249]"
        >
          <Plus size={16} />
          Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="enterprise-card border-[#D0FFA4] p-5">
          <p className="text-sm text-[#5C5C5C]">Total Workflows</p>
          <p className="mt-2 text-3xl font-bold text-[#292D32]">{stats.total}</p>
        </div>
        <div className="enterprise-card p-5">
          <p className="text-sm text-[#5C5C5C]">Active Scenarios</p>
          <p className="mt-2 text-3xl font-bold text-[#292D32]">{stats.active}</p>
        </div>
        <div className="enterprise-card p-5">
          <p className="text-sm text-[#5C5C5C]">Execution Count</p>
          <p className="mt-2 text-3xl font-bold text-[#292D32]">{stats.executions.toLocaleString()}</p>
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
            className="w-full rounded-2xl border border-[#E2E8F0] bg-white py-3 pl-10 pr-4 text-sm text-[#292D32] focus:border-[#D0FFA4] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status.key}
              type="button"
              onClick={() => setStatusFilter(status.key)}
              className={[
                'rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors',
                statusFilter === status.key
                  ? 'border-[#292D32] bg-[#292D32] text-white'
                  : 'border-[#E2E8F0] bg-white text-[#5C5C5C] hover:border-[#D0FFA4]',
              ].join(' ')}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {error && workflows.length === 0 && !isLoading ? (
        <section className="enterprise-card p-10 text-center">
          <AlertCircle size={28} className="mx-auto text-[#EF4444]" />
          <h3 className="mt-3 text-lg font-semibold text-[#292D32]">Failed to load workflows</h3>
          <p className="mt-2 text-sm text-[#5C5C5C]">{error}</p>
          <button
            type="button"
            onClick={refreshWorkflows}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#292D32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3C4249]"
          >
            Retry
          </button>
        </section>
      ) : !hasLoadedOnce && isLoading ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <WorkflowCardSkeleton key={`workflow-skeleton-${index}`} />
          ))}
        </section>
      ) : filteredWorkflows.length === 0 ? (
        <section className="enterprise-card p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#D0FFA4]">
            <GitBranch size={24} className="text-[#292D32]" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-[#292D32]">No workflows found</h3>
          <p className="mt-2 text-sm text-[#5C5C5C]">
            {workflows.length === 0
              ? 'Create your first workflow to get started with automation.'
              : 'No workflow matches your current search/filter.'}
          </p>
          <button
            type="button"
            onClick={() => setCreateModal((current) => ({ ...current, open: true }))}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#292D32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3C4249]"
          >
            <Plus size={16} />
            Create Workflow
          </button>
        </section>
      ) : (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              actionInProgress={actionWorkflowId === workflow.id}
              onView={() => navigate(`/workflow/${workflow.id}`)}
              onEdit={() => navigate(`/create-workflow?id=${workflow.id}`)}
              onExecute={() => handleExecuteWorkflow(workflow)}
              onToggle={() => handleToggleStatus(workflow)}
              onDelete={() => setDeleteModal({ open: true, workflow })}
              formatDate={(item) =>
                formatDate(item.createdAt || item.updatedAt || item.lastExecution || null)
              }
            />
          ))}
        </section>
      )}

      <Modal
        isOpen={createModal.open}
        onClose={() =>
          setCreateModal({
            open: false,
            name: '',
            description: '',
            status: 'ACTIVE',
          })
        }
        title="Create Workflow"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold text-[#292D32]">Name</label>
            <input
              type="text"
              value={createModal.name}
              onChange={(event) =>
                setCreateModal((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="Email Notification Workflow"
              className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm text-[#292D32] focus:border-[#D0FFA4] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#292D32]">Description</label>
            <textarea
              value={createModal.description}
              onChange={(event) =>
                setCreateModal((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe the workflow objective..."
              rows={3}
              className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm text-[#292D32] focus:border-[#D0FFA4] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-[#292D32]">Status</label>
            <select
              value={createModal.status}
              onChange={(event) =>
                setCreateModal((current) => ({
                  ...current,
                  status: event.target.value.toUpperCase(),
                }))
              }
              className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm text-[#292D32] focus:border-[#D0FFA4] focus:outline-none"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() =>
                setCreateModal({
                  open: false,
                  name: '',
                  description: '',
                  status: 'ACTIVE',
                })
              }
              className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#5C5C5C] hover:border-[#D0FFA4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateWorkflow}
              disabled={actionWorkflowId === 'create'}
              className="rounded-xl bg-[#292D32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3C4249] disabled:opacity-70"
            >
              {actionWorkflowId === 'create' ? 'Creating...' : 'Create Workflow'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={deleteModal.open} onClose={() => setDeleteModal({ open: false, workflow: null })} title="Delete Workflow">
        <p className="mb-5 text-sm text-[#5C5C5C]">
          Delete <strong className="text-[#292D32]">{deleteModal.workflow?.name}</strong>? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setDeleteModal({ open: false, workflow: null })}
            className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#5C5C5C] hover:border-[#D0FFA4]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteWorkflow}
            disabled={actionWorkflowId === deleteModal.workflow?.id}
            className="rounded-xl bg-[#EF4444] px-4 py-2 text-sm font-semibold text-white hover:bg-[#DC2626] disabled:opacity-70"
          >
            {actionWorkflowId === deleteModal.workflow?.id ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>

      <Toast
        open={toast.open}
        message={toast.message}
        tone={toast.tone}
        onClose={closeToast}
      />
    </div>
  );
};

const WorkflowCard = ({
  workflow,
  actionInProgress,
  onView,
  onEdit,
  onExecute,
  onToggle,
  onDelete,
  formatDate,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const isActive = isActiveWorkflow(workflow);
  const nodeCount = getNodeCount(workflow);

  return (
    <article className="enterprise-card overflow-hidden">
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#D0FFA4]">
              <GitBranch size={18} className="text-[#292D32]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#292D32]">{workflow.name}</p>
              <span
                className={[
                  'inline-flex rounded-full px-2 py-1 text-[11px] font-semibold',
                  isActive
                    ? 'bg-[#D0FFA4] text-[#292D32]'
                    : 'border border-[#E2E8F0] bg-white text-[#5C5C5C]',
                ].join(' ')}
              >
                {isActive ? 'Running' : 'Paused'}
              </span>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              disabled={actionInProgress}
              onClick={() => setShowMenu((prev) => !prev)}
              className="rounded-lg p-1.5 text-[#5C5C5C] hover:bg-white"
            >
              <MoreVertical size={16} />
            </button>

            {showMenu && (
              <div className="absolute right-0 z-10 mt-1 w-44 rounded-xl border border-[#E2E8F0] bg-white p-1 shadow-lg">
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onView();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#292D32] hover:bg-[#F6F5FA]"
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
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#292D32] hover:bg-[#F6F5FA]"
                >
                  <Edit size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onExecute();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#292D32] hover:bg-[#F6F5FA]"
                >
                  <Play size={14} />
                  Execute
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onToggle();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[#292D32] hover:bg-[#F6F5FA]"
                >
                  {isActive ? <Pause size={14} /> : <Play size={14} />}
                  {isActive ? 'Disable' : 'Enable'}
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
            {nodeCount} nodes
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {formatDate(workflow)}
          </span>
        </div>
      </div>

      <div className="border-t border-[#E2E8F0] px-5 py-3">
        <button
          type="button"
          onClick={onView}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#292D32] hover:text-[#3C4249]"
        >
          Open Workflow
          <ArrowRight size={14} />
        </button>
      </div>
    </article>
  );
};

const WorkflowCardSkeleton = () => (
  <article className="enterprise-card overflow-hidden">
    <div className="space-y-4 p-5">
      <div className="h-4 w-2/3 rounded bg-[#E2E8F0]" />
      <div className="h-7 w-20 rounded-full bg-[#E2E8F0]" />
      <div className="h-4 w-full rounded bg-[#E2E8F0]" />
      <div className="h-4 w-5/6 rounded bg-[#E2E8F0]" />
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-[#E2E8F0]" />
        <div className="h-4 w-24 rounded bg-[#E2E8F0]" />
      </div>
    </div>
    <div className="border-t border-[#E2E8F0] px-5 py-3">
      <div className="h-4 w-28 rounded bg-[#E2E8F0]" />
    </div>
  </article>
);

export default Workflows;
