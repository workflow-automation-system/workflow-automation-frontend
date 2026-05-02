import {
  API_BASE_URL,
  EXECUTIONS_ENDPOINT,
  WORKFLOW_CONFIGURATION_ENDPOINT,
  WORKFLOWS_ENDPOINT,
} from './config';
import {
  FALLBACK_WORKFLOW_CONFIGURATION,
  normalizeWorkflowConfiguration,
  normalizeWorkflow,
  buildMutationPayload,
  extractPayload,
} from '../services/workflowConverter';

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

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

export async function getWorkflowConfiguration() {
  const response = await request(WORKFLOW_CONFIGURATION_ENDPOINT);
  const payload = extractPayload(response);
  return normalizeWorkflowConfiguration(payload);
}

export async function getWorkflows() {
  const response = await request(WORKFLOWS_ENDPOINT);
  const payload = extractPayload(response);
  const workflows = Array.isArray(payload) ? payload : [];
  return workflows.map((workflow) => normalizeWorkflow(workflow, FALLBACK_WORKFLOW_CONFIGURATION));
}

export async function createWorkflow(payload) {
  const response = await request(WORKFLOWS_ENDPOINT, {
    method: 'POST',
    body: buildMutationPayload(payload),
  });

  const normalized = extractPayload(response);
  return isObject(normalized)
    ? normalizeWorkflow(normalized, FALLBACK_WORKFLOW_CONFIGURATION)
    : null;
}

export async function getWorkflowById(id) {
  const response = await request(`${WORKFLOWS_ENDPOINT}/${id}`);
  const normalized = extractPayload(response);
  return isObject(normalized)
    ? normalizeWorkflow(normalized, FALLBACK_WORKFLOW_CONFIGURATION)
    : null;
}

export async function updateWorkflow(id, payload) {
  const response = await request(`${WORKFLOWS_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: buildMutationPayload(payload),
  });

  const normalized = extractPayload(response);
  return isObject(normalized)
    ? normalizeWorkflow(normalized, FALLBACK_WORKFLOW_CONFIGURATION)
    : null;
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
  getConfiguration: getWorkflowConfiguration,
};

export default workflowApi;
