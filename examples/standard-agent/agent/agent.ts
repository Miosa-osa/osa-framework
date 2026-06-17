import { defineAgent } from "@miosa/osa";

export default defineAgent({
  description: "Weather digest agent with tools, skills, sandbox, channels, connections, subagents, and schedules.",
  model: "openai/gpt-5.4-mini",
  runtime: {
    target: "miosa-cloud",
    durable: true,
  },
});
