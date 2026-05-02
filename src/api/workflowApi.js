import { API_BASE_URL, EXECUTIONS_ENDPOINT, WORKFLOWS_ENDPOINT } from './config';

const ALLOWED_STATUSES = ['ACTIVE', 'INACTIVE'];

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

const safeTrim = (value) => (typeof value === 'string' ? value.trim() : '');

const normalizeStatus = (status, fallback = 'INACTIVE') => {
  const normalized = String(status || fallback).toUpperCase();
  return ALLOWED_STATUSES.includes(normalized) ? normalized : fallback;
};

const normalizeNodes = (nodes) => (Array.isArray(nodes) ? nodes : []);
const normalizeEdges = (edges) => (Array.isArray(edges) ? edges : []);

const normalizeWorkflow = (workflow = {}) => {
  const nodes = normalizeNodes(workflow.nodes);
  const nodeCount = Number.isFinite(workflow.nodeCount) ? workflow.nodeCount : nodes.length;

  return {
    ...workflow,
    id: workflow.id ?? workflow.workflowId ?? null,
    name: safeTrim(workflow.name) || 'Untitled workflow',
    description: safeTrim(workflow.description),
    status: normalizeStatus(workflow.status),
    nodes,
    edges: normalizeEdges(workflow.edges),
    nodeCount,
    executionCount: Number.isFinite(workflow.executionCount) ? workflow.executionCount : 0,
    createdAt: workflow.createdAt || workflow.created_at || null,
    updatedAt: workflow.updatedAt || workflow.updated_at || null,
    lastExecution: workflow.lastExecution || workflow.lastExecutedAt || null,
  };
};

const extractPayload = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (!isObject(payload)) {
    return payload ?? null;
  }

  if (Array.isArray(payload.data)) {
    return payload.data;
  }

  if (Array.isArray(payload.workflows)) {
    return payload.workflows;
  }

  if (isObject(payload.data)) {
    return payload.data;
  }

  return payload;
};

const buildMutationPayload = (payload = {}, { requireName = true } = {}) => {
  const name = safeTrim(payload.name);
  const description = safeTrim(payload.description);
  const status = normalizeStatus(payload.status, 'ACTIVE');

  if (requireName && !name) {
    throw new Error('Workflow name is required.');
  }

  if (!ALLOWED_STATUSES.includes(status)) {
    throw new Error('Status must be ACTIVE or INACTIVE.');
  }

  return { name, description, status };
};

async function parseJsonSafely(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text || null;
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const hasBody = options.body !== undefined && options.body !== null;

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  };

  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: hasBody ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorPayload = await parseJsonSafely(response);
      const backendMessage =
        typeof errorPayload === 'string'
          ? errorPayload
          : errorPayload?.message || errorPayload?.error;

      throw new Error(
        backendMessage || `Request failed (${response.status} ${response.statusText})`
      );
    }

    return parseJsonSafely(response);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        'Network error. Check if API Gateway is running on http://localhost:8085 and supports CORS preflight (OPTIONS).'
      );
    }
    throw error;
  }
}

export async function getWorkflows() {
  const response = await request(WORKFLOWS_ENDPOINT);
  const payload = extractPayload(response);
  const workflows = Array.isArray(payload) ? payload : [];
  return workflows.map(normalizeWorkflow);
}

export async function createWorkflow(payload) {
  const response = await request(WORKFLOWS_ENDPOINT, {
    method: 'POST',
    body: buildMutationPayload(payload),
  });

  const normalized = extractPayload(response);
  return isObject(normalized) ? normalizeWorkflow(normalized) : null;
}

export async function getWorkflowById(id) {
  const response = await request(`${WORKFLOWS_ENDPOINT}/${id}`);
  const normalized = extractPayload(response);
  return isObject(normalized) ? normalizeWorkflow(normalized) : null;
}

export async function updateWorkflow(id, payload) {
  const response = await request(`${WORKFLOWS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: buildMutationPayload(payload),
  });

  const normalized = extractPayload(response);
  return isObject(normalized) ? normalizeWorkflow(normalized) : null;
}

export async function deleteWorkflow(id) {
  return request(`${WORKFLOWS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
}

export async function executeWorkflow(id) {
  return request(`${EXECUTIONS_ENDPOINT}/workflow/${id}`, {
    method: 'POST',
  });
}

export const workflowApi = {
  getAll: getWorkflows,
  getById: getWorkflowById,
  create: createWorkflow,
  update: updateWorkflow,
  delete: deleteWorkflow,
  execute: executeWorkflow,
};

export default workflowApi;
