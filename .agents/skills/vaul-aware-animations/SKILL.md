---
name: vaul-aware-animations
description: >
  Implement Emil Kowalski's "Aware vs Unaware" animation philosophy for Vaul drawers with background scaling.
  Trigger: When the user asks to implement Vaul, drawer animations, aware animations, or scale background in Vaul.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## When to Use

- When installing or configuring the Vaul drawer component
- When the user asks for "aware" animations or native-feeling drawers
- When setting up the `shouldScaleBackground` property in Vaul

## Critical Patterns

### 1. Aware vs Unaware Philosophy
Unaware animations just happen on top of the UI. Aware animations cause the rest of the UI to react (e.g., pushing back into the background). Aware animations feel more premium and native (like iOS modals).

### 2. Vaul Implementation
To enable this in Vaul, always pass `shouldScaleBackground={true}` to the `<Drawer.Root>` or `<Drawer>` component.

### 3. Required DOM Architecture
For the scaling effect to work properly and look good, the following DOM structure is REQUIRED:
- **Body Background**: The `<body>` element MUST have a dark background (e.g., `bg-black` or `bg-zinc-950`). This acts as the "void" that appears when the app scales down.
- **Wrapper Element**: All main application content (Header, Main, Footer) MUST be wrapped in a container `div` with the attribute `vaul-drawer-wrapper=""`.
- **Wrapper Styling**: This `vaul-drawer-wrapper` div MUST have the application's actual background color (e.g., `bg-white` or `bg-zinc-50`) and a minimum height (`min-h-screen`).

## Code Examples

### Root Layout Setup

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* The body acts as the dark void behind the scaled app */}
      <body className="bg-black">
        {/* The wrapper holds the actual app content and background */}
        <div vaul-drawer-wrapper="" className="bg-white min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
```

### Drawer Implementation

```tsx
import { Drawer } from 'vaul';

export function MyDrawer() {
  return (
    <Drawer.Root shouldScaleBackground={true}>
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 mt-24 flex h-[80%] flex-col rounded-t-[10px] bg-white">
          <div className="flex-1 rounded-t-[10px] bg-white p-4">
            <Drawer.Title className="mb-4 font-medium text-gray-900">
              Aware Animation Drawer
            </Drawer.Title>
            <p className="text-gray-600">
              The background has scaled down, showing the dark void behind it.
            </p>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
```
