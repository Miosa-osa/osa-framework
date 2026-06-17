import { defineTool } from "@miosa/osa/tools";

export default defineTool({
  name: "record_smoke_result",
  description: "Record a deployment smoke test result.",
  inputSchema: {
    type: "object",
    properties: {
      check: { type: "string" },
      status: { type: "string" },
      evidence: { type: "string" },
    },
    required: ["check", "status"],
  },
  async execute(input) {
    return { ...input, recorded: true };
  },
});
