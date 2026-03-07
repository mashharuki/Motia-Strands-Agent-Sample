import type {
  AIAssistantPayload,
  CreateTicketPayload,
  EscalatePayload,
  Ticket,
  TriagePayload,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getTickets: () => request<Ticket[]>('/tickets'),

  createTicket: (payload: CreateTicketPayload) =>
    request<Ticket>('/tickets', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  triageTicket: (payload: TriagePayload) =>
    request<Ticket>('/tickets/triage', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  escalateTicket: (payload: EscalatePayload) =>
    request<Ticket>('/tickets/escalate', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  aiAssistant: (payload: AIAssistantPayload) =>
    request<{ response: string }>('/tickets/ai-assistant', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
