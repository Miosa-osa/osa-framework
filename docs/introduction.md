# Introduction

OSA is a filesystem-first framework for MIOSA agent operating environments.

The framework treats an agent as a directory of files. Each capability has a
conventional place:

- `instructions.md` for the base operating prompt
- `tools/` for callable functions
- `skills/` for load-on-demand procedures
- `subagents/` for delegated specialist agents
- `channels/` for where the agent receives and sends messages
- `schedules/` for recurring work
- `computers/` for MIOSA Computer profiles
- `evals/` for repeatable checks
- `permissions.yml` for filesystem, network, secret, and approval policy

The result is easy for humans and coding agents to inspect before anything is
published or deployed.
