import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Writes concise incident timelines and handoffs.",
  model: {
    primary: "default",
  },
  harness: {
    engine: "hermes",
  },
});
