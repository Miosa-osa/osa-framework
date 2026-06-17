# Eve Comparison

Vercel Eve and OSA share the same high-level authoring idea: agents should be
readable as files on disk.

OSA is different in the runtime it targets:

| Area | Eve | OSA |
| --- | --- | --- |
| Primary platform | Vercel | MIOSA |
| Runtime target | Vercel agent stack | Computers, Sandboxes, OpenComputers, BYOC |
| Persistent desktop automation | Not the core primitive | First-class through MIOSA Computers |
| White-label deployments | Vercel deployment model | MIOSA tenant/workspace deployment records |
| CLI integration | `npx eve` | `npx @miosa/osa` plus `miosa osa` |
| Agent package | `agent/instructions.md` upward | `agent/instructions.md` upward, plus MIOSA runtime metadata when needed |
| Naming | Path-derived authored slots | Path-derived authored slots with legacy `osa/` compatibility |
| Evals | Root `evals/` | Root `evals/` |
| Local examples | Repo fixtures and templates | Package examples and templates that build with `osa build` |

OSA should stay compatible with normal developer workflows while exposing MIOSA
runtime primitives directly.

## OSA Gap Response

The OSA package should match the approachable parts of Eve: one-file standard
start, conventional `agent/` slots, path-derived names, local docs in the npm
package, templates, examples, and build artifacts that coding agents can
inspect.

OSA should not copy Vercel-specific platform assumptions. The differentiator is
MIOSA runtime access: Computers, persistent sandboxes, OpenComputer/BYOC targets,
workspace-scoped deployments, white-label product surfaces, and CLI integration
through `miosa osa`.

## Launch-Page Parity Checklist

The visible OSA standard example should cover the same agent-building sequence:

- `instructions.md`: complete agent instructions in Markdown
- `agent.ts`: model and runtime configuration
- `skills/`: reusable Markdown playbooks
- `tools/`: TypeScript model-callable tools
- `sandbox/`: isolated workspace setup
- `channels/`: web or product surfaces
- `connections/`: authenticated external services
- `subagents/`: delegated specialist agents
- `schedules/`: durable recurring jobs
- `evals/`: behavior checks before deployment
