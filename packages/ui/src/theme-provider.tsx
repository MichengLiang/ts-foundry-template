import type { ThemeProviderProps } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			storageKey="ts-foundry-theme"
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}

export { ThemeProvider };
