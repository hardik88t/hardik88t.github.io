<script lang="ts">
	import { onDestroy } from 'svelte';
	import { APPS, type AppId } from '$lib/state/apps';
	import { closeSheet, ui } from '$lib/state/ui.svelte';
	import Icon from '../Icon.svelte';
	import AppContent from '../apps/AppContent.svelte';

	let { app }: { app: AppId } = $props();

	const def = $derived(APPS[app]);
	const titleId = `sheet-title`;
	let sheetEl = $state<HTMLElement>();
	let dragY = $state(0);
	let dragging = $state(false);
	let startY = 0;
	let leaving = $state(false);
	const launcher: HTMLElement | null =
		typeof document !== 'undefined' ? (document.activeElement as HTMLElement | null) : null;

	// Move focus to the back control whenever the sheet is shown or switches app.
	$effect(() => {
		void app;
		sheetEl?.querySelector<HTMLElement>('.sheet-back')?.focus({ preventScroll: true });
	});

	function dismiss() {
		if (leaving) return;
		leaving = true;
		const delay = ui.reduced ? 0 : 220;
		setTimeout(() => closeSheet(), delay);
	}

	function onDown(e: PointerEvent) {
		if ((e.target as HTMLElement).closest('button, a, input, textarea')) return;
		dragging = true;
		startY = e.clientY;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
	}

	function onMove(e: PointerEvent) {
		if (!dragging) return;
		dragY = Math.max(0, e.clientY - startY);
	}

	function onUp() {
		if (!dragging) return;
		dragging = false;
		if (dragY > 110) {
			dragY = 0;
			dismiss();
		} else {
			dragY = 0;
		}
	}

	function onKey(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			e.preventDefault();
			dismiss();
		} else if (e.key === 'Tab' && sheetEl) {
			// Keep keyboard focus inside the modal sheet.
			const items = Array.from(
				sheetEl.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), textarea, select, [tabindex="0"]')
			).filter((el) => el.offsetParent !== null);
			if (!items.length) return;
			const first = items[0];
			const last = items[items.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	onDestroy(() => {
		if (launcher && launcher.isConnected) launcher.focus({ preventScroll: true });
	});
</script>

<div
	bind:this={sheetEl}
	class="sheet"
	class:leaving
	class:dragging
	role="dialog"
	tabindex="-1"
	aria-modal="true"
	aria-labelledby={titleId}
	style:transform={dragY ? `translateY(${dragY}px)` : undefined}
	onkeydown={onKey}
>
	<header class="sheet-bar" role="presentation" onpointerdown={onDown} onpointermove={onMove} onpointerup={onUp} onpointercancel={onUp}>
		<span class="grabber" aria-hidden="true"></span>
		<div class="bar-row">
			<button type="button" class="sheet-back" onclick={dismiss}>
				<Icon name="chevron-left" size={20} />
				<span>Home</span>
			</button>
			<p class="sheet-title" id={titleId}>{def.title}</p>
			<span class="bar-end" aria-hidden="true"></span>
		</div>
	</header>
	<div class="sheet-body">
		<AppContent {app} variant="sheet" />
	</div>
</div>

<style>
	.sheet {
		position: fixed;
		inset: 0;
		z-index: 800;
		display: flex;
		flex-direction: column;
		background: var(--desk);
		color: var(--ink);
		padding-top: env(safe-area-inset-top, 0px);
		animation: sheetIn 320ms var(--ease-out);
		transition: transform 260ms var(--ease-out);
	}
	.sheet.dragging {
		transition: none;
	}
	.sheet.leaving {
		animation: sheetOut 220ms var(--ease-out) forwards;
	}
	.sheet-bar {
		flex: none;
		touch-action: none;
		background: color-mix(in srgb, var(--desk) 88%, transparent);
		backdrop-filter: blur(18px);
		-webkit-backdrop-filter: blur(18px);
		border-bottom: 1px solid var(--line);
		padding: 6px 4px 0;
		cursor: grab;
	}
	.grabber {
		display: block;
		width: 38px;
		height: 5px;
		margin: 0 auto 4px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink) 25%, transparent);
	}
	.bar-row {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
		align-items: center;
		min-height: 48px;
		padding: 0 8px;
	}
	.sheet-back {
		justify-self: start;
		display: inline-flex;
		align-items: center;
		gap: 0;
		min-height: var(--touch);
		min-width: var(--touch);
		padding: 0 10px 0 2px;
		border: 0;
		background: transparent;
		color: var(--accent-ink);
		font-size: 16px;
		font-weight: 600;
	}
	.sheet-title {
		font-size: 16px;
		font-weight: 700;
		letter-spacing: -0.01em;
		text-align: center;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 52vw;
	}
	.bar-end {
		display: block;
	}
	.sheet-body {
		flex: 1;
		min-height: 0;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
	@keyframes sheetIn {
		from {
			transform: translateY(100%);
		}
		to {
			transform: translateY(0);
		}
	}
	@keyframes sheetOut {
		to {
			transform: translateY(100%);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.sheet {
			animation: none;
		}
	}
</style>
