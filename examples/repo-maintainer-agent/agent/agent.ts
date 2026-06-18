import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Engineering agent for issue triage, PR review, CI debugging, and release notes.",
  model: {
    primary: "default",
  },
  harness: {
    engine: "codex",
  },
  runtime: {
    target: "sandbox",
    durability: "checkpointed",
    streaming: true,
  },
  sandbox: {
    backend: "miosa-sandbox",
    resources: {
      cpu: 4,
      memoryGb: 8,
    },
  },
  policy: {
    network: "restricted",
    approvals: ["git:push", "release:publish", "destructive_change"],
  },
});
