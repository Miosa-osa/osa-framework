import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "White-label clinic operations agent for support, QA, and follow-up.",
  model: {
    primary: "default",
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
    backend: "miosa-computer",
    resources: {
      cpu: 4,
      memoryGb: 8,
    },
  },
  policy: {
    network: "restricted",
    approvals: ["patient_data_change", "outbound_message", "external_side_effects"],
  },
});
