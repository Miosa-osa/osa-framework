import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Production operator for deploys, smoke checks, rollbacks, and incident handoff.",
  model: "default",
  runtime: {
    target: "miosa-cloud",
  },
});
