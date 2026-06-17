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

OSA should stay compatible with normal developer workflows while exposing MIOSA
runtime primitives directly.
