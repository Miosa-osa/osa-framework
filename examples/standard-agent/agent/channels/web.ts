import { defineChannel } from "@miosa/osa/channels";

export default defineChannel({
  description: "Web chat surface for asking for a forecast or digest.",
  type: "web",
  entrypoint: "/api/weather-agent",
});
