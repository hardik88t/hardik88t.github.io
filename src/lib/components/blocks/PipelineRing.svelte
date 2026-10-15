<script lang="ts">
	import { agentic, pipeline } from '$lib/content';

	// Eight stages on a ring, starting at the top and running clockwise.
	const CX = 200;
	const CY = 176;
	const R = 110;
	const nodes = pipeline.map((s, i) => {
		const a = -Math.PI / 2 + (i * Math.PI) / 4;
		const cos = Math.cos(a);
		const sin = Math.sin(a);
		const lx = CX + (R + 40) * cos;
		const ly = CY + (R + 40) * sin;
		return {
			id: s.id,
			title: s.title,
			n: String(i + 1).padStart(2, '0'),
			x: CX + R * cos,
			y: CY + R * sin,
			lx,
			ly,
			anchor: cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle',
			base: sin > 0.3 ? 'hanging' : sin < -0.3 ? 'auto' : 'middle'
		};
	});
	const ring = nodes.map((n) => `${n.x.toFixed(1)},${n.y.toFixed(1)}`).join(' ');
</script>

<figure class="ring" aria-label="Eight delivery stages in a loop">
	<svg viewBox="0 0 400 352" role="img" aria-hidden="true" focusable="false">
		<circle class="track" cx={CX} cy={CY} r={R} />
		<polygon class="loop" points={ring} />
		{#each nodes as n, i (n.id)}
			<circle class="node-halo" style:animation-delay="{i * 0.9}s" cx={n.x} cy={n.y} r="16" />
			<circle class="node" cx={n.x} cy={n.y} r="16" />
			<text class="node-n" x={n.x} y={n.y + 4} text-anchor="middle">{n.n}</text>
			<text class="node-t" x={n.lx} y={n.ly} text-anchor={n.anchor} dominant-baseline={n.base}>{n.title}</text>
		{/each}
		<text class="core-n" x={CX} y={CY + 2} text-anchor="middle">{pipeline.length}</text>
		<text class="core-l" x={CX} y={CY + 26} text-anchor="middle">stages</text>
	</svg>
	<figcaption class="cap">
		One developer, {agentic.agents.length} agents, one loop. Every change passes every stage.
	</figcaption>
</figure>

<style>
	.ring {
		margin: 0;
		display: grid;
		gap: 10px;
		justify-items: center;
	}
	svg {
		width: 100%;
		max-width: 380px;
		height: auto;
		overflow: visible;
	}
	.track {
		fill: none;
		stroke: var(--line);
		stroke-width: 2;
	}
	.loop {
		fill: none;
		stroke: color-mix(in srgb, var(--accent) 35%, transparent);
		stroke-width: 1.5;
		stroke-dasharray: 3 5;
	}
	.node {
		fill: var(--win);
		stroke: var(--win-line);
		stroke-width: 1.5;
	}
	.node-halo {
		fill: var(--accent);
		opacity: 0;
		transform-box: fill-box;
		transform-origin: center;
		animation: pulse 7.2s ease-in-out infinite;
	}
	.node-n {
		font-family: var(--font-mono);
		font-size: 11px;
		fill: var(--ink-2);
	}
	.node-t {
		font-family: var(--font-ui);
		font-size: 13px;
		font-weight: 650;
		fill: var(--ink);
	}
	.core-n {
		font-family: var(--font-ui);
		font-size: 44px;
		font-weight: 700;
		letter-spacing: -0.04em;
		fill: var(--ink);
	}
	.core-l {
		font-family: var(--font-mono);
		font-size: 11px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--ink-3);
	}
	.cap {
		font-size: 13px;
		color: var(--ink-3);
		text-align: center;
		max-width: 34ch;
	}
	@keyframes pulse {
		0%,
		100% {
			opacity: 0;
		}
		4%,
		10% {
			opacity: 0.18;
		}
		16% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.node-halo {
			animation: none;
			opacity: 0;
		}
	}
</style>
