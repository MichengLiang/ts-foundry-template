# @ts-foundry/ui

Shared React UI foundation for TS Foundry frontend and fullstack templates.

This package owns shadcn/ui-based base components, Tailwind CSS v4 tokens,
theme support, and accessible primitives. App and template packages consume
these components through `@ts-foundry/ui`; app-specific composition stays in
the app or template that needs it.

## Structure

- `src/components`: shared shadcn/ui base components.
- `src/styles/globals.css`: Tailwind v4 entry, shadcn tokens, light/dark
  variables, and base rules.
- `src/theme-provider.tsx`: light/dark/system theme provider.
- `src/mode-toggle.tsx`: default theme toggle control.
- `components.json`: shadcn monorepo coordinates for the shared package.

## Development

- Install dependencies:

```bash
pnpm install
```

- Run the playground:

```bash
pnpm --filter @ts-foundry/ui play
```

- Run the unit tests:

```bash
pnpm --filter @ts-foundry/ui test
```

- Build the library:

```bash
pnpm --filter @ts-foundry/ui build
```
