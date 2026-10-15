<script lang="ts">
	import { live } from '$lib/actions/live';
	import { pipeline } from '$lib/content';
	import { stageCounts } from '$lib/state/sim.svelte';
	import { openApp } from '$lib/state/ui.svelte';

	// One dot per simulated agent currently in each stage.
	const counts = $derived(stageCounts());
	const busy = $derived(counts.reduce((a, b) => a + b, 0));
</script>

<button
	type="button"
	class="strip"
	use:live
	onclick={() => openApp('agents')}
	aria-label="Pipeline now: {busy} simulated agents across eight stages. Open the activity monitor"
>
	<span class="head">
		<span class="eyebrow">Pipeline now</span>
		<span class="go">Agents</span>
	</span>
	<span class="cols" aria-hidden="true">
		{#each pipeline as s, i (s.id)}
			<span class="col">
				<span class="stack">
					{#each Array(counts[i]) as _, k (k)}
						<span class="dot"></span>
					{/each}
				</span>
				<span class="lab">{s.title}</span>
			</span>
		{/each}
	</span>
</button>

<style>
	.strip {
		display: grid;
		gap: 10px;
		width: 100%;
		padding: 14px 16px 12px;
		border-radius: 20px;
		border: 1px solid var(--win-line);
		background: color-mix(in srgb, var(--win) 86%, transparent);
		box-shadow: var(--shadow-soft);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		color: var(--ink);
		text-align: left;
	}
	.head {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	.go {
		font-size: 13px;
		font-weight: 600;
		color: var(--accent-ink);
	}
	.cols {
		display: grid;
		grid-template-columns: repeat(8, minmax(0, 1fr));
		gap: 6px;
		height: 96px;
	}
	.col {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		gap: 6px;
		min-width: 0;
	}
	.stack {
		display: flex;
		flex-direction: column-reverse;
		align-items: center;
		justify-content: flex-start;
		gap: 4px;
		padding-bottom: 6px;
		border-bottom: 2px solid var(--chip-line);
		min-height: 0;
		overflow: hidden;
	}
	.dot {
		flex: none;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--accent);
		animation: drop 420ms var(--ease-out);
	}
	.lab {
		font-size: 10px;
		font-weight: 600;
		color: var(--ink-3);
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		letter-spacing: -0.01em;
	}
	@keyframes drop {
		from {
			transform: translateY(-6px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.dot {
			animation: none;
		}
	}
</style>
