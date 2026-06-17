import { defineConnection } from "@miosa/osa/connections";

export default defineConnection({
  description: "Linear connection for creating follow-up issues from weather-risk digests.",
  type: "linear",
  auth: {
    mode: "env",
    variable: "LINEAR_API_KEY",
  },
});
