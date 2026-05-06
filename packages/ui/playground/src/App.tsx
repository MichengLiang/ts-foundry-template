import {
	Alert,
	AlertDescription,
	AlertTitle,
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input,
	ModeToggle,
	Switch,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
	Textarea,
	ThemeProvider,
	Toaster,
	toast,
} from "../../src";

export function App() {
	return (
		<ThemeProvider defaultTheme="system" storageKey="ts-foundry-theme">
			<main className="min-h-screen bg-background px-6 py-8 text-foreground">
				<section className="mx-auto grid max-w-5xl gap-6">
					<header className="flex items-center justify-between gap-4">
						<div className="grid gap-2">
							<Badge className="w-fit" variant="secondary">
								UI foundation
							</Badge>
							<h1 className="font-semibold text-3xl tracking-normal">
								TS Foundry UI
							</h1>
						</div>
						<ModeToggle />
					</header>

					<div className="grid gap-6 md:grid-cols-2">
						<Card>
							<CardHeader>
								<CardTitle>Controls</CardTitle>
								<CardDescription>
									Shared primitives from the UI package.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-4">
								<div className="flex flex-wrap gap-2">
									<Button>Default</Button>
									<Button variant="secondary">Secondary</Button>
									<Button variant="outline">Outline</Button>
								</div>
								<Input aria-label="Playground input" placeholder="Input" />
								<Textarea
									aria-label="Playground textarea"
									placeholder="Textarea"
								/>
								<div className="flex items-center gap-3">
									<Switch id="preview-switch" />
									<label
										className="font-medium text-sm"
										htmlFor="preview-switch"
									>
										Preview switch
									</label>
								</div>
								<Button
									type="button"
									variant="outline"
									onClick={() => toast.success("Toast rendered")}
								>
									Show toast
								</Button>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Overlays</CardTitle>
								<CardDescription>
									Radix backed dialog and menu components.
								</CardDescription>
							</CardHeader>
							<CardContent className="flex flex-wrap gap-2">
								<Dialog>
									<DialogTrigger asChild>
										<Button variant="outline">Open dialog</Button>
									</DialogTrigger>
									<DialogContent>
										<DialogHeader>
											<DialogTitle>Shared dialog</DialogTitle>
											<DialogDescription>
												This dialog is exported by @ts-foundry/ui.
											</DialogDescription>
										</DialogHeader>
									</DialogContent>
								</Dialog>

								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="outline">Open menu</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent>
										<DropdownMenuItem>First action</DropdownMenuItem>
										<DropdownMenuItem>Second action</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</CardContent>
						</Card>
					</div>

					<Card>
						<CardHeader>
							<CardTitle>States</CardTitle>
						</CardHeader>
						<CardContent>
							<Tabs defaultValue="alert">
								<TabsList>
									<TabsTrigger value="alert">Alert</TabsTrigger>
									<TabsTrigger value="badge">Badge</TabsTrigger>
								</TabsList>
								<TabsContent value="alert">
									<Alert>
										<AlertTitle>Foundation alert</AlertTitle>
										<AlertDescription>
											Components share the same Tailwind v4 tokens.
										</AlertDescription>
									</Alert>
								</TabsContent>
								<TabsContent value="badge">
									<div className="flex gap-2">
										<Badge>Default</Badge>
										<Badge variant="secondary">Secondary</Badge>
										<Badge variant="outline">Outline</Badge>
									</div>
								</TabsContent>
							</Tabs>
						</CardContent>
					</Card>
				</section>
			</main>
			<Toaster />
		</ThemeProvider>
	);
}
