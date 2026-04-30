import { API_BASE_URL, WORKFLOW_ENDPOINT } from './config';

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

  // Setting Content-Type on GET can trigger CORS preflight.
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
        'Network error. Check if API Gateway is running on http://localhost:8085 and CORS is enabled in backend.'
      );
    }
    throw error;
  }
}

export async function getWorkflows() {
  const data = await request(WORKFLOW_ENDPOINT);
  return Array.isArray(data) ? data : [];
}

export async function createWorkflow(payload) {
  return request(WORKFLOW_ENDPOINT, {
    method: 'POST',
    body: payload,
  });
}

export async function getWorkflowById(id) {
  return request(`${WORKFLOW_ENDPOINT}/${id}`);
}

export async function updateWorkflow(id, payload) {
  return request(`${WORKFLOW_ENDPOINT}/${id}`, {
    method: 'PUT',
    body: payload,
  });
}

export async function deleteWorkflow(id) {
  return request(`${WORKFLOW_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });
}

export async function executeWorkflow(id) {
  return request(`${WORKFLOW_ENDPOINT}/${id}/execute`, {
    method: 'POST',
  });
}

export async function toggleWorkflowStatus(id, status) {
  return request(`${WORKFLOW_ENDPOINT}/${id}/status`, {
    method: 'PATCH',
    body: { status },
  });
}

export const workflowApi = {
  getAll: getWorkflows,
  getById: getWorkflowById,
  create: createWorkflow,
  update: updateWorkflow,
  delete: deleteWorkflow,
  execute: executeWorkflow,
  toggleStatus: toggleWorkflowStatus,
};

export default workflowApi;
