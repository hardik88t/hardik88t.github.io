<script lang="ts">
	import { pipeline as steps } from '$lib/content';
	import { sim, stageCounts } from '$lib/state/sim.svelte';

	/** When true, each stage shows how many simulated agents are in it right now. */
	let { live = false }: { live?: boolean } = $props();
	const counts = $derived(live ? stageCounts() : []);
</script>

<ol class="pipe" aria-label="Delivery pipeline, eight stages">
	{#each steps as s, i (s.id)}
		{@const n = counts[i] ?? 0}
		<li class="step" class:busy={live && n > 0}>
			<span class="node" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
			<div class="step-body">
				<p class="step-head">
					<span class="step-title">{s.title}</span>
					{#if live}
						<span class="step-count tabular" aria-label="{n} simulated agents in this stage">{n}</span>
					{/if}
				</p>
				<p class="step-label">{s.label}</p>
				<details class="step-more">
					<summary>What happens</summary>
					<p>{s.detail}</p>
					<p class="artifacts">
						{#each s.artifacts as a (a)}<span class="chip">{a}</span>{/each}
					</p>
				</details>
			</div>
		</li>
	{/each}
</ol>

<style>
	.pipe {
		position: relative;
		display: grid;
		gap: 0;
	}
	.step {
		position: relative;
		display: grid;
		grid-template-columns: 30px minmax(0, 1fr);
		gap: 12px;
		padding: 0 0 14px;
	}
	.step::before {
		content: '';
		position: absolute;
		left: 14px;
		top: 30px;
		bottom: 0;
		width: 2px;
		background: var(--line);
	}
	.step:last-child::before {
		display: none;
	}
	.node {
		position: relative;
		z-index: 1;
		display: grid;
		place-items: center;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		border: 1px solid var(--win-line);
		background: var(--win);
		font-family: var(--font-mono);
		font-size: 10.5px;
		color: var(--ink-2);
		transition:
			background-color 300ms ease,
			border-color 300ms ease,
			color 300ms ease;
	}
	.step.busy .node {
		background: var(--accent);
		border-color: var(--accent);
		color: var(--on-accent);
	}
	.step-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		min-height: 30px;
	}
	.step-title {
		font-weight: 700;
		font-size: 15px;
		letter-spacing: -0.01em;
	}
	.step-count {
		min-width: 22px;
		padding: 0 7px;
		border-radius: 999px;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		line-height: 20px;
		background: var(--accent-soft);
		color: var(--accent-ink);
	}
	.step-label {
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.4;
	}
	.step-more {
		margin-top: 6px;
	}
	.step-more summary {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		min-height: var(--touch);
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-ink);
		list-style: none;
	}
	.step-more summary::-webkit-details-marker {
		display: none;
	}
	.step-more summary::after {
		content: '+';
		margin-left: 6px;
		font-family: var(--font-mono);
	}
	.step-more[open] summary::after {
		content: '-';
	}
	.step-more p {
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.55;
		padding-bottom: 6px;
	}
	.artifacts {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}

	/* Wide containers: eight stages in a single rail. */
	@container (min-width: 640px) {
		.pipe {
			grid-template-columns: repeat(8, minmax(0, 1fr));
			gap: 0 4px;
		}
		.step {
			grid-template-columns: 1fr;
			gap: 10px;
			padding: 0;
		}
		.step::before {
			top: 14px;
			left: 30px;
			right: -4px;
			bottom: auto;
			width: auto;
			height: 2px;
		}
		.node {
			width: 30px;
			height: 30px;
		}
		.step-head {
			flex-direction: column;
			align-items: flex-start;
			justify-content: flex-start;
			gap: 2px;
			min-height: 0;
		}
		.step-title {
			font-size: 14px;
		}
		.step-label {
			font-size: 12.5px;
			min-height: 3.6em;
		}
		.step-more summary {
			font-size: 12px;
		}
		.step-more p {
			font-size: 12.5px;
		}
	}
</style>
