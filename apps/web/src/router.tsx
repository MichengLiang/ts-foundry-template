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
import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@ts-foundry/ui/components/alert";
import { Badge } from "@ts-foundry/ui/components/badge";
import { Button, buttonVariants } from "@ts-foundry/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ts-foundry/ui/components/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@ts-foundry/ui/components/form";
import { Input } from "@ts-foundry/ui/components/input";
import { Separator } from "@ts-foundry/ui/components/separator";
import { Skeleton } from "@ts-foundry/ui/components/skeleton";
import { toast } from "@ts-foundry/ui/components/sonner";
import { ModeToggle } from "@ts-foundry/ui/mode-toggle";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { createRemoteItem, fetchItems } from "./api";

type CreateItemForm = {
	name: string;
};

function RootLayout() {
	return (
		<div className="min-h-screen bg-background">
			<header className="border-b bg-background/95">
				<div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
					<Link className="font-semibold text-foreground text-sm" to="/">
						TS Foundry Web
					</Link>
					<ModeToggle />
				</div>
			</header>
			<main className="mx-auto max-w-5xl px-6 py-8">
				<Outlet />
			</main>
		</div>
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
		onSuccess: async (item) => {
			toast.success(`Created ${item.name}`);
			form.reset();
			await queryClient.invalidateQueries({ queryKey: ["items"] });
		},
		onError: () => {
			toast.error("Unable to create item");
		},
	});

	return (
		<motion.section
			animate={{ opacity: 1, y: 0 }}
			className="grid gap-6"
			initial={{ opacity: 0, y: 8 }}
		>
			<section className="grid gap-2">
				<Badge className="w-fit" variant="secondary">
					React SPA
				</Badge>
				<h1 className="font-semibold text-3xl tracking-normal">
					React workspace hello world
				</h1>
				<p className="max-w-2xl text-muted-foreground">
					React, TanStack Router, Query, RHF, Zod, Tailwind, shadcn/ui, Motion,
					MSW.
				</p>
			</section>

			<div className="grid gap-6 lg:grid-cols-[360px_1fr]">
				<Card>
					<CardHeader>
						<CardTitle>Create item</CardTitle>
						<CardDescription>
							React Hook Form validates the shared Zod contract.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form
								className="grid gap-4"
								onSubmit={form.handleSubmit((values) =>
									createItem.mutate(values),
								)}
							>
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Item name</FormLabel>
											<FormControl>
												<Input placeholder="Gamma" {...field} />
											</FormControl>
											<FormDescription>
												Enter at least one visible character.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button disabled={createItem.isPending} type="submit">
									Create item
								</Button>
							</form>
						</Form>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Items</CardTitle>
						<CardDescription>
							MSW backs this browser path in development and tests.
						</CardDescription>
					</CardHeader>
					<CardContent>
						{items.isLoading ? (
							<div
								className="grid gap-3"
								aria-label="Loading items"
								role="status"
							>
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
								<Skeleton className="h-12 w-full" />
							</div>
						) : null}
						{items.isError ? (
							<Alert variant="destructive">
								<AlertTitle>Unable to load items</AlertTitle>
								<AlertDescription>
									The item API request did not complete successfully.
								</AlertDescription>
							</Alert>
						) : null}
						{items.data ? (
							<ul className="grid gap-2">
								{items.data.map((item) => (
									<li
										className="flex items-center justify-between gap-3 rounded-md border bg-card p-3"
										key={item.id}
									>
										<div className="grid gap-1">
											<Link
												className="font-medium text-foreground hover:underline"
												params={{ itemId: item.id }}
												to="/items/$itemId"
											>
												{item.name}
											</Link>
											<Badge className="w-fit" variant="outline">
												{item.id}
											</Badge>
										</div>
										<Link
											className={buttonVariants({
												variant: "outline",
												size: "sm",
											})}
											params={{ itemId: item.id }}
											to="/items/$itemId"
										>
											Open
										</Link>
									</li>
								))}
							</ul>
						) : null}
					</CardContent>
				</Card>
			</div>
		</motion.section>
	);
}

function ItemPage() {
	const { itemId } = useParams({ from: "/items/$itemId" });
	const items = useQuery({ queryKey: ["items"], queryFn: fetchItems });
	const item = items.data?.find((candidate) => candidate.id === itemId);

	return (
		<section className="grid gap-4">
			<Link
				className={buttonVariants({ variant: "outline", size: "sm" })}
				to="/"
			>
				Back
			</Link>
			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<CardTitle>
							<h2>{item?.name ?? itemId}</h2>
						</CardTitle>
						<Badge variant="secondary">{itemId}</Badge>
					</div>
					<CardDescription>
						Detail route backed by TanStack Router params.
					</CardDescription>
				</CardHeader>
				<CardContent className="grid gap-4">
					{items.isLoading ? <Skeleton className="h-16 w-full" /> : null}
					{items.isError ? (
						<Alert variant="destructive">
							<AlertTitle>Unable to load item</AlertTitle>
							<AlertDescription>
								The detail page could not read the item list.
							</AlertDescription>
						</Alert>
					) : null}
					{items.data && !item ? (
						<Alert>
							<AlertTitle>Item not found</AlertTitle>
							<AlertDescription>
								No item matched this route parameter.
							</AlertDescription>
						</Alert>
					) : null}
					{item ? (
						<div className="grid gap-3">
							<Separator />
							<p className="text-muted-foreground text-sm">
								Route parameter: {itemId}
							</p>
						</div>
					) : null}
				</CardContent>
			</Card>
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
