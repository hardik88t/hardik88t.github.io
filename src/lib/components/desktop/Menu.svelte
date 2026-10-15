<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		brand = false,
		children
	}: { label: string; brand?: boolean; children: Snippet<[() => void]> } = $props();

	const uid = $props.id();
	let open = $state(false);
	let wrap = $state<HTMLElement>();
	let trigger = $state<HTMLButtonElement>();
	let panel = $state<HTMLElement>();

	function items(): HTMLElement[] {
		return panel ? Array.from(panel.querySelectorAll<HTMLElement>('[role="menuitem"]')) : [];
	}

	function close(restoreFocus = false) {
		open = false;
		if (restoreFocus) trigger?.focus();
	}

	function openMenu(focusFirst = true) {
		open = true;
		if (focusFirst) requestAnimationFrame(() => items()[0]?.focus());
	}

	function onTrigger(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			openMenu(true);
		}
	}

	function onPanelKey(e: KeyboardEvent) {
		const list = items();
		const i = list.indexOf(document.activeElement as HTMLElement);
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			list[(i + 1 + list.length) % list.length]?.focus();
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			list[(i - 1 + list.length) % list.length]?.focus();
		} else if (e.key === 'Home') {
			e.preventDefault();
			list[0]?.focus();
		} else if (e.key === 'End') {
			e.preventDefault();
			list[list.length - 1]?.focus();
		} else if (e.key === 'Escape') {
			e.preventDefault();
			close(true);
		} else if (e.key === 'Tab') {
			close(false);
		}
	}

	$effect(() => {
		if (!open) return;
		const onDown = (e: PointerEvent) => {
			if (wrap && !wrap.contains(e.target as Node)) close(false);
		};
		document.addEventListener('pointerdown', onDown);
		return () => document.removeEventListener('pointerdown', onDown);
	});
</script>

<div class="menu" bind:this={wrap}>
	<button
		bind:this={trigger}
		type="button"
		class="menu-btn"
		class:brand
		class:open
		aria-haspopup="menu"
		aria-expanded={open}
		aria-controls={open ? `menu-${uid}` : undefined}
		onclick={() => (open ? close(false) : openMenu(true))}
		onkeydown={onTrigger}
	>
		{label}
	</button>
	{#if open}
		<div
			bind:this={panel}
			id="menu-{uid}"
			class="menu-panel"
			role="menu"
			aria-label={label}
			tabindex="-1"
			onkeydown={onPanelKey}
		>
			{@render children(() => close(false))}
		</div>
	{/if}
</div>

<style>
	.menu {
		position: relative;
	}
	.menu-btn {
		height: 24px;
		padding: 0 9px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: var(--ink);
		font-size: 13px;
		font-weight: 550;
		white-space: nowrap;
	}
	.menu-btn.brand {
		font-weight: 800;
		letter-spacing: -0.01em;
	}
	.menu-btn:hover,
	.menu-btn.open {
		background: color-mix(in srgb, var(--ink) 9%, transparent);
	}
	.menu-panel {
		position: absolute;
		top: calc(100% + 6px);
		left: 0;
		z-index: 600;
		min-width: 248px;
		max-width: min(340px, calc(100vw - 24px));
		max-height: min(72vh, 520px);
		overflow-y: auto;
		padding: 6px;
		border-radius: 12px;
		border: 1px solid var(--win-line);
		background: var(--win);
		box-shadow: var(--shadow-win);
		animation: pop 160ms var(--ease-out);
		transform-origin: top left;
	}
	.menu-panel :global(.mi) {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		width: 100%;
		min-height: 32px;
		padding: 6px 10px;
		border: 0;
		border-radius: 7px;
		background: transparent;
		color: var(--ink);
		font-size: 13.5px;
		text-align: left;
		text-decoration: none;
	}
	.menu-panel :global(.mi:hover),
	.menu-panel :global(.mi:focus-visible) {
		background: var(--accent);
		color: var(--on-accent);
		outline: none;
	}
	.menu-panel :global(.mi .hint) {
		font-size: 12px;
		color: var(--ink-3);
		white-space: nowrap;
	}
	.menu-panel :global(.mi:hover .hint),
	.menu-panel :global(.mi:focus-visible .hint) {
		color: inherit;
		opacity: 0.8;
	}
	.menu-panel :global(hr) {
		border: 0;
		border-top: 1px solid var(--line);
		margin: 5px 4px;
	}
	.menu-panel :global(.mh) {
		padding: 6px 10px 4px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.97) translateY(-4px);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.menu-panel {
			animation: none;
		}
	}
</style>
