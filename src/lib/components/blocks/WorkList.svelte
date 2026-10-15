<script lang="ts">
	import { projects, type Project } from '$lib/content';
	import ProjectArt from '../ProjectArt.svelte';
	import ProjectDetail from './ProjectDetail.svelte';
	import Icon from '../Icon.svelte';

	const featured = projects.filter((p) => p.featured);
	const more = projects.filter((p) => !p.featured);
</script>

{#snippet card(p: Project)}
	<li>
		<details class="card" style="--p: {p.accent}">
			<summary>
				<span class="card-art"><ProjectArt project={p} compact /></span>
				<span class="card-text">
					<span class="card-title">{p.title}</span>
					<span class="card-one">{p.oneLiner}</span>
				</span>
				<span class="card-more" aria-hidden="true">
					<span class="more-open">Read more</span>
					<span class="more-close">Show less</span>
					<Icon name="chevron-right" size={14} />
				</span>
			</summary>
			<div class="card-body">
				<ProjectDetail project={p} level={4} art={false} />
			</div>
		</details>
	</li>
{/snippet}

<div class="work-list">
	<div class="grp">
		<h3 class="grp-title">Featured</h3>
		<ul class="cards">
			{#each featured as p (p.slug)}
				{@render card(p)}
			{/each}
		</ul>
	</div>

	<div class="grp">
		<h3 class="grp-title">More work</h3>
		<ul class="cards">
			{#each more as p (p.slug)}
				{@render card(p)}
			{/each}
		</ul>
	</div>
</div>

<style>
	.work-list {
		display: grid;
		gap: 28px;
	}
	.grp {
		display: grid;
		gap: 12px;
	}
	.grp-title {
		font-size: 14px;
		font-weight: 700;
		color: var(--ink-2);
	}
	.cards {
		display: grid;
		gap: 12px;
	}
	.card {
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		background: var(--win);
		box-shadow: var(--shadow-soft);
	}
	.card[open] {
		border-color: color-mix(in srgb, var(--p) 45%, var(--line));
	}
	.card summary {
		display: grid;
		grid-template-columns: 96px minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
		padding: 14px 18px 14px 14px;
		cursor: pointer;
		list-style: none;
		border-radius: var(--r-md);
	}
	.card summary::-webkit-details-marker {
		display: none;
	}
	.card-art {
		display: block;
		width: 96px;
	}
	.card-text {
		display: grid;
		gap: 4px;
		min-width: 0;
	}
	.card-title {
		font-weight: 700;
		font-size: 17px;
		letter-spacing: -0.01em;
	}
	.card-one {
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.card-more {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-ink);
		white-space: nowrap;
	}
	.card-more :global(svg) {
		transition: transform 200ms var(--ease-out);
	}
	.card[open] .more-open,
	.card:not([open]) .more-close {
		display: none;
	}
	.card[open] .card-more :global(svg) {
		transform: rotate(90deg);
	}
	.card-body {
		padding: 20px 20px 24px;
		border-top: 1px solid var(--line);
		max-width: 72ch;
	}
	.card summary:focus-visible {
		outline-offset: -2px;
	}
	@media (max-width: 560px) {
		.card summary {
			grid-template-columns: 76px minmax(0, 1fr) auto;
			gap: 12px;
			padding: 12px 12px 12px 12px;
		}
		.card-art {
			width: 76px;
		}
		.card-title {
			font-size: 16px;
		}
		.card-more .more-open,
		.card-more .more-close {
			display: none;
		}
	}
</style>
