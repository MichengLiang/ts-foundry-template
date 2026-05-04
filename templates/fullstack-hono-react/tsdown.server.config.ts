import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/server/index.ts"],
	dts: true,
	clean: false,
	format: ["esm"],
	platform: "node",
	outDir: "dist/server",
});
