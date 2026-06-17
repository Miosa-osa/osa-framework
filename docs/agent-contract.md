# Agent Contract

An OSA project is valid when:

- `agent/instructions.md` exists, or
- `osa/instructions.md` exists in a richer OSA project.
- Optional capability directories use stable names: `tools`, `skills`,
  `subagents`, `channels`, `schedules`, `connections`, `computers`, `evals`,
  and `docs`.

The generated manifest is the backend contract. It should be stable enough for
deployment records, runtime hydration, and directory/marketplace surfaces.
