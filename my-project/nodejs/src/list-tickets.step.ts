import type { Handlers, StepConfig } from 'motia';
import { z } from 'zod';

// エンドポイントの設定
export const config = {
  name: 'ListTickets',
  description: 'Returns all tickets from state',
  flows: ['support-ticket-flow'],
  triggers: [
    {
      type: 'http',
      method: 'GET',
      path: '/tickets',
      responseSchema: {
        200: z.object({
          tickets: z.array(z.record(z.string(), z.any())),
          count: z.number(),
        }),
      },
    },
  ],
  enqueues: [],
} as const satisfies StepConfig;

/**
 * チケットを全て取得するハンドラー
 * @param _ 
 * @param param1 
 * @returns 
 */
export const handler: Handlers<typeof config> = async (
  _,
  { state, logger },
) => {
  // チケットを全て取得
  const tickets = await state.list<Record<string, unknown>>('tickets');

  logger.info('Listing tickets', { count: tickets.length });

  return {
    status: 200,
    body: { tickets, count: tickets.length },
  };
};
