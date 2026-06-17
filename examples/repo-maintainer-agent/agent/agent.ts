import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Engineering agent for issue triage, PR review, CI debugging, and release notes.",
  model: "default",
  runtime: {
    target: "sandbox",
  },
});
