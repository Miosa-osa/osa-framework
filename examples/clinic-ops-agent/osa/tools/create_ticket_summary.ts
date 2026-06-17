export default {
  name: "create_ticket_summary",
  description: "Create a structured support ticket summary.",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string" },
      evidence: { type: "array", items: { type: "string" } },
      nextAction: { type: "string" },
    },
    required: ["title", "evidence", "nextAction"],
  },
  async execute({ title, evidence, nextAction }) {
    return { title, evidence, nextAction, status: "draft" };
  },
};
