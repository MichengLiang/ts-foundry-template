# Guide

This guide explains how to use `ts-foundry-template` as a TypeScript monorepo mother template.

## 1. What This Template Is

`ts-foundry-template` 是一个面向现代 TypeScript 生态的工程母版。它解决的不是某个业务功能，而是每次开始新 TypeScript 项目时反复出现的工程决策：目录怎么放、任务怎么跑、类型怎么收口、测试怎么组织、依赖怎么治理、模板怎么复制、什么算完成。

母版覆盖五类常见启动对象：

- React frontend application.
- Hono backend API.
- React + Hono fullstack application.
- Node CLI.
- TypeScript library.

每一类对象都继承同一套工程质量默认值：pnpm workspace、Turborepo、TypeScript strict、Biome、Vitest、Playwright、MSW、Knip、syncpack、Lefthook、Renovate 和 GitHub Actions。

## 2. What This Template Is Not

本模板不是产品框架，不替你决定业务数据库、部署平台、生产监控、鉴权、ORM、队列、云服务或发布策略。

它也不默认配置 SSR、Next.js、NestJS、Docker 或生产 release workflow。这些都是复制后的实例项目要按具体问题决定的对象，不属于母版默认层。

## 3. Prerequisites

Use Node 24 and pnpm 10. The repository declares:

```json
{
  "packageManager": "pnpm@10.33.0",
  "engines": {
    "node": ">=24.0.0",
    "pnpm": ">=10.0.0"
  }
}
```

Recommended setup:

```bash
corepack enable
pnpm --version
node --version
```

If `pnpm` is managed by Corepack, keep using Corepack. Do not mix npm, Yarn, Bun install, and pnpm in the same copy of this template.

## 4. First Run

From the repository root:

```bash
pnpm install
pnpm check
pnpm check:full
```

`pnpm check` is the normal local gate. `pnpm check:full` is the full CI-level gate and should pass before treating the template copy as healthy.

## 5. Repository Layout

```text
apps/         runnable samples shipped with the mother template
packages/     shared packages used by apps, templates, and experiments
templates/    copy sources for future projects
experiments/  generated experiments created from templates
docs/         governance, decisions, quality gates, and template notes
scripts/      repository maintenance scripts
```

The structure intentionally contains both `apps/` and `templates/`. `apps/` proves the stack works in real runnable samples. `templates/` proves new projects can be copied from stable sources.

## 6. Choosing a Template

Use this table to choose the starting point:

| Goal | Template | Command |
| :--- | :--- | :--- |
| React SPA, UI demo, visualization, frontend tool | `react-spa` | `pnpm create:experiment react-spa <name>` |
| Hono API, webhook, backend service | `hono-api` | `pnpm create:experiment hono-api <name>` |
| React client plus Hono API with shared contracts | `fullstack` | `pnpm create:experiment fullstack <name>` |
| Node command line tool | `node-cli` | `pnpm create:experiment node-cli <name>` |
| Reusable TypeScript package | `ts-lib` | `pnpm create:experiment ts-lib <name>` |

Choose the smallest template that matches the object. Do not start from `fullstack` if the work is only a CLI. Do not start from `react-spa` if the work is only an API. The template boundary prevents dependency pollution.

## 7. Creating an Experiment

Run:

```bash
pnpm create:experiment react-spa ui-demo
```

The script copies `templates/react-spa` to `experiments/ui-demo` and rewrites the package name to:

```text
@ts-foundry-experiment/ui-demo
```

The script excludes generated artifacts:

```text
node_modules/
.turbo/
dist/
coverage/
playwright-report/
test-results/
```

The generated experiment is part of the pnpm workspace because `pnpm-workspace.yaml` includes `experiments/*`.

## 8. Working on a Frontend Experiment

Create the experiment:

```bash
pnpm create:experiment react-spa table-demo
```

Run checks for the workspace:

```bash
pnpm check
```

Run the frontend package directly when needed:

```bash
pnpm --filter @ts-foundry-experiment/table-demo dev
pnpm --filter @ts-foundry-experiment/table-demo test
pnpm --filter @ts-foundry-experiment/table-demo e2e
```

The React SPA template includes TanStack Router, TanStack Query, React Hook Form, Zod, Tailwind CSS v4, Motion, MSW, Testing Library, Vitest, and Playwright. It is meant for browser UI work, not backend services.

## 9. Working on a Backend API Experiment

Create the experiment:

```bash
pnpm create:experiment hono-api webhook-demo
```

Run checks:

```bash
pnpm --filter @ts-foundry-experiment/webhook-demo typecheck
pnpm --filter @ts-foundry-experiment/webhook-demo test
pnpm --filter @ts-foundry-experiment/webhook-demo build
```

The Hono API template includes `/health`, `/items`, `/items/:id`, and `POST /items` examples. Request and response boundaries are expressed with Zod contracts. It does not include React, Tailwind, Playwright, database code, or deployment config.

## 10. Working on a Fullstack Experiment

Create the experiment:

```bash
pnpm create:experiment fullstack contract-demo
```

Use this template when the frontend and backend should move together and share contracts. The client uses React/Vite. The server uses Hono. Both sides parse API data through Zod schemas.

This is not an SSR template. It is a clear frontend/API boundary template inside one workspace.

## 11. Working on a CLI Experiment

Create the experiment:

```bash
pnpm create:experiment node-cli rename-files
```

The CLI template uses Node 24, TypeScript, tsx, tsdown, and Vitest. It demonstrates text output, JSON output, argument errors, exit behavior, and ESM bin output.

Do not add frontend dependencies to CLI projects unless the CLI truly renders UI through a terminal UI library. React, Hono, Tailwind, and browser testing are not CLI defaults.

## 12. Working on a Library Experiment

Create the experiment:

```bash
pnpm create:experiment ts-lib text-utils
```

The library template uses tsdown to output ESM and type declarations. It includes Vitest tests and package boundary checks through publint and arethetypeswrong.

Use this template for SDKs, pure utilities, reusable packages, or code that may later move into `packages/`.

## 13. Dependency Rules

Versions are centralized in `pnpm-workspace.yaml` catalog. Shared dependencies in package manifests should use:

```json
"react": "catalog:"
```

Do not copy raw versions across packages. `syncpack lint` checks that package manifests obey the catalog. `pnpm-lock.yaml` records the resolved install state.

Dependency placement rules:

- Root devDependencies are for repository-wide tools.
- App dependencies belong to the app that runs them.
- Template dependencies belong to copied projects.
- Shared package dependencies must be required by that shared package's public behavior.
- React and Tailwind stay out of pure backend, CLI, and library packages.

## 14. Quality Gates

Use these commands:

| Command | Meaning |
| :--- | :--- |
| `pnpm lint` | Biome check |
| `pnpm format` | Biome write mode |
| `pnpm typecheck` | Turbo-dispatched TypeScript checks |
| `pnpm test` | Turbo-dispatched Vitest tests |
| `pnpm test:coverage` | Vitest coverage |
| `pnpm build` | Turbo-dispatched builds |
| `pnpm e2e` | Playwright browser paths |
| `pnpm deps:check` | Knip and syncpack |
| `pnpm check` | local default gate |
| `pnpm check:full` | full CI-level gate |

Run `pnpm check:full` after changing root config, workspace dependencies, templates, shared packages, CI, hooks, or scripts.

## 15. Large Command Output

Some repository commands intentionally produce large output. Any command that fans out through Turbo, runs coverage, starts browsers, builds many packages, watches files, audits dependencies, or reproduces CI can print hundreds or thousands of lines.

When a command may produce large output, redirect it to a local temporary log instead of dumping the full transcript into the terminal or chat:

```bash
mkdir -p tmp/logs
pnpm check:full > tmp/logs/check-full-$(date +%Y%m%d-%H%M%S).log 2>&1
```

Then inspect the log with targeted commands:

```bash
tail -80 tmp/logs/check-full-*.log
rg "No issues found|Tasks:|failed|error|ERR|ELIFECYCLE" tmp/logs/check-full-*.log
```

The rule is simple: keep the raw log on disk, then search and summarize the evidence.

### Commands That Should Usually Be Logged

Use log redirection by default for these commands:

| Command | Why it can be large | Suggested log |
| :--- | :--- | :--- |
| `pnpm check:full` | Runs lint, typecheck, coverage, build, e2e, and dependency checks across the workspace | `tmp/logs/check-full-<timestamp>.log` |
| `pnpm check` | Runs lint, typecheck, and tests across many packages | `tmp/logs/check-<timestamp>.log` |
| `pnpm build` | Turbo replays or prints build logs for all buildable packages; Vite and tsdown can be verbose | `tmp/logs/build-<timestamp>.log` |
| `pnpm typecheck` | Turbo can print one TypeScript task per workspace package; failures can include long diagnostics | `tmp/logs/typecheck-<timestamp>.log` |
| `pnpm test` | Vitest output grows with package count and failure detail | `tmp/logs/test-<timestamp>.log` |
| `pnpm test:coverage` | Coverage tables are printed for every tested package | `tmp/logs/test-coverage-<timestamp>.log` |
| `pnpm e2e` | Starts Vite servers and Playwright; browser failures can include long reports | `tmp/logs/e2e-<timestamp>.log` |
| `pnpm deps:check` | Knip and syncpack can print long dependency, file, and catalog reports | `tmp/logs/deps-check-<timestamp>.log` |
| `pnpm install` | Install resolution, peer warnings, lifecycle output, and lockfile changes can be long | `tmp/logs/install-<timestamp>.log` |
| `pnpm release` | Changesets and npm publishing output can be long and high-stakes | `tmp/logs/release-<timestamp>.log` |

### Package-Level Commands With Large Output Risk

Use the same pattern when running these through `pnpm --filter ...`:

| Command shape | Why it can be large |
| :--- | :--- |
| `pnpm --filter <pkg> build` | Vite and tsdown print bundle output; Vite may print chunk warnings |
| `pnpm --filter <pkg> test` | Vitest failure output can include DOM snapshots, diffs, stack traces, and mock traces |
| `pnpm --filter <pkg> test:coverage` | Coverage tables are always printed |
| `pnpm --filter <pkg> e2e` | Playwright starts servers and can emit browser traces, screenshots, and reports |
| `pnpm --filter <pkg> pack:check` | `publint` and `arethetypeswrong` can print package boundary reports |

### Long-Running Commands

Do not redirect persistent watch or dev servers unless you deliberately want a server log:

| Command shape | Handling rule |
| :--- | :--- |
| `pnpm dev` | Long-running Turbo dev task; run in an interactive terminal or supervised background session |
| `pnpm --filter <pkg> dev` | Vite dev server, tsdown watch, or tsx watch; keep the terminal visible while developing |
| `tsdown --watch` | Watcher output can grow over time; stop it when finished |
| `tsx watch ...` | Watcher output can grow over time; stop it when finished |
| `vite --host ...` | Dev server output is persistent; only log it when debugging server startup |

### Commands That Usually Do Not Need Logs

These commands are normally small enough to run directly, unless the repository is already known to be noisy:

| Command | Reason |
| :--- | :--- |
| `pnpm lint` | Biome is concise when clean |
| `pnpm format` | Biome write mode is concise when clean |
| `pnpm clean` | Removes generated files and prints little output |
| `pnpm create:experiment <template> <name>` | Prints only the created target path |
| `pnpm changeset` | Interactive command; use directly |

### Reusable Log Pattern

For a one-off large command:

```bash
mkdir -p tmp/logs
log="tmp/logs/<name>-$(date +%Y%m%d-%H%M%S).log"
<command> > "$log" 2>&1
tail -80 "$log"
rg "No issues found|Tasks:|passed|failed|error|ERR|ELIFECYCLE|warning" "$log"
```

For example:

```bash
mkdir -p tmp/logs
log="tmp/logs/e2e-$(date +%Y%m%d-%H%M%S).log"
pnpm e2e > "$log" 2>&1
tail -80 "$log"
rg "passed|failed|error|ERR|ELIFECYCLE" "$log"
```

`tmp/` is ignored by Git. Do not commit local command logs.

## 16. Generated Files

These are generated artifacts:

```text
node_modules/
.turbo/
dist/
coverage/
playwright-report/
test-results/
tmp/
```

They are ignored by Git and excluded from template copying.

`public/mockServiceWorker.js` is also generated, but it is required for frontend templates that use MSW in the browser. Keep it in `apps/web/public` and `templates/react-spa/public`.

## 17. Promoting Experiments

Most work starts in `experiments/`. Promote only when the object becomes stable:

- Promote a stable application to `apps/`.
- Promote reusable source code to `packages/`.
- Promote a reusable starting point to `templates/`.

Before promotion, confirm:

- package name is correct;
- dependency direction is clean;
- scripts follow the task protocol;
- no generated artifacts are copied;
- `pnpm check:full` passes.

## 18. Using This as a GitHub Template

After pushing to GitHub, mark the repository as a template:

```bash
gh repo edit --template
```

If creating the remote with GitHub CLI:

```bash
gh repo create ts-foundry-template \
  --public \
  --description "Modern TypeScript monorepo template for frontend, backend, fullstack, CLI, and library experiments" \
  --source=. \
  --remote=origin \
  --push

gh repo edit --template
```

The repository should be public and licensed under Apache-2.0. The root package remains `private: true` to prevent accidental npm publication of the whole monorepo.

## 19. Updating Dependencies

Renovate is configured for grouped dependency updates. When updating manually:

1. Change versions in `pnpm-workspace.yaml` catalog.
2. Run `pnpm install`.
3. Run `pnpm deps:check`.
4. Run `pnpm check:full`.

Do not update the same dependency independently in multiple package manifests.

## 20. Adding a New Template

Only add a new template when it represents a repeatable project object. A one-off experiment belongs in `experiments/`.

When adding a template:

1. Create `templates/<name>`.
2. Give it `package.json`, `tsconfig.json`, tests, and build scripts.
3. Add it to the workspace if needed.
4. Update `scripts/create-experiment.ts`.
5. Update `README.md`, `GUIDE.md`, and docs.
6. Run `pnpm check:full`.

Do not add database, deployment, SSR, or production infrastructure templates to this mother template unless the object boundary is deliberately changed.

## 21. Troubleshooting

If `pnpm install` fails, check Node and pnpm versions first.

If `syncpack lint` fails, a package probably uses a raw version where `catalog:` is expected.

If Knip reports generated files, check `knip.json` ignore rules and `.gitignore`.

If Playwright fails because a server is not ready, inspect the package e2e script and port. The React SPA template uses Vite dev server for e2e because MSW browser behavior is part of the path being verified.

If Vite reports a chunk size warning during build, treat it as a warning unless the command exits non-zero. The frontend hello world intentionally pulls together several real frontend libraries to prove the default stack works.

## 22. Read the Stable Docs

For deeper rules, read:

- [docs/工程治理约定.md](./docs/工程治理约定.md)
- [docs/技术选型记录.md](./docs/技术选型记录.md)
- [docs/环境配置清单.md](./docs/环境配置清单.md)
- [docs/质量门禁.md](./docs/质量门禁.md)
- [docs/项目模板说明.md](./docs/项目模板说明.md)
