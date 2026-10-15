<script lang="ts">
	import '@fontsource-variable/figtree';
	import '@fontsource/martian-mono/400.css';
	import '@fontsource/martian-mono/600.css';
	import '../app.css';
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

{@render children()}
