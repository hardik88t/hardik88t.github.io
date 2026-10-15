<script lang="ts" module>
	export type HLevel = 1 | 2 | 3 | 4;
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		level = 2,
		id,
		class: className = '',
		children
	}: { level?: HLevel; id?: string; class?: string; children: Snippet } = $props();
	const tag = $derived(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4');
</script>

<svelte:element this={tag} {id} class="h {className}">
	{@render children()}
</svelte:element>
