## Exploration: Astro Islands and View Transitions

### Current State
Currently, the portfolio utilizes React components wrapped in Astro Islands:
- `index.astro` hydrates `<Hero client:load />` immediately, loading Framer Motion for entrance animations and interactive experience accordions.
- `proyectos.astro` hydrates `<ProjectsGrid client:load />` immediately, also for Framer Motion entrance animations and hover effects.
- `Header.astro` hydrates `<CVDrawer client:idle />`, which is an excellent use of deferring non-critical UI.
- `Layout.astro` imports `<ClientRouter />` (Astro's View Transitions), enabling SPA-like navigation, but `Header` and `Footer` are duplicated across pages rather than being persistent layout shells.

### Affected Areas
- `src/layouts/Layout.astro` — Needs to wrap persistent elements to avoid redundant DOM updates during navigation.
- `src/components/Header.astro` — Needs `transition:persist` or a shared view transition name for smooth navigation.
- `src/components/react/Hero.tsx` — Main avatar and titles are ripe for morphing view transitions. Heavy JS usage.
- `src/components/react/ProjectsGrid.tsx` — Currently uses JS for animations that could be done with pure CSS, allowing us to drop the `client:load` island entirely.

### Approaches
1. **Shared Layout & Persistent Header/Footer** — Move `Header` and `Footer` into `Layout.astro` or use `transition:persist`.
   - Pros: Eliminates navigation jitter, maintains scroll state on drawer/menus, true SPA feel.
   - Cons: Requires refactoring page templates slightly.
   - Effort: Low

2. **Hero Avatar to Header Morphing (View Transition)** — Add a small avatar to the `Header` and share a `view-transition-name` with the large avatar in `Hero.tsx`. When navigating from `/` to `/proyectos`, the large avatar shrinks and flies into the top-left corner.
   - Pros: Highly polished, memorable "wow" factor, leverages Astro's native capabilities.
   - Cons: Needs careful handling of aspect ratios and border-radius during morphing.
   - Effort: Medium

3. **Title Morphing (View Transition)** — The active nav link in the header ("Proyectos") can share a `view-transition-name` with the large `h1` "Proyectos" in `ProjectsGrid.tsx`. When clicking the link, it grows into the page title.
   - Pros: Creates strong spatial continuity.
   - Cons: May conflict with sticky header text sizing.
   - Effort: Medium

4. **Zero-JS Projects Grid (Astro Island Optimization)** — Replace Framer Motion in `ProjectsGrid.tsx` with Tailwind CSS `@keyframes` and `group-hover` transitions. Remove `client:load` entirely when rendering it in Astro.
   - Pros: Drops ~30KB of JS from the `/proyectos` page, instant load, perfect Lighthouse score.
   - Cons: Requires rewriting React `motion.div` logic to standard HTML/Tailwind classes.
   - Effort: Medium

5. **Split Hydration in Hero (Astro Island Optimization)** — Split the static top half of `Hero` (avatar, text, static links) from the interactive bottom half (`ExperienceItem` accordions). Render the top statically and use `client:visible` for the accordions.
   - Pros: Faster Time to Interactive (TTI), unblocks the main thread for the most critical above-the-fold content.
   - Cons: Requires breaking `Hero.tsx` into smaller components.
   - Effort: Medium

### Recommendation
Implement **Approach 1**, **Approach 2**, and **Approach 4**. 
Making the header persistent and morphing the avatar gives the most visual impact. Removing `client:load` from `ProjectsGrid` by leveraging pure CSS transitions is the biggest performance win and perfectly aligns with Astro's island philosophy (0 JS by default).

### Risks
- Framer Motion's layout animations sometimes conflict with native CSS View Transitions. 
- Using `transition:persist` on React islands can cause hydration mismatches if the internal state is not managed carefully during navigation.

### Ready for Proposal
Yes — The orchestrator can proceed to propose these specific animations and island optimizations to the user.