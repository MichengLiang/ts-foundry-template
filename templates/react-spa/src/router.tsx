import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	createRootRoute,
	createRoute,
	createRouter,
	Link,
	Outlet,
	useParams,
} from "@tanstack/react-router";
import { CreateItemSchema } from "@ts-foundry/contracts";
import { Button } from "@ts-foundry/ui";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { createRemoteItem, fetchItems } from "./api";

type CreateItemForm = {
	name: string;
};

function RootLayout() {
	return (
		<main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-10">
			<header className="border-slate-200 border-b pb-5">
				<Link className="font-semibold text-slate-950 text-xl" to="/">
					TS Foundry Web
				</Link>
			</header>
			<Outlet />
		</main>
	);
}

function HomePage() {
	const queryClient = useQueryClient();
	const items = useQuery({ queryKey: ["items"], queryFn: fetchItems });
	const form = useForm<CreateItemForm>({
		resolver: zodResolver(CreateItemSchema),
		defaultValues: { name: "" },
	});
	const createItem = useMutation({
		mutationFn: (values: CreateItemForm) => createRemoteItem(values.name),
		onSuccess: async () => {
			form.reset();
			await queryClient.invalidateQueries({ queryKey: ["items"] });
		},
	});

	return (
		<motion.section
			animate={{ opacity: 1, y: 0 }}
			className="grid gap-6"
			initial={{ opacity: 0, y: 8 }}
		>
			<div>
				<h1 className="font-semibold text-3xl text-slate-950">
					React workspace hello world
				</h1>
				<p className="mt-2 text-slate-600">
					React, TanStack Router, Query, RHF, Zod, Tailwind, Motion, MSW.
				</p>
			</div>

			<form
				className="flex flex-col gap-3 rounded-md border border-slate-200 p-4"
				onSubmit={form.handleSubmit((values) => createItem.mutate(values))}
			>
				<label className="font-medium text-slate-800" htmlFor="name">
					Item name
				</label>
				<input
					className="rounded-md border border-slate-300 px-3 py-2"
					id="name"
					{...form.register("name")}
				/>
				{form.formState.errors.name ? (
					<p className="text-red-700 text-sm">
						{form.formState.errors.name.message}
					</p>
				) : null}
				<Button disabled={createItem.isPending} type="submit">
					Create item
				</Button>
			</form>

			{items.isLoading ? <p>Loading items</p> : null}
			{items.isError ? <p role="alert">Unable to load items</p> : null}
			<ul className="grid gap-2">
				{items.data?.map((item) => (
					<li className="rounded-md border border-slate-200 p-3" key={item.id}>
						<Link
							className="font-medium text-blue-700"
							params={{ itemId: item.id }}
							to="/items/$itemId"
						>
							{item.name}
						</Link>
					</li>
				))}
			</ul>
		</motion.section>
	);
}

function ItemPage() {
	const { itemId } = useParams({ from: "/items/$itemId" });
	const items = useQuery({ queryKey: ["items"], queryFn: fetchItems });
	const item = items.data?.find((candidate) => candidate.id === itemId);

	return (
		<section className="grid gap-3">
			<Link className="text-blue-700" to="/">
				Back
			</Link>
			<h1 className="font-semibold text-2xl">{item?.name ?? itemId}</h1>
			<p className="text-slate-600">Route parameter: {itemId}</p>
		</section>
	);
}

const rootRoute = createRootRoute({ component: RootLayout });
const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: HomePage,
});
const itemRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/items/$itemId",
	component: ItemPage,
});
const routeTree = rootRoute.addChildren([indexRoute, itemRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
