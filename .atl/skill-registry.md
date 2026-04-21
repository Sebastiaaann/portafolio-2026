# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Before any creative work - creating features, building components, adding functionality | brainstorming | C:\Users\elwax\.config\opencode\skills\brainstorming\SKILL.md |
| Creating a pull request, opening a PR, preparing changes for review | branch-pr | C:\Users\elwax\.config\opencode\skills\branch-pr\SKILL.md |
| Writing Go tests, using teatest, adding test coverage | go-testing | C:\Users\elwax\.config\opencode\skills\go-testing\SKILL.md |
| Creating a GitHub issue, reporting a bug, requesting a feature | issue-creation | C:\Users\elwax\.config\opencode\skills\issue-creation\SKILL.md |
| "judgment day", "judgment-day", "review adversarial", "dual review", "doble review", "juzgar" | judgment-day | C:\Users\elwax\.config\opencode\skills\judgment-day\SKILL.md |
| Creating a new skill, adding agent instructions, documenting patterns | skill-creator | C:\Users\elwax\.config\opencode\skills\skill-creator\SKILL.md |
| Any bug, test failure, unexpected behavior | systematic-debugging | C:\Users\elwax\.config\opencode\skills\systematic-debugging\SKILL.md |
| Implementing any feature or bugfix, before writing implementation code | test-driven-development | C:\Users\elwax\.config\opencode\skills\test-driven-development\SKILL.md |

## Compact Rules

### brainstorming
- MUST be used BEFORE any creative work — creating features, building components, adding functionality, modifying behavior
- Ask clarifying questions ONE AT A TIME — understand purpose/constraints/success criteria
- Propose 2-3 approaches with trade-offs and recommendation
- Present design in sections scaled to complexity, get user approval after each section
- HARD GATE: Do NOT invoke implementation skill, write code, scaffold, or take any implementation action until design is presented and user approved
- "Simple" projects still need design — can be brief but MUST present and get approval

### branch-pr
- Every PR MUST link an approved issue — no exceptions
- Every PR MUST have exactly one `type:*` label
- Automated checks must pass before merge
- Blank PRs without issue linkage are blocked by GitHub Actions

### go-testing
- Use table-driven tests as standard Go pattern
- Test Bubbletea TUI components with teatest
- Golden file testing for complex outputs
- Always test state transitions in TUI components

### issue-creation
- Blank issues are disabled — MUST use template (bug report or feature request)
- Every issue gets `status:needs-review` automatically
- Maintainer MUST add `status:approved` before PR can be opened
- Questions go to Discussions, not issues

### judgment-day
- Launch TWO independent blind judge sub-agents simultaneously for same target
- Synthesize findings from both judges, apply fixes, re-judge until both pass
- Escalate after 2 iterations if still failing
- Follow Skill Resolver Protocol before launching judges
- Resolve skill registry: mem_search → .atl/skill-registry.md fallback

### skill-creator
- Create skill when pattern repeats, AI needs guidance, complex workflows need steps
- Don't create skill when documentation exists, pattern is trivial, or one-off task
- Follow Agent Skills spec for structure: frontmatter, when-to-use, critical patterns, rules
- Place in user-level skills directory for global, project-level for workspace-specific

### systematic-debugging
- NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST — iron law
- Phase 1 (Root Cause) MUST complete before Phase 2 (Fix)
- Symptom fixes are failure — they mask underlying issues
- Random fixes waste time and create new bugs
- Always reproduce issue first, understand why it happens, then fix

### test-driven-development
- Write the test FIRST, watch it fail, write minimal code to pass
- If you didn't watch the test fail, you don't know if it tests the right thing
- Always use for: new features, bug fixes, refactoring, behavior changes
- Exceptions only with human partner approval: throwaway prototypes, generated code, config files
- Violating the letter of the rules is violating the spirit of the rules

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| — | — | No project-level convention files found |
