# Portafolio 2026

Portafolio personal migrado a **Astro static** con **React islands** y **Tailwind CSS 4**.

## Desarrollo

1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Levantar el proyecto:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` — Astro en modo desarrollo
- `npm run build` — build estático de Astro
- `npm run preview` — preview local del build
- `npm run lint` — chequeo de tipos con `tsc --noEmit`

## Estructura

- `src/pages/index.astro` — página inicial de Astro
- `src/App.tsx` — componente React reutilizable montado como island
- `src/index.css` — estilos globales con Tailwind
