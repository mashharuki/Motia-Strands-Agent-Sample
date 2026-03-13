import { Agent } from "@strands-agents/sdk";
import {
    createGetTicketTool,
    createListOpenTicketsTool,
    type TicketState,
} from "./tools";

// エージェントの初期化: システムプロンプトとツールを設定
export function createAgent(state: TicketState) {
  return new Agent({
    systemPrompt:
      'You are a concise support operations AI assistant. Use tools to reference real tickets before answering. Respond with practical next actions.',
    tools: [createGetTicketTool(state), createListOpenTicketsTool(state)],
  });
}
