import { defineSandbox } from "@miosa/osa/sandbox";

export default defineSandbox({
  description: "Isolated workspace for preparing weather digests.",
  resources: {
    cpu: 2,
    memoryGb: 4,
  },
  workspaceSeed: "agent/sandbox/workspace",
});
