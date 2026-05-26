# 项目型 TypeScript CLI 模板设计

`templates/node-cli` 是项目型 TypeScript 命令行工具模板。该模板固定一种长期稳定的 CLI 行为协议：工具拥有自己的命令名和隐藏配置目录；用户通过 `init` 建立工具语境；其他命令通过显式项目根或当前工作目录向上发现项目；项目配置使用 TOML；文件扫描范围由配置中的 sources 声明；发现结果通过 `discover` 投影；业务处理通过 scanner registry 接入；命令结果同时支持人类输出和稳定 JSON 输出。

该模板不表达某个业务工具的私有逻辑。它表达项目型工具反复需要的共同结构：项目定位、初始化、配置读取、配置校验、文件发现、错误语义、输出投影和可测试命令边界。具体业务工具复制该模板后，替换 scanner 和业务 command action，不重新设计项目语境协议。

## 设计对象

项目型 CLI 是在文件系统项目中运行的命令行人工制品。它的输入来自命令行参数、当前工作目录、显式项目根和项目内配置文件；它的输出面向终端用户、脚本、CI、编辑器集成和自动化调用方。它的核心责任不是创建整个软件项目，而是在一个目录树中建立并使用工具自己的项目语境。

该模板固定的人工制品是“项目型 CLI 骨架”，不是“参数解析样板”。参数解析只处理命令表面；项目型 CLI 骨架还必须处理项目根、隐藏目录、配置文件、文件发现、错误码、退出码和 JSON 投影。

该模板固定的人工制品也不是“业务扫描器”。Markdown、Python、txt、rst、adoc 只是典型源文件类别。模板负责声明这些文件如何进入工具视野，负责把文件分发给 scanner；模板不承诺任何专用业务解析能力。

该模板的成立条件如下：

- 工具有稳定命令名。
- 工具有稳定隐藏目录名。
- 工具有稳定 TOML 配置文件位置。
- 工具有明确初始化命令。
- 工具有两种项目定位方式。
- 工具有结构化配置 schema。
- 工具有 source 声明模型。
- 工具有 gitignore-aware 文件发现。
- 工具有 scanner registry 插槽。
- 工具有稳定错误码和退出码。
- 工具有稳定 JSON 输出。
- 核心逻辑可在测试中脱离真实进程入口执行。

这些条件共同定义模板对象。缺少其中任何一类，模板都会退化成一次性脚本起点，而不是正式项目型 CLI 起点。

## 参考坐标

Git 固定了项目发现的经典行为。用户在项目任意子目录执行命令时，Git 从当前目录向上寻找 `.git` 并确定仓库语境；显式指定仓库位置时，命令按显式位置解释。该行为已经成为项目型工具的基础直觉。模板沿用这个结构：显式 `--project` 指定项目根；没有 `--project` 时从 CWD 向上寻找工具配置目录。

Prettier 固定了项目配置随项目走的协作原则。Prettier 文档说明它会查找配置文件，并且不支持全局配置，理由是项目复制到另一台机器时行为应保持一致。项目型 CLI 模板采用同一原则：工具行为由项目内 `.foo/config.toml` 定义，不读取用户 home 下的全局配置。

Biome 和 ESLint 固定了“文件处理范围属于配置契约”的工具形态。它们都把 files、includes、ignores 一类结构作为工具行为的一等配置。模板把 `[[sources]]` 作为同一层对象：用户显式声明哪些目录、哪些 glob、交给哪个 scanner。

Commander 固定命令层结构。它负责命令、子命令、选项、帮助、版本和用法错误。模板采用 Commander 作为命令层，不让命令层承担项目发现和配置协议。

Zod 固定运行时 schema 校验。TypeScript 类型只在编译期存在，TOML 配置来自运行时输入，必须由 runtime schema 校验。模板采用 Zod 表达配置 schema、命令结果结构和错误对象边界。

smol-toml 固定 TOML 解析与序列化。该包提供 TypeScript 类型声明、零依赖、TOML 解析和 stringify 能力，适合隐藏目录配置文件的读写。

globby 固定文件发现。该包提供现代 ESM API、glob 展开、ignore pattern 和 gitignore-aware 能力。模板采用 globby 处理 source 展开，不实现自有 glob 语法。

## 技术选型

模板依赖固定为 `commander`、`zod`、`smol-toml` 和 `globby`。

`commander` 是 CLI 命令层依赖。它负责 command、subcommand、option、help、version 和 usage error。模板的 `cli.ts` 使用 Commander 组装命令表面；每个 command action 只把解析后的选项交给核心模块。

`zod` 是运行时结构校验依赖。配置文件、规范化配置、命令结果、错误对象和 scanner 输出都通过 Zod schema 固定边界。模板不把 TypeScript interface 当成运行时信任来源。

`smol-toml` 是 TOML 读写依赖。`init` 使用它生成默认配置文本；配置加载使用它解析 `.foo/config.toml`。TOML 解析失败映射为 `CONFIG_PARSE_FAILED`。

`globby` 是文件发现依赖。`discover` 使用它展开 include、exclude 和 gitignore-aware 规则。glob 语法由 globby 承担；模板只定义路径基准、配置字段和返回形状。

模板不采用 oclif。oclif 是大型 CLI framework，会把项目结构、命令组织、测试姿势和插件体系牵引到 oclif 语境。该模板固定的是项目型工具协议，不是大型 CLI framework 绑定。

模板不采用 cosmiconfig。cosmiconfig 的价值是兼容多种 JS 配置位置和文件名；该模板的价值是固定 `.foo/config.toml`。多位置搜索会扩大公共契约，削弱项目配置语境的确定性。

模板不读取全局配置。项目型工具的配置必须随项目提交、审查和复制。用户机器上的全局配置不得改变同一项目在不同环境中的默认扫描行为。

## 工具身份

工具身份由三个对象组成：package name、CLI name 和 config directory name。

package name 属于 npm 发布和 workspace 管理。例如模板包当前名称是 `@ts-foundry-template/node-cli`，复制后的实验包名称是 `@ts-foundry-template-experiment/<name>`。

CLI name 属于用户命令输入。本文用 `foo` 表示最终工具命令。用户运行 `foo init`、`foo discover`、`foo scan`。

config directory name 属于项目文件系统语境。CLI name 为 `foo` 时，隐藏目录固定为 `.foo`。

三者在代码中由常量定义：

```ts
export const packageName = "@ts-foundry-template/node-cli";
export const cliName = "foo";
export const configDirName = ".foo";
export const configFileName = "config.toml";
```

隐藏目录不从 npm package name 自动推导。scoped package 包含 `@` 和 `/`，不适合作为文件系统目录名。CLI name 和 config directory name 是项目型工具公共契约的一部分，必须显式定义。

所有帮助文本、错误消息、初始化路径和配置路径都从这些常量派生。复制模板创建新工具时，维护者修改这些常量和 package metadata，项目发现协议保持不变。

## 项目定位

项目定位只有两种方式：显式项目根和 CWD 向上发现。

显式项目根由 `--project <path>` 提供。该路径就是项目根。工具只检查 `<path>/.foo/config.toml`。配置存在时加载该配置；配置不存在时返回 `PROJECT_CONFIG_NOT_FOUND`。显式项目根不触发向上搜索。

CWD 向上发现用于没有 `--project` 的命令。工具从 `process.cwd()` 开始，逐级检查 `.foo/config.toml`。找到第一个配置文件时停止。包含 `.foo` 的目录就是 project root。搜索到文件系统根仍未找到配置时返回 `PROJECT_NOT_FOUND`。

该规则把用户意图分成两个稳定层位。`--project` 表示用户已经指定项目根；CWD 发现表示用户让工具按当前位置推导项目根。显式指定和自动推导不混用。

项目定位结果结构固定为：

```ts
type ProjectContext = {
	projectRoot: string;
	configDir: string;
	configPath: string;
	discoveryMode: "explicit" | "cwd-upward";
	startDirectory: string;
};
```

`projectRoot` 是项目路径基准。配置中的 `source.root` 全部相对该目录解析。`configDir` 是工具隐藏目录。`configPath` 是 TOML 配置路径。`discoveryMode` 记录项目定位来源。`startDirectory` 记录 CWD 发现的起点，显式项目根模式下等于显式路径的绝对形式。

所有项目语境命令统一调用项目定位模块。命令层不直接拼接 `.foo/config.toml`，避免每个命令拥有不同解释。

## 初始化契约

`foo init [path] [--force]` 建立工具项目语境。

未传 `path` 时，目标目录是当前工作目录。传入 `path` 时，目标目录是该路径解析后的绝对目录。目标目录必须已经存在并且必须是目录。`init` 不创建上层软件项目，不承担脚手架职责。

`init` 创建以下结构：

```text
.foo/
  config.toml
  cache/
    .gitignore
  state/
    .gitignore
```

`.foo/config.toml` 是项目配置文件。该文件属于项目公共契约，进入版本控制。

`.foo/cache/` 存放可重建缓存。该目录中的内容不进入版本控制。`.foo/cache/.gitignore` 固定为：

```text
*
!.gitignore
```

`.foo/state/` 存放本地运行状态。该目录中的内容不进入版本控制。`.foo/state/.gitignore` 使用同一内容。

`init` 不修改项目根 `.gitignore`。隐藏目录内部通过局部 `.gitignore` 管理运行态文件，不扩大初始化副作用。

如果 `.foo/config.toml` 已存在，`init` 返回 `PROJECT_ALREADY_INITIALIZED`。传入 `--force` 时，`init` 覆盖 `.foo/config.toml`，保留 `.foo/cache/.gitignore` 和 `.foo/state/.gitignore` 的目标结构。

默认配置由模板内常量生成：

```toml
[discovery]
respect_gitignore = true
follow_symlinks = false
include_hidden = false

[[sources]]
id = "docs"
root = "docs"
include = ["**/*.{md,mdx,rst,adoc,txt}"]
exclude = []
scanner = "text"

[[sources]]
id = "python"
root = "src"
include = ["**/*.py"]
exclude = ["**/__pycache__/**"]
scanner = "python"
```

配置不包含 `[project] name`。项目名称属于包管理器、语言工程元数据或业务域配置。项目型工具扫描文件、解释配置和投影发现结果不需要项目名称。

## 配置模型

`.foo/config.toml` 是工具项目配置的唯一默认来源。配置文件使用 TOML。路径字段按项目根解释，不按 `.foo` 目录解释。

配置顶层包含 `[discovery]` 和 `[[sources]]`。

`[discovery]` 固定文件发现全局行为：

```toml
[discovery]
respect_gitignore = true
follow_symlinks = false
include_hidden = false
```

`respect_gitignore` 控制文件发现是否尊重项目 `.gitignore`。默认值是 `true`。递归扫描项目文件时，被版本控制明确排除的目录属于依赖、构建产物、缓存、虚拟环境和工具状态等非业务输入；默认扫描这些路径会造成性能问题和语义污染。

`follow_symlinks` 控制文件发现是否跟随符号链接。默认值是 `false`。符号链接会跨出项目边界，也会形成循环。项目型 CLI 默认不跨越这种边界。

`include_hidden` 控制是否扫描隐藏文件和隐藏目录。默认值是 `false`。隐藏路径承载 VCS、编辑器、工具配置和缓存等项目管理对象。业务文件位于隐藏路径时，用户通过配置显式开启。

`[[sources]]` 声明扫描源：

```toml
[[sources]]
id = "docs"
root = "docs"
include = ["**/*.{md,mdx,rst,adoc,txt}"]
exclude = []
scanner = "text"
```

`id` 是 source 在配置内的稳定标识。它必须唯一。命令行 `--source <id>`、错误信息、JSON 输出和 scanner 分组都使用该标识。

`root` 是 source 根目录，相对 project root 解析。`root = "docs"` 表示 `<projectRoot>/docs`。

`include` 是 glob 数组，相对 source root 解析。它声明进入该 source 的文件集合。

`exclude` 是 glob 数组，相对 source root 解析。它在 include 结果上执行排除。

`scanner` 是 scanner registry key。它声明该 source 的文件交给哪个 scanner 处理。scanner key 不等于文件扩展名，也不等于业务动作。scanner key 只负责连接“文件集合”和“处理器”。

配置 schema 由 Zod 定义。配置加载后先得到原始对象，再经过 schema 校验和默认值填充，最后生成规范化配置：

```ts
type NormalizedConfig = {
	discovery: {
		respectGitignore: boolean;
		followSymlinks: boolean;
		includeHidden: boolean;
	};
	sources: Array<{
		id: string;
		root: string;
		include: string[];
		exclude: string[];
		scanner: string;
	}>;
};
```

source id 必须匹配 CLI 标识符规则：以字母开头，只包含字母、数字、短横线和下划线。该规则使 `--source docs`、JSON key、日志消息和测试断言保持稳定。

source id 不能重复。重复 id 返回 `CONFIG_INVALID`，错误 details 指出重复 id。

source root 不能是绝对路径。项目配置描述项目内部文件集合，绝对路径会把项目行为绑定到某台机器。处理项目外路径的具体业务工具必须定义自己的输入通道，不通过默认 source root 表达。

source root 不能包含 `..` 越界片段。source root 必须留在 project root 内部。

glob pattern 使用 `/` 作为路径分隔符。Windows 路径在内部规范化为 POSIX 风格相对路径。配置文件不接受反斜杠作为 glob 分隔符。

## 命令集合

模板固定六组命令：`init`、`status`、`discover`、`scan`、`config print` 和 `doctor`。

```text
foo init [path] [--force]
foo status [--project <path>] [--json]
foo discover [--project <path>] [--source <id>] [--list] [--json] [--no-respect-gitignore] [--follow-symlinks] [--include-hidden]
foo scan [--project <path>] [--source <id>] [--json] [--no-respect-gitignore] [--follow-symlinks] [--include-hidden]
foo config print [--project <path>] [--json] [--no-respect-gitignore] [--follow-symlinks] [--include-hidden]
foo doctor [--project <path>] [--json] [--no-respect-gitignore] [--follow-symlinks] [--include-hidden]
```

`init` 创建工具项目语境。它是唯一不要求已有项目配置的项目命令。

`status` 投影当前项目语境。它输出 project root、config path、discovery mode、source 数量和 source root 状态。该命令用于确认工具当前解释的是哪个项目。

`discover` 投影文件发现结果。它加载项目配置，展开 sources，应用 include、exclude、gitignore、hidden 和 symlink 规则，输出每个 source 匹配的文件数量。传入 `--list` 时输出文件列表。传入 `--source <id>` 时只展开指定 source。

`scan` 消费 scanner registry 和发现结果。模板内 scanner 输出文件数、字节数和行数。具体业务工具复制模板后替换 scanner 实现，保留命令边界和错误语义。

`config print` 输出规范化配置。它显示 TOML 配置经过 schema 校验、默认值填充和 CLI 覆盖后的结果。该命令服务配置审查和 CI 审查。

`doctor` 检查项目配置健康状态。它报告配置解析、schema 校验、source root、空 source、scanner 注册和 gitignore 读取状态。`doctor` 成功表示工具项目语境可被其他命令使用。

## 命令行覆盖

覆盖优先级固定为：

```text
CLI flag > config.toml > built-in defaults
```

`--project` 覆盖项目定位来源。它不修改配置。

`--source` 选择 source 子集。它不修改配置。

`--json` 选择机器输出投影。它不修改业务行为。

`--list` 控制 `discover` 是否列出具体文件。它不修改发现结果。

`--no-respect-gitignore` 覆盖 `discovery.respect_gitignore`。

`--follow-symlinks` 覆盖 `discovery.follow_symlinks`。

`--include-hidden` 覆盖 `discovery.include_hidden`。

命令行覆盖只影响本次执行。模板不提供通过命令行增删 source 的功能。注册扫描范围通过编辑 TOML 完成，避免命令行成为隐式配置编辑器。

## 文件发现语义

文件发现输入为 `ProjectContext`、`NormalizedConfig` 和命令行覆盖。输出为 source 分组后的 discovered files。

每个 source 的发现步骤固定：

1. 将 `source.root` 解析为 project-root-relative 路径。
2. 检查 root 是否位于 project root 内部。
3. 检查 root 是否存在。
4. 使用 `source.include` 在 root 内展开文件。
5. 使用 `source.exclude` 排除 include 结果。
6. 按 `respect_gitignore` 应用项目 `.gitignore`。
7. 按 `include_hidden` 排除隐藏路径。
8. 按 `follow_symlinks` 控制符号链接遍历。
9. 将结果规范化为 project-root-relative POSIX path。

发现结果结构固定为：

```ts
type DiscoveredSource = {
	id: string;
	root: string;
	scanner: string;
	include: string[];
	exclude: string[];
	files: DiscoveredFile[];
};

type DiscoveredFile = {
	path: string;
	sourceId: string;
	scanner: string;
};
```

`path` 是 project-root-relative POSIX path。该路径是 JSON 输出、测试断言和 scanner 输入的稳定标识。scanner 消费绝对路径时，由核心模块在调用前根据 project root 解析，不把绝对路径作为默认公共标识。

source root 不存在时，`discover` 返回 `SOURCE_ROOT_NOT_FOUND`。`doctor` 把同一问题报告为诊断项。该差异由命令职责决定：`discover` 负责产生发现结果，root 不存在阻断结果；`doctor` 的职责是收集问题。

source 匹配为空时，`discover` 返回成功并显示 `0 files`。空 source 是合法状态。`doctor` 将空 source 标记为 warning，因为该 source 未产生可扫描输入。

gitignore 读取失败返回 `DISCOVERY_FAILED`，details 包含失败路径。尊重 gitignore 是配置契约，工具不能在读取失败后静默扩大扫描范围。

## Scanner Registry

Scanner registry 是模板提供给业务工具的接入点。它把 scanner key 映射到 scanner implementation。

接口固定为：

```ts
type ScannerContext = {
	projectRoot: string;
	source: DiscoveredSource;
};

type ScannerResult = {
	sourceId: string;
	scanner: string;
	files: number;
	bytes: number;
	lines: number;
};

type Scanner = (context: ScannerContext) => Promise<ScannerResult>;
```

模板注册两个 scanner key：`text` 和 `python`。两者在模板中使用同一个基础文本扫描实现，统计文件数、字节数和行数。它们固定 registry 分发结构，不表达完整 Markdown、Python、RST 或 AsciiDoc 解析能力。

source 指向未注册 scanner 时，`scan` 返回 `SCANNER_NOT_REGISTERED`。`doctor` 把同一问题报告为 error 诊断项。

scanner 不处理项目发现、配置加载、glob 展开和输出格式。scanner 只消费已发现的 source 文件。该边界防止业务处理器重新解释配置语义。

## 输出投影

命令核心返回结构化 result。输出层把 result 投影为人类文本或 JSON。核心模块不直接调用 `console.log`。

命令结果结构固定为：

```ts
type CommandResult<T> =
	| {
			ok: true;
			code: 0;
			data: T;
	  }
	| {
			ok: false;
			code: ExitCode;
			error: CliError;
	  };
```

JSON 成功输出固定为：

```json
{
  "ok": true,
  "data": {}
}
```

JSON 失败输出固定为：

```json
{
  "ok": false,
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "No .foo/config.toml was found from the current directory upward.",
    "details": {}
  }
}
```

人类输出不暴露内部 stack trace。普通错误输出包含问题、关键路径和下一步动作。调试信息属于复制后业务工具的私有契约，不进入默认模板公共输出。

`status` 人类输出固定为摘要表：

```text
Project: /repo
Config:  /repo/.foo/config.toml
Mode:    cwd-upward

Sources:
  docs    text    docs    ok
  python  python  src     ok
```

`discover` 人类输出固定为发现表：

```text
Project: /repo
Config:  /repo/.foo/config.toml

Source   Scanner  Root   Files
docs     text     docs   42
python   python   src    18
```

`discover --list` 在摘要后列出文件：

```text
docs
  docs/index.md
  docs/guide.rst

python
  src/main.py
```

`config print` 人类输出使用 TOML。JSON 模式输出规范化配置对象。

## 错误码与退出码

退出码固定为：

```text
0  success
1  runtime failure
2  usage error
3  project discovery error
4  config error
5  discovery or scanning error
```

错误码固定为：

```text
USAGE_ERROR
PROJECT_NOT_FOUND
PROJECT_CONFIG_NOT_FOUND
PROJECT_ALREADY_INITIALIZED
CONFIG_READ_FAILED
CONFIG_PARSE_FAILED
CONFIG_INVALID
SOURCE_NOT_FOUND
SOURCE_ROOT_NOT_FOUND
SCANNER_NOT_REGISTERED
DISCOVERY_FAILED
SCAN_FAILED
```

`USAGE_ERROR` 映射退出码 `2`。它表示命令行参数错误、未知命令、缺少必填参数和无效 option 值。

`PROJECT_NOT_FOUND` 映射退出码 `3`。它表示 CWD 向上发现没有找到 `.foo/config.toml`。

`PROJECT_CONFIG_NOT_FOUND` 映射退出码 `3`。它表示显式 `--project` 指定的根目录下不存在 `.foo/config.toml`。

`PROJECT_ALREADY_INITIALIZED` 映射退出码 `3`。它表示 `init` 目标目录已有配置且未传 `--force`。

`CONFIG_READ_FAILED` 映射退出码 `4`。它表示配置文件存在但不可读取。

`CONFIG_PARSE_FAILED` 映射退出码 `4`。它表示 TOML 语法无法解析。

`CONFIG_INVALID` 映射退出码 `4`。它表示 TOML 语法正确但 schema 不成立。

`SOURCE_NOT_FOUND` 映射退出码 `4`。它表示 `--source <id>` 指向不存在的 source。

`SOURCE_ROOT_NOT_FOUND` 映射退出码 `5`。它表示 source root 在文件系统中不存在。

`SCANNER_NOT_REGISTERED` 映射退出码 `5`。它表示 source 使用的 scanner key 没有注册。

`DISCOVERY_FAILED` 映射退出码 `5`。它表示 glob 展开、gitignore 读取或路径规范化失败。

`SCAN_FAILED` 映射退出码 `5`。它表示 scanner 执行失败。

错误对象结构固定为：

```ts
type CliError = {
	code: CliErrorCode;
	message: string;
	details?: Record<string, unknown>;
};
```

错误 message 面向人类，错误 code 面向程序。程序不得依赖 message 文本判断错误类型。

## 代码结构

模板源码结构固定为：

```text
src/
  bin.ts
  cli.ts
  index.ts
  commands/
    init.ts
    status.ts
    discover.ts
    scan.ts
    config-print.ts
    doctor.ts
  core/
    constants.ts
    errors.ts
    result.ts
    project.ts
    config.ts
    discovery.ts
    scanners.ts
  io/
    filesystem.ts
    output.ts
```

`bin.ts` 是真实进程入口。它读取 `process.argv` 和 `process.cwd()`，调用 `runCli`，写 stdout/stderr，设置 `process.exitCode`。

`cli.ts` 组装 Commander program。它注册命令、选项、help 和 usage error handler。它不读写配置文件，不展开 glob。

`index.ts` 导出模板可测试 API。测试通过该入口调用 `runCli` 和核心模块。

`commands/init.ts` 实现初始化命令编排。它调用 filesystem adapter 和配置生成模块。

`commands/status.ts` 实现项目语境投影。

`commands/discover.ts` 实现文件发现投影。

`commands/scan.ts` 实现 scanner registry 消费命令。

`commands/config-print.ts` 实现规范化配置投影。

`commands/doctor.ts` 实现诊断汇总。

`core/constants.ts` 定义 CLI name、config dir、config file、默认配置和路径常量。

`core/errors.ts` 定义错误码、退出码和错误构造函数。

`core/result.ts` 定义命令结果对象。

`core/project.ts` 实现显式项目根和 CWD 向上发现。

`core/config.ts` 实现 TOML 读写、Zod schema、规范化配置和配置错误映射。

`core/discovery.ts` 实现 source 展开、路径规范化、gitignore-aware 扫描和 discovered result。

`core/scanners.ts` 定义 scanner registry、内置 scanner 和 scanner 错误映射。

`io/filesystem.ts` 定义文件系统 adapter。真实入口使用 Node fs；测试使用临时目录和真实 fs adapter，保持行为接近真实环境。

`io/output.ts` 定义人类输出和 JSON 输出投影。

该结构把进程边界、命令表面、核心协议和文件系统 I/O 分离。分离的目的不是抽象表演，而是让项目定位、配置加载、发现语义和输出格式具备独立测试边界。

## 测试契约

模板测试覆盖项目型 CLI 的稳定行为。

初始化测试：

- `init` 在目标目录创建 `.foo/config.toml`。
- `init` 创建 `.foo/cache/.gitignore`。
- `init` 创建 `.foo/state/.gitignore`。
- 已初始化目录再次 `init` 返回 `PROJECT_ALREADY_INITIALIZED`。
- `init --force` 覆盖配置文件。

项目定位测试：

- 从项目根运行 `status` 找到配置。
- 从子目录运行 `status` 向上找到配置。
- `--project` 指定项目根时只读取该根配置。
- `--project` 指定错误目录时返回 `PROJECT_CONFIG_NOT_FOUND`。
- 未初始化目录运行 `status` 返回 `PROJECT_NOT_FOUND`。

配置测试：

- 默认 TOML 通过 schema 校验。
- TOML 语法错误返回 `CONFIG_PARSE_FAILED`。
- schema 错误返回 `CONFIG_INVALID`。
- source id 重复返回 `CONFIG_INVALID`。
- source root 使用绝对路径返回 `CONFIG_INVALID`。
- source root 越界返回 `CONFIG_INVALID`。

发现测试：

- `discover` 按 include 展开文件。
- `discover` 按 exclude 排除文件。
- `discover --source docs` 只展开指定 source。
- `respect_gitignore = true` 时排除 `.gitignore` 声明路径。
- `--no-respect-gitignore` 覆盖配置。
- `include_hidden = false` 时不扫描隐藏路径。
- `--include-hidden` 覆盖配置。
- source root 不存在返回 `SOURCE_ROOT_NOT_FOUND`。
- source 匹配为空时命令成功并输出 `0 files`。

scanner 测试：

- `scan` 按 source scanner 分发。
- 未注册 scanner 返回 `SCANNER_NOT_REGISTERED`。
- 内置 scanner 返回文件数、字节数和行数。

输出测试：

- 成功 JSON 输出包含 `ok: true` 和 `data`。
- 失败 JSON 输出包含 `ok: false` 和稳定 error code。
- 人类输出不包含 stack trace。
- Commander usage error 映射为 `USAGE_ERROR` 和退出码 `2`。

这些测试替代 hello world 测试。模板不再用 greeting 证明 CLI 存在，而是用项目定位、配置、发现和输出证明项目型 CLI 骨架成立。

## 包与构建

模板保持 Node 24、TypeScript、ESM、tsx、tsdown、Vitest 和 Biome。

`package.json` 的 `bin` 指向构建后的 `dist/bin.mjs`：

```json
{
  "bin": {
    "foo": "./dist/bin.mjs"
  }
}
```

`exports` 指向库入口：

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs"
    },
    "./package.json": "./package.json"
  }
}
```

tsdown entry 固定为两个入口：

```ts
entry: ["src/index.ts", "src/bin.ts"]
```

`src/bin.ts` 保留 shebang：

```ts
#!/usr/bin/env node
```

模板 package dependencies 包含 `commander`、`zod`、`smol-toml` 和 `globby`。开发依赖保持 TypeScript、tsx、tsdown、Vitest、publint 和 arethetypeswrong。

根 `pnpm-workspace.yaml` catalog 纳入新增依赖版本。workspace 中的模板包使用 `catalog:`，保持依赖治理一致。

## 文档契约

模板 README 必须说明以下对象：

- CLI name、config directory name 和 package name 的关系。
- `init` 创建的目录结构。
- 两种项目定位方式。
- `.foo/config.toml` 的字段语义。
- source root 和 glob 的路径基准。
- `respect_gitignore`、`follow_symlinks` 和 `include_hidden` 的默认行为。
- `discover` 的用途。
- scanner registry 的替换位置。
- JSON 输出和错误码契约。

README 不把模板写成业务教程。README 只说明项目型 CLI 骨架如何使用和替换。

`docs/项目模板说明.md` 中的 `node-cli` 段落属于模板说明投影。该段落以项目型 CLI 为对象，列出 `init/status/discover/scan/config print/doctor` 覆盖的工程路径。

## 完成标准

模板完成后，以下命令行为成立：

```bash
foo init
foo status
foo discover
foo discover --source docs
foo discover --list
foo discover --json
foo scan
foo config print
foo doctor
foo status --project /path/to/project
```

项目结构成立：

```text
.foo/
  config.toml
  cache/
    .gitignore
  state/
    .gitignore
```

配置语义成立：

```toml
[discovery]
respect_gitignore = true
follow_symlinks = false
include_hidden = false

[[sources]]
id = "docs"
root = "docs"
include = ["**/*.{md,mdx,rst,adoc,txt}"]
exclude = []
scanner = "text"

[[sources]]
id = "python"
root = "src"
include = ["**/*.py"]
exclude = ["**/__pycache__/**"]
scanner = "python"
```

项目定位语义成立：

```text
--project <path> 指定项目根，并只检查该根下的 .foo/config.toml。
无 --project 时，从 CWD 向上寻找 .foo/config.toml。
找到配置后，.foo 的父目录就是 project root。
配置中的 root 相对 project root。
include 和 exclude 相对 source root。
```

输出语义成立：

```text
人类输出用于终端阅读。
--json 输出用于程序消费。
错误 code 稳定。
退出码稳定。
普通错误不显示 stack trace。
```

工程语义成立：

```text
核心逻辑可测试。
命令层不直接承担项目发现。
scanner 不重新解释配置。
文件发现不重新实现 glob。
配置解析不信任 TypeScript 静态类型。
```

该完成标准描述模板对象本身，不描述某个业务工具的完成标准。业务工具在这个模板上继续实现自身 scanner 和 command action。

## 参考链接

- Git 文档：https://git-scm.com/docs/git
- Prettier 配置文档：https://prettier.io/docs/configuration
- Biome 配置文档：https://biomejs.dev/guides/configure-biome/
- ESLint 配置文档：https://eslint.org/docs/latest/use/configure/configuration-files
- Commander：https://github.com/tj/commander.js
- Zod：https://zod.dev/
- smol-toml：https://www.npmjs.com/package/smol-toml
- globby：https://www.npmjs.com/package/globby
