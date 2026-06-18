import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Finds evidence across docs, issues, and browser state.",
  model: {
    primary: "default",
  },
  harness: {
    engine: "auto",
  },
});
