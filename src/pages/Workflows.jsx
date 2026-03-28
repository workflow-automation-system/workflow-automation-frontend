import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, GitBranch, Play, Pause, MoreVertical, Trash2, Eye, Edit } from 'lucide-react';
import useWorkflowStore from '../stores/workflowStore';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';

const Workflows = () => {
  const navigate = useNavigate();
  const { workflows, deleteWorkflow, toggleWorkflowStatus } = useWorkflowStore();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [deleteModal, setDeleteModal] = React.useState({ open: false, workflow: null });

  // Filter workflows
  const filteredWorkflows = React.useMemo(() => {
    let result = workflows;

    if (statusFilter !== 'all') {
      result = result.filter((w) => w.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (w) =>
          w.name.toLowerCase().includes(query) ||
          w.description?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [workflows, statusFilter, searchQuery]);

  const handleDelete = () => {
    if (deleteModal.workflow) {
      deleteWorkflow(deleteModal.workflow.id);
      setDeleteModal({ open: false, workflow: null });
    }
  };

  const handleToggleStatus = (workflow) => {
    toggleWorkflowStatus(workflow.id);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Workflows</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Manage and monitor your automation workflows
          </p>
        </div>
        <Button onClick={() => navigate('/create-workflow')}>
          <Plus size={18} className="mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={Search}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'active', 'inactive'].map((status) => (
            <Button
              key={status}
              variant={statusFilter === status ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setStatusFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Workflows Grid */}
      {filteredWorkflows.length === 0 ? (
        <Card className="p-12">
          <div className="text-center">
            <GitBranch className="w-12 h-12 mx-auto mb-4 text-[var(--text-muted)]" />
            <h3 className="text-lg font-medium text-[var(--text-primary)] mb-2">
              {workflows.length === 0 ? 'No workflows yet' : 'No workflows match your search'}
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              {workflows.length === 0
                ? 'Create your first workflow to start automating tasks'
                : 'Try adjusting your search or filters'}
            </p>
            {workflows.length === 0 && (
              <Button onClick={() => navigate('/create-workflow')}>
                <Plus size={18} className="mr-2" />
                Create Workflow
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWorkflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onView={() => navigate(`/workflow/${workflow.id}`)}
              onEdit={() => navigate(`/create-workflow?id=${workflow.id}`)}
              onToggle={() => handleToggleStatus(workflow)}
              onDelete={() => setDeleteModal({ open: true, workflow })}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, workflow: null })}
        title="Delete Workflow"
      >
        <p className="text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete <strong>"{deleteModal.workflow?.name}"</strong>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal({ open: false, workflow: null })}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

const WorkflowCard = ({ workflow, onView, onEdit, onToggle, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <Card hoverable className="overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)] bg-opacity-10 flex items-center justify-center">
              <GitBranch className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h3 className="font-medium text-[var(--text-primary)]">{workflow.name}</h3>
              <Badge variant={workflow.status === 'active' ? 'active' : 'inactive'} className="mt-1">
                {workflow.status}
              </Badge>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg text-[var(--text-secondary)] hover:bg-[var(--surface-hover)]"
            >
              <MoreVertical size={18} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 mt-1 w-40 bg-[var(--surface)] border border-[var(--border)] rounded-lg shadow-lg z-20">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onView();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onEdit();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onToggle();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--surface-hover)]"
                  >
                    {workflow.status === 'active' ? <Pause size={16} /> : <Play size={16} />}
                    {workflow.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onDelete();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[var(--error)] hover:bg-[var(--surface-hover)]"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
          {workflow.description || 'No description'}
        </p>

        <div className="flex items-center justify-between text-sm text-[var(--text-muted)]">
          <span>{workflow.nodes?.length || 0} nodes</span>
          <span>{workflow.executions?.length || 0} runs</span>
        </div>
      </div>

      <div className="px-4 py-3 bg-[var(--surface-hover)] border-t border-[var(--border)]">
        <button
          onClick={onView}
          className="text-sm text-[var(--primary)] hover:underline font-medium"
        >
          View Details
        </button>
      </div>
    </Card>
  );
};

export default Workflows;