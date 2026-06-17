import { defineConnection } from "@miosa/osa/connections";

export default defineConnection({
  description: "Weather provider connection used by weather tools.",
  type: "http",
  baseUrl: "https://api.weather.example",
  auth: {
    mode: "env",
    variable: "WEATHER_API_KEY",
  },
});
