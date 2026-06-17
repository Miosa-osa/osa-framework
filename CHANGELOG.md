# Changelog

## 0.1.9

- Upgrade `examples/standard-agent` from a one-file placeholder to a complete
  standard agent with instructions, `agent.ts`, Markdown skill, TypeScript tool,
  sandbox, channel, connection, subagent, schedule, permissions, docs, hook, and
  eval.
- Add `examples/minimal-agent` for the one-file starter.
- Discover TypeScript channels, connections, schedules, hooks, and sandbox
  config in the manifest.
- Add `defineChannel`, `defineConnection`, `defineSchedule`, and
  `defineSandbox` helper exports.
- Update full templates to include TypeScript channel/connection files,
  Markdown schedules, and sandbox setup.

## 0.1.8

- Put the standard one-file workflow at the top of the README.
- Add `docs/standard.md` with exact standard-agent usage.
- Make `agent/` the canonical rich project layout.
- Move generated evals to project-level `evals/`.
- Add `agent.ts` scaffold support with `defineAgent` and typed tool helper
  imports.
- Convert bundled examples from `osa/` to canonical `agent/` layouts.
- Preserve legacy `osa/` inspection for existing projects.
- Clarify when users should grow from one-file `agent/instructions.md` to full
  agent project slots.

## 0.1.7

- Add `examples/standard-agent` as the visible one-file starter example.

## 0.1.6

- Add OSA project standards documentation.
- Add examples index and quality bar.
- Link standards from README and getting started docs.

## 0.1.5

- Make the default `standard` template a true one-file starter: `agent/instructions.md`.
- Teach the manifest builder to inspect both `agent/` and `osa/` layouts.
- Keep richer templates on the explicit `osa/` project layout.

## 0.1.4

- Add clean `standard` template and make it the default.
- Move the every-slot scaffold to `full`.
- Keep `default` as a compatibility alias for `standard`.

## 0.1.3

- Add built-in templates and `osa templates`.
- Add `osa init --template <name>`.
- Add repo maintainer and deployment operator examples.
- Export template discovery helpers.

## 0.1.2

- Add launch-grade examples for Clinic Ops and Browser QA agents.
- Add schedules, channels, tools, and subagents to the default scaffold.
- Add bundled docs discovery through `osa docs`.
- Expand manifest output to include tools, channels, schedules, and subagents.

## 0.1.1

- Normalize npm `bin` metadata for `npx @miosa/osa`.

## 0.1.0

- Initial OSA framework package.
