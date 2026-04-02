## Exploration: Bold Editorial Studio Redesign

### Current State
The portfolio is currently built with Astro, React, and Tailwind CSS v4. It features a soft, friendly aesthetic heavily reliant on rounded corners (e.g., \ounded-[20px]\), pink/fuchsia accents (e.g., \#E24D95\, \g-[#FEE5F1]\, \selection:bg-pink-200\), and standard spring animations via Framer Motion. The "Ver CV Completo" button is implemented via Shadcn UI Drawer in \CVDrawer.tsx\ and has a "private key style" modal with colorful buttons and rounded shapes.

### Affected Areas
- \src/layouts/Layout.astro\: Needs global font adjustments (add Mono for metadata) and removal of pink selection styling (\selection:bg-pink-200\).
- \src/index.css\: Needs Tailwind theme updates for pure black (\#000000\) and white (\#FFFFFF\), neutral grays (\#525252\, \#737373\), removal of pink/fuchsia values, and custom mix-blend-mode cursor base classes.
- \src/components/react/Hero.tsx\: Must replace the soft pink highlights and colored text with bold 700 Inter typography, extreme contrast, cubic-bezier text reveals (\cubic-bezier(0.16, 1, 0.3, 1)\), and potentially house the new infinite marquee.
- \src/components/react/Projects.tsx\: Needs a brutalist/editorial update—removing soft badges, adding grayscale to color transitions (\grayscale hover:grayscale-0\) on \ProjectImage\, and extreme typography contrast for titles vs metadata.
- \src/components/Header.astro\ & \src/components/react/CVDrawer.tsx\: Must preserve the "Ver CV Completo" functionality while completely stripping its soft UI styling to match the sharp, high-contrast black and white editorial theme.

### Approaches
1. **Iterative Refactor (Recommended)** — Systematically strip out all pink/fuchsia colors and rounded corners globally, establish the new typography scale (Inter Bold + Mono), implement the custom cursor globally in the Layout, and finally update Framer Motion transitions and hover states (grayscale).
   - Pros: Safer, ensures the "Ver CV Completo" button functionality isn't broken during the UI update.
   - Cons: Takes slightly longer to meticulously find and replace all hardcoded hex values.
   - Effort: Medium

2. **Complete Rewrite of Hero/Projects** — Build new \EditorialHero.tsx\ and \EditorialProjects.tsx\ components from scratch and swap them in \index.astro\.
   - Pros: Cleaner slate, less fighting with existing Framer Motion variants.
   - Cons: Higher risk of losing functionality if not careful.
   - Effort: High

### Recommendation
**Iterative Refactor**. Since the underlying architecture (Astro + React + Framer Motion + Tailwind v4) is perfectly suited for the new design, we should just replace the styling layer (colors, radiuses, typographies, animation curves) rather than rebuilding components from scratch. The custom cursor should be added to the root Layout, and the infinite marquee can be inserted as a new section or inside the Hero.

### Risks
- **Accessibility**: A mix-blend-mode cursor over complex backgrounds can sometimes cause visibility issues or interact poorly with clickable elements. Fallbacks should be considered.
- **Tailwind v4 Config**: Since the config is CSS-first (\index.css\), global variables need to be carefully updated to ensure shadcn/ui components (like the Drawer) still work correctly but with the new sharp styling.

### Ready for Proposal
Yes. The scope is well-defined, the files to modify are identified, and the technical requirements map perfectly to the existing stack.
