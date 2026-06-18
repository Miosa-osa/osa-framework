import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Production operator for deploys, smoke checks, rollbacks, and incident handoff.",
  model: {
    primary: "default",
  },
  harness: {
    engine: "hermes",
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
    approvals: ["deploy:production", "rollback:production", "domain_change"],
  },
});
