const rawBaseUrl = process.env.REACT_APP_API_BASE_URL || '';

export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');

export const WORKFLOW_ENDPOINT = '/workflow';
