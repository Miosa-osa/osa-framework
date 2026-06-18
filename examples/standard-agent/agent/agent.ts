import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Weather digest agent with tools, skills, sandbox, channels, connections, subagents, and schedules.",
  model: {
    primary: "openai/gpt-5.4-mini",
    fallback: ["anthropic/claude-sonnet-4.6"],
  },
  harness: {
    engine: "auto",
    allowed: ["codex", "claude-code", "hermes", "osa"],
  },
  runtime: {
    target: "miosa-cloud",
    durability: "checkpointed",
    streaming: true,
  },
  sandbox: {
    backend: "miosa-sandbox",
    resources: {
      cpu: 2,
      memoryGb: 4,
    },
  },
  policy: {
    network: "restricted",
    approvals: ["external_side_effects"],
  },
});
