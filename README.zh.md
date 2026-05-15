# TS Foundry Template

[English](./README.md) | 中文

[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D24-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![pnpm](https://img.shields.io/badge/pnpm-%3E%3D10-F69220?logo=pnpm&logoColor=white)](https://pnpm.io)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Biome](https://img.shields.io/badge/formatter-Biome-60A5FA?logo=biome&logoColor=white)](https://biomejs.dev)

一个开箱即用的 TypeScript monorepo 工程母版，适用于前端、后端、全栈、CLI 和库类实验项目。

它解决的不是某个业务功能，而是每次启动新 TypeScript 项目时反复出现的工程决策：目录结构、任务编排、类型收口、测试组织、lint 规范、依赖治理、模板复制——以及"什么算完成"。

> **不是**框架，不是产品，不是部署方案。
> 它是一个工程母版：复制它，创建实验，构建真实项目。

---

## 目录

- [快速开始](#快速开始)
- [模板一览](#模板一览)
- [目录结构](#目录结构)
- [内置包](#内置包)
- [常用命令](#常用命令)
- [质量门禁](#质量门禁)
- [作为 GitHub 模板使用](#作为-github-模板使用)
- [非目标范围](#非目标范围)
- [文档](#文档)
- [许可证](#许可证)

## 快速开始

**前置条件：** Node >= 24，pnpm >= 10（通过 Corepack 管理）。

```bash
corepack enable
pnpm install
pnpm check          # 本地质量门禁
pnpm check:full     # CI 级质量门禁
```

从模板创建实验：

```bash
pnpm create:experiment react-spa ui-demo
pnpm create:experiment hono-api api-demo
pnpm create:experiment fullstack contract-demo
pnpm create:experiment node-cli rename-files
pnpm create:experiment ts-lib text-utils
```

完整工作流请阅读 [GUIDE.md](./GUIDE.md)。

## 模板一览

每个模板是面向特定项目形态的可复制起点。选择最小的匹配项。

| 目标 | 模板 | 命令 |
| :--- | :--- | :--- |
| React SPA、UI 演示、前端工具 | `react-spa` | `pnpm create:experiment react-spa <name>` |
| Hono API、Webhook、后端服务 | `hono-api` | `pnpm create:experiment hono-api <name>` |
| React + Hono 全栈（共享合约） | `fullstack` | `pnpm create:experiment fullstack <name>` |
| Node CLI 工具 | `node-cli` | `pnpm create:experiment node-cli <name>` |
| 可复用 TypeScript 库 | `ts-lib` | `pnpm create:experiment ts-lib <name>` |

## 目录结构

```text
apps/           可运行的示例应用，证明技术栈可用
packages/       共享包，供 apps、templates 和 experiments 使用
templates/      模板源，用于复制创建新项目
experiments/    生成的实验项目（由脚本创建）
docs/           治理约定、技术决策、质量门禁、模板说明
scripts/        仓库维护脚本
```

## 内置包

### 应用（可运行示例）

| 应用 | 技术栈 |
| :--- | :--- |
| `apps/web` | React + Vite SPA |
| `apps/api` | Hono API |
| `apps/fullstack` | React + Hono + 共享合约 |

### 共享包

| 包 | 用途 |
| :--- | :--- |
| `packages/ui` | 基于 shadcn/ui 的组件库，Tailwind CSS v4 token，主题支持 |
| `packages/contracts` | Zod schema 和共享 API 合约 |
| `packages/utils` | 运行时无关的 TypeScript 工具函数 |
| `packages/node-utils` | Node 专用工具函数 |
| `packages/test-utils` | Faker 和 MSW 测试辅助工具 |
| `packages/tsconfig` | 共享 TypeScript 配置预设 |

## 常用命令

### 工作区级别

| 命令 | 用途 |
| :--- | :--- |
| `pnpm dev` | 运行开发任务 |
| `pnpm build` | 构建所有包 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint` | Biome 检查 |
| `pnpm format` | Biome 自动修复 |
| `pnpm test` | Vitest 测试 |
| `pnpm test:coverage` | Vitest 覆盖率 |
| `pnpm e2e` | Playwright 测试 |
| `pnpm deps:check` | Knip + syncpack |
| `pnpm check` | 本地质量门禁 |
| `pnpm check:full` | CI 级质量门禁 |
| `pnpm clean` | 清理生成产物 |
| `pnpm create:experiment` | 从模板创建实验 |
| `pnpm changeset` | 创建变更集 |
| `pnpm release` | 版本发布 |

### 包级别

```bash
pnpm --filter <package-name> dev
pnpm --filter <package-name> test
pnpm --filter <package-name> build
```

## 质量门禁

| 门禁 | 执行内容 |
| :--- | :--- |
| `pnpm check` | lint + typecheck + test |
| `pnpm check:full` | lint + typecheck + test:coverage + build + e2e + deps:check + pack:check + smoke:create-experiment |

修改根配置、工作区依赖、模板、共享包、CI、hooks 或脚本后，运行 `pnpm check:full`。

## 作为 GitHub 模板使用

推送到 GitHub 后，将仓库标记为模板：

```bash
gh repo edit --template
```

或一步创建远程仓库：

```bash
gh repo create ts-foundry-template \
  --public \
  --source=. \
  --remote=origin \
  --push
gh repo edit --template
```

## 非目标范围

本模板**不**包含：

- 数据库、ORM、消息队列
- 部署、Docker、云基础设施
- SSR、Next.js、NestJS
- 认证与鉴权
- 生产发布工作流

这些属于从本模板创建的具体项目按需决定的范畴。

## 文档

| 文档 | 内容 |
| :--- | :--- |
| [GUIDE.md](./GUIDE.md) | 完整用户指南 |
| [工程治理约定](./docs/工程治理约定.md) | 仓库治理规则 |
| [技术选型记录](./docs/技术选型记录.md) | 技术选型依据 |
| [环境配置清单](./docs/环境配置清单.md) | 环境与工具链配置 |
| [质量门禁](./docs/质量门禁.md) | 门禁定义与 CI |
| [项目模板说明](./docs/项目模板说明.md) | 各模板详细说明 |
| [UI Foundation 设计文档](./docs/TS%20Foundry%20Frontend%20UI%20Foundation%20设计文档.md) | 前端 UI 基础层设计 |

## 许可证

[Apache-2.0](./LICENSE)
