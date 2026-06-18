import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Writes focused regression tests for risky changes.",
  model: {
    primary: "default",
  },
  harness: {
    engine: "codex",
  },
});
