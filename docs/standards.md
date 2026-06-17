# OSA Project Standards

This is the bar for a serious OSA project. The goal is not to generate a large
folder. The goal is to make an agent that another human or coding agent can
inspect, trust, run, and safely extend.

## Core Standard

Start with one file:

```text
agent/
  instructions.md
```

That file must answer:

- What does this agent do?
- What should it never do?
- What inputs does it need?
- When should it ask for approval?
- What does a good answer or completed task look like?

Move to the richer `osa/` layout only when the project needs explicit tools,
skills, subagents, schedules, channels, evals, permissions, docs, or runtime
targets.

## Directory Standard

```text
osa/
  AGENTS.md
  agent.yml
  instructions.md
  permissions.yml
  computers/
  connections/
  channels/
  schedules/
  docs/
  evals/
  skills/
  subagents/
  tools/
```

Every file should earn its place. Empty folders and vague examples are worse
than a small project.

## Instructions

Good instructions are operational. They should include:

- Mission and ownership boundaries
- Inputs the agent should look for
- Decision rules and escalation rules
- Approval boundaries
- Output format expectations
- Failure behavior

Avoid:

- Generic motivational prose
- “Be helpful” as the main instruction
- Hidden assumptions about tools or credentials
- Product claims that the runtime cannot satisfy

## Permissions

Use deny-by-default policy.

Good permission files explicitly name:

- Filesystem read/write boundaries
- Network allowlist
- Secret names the agent may read
- Actions requiring approval

Production agents should require approval for:

- External network access beyond known allowlists
- Writes outside the project workspace
- Sending messages to users or customers
- Deploying, rolling back, changing domains, or publishing releases
- Destructive data or infrastructure actions

## Tools

Tools should be small and boring.

Every tool should have:

- One clear job
- A stable `name`
- A precise `description`
- An `inputSchema`
- Predictable return shape
- Explicit error behavior

Avoid tools that:

- Mix unrelated actions
- Hide network calls
- Mutate production state without approval
- Return raw unstructured blobs when a stable object would work

## Skills

Skills are load-on-demand procedures, not dumping grounds.

Each skill should have:

- Frontmatter with `name`, `description`, and `trust`
- A clear trigger condition
- Step-by-step operating guidance
- Expected output shape
- Known failure modes

Good examples:

- `code-review`
- `ci-triage`
- `support-triage`
- `release-checklist`

## Subagents

Subagents should be specialists with boundaries.

Each subagent should define:

- What work it owns
- What evidence it must collect
- What it should not decide
- What it should return to the parent agent

Do not create subagents just to make the project look advanced.

## Evals

Every serious project needs at least one eval.

Good evals check behavior, not vibes:

- Includes evidence
- Includes next action
- Cites file and line
- Includes rollback path
- Avoids unsupported claims
- Asks for approval before risky action

## Docs

Project docs should be material the agent actually needs:

- Runbooks
- Review policy
- Browser QA checklist
- Support workflow
- Release procedure
- Incident handoff format

Do not include generic product marketing copy as agent context.

## Channels And Schedules

Channels and schedules are production surfaces.

For each channel, define:

- Event source
- Entrypoint
- Expected payload
- Response behavior
- Auth expectation

For each schedule, define:

- Cron
- Prompt
- Owner
- Expected report
- Failure or missed-run behavior

## Runtime Targets

Use the smallest runtime that can do the job:

- `agent/` only: authoring and local inspection
- Sandbox: code, repo, file, and server work
- Computer: browser or desktop automation
- OpenComputer/BYOC: customer-controlled runtime
- MIOSA cloud: managed persistent deployment

## Example Quality Bar

An example is acceptable only if:

- It builds with `osa build`
- It contains specific instructions
- It has a meaningful eval
- Any tool has a schema
- Any permission file has real boundaries
- README explains when to use it

Current examples:

- `examples/browser-qa-agent`
- `examples/clinic-ops-agent`
- `examples/repo-maintainer-agent`
- `examples/deployment-operator-agent`

## Publishing Checklist

Before publishing:

- Run `npx @miosa/osa build`
- Read `.miosa/osa-manifest.json`
- Confirm no placeholder secrets or fake credentials are committed
- Confirm approval boundaries are clear
- Confirm evals reflect the actual job
- Confirm deployment target is intentional
- Confirm README explains how to run or deploy the project
