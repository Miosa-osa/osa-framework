# Deploying OSA Projects

OSA deployment is split between the framework and MIOSA platform:

1. `@miosa/osa` inspects and builds the filesystem manifest.
2. `miosa osa publish` stores the manifest in the MIOSA backend.
3. `miosa osa deploy --wait` creates a durable deployment record and waits for a terminal state.

Targets:

- `miosa-cloud`: MIOSA-managed persistent sandbox runtime
- `sandbox`: explicit Sandbox runtime target
- `computer`: explicit Computer runtime target
- `opencomputer`: externally bootstrapped OpenComputer target
- `byoc`: bring-your-own-compute target

The deployed runtime receives the OSA manifest and deployment plan so tools,
skills, docs, and agent context are available after upload.
