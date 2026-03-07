import { Agent, tool } from '@strands-agents/sdk';
import type { Handlers, StepConfig } from 'motia';
import { z } from 'zod';

const requestSchema = z.object({
  prompt: z.string().min(1),
  ticketId: z.string().optional(),
});

const responseSchema = z.object({
  answer: z.string(),
  referencedTicketId: z.string().nullable(),
  openTicketCount: z.number(),
  modelProvider: z.string(),
});

// AI アシスタント用のステップ定義
export const config = {
  name: 'AiTicketAssistant',
  description: 'AI support assistant powered by Strands Agent SDK',
  flows: ['support-ticket-flow'],
  triggers: [
    {
      type: 'http',
      method: 'POST',
      path: '/tickets/ai-assistant',
      bodySchema: requestSchema,
      responseSchema: {
        200: responseSchema,
        400: z.object({ error: z.string() }),
        500: z.object({ error: z.string(), hint: z.string().optional() }),
      },
    },
  ],
  enqueues: [],
} as const satisfies StepConfig;

/**
 * AIアシスタント用のハンドラー関数
 * @param request
 * @param param1
 * @returns
 */
export const handler: Handlers<typeof config> = async (
  request,
  { logger, state },
) => {
  const { prompt, ticketId } = request.body;

  if (!prompt) {
    return {
      status: 400,
      body: { error: 'prompt is required' },
    };
  }

  // ツール定義: チケット情報の取得とオープンチケットのリスト化
  const getTicketTool = tool({
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
  const listOpenTicketsTool = tool({
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

  // エージェントの初期化: システムプロンプトとツールを設定
  const agent = new Agent({
    systemPrompt:
      'You are a concise support operations AI assistant. Use tools to reference real tickets before answering. Respond with practical next actions.',
    tools: [getTicketTool, listOpenTicketsTool],
  });

  const referencedTicket =
    ticketId
      ? await state.get<Record<string, unknown>>('tickets', ticketId)
      : null;

  // エージェントへのプロンプト構築: ユーザープロンプト、特定のチケットID、参照されたチケットデータを含める
  const agentPrompt = [
    `User request: ${prompt}`,
    ticketId ? `Focused ticketId: ${ticketId}` : 'No specific ticketId provided.',
    referencedTicket ? `Focused ticket data: ${JSON.stringify(referencedTicket)}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  try {
    // エージェントの呼び出し: 構築したプロンプトを渡して応答を取得
    const result = await agent.invoke(agentPrompt);
    // ステート変数からチケットのリストを取得し、オープンチケットの数をカウント
    const tickets = await state.list<Record<string, unknown>>('tickets');
    const openTicketCount = tickets.filter((ticket) => ticket.status === 'open').length;
    const answer =
      typeof result === 'string'
        ? result
        : typeof result?.toString === 'function'
          ? result.toString()
          : JSON.stringify(result);

    logger.info('AI assistant generated response', {
      ticketId: ticketId ?? null,
      openTicketCount,
    });

    return {
      status: 200,
      body: {
        answer,
        referencedTicketId: ticketId ?? null,
        openTicketCount,
        modelProvider: 'strands-default-bedrock',
      },
    };
  } catch (error) {
    logger.error('AI assistant invocation failed', {
      ticketId: ticketId ?? null,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      status: 500,
      body: {
        error: 'Failed to invoke Strands Agent. Check model credentials and runtime configuration.',
        hint: 'If using Bedrock default provider, ensure AWS credentials and region are configured.',
      },
    };
  }
};
