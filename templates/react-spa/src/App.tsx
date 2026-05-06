import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { ThemeProvider, Toaster } from "@ts-foundry/ui";
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
