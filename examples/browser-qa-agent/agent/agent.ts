import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Browser workflow QA agent for MIOSA Computers.",
  model: {
    primary: "default",
  },
  harness: {
    engine: "auto",
    allowed: ["codex", "claude-code", "osa"],
  },
  runtime: {
    target: "computer",
    durability: "checkpointed",
    streaming: true,
  },
  sandbox: {
    backend: "miosa-computer",
    resources: {
      cpu: 2,
      memoryGb: 4,
    },
  },
});
