import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "White-label clinic operations agent for support, QA, and follow-up.",
  model: "default",
  runtime: {
    target: "miosa-cloud",
  },
});
