import type {
  AIAssistantPayload,
  AIAssistantResponse,
  CreateTicketPayload,
  CreateTicketResponse,
  EscalatePayload,
  Ticket,
  TriagePayload,
} from "../types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * 共通のリクエスト処理
 * @param path
 * @param options
 * @returns
 */
async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed: ${res.status}`);
  }
  return res.json();
}

function normalizeTicket(raw: unknown): Ticket | null {
  if (!raw || typeof raw !== "object") return null;
  const data = raw as Record<string, unknown>;
  const ticketId =
    typeof data.ticketId === "string"
      ? data.ticketId
      : typeof data.id === "string"
        ? data.id
        : undefined;

  if (!ticketId) return null;

  return {
    ticketId,
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    priority:
      data.priority === "critical" ||
      data.priority === "high" ||
      data.priority === "medium" ||
      data.priority === "low"
        ? data.priority
        : "medium",
    customerEmail:
      typeof data.customerEmail === "string" ? data.customerEmail : "",
    status:
      data.status === "open" ||
      data.status === "in-progress" ||
      data.status === "resolved" ||
      data.status === "closed" ||
      data.status === "escalated"
        ? data.status
        : "open",
    assignee: typeof data.assignee === "string" ? data.assignee : undefined,
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : new Date().toISOString(),
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
    sla: typeof data.sla === "string" ? data.sla : undefined,
    triageResult:
      data.triageResult && typeof data.triageResult === "object"
        ? (data.triageResult as Ticket["triageResult"])
        : undefined,
    escalation:
      data.escalation && typeof data.escalation === "object"
        ? (data.escalation as Ticket["escalation"])
        : undefined,
  };
}

/**
 * APIクライアント
 */
export const api = {
  // チケット一覧の取得
  getTickets: async () => {
    const data = await request<Ticket[] | { tickets: unknown[] }>("/tickets");
    const rawTickets = Array.isArray(data)
      ? data
      : Array.isArray(data?.tickets)
        ? data.tickets
        : [];
    return rawTickets.map(normalizeTicket).filter((t): t is Ticket => t !== null);
  },
  // チケットの作成
  createTicket: (payload: CreateTicketPayload) =>
    request<CreateTicketResponse>("/tickets", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  // チケットのトリアージ
  triageTicket: (payload: TriagePayload) =>
    request<Ticket>("/tickets/triage", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // チケットのエスカレーション
  escalateTicket: (payload: EscalatePayload) =>
    request<Ticket>("/tickets/escalate", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  // AIアシスタントへの問い合わせ
  aiAssistant: (payload: AIAssistantPayload) =>
    request<AIAssistantResponse>("/tickets/ai-assistant", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
