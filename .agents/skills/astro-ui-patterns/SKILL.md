---
name: astro-ui-patterns
description: >
  Best practices for Astro UI functionality including View Transitions, Islands, and Zero-JS styling.
  Trigger: When building Astro UI, using view transitions, hydrating components, or styling static pages.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- When morphing elements across pages (e.g., avatars, titles).
- When implementing persistent layouts or headers.
- When deciding how and when to hydrate interactive components.
- When adding animations to static Astro pages without heavy JS libraries.

## Critical Patterns

### 1. View Transitions: Morphing Elements (`transition:name`)
Use `transition:name` to seamlessly morph elements (like images or titles) across page navigations. Both the old and new elements must share the exact same `transition:name` string.

### 2. View Transitions: Persistent UI (`transition:persist`)
Use `transition:persist` to keep stateful components (like audio players, headers, or sidebars) alive and retain their internal state during navigation.

### 3. Deferring Hydration (Islands Architecture)
Do not hydrate everything by default. Use Astro client directives to load JS only when necessary:
- `client:idle`: For low-priority components that don't need immediate interaction (loads when main thread is free).
- `client:visible`: For components below the fold (loads when entering the viewport).
- `client:load`: Only for high-priority interactive components immediately visible.

### 4. Zero-JS Animations
Avoid heavy JS animation libraries (e.g., Framer Motion, GSAP) for static pages.
Instead, use pure CSS or Tailwind CSS utility classes (e.g., `@keyframes`, `transition-all`, hover states) to keep the bundle size small and performance high.

## Code Examples

### Morphing an Avatar
```astro
<!-- Page A -->
<img src="/avatar.png" transition:name="user-avatar" alt="User" />

<!-- Page B -->
<img src="/avatar.png" transition:name="user-avatar" alt="User" class="large-avatar" />
```

### Persistent Stateful Header
```astro
<Header transition:persist="main-header" client:load />
```

### Deferred Hydration
```astro
<!-- Hydrates only when the user scrolls down to it -->
<HeavyCarousel client:visible />

<!-- Hydrates when the browser is idle -->
<AnalyticsWidget client:idle />
```

### CSS/Tailwind Animations (Zero-JS)
```astro
<div class="hover:scale-105 transition-transform duration-300 ease-out">
  Hover me to scale!
</div>
```

## Resources
- **Documentation**: Refer to Astro View Transitions and Client Directives documentation.
