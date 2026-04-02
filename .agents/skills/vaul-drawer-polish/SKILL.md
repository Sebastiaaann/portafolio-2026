---
name: vaul-drawer-polish
description: >
  Apply UI polish and physics rules to Vaul drawers.
  Trigger: When implementing, styling, or debugging a Vaul drawer component, or when asked to polish a drawer interface.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- When building a new `Drawer` component using Vaul.
- When refactoring or styling an existing Vaul drawer.
- When asked to "make the drawer feel better" or "fix drawer animations".

## Critical Patterns

### 1. Don't fight Vaul's physics
Vaul uses inline `transform` and CSS variables for its native spring physics. 
- **NEVER** add Tailwind animation classes like `animate-in`, `slide-in`, or `transition-all` to the `DrawerContent`.
- Adding CSS transitions to the drawer container will conflict with the spring physics and cause jitter.

### 2. No transparent wrappers
- **NEVER** make `DrawerContent` a transparent, borderless container just to nest your actual visible UI `<div>` inside it.
- `DrawerContent` **MUST** be the actual visible element (e.g., with `bg-white`, `rounded-t-[32px]`, `p-4`, etc.). This ensures the physics apply directly to the visible bounds of the drawer.

### 3. UI Polish for Drawer Items
- **Tactile Feedback**: Apply `active:scale-[0.96]` and `will-change-transform` for tactile feedback on interactive elements (buttons, cards) inside the drawer.
- **Transitions**: Always pair scale effects with `transition-transform` (never `transition-all` to avoid expensive repaints).
- **Touch Targets**: Ensure close buttons and icon buttons have a minimum 40x40px hit area (`w-10 h-10`).
- **Concentric Radii**: Use concentric border radius (e.g., if Drawer is `rounded-[32px]` and padding is `16px`, inner elements/buttons should be `rounded-[16px]`).
- **Shadows**: Replace hard borders with soft, multi-layered shadows on the drawer content.

## Code Examples

```tsx
import { Drawer } from "vaul";

export function MyDrawer() {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>
        <button className="active:scale-[0.96] transition-transform will-change-transform">
          Open Drawer
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        {/* CORRECT: DrawerContent is the visible UI. NO transition-all or animate-in */}
        <Drawer.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[32px] p-4 shadow-[0_-8px_30px_-15px_rgba(0,0,0,0.1)] outline-none flex flex-col gap-4">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-gray-300 mb-2" />
          <Drawer.Title className="text-xl font-semibold">Title</Drawer.Title>
          
          {/* Concentric radius: Drawer is 32px, padding is 16px, so inner is 16px */}
          <button className="w-full h-12 bg-blue-500 text-white rounded-[16px] active:scale-[0.96] transition-transform will-change-transform">
            Action
          </button>
          
          {/* 40x40px hit area for icon buttons */}
          <Drawer.Close className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 active:scale-[0.96] transition-transform will-change-transform">
            X
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```

## Commands

```bash
# No specific commands, applies at the component coding level
```

## Resources

- **Documentation**: Check Vaul docs for API usage and examples
