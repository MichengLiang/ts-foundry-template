# TS Foundry Frontend UI Foundation 设计文档

## 0. 文档身份

本文定义 `ts-foundry-template` 接入 shadcn/ui 后的前端 UI foundation。本文不是调研记录，不是提案，不是可选路线集合。本文是当前母版前端层的实现规格。

本文服务对象是后续开发者。开发者按照本文执行时，不需要重新判断 shadcn/ui 是否应进入母版，不需要重新判断组件归属，不需要重新判断 dark mode 是否属于当前交付，不需要重新判断哪些模板应接入 UI foundation。本文已经给出对象边界、文件边界、依赖边界、组件集合、样式归属、测试归属、文档归属和质量门禁。

## 1. 当前问题情境

`ts-foundry-template` 是 TypeScript 工程母版。它覆盖五类启动对象：React frontend application、Hono backend API、React + Hono fullstack application、Node CLI、TypeScript library。母版的职责是把重复出现的工程决策固化为可复制、可验证、可长期维护的默认工作区。

当前前端默认栈已经明确：React、Vite、TanStack Router、TanStack Query、React Hook Form、Zod、Tailwind CSS v4、Motion、MSW、Testing Library、Vitest、Playwright。这个栈可以证明路由、请求、表单、schema、样式、mock、测试和浏览器路径成立。

当前缺口在 UI foundation。`packages/ui` 只包含一个 `Button.tsx`，并且该组件依赖下游 app CSS 中的 `.tsf-button`、`.tsf-button-primary`、`.tsf-button-secondary` 类。这个结构只能证明 workspace package 能被 React app 导入，不能承担前端模板的设计系统职责。

当前 `apps/web` 与 `templates/react-spa` 手写了表单、列表、卡片边框、按钮样式和错误状态。`apps/fullstack` 与 `templates/fullstack-hono-react` 又手写另一套 Tailwind 结构，没有消费 `@ts-foundry/ui`。这造成三个问题：

1. 组件语义不归属于共享 UI 包。
2. 样式 token 与组件变体散落在 app/template 中。
3. 复制出的前端实验没有一个稳定的、可修改的、现代审美的 UI 起点。

因此，当前母版需要补充一个前端 UI foundation。

## 2. 设计对象

设计对象名称：`TS Foundry Frontend UI Foundation`。

设计对象归属：`packages/ui` 为共享 UI package；`apps/web`、`apps/fullstack`、`templates/react-spa`、`templates/fullstack-hono-react` 为消费方和验证方。

设计对象来源：shadcn/ui registry 源码模式。

设计对象职责：为 React SPA 与 fullstack React 模板提供可复制、可修改、可验证的基础 UI 组件、样式 token、主题能力和交互 primitives。

设计对象不是业务页面系统，不是后台管理系统，不是 chart/dashboard/template gallery，不是全组件库镜像，不是 API/CLI/library 模板依赖。

## 3. 核心结论

`@ts-foundry/ui` 必须升级为 shadcn/ui 驱动的共享 UI foundation。

该 foundation 必须包含：

1. shadcn/ui monorepo `components.json` 坐标。
2. `packages/ui/src/components/*` 共享组件源码。
3. `packages/ui/src/lib/utils.ts` 中的 `cn` 工具。
4. `packages/ui/src/hooks/*` 中的共享前端 hooks。
5. `packages/ui/src/styles/globals.css` 中的 Tailwind v4、shadcn token、light/dark variables、animation import。
6. `packages/ui/package.json` 中的 subpath exports。
7. 前端 app/template 对 `@ts-foundry/ui/styles.css` 的导入。
8. 前端 app/template 对 `@ts-foundry/ui/components/*` 的消费。
9. light/dark theme provider 和 mode toggle。
10. Vitest component tests。
11. Playwright browser path checks。
12. README、GUIDE、AGENTS 和 docs 的同步说明。
13. `pnpm check:full` 级别的验证证据。

## 4. 非目标边界

以下对象不属于本次 UI foundation：

1. `templates/hono-api` 不接入 React、Tailwind、shadcn/ui 或 browser tests。
2. `templates/node-cli` 不接入 React、Tailwind、shadcn/ui 或 browser tests。
3. `templates/ts-lib` 不接入 React、Tailwind、shadcn/ui 或 browser tests。
4. `packages/contracts` 不依赖 `packages/ui`。
5. `packages/utils` 不依赖 `packages/ui`。
6. `packages/node-utils` 不依赖 `packages/ui`。
7. `calendar` 不进入 foundation，因为当前母版没有日期选择对象。
8. `chart` 不进入 foundation，因为当前母版没有数据可视化对象。
9. `command` 不进入 foundation，因为当前母版没有命令面板或全局搜索对象。
10. `sidebar` 不进入 foundation，因为当前母版不是 dashboard/admin shell 模板。
11. 复杂 `data-table` block 不进入 foundation，因为它包含排序、过滤、分页、列状态、数据模型等业务组合职责。
12. shadcn blocks 不整体导入。foundation 只接收基础组件，不接收页面级 block。

这些排除项是当前对象边界，不是后续待决事项。

## 5. 目标文件结构

目标结构如下：

```text
packages/ui/
├── components.json
├── package.json
├── README.md
├── src/
│   ├── components/
│   │   ├── alert.tsx
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   └── tooltip.tsx
│   ├── hooks/
│   │   └── use-mobile.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── styles/
│   │   └── globals.css
│   ├── theme-provider.tsx
│   ├── mode-toggle.tsx
│   └── index.ts
├── playground/
│   ├── index.html
│   └── src/
│       ├── App.tsx
│       ├── index.tsx
│       └── style.css
├── tsconfig.json
├── tsdown.config.ts
├── vite.config.ts
└── vitest.config.ts
```

前端 app/template 目标结构如下：

```text
apps/web/
├── components.json
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── router.tsx

apps/fullstack/
├── components.json
└── src/
    ├── App.tsx
    ├── index.css
    └── main.tsx

templates/react-spa/
├── components.json
└── src/
    ├── App.tsx
    ├── index.css
    ├── main.tsx
    └── router.tsx

templates/fullstack-hono-react/
├── components.json
└── src/
    ├── App.tsx
    ├── index.css
    └── main.tsx
```

## 6. 组件集合

foundation 组件集合由当前前端模板职责推出。组件集合不是 shadcn 菜单的任意摘录，也不是阶段性残缺集合。

### 6.1 动作组件

`button` 必须进入 foundation。

职责：提交表单、触发主题切换、打开弹层、执行列表动作。

当前替换对象：`packages/ui/src/Button.tsx` 和 app/template 中手写按钮样式。

### 6.2 输入与表单组件

`input`、`textarea`、`label`、`form`、`select`、`checkbox`、`switch` 必须进入 foundation。

职责：覆盖 React Hook Form + Zod 路径中的文本输入、长文本输入、标签、字段错误、选择输入、布尔输入和开关输入。

当前模板已经有创建 item 的表单。foundation 必须让该表单不再手写输入框和错误样式。

### 6.3 内容与状态组件

`card`、`badge`、`separator`、`alert`、`skeleton` 必须进入 foundation。

职责：覆盖页面区块、列表项、状态标签、视觉分隔、错误反馈、加载占位。

当前模板已经有列表、详情、loading、error。foundation 必须让这些状态拥有一致的 UI 表达。

### 6.4 弹层与菜单组件

`dialog`、`dropdown-menu`、`sheet`、`tooltip` 必须进入 foundation。

职责：覆盖确认弹层、操作菜单、移动端/窄屏工具面板、图标按钮提示。

这些组件不是业务功能，而是现代前端工具与实验页面的基础交互面。它们属于 foundation。

### 6.5 局部导航组件

`tabs` 必须进入 foundation。

职责：覆盖同一对象的多视图切换，例如 overview/detail/settings 或 preview/source/logs。

`tabs` 是基础组件，不是 dashboard 架构。

### 6.6 通知组件

`sonner` 必须进入 foundation。

职责：覆盖表单提交、创建成功、创建失败、操作反馈。

当前 `react-spa` 创建 item 后只重置表单并 invalidate query。foundation 应让创建成功或失败具备用户可见反馈。

### 6.7 主题组件

`theme-provider` 和 `mode-toggle` 必须进入 foundation。

职责：证明 light/dark token 工作，提供模板默认主题切换方式。

`theme-provider` 可以基于 `next-themes`。`mode-toggle` 使用 `Button`、`DropdownMenu` 和 lucide icons。

## 7. 依赖归属

所有版本必须进入 `pnpm-workspace.yaml` 的 catalog。workspace package 中不得写 raw version。

### 7.1 `packages/ui` dependencies

`packages/ui` 应新增以下 runtime dependencies：

```json
{
  "@radix-ui/react-checkbox": "catalog:",
  "@radix-ui/react-dialog": "catalog:",
  "@radix-ui/react-dropdown-menu": "catalog:",
  "@radix-ui/react-label": "catalog:",
  "@radix-ui/react-select": "catalog:",
  "@radix-ui/react-separator": "catalog:",
  "@radix-ui/react-slot": "catalog:",
  "@radix-ui/react-switch": "catalog:",
  "@radix-ui/react-tabs": "catalog:",
  "@radix-ui/react-tooltip": "catalog:",
  "class-variance-authority": "catalog:",
  "clsx": "catalog:",
  "lucide-react": "catalog:",
  "next-themes": "catalog:",
  "sonner": "catalog:",
  "tailwind-merge": "catalog:",
  "tw-animate-css": "catalog:"
}
```

`react` 和 `react-dom` 保持 peerDependencies，同时作为 devDependencies 存在于 `packages/ui` 以支持测试和 playground。

### 7.2 前端 app/template dependencies

`apps/web`、`apps/fullstack`、`templates/react-spa`、`templates/fullstack-hono-react` 继续依赖：

```json
{
  "@ts-foundry/ui": "workspace:*"
}
```

这些 app/template 不直接依赖 Radix、CVA、clsx、tailwind-merge、lucide、sonner、next-themes，除非 app 自己引入 app-only 组件并直接使用这些包。基础 UI 依赖归属于 `packages/ui`。

### 7.3 `knip.json`

如果 `tw-animate-css` 仅通过 CSS import 被消费且 Knip 无法识别，应在 `knip.json` 的 `ignoreDependencies` 中加入 `tw-animate-css`。只有出现实际误报时添加；不提前扩大 ignore 面。

## 8. `packages/ui/package.json` exports

`packages/ui/package.json` 必须支持 subpath exports。

目标 exports：

```json
{
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./lib/*": "./src/lib/*.ts",
    "./styles.css": "./src/styles/globals.css",
    "./theme-provider": "./src/theme-provider.tsx",
    "./mode-toggle": "./src/mode-toggle.tsx"
  },
  "sideEffects": [
    "./src/styles/globals.css"
  ]
}
```

说明：当前仓库内消费以 source exports 为准，符合现有 `packages/ui` 的源码消费习惯。`tsdown` 仍保留 build 能力，用于证明 package 可构建。

## 9. `components.json` 规格

### 9.1 `packages/ui/components.json`

`packages/ui/components.json` 负责共享组件生成坐标。

目标内容：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@ts-foundry/ui/components",
    "utils": "@ts-foundry/ui/lib/utils",
    "ui": "@ts-foundry/ui/components",
    "lib": "@ts-foundry/ui/lib",
    "hooks": "@ts-foundry/ui/hooks"
  },
  "iconLibrary": "lucide"
}
```

`style`、`baseColor` 和 `iconLibrary` 是母版默认值。不得在不同 app/template 中使用不同 style 或 base color。

### 9.2 app/template `components.json`

`apps/web`、`apps/fullstack`、`templates/react-spa`、`templates/fullstack-hono-react` 均应包含 `components.json`。

目标内容模板：

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "./src/components",
    "utils": "@ts-foundry/ui/lib/utils",
    "ui": "@ts-foundry/ui/components",
    "lib": "./src/lib",
    "hooks": "./src/hooks"
  },
  "iconLibrary": "lucide"
}
```

app/template 的 `ui` alias 指向共享 UI package。app/template 的 `components`、`lib`、`hooks` alias 保留给 app-only 组合组件和局部工具。基础组件不生成到 app/template 的 `src/components/ui`。

## 10. CSS 与 Tailwind v4

### 10.1 UI package globals

`packages/ui/src/styles/globals.css` 是 foundation 样式入口。

它必须包含：

1. `@import "tailwindcss";`
2. `@import "tw-animate-css";`
3. shadcn CSS variables。
4. `.dark` token。
5. `@theme inline` token mapping。
6. `@layer base` 的 `body`、border、outline、background、foreground 基础规则。

该文件是 UI token 的归属点。app/template 不再定义 `.tsf-button` 类。

### 10.2 app/template CSS

`apps/web/src/index.css`、`apps/fullstack/src/index.css`、`templates/react-spa/src/index.css`、`templates/fullstack-hono-react/src/index.css` 必须导入 UI globals。

目标结构：

```css
@import "@ts-foundry/ui/styles.css";
@source "../../../packages/ui/src";

:root {
	font-family:
		Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
		"Segoe UI", sans-serif;
}

body {
	margin: 0;
	min-width: 320px;
}
```

`@source "../../../packages/ui/src";` 用于确保 Tailwind v4 扫描 workspace UI package 源码。该相对路径对 `apps/*/src/index.css`、`templates/*/src/index.css` 和 `experiments/*/src/index.css` 都指向 repo root 下的 `packages/ui/src`。

### 10.3 删除旧 CSS 类

以下类必须删除：

```css
.tsf-button
.tsf-button-primary
.tsf-button-secondary
```

按钮样式由 shadcn `button.tsx` 的 variants 和 Tailwind token 承担。

## 11. Theme provider

`packages/ui/src/theme-provider.tsx` 提供主题上下文。

目标行为：

1. 支持 `defaultTheme="system"`。
2. 支持 `storageKey="ts-foundry-theme"`。
3. 支持 `enableSystem`。
4. 不包含业务文案。
5. 只包装 children。

`apps/web/src/App.tsx`、`apps/fullstack/src/App.tsx`、`templates/react-spa/src/App.tsx`、`templates/fullstack-hono-react/src/App.tsx` 应在 root provider 层加入 `ThemeProvider`。

React SPA provider 顺序：

```tsx
<ThemeProvider defaultTheme="system" storageKey="ts-foundry-theme">
	<QueryClientProvider client={queryClient}>
		<RouterProvider router={router} />
	</QueryClientProvider>
</ThemeProvider>
```

Fullstack provider 顺序：

```tsx
<ThemeProvider defaultTheme="system" storageKey="ts-foundry-theme">
	<QueryClientProvider client={queryClient}>
		<FullstackHome />
	</QueryClientProvider>
</ThemeProvider>
```

## 12. Mode toggle

`packages/ui/src/mode-toggle.tsx` 提供主题切换按钮。

目标行为：

1. 使用 `Button`。
2. 使用 `DropdownMenu`。
3. 使用 lucide `Sun`、`Moon` 图标。
4. 提供 Light、Dark、System 三个选项。
5. 图标按钮有 accessible label。
6. 不包含业务文案之外的说明文字。

`RootLayout` 或页面 header 必须展示 `ModeToggle`，以证明 theme provider、dropdown-menu、button、icon、dark token 的组合路径成立。

## 13. React SPA 样例改造

目标文件：

1. `apps/web/src/router.tsx`
2. `templates/react-spa/src/router.tsx`

两者应保持结构一致。

### 13.1 Root layout

`RootLayout` 使用 `ModeToggle`，header 使用 border/background token。

目标行为：

1. 页面有主容器。
2. header 左侧为首页 Link。
3. header 右侧为 `ModeToggle`。
4. 内容区域由 `Outlet` 渲染。

### 13.2 Home page

`HomePage` 使用 shadcn components：

1. `Card` 包裹创建表单。
2. `Form` 集成 React Hook Form 与 Zod resolver。
3. `FormField`、`FormItem`、`FormLabel`、`FormControl`、`FormMessage` 渲染输入字段。
4. `Input` 替代原生 input。
5. `Button` 提交。
6. `Skeleton` 表示 loading。
7. `Alert` 表示 error。
8. `Badge` 表示 item id 或状态。
9. `sonner` 在创建成功后显示 toast。
10. `motion.section` 保留，继续证明 Motion 默认栈。

### 13.3 Item page

`ItemPage` 使用 `Card`、`Badge`、`Button` 或 Link class，避免手写孤立视觉风格。

### 13.4 Toaster

`App.tsx` 或 root layout 应加入 `Toaster`。

位置建议：`App.tsx` 在 provider 内渲染 `<Toaster />`，避免每个 route 重复。

## 14. Fullstack 样例改造

目标文件：

1. `apps/fullstack/src/App.tsx`
2. `templates/fullstack-hono-react/src/App.tsx`

两者应保持结构一致。

目标行为：

1. 使用 `ThemeProvider`。
2. 页面 header 展示标题和 `ModeToggle`。
3. 使用 `Card` 展示 contract hello world。
4. 使用 `Skeleton` 展示加载状态。
5. 使用 `Alert` 展示错误状态。
6. 使用 `Badge` 或 `Separator` 展示列表项结构。
7. 保留 `ItemListResponseSchema.parse`，继续证明 shared Zod contract。

fullstack 模板不需要 TanStack Router、React Hook Form 或 Motion，除非当前模板职责已经需要。它只需要证明 Hono API + React + contracts + UI foundation 的组合路径。

## 15. `packages/ui` playground

当前 playground 使用 Vite 默认 CSS，视觉上与母版 UI foundation 无关。必须改造。

目标行为：

1. `playground/src/style.css` 导入 `../../src/styles/globals.css` 或 `@ts-foundry/ui/styles.css`。
2. `playground/src/App.tsx` 展示 Button、Input、Card、Badge、Alert、Dialog、DropdownMenu、Tabs、Switch、Toaster、ModeToggle。
3. playground 不承载业务样例，只证明基础组件可渲染。
4. playground 不需要 Playwright e2e，Vitest component tests 和 app e2e 已覆盖质量门禁。

## 16. 测试要求

### 16.1 `packages/ui` tests

`packages/ui/src/Button.test.tsx` 应迁移到新路径或新增组件测试。

最低测试：

1. `Button` renders label。
2. `Button` supports variant。
3. `Input` has accessible textbox role through label in a composed form test。
4. `Card` renders content。
5. `ModeToggle` renders accessible trigger。

如果 Radix dropdown 在 happy-dom 下行为不稳定，`ModeToggle` 测试只验证 trigger 可访问，不强测完整菜单交互。完整交互由 app/browser path 验证。

### 16.2 React SPA tests

`apps/web/src/App.test.tsx` 与 `templates/react-spa/src/App.test.tsx` 更新断言。

最低断言：

1. 首页标题可见。
2. 创建表单输入可见。
3. submit button 可见。
4. mock items 可见。
5. theme toggle trigger 可见。

### 16.3 Fullstack tests

`apps/fullstack/src/App.test.tsx` 与 `templates/fullstack-hono-react/src/App.test.tsx` 更新断言。

最低断言：

1. fullstack 标题可见。
2. API 返回的 item 可见。
3. theme toggle trigger 可见。

### 16.4 Playwright

`apps/web/e2e/home.spec.ts` 与 `templates/react-spa/e2e/home.spec.ts` 更新浏览器路径。

最低路径：

1. 首页加载。
2. 初始 items 可见。
3. 输入新 item 并提交。
4. 新 item 出现在列表。
5. toast 出现。
6. 打开 theme menu 并切换 dark。
7. 页面 html 或 body 获得 dark class。
8. 进入 item detail。
9. 返回首页。

Playwright 不需要覆盖所有 shadcn 组件；它覆盖模板关键用户路径和主题路径。

## 17. 文档更新要求

以下文档必须同步更新。

### 17.1 `AGENTS.md`

第 8 行前端默认栈应加入 shadcn/ui 与 `@ts-foundry/ui`：

```md
- 前端和 fullstack 默认使用 React、Vite、TanStack Router/Query、React Hook Form、Zod、Tailwind CSS v4、shadcn/ui、@ts-foundry/ui、Motion。
```

并新增维护规则：

```md
- shadcn/ui 基础组件归属于 `packages/ui`；app/template 只放 app-only 组合组件，不复制共享基础组件。
```

### 17.2 `README.md`

`What Is Included` 更新：

```md
- `packages/ui`: shadcn/ui-based React UI foundation with Tailwind CSS v4 tokens, theme support, and shared components.
```

### 17.3 `GUIDE.md`

新增章节：`Working With The Frontend UI Foundation`。

内容必须说明：

1. `@ts-foundry/ui` 是前端和 fullstack 的共享 UI foundation。
2. 基础组件在 `packages/ui/src/components`。
3. app-only 组合组件在 app/template 自己目录。
4. 新增 shadcn 基础组件时从 monorepo shadcn CLI 坐标添加，并保持 `components.json` 一致。
5. 前端 app/template 必须导入 `@ts-foundry/ui/styles.css`。
6. UI 改动需要运行 `pnpm check:full`。

### 17.4 `docs/技术选型记录.md`

在 Tailwind/Motion 附近新增 `shadcn/ui + Radix primitives` section。

必须表达：

1. shadcn/ui 是源码归属型 UI foundation，不是黑盒组件库。
2. Radix primitives 提供可访问性交互基础。
3. Tailwind CSS v4 token 提供样式表达。
4. `packages/ui` 是共享基础组件归属点。
5. app-only block 不进入 `packages/ui`。

### 17.5 `docs/环境配置清单.md`

前端模板栈表格新增：

```md
| UI foundation | shadcn/ui + @ts-foundry/ui | 共享基础组件、主题 token、可访问性交互 primitives |
| Headless primitives | Radix UI | Dialog、Dropdown、Select、Tabs 等无头交互基础 |
| Icons | lucide-react | UI controls icon set |
| Theme | next-themes | light/dark/system theme state |
| Toast | sonner | 操作反馈 |
```

### 17.6 `docs/项目模板说明.md`

`react-spa` 和 `fullstack-hono-react` 说明必须加入 UI foundation 路径。

`react-spa` hello world 覆盖项新增：

1. shadcn/ui components。
2. shared `@ts-foundry/ui` package。
3. light/dark theme。
4. toast feedback。

`fullstack-hono-react` 覆盖项新增：

1. React UI consumes shared UI foundation。
2. shared contracts 与 shared UI package 同时参与 workspace 验证。

### 17.7 `docs/质量门禁.md`

新增 UI foundation 验证说明：

1. `packages/ui` 组件测试属于 unit/component gate。
2. 前端模板 e2e 必须覆盖 theme toggle 和 form/list path。
3. 修改 `components.json`、`packages/ui`、frontend template CSS 或 frontend dependencies 必须运行 `pnpm check:full`。

## 18. shadcn CLI 使用规则

shadcn CLI 是组件源码生成工具，不是运行时依赖。

允许使用：

```bash
pnpm dlx shadcn@latest init
pnpm dlx shadcn@latest add <component>
```

执行规则：

1. 生成共享基础组件时，目标是 `packages/ui` 的 `components.json` 坐标。
2. 生成 app-only block 时，目标是具体 app/template 的 `components.json` 坐标。
3. 基础组件不得生成到 app/template 的 `src/components/ui`。
4. 生成后必须检查 package manifest，确保依赖归属 `packages/ui` 或 app/template 正确。
5. 生成后必须检查 `pnpm-workspace.yaml` catalog，确保新增版本集中。
6. 生成后必须运行 Biome format 或 `pnpm format`。

本次 foundation 的组件集合固定为：

```text
button
input
textarea
label
form
select
checkbox
switch
card
badge
separator
alert
skeleton
dialog
dropdown-menu
sheet
tabs
tooltip
sonner
```

不得额外添加 calendar、chart、command、sidebar、data-table block。

## 19. 实施序列

实施序列是当前对象的构造顺序，不是分阶段决策。

### 19.1 准备

1. 确认当前工作目录为 `ts-foundry-template`。
2. 检查 git status，识别用户已有改动，不得回退无关改动。
3. 确认 `pnpm install` 当前可用。

### 19.2 catalog 与 package manifest

1. 在 `pnpm-workspace.yaml` catalog 添加 shadcn foundation dependencies。
2. 更新 `packages/ui/package.json` dependencies、peerDependencies、devDependencies、exports、sideEffects。
3. 更新前端 app/template package manifests，确保它们依赖 `@ts-foundry/ui`。
4. 不修改 API、CLI、TS lib package manifests。

### 19.3 shadcn 坐标

1. 创建 `packages/ui/components.json`。
2. 创建 `apps/web/components.json`。
3. 创建 `apps/fullstack/components.json`。
4. 创建 `templates/react-spa/components.json`。
5. 创建 `templates/fullstack-hono-react/components.json`。
6. 保持 style、baseColor、iconLibrary 一致。

### 19.4 UI package 源码

1. 创建 `packages/ui/src/lib/utils.ts`。
2. 创建 `packages/ui/src/styles/globals.css`。
3. 生成或添加固定组件集合。
4. 创建 `theme-provider.tsx`。
5. 创建 `mode-toggle.tsx`。
6. 更新 `src/index.ts` exports。
7. 删除旧 `Button.tsx` 或改为兼容 re-export。最终公共组件源以 `src/components/button.tsx` 为准。

### 19.5 app/template 消费

1. 更新四个前端入口 CSS。
2. 更新 React SPA router。
3. 更新 Fullstack App。
4. 更新 provider 层。
5. 加入 Toaster。
6. 更新测试断言。
7. 更新 Playwright path。

### 19.6 playground

1. 更新 playground CSS。
2. 更新 playground App。
3. 确认 `pnpm --filter @ts-foundry/ui play` 能显示 foundation components。

### 19.7 docs

1. 更新 `AGENTS.md`。
2. 更新 `README.md`。
3. 更新 `GUIDE.md`。
4. 更新 `docs/工程治理约定.md`。
5. 更新 `docs/技术选型记录.md`。
6. 更新 `docs/环境配置清单.md`。
7. 更新 `docs/质量门禁.md`。
8. 更新 `docs/项目模板说明.md`。

### 19.8 install and verification

1. 运行 `pnpm install`。
2. 运行 `pnpm format`。
3. 运行 `pnpm check:full`，输出写入 `tmp/logs/check-full-<timestamp>.log`。
4. 用 `tail` 和 `rg` 检查日志。
5. 若失败，根据失败对象修复，不降低门禁。

## 20. 验收标准

本设计完成时必须满足以下条件。

### 20.1 结构验收

1. `packages/ui/components.json` 存在。
2. 四个前端 app/template 的 `components.json` 存在。
3. `packages/ui/src/components` 包含固定组件集合。
4. `packages/ui/src/styles/globals.css` 存在并包含 light/dark token。
5. `packages/ui/src/lib/utils.ts` 存在。
6. `packages/ui/src/theme-provider.tsx` 存在。
7. `packages/ui/src/mode-toggle.tsx` 存在。
8. app/template CSS 导入 `@ts-foundry/ui/styles.css`。
9. app/template CSS 包含 UI package `@source`。
10. 旧 `.tsf-button*` CSS 不存在。

### 20.2 依赖验收

1. 新增依赖全部进入 catalog。
2. workspace manifests 使用 `catalog:`。
3. React 仍为 `packages/ui` peerDependency。
4. API、CLI、TS lib package manifests 未被 UI 依赖污染。
5. lockfile 已更新。

### 20.3 行为验收

1. React SPA 首页可加载。
2. React SPA item list 可显示。
3. React SPA create form 可提交。
4. 创建成功后 toast 可见。
5. 详情路由可进入和返回。
6. theme toggle 可切换 light/dark/system。
7. Fullstack 页面可加载 API items。
8. Fullstack 页面使用 shared UI components。
9. UI playground 可渲染基础组件。

### 20.4 质量验收

1. `pnpm lint` 通过。
2. `pnpm typecheck` 通过。
3. `pnpm test:coverage` 通过。
4. `pnpm build` 通过。
5. `pnpm e2e` 通过。
6. `pnpm deps:check` 通过。
7. `pnpm pack:check` 通过。
8. `pnpm smoke:create-experiment` 通过。
9. `pnpm check:full` 退出码为 0。

## 21. 失败处理规则

失败处理不得改变设计对象边界。

如果 TypeScript 失败，修正类型、exports 或 imports。

如果 Tailwind 样式缺失，检查 `@source`、CSS import、package exports 和 Vite resolution。

如果 Knip 报未使用依赖，确认依赖是否由 CSS 或 generated component 使用；确为误报时只对该依赖添加 ignore。

如果 Playwright theme 切换失败，检查 `ThemeProvider`、`ModeToggle`、`next-themes` storage key 和 html class。

如果 shadcn 生成路径错误，修正 `components.json` aliases，并移动组件到规定归属。不得接受 app/template 中出现重复的 `src/components/ui` 基础组件。

如果 fullstack build 失败，检查 Node/server build 是否意外摄入 browser-only code。`packages/ui` 只能被 client entry 消费；server entry 不应 import UI components。

## 22. 最终文档表述

整合完成后，仓库对前端默认栈的表述应稳定为：

`React + Vite applications in this mother template use TanStack Router, TanStack Query, React Hook Form, Zod, Tailwind CSS v4, shadcn/ui, @ts-foundry/ui, Motion, MSW, Testing Library, Vitest, and Playwright. @ts-foundry/ui owns the shared UI foundation: components, CSS tokens, theme support, and accessible primitives. App packages own app-specific composition only.`

中文表述：

`本母版的 React 前端和 fullstack React 客户端默认使用 TanStack Router、TanStack Query、React Hook Form、Zod、Tailwind CSS v4、shadcn/ui、@ts-foundry/ui、Motion、MSW、Testing Library、Vitest 和 Playwright。@ts-foundry/ui 是共享 UI foundation，负责基础组件、CSS token、主题能力和可访问性交互 primitives。应用包只负责 app-specific 组合组件。`

## 23. 设计完整性说明

本设计完整，因为它闭合了当前母版前端层的缺口。

它定义了 UI foundation 的身份：`@ts-foundry/ui`。

它定义了组件来源：shadcn/ui registry 源码模式。

它定义了样式机制：Tailwind CSS v4 + shadcn CSS variables + dark token。

它定义了交互基础：Radix primitives。

它定义了组件集合：动作、输入、表单、状态、弹层、导航、通知、主题。

它定义了工程归属：`packages/ui` 拥有基础组件，app/template 拥有 app-only composition。

它定义了 monorepo 坐标：`components.json` 在 UI package 和前端 app/template 中同时存在。

它定义了验证面：unit/component tests、app tests、Playwright、build、deps check、smoke create experiment。

它定义了排除面：API、CLI、TS lib、calendar、chart、command、sidebar、复杂 data-table block 不进入当前对象。

因此，后续开发者不需要补充对象想象，只需要按本文构造、修正和验证。
