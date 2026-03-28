import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockWorkflows } from '../mock/data';

const useWorkflowStore = create(
  persist(
    (set, get) => ({
      workflows: mockWorkflows,
      currentWorkflow: null,
      isLoading: false,
      error: null,

      // Get all workflows
      getWorkflows: () => {
        return get().workflows;
      },

      // Get workflow by ID
      getWorkflowById: (id) => {
        return get().workflows.find((w) => w.id === id);
      },

      // Set current workflow
      setCurrentWorkflow: (workflow) => {
        set({ currentWorkflow: workflow });
      },

      // Create new workflow
      createWorkflow: (workflow) => {
        set((state) => ({
          workflows: [...state.workflows, workflow],
          currentWorkflow: workflow,
        }));
        return workflow;
      },

      // Update workflow
      updateWorkflow: (id, updates) => {
        set((state) => {
          const workflows = state.workflows.map((w) =>
            w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
          );
          const currentWorkflow = state.currentWorkflow?.id === id
            ? { ...state.currentWorkflow, ...updates, updatedAt: new Date().toISOString() }
            : state.currentWorkflow;
          return { workflows, currentWorkflow };
        });
      },

      // Delete workflow
      deleteWorkflow: (id) => {
        set((state) => ({
          workflows: state.workflows.filter((w) => w.id !== id),
          currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
        }));
      },

      // Toggle workflow status
      toggleWorkflowStatus: (id) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === id ? { ...w, status: w.status === 'active' ? 'inactive' : 'active' } : w
          ),
        }));
      },

      // Add execution to workflow
      addExecution: (workflowId, execution) => {
        set((state) => ({
          workflows: state.workflows.map((w) =>
            w.id === workflowId
              ? {
                  ...w,
                  executions: [execution, ...(w.executions || [])],
                  lastExecution: execution.timestamp,
                }
              : w
          ),
        }));
      },

      // Get filtered workflows
      getFilteredWorkflows: (status, searchQuery) => {
        let workflows = get().workflows;

        if (status && status !== 'all') {
          workflows = workflows.filter((w) => w.status === status);
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          workflows = workflows.filter(
            (w) =>
              w.name.toLowerCase().includes(query) ||
              w.description?.toLowerCase().includes(query)
          );
        }

        return workflows;
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'workflow-storage',
    }
  )
);

export default useWorkflowStore;