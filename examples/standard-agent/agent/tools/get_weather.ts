import { defineTool } from "@miosa/osa/tools";

export default defineTool({
  description: "Get current mocked weather for a city.",
  inputSchema: {
    type: "object",
    properties: {
      cityName: { type: "string" },
    },
    required: ["cityName"],
  },
  async execute({ cityName }) {
    return {
      cityName,
      condition: "Sunny",
      temperatureF: 72,
      windMph: 6,
      source: "mock-weather-api",
    };
  },
});
