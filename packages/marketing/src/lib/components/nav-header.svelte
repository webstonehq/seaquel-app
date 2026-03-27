<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import * as NavigationMenu from "$lib/components/ui/navigation-menu";
	import ThemeToggle from "$lib/components/theme-toggle.svelte";
	import DownloadDropdown from "$lib/components/download-dropdown.svelte";
	import { featureCategories } from "$lib/features";
	import { GithubIcon, MenuIcon, XIcon } from "lucide-svelte";
	import Logo from "./logo.svelte";

	let mobileMenuOpen = $state(false);
</script>

<header class="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
	<div class="container mx-auto px-4 md:px-6">
		<div class="flex h-16 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
				<Logo class="size-8 text-primary" />
				<span class="text-xl font-bold">Seaquel</span>
			</a>

			<!-- Navigation - Desktop -->
			<NavigationMenu.Root class="hidden md:flex">
				<NavigationMenu.List>
					<NavigationMenu.Item>
						<NavigationMenu.Trigger class="bg-transparent">Product</NavigationMenu.Trigger>
						<NavigationMenu.Content class="p-0">
							<div class="bg-muted/50 p-1 pr-1.5 dark:bg-background">
								<div class="grid w-[42rem] grid-cols-2 gap-2 rounded-lg border bg-popover p-2 shadow">
									{#each featureCategories as category (category.slug)}
										<NavigationMenu.Link>
											<a href="/features/{category.slug}" class="flex items-center gap-x-2 rounded-md p-2 hover:bg-muted transition-colors">
												<div class="flex aspect-square size-9 items-center justify-center rounded-md border bg-card text-sm shadow-sm">
													<category.icon class="size-4 text-foreground" />
												</div>
												<div class="flex flex-col items-start justify-center">
													<span class="font-medium text-sm">{category.title}</span>
													<span class="line-clamp-1 text-xs text-muted-foreground">{category.description}</span>
												</div>
											</a>
										</NavigationMenu.Link>
									{/each}
								</div>
								<div class="p-2">
									<p class="text-sm text-muted-foreground">
										Free for personal use.
										<a class="font-medium text-foreground hover:underline" href="/download">
											Try it today
										</a>
									</p>
								</div>
							</div>
						</NavigationMenu.Content>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link class="rounded-md p-2 px-4 hover:bg-accent">
							{#snippet child({ props })}
								<a href="/learn-sql" {...props}>Learn SQL</a>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link class="rounded-md p-2 px-4 hover:bg-accent">
							{#snippet child({ props })}
								<a href="/pricing" {...props}>Pricing</a>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link class="rounded-md p-2 px-4 hover:bg-accent">
							{#snippet child({ props })}
								<a href="/changelog" {...props}>Changelog</a>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link class="rounded-md p-2 px-4 hover:bg-accent">
							{#snippet child({ props })}
								<a href="/docs" {...props}>Docs</a>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
					<NavigationMenu.Item>
						<NavigationMenu.Link class="rounded-md p-2 px-4 hover:bg-accent">
							{#snippet child({ props })}
								<a href="https://github.com/webstonehq/seaquel" target="_blank" class="flex items-center gap-1.5" {...props}>
									<GithubIcon class="size-4" />
									GitHub
								</a>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				</NavigationMenu.List>
			</NavigationMenu.Root>

			<!-- Actions -->
			<div class="flex items-center gap-3">
				<ThemeToggle />

				<!-- Download CTA - Desktop Only -->
				<div class="hidden md:block">
					<DownloadDropdown size="sm" />
				</div>

				<!-- Mobile Menu Toggle -->
				<Button
					variant="ghost"
					size="icon"
					class="md:hidden"
					onclick={() => mobileMenuOpen = !mobileMenuOpen}
				>
					{#if mobileMenuOpen}
						<XIcon class="size-5" />
					{:else}
						<MenuIcon class="size-5" />
					{/if}
				</Button>
			</div>
		</div>

		<!-- Mobile Menu -->
		{#if mobileMenuOpen}
			<div class="md:hidden py-4 border-t">
				<nav class="flex flex-col gap-2">
					<a href="/features" class="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted" onclick={() => mobileMenuOpen = false}>Product</a>
					<a href="/learn-sql" class="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted" onclick={() => mobileMenuOpen = false}>Learn SQL</a>
					<a href="/pricing" class="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted" onclick={() => mobileMenuOpen = false}>Pricing</a>
					<a href="/changelog" class="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted" onclick={() => mobileMenuOpen = false}>Changelog</a>
					<a href="/docs" class="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted" onclick={() => mobileMenuOpen = false}>Docs</a>
					<a href="https://github.com/webstonehq/seaquel" target="_blank" class="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-muted flex items-center gap-2">
						<GithubIcon class="size-4" />
						GitHub
					</a>
					<div class="border-t my-2"></div>
					<DownloadDropdown class="w-full" />
				</nav>
			</div>
		{/if}
	</div>
</header>
