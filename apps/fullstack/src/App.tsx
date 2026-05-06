import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { ItemListResponseSchema } from "@ts-foundry/contracts";
import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	ModeToggle,
	Separator,
	Skeleton,
	ThemeProvider,
	Toaster,
} from "@ts-foundry/ui";

const queryClient = new QueryClient();

async function fetchItems() {
	const response = await fetch("/api/items");

	if (!response.ok) {
		throw new Error("Failed to load fullstack items");
	}

	return ItemListResponseSchema.parse(await response.json()).items;
}

function FullstackHome() {
	const items = useQuery({
		queryKey: ["fullstack-items"],
		queryFn: fetchItems,
	});

	return (
		<main className="min-h-screen bg-background">
			<header className="border-b bg-background/95">
				<div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-6">
					<span className="font-semibold text-sm">TS Foundry Fullstack</span>
					<ModeToggle />
				</div>
			</header>
			<section className="mx-auto grid max-w-4xl gap-6 px-6 py-8">
				<div className="grid gap-2">
					<Badge className="w-fit" variant="secondary">
						Hono + React
					</Badge>
					<h1 className="font-semibold text-3xl tracking-normal">
						Fullstack contract hello world
					</h1>
					<p className="max-w-2xl text-muted-foreground">
						React reads Hono responses through shared Zod contracts and renders
						the shared UI foundation.
					</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Contract items</CardTitle>
						<CardDescription>
							The client parses this API response with ItemListResponseSchema.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{items.isLoading ? (
							<div
								className="grid gap-3"
								aria-label="Loading fullstack items"
								role="status"
							>
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
							</div>
						) : null}
						{items.isError ? (
							<Alert variant="destructive">
								<AlertTitle>Unable to load fullstack items</AlertTitle>
								<AlertDescription>
									The Hono API did not return a valid contract response.
								</AlertDescription>
							</Alert>
						) : null}
						{items.data ? (
							<ul className="grid gap-3">
								{items.data.map((item, index) => (
									<li className="grid gap-3" key={item.id}>
										<div className="flex items-center justify-between gap-3">
											<span className="font-medium">{item.name}</span>
											<Badge variant="outline">{item.id}</Badge>
										</div>
										{index < items.data.length - 1 ? <Separator /> : null}
									</li>
								))}
							</ul>
						) : null}
					</CardContent>
				</Card>
			</section>
		</main>
	);
}

export function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="ts-foundry-theme">
			<QueryClientProvider client={queryClient}>
				<FullstackHome />
				<Toaster />
			</QueryClientProvider>
		</ThemeProvider>
	);
}
