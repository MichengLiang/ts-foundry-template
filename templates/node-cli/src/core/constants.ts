export const packageName = "@ts-foundry-template/node-cli";
export const cliName = "foo";
export const configDirName = ".foo";
export const configFileName = "config.toml";

export const runtimeGitignore = "*\n!.gitignore\n";

export const defaultConfigToml = `[discovery]
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
`;
