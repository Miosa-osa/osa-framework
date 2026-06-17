# Standard Agent

The standard OSA project is one file:

```text
agent/
  instructions.md
```

That is the default because most people should start by describing the agent
they want, not by sorting through a generated framework directory.

## Create One

```bash
npx @miosa/osa init my-agent
cd my-agent
```

This writes:

```text
agent/instructions.md
```

Nothing else.

## Write The Agent

Use plain English:

```md
# Instructions

You are a product research agent.

Find primary sources, summarize facts clearly, separate facts from guesses, and
ask for approval before contacting anyone or changing external systems.
```

Good standard instructions answer:

- What does this agent do?
- What should it never do?
- What inputs does it need?
- When should it ask for approval?
- What should the final output look like?

## Build It

```bash
npx @miosa/osa build
```

The build writes:

```text
.miosa/osa-manifest.json
.miosa/osa-diagnostics.json
.miosa/osa-build.json
```

## When To Grow

Stay with `agent/instructions.md` until you need a specific capability.

Add richer project slots when:

- You need a callable function: add `agent/tools/`
- You need reusable operating procedure: add `agent/skills/`
- You need a specialist worker: add `agent/subagents/`
- You need browser or desktop automation: add `agent/computers/`
- You need a recurring job: add `agent/schedules/`
- You need an external event surface: add `agent/channels/`
- You need a repeatable behavior check: add `evals/`
- You need explicit safety boundaries: add `agent/permissions.yml`

Or start from a richer template:

```bash
npx @miosa/osa init my-agent --template full
npx @miosa/osa init repo-agent --template repo-maintainer
```
