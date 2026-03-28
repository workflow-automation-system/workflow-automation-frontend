import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Save, ArrowLeft } from 'lucide-react';
import useWorkflowStore from '../stores/workflowStore';
import { nodeTypes, generateId } from '../mock/data';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import NodeSidebar from '../components/workflow/NodeSidebar';
import ConfigPanel from '../components/workflow/ConfigPanel';
import CustomNode from '../components/workflow/nodes/CustomNode';

// Custom node types for React Flow
const nodeTypesMap = {
  trigger: CustomNode,
  email: CustomNode,
  webhook: CustomNode,
  delay: CustomNode,
};

const CreateWorkflow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const workflowId = searchParams.get('id');
  const { createWorkflow, updateWorkflow, getWorkflowById } = useWorkflowStore();

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = React.useState(null);
  const [saving, setSaving] = React.useState(false);

  // Load existing workflow if editing
  React.useEffect(() => {
    if (workflowId) {
      const workflow = getWorkflowById(workflowId);
      if (workflow) {
        setName(workflow.name);
        setDescription(workflow.description || '');
        setNodes(workflow.nodes || []);
        setEdges(workflow.edges || []);
      }
    }
  }, [workflowId, getWorkflowById, setNodes, setEdges]);

  const onConnect = React.useCallback(
    (params) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            id: generateId('edge'),
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const onDragOver = React.useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = React.useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 100,
      };

      const nodeConfig = nodeTypes.find((n) => n.type === type);
      if (!nodeConfig) return;

      const newNode = {
        id: generateId('node'),
        type,
        position,
        data: { ...nodeConfig.defaultData },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onNodeClick = React.useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      alert('Please enter a workflow name');
      return;
    }

    setSaving(true);

    const workflowData = {
      id: workflowId || generateId('wf'),
      name: name.trim(),
      description: description.trim(),
      status: 'inactive',
      nodes,
      edges,
      lastExecution: null,
      executions: [],
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (workflowId) {
      updateWorkflow(workflowId, { name: name.trim(), description: description.trim(), nodes, edges });
    } else {
      createWorkflow(workflowData);
    }

    setSaving(false);
    navigate('/workflows');
  };

  const handleDeleteNode = () => {
    if (selectedNode) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  const handleUpdateNodeData = (nodeId, data) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      )
    );
  };

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/workflows')}>
            <ArrowLeft size={18} />
          </Button>
          <div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workflow name"
              className="mb-0"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => navigate('/workflows')}>
            Cancel
          </Button>
          <Button onClick={handleSave} loading={saving}>
            <Save size={18} className="mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Node Sidebar */}
        <NodeSidebar />

        {/* Canvas */}
        <div className="flex-1 border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--surface)]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypesMap}
            fitView
            deleteKeyCode="Delete"
          >
            <Background />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Config Panel */}
        {selectedNode && (
          <ConfigPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdate={handleUpdateNodeData}
            onDelete={handleDeleteNode}
          />
        )}
      </div>

      {/* Description */}
      <div className="mt-4">
        <Input
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe what this workflow does..."
        />
      </div>
    </div>
  );
};

export default CreateWorkflow;