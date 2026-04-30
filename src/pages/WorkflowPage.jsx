import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../api/config';
import { createWorkflow, getWorkflows } from '../api/workflowApi';

const apiDisplayUrl = API_BASE_URL || 'http://localhost:8085 (via React dev proxy)';

function WorkflowPage() {
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [newWorkflowName, setNewWorkflowName] = useState('');

  const loadWorkflows = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await getWorkflows();
      setWorkflows(data);
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
      setError(err.message || 'Failed to fetch workflows');
      setWorkflows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkflows();
  }, []);

  const handleCreateWorkflow = async () => {
    const name = newWorkflowName.trim();
    if (!name) {
      setError('Please enter a workflow name before creating.');
      return;
    }

    setCreating(true);
    setError('');

    try {
      await createWorkflow({ name });
      setNewWorkflowName('');
      await loadWorkflows();
    } catch (err) {
      console.error('Failed to create workflow:', err);
      setError(err.message || 'Failed to create workflow');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#292D32]">Workflows</h1>
        <p className="text-sm text-[#5C5C5C]">
          Gateway URL: <code>{apiDisplayUrl}</code>
        </p>
      </div>

      <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            value={newWorkflowName}
            onChange={(event) => setNewWorkflowName(event.target.value)}
            placeholder="New workflow name"
            className="flex-1 rounded-md border border-[#E2E8F0] px-3 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleCreateWorkflow}
            disabled={creating}
            className="rounded-md bg-[#292D32] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {creating ? 'Creating...' : 'Create Workflow'}
          </button>
          <button
            type="button"
            onClick={loadWorkflows}
            disabled={loading}
            className="rounded-md border border-[#E2E8F0] px-4 py-2 text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading && <p className="text-sm text-[#5C5C5C]">Loading workflows...</p>}

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <p>{error}</p>
          <p className="mt-1">
            If this persists, verify backend CORS allows your frontend origin (example:
            <code> http://localhost:3000</code>).
          </p>
        </div>
      )}

      {!loading && !error && workflows.length === 0 && (
        <p className="text-sm text-[#5C5C5C]">
          No workflows found. The API returned an empty list.
        </p>
      )}

      {!loading && workflows.length > 0 && (
        <ul className="space-y-2">
          {workflows.map((workflow) => (
            <li
              key={workflow.id}
              className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm"
            >
              <strong>{workflow.name || 'Untitled workflow'}</strong> (ID: {workflow.id})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default WorkflowPage;
