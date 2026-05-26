# TS Foundry Template

English | [中文](./README.zh.md)

[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Biome](https://img.shields.io/badge/formatter-Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev)

A batteries-included TypeScript monorepo template for frontend, backend, fullstack, CLI, and library experiments.

Use it to skip the first-day engineering decisions — workspace layout, task orchestration, type safety, testing, linting, dependency governance, and template replication — and start building on a proven, long-lived foundation.

> **Not** a framework, not a product, not a deployment recipe.
> It is an engineering mother template: copy it, create an experiment, build something real.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Templates](#templates)
- [Repository Layout](#repository-layout)
- [Included Packages](#included-packages)
- [Commands](#commands)
- [Quality Gates](#quality-gates)
- [Using as a GitHub Template](#using-as-a-github-template)
- [Non-Goals](#non-goals)
- [Documentation](#documentation)
- [License](#license)

## Quick Start

**Prerequisites:** Node >= 24, pnpm >= 10 (managed via Corepack).

```bash
corepack enable
pnpm install
pnpm check          # local quality gate
pnpm check:full     # CI-level quality gate
```

Create an experiment from a template:

```bash
pnpm create:experiment react-spa ui-demo
pnpm create:experiment hono-api api-demo
pnpm create:experiment fullstack contract-demo
pnpm create:experiment node-cli rename-files
pnpm create:experiment ts-lib text-utils
```

Read [GUIDE.md](./GUIDE.md) for the full workflow.

## Templates

Each template is a copyable starting point for a specific project shape. Choose the smallest one that fits.

| Goal | Template | Command |
| :--- | :--- | :--- |
| React SPA, UI demo, frontend tool | `react-spa` | `pnpm create:experiment react-spa <name>` |
| Hono API, webhook, backend service | `hono-api` | `pnpm create:experiment hono-api <name>` |
| React + Hono fullstack with shared contracts | `fullstack` | `pnpm create:experiment fullstack <name>` |
| Project-oriented Node CLI tool | `node-cli` | `pnpm create:experiment node-cli <name>` |
| Reusable TypeScript library | `ts-lib` | `pnpm create:experiment ts-lib <name>` |

### `node-cli`

`node-cli` is a project-oriented CLI template rather than a hello-world argument parser. It captures the shared behavior used by long-lived developer tools: `init` creates a hidden `.foo/config.toml` project context, regular commands either use `--project <path>` or search upward from the current directory, sources are declared with TOML `id/root/include/exclude/scanner` entries, discovery respects `.gitignore` by default, and command results have stable human and JSON projections.

The template is useful for file processors, repository analyzers, documentation indexers, migration tools, and automation CLIs that need repeatable project discovery before they run business logic. Its scanner registry is deliberately small: the template proves how discovered files flow into `text` and `python` scanners, while concrete tools replace scanner implementations without redesigning project lookup, config loading, glob discovery, error codes, or package boundaries.

## Repository Layout

```text
apps/           runnable samples that prove the stack works
packages/       shared packages consumed by apps, templates, and experiments
templates/      copy sources for new projects
experiments/    generated experiments (created by the script above)
projects/       formal projects promoted from experiments for long-term maintenance
docs/           governance, tech decisions, quality gates, template docs
scripts/        repository maintenance scripts
```

## Included Packages

### Apps (runnable samples)

| App | Stack |
| :--- | :--- |
| `apps/web` | React + Vite SPA |
| `apps/api` | Hono API |
| `apps/fullstack` | React + Hono + shared contracts |

### Shared Packages

| Package | Purpose |
| :--- | :--- |
| `packages/ui` | shadcn/ui components, Tailwind CSS v4 tokens, theme support |
| `packages/contracts` | Zod schemas and shared API contracts |
| `packages/utils` | Runtime-neutral TypeScript utilities |
| `packages/node-utils` | Node-only utilities |
| `packages/test-utils` | Faker and MSW test helpers |
| `packages/tsconfig` | Shared TypeScript configurations |

## Commands

### Workspace-wide

| Command | Purpose |
| :--- | :--- |
| `pnpm dev` | Run dev tasks |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | TypeScript checks |
| `pnpm lint` | Biome checks |
| `pnpm format` | Biome auto-fix |
| `pnpm test` | Vitest tests |
| `pnpm test:coverage` | Vitest with coverage |
| `pnpm e2e` | Playwright tests |
| `pnpm deps:check` | Knip + syncpack |
| `pnpm check` | Local quality gate |
| `pnpm check:full` | CI-level quality gate |
| `pnpm clean` | Remove generated artifacts |
| `pnpm create:experiment` | Create experiment from template |
| `pnpm changeset` | Create a changeset |
| `pnpm release` | Version and publish |

### Per-package

```bash
pnpm --filter <package-name> dev
pnpm --filter <package-name> test
pnpm --filter <package-name> build
```

## Quality Gates

| Gate | What it runs |
| :--- | :--- |
| `pnpm check` | lint + typecheck + test |
| `pnpm check:full` | lint + typecheck + test:coverage + build + e2e + deps:check + pack:check + smoke:create-experiment |

Run `pnpm check:full` after changing root config, workspace dependencies, templates, shared packages, CI, hooks, or scripts.

## Using as a GitHub Template

After pushing to GitHub, mark the repository as a template:

```bash
gh repo edit --template
```

Or create the remote in one step:

```bash
gh repo create ts-foundry-template \
  --public \
  --source=. \
  --remote=origin \
  --push
gh repo edit --template
```

## Non-Goals

This template intentionally does **not** include:

- Databases, ORMs, or queues
- Deployment, Docker, or cloud infrastructure
- SSR, Next.js, or NestJS
- Authentication or authorization
- Production release workflows

These belong to concrete projects created from this template.

## Documentation

| Document | Contents |
| :--- | :--- |
| [GUIDE.md](./GUIDE.md) | Full user guide |
| [Engineering Governance](./docs/工程治理约定.md) | Repository governance rules |
| [Tech Decisions](./docs/技术选型记录.md) | Technology selection rationale |
| [Toolchain Inventory](./docs/环境配置清单.md) | Environment and toolchain setup |
| [Quality Gates](./docs/质量门禁.md) | Gate definitions and CI |
| [Template Descriptions](./docs/项目模板说明.md) | Per-template details |
| [UI Foundation Spec](./docs/TS%20Foundry%20Frontend%20UI%20Foundation%20设计文档.md) | Frontend UI foundation design |

## License

[Apache-2.0](./LICENSE)
