# TS Foundry Template

`ts-foundry-template` is a modern TypeScript monorepo template for repeatable frontend, backend, fullstack, CLI, and library experiments.

它不是一个业务应用，也不是一个框架集合。它是一个工程母版：把 pnpm workspace、Turborepo、TypeScript strict、Biome、Vitest、Playwright、MSW、Knip、syncpack、Lefthook、Renovate、React、Hono、TanStack、Tailwind CSS、shadcn/ui 和 tsdown 组合成一套可复制、可验证、可长期维护的默认工作区。

## Start Here

Read [GUIDE.md](./GUIDE.md) first. It explains how to choose a template, create experiments, run quality gates, maintain dependencies, and use this repository as a GitHub template.

## Quick Start

```bash
corepack enable
pnpm install
pnpm check
pnpm check:full
```

Create a new experiment from a template:

```bash
pnpm create:experiment react-spa ui-demo
pnpm create:experiment hono-api api-demo
pnpm create:experiment fullstack contract-demo
pnpm create:experiment node-cli rename-files
pnpm create:experiment ts-lib text-utils
```

## What Is Included

- `apps/web`: React + Vite SPA sample.
- `apps/api`: Hono API sample.
- `apps/fullstack`: React + Hono + shared contracts sample.
- `templates/react-spa`: frontend experiment template.
- `templates/hono-api`: backend API template.
- `templates/fullstack-hono-react`: fullstack experiment template.
- `templates/node-cli`: Node CLI template.
- `templates/ts-lib`: TypeScript library template.
- `packages/tsconfig`: shared TypeScript configs.
- `packages/contracts`: Zod contracts and shared API schemas.
- `packages/test-utils`: faker and MSW test helpers.
- `packages/ui`: shadcn/ui-based React UI foundation with Tailwind CSS v4 tokens, theme support, and shared components.
- `packages/utils`: runtime-neutral TypeScript utilities.
- `packages/node-utils`: Node-only utilities.

## Main Commands

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Run workspace dev tasks |
| `pnpm build` | Build workspace packages |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm lint` | Run Biome checks |
| `pnpm test` | Run Vitest tests |
| `pnpm test:coverage` | Run Vitest coverage |
| `pnpm e2e` | Run Playwright paths |
| `pnpm deps:check` | Run Knip and syncpack |
| `pnpm check` | Local default quality gate |
| `pnpm check:full` | Full CI-level quality gate |

## Documentation

- [GUIDE.md](./GUIDE.md): user guide for this template.
- [docs/工程治理约定.md](./docs/工程治理约定.md): repository governance.
- [docs/技术选型记录.md](./docs/技术选型记录.md): technology decisions.
- [docs/环境配置清单.md](./docs/环境配置清单.md): toolchain inventory.
- [docs/质量门禁.md](./docs/质量门禁.md): quality gates.
- [docs/项目模板说明.md](./docs/项目模板说明.md): template descriptions.
- [docs/TS Foundry Frontend UI Foundation 设计文档.md](./docs/TS%20Foundry%20Frontend%20UI%20Foundation%20设计文档.md): frontend UI foundation implementation specification.

## Non-goals

This template does not configure databases, deployment, Docker, SSR frameworks, Next.js, NestJS, production release workflows, or cloud infrastructure. Those belong to concrete projects created from this template.

## License

Apache-2.0. See [LICENSE](./LICENSE).
