---
name: emil-design-eng
description: >
  Emil Kowalski's philosophy on UI polish, component design, animation decisions, and the invisible details that make software feel great.
  Trigger: When building UI components, reviewing frontend code, implementing animations, hover states, shadows, borders, typography, micro-interactions, enter/exit animations, or any visual detail work.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- When building UI components, reviewing frontend code, implementing animations, hover states, shadows, borders, typography, micro-interactions, enter/exit animations, or any visual detail work.

## Critical Patterns (Rules)

- **Hardware Accelerated Properties:** Animate ONLY `transform` and `opacity`. Avoid animating layout properties (`width`, `height`, `margins`, `padding`) to prevent expensive layout recalculations.
- **Performant Overlays & Masking:** Use `clip-path: inset()` for performant overlays and masking effects instead of `overflow: hidden` combined with width/height manipulations to avoid layout thrashing.
- **Origin-aware Animations:** Set `transform-origin` relative to the trigger point (e.g., bottom-center for a dropdown opening from a bottom button) rather than defaulting to center.
- **Custom Easings:** Avoid the default `ease`.
  - Default to `ease-out` (starts fast, feels responsive) for snappy entering elements.
  - Use `ease-in-out` for moving existing screen elements (mimics natural acceleration/deceleration).
- **Spring Interactions:** Use spring physics (like Framer Motion's `useSpring`) for cursor-tied decorative interactions to feel natural. Avoid instant, rigid updates.
- **Scaling Entrances:** Never animate from `scale(0)`—nothing in the real world appears from nothing. Start at a visible scale like `scale(0.95)` or `scale(0.5)` combined with `opacity: 0` for natural entrances.
- **Relative Translation:** Use percentages in `translate()` (e.g., `translateY(-100%)`) to remain relative to the element's size, preventing hardcoded pixel values and making animations responsive to content size.
- **Interruptibility:** Ensure CSS transitions or animations can be interrupted and reversed seamlessly (prefer CSS `transition` over `@keyframes` for interruptible UI).
- **Accessibility (Reduced Motion):** Always honor `@media (prefers-reduced-motion: reduce)` by swapping transforms and springs for simple opacity fades.

## Code Examples

### Origin-Aware Popover
```css
/* Good: Scales from the trigger point */
.popover {
  transform-origin: var(--radix-popover-content-transform-origin);
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
```

### Natural Scale Entrance
```css
/* Good: Starts slightly scaled down with opacity */
.entering {
  transform: scale(0.95);
  opacity: 0;
  transition: transform 200ms ease-out, opacity 200ms ease-out;
}
```

### Performant Masking with clip-path
```css
/* Good: Hardware accelerated mask reveal */
.overlay {
  clip-path: inset(0 100% 0 0); /* Hidden from right */
  transition: clip-path 200ms ease-out;
}
.overlay.visible {
  clip-path: inset(0 0 0 0); /* Fully visible */
}
```

### Accessible Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    transition: opacity 200ms ease;
    transform: none !important;
  }
}
```
