import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { ItemListResponseSchema } from "@ts-foundry/contracts";

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
		<main className="mx-auto grid min-h-screen max-w-3xl gap-6 px-6 py-10">
			<section>
				<h1 className="font-semibold text-3xl text-slate-950">
					Fullstack contract hello world
				</h1>
				<p className="mt-2 text-slate-600">
					React reads Hono responses through shared Zod contracts.
				</p>
			</section>
			<ul className="grid gap-2">
				{items.data?.map((item) => (
					<li
						className="rounded-md border border-slate-200 bg-white p-3"
						key={item.id}
					>
						{item.name}
					</li>
				))}
			</ul>
		</main>
	);
}

export function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<FullstackHome />
		</QueryClientProvider>
	);
}
