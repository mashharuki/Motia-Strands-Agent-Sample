import { Agent } from "@strands-agents/sdk";
import { getTicketTool, listOpenTicketsTool } from "./tools";

// エージェントの初期化: システムプロンプトとツールを設定
export const agent = new Agent({
  systemPrompt:
    'You are a concise support operations AI assistant. Use tools to reference real tickets before answering. Respond with practical next actions.',
  tools: [getTicketTool, listOpenTicketsTool],
});
