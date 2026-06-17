import { defineChannel } from "@miosa/osa/channels";

export default defineChannel({
  description: "Slack surface for asking for a forecast or receiving a digest.",
  type: "slack",
  workspace: "example-workspace",
});
