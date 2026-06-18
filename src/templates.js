const standardScaffold = [
  [
    "agent/instructions.md",
    "# Instructions\n\nDescribe what your agent does, what it should care about, and when it should ask for approval.\n",
  ],
];

const fullScaffold = [
  ["agent/AGENTS.md", "# OSA Agent Instructions\n\nKeep always-needed operating context here.\n"],
  [
    "agent/agent.ts",
    'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "Filesystem-defined OSA agent operating environment.",\n  model: {\n    primary: "default",\n    fallback: [],\n  },\n  harness: {\n    engine: "auto",\n    allowed: ["codex", "claude-code", "hermes", "osa"],\n  },\n  runtime: {\n    target: "miosa-cloud",\n    durability: "checkpointed",\n    streaming: true,\n  },\n  sandbox: {\n    backend: "auto",\n    allowed: ["miosa-computer", "miosa-sandbox", "local-docker"],\n    resources: {\n      cpu: 2,\n      memoryGb: 4,\n    },\n  },\n  policy: {\n    network: "restricted",\n    approvals: ["external_side_effects"],\n  },\n  capabilities: {\n    shell: true,\n    browser: true,\n  },\n});\n',
  ],
  [
    "agent/instructions.md",
    "You are an OSA agent. Inspect context, use tools carefully, and report uncertainty.\n",
  ],
  [
    "agent/permissions.yml",
    "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\nsecrets:\n  allow: []\napprovals:\n  required_for:\n    - network:external\n    - filesystem:write:outside_workspace\n",
  ],
  ["agent/docs/README.md", "# OSA Project Docs\n\nReference material for this agent.\n"],
  ["evals/smoke.yml", "name: smoke\nprompt: Summarize this OSA project.\nchecks:\n  - completed\n"],
  [
    "agent/computers/default.yml",
    "enabled: false\nkind: miosa-computer\nsize: standard\ncapabilities:\n  browser: true\n  screenshot: true\n  shell: true\n  desktop: true\n",
  ],
  [
    "agent/connections/github.ts",
    'import { defineConnection } from "@miosa/osa/connections";\n\nexport default defineConnection({\n  description: "GitHub repository operations.",\n  type: "mcp",\n  auth: {\n    mode: "env",\n    variable: "GITHUB_TOKEN",\n  },\n});\n',
  ],
  [
    "agent/channels/web.ts",
    'import { defineChannel } from "@miosa/osa/channels";\n\nexport default defineChannel({\n  description: "HTTP chat or app-facing channel.",\n  type: "web",\n  entrypoint: "/api/osa",\n});\n',
  ],
  [
    "agent/schedules/daily-summary.md",
    '---\ncron: "0 14 * * 1-5"\n---\n\nSummarize open work and blocked follow-ups.\n',
  ],
  [
    "agent/sandbox/sandbox.ts",
    'import { defineSandbox } from "@miosa/osa/sandbox";\n\nexport default defineSandbox({\n  description: "Default isolated MIOSA sandbox.",\n  resources: {\n    cpu: 2,\n    memoryGb: 4,\n  },\n});\n',
  ],
  ["agent/sandbox/workspace/README.md", "# Workspace\n\nSeed files copied into the agent sandbox at session start.\n"],
  [
    "agent/skills/getting-started/SKILL.md",
    "---\nname: getting-started\ndescription: Use when explaining the OSA project layout.\ntrust: local\n---\n\nExplain the OSA project layout and recommend `osa info`.\n",
  ],
  [
    "agent/subagents/investigator/agent.ts",
    'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "Research and evidence-gathering subagent.",\n  model: {\n    primary: "default",\n  },\n  harness: {\n    engine: "auto",\n  },\n});\n',
  ],
  [
    "agent/subagents/investigator/instructions.md",
    "Find primary sources, preserve links, and separate facts from inferences.\n",
  ],
  [
    "agent/tools/get_weather.ts",
    'import { defineTool } from "@miosa/osa/tools";\n\nexport default defineTool({\n  description: "Return mocked weather for a city.",\n  inputSchema: {\n    type: "object",\n    properties: { city: { type: "string" } },\n    required: ["city"],\n  },\n  async execute({ city }) {\n    return { city, condition: "Sunny", temperatureF: 72 };\n  },\n});\n',
  ],
];

const templateOverrides = {
  standard: {
    description: "One-file starter: agent/instructions.md.",
    base: standardScaffold,
    files: [],
  },
  default: {
    description: "Alias for standard.",
    base: standardScaffold,
    hidden: true,
    files: [],
  },
  full: {
    description: "General-purpose OSA agent with every core project slot scaffolded.",
    base: fullScaffold,
    files: [],
  },
  "browser-qa": {
    description: "Browser workflow QA agent for MIOSA Computers.",
    base: fullScaffold,
    files: [
      ["agent/AGENTS.md", "# Browser QA Agent\n\nValidate browser workflows with precise steps, screenshots, and failure notes.\n"],
      [
        "agent/agent.ts",
        'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "Browser workflow QA agent for MIOSA Computers.",\n  model: "default",\n  runtime: {\n    target: "computer",\n  },\n});\n',
      ],
      [
        "agent/instructions.md",
        "You verify browser workflows. Always report tested URL, steps, observed result, expected result, screenshots captured, and whether the issue is reproducible.\n",
      ],
      [
        "agent/computers/browser.yml",
        "enabled: true\nkind: miosa-computer\nsize: standard\ncapabilities:\n  browser: true\n  screenshot: true\n  shell: false\n  desktop: true\n",
      ],
      [
        "agent/skills/qa-report/SKILL.md",
        "---\nname: qa-report\ndescription: Use when writing browser QA findings.\ntrust: local\n---\n\nFormat findings as: Summary, Environment, Steps, Expected, Actual, Evidence, Reproducibility, Suggested owner.\n",
      ],
      ["evals/browser-report.yml", "name: browser-report\nprompt: Report a failed signup test.\nchecks:\n  - includes_steps\n  - includes_expected_actual\n  - includes_reproducibility\n"],
      [
        "agent/tools/capture_finding.ts",
        'import { defineTool } from "@miosa/osa/tools";\n\nexport default defineTool({\n  description: "Capture a browser QA finding.",\n  inputSchema: {\n    type: "object",\n    properties: {\n      summary: { type: "string" },\n      steps: { type: "array", items: { type: "string" } },\n      actual: { type: "string" },\n      expected: { type: "string" },\n    },\n    required: ["summary", "steps", "actual", "expected"],\n  },\n  async execute(input) {\n    return { ...input, status: "captured" };\n  },\n});\n',
      ],
    ],
  },
  "clinic-ops": {
    description: "White-label clinic operations agent for support, QA, and follow-up.",
    base: fullScaffold,
    files: [
      ["agent/AGENTS.md", "# Clinic Ops Agent\n\nPrioritize patient safety, operational clarity, and auditability. Never invent clinical facts.\n"],
      [
        "agent/agent.ts",
        'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "White-label clinic operations agent for support, QA, and follow-up.",\n  model: "default",\n  runtime: {\n    target: "miosa-cloud",\n  },\n});\n',
      ],
      [
        "agent/instructions.md",
        "You help support teams investigate product issues, summarize evidence, verify browser workflows, and draft clear handoffs. Ask for approval before changing patient-facing data, sending messages, or using external network access.\n",
      ],
      [
        "agent/permissions.yml",
        "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\n  allow:\n    - api.miosa.ai\nsecrets:\n  allow:\n    - GITHUB_TOKEN\napprovals:\n  required_for:\n    - patient_data_change\n    - outbound_message\n    - network:external\n",
      ],
      [
        "agent/channels/support-api.ts",
        'import { defineChannel } from "@miosa/osa/channels";\n\nexport default defineChannel({\n  description: "Support ticket webhook and response channel.",\n  type: "api",\n  entrypoint: "/api/clinic-ops",\n});\n',
      ],
      [
        "agent/schedules/daily-open-items.md",
        '---\ncron: "0 14 * * 1-5"\n---\n\nSummarize unresolved support items and identify blocked handoffs.\n',
      ],
      [
        "agent/skills/support-triage/SKILL.md",
        "---\nname: support-triage\ndescription: Use when turning raw support context into a precise triage note.\ntrust: local\n---\n\nWrite a concise triage note with: impact, evidence, likely owner, next action, and approval needs.\n",
      ],
      [
        "agent/tools/create_ticket_summary.ts",
        'import { defineTool } from "@miosa/osa/tools";\n\nexport default defineTool({\n  description: "Create a structured support ticket summary.",\n  inputSchema: { type: "object", properties: { title: { type: "string" }, evidence: { type: "array", items: { type: "string" } }, nextAction: { type: "string" } }, required: ["title", "evidence", "nextAction"] },\n  async execute({ title, evidence, nextAction }) {\n    return { title, evidence, nextAction, status: "draft" };\n  },\n});\n',
      ],
    ],
  },
  "repo-maintainer": {
    description: "Engineering repo maintainer agent for issues, PR review, CI triage, and release notes.",
    base: fullScaffold,
    files: [
      ["agent/AGENTS.md", "# Repo Maintainer Agent\n\nProtect the codebase. Prefer small diffs, clear tests, and reversible changes.\n"],
      [
        "agent/agent.ts",
        'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "Engineering agent for issue triage, PR review, CI debugging, and release notes.",\n  model: "default",\n  runtime: {\n    target: "sandbox",\n  },\n});\n',
      ],
      [
        "agent/instructions.md",
        "You maintain repositories. Read the code before proposing changes. Identify ownership boundaries, test the smallest meaningful surface, and explain risk clearly.\n",
      ],
      [
        "agent/permissions.yml",
        "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\n  allow:\n    - api.github.com\nsecrets:\n  allow:\n    - GITHUB_TOKEN\napprovals:\n  required_for:\n    - git:push\n    - release:publish\n    - destructive_change\n",
      ],
      [
        "agent/connections/github.ts",
        'import { defineConnection } from "@miosa/osa/connections";\n\nexport default defineConnection({\n  description: "GitHub issues, PRs, comments, and CI context.",\n  type: "mcp",\n  auth: {\n    mode: "env",\n    variable: "GITHUB_TOKEN",\n  },\n});\n',
      ],
      [
        "agent/schedules/weekly-maintenance.md",
        '---\ncron: "0 15 * * 1"\n---\n\nReview stale issues, failing checks, dependency risk, and release blockers.\n',
      ],
      [
        "agent/skills/code-review/SKILL.md",
        "---\nname: code-review\ndescription: Use for reviewing code changes.\ntrust: local\n---\n\nLead with bugs, regressions, security issues, and missing tests. Cite files and lines.\n",
      ],
      [
        "agent/skills/ci-triage/SKILL.md",
        "---\nname: ci-triage\ndescription: Use for diagnosing failing CI.\ntrust: local\n---\n\nFind the failing job, inspect logs, identify first failing cause, and propose the smallest fix.\n",
      ],
      [
        "agent/subagents/test-writer/agent.ts",
        'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "Writes focused regression tests for risky changes.",\n  model: "default",\n});\n',
      ],
      [
        "agent/subagents/test-writer/instructions.md",
        "Prefer integration tests for behavior and narrow unit tests for pure logic. Avoid broad snapshots.\n",
      ],
      [
        "agent/tools/create_release_note.ts",
        'import { defineTool } from "@miosa/osa/tools";\n\nexport default defineTool({\n  description: "Create a release note entry from merged changes.",\n  inputSchema: { type: "object", properties: { title: { type: "string" }, changes: { type: "array", items: { type: "string" } } }, required: ["title", "changes"] },\n  async execute({ title, changes }) {\n    return { title, body: changes.map((change) => `- ${change}`).join("\\n") };\n  },\n});\n',
      ],
      ["evals/review-finding.yml", "name: review-finding\nprompt: Review a risky auth change.\nchecks:\n  - cites_file_line\n  - prioritizes_regression\n  - includes_test_gap\n"],
    ],
  },
  "deployment-operator": {
    description: "Production deployment operator agent for rollouts, smoke checks, and incident handoff.",
    base: fullScaffold,
    files: [
      ["agent/AGENTS.md", "# Deployment Operator Agent\n\nFavor boring rollouts. Verify health before and after every deployment step.\n"],
      [
        "agent/agent.ts",
        'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "Production operator for deploys, smoke checks, rollbacks, and incident handoff.",\n  model: "default",\n  runtime: {\n    target: "miosa-cloud",\n  },\n});\n',
      ],
      [
        "agent/instructions.md",
        "You operate deployments. Gather current status, run smoke checks, avoid destructive actions without approval, and produce a rollback-ready handoff.\n",
      ],
      [
        "agent/permissions.yml",
        "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\n  allow:\n    - api.miosa.ai\nsecrets:\n  allow:\n    - MIOSA_API_KEY\napprovals:\n  required_for:\n    - deploy:production\n    - rollback:production\n    - domain_change\n",
      ],
      [
        "agent/channels/ops-webhook.ts",
        'import { defineChannel } from "@miosa/osa/channels";\n\nexport default defineChannel({\n  description: "Deployment event and incident handoff channel.",\n  type: "api",\n  entrypoint: "/api/deployment-operator",\n});\n',
      ],
      [
        "agent/schedules/morning-healthcheck.md",
        '---\ncron: "0 13 * * 1-5"\n---\n\nCheck deployment health, recent errors, and open incidents.\n',
      ],
      [
        "agent/skills/release-checklist/SKILL.md",
        "---\nname: release-checklist\ndescription: Use before production deploys.\ntrust: local\n---\n\nConfirm commit, environment, migrations, smoke command, rollback path, owner, and monitoring links.\n",
      ],
      [
        "agent/subagents/incident-scribe/agent.ts",
        'import { defineAgent } from "@miosa/osa";\n\nexport default defineAgent({\n  description: "Writes concise incident timelines and handoffs.",\n  model: "default",\n});\n',
      ],
      [
        "agent/subagents/incident-scribe/instructions.md",
        "Maintain a timestamped timeline. Separate customer impact, mitigation, and follow-up.\n",
      ],
      [
        "agent/tools/record_smoke_result.ts",
        'import { defineTool } from "@miosa/osa/tools";\n\nexport default defineTool({\n  description: "Record a deployment smoke test result.",\n  inputSchema: { type: "object", properties: { check: { type: "string" }, status: { type: "string" }, evidence: { type: "string" } }, required: ["check", "status"] },\n  async execute(input) {\n    return { ...input, recorded: true };\n  },\n});\n',
      ],
      ["evals/deploy-handoff.yml", "name: deploy-handoff\nprompt: Write a deployment handoff after a failed smoke check.\nchecks:\n  - includes_status\n  - includes_rollback_path\n  - includes_owner\n"],
    ],
  },
};

export function listTemplates() {
  return Object.entries(templateOverrides)
    .filter(([, template]) => !template.hidden)
    .map(([name, template]) => ({
      name,
      description: template.description,
    }));
}

export function getTemplateScaffold(name = "standard") {
  const template = templateOverrides[name];
  if (!template) {
    const err = new Error(`Unknown OSA template "${name}". Run "osa templates" to list options.`);
    err.code = "OSA_TEMPLATE_NOT_FOUND";
    throw err;
  }
  return mergeScaffold(template.base, template.files);
}

function mergeScaffold(base, overrides) {
  const files = new Map(base);
  for (const [file, content] of overrides) {
    files.set(file, content);
  }
  return Array.from(files.entries());
}
