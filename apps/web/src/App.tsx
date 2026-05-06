import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { Toaster } from "@ts-foundry/ui/components/sonner";
import { ThemeProvider } from "@ts-foundry/ui/theme-provider";
import { router } from "./router";

const queryClient = new QueryClient();

export function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="ts-foundry-theme">
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
