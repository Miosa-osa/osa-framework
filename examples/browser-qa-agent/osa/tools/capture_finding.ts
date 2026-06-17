export default {
  name: "capture_finding",
  description: "Capture a browser QA finding.",
  inputSchema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      steps: { type: "array", items: { type: "string" } },
      actual: { type: "string" },
      expected: { type: "string" },
    },
    required: ["summary", "steps", "actual", "expected"],
  },
  async execute(input) {
    return { ...input, status: "captured" };
  },
};
