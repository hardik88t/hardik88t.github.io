<script lang="ts">
	import { content, formatMetric } from '$lib/content';

	let { count, compact = false }: { count?: number; compact?: boolean } = $props();
	const items = $derived(count ? content.agentic.metrics.slice(0, count) : content.agentic.metrics);
</script>

<ul class="metrics" class:compact>
	{#each items as m (m.label)}
		<li class="metric">
			<span class="metric-value tabular">{formatMetric(m)}</span>
			<span class="metric-label">{m.label}</span>
			{#if !compact}<span class="metric-context">{m.context}</span>{/if}
		</li>
	{/each}
</ul>

<style>
	.metrics {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		background: var(--win);
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		overflow: hidden;
	}
	.metric {
		display: grid;
		gap: 2px;
		align-content: start;
		padding: 14px 14px 13px;
		box-shadow: inset -1px -1px 0 var(--line);
	}
	@media (min-width: 640px) {
		.metrics {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
	@media (min-width: 1100px) {
		.metrics {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
	.metric-value {
		font-size: clamp(1.45rem, 2.6vw, 2rem);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.1;
		color: var(--ink);
	}
	.metric-label {
		font-weight: 600;
		font-size: 13.5px;
		color: var(--ink);
	}
	.metric-context {
		font-size: 12.5px;
		color: var(--ink-3);
		line-height: 1.35;
	}
	.metrics.compact .metric {
		padding: 10px 12px;
	}
	.metrics.compact .metric-value {
		font-size: 1.35rem;
	}
</style>
