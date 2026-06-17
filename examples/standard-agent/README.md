# Standard Agent

This is the copyable full standard example. It mirrors the framework progression:

```text
agent/
  instructions.md
  agent.ts
  skills/research.md
  tools/get_weather.ts
  sandbox/sandbox.ts
  channels/web.ts
  connections/weather-api.ts
  subagents/researcher/agent.ts
  schedules/daily-report.md
evals/
  weather-digest.yml
```

Try it:

```bash
npm install
npm run build:osa
```

Use this when you want to see how a real OSA agent is assembled from files.
