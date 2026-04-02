# Skill Registry

**Orchestrator use only.** Read this registry once per session to resolve skill paths, then pass pre-resolved paths directly to each sub-agent's launch prompt. Sub-agents receive the path and load the skill directly — they do NOT read this registry.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| Manual load | "doc" | C:/Users/elwax/.Codex/skills/doc/SKILL.md |
| Manual load | "gh-fix-ci" | C:/Users/elwax/.Codex/skills/gh-fix-ci/SKILL.md |
| When writing Go tests, using teatest, or adding test coverage. | go-testing | C:/Users/elwax/.copilot/skills/go-testing/SKILL.md |
| Manual load | "pdf" | C:/Users/elwax/.Codex/skills/pdf/SKILL.md |
| Manual load | "playwright" | C:/Users/elwax/.Codex/skills/playwright/SKILL.md |
| Manual load | "playwright-interactive" | C:/Users/elwax/.Codex/skills/playwright-interactive/SKILL.md |
| Manual load | "screenshot" | C:/Users/elwax/.Codex/skills/screenshot/SKILL.md |
| Manual load | "security-best-practices" | C:/Users/elwax/.Codex/skills/security-best-practices/SKILL.md |
| When user asks to create a new skill, add agent instructions, or document patterns for AI. | skill-creator | C:/Users/elwax/.copilot/skills/skill-creator/SKILL.md |
| Manual load | brainstorming | C:/Users/elwax/.config/opencode/skills/brainstorming/SKILL.md |
| Manual load | dispatching-parallel-agents | C:/Users/elwax/.config/opencode/skills/dispatching-parallel-agents/SKILL.md |
| Manual load | executing-plans | C:/Users/elwax/.config/opencode/skills/executing-plans/SKILL.md |
| Manual load | finishing-a-development-branch | C:/Users/elwax/.config/opencode/skills/finishing-a-development-branch/SKILL.md |
| Manual load | receiving-code-review | C:/Users/elwax/.config/opencode/skills/receiving-code-review/SKILL.md |
| Manual load | requesting-code-review | C:/Users/elwax/.config/opencode/skills/requesting-code-review/SKILL.md |
| Manual load | subagent-driven-development | C:/Users/elwax/.config/opencode/skills/subagent-driven-development/SKILL.md |
| Manual load | systematic-debugging | C:/Users/elwax/.config/opencode/skills/systematic-debugging/SKILL.md |
| Manual load | test-driven-development | C:/Users/elwax/.config/opencode/skills/test-driven-development/SKILL.md |
| Manual load | using-git-worktrees | C:/Users/elwax/.config/opencode/skills/using-git-worktrees/SKILL.md |
| Manual load | using-superpowers | C:/Users/elwax/.config/opencode/skills/using-superpowers/SKILL.md |
| Manual load | verification-before-completion | C:/Users/elwax/.config/opencode/skills/verification-before-completion/SKILL.md |
| Manual load | writing-plans | C:/Users/elwax/.config/opencode/skills/writing-plans/SKILL.md |
| Manual load | writing-skills | C:/Users/elwax/.config/opencode/skills/writing-skills/SKILL.md |
| Manual load | ui-skills | C:/Users/elwax/.cursor/skills/ui-skills/SKILL.md |
| Manual load | building-native-ui | C:/Users/elwax/.agents/skills/building-native-ui/SKILL.md |
| Manual load | deploy-to-vercel | C:/Users/elwax/.agents/skills/deploy-to-vercel/SKILL.md |
| Manual load | find-skills | C:/Users/elwax/.agents/skills/find-skills/SKILL.md |
| Manual load | ios-design-guidelines | C:/Users/elwax/.agents/skills/ios-design-guidelines/SKILL.md |
| Manual load | mercadopago-integration | C:/Users/elwax/.agents/skills/mercadopago-integration/SKILL.md |
| Manual load | mobile-ios-design | C:/Users/elwax/.agents/skills/mobile-ios-design/SKILL.md |
| Manual load | postgres | C:/Users/elwax/.agents/skills/postgres/SKILL.md |
| Manual load | react-native | C:/Users/elwax/.agents/skills/react-native/SKILL.md |
| Manual load | react-native-testing | C:/Users/elwax/.agents/skills/react-native-testing/SKILL.md |
| Manual load | web-scraping | C:/Users/elwax/.agents/skills/web-scraping/SKILL.md |
| Manual load | accessibility | D:/proyectos/Portafolio 2026/.agents/skills/accessibility/SKILL.md |
| Manual load | astro | D:/proyectos/Portafolio 2026/.agents/skills/astro/SKILL.md |
| When building Astro UI, using view transitions, hydrating components, or styling static pages. | astro-ui-patterns | D:/proyectos/Portafolio 2026/.agents/skills/astro-ui-patterns/SKILL.md |
| Manual load | emil-design-eng | D:/proyectos/Portafolio 2026/.agents/skills/emil-design-eng/SKILL.md |
| Manual load | frontend-design | D:/proyectos/Portafolio 2026/.agents/skills/frontend-design/SKILL.md |
| Manual load | make-interfaces-feel-better | D:/proyectos/Portafolio 2026/.agents/skills/make-interfaces-feel-better/SKILL.md |
| Manual load | nodejs-backend-patterns | D:/proyectos/Portafolio 2026/.agents/skills/nodejs-backend-patterns/SKILL.md |
| Manual load | nodejs-best-practices | D:/proyectos/Portafolio 2026/.agents/skills/nodejs-best-practices/SKILL.md |
| Manual load | nodejs-express-server | D:/proyectos/Portafolio 2026/.agents/skills/nodejs-express-server/SKILL.md |
| Manual load | seo | D:/proyectos/Portafolio 2026/.agents/skills/seo/SKILL.md |
| Manual load | shadcn | D:/proyectos/Portafolio 2026/.agents/skills/shadcn/SKILL.md |
| Manual load | tailwind-css-patterns | D:/proyectos/Portafolio 2026/.agents/skills/tailwind-css-patterns/SKILL.md |
| Manual load | tailwind-v4-shadcn | D:/proyectos/Portafolio 2026/.agents/skills/tailwind-v4-shadcn/SKILL.md |
| Manual load | typescript-advanced-types | D:/proyectos/Portafolio 2026/.agents/skills/typescript-advanced-types/SKILL.md |
| When the user asks to implement Vaul, drawer animations, aware animations, or scale background in Vaul. | vaul-aware-animations | D:/proyectos/Portafolio 2026/.agents/skills/vaul-aware-animations/SKILL.md |
| When implementing, styling, or debugging a Vaul drawer component, or when asked to polish a drawer interface. | vaul-drawer-polish | D:/proyectos/Portafolio 2026/.agents/skills/vaul-drawer-polish/SKILL.md |
| Manual load | vercel-composition-patterns | D:/proyectos/Portafolio 2026/.agents/skills/vercel-composition-patterns/SKILL.md |

## Project Conventions

| File | Path | Notes |
|------|------|-------|
