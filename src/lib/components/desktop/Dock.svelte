<script lang="ts">
	import { APPS, DOCK_APPS } from '$lib/state/apps';
	import { findWin, openWin, wm } from '$lib/state/wm.svelte';
	import { ui } from '$lib/state/ui.svelte';
	import Icon from '../Icon.svelte';

	let navEl = $state<HTMLElement>();

	// Magnification: icons nearest the pointer grow, like a dock should.
	function magnify(e: PointerEvent) {
		if (ui.reduced || !navEl) return;
		for (const el of navEl.querySelectorAll<HTMLElement>('.dock-ico')) {
			const r = el.getBoundingClientRect();
			const d = Math.abs(e.clientX - (r.left + r.width / 2));
			const k = Math.max(0, 1 - d / 120);
			el.style.setProperty('--s', (1 + 0.45 * k * k).toFixed(3));
		}
	}

	function reset() {
		navEl?.querySelectorAll<HTMLElement>('.dock-ico').forEach((el) => el.style.setProperty('--s', '1'));
	}
</script>

<nav class="dock" aria-label="Dock" bind:this={navEl} onpointermove={magnify} onpointerleave={reset}>
	<ul>
		{#each DOCK_APPS as id (id)}
			{@const def = APPS[id]}
			{@const win = wm.windows.find((w) => w.app === id)}
			<li>
				<button
					type="button"
					class="dock-item"
					data-dock={id}
					aria-label={win ? (win.min ? `${def.name}, minimised` : `${def.name}, open`) : def.name}
					onclick={() => openWin(id)}
				>
					<span class="dock-ico" style:--tint={def.tint} style:--glyph={def.glyph}>
						<Icon name={def.icon} size={26} />
					</span>
					<span class="tip" aria-hidden="true">{def.name}</span>
					<span class="pip" class:on={Boolean(win) && !(win?.min)} aria-hidden="true"></span>
				</button>
			</li>
		{/each}
	</ul>
</nav>

<style>
	.dock {
		position: absolute;
		left: 50%;
		bottom: 10px;
		transform: translateX(-50%);
		z-index: 400;
		padding: 6px 10px 5px;
		border-radius: 22px;
		background: var(--dock);
		backdrop-filter: saturate(180%) blur(24px);
		-webkit-backdrop-filter: saturate(180%) blur(24px);
		border: 1px solid var(--dock-line);
		box-shadow: var(--shadow-dock);
		max-width: calc(100vw - 16px);
	}
	.dock ul {
		display: flex;
		align-items: flex-end;
		gap: 4px;
	}
	.dock-item {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		width: 60px;
		padding: 0;
		border: 0;
		background: transparent;
	}
	.dock-ico {
		display: grid;
		place-items: center;
		width: 52px;
		height: 52px;
		border-radius: 14px;
		background: linear-gradient(160deg, color-mix(in srgb, var(--tint) 82%, var(--white)) 0%, var(--tint) 100%);
		color: var(--glyph);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--white) 35%, transparent),
			0 2px 6px rgba(0, 0, 0, 0.16);
		transform: scale(var(--s, 1));
		transform-origin: 50% 100%;
		transition: transform 140ms var(--ease-out);
	}
	.dock-item:hover .dock-ico,
	.dock-item:focus-visible .dock-ico {
		filter: brightness(1.04);
	}
	.dock-item:focus-visible {
		outline-offset: 4px;
		border-radius: 14px;
	}
	.tip {
		position: absolute;
		bottom: calc(100% + 8px);
		left: 50%;
		transform: translate(-50%, 4px);
		padding: 4px 9px;
		border-radius: 7px;
		background: var(--ink);
		color: var(--desk);
		font-size: 12px;
		font-weight: 600;
		white-space: nowrap;
		opacity: 0;
		pointer-events: none;
		transition:
			opacity 140ms ease,
			transform 140ms var(--ease-out);
	}
	.dock-item:hover .tip,
	.dock-item:focus-visible .tip {
		opacity: 1;
		transform: translate(-50%, 0);
	}
	.pip {
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: var(--ink);
		opacity: 0;
		margin-top: 1px;
	}
	.pip.on {
		opacity: 0.6;
	}
	@media (prefers-reduced-motion: reduce) {
		.dock-ico,
		.tip {
			transition: none;
		}
	}
</style>
