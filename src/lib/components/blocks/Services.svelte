<script lang="ts">
	import { content } from '$lib/content';
	import Heading, { type HLevel } from './Heading.svelte';
	import { openApp } from '$lib/state/ui.svelte';

	let { level = 2, cta = 'window' }: { level?: HLevel; cta?: 'window' | 'page' | 'none' } = $props();
</script>

<div class="services">
	{#each content.services as s, i (s.id)}
		<article class="svc" aria-labelledby="svc-{s.id}">
			<p class="svc-index mono">{String(i + 1).padStart(2, '0')}</p>
			<Heading level={level + 1 > 4 ? 4 : ((level + 1) as HLevel)} id="svc-{s.id}">{s.title}</Heading>
			<p class="svc-pitch">{s.pitch}</p>
			<ul class="svc-list">
				{#each s.includes as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</article>
	{/each}
</div>

{#if cta === 'window'}
	<div class="svc-cta">
		<button class="btn btn-primary" type="button" onclick={() => openApp('contact')}>Start a project</button>
	</div>
{:else if cta === 'page'}
	<div class="svc-cta">
		<a class="btn btn-primary" href="#contact">Start a project</a>
	</div>
{/if}

<style>
	.services {
		display: grid;
		gap: 14px;
		grid-template-columns: minmax(0, 1fr);
	}
	.svc {
		display: grid;
		gap: 8px;
		padding: 18px 18px 16px;
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		background: var(--win);
		box-shadow: var(--shadow-soft);
		align-content: start;
	}
	.svc-index {
		font-size: 11px;
		color: var(--accent-ink);
	}
	.svc-pitch {
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.55;
	}
	.svc-list {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
		margin-top: 4px;
	}
	.svc-list li {
		padding: 4px 10px;
		border-radius: 999px;
		background: var(--chip);
		border: 1px solid var(--chip-line);
		font-size: 12.5px;
		color: var(--ink-2);
	}
	.svc-cta {
		margin-top: 16px;
	}
	@container (min-width: 480px) {
		.services {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
	@media (min-width: 720px) {
		.services {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
