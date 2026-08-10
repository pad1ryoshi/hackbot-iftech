You are building a complete AI-powered web security testing Hackbot from scratch.

You are the implementation agent.

Do NOT just describe the architecture.
Do NOT give me a tutorial.
Do NOT stop after creating a plan.

You must CREATE THE ENTIRE PROJECT in the current working directory.

You are allowed to:

- create directories;
- create files;
- modify files;
- write prompts;
- write Skills;
- write source code;
- create configuration files;
- create documentation;
- run commands;
- inspect the filesystem;
- run tests;
- debug errors;
- improve the implementation.

The final result must be a functional, organized and extensible Hackbot project.

==================================================
1. PROJECT GOAL
==================================================

Build a Hackbot for authorized web application security testing.

The system will initially be tested ONLY against:

- PortSwigger Web Security Academy laboratories
- controlled security testing environments
- explicitly authorized targets

The MVP must focus on:

1. IDOR / Broken Access Control
2. Command Injection

The architecture must allow future vulnerability Skills to be added
without redesigning the entire system.

Future examples:

- XSS
- SSRF
- SQL Injection
- JWT
- CORS
- SSTI
- GraphQL
- XXE
- CSRF
- etc.

Do not attempt to implement all of these now.

==================================================
2. CORE ARCHITECTURE
==================================================

Use a Coordinator Pattern.

The system should follow this conceptual architecture:

                         USER
                           │
                         Prompt
                           │
                           ▼
              ┌────────────────────────┐
              │   COORDINATOR AGENT    │
              │                        │
              │  Plan + Route + State  │
              └───────────┬────────────┘
                          │
                          ▼
                 ┌────────────────┐
                 │   RECON AGENT  │
                 └───────┬────────┘
                         │
                    Recon Output
                         │
                         ▼
              ┌────────────────────────┐
              │   COORDINATOR AGENT   │
              └───────────┬────────────┘
                          │
                          ▼
             ┌─────────────────────────┐
             │ VULNERABILITY AGENT     │
             │                         │
             │ ┌───────┐   ┌────────┐ │
             │ │idor.md│   │cmdi.md │ │
             │ └───────┘   └────────┘ │
             └──────────┬──────────────┘
                        │
                   Findings
                        │
                        ▼
              ┌────────────────────┐
              │   REPORT AGENT     │
              └─────────┬──────────┘
                        │
                        ▼
                    REPORT.md

==================================================
3. AGENT RESPONSIBILITIES
==================================================

-------------------------
COORDINATOR AGENT
-------------------------

The Coordinator is the central orchestrator.

It must:

1. Receive the user's objective.
2. Understand the target.
3. Validate scope.
4. Refine the objective into executable tasks.
5. Create an execution plan.
6. Delegate work to the appropriate Agent.
7. Receive intermediate outputs.
8. Analyze outputs.
9. Decide what should happen next.
10. Maintain persistent state.
11. Avoid duplicate work.
12. Route vulnerability hypotheses to the Vulnerability Agent.
13. Route confirmed findings to the Report Agent.
14. Decide when the operation is complete.

The Coordinator must NOT perform specialized reconnaissance or
vulnerability testing itself when that responsibility belongs to another
Agent.

The Coordinator is responsible for orchestration, not for doing all the
work.

-------------------------
RECON AGENT
-------------------------

The Recon Agent builds the target's attack surface.

It must:

1. Analyze the application's technology stack.

Look for:

- web server;
- backend framework;
- frontend framework;
- programming language;
- CMS;
- API technologies;
- authentication mechanisms;
- cookies;
- security headers;
- other relevant technologies.

2. Map the application.

Perform unauthenticated reconnaissance.

If authorized credentials are available, perform authenticated
reconnaissance as well.

Identify:

- pages;
- endpoints;
- HTTP methods;
- parameters;
- forms;
- APIs;
- authentication flows;
- redirects;
- object identifiers;
- interesting functionality.

3. Analyze JavaScript files.

Look for:

- endpoints;
- API routes;
- parameters;
- fetch/XHR calls;
- GraphQL;
- interesting functions;
- object identifiers;
- authentication logic;
- client-side security controls;
- other security-relevant information.

The Recon Agent must NOT claim that a vulnerability is confirmed.

It produces:

- attack surface;
- evidence;
- reconnaissance data;
- vulnerability hypotheses.

Example:

{
  "endpoint": "/api/user/{id}",
  "method": "GET",
  "parameter": "id",
  "hypothesis": "IDOR",
  "reason": "Client-controlled object identifier"
}

-------------------------
VULNERABILITY AGENT
-------------------------

The Vulnerability Agent consumes the Recon Agent's output.

It must:

1. Analyze discovered attack surface.
2. Prioritize security hypotheses.
3. Determine which hypotheses deserve testing.
4. Select the appropriate Skill.
5. Load and follow the Skill.
6. Execute the required tests.
7. Observe results.
8. Validate the result.
9. Classify the result as:

   - confirmed
   - unconfirmed
   - false positive

10. Preserve evidence.
11. Create structured findings.

Initial Skills:

agents/
└── vuln-hunter/
    └── skills/
        ├── idor/
        │   └── idor.md
        └── cmdi/
            └── cmdi.md

Skills must be operational playbooks.

They should primarily follow:

IF X
THEN Y
THEN Z

Do not create large theoretical documents.

Example:

IF an endpoint contains a client-controlled object identifier
THEN identify the object's owner
THEN identify another authorized test object
THEN replace the identifier
THEN compare the result
THEN preserve evidence if unauthorized access succeeds

-------------------------
REPORT AGENT
-------------------------

The Report Agent consumes confirmed findings.

It must:

1. Read vulnerability findings.
2. Organize the evidence.
3. Generate a technical security report.
4. Include reproduction steps.
5. Explain impact.
6. Provide remediation guidance.
7. Preserve technical accuracy.

The Report Agent must NOT:

- perform new vulnerability tests;
- invent evidence;
- invent requests;
- invent responses;
- upgrade unconfirmed hypotheses into confirmed vulnerabilities.

==================================================
4. AGENT LOOP
==================================================

Implement an iterative agent loop.

Use:

THINK
→ PLAN
→ ACT
→ OBSERVE
→ VALIDATE
→ UPDATE STATE
→ REPLAN
→ REPEAT

The system must not blindly repeat forever.

Implement termination conditions.

The loop must stop when:

- the requested objective is complete;
- no useful actions remain;
- the iteration limit is reached;
- the execution time limit is reached;
- the user terminates the operation;
- required scope information is missing;
- the system cannot safely continue.

Avoid duplicate work.

Before executing a new action:

1. Check existing state.
2. Check whether the endpoint was already tested.
3. Check whether the hypothesis already exists.
4. Check whether evidence already exists.
5. Only repeat a test when there is a justified reason.

==================================================
5. MODES
==================================================

Implement two modes.

-------------------------
/hackbot-coop
-------------------------

Human-in-the-loop mode.

The system must pause at important decision points and allow the human
operator to review the current state and approve continuation.

Example:

Coordinator
→ Recon
→ Human Review
→ Vulnerability Agent
→ Human Review
→ Report

The human must be able to inspect:

- current plan;
- target;
- scope;
- discovered endpoints;
- hypotheses;
- proposed next actions;
- findings.

-------------------------
/hackbot-auto
-------------------------

Autonomous mode.

The Coordinator may continue the workflow without requiring approval
for every step.

However, enforce configurable limits:

- target scope;
- maximum iterations;
- maximum requests;
- maximum execution time;
- allowed agents;
- allowed Skills;
- allowed tools.

The autonomous mode must never expand the target scope by itself.

==================================================
6. STATE
==================================================

The filesystem must act as persistent state.

Do NOT rely exclusively on LLM conversational memory.

All important information must be persisted.

Persist at minimum:

- target;
- scope;
- execution mode;
- execution status;
- plan;
- tasks;
- technologies;
- endpoints;
- JavaScript discoveries;
- hypotheses;
- tested endpoints;
- findings;
- evidence;
- reports.

Use simple, human-readable formats wherever practical.

Prefer:

- Markdown for human-readable instructions and reports;
- JSON for structured machine-readable state.

Do not introduce a database unless it is actually necessary for the MVP.

==================================================
7. DIRECTORY STRUCTURE
==================================================

Create an organized structure based on this concept:

hackbot/
│
├── CLAUDE.md
├── COORDINATOR.md
│
├── agents/
│   │
│   ├── recon/
│   │   ├── AGENT.md
│   │   └── skills/
│   │       └── recon.md
│   │
│   ├── vuln-hunter/
│   │   ├── AGENT.md
│   │   └── skills/
│   │       ├── idor/
│   │       │   └── idor.md
│   │       └── cmdi/
│   │           └── cmdi.md
│   │
│   └── reporter/
│       └── AGENT.md
│
├── targets/
│   └── target-example/
│       │
│       ├── scope.md
│       │
│       ├── recon/
│       │
│       ├── state/
│       │
│       ├── findings/
│       │
│       └── reports/
│
└── tools/

You may modify this structure if you identify a clearly better design.

If you change it, document why.

Do not add unnecessary abstraction.

==================================================
8. SKILLS
==================================================

Create the initial Skills:

agents/vuln-hunter/skills/idor/idor.md

agents/vuln-hunter/skills/cmdi/cmdi.md

The Skills must be concise and action-oriented.

They should define:

- trigger conditions;
- required inputs;
- decision rules;
- testing procedure;
- evidence requirements;
- confirmation criteria;
- false-positive criteria;
- expected output.

Do NOT write Skills as generic educational explanations.

A Skill should answer:

"If I encounter X, what should I do next?"

The Skill should be reusable by the Vulnerability Agent.

==================================================
9. OUTPUT CONTRACTS
==================================================

Agents must communicate through structured outputs.

Define explicit contracts between:

Coordinator → Recon Agent

Recon Agent → Coordinator

Coordinator → Vulnerability Agent

Vulnerability Agent → Coordinator

Coordinator → Report Agent

Do not depend on arbitrary prose between agents.

Create appropriate schemas or documented JSON structures.

At minimum, distinguish:

HYPOTHESIS

from:

CONFIRMED FINDING

A hypothesis is not a vulnerability.

A confirmed finding requires evidence.

==================================================
10. EVIDENCE
==================================================

Evidence is a first-class component of the system.

When a vulnerability is confirmed, preserve relevant evidence such as:

- endpoint;
- HTTP method;
- request;
- response;
- relevant parameters;
- affected object;
- before/after state;
- reproduction information.

Do not fabricate evidence.

Do not rely only on an LLM's interpretation of a response.

==================================================
11. SECURITY BOUNDARIES
==================================================

The Hackbot is intended for authorized security testing.

Always operate within the target scope defined by the user.

Never autonomously expand scope.

If scope is ambiguous or missing, stop and request clarification rather
than guessing.

Do not treat discovered external domains, IPs, services or assets as
automatically in scope.

==================================================
12. IMPLEMENTATION REQUIREMENTS
==================================================

You are responsible for creating the complete initial implementation.

Do not stop at documentation.

After creating the project:

1. Inspect the generated directory structure.
2. Verify all required files exist.
3. Check for broken references.
4. Check that Agents reference the correct files.
5. Check that Skills can be discovered.
6. Check that state paths are consistent.
7. Run available tests.
8. Fix implementation errors.
9. Perform a final architecture consistency check.

If something is ambiguous, make the simplest reasonable implementation
that preserves the architecture and document the decision.

Do not introduce unnecessary dependencies.

Do not build functionality that is not required for the MVP.

==================================================
13. DEVELOPMENT STRATEGY
==================================================

Implement incrementally.

Phase 1:
Create the harness structure.

Phase 2:
Create global instructions.

Phase 3:
Create Coordinator.

Phase 4:
Create Recon Agent.

Phase 5:
Create Vulnerability Agent.

Phase 6:
Create IDOR Skill.

Phase 7:
Create Command Injection Skill.

Phase 8:
Create Report Agent.

Phase 9:
Implement /hackbot-coop.

Phase 10:
Implement /hackbot-auto.

Phase 11:
Implement persistent state.

Phase 12:
Test the entire workflow.

After each phase, verify that the previous phase still works.

==================================================
14. FINAL ACCEPTANCE CRITERIA
==================================================

The project is considered complete only if:

[ ] The directory structure exists.

[ ] CLAUDE.md exists and contains global rules.

[ ] COORDINATOR.md exists.

[ ] Coordinator Agent exists.

[ ] Recon Agent exists.

[ ] Vulnerability Agent exists.

[ ] Report Agent exists.

[ ] IDOR Skill exists.

[ ] Command Injection Skill exists.

[ ] Persistent target state exists.

[ ] Agent output contracts are defined.

[ ] Findings are separated from hypotheses.

[ ] Evidence is persisted.

[ ] Reports are persisted.

[ ] /hackbot-coop is implemented.

[ ] /hackbot-auto is implemented.

[ ] Ralph-style iterative execution exists.

[ ] Iteration limits exist.

[ ] Duplicate work detection exists.

[ ] Scope boundaries exist.

[ ] The project can be inspected and understood by a human without
    relying on LLM context.

[ ] The project has been tested.

[ ] Known implementation issues have been fixed.

==================================================
15. IMPORTANT EXECUTION RULE
==================================================

DO NOT simply return the files as text in your response.

CREATE THEM IN THE CURRENT WORKING DIRECTORY.

Use the filesystem.

Inspect what you create.

Modify files when necessary.

Run tests.

Fix errors.

Continue until the MVP is actually implemented.

At the end, provide a concise summary containing:

1. What was created.
2. Final directory structure.
3. How the agents communicate.
4. How Skills are loaded.
5. How /hackbot-coop works.
6. How /hackbot-auto works.
7. How to start the Hackbot.
8. What remains for future versions.

Do not claim something works unless you actually verified it.
