# TS Foundry Agent Notes

- 这个仓库是 TypeScript 工程母版，不是业务产品仓库。
- 新实验默认放入 `experiments/`，不要把一次性实验放在根目录。
- 成形应用放入 `apps/`，可复用包放入 `packages/`，可复制起点放入 `templates/`。
- `packages/*` 不得依赖 `apps/*` 或 `experiments/*`。
- 纯后端和 CLI 不引入 React、Tailwind 或浏览器测试依赖。
- 前端和 fullstack 默认使用 React、Vite、TanStack Router/Query、React Hook Form、Zod、Tailwind CSS v4、shadcn/ui、`@ts-foundry/ui`、Motion。
- shadcn/ui 基础组件归属于 `packages/ui`；app/template 只放 app-specific 组合组件，不复制共享基础组件。
- 修改前端 UI foundation 时必须遵守 `docs/TS Foundry Frontend UI Foundation 设计文档.md`。
- 后端默认使用 Hono、Zod、Web Standard Request/Response。
- 包管理只使用 `pnpm`，任务编排只使用 Turborepo。
- 格式化和 lint 只使用 Biome；不要默认新增 ESLint、Prettier 或 Jest。
- 新增模板必须有 `package.json`、`tsconfig.json`、`typecheck`、`test`、`build` 脚本和可运行 hello world。
- 新增工程治理工具必须更新 `docs/`、根脚本和 CI。
- 完成改动前运行与改动范围匹配的验证命令；声称完成前至少运行 `pnpm check`。
