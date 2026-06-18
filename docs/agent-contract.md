# Agent Contract

An OSA project is valid when:

- `agent/instructions.md` exists, or
- `osa/instructions.md` exists in a legacy OSA project.
- Optional capability directories use stable names: `tools`, `skills`,
  `subagents`, `channels`, `schedules`, `connections`, `computers`, `evals`,
  and `docs`.

New projects should put capability directories under `agent/` and behavior
checks under project-level `evals/`. The manifest still accepts `osa/` for
backward compatibility.

The generated manifest is the backend contract. It should be stable enough for
deployment records, runtime hydration, and directory/marketplace surfaces.

When `agent/agent.ts` is present, the manifest includes `runtimeProfile`. That
profile is the normalized operating spec MIOSA uses to select or validate model
routing, harness engine, sandbox backend, runtime durability, and policy before
creating an execution packet.
