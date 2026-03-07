import { tool } from "@strands-agents/sdk";
import { state } from "motia";
import z from "zod";

// ツール定義: チケット情報の取得とオープンチケットのリスト化
export const getTicketTool = tool({
  name: 'get_ticket',
  description: 'Get one support ticket by ticketId',
  inputSchema: z.object({ ticketId: z.string() }),
  callback: async (input) => {
    const ticket = await state.get<Record<string, unknown>>('tickets', input.ticketId);
    if (!ticket) {
      return `Ticket ${input.ticketId} not found`;
    }
    return JSON.stringify(ticket);
  },
});

// ツール定義: オープンチケットのリスト化（最大10件）
export const listOpenTicketsTool = tool({
  name: 'list_open_tickets',
  description: 'List currently open support tickets (max 10)',
  inputSchema: z.object({
    limit: z.number().int().min(1).max(10).optional().default(5),
  }),
  callback: async (input) => {
    // ステート変数からチケットのリストを取得し、ステータスが「open」のチケットをフィルタリングして返す
    const tickets = await state.list<Record<string, unknown>>('tickets');
    // チケットのステータスが「open」のものをフィルタリングし、指定された件数だけ返す
    const openTickets = tickets
      .filter((ticket) => ticket.status === 'open')
      .slice(0, input.limit);
    return JSON.stringify(openTickets);
  },
});
