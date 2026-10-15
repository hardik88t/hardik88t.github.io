<script lang="ts">
	import { APPS } from '$lib/state/apps';
	import { ui } from '$lib/state/ui.svelte';
	import { closeWin, focusWin, minimiseWin, moveWin, toggleZoom, wm, type Win } from '$lib/state/wm.svelte';
	import AppContent from '../apps/AppContent.svelte';

	let { win }: { win: Win } = $props();

	const def = $derived(APPS[win.app]);
	const titleId = $derived(`win-title-${win.app}`);
	let el = $state<HTMLElement>();
	let drag: { sx: number; sy: number; ox: number; oy: number } | null = null;

	// Take DOM focus when this window is opened or restored from the dock.
	$effect(() => {
		const req = wm.focusReq;
		if (req && req.app === win.app && !win.min && el) {
			el.focus({ preventScroll: true });
		}
	});

	function dockFocus() {
		document.querySelector<HTMLElement>(`[data-dock="${win.app}"]`)?.focus();
	}

	function close() {
		closeWin(win.app);
		dockFocus();
	}

	function minimise() {
		minimiseWin(win.app);
		dockFocus();
	}

	function onBarDown(e: PointerEvent) {
		if (e.button !== 0 || (e.target as HTMLElement).closest('button')) return;
		focusWin(win.app);
		if (win.max) return;
		drag = { sx: e.clientX, sy: e.clientY, ox: win.x, oy: win.y };
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onBarMove(e: PointerEvent) {
		if (!drag) return;
		moveWin(win.app, drag.ox + e.clientX - drag.sx, drag.oy + e.clientY - drag.sy);
	}

	function onBarUp() {
		drag = null;
	}

	function onKey(e: KeyboardEvent) {
		const t = e.target as HTMLElement;
		const typing = t.closest('input, textarea, select, [contenteditable="true"]');
		if (e.key === 'Escape' && !typing) {
			e.preventDefault();
			close();
		}
	}
</script>

<div
	bind:this={el}
	class="win"
	class:active={wm.active === win.app}
	class:zoomed={win.max}
	class:reduced={ui.reduced}
	role="dialog"
	aria-labelledby={titleId}
	tabindex="-1"
	hidden={win.min}
	style:left="{win.x}px"
	style:top="{win.y}px"
	style:width="{win.w}px"
	style:height="{win.h}px"
	style:z-index={win.z}
	onpointerdown={() => focusWin(win.app)}
	onkeydown={onKey}
>
	<header
		class="win-bar"
		role="presentation"
		onpointerdown={onBarDown}
		onpointermove={onBarMove}
		onpointerup={onBarUp}
		onpointercancel={onBarUp}
		ondblclick={(e) => {
			if (!(e.target as HTMLElement).closest('button')) toggleZoom(win.app);
		}}
	>
		<div class="lights">
			<button type="button" class="light l-close" aria-label="Close {def.title}" onclick={close}>
				<span aria-hidden="true">×</span>
			</button>
			<button type="button" class="light l-min" aria-label="Minimise {def.title}" onclick={minimise}>
				<span aria-hidden="true">–</span>
			</button>
			<button
				type="button"
				class="light l-zoom"
				aria-label={win.max ? `Restore ${def.title}` : `Maximise ${def.title}`}
				onclick={() => toggleZoom(win.app)}
			>
				<span aria-hidden="true">+</span>
			</button>
		</div>
		<p class="win-title" id={titleId}>{def.title}</p>
		<span class="win-spacer" aria-hidden="true"></span>
	</header>
	<div class="win-body">
		<AppContent app={win.app} />
	</div>
</div>

<style>
	.win {
		position: absolute;
		display: flex;
		flex-direction: column;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
		border-radius: var(--r-win);
		background: var(--win);
		border: 1px solid var(--win-line);
		box-shadow: var(--shadow-win);
		animation: winIn 220ms var(--ease-out);
		transition: box-shadow 200ms ease;
	}
	.win[hidden] {
		display: none;
	}
	.win:not(.active) {
		box-shadow: 0 1px 1px rgba(16, 24, 40, 0.05), 0 6px 18px rgba(16, 24, 40, 0.07);
	}
	.win.zoomed {
		border-radius: 0;
		border-left: 0;
		border-right: 0;
	}
	.win:focus {
		outline: none;
	}
	.win:focus-visible {
		outline: 2px solid var(--focus);
		outline-offset: 2px;
	}
	.win-bar {
		position: relative;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		height: 38px;
		padding: 0 10px;
		flex: none;
		cursor: default;
		user-select: none;
		-webkit-user-select: none;
		border-bottom: 1px solid var(--line);
		background: color-mix(in srgb, var(--win-2) 70%, var(--win));
		border-radius: var(--r-win) var(--r-win) 0 0;
		touch-action: none;
	}
	.win.active .win-bar {
		background: var(--win-2);
	}
	.lights {
		display: flex;
		gap: 4px;
	}
	.light {
		position: relative;
		width: 24px;
		height: 24px;
		display: grid;
		place-items: center;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--ink-2);
	}
	.light::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 12px;
		height: 12px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: var(--light-min);
		box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.18);
	}
	.light span {
		position: relative;
		font-size: 11px;
		line-height: 1;
		font-weight: 800;
		opacity: 0;
		transition: opacity 120ms ease;
	}
	.lights:hover .light span,
	.light:focus-visible span {
		opacity: 0.75;
	}
	.l-close::before {
		background: var(--light-close);
	}
	.l-min::before {
		background: var(--light-min);
	}
	.l-zoom::before {
		background: var(--light-zoom);
	}
	.light:focus-visible {
		outline-offset: 0;
		border-radius: 50%;
	}
	.win-title {
		font-size: 13px;
		font-weight: 650;
		color: var(--ink-2);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		min-width: 0;
		cursor: default;
	}
	.win-spacer {
		display: block;
	}
	.win-body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	.win.active .win-title {
		color: var(--ink);
	}
	@keyframes winIn {
		from {
			opacity: 0;
			transform: scale(0.97);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
	.win.reduced {
		animation: none;
	}
</style>
