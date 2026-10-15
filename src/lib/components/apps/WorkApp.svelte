<script lang="ts">
	import { categoryLabel, projectBySlug, projectCategories, projects, type Project } from '$lib/content';
	import { ui } from '$lib/state/ui.svelte';
	import ProjectArt from '../ProjectArt.svelte';
	import ProjectDetail from '../blocks/ProjectDetail.svelte';
	import Icon from '../Icon.svelte';

	let { variant = 'window' }: { variant?: 'window' | 'sheet' } = $props();

	let filter = $state<string>('all');
	let detailOpen = $state(false);

	const visible = $derived(
		filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter))
	);
	const selected = $derived<Project | undefined>(projectBySlug(ui.project) ?? visible[0]);

	function pick(p: Project) {
		ui.project = p.slug;
		detailOpen = true;
	}
	function back() {
		detailOpen = false;
	}
</script>

<div class="work" class:sheet={variant === 'sheet'} class:detail-open={detailOpen}>
	<h2 class="sr-only">Selected work</h2>

	<nav class="side" aria-label="Filter by category">
		<p class="side-h eyebrow">Categories</p>
		<ul>
			<li>
				<button type="button" class="side-btn" aria-pressed={filter === 'all'} onclick={() => (filter = 'all')}>
					<Icon name="grid" size={15} />
					<span>All projects</span>
					<span class="count tabular">{projects.length}</span>
				</button>
			</li>
			{#each projectCategories as c (c)}
				<li>
					<button type="button" class="side-btn" aria-pressed={filter === c} onclick={() => (filter = c)}>
						<Icon name="folder" size={15} />
						<span>{categoryLabel(c)}</span>
						<span class="count tabular">{projects.filter((p) => p.categories.includes(c)).length}</span>
					</button>
				</li>
			{/each}
		</ul>
	</nav>

	<div class="list-pane">
		<div class="list-head">
			<p class="list-meta eyebrow">{visible.length} items</p>
		</div>
		<ul class="grid" aria-label="Projects">
			{#each visible as p (p.slug)}
				<li>
					<button
						type="button"
						class="tile"
						class:sel={selected?.slug === p.slug}
						aria-current={selected?.slug === p.slug ? 'true' : undefined}
						onclick={() => pick(p)}
					>
						<ProjectArt project={p} compact />
						<span class="tile-name">{p.title}</span>
						<span class="tile-kind">{p.categories.slice(0, 2).map(categoryLabel).join(' · ')}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>

	<div class="detail-pane">
		<div class="detail-bar">
			<button type="button" class="back-btn" onclick={back}>
				<Icon name="chevron-left" size={16} />
				<span>All projects</span>
			</button>
		</div>
		{#if selected}
			<div class="detail-inner">
				<ProjectDetail project={selected} level={2} art={true} />
			</div>
		{/if}
	</div>
</div>

<style>
	.work {
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		min-height: 100%;
	}
	.side {
		display: none;
	}
	.list-pane {
		min-width: 0;
		padding: 16px;
		display: grid;
		gap: 12px;
		align-content: start;
	}
	.list-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.detail-bar {
		display: none;
	}
	.back-btn {
		display: none;
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 12px;
	}
	.tile {
		display: grid;
		gap: 8px;
		width: 100%;
		padding: 8px;
		text-align: left;
		border-radius: var(--r-md);
		border: 1px solid transparent;
		background: transparent;
		color: var(--ink);
		transition:
			background-color 160ms ease,
			border-color 160ms ease;
	}
	.tile:hover {
		background: var(--win-2);
	}
	.tile.sel {
		background: var(--accent-soft);
		border-color: color-mix(in srgb, var(--accent) 40%, transparent);
	}
	.tile-name {
		font-weight: 650;
		font-size: 14px;
		line-height: 1.25;
		padding: 0 2px;
	}
	.tile-kind {
		font-size: 11.5px;
		color: var(--ink-3);
		padding: 0 2px;
	}
	.detail-pane {
		display: none;
	}
	.detail-inner {
		padding: 22px;
	}
	.detail-pane .detail-inner {
		padding: 22px;
	}

	/* Wide window: sidebar, file grid and preview side by side. */
	@container (min-width: 700px) {
		.work {
			grid-template-columns: 170px minmax(0, 1fr) minmax(0, 330px);
		}
		.side {
			display: block;
			padding: 16px 12px;
			border-right: 1px solid var(--line);
			background: var(--win-2);
		}
		.side-h {
			padding: 0 8px 8px;
		}
		.side ul {
			display: grid;
			gap: 2px;
		}
		.side-btn {
			display: grid;
			grid-template-columns: 18px minmax(0, 1fr) auto;
			align-items: center;
			gap: 8px;
			width: 100%;
			min-height: 34px;
			padding: 6px 8px;
			border: 0;
			border-radius: var(--r-xs);
			background: transparent;
			color: var(--ink-2);
			font-size: 13.5px;
			text-align: left;
		}
		.side-btn:hover {
			background: var(--chip);
		}
		.side-btn[aria-pressed='true'] {
			background: var(--accent-soft);
			color: var(--accent-ink);
			font-weight: 650;
		}
		.count {
			font-size: 12px;
			color: var(--ink-3);
		}
		.list-pane {
			border-right: 1px solid var(--line);
		}
		.detail-pane {
			display: block;
			background: var(--win);
		}
		.grid {
			grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
		}
	}

	/* Narrow (phone sheet): the list and the detail take turns. */
	@container (max-width: 699px) {
		.work {
			grid-template-columns: minmax(0, 1fr);
		}
		.list-pane {
			padding: 14px var(--gutter, 16px) 20px;
		}
		.work.detail-open .list-pane {
			display: none;
		}
		.work:not(.detail-open) .detail-pane {
			display: none;
		}
		.work.detail-open .detail-pane {
			display: block;
			padding: 14px 16px 24px;
		}
		.work.detail-open .detail-bar {
			display: block;
			padding: 0 0 6px;
		}
		.work.detail-open .back-btn {
			display: inline-flex;
		}
		.back-btn {
			display: none;
			align-items: center;
			gap: 2px;
			min-height: var(--touch);
			padding: 0 8px 0 2px;
			border: 0;
			background: transparent;
			color: var(--accent-ink);
			font-weight: 600;
			font-size: 15px;
		}
		.list-meta {
			display: none;
		}
		.work.detail-open .list-head {
			justify-content: flex-start;
		}
		.work.detail-open .grid {
			display: none;
		}
		.work.detail-open .side {
			display: none;
		}
		.side {
			display: block;
			padding: 12px 0 10px;
			border-bottom: 1px solid var(--line);
			background: var(--win-2);
		}
		.side-h {
			display: none;
		}
		.side ul {
			display: flex;
			gap: 8px;
			overflow-x: auto;
			padding: 0 var(--gutter, 16px);
			scrollbar-width: none;
		}
		.side li {
			flex: none;
		}
		.side-btn {
			display: inline-flex;
			align-items: center;
			gap: 6px;
			min-height: var(--touch);
			padding: 0 14px;
			border-radius: 999px;
			border: 1px solid var(--chip-line);
			background: var(--win);
			color: var(--ink-2);
			font-size: 14px;
			font-weight: 500;
			white-space: nowrap;
		}
		.side-btn[aria-pressed='true'] {
			background: var(--accent);
			border-color: var(--accent);
			color: var(--on-accent);
		}
		.side-btn :global(svg),
		.count {
			display: none;
		}
	}
</style>
