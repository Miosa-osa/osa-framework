# Getting Started

Create a project:

```bash
npx @miosa/osa init my-agent
cd my-agent
npx @miosa/osa info
npx @miosa/osa build
```

The default starter writes only:

```text
agent/instructions.md
```

Before publishing a serious project, read [`standards.md`](standards.md).

Publish and deploy through the MIOSA CLI:

```bash
miosa osa publish --workspace <workspace-id>
miosa osa deploy --workspace <workspace-id> --wait
```

Run tasks on an existing runtime:

```bash
miosa osa run "check the repo" --sandbox <sandbox-id>
miosa osa run "test the browser flow" --computer <computer-id>
```

The build command writes:

```text
.miosa/osa-manifest.json
.miosa/osa-diagnostics.json
.miosa/osa-build.json
```
