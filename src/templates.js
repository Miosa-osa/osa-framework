const standardScaffold = [
  ["osa/AGENTS.md", "# OSA Project Instructions\n\nKeep always-needed operating context here.\n"],
  [
    "osa/agent.yml",
    "name: osa-agent\ndescription: Filesystem-defined OSA agent operating environment.\nruntime:\n  target: local\n",
  ],
  [
    "osa/instructions.md",
    "You are an OSA agent. Inspect context, use tools carefully, and report uncertainty.\n",
  ],
  [
    "osa/permissions.yml",
    "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\nsecrets:\n  allow: []\napprovals:\n  required_for:\n    - network:external\n    - filesystem:write:outside_workspace\n",
  ],
  ["osa/docs/README.md", "# OSA Project Docs\n\nReference material for this agent.\n"],
  ["osa/evals/smoke.yml", "name: smoke\nprompt: Summarize this OSA project.\nchecks:\n  - completed\n"],
];

const fullScaffold = [
  ...standardScaffold,
  [
    "osa/computers/default.yml",
    "enabled: false\nkind: miosa-computer\nsize: standard\ncapabilities:\n  browser: true\n  screenshot: true\n  shell: true\n  desktop: true\n",
  ],
  [
    "osa/connections/github.yml",
    "type: mcp\ndescription: GitHub repository operations.\nauth:\n  mode: env\n  variable: GITHUB_TOKEN\n",
  ],
  [
    "osa/channels/web.yml",
    "type: web\ndescription: HTTP chat or app-facing channel.\nentrypoint: /api/osa\n",
  ],
  [
    "osa/schedules/daily-summary.yml",
    "name: daily-summary\ncron: \"0 14 * * 1-5\"\nprompt: Summarize open work and blocked follow-ups.\n",
  ],
  [
    "osa/skills/getting-started/SKILL.md",
    "---\nname: getting-started\ndescription: Use when explaining the OSA project layout.\ntrust: local\n---\n\nExplain the OSA project layout and recommend `osa info`.\n",
  ],
  [
    "osa/subagents/investigator/agent.yml",
    "name: investigator\ndescription: Research and evidence-gathering subagent.\nmodel: default\n",
  ],
  [
    "osa/subagents/investigator/instructions.md",
    "Find primary sources, preserve links, and separate facts from inferences.\n",
  ],
  [
    "osa/tools/get_weather.ts",
    "export default {\n  name: \"get_weather\",\n  description: \"Return mocked weather for a city.\",\n  inputSchema: {\n    type: \"object\",\n    properties: { city: { type: \"string\" } },\n    required: [\"city\"],\n  },\n  async execute({ city }) {\n    return { city, condition: \"Sunny\", temperatureF: 72 };\n  },\n};\n",
  ],
];

const templateOverrides = {
  standard: {
    description: "Minimal OSA project: instructions, permissions, docs, and one smoke eval.",
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
      ["osa/AGENTS.md", "# Browser QA Agent\n\nValidate browser workflows with precise steps, screenshots, and failure notes.\n"],
      [
        "osa/agent.yml",
        "name: browser-qa-agent\ndescription: Browser workflow QA agent for MIOSA Computers.\nruntime:\n  target: computer\n",
      ],
      [
        "osa/instructions.md",
        "You verify browser workflows. Always report tested URL, steps, observed result, expected result, screenshots captured, and whether the issue is reproducible.\n",
      ],
      [
        "osa/computers/browser.yml",
        "enabled: true\nkind: miosa-computer\nsize: standard\ncapabilities:\n  browser: true\n  screenshot: true\n  shell: false\n  desktop: true\n",
      ],
      [
        "osa/skills/qa-report/SKILL.md",
        "---\nname: qa-report\ndescription: Use when writing browser QA findings.\ntrust: local\n---\n\nFormat findings as: Summary, Environment, Steps, Expected, Actual, Evidence, Reproducibility, Suggested owner.\n",
      ],
      ["osa/evals/browser-report.yml", "name: browser-report\nprompt: Report a failed signup test.\nchecks:\n  - includes_steps\n  - includes_expected_actual\n  - includes_reproducibility\n"],
      [
        "osa/tools/capture_finding.ts",
        "export default {\n  name: \"capture_finding\",\n  description: \"Capture a browser QA finding.\",\n  inputSchema: {\n    type: \"object\",\n    properties: {\n      summary: { type: \"string\" },\n      steps: { type: \"array\", items: { type: \"string\" } },\n      actual: { type: \"string\" },\n      expected: { type: \"string\" },\n    },\n    required: [\"summary\", \"steps\", \"actual\", \"expected\"],\n  },\n  async execute(input) {\n    return { ...input, status: \"captured\" };\n  },\n};\n",
      ],
    ],
  },
  "clinic-ops": {
    description: "White-label clinic operations agent for support, QA, and follow-up.",
    base: fullScaffold,
    files: [
      ["osa/AGENTS.md", "# Clinic Ops Agent\n\nPrioritize patient safety, operational clarity, and auditability. Never invent clinical facts.\n"],
      [
        "osa/agent.yml",
        "name: clinic-ops-agent\ndescription: White-label clinic operations agent for support, QA, and follow-up.\nruntime:\n  target: miosa-cloud\n",
      ],
      [
        "osa/instructions.md",
        "You help support teams investigate product issues, summarize evidence, verify browser workflows, and draft clear handoffs. Ask for approval before changing patient-facing data, sending messages, or using external network access.\n",
      ],
      [
        "osa/permissions.yml",
        "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\n  allow:\n    - api.miosa.ai\nsecrets:\n  allow:\n    - GITHUB_TOKEN\napprovals:\n  required_for:\n    - patient_data_change\n    - outbound_message\n    - network:external\n",
      ],
      [
        "osa/channels/support-api.yml",
        "type: api\ndescription: Support ticket webhook and response channel.\nentrypoint: /api/clinic-ops\n",
      ],
      [
        "osa/schedules/daily-open-items.yml",
        "name: daily-open-items\ncron: \"0 14 * * 1-5\"\nprompt: Summarize unresolved support items and identify blocked handoffs.\n",
      ],
      [
        "osa/skills/support-triage/SKILL.md",
        "---\nname: support-triage\ndescription: Use when turning raw support context into a precise triage note.\ntrust: local\n---\n\nWrite a concise triage note with: impact, evidence, likely owner, next action, and approval needs.\n",
      ],
      [
        "osa/tools/create_ticket_summary.ts",
        "export default {\n  name: \"create_ticket_summary\",\n  description: \"Create a structured support ticket summary.\",\n  inputSchema: { type: \"object\", properties: { title: { type: \"string\" }, evidence: { type: \"array\", items: { type: \"string\" } }, nextAction: { type: \"string\" } }, required: [\"title\", \"evidence\", \"nextAction\"] },\n  async execute({ title, evidence, nextAction }) {\n    return { title, evidence, nextAction, status: \"draft\" };\n  },\n};\n",
      ],
    ],
  },
  "repo-maintainer": {
    description: "Engineering repo maintainer agent for issues, PR review, CI triage, and release notes.",
    base: fullScaffold,
    files: [
      ["osa/AGENTS.md", "# Repo Maintainer Agent\n\nProtect the codebase. Prefer small diffs, clear tests, and reversible changes.\n"],
      [
        "osa/agent.yml",
        "name: repo-maintainer-agent\ndescription: Engineering agent for issue triage, PR review, CI debugging, and release notes.\nruntime:\n  target: sandbox\n",
      ],
      [
        "osa/instructions.md",
        "You maintain repositories. Read the code before proposing changes. Identify ownership boundaries, test the smallest meaningful surface, and explain risk clearly.\n",
      ],
      [
        "osa/permissions.yml",
        "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\n  allow:\n    - api.github.com\nsecrets:\n  allow:\n    - GITHUB_TOKEN\napprovals:\n  required_for:\n    - git:push\n    - release:publish\n    - destructive_change\n",
      ],
      [
        "osa/connections/github.yml",
        "type: mcp\ndescription: GitHub issues, PRs, comments, and CI context.\nauth:\n  mode: env\n  variable: GITHUB_TOKEN\n",
      ],
      [
        "osa/schedules/weekly-maintenance.yml",
        "name: weekly-maintenance\ncron: \"0 15 * * 1\"\nprompt: Review stale issues, failing checks, dependency risk, and release blockers.\n",
      ],
      [
        "osa/skills/code-review/SKILL.md",
        "---\nname: code-review\ndescription: Use for reviewing code changes.\ntrust: local\n---\n\nLead with bugs, regressions, security issues, and missing tests. Cite files and lines.\n",
      ],
      [
        "osa/skills/ci-triage/SKILL.md",
        "---\nname: ci-triage\ndescription: Use for diagnosing failing CI.\ntrust: local\n---\n\nFind the failing job, inspect logs, identify first failing cause, and propose the smallest fix.\n",
      ],
      [
        "osa/subagents/test-writer/agent.yml",
        "name: test-writer\ndescription: Writes focused regression tests for risky changes.\nmodel: default\n",
      ],
      [
        "osa/subagents/test-writer/instructions.md",
        "Prefer integration tests for behavior and narrow unit tests for pure logic. Avoid broad snapshots.\n",
      ],
      [
        "osa/tools/create_release_note.ts",
        "export default {\n  name: \"create_release_note\",\n  description: \"Create a release note entry from merged changes.\",\n  inputSchema: { type: \"object\", properties: { title: { type: \"string\" }, changes: { type: \"array\", items: { type: \"string\" } } }, required: [\"title\", \"changes\"] },\n  async execute({ title, changes }) {\n    return { title, body: changes.map((change) => `- ${change}`).join(\"\\n\") };\n  },\n};\n",
      ],
      ["osa/evals/review-finding.yml", "name: review-finding\nprompt: Review a risky auth change.\nchecks:\n  - cites_file_line\n  - prioritizes_regression\n  - includes_test_gap\n"],
    ],
  },
  "deployment-operator": {
    description: "Production deployment operator agent for rollouts, smoke checks, and incident handoff.",
    base: fullScaffold,
    files: [
      ["osa/AGENTS.md", "# Deployment Operator Agent\n\nFavor boring rollouts. Verify health before and after every deployment step.\n"],
      [
        "osa/agent.yml",
        "name: deployment-operator-agent\ndescription: Production operator for deploys, smoke checks, rollbacks, and incident handoff.\nruntime:\n  target: miosa-cloud\n",
      ],
      [
        "osa/instructions.md",
        "You operate deployments. Gather current status, run smoke checks, avoid destructive actions without approval, and produce a rollback-ready handoff.\n",
      ],
      [
        "osa/permissions.yml",
        "filesystem:\n  read:\n    - .\n  write:\n    - ./workspace\nnetwork:\n  default: deny\n  allow:\n    - api.miosa.ai\nsecrets:\n  allow:\n    - MIOSA_API_KEY\napprovals:\n  required_for:\n    - deploy:production\n    - rollback:production\n    - domain_change\n",
      ],
      [
        "osa/channels/ops-webhook.yml",
        "type: api\ndescription: Deployment event and incident handoff channel.\nentrypoint: /api/deployment-operator\n",
      ],
      [
        "osa/schedules/morning-healthcheck.yml",
        "name: morning-healthcheck\ncron: \"0 13 * * 1-5\"\nprompt: Check deployment health, recent errors, and open incidents.\n",
      ],
      [
        "osa/skills/release-checklist/SKILL.md",
        "---\nname: release-checklist\ndescription: Use before production deploys.\ntrust: local\n---\n\nConfirm commit, environment, migrations, smoke command, rollback path, owner, and monitoring links.\n",
      ],
      [
        "osa/subagents/incident-scribe/agent.yml",
        "name: incident-scribe\ndescription: Writes concise incident timelines and handoffs.\nmodel: default\n",
      ],
      [
        "osa/subagents/incident-scribe/instructions.md",
        "Maintain a timestamped timeline. Separate customer impact, mitigation, and follow-up.\n",
      ],
      [
        "osa/tools/record_smoke_result.ts",
        "export default {\n  name: \"record_smoke_result\",\n  description: \"Record a deployment smoke test result.\",\n  inputSchema: { type: \"object\", properties: { check: { type: \"string\" }, status: { type: \"string\" }, evidence: { type: \"string\" } }, required: [\"check\", \"status\"] },\n  async execute(input) {\n    return { ...input, recorded: true };\n  },\n};\n",
      ],
      ["osa/evals/deploy-handoff.yml", "name: deploy-handoff\nprompt: Write a deployment handoff after a failed smoke check.\nchecks:\n  - includes_status\n  - includes_rollback_path\n  - includes_owner\n"],
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
