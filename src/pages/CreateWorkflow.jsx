import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  addEdge,
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ArrowLeft, FileText, Play, Save, ShieldCheck, SplitSquareVertical } from 'lucide-react';
import ConfigPanel from '../components/workflow/ConfigPanel';
import NodeSidebar from '../components/workflow/NodeSidebar';
import CustomNode from '../components/workflow/nodes/CustomNode';
import { generateId, nodeTypes } from '../mock/data';
import useWorkflowStore from '../stores/workflowStore';

const nodeTypesMap = Object.fromEntries(nodeTypes.map((node) => [node.type, CustomNode]));

const CreateWorkflow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  const { createWorkflow, getWorkflowById, updateWorkflow } = useWorkflowStore();

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [saving, setSaving] = React.useState(false);
  const [reactFlowInstance, setReactFlowInstance] = React.useState(null);

  React.useEffect(() => {
    if (!workflowId) return;

    const existingWorkflow = getWorkflowById(workflowId);
    if (!existingWorkflow) return;

    setName(existingWorkflow.name || '');
    setDescription(existingWorkflow.description || '');
    setNodes(existingWorkflow.nodes || []);
    setEdges(existingWorkflow.edges || []);
  }, [workflowId, getWorkflowById, setEdges, setNodes]);

  const onConnect = React.useCallback(
    (connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            id: generateId('edge'),
            markerEnd: { type: MarkerType.ArrowClosed, color: '#D0FFA4' },
            style: { stroke: '#D0FFA4', strokeWidth: 2.2 },
          },
          currentEdges
        )
      );
    },
    [setEdges]
  );

  const onDrop = React.useCallback(
    (event) => {
      event.preventDefault();
      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const template = nodeTypes.find((node) => node.type === type);
      if (!template) return;

      setNodes((currentNodes) => [
        ...currentNodes,
        {
          id: generateId('node'),
          type,
          position,
          data: { ...template.defaultData },
        },
      ]);
    },
    [reactFlowInstance, setNodes]
  );

  const handleSave = async () => {
    if (!name.trim()) {
      window.alert('Please enter a workflow name before saving.');
      return;
    }

    setSaving(true);
    const payload = {
      id: workflowId || generateId('wf'),
      name: name.trim(),
      description: description.trim(),
      status: workflowId ? getWorkflowById(workflowId)?.status || 'inactive' : 'inactive',
      nodes,
      edges,
      lastExecution: workflowId ? getWorkflowById(workflowId)?.lastExecution || null : null,
      executions: workflowId ? getWorkflowById(workflowId)?.executions || [] : [],
    };

    await new Promise((resolve) => setTimeout(resolve, 350));

    if (workflowId) {
      updateWorkflow(workflowId, payload);
    } else {
      createWorkflow(payload);
    }

    setSaving(false);
    navigate('/workflows');
  };

  const handleDeleteNode = () => {
    if (!selectedNode) return;

    setNodes((currentNodes) => currentNodes.filter((node) => node.id !== selectedNode.id));
    setEdges((currentEdges) =>
      currentEdges.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id)
    );
    setSelectedNode(null);
  };

  const handleUpdateNodeData = (nodeId, updatedData) => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...updatedData } } : node
      )
    );

    setSelectedNode((current) =>
      current?.id === nodeId ? { ...current, data: { ...current.data, ...updatedData } } : current
    );
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] flex-col gap-4 font-urbanist">
      <header className="enterprise-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/workflows')}
              className="rounded-xl border border-[#E2E8F0] bg-white p-2 text-[#5C5C5C] hover:border-[#D0FFA4]"
              aria-label="Back to workflows"
            >
              <ArrowLeft size={16} />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E2E8F0] bg-[#D0FFA4]">
              <Play size={16} className="text-[#292D32]" />
            </div>

            <div>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Untitled Workflow"
                className="w-full bg-transparent text-lg font-semibold text-[#292D32] outline-none placeholder:text-[#8A8A8A]"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/workflows')}
              className="rounded-xl border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#5C5C5C] hover:border-[#D0FFA4]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-[#292D32] px-4 py-2 text-sm font-semibold text-white hover:bg-[#3C4249] disabled:opacity-60"
            >
              <Save size={14} />
              {saving ? 'Saving...' : 'Save Workflow'}
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[290px_1fr_320px]">
        <NodeSidebar />

        <section className="enterprise-card flex min-h-[520px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] bg-[#F6F5FA] px-4 py-3">
            <div className="flex items-center gap-2">
              <SplitSquareVertical size={16} className="text-[#292D32]" />
              <p className="text-sm font-semibold text-[#292D32]">Workflow Canvas</p>
            </div>
            <span className="text-xs text-[#5C5C5C]">
              {nodes.length} nodes, {edges.length} connections
            </span>
          </div>

          <div className="canvas-grid-bg relative flex-1 bg-white">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onInit={setReactFlowInstance}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedNode(node)}
              onPaneClick={() => setSelectedNode(null)}
              onDrop={onDrop}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = 'move';
              }}
              nodeTypes={nodeTypesMap}
              fitView
              defaultEdgeOptions={{
                style: { stroke: '#D0FFA4', strokeWidth: 2.2 },
                markerEnd: { type: MarkerType.ArrowClosed, color: '#D0FFA4' },
              }}
            >
              <Background gap={24} color="#E2E8F0" />
              <Controls />
                <MiniMap nodeColor="#D0FFA4" maskColor="rgba(246, 245, 250, 0.7)" />
            </ReactFlow>

            <button
              type="button"
              className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs font-semibold text-[#292D32] shadow-sm transition-colors hover:border-[#D0FFA4]"
            >
              AI + Help
            </button>

            <div className="absolute bottom-4 right-4 space-y-2">
              <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs shadow-sm">
                <p className="font-semibold text-[#292D32]">Scenario 1</p>
                <p className="text-[#5E6672]">Data mapping healthy</p>
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-white px-3 py-2 text-xs shadow-sm">
                <p className="font-semibold text-[#292D32]">Scenario 2</p>
                <p className="text-[#5E6672]">Fallback branch standby</p>
              </div>
            </div>
          </div>
        </section>

        {selectedNode ? (
          <ConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={handleUpdateNodeData}
            onDelete={handleDeleteNode}
          />
        ) : (
          <aside className="enterprise-card hidden p-4 text-sm text-[#5C5C5C] xl:block">
            <p className="text-sm font-semibold text-[#292D32]">Node Configuration</p>
            <p className="mt-2">
              Select a node to configure branching rules, data transformations, connector credentials, and error policy.
            </p>
          </aside>
        )}
      </div>

      <footer className="enterprise-card flex flex-col gap-3 p-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2 text-sm text-[#5C5C5C]">
          <FileText size={15} className="text-[#292D32]" />
          Workflow Description
        </div>
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe business intent, owner, and fallback behavior..."
          className="flex-1 rounded-xl border border-[#E2E8F0] bg-white px-3 py-2.5 text-sm text-[#292D32] focus:border-[#D0FFA4] focus:outline-none"
        />
        <div className="inline-flex items-center gap-1 rounded-full bg-[#D0FFA4] px-3 py-1 text-xs font-semibold text-[#292D32]">
          <ShieldCheck size={12} />
          Enterprise-ready
        </div>
      </footer>
    </div>
  );
};

export default CreateWorkflow;




