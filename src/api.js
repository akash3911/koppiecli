import axios from 'axios';

import { getApiUrl } from './config.js';
import { KoppieError } from './utils.js';

function createClient() {
  return axios.create({
    baseURL: getApiUrl(),
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

function extractApiMessage(data) {
  if (typeof data === 'string' && data.trim()) {
    return data.trim();
  }

  if (data && typeof data === 'object') {
    const candidate = data.message || data.error || data.detail;

    if (typeof candidate === 'string' && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
}

function normalizeAxiosError(error) {
  if (error instanceof KoppieError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return new KoppieError('Network error', { kind: 'network', cause: error });
    }

    const message = extractApiMessage(error.response.data);

    if (error.response.status === 404) {
      return new KoppieError('Code not found', { kind: 'not-found', cause: error });
    }

    if (message) {
      return new KoppieError(message, { kind: 'api', cause: error });
    }

    if (error.response.status >= 500) {
      return new KoppieError('Network error', { kind: 'network', cause: error });
    }

    return new KoppieError('API error', { kind: 'api', cause: error });
  }

  return new KoppieError('Network error', { kind: 'network', cause: error });
}

async function request(method, path, data) {
  const client = createClient();

  try {
    const response = await client.request({
      method,
      url: path,
      data,
    });

    return response.data ?? null;
  } catch (error) {
    throw normalizeAxiosError(error);
  }
}

export async function createPaste({ content, expire }) {
  const payload = { content };

  if (expire) {
    payload.expire = expire;
  }

  const data = await request('POST', '/paste', payload);

  if (!data || typeof data.code !== 'string' || !data.code.trim()) {
    throw new KoppieError('API error', { kind: 'api' });
  }

  return { code: data.code.trim() };
}

export async function fetchPaste(code) {
  const data = await request('GET', `/paste/${encodeURIComponent(code)}`);

  if (!data || typeof data.content !== 'string') {
    throw new KoppieError('API error', { kind: 'api' });
  }

  return { content: data.content };
}

export async function deletePaste(code) {
  await request('DELETE', `/paste/${encodeURIComponent(code)}`);
}
