import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Browser workflow QA agent for MIOSA Computers.",
  model: "default",
  runtime: {
    target: "computer",
  },
});
