import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ReactFlow, Controls, MiniMap, Background, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, Play, Pause, Edit, Trash2, Clock, CheckCircle } from 'lucide-react';
import useWorkflowStore from '../stores/workflowStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import CustomNode from '../components/workflow/nodes/CustomNode';

const nodeTypes = {
  trigger: CustomNode,
  email: CustomNode,
  webhook: CustomNode,
  delay: CustomNode,
};

const WorkflowDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getWorkflowById, toggleWorkflowStatus, deleteWorkflow } = useWorkflowStore();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const workflow = getWorkflowById(id);

  if (!workflow) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Workflow not found
        </h2>
        <p className="text-[var(--text-secondary)] mb-4">
          The workflow you're looking for doesn't exist.
        </p>
        <Button onClick={() => navigate('/workflows')}>
          <ArrowLeft size={18} className="mr-2" />
          Back to Workflows
        </Button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = () => {
    deleteWorkflow(id);
    navigate('/workflows');
  };

  const handleToggle = () => {
    toggleWorkflowStatus(id);
  };

  // Convert workflow nodes/edges to React Flow format
  const nodes = (workflow.nodes || []).map((node) => ({
    ...node,
    data: { ...node.data, label: node.data?.label || node.type },
  }));

  const edges = (workflow.edges || []).map((edge) => ({
    ...edge,
    markerEnd: { type: MarkerType.ArrowClosed },
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/workflows')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                {workflow.name}
              </h1>
              <Badge variant={workflow.status === 'active' ? 'active' : 'inactive'}>
                {workflow.status}
              </Badge>
            </div>
            <p className="text-[var(--text-secondary)] mt-1">
              {workflow.description || 'No description'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={workflow.status === 'active' ? 'secondary' : 'primary'}
            onClick={handleToggle}
          >
            {workflow.status === 'active' ? (
              <>
                <Pause size={18} className="mr-2" />
                Disable
              </>
            ) : (
              <>
                <Play size={18} className="mr-2" />
                Enable
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/create-workflow?id=${id}`)}>
            <Edit size={18} className="mr-2" />
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            <Trash2 size={18} className="mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Workflow Diagram */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-[var(--text-primary)]">Workflow Diagram</h2>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="h-80">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              fitView
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={false}
            >
              <Background />
              <Controls showInteractive={false} />
              <MiniMap />
            </ReactFlow>
          </div>
        </Card.Body>
      </Card>

      {/* Workflow Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Created</p>
              <p className="font-medium text-[var(--text-primary)]">
                {formatDate(workflow.createdAt)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Last Run</p>
              <p className="font-medium text-[var(--text-primary)]">
                {formatDate(workflow.lastExecution)}
              </p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <Play className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-[var(--text-secondary)]">Total Runs</p>
              <p className="font-medium text-[var(--text-primary)]">
                {workflow.executions?.length || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Execution History */}
      <Card>
        <Card.Header>
          <h2 className="font-semibold text-[var(--text-primary)]">Execution History</h2>
        </Card.Header>
        <Card.Body className="p-0">
          {!workflow.executions || workflow.executions.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No executions yet. Enable the workflow to start running it.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[var(--surface-hover)]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                      Timestamp
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-[var(--text-secondary)]">
                      Trigger
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {workflow.executions.map((execution) => (
                    <tr key={execution.id} className="hover:bg-[var(--surface-hover)]">
                      <td className="px-4 py-3 text-sm text-[var(--text-primary)]">
                        {formatDate(execution.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={execution.status === 'success' ? 'success' : 'error'}>
                          {execution.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                        {execution.duration}
                      </td>
                      <td className="px-4 py-3 text-sm text-[var(--text-secondary)]">
                        {execution.trigger}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Workflow"
      >
        <p className="text-[var(--text-secondary)] mb-6">
          Are you sure you want to delete <strong>"{workflow.name}"</strong>? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
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

export default WorkflowDetail;