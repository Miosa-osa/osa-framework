export default {
  name: "create_release_note",
  description: "Create a release note entry from merged changes.",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string" },
      changes: { type: "array", items: { type: "string" } },
    },
    required: ["title", "changes"],
  },
  async execute({ title, changes }) {
    return { title, body: changes.map((change) => `- ${change}`).join("\n") };
  },
};
