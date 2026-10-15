<script lang="ts">
	import { wm } from '$lib/state/wm.svelte';
	import Dock from './Dock.svelte';
	import MenuBar from './MenuBar.svelte';
	import WindowFrame from './WindowFrame.svelte';
	import Wallpaper from '../Wallpaper.svelte';
</script>

<div class="os desk-os">
	<Wallpaper />
	<MenuBar />
	<main id="main" class="desk">
		<h1 class="sr-only">Hardik Thanth, full-stack developer. HardikOS portfolio desktop.</h1>
		{#each wm.windows as win (win.app)}
			<WindowFrame {win} />
		{/each}
		{#if wm.windows.every((w) => w.min)}
			<p class="empty">Open an app from the dock or the menu bar.</p>
		{/if}
	</main>
	<Dock />
</div>

<style>
	.os {
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: var(--desk);
	}
	.desk {
		position: absolute;
		inset: 0;
		z-index: 1;
	}
	.empty {
		position: absolute;
		left: 50%;
		top: 44%;
		transform: translate(-50%, -50%);
		font-size: 14px;
		color: var(--ink-3);
		text-align: center;
		white-space: nowrap;
	}
</style>
