<script lang="ts">
	import { artKind, type Project } from '$lib/content';

	let { project, compact = false }: { project: Project; compact?: boolean } = $props();
	const kind = $derived(artKind(project));
</script>

<figure class="art" class:compact style="--p: {project.accent}" aria-hidden="true">
	<svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet">
		{#if kind === 'phone'}
			<rect class="s-win" x="50" y="7" width="60" height="86" rx="10" />
			<rect class="s-ink" x="72" y="11" width="16" height="3" rx="1.5" />
			<rect class="s-p" x="58" y="20" width="44" height="22" rx="5" />
			<rect class="s-line" x="58" y="48" width="44" height="6" rx="3" />
			<rect class="s-line" x="58" y="58" width="30" height="6" rx="3" />
			<circle class="s-p-soft" cx="66" cy="78" r="6" />
			<circle class="s-p-soft" cx="80" cy="78" r="6" />
			<circle class="s-p-soft" cx="94" cy="78" r="6" />
			<circle class="s-p" cx="26" cy="32" r="10" />
			<rect class="s-line" x="116" y="28" width="26" height="6" rx="3" />
			<rect class="s-line" x="116" y="38" width="18" height="6" rx="3" />
		{:else if kind === 'window'}
			<rect class="s-win" x="14" y="13" width="132" height="76" rx="8" />
			<rect class="s-p" x="14" y="13" width="132" height="11" rx="5" />
			<rect class="s-p-soft" x="14" y="24" width="30" height="65" />
			<rect class="s-line" x="50" y="33" width="88" height="8" rx="4" />
			<rect class="s-p" x="50" y="50" width="40" height="22" rx="4" />
			<rect class="s-line" x="96" y="50" width="42" height="22" rx="4" />
			<rect class="s-line" x="50" y="78" width="88" height="5" rx="2.5" />
		{:else if kind === 'cli'}
			<rect class="s-term" x="14" y="15" width="132" height="70" rx="8" />
			<circle class="s-light-r" cx="23" cy="22" r="2.2" />
			<circle class="s-light-y" cx="30" cy="22" r="2.2" />
			<circle class="s-light-g" cx="37" cy="22" r="2.2" />
			<path class="s-term-p" d="M22 36 l6 4 -6 4" />
			<rect class="s-term-ink" x="34" y="38" width="62" height="4" rx="2" />
			<rect class="s-term-dim" x="22" y="50" width="88" height="4" rx="2" />
			<rect class="s-term-dim" x="22" y="59" width="70" height="4" rx="2" />
			<rect class="s-p" x="22" y="70" width="6" height="7" />
			<rect class="s-term-dim" x="34" y="72" width="46" height="3" rx="1.5" />
		{:else if kind === 'chart'}
			<rect class="s-win" x="14" y="14" width="132" height="72" rx="8" />
			<rect class="s-p-soft" x="24" y="26" width="16" height="50" rx="3" />
			<rect class="s-p-soft" x="46" y="44" width="16" height="32" rx="3" />
			<rect class="s-p-soft" x="68" y="34" width="16" height="42" rx="3" />
			<rect class="s-p-soft" x="90" y="52" width="16" height="24" rx="3" />
			<rect class="s-p" x="112" y="30" width="16" height="46" rx="3" />
			<polyline class="s-stroke" points="32,56 54,44 76,50 98,36 120,27" />
		{:else if kind === 'graph'}
			<path class="s-edge" d="M40 50 L100 26 M40 50 L110 70 M40 50 L72 82 M40 50 L124 44 M100 26 L124 44 M110 70 L72 82" />
			<circle class="s-p" cx="40" cy="50" r="10" />
			<circle class="s-win-ring" cx="100" cy="26" r="6" />
			<circle class="s-win-ring" cx="110" cy="70" r="6" />
			<circle class="s-win-ring" cx="72" cy="82" r="5" />
			<circle class="s-p-soft" cx="124" cy="44" r="7" />
			<circle class="s-ink" cx="20" cy="22" r="2.5" />
			<circle class="s-ink" cx="142" cy="84" r="2.5" />
		{:else if kind === 'chat'}
			<rect class="s-win-ring" x="18" y="16" width="72" height="16" rx="8" />
			<rect class="s-p" x="50" y="38" width="92" height="17" rx="8.5" />
			<rect class="s-win-ring" x="18" y="61" width="62" height="13" rx="6.5" />
			<rect class="s-line" x="40" y="80" width="92" height="9" rx="4.5" />
		{:else if kind === 'site'}
			<rect class="s-win" x="14" y="13" width="132" height="76" rx="8" />
			<rect class="s-line" x="22" y="19" width="22" height="5" rx="2.5" />
			<rect class="s-line" x="104" y="19" width="34" height="5" rx="2.5" />
			<rect class="s-p-soft" x="22" y="30" width="116" height="34" rx="6" />
			<rect class="s-ink" x="30" y="39" width="54" height="6" rx="3" />
			<rect class="s-ink" x="30" y="49" width="36" height="4" rx="2" />
			<rect class="s-p" x="30" y="55" width="26" height="6" rx="3" />
			<rect class="s-win-ring" x="22" y="71" width="36" height="14" rx="4" />
			<rect class="s-win-ring" x="62" y="71" width="36" height="14" rx="4" />
			<rect class="s-win-ring" x="102" y="71" width="36" height="14" rx="4" />
		{:else if kind === 'dash'}
			<rect class="s-win" x="14" y="13" width="132" height="76" rx="8" />
			<rect class="s-p-soft" x="14" y="13" width="28" height="76" rx="8" />
			<rect class="s-win-ring" x="50" y="20" width="32" height="20" rx="5" />
			<rect class="s-win-ring" x="86" y="20" width="32" height="20" rx="5" />
			<rect class="s-win-ring" x="122" y="20" width="24" height="20" rx="5" />
			<path class="s-area" d="M50 84 L50 60 L70 66 L90 50 L110 56 L130 40 L146 44 L146 84 Z" />
			<polyline class="s-stroke" points="50,60 70,66 90,50 110,56 130,40 146,44" />
		{:else}
			<rect class="s-p" x="18" y="18" width="56" height="20" rx="10" />
			<rect class="s-p-soft" x="84" y="22" width="48" height="12" rx="6" />
			<circle class="s-p-soft" cx="88" cy="28" r="4" />
			<rect class="s-win-ring" x="18" y="48" width="124" height="18" rx="6" />
			<rect class="s-line" x="26" y="55" width="40" height="4" rx="2" />
			<rect class="s-win-ring" x="18" y="74" width="58" height="16" rx="6" />
			<rect class="s-p" x="84" y="74" width="58" height="16" rx="6" />
		{/if}
	</svg>
</figure>

<style>
	.art {
		margin: 0;
		position: relative;
		aspect-ratio: 16 / 10;
		border-radius: var(--r-sm);
		overflow: hidden;
		background: linear-gradient(
			155deg,
			color-mix(in srgb, var(--p) 26%, var(--win)) 0%,
			color-mix(in srgb, var(--p) 6%, var(--win-2)) 100%
		);
		border: 1px solid color-mix(in srgb, var(--p) 22%, var(--line));
	}
	.art svg {
		width: 100%;
		height: 100%;
	}
	.art.compact {
		aspect-ratio: 16 / 9;
	}
	.s-win {
		fill: var(--win);
		stroke: var(--win-line);
		stroke-width: 1;
	}
	.s-win-ring {
		fill: var(--win);
		stroke: color-mix(in srgb, var(--p) 45%, var(--win-line));
		stroke-width: 1.2;
	}
	.s-p {
		fill: var(--p);
	}
	.s-p-soft {
		fill: var(--p);
		opacity: 0.2;
	}
	.s-line {
		fill: var(--ink);
		opacity: 0.1;
	}
	.s-ink {
		fill: var(--ink);
		opacity: 0.55;
	}
	.s-term {
		fill: var(--term-bg);
	}
	.s-term-ink {
		fill: var(--term-ink);
		opacity: 0.8;
	}
	.s-term-dim {
		fill: var(--term-dim);
		opacity: 0.6;
	}
	.s-term-p {
		fill: none;
		stroke: var(--term-accent);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.s-light-r {
		fill: var(--light-close);
	}
	.s-light-y {
		fill: var(--light-min);
	}
	.s-light-g {
		fill: var(--light-zoom);
	}
	.s-stroke {
		fill: none;
		stroke: var(--p);
		stroke-width: 2;
		stroke-linejoin: round;
		stroke-linecap: round;
	}
	.s-area {
		fill: var(--p);
		opacity: 0.18;
	}
	.s-edge {
		stroke: var(--ink);
		stroke-opacity: 0.28;
		stroke-width: 1.2;
		fill: none;
	}
</style>
