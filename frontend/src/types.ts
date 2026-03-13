export interface Ticket {
  ticketId: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  customerEmail: string;
  status: "open" | "in-progress" | "resolved" | "closed" | "escalated";
  assignee?: string;
  createdAt: string;
  updatedAt?: string;
  sla?: string;
  triageResult?: {
    assignee: string;
    priority: string;
    reasoning: string;
  };
  escalation?: {
    reason: string;
    escalatedAt: string;
  };
}

export interface CreateTicketPayload {
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  customerEmail: string;
}

export interface CreateTicketResponse {
  ticketId: string;
  status: string;
  message: string;
}

export interface TriagePayload {
  ticketId: string;
  assignee: string;
  priority: string;
}

export interface EscalatePayload {
  ticketId: string;
  reason: string;
}

export interface AIAssistantPayload {
  prompt: string;
  ticketId?: string;
}

export interface AIAssistantResponse {
  answer: string;
  referencedTicketId?: string | null;
  openTicketCount?: number;
  modelProvider?: string;
}

export type Page = "dashboard" | "tickets" | "detail" | "create" | "ai";
