# Node CLI Template

`node-cli` is a project-oriented TypeScript CLI template. The package name is `@ts-foundry-template/node-cli`, the CLI command is `foo`, and the project config directory is `.foo`. These names are explicit constants; the config directory is not derived from the npm package name.

## Project Context

Initialize a project:

```bash
foo init
```

`init` creates:

```text
.foo/
  config.toml
  cache/
    .gitignore
  state/
    .gitignore
```

`.foo/config.toml` is project configuration. `.foo/cache/` and `.foo/state/` keep local runtime files out of version control through their own `.gitignore` files.

Project lookup has two modes:

- `--project <path>` treats `<path>` as the project root and checks only `<path>/.foo/config.toml`.
- Without `--project`, commands search upward from the current working directory for `.foo/config.toml`.

## Config

Config uses TOML. Paths are interpreted from the project root. Source `include` and `exclude` patterns are interpreted from each source root.

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

`respect_gitignore` defaults to `true`, `follow_symlinks` defaults to `false`, and `include_hidden` defaults to `false`. The source model is fixed to `id`, `root`, `include`, `exclude`, and `scanner`.

## Commands

```bash
foo init
foo status
foo discover
foo discover --source docs
foo discover --list
foo scan
foo config print
foo doctor
```

`discover`, `scan`, `config print`, and `doctor` accept discovery overrides: `--no-respect-gitignore`, `--follow-symlinks`, and `--include-hidden`.

`discover` projects file discovery. `scan` sends discovered source groups to the scanner registry. The template registers `text` and `python`; both count files, bytes, and lines. Replace scanner implementations in `src/core/scanners.ts` when building a concrete tool.

## Output And Errors

Commands support human output and `--json`. JSON success output has `{ "ok": true, "data": ... }`. JSON failure output has `{ "ok": false, "error": { "code": "...", "message": "...", "details": ... } }`.

Error codes and exit codes are stable. Human errors do not print stack traces.
