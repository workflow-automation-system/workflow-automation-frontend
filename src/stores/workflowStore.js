import { create } from 'zustand';
import { workflowApi } from '../api/workflowApi';

const useWorkflowStore = create((set, get) => ({
  workflows: [],
  currentWorkflow: null,
  isLoading: false,
  error: null,

  // Fetch all workflows from API
  fetchWorkflows: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await workflowApi.getAll();
      console.log('[WorkflowStore] API Response:', response);
      
      // Handle different response formats from backend
      let workflows = response;
      if (response && typeof response === 'object') {
        // If response has a data property, use it
        if (Array.isArray(response.data)) {
          workflows = response.data;
        } else if (Array.isArray(response.workflows)) {
          workflows = response.workflows;
        } else if (!Array.isArray(response)) {
          // If it's a single object, wrap in array
          workflows = [response];
        }
      }
      
      // Ensure it's an array
      if (!Array.isArray(workflows)) {
        workflows = [];
      }
      
      set({ workflows, isLoading: false });
      return workflows;
    } catch (error) {
      console.error('[WorkflowStore] Error fetching workflows:', error);
      set({ error: error.message || 'Failed to fetch workflows', isLoading: false });
      throw error;
    }
  },

  // Get all workflows (from state)
  getWorkflows: () => {
    return get().workflows;
  },

  // Fetch single workflow by ID
  fetchWorkflowById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workflowApi.getById(id);
      console.log('[WorkflowStore] Fetched workflow by id:', response);
      
      // Handle different response formats
      const workflow = response?.data || response;
      
      set({ currentWorkflow: workflow, isLoading: false });
      return workflow;
    } catch (error) {
      console.error('[WorkflowStore] Error fetching workflow:', error);
      set({ error: error.message || 'Failed to fetch workflow', isLoading: false });
      throw error;
    }
  },

  // Get workflow by ID (from state)
  getWorkflowById: (id) => {
    return get().workflows.find((w) => w.id === id);
  },

  // Set current workflow
  setCurrentWorkflow: (workflow) => {
    set({ currentWorkflow: workflow });
  },

  // Create new workflow via API
  createWorkflow: async (workflowData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workflowApi.create(workflowData);
      const workflow = response?.data || response;
      
      set((state) => ({
        workflows: [...state.workflows, workflow],
        currentWorkflow: workflow,
        isLoading: false,
      }));
      return workflow;
    } catch (error) {
      console.error('[WorkflowStore] Error creating workflow:', error);
      set({ error: error.message || 'Failed to create workflow', isLoading: false });
      throw error;
    }
  },

  // Update workflow via API
  updateWorkflow: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const response = await workflowApi.update(id, updates);
      const workflow = response?.data || response;
      
      set((state) => {
        const workflows = state.workflows.map((w) =>
          w.id === id ? workflow : w
        );
        const currentWorkflow = state.currentWorkflow?.id === id
          ? workflow
          : state.currentWorkflow;
        return { workflows, currentWorkflow, isLoading: false };
      });
      return workflow;
    } catch (error) {
      console.error('[WorkflowStore] Error updating workflow:', error);
      set({ error: error.message || 'Failed to update workflow', isLoading: false });
      throw error;
    }
  },

  // Delete workflow via API
  deleteWorkflow: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await workflowApi.delete(id);
      set((state) => ({
        workflows: state.workflows.filter((w) => w.id !== id),
        currentWorkflow: state.currentWorkflow?.id === id ? null : state.currentWorkflow,
        isLoading: false,
      }));
    } catch (error) {
      console.error('[WorkflowStore] Error deleting workflow:', error);
      set({ error: error.message || 'Failed to delete workflow', isLoading: false });
      throw error;
    }
  },

  // Toggle workflow status via API
  toggleWorkflowStatus: async (id) => {
    const workflow = get().workflows.find((w) => w.id === id);
    if (!workflow) return;

    const newStatus = workflow.status === 'active' ? 'inactive' : 'active';
    set({ isLoading: true, error: null });

    try {
      const response = await workflowApi.toggleStatus(id, newStatus);
      const updated = response?.data || response || { status: newStatus };
      
      set((state) => ({
        workflows: state.workflows.map((w) =>
          w.id === id ? { ...w, status: newStatus } : w
        ),
        currentWorkflow: state.currentWorkflow?.id === id
          ? { ...state.currentWorkflow, status: newStatus }
          : state.currentWorkflow,
        isLoading: false,
      }));
      return updated;
    } catch (error) {
      console.error('[WorkflowStore] Error toggling workflow status:', error);
      set({ error: error.message || 'Failed to toggle workflow status', isLoading: false });
      throw error;
    }
  },

  // Execute workflow
  executeWorkflow: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const result = await workflowApi.execute(id);
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('[WorkflowStore] Error executing workflow:', error);
      set({ error: error.message || 'Failed to execute workflow', isLoading: false });
      throw error;
    }
  },

  // Add execution to workflow (for local state updates)
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
          w.name?.toLowerCase().includes(query) ||
          w.description?.toLowerCase().includes(query)
      );
    }

    return workflows;
  },

  clearError: () => {
    set({ error: null });
  },
}));

export default useWorkflowStore;
