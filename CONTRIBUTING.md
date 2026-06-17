# Contributing

This repo contains the public OSA framework package.

## Local Development

```bash
npm test
npm run check
npm pack --dry-run
```

Keep changes small and make sure examples still build with `osa build`.

## Project Rules

- Keep the framework filesystem-first.
- Keep runtime-specific execution inside the MIOSA platform and `miosa` CLI.
- Prefer explicit files over hidden registration.
- Update docs and examples when adding a new project slot.
