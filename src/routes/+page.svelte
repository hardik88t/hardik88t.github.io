<script lang="ts">
	import { onMount } from 'svelte';
	import OsDesktop from '$lib/components/desktop/OsDesktop.svelte';
	import ReadPage from '$lib/components/linear/ReadPage.svelte';
	import PhoneOs from '$lib/components/mobile/PhoneOs.svelte';
	import { initUi, ui } from '$lib/state/ui.svelte';

	onMount(() => initUi());
</script>

<svelte:head>
	<title>Hardik Thanth | HardikOS portfolio</title>
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>

{#if ui.view === 'page'}
	<ReadPage />
{:else if ui.layout === 'desktop'}
	<OsDesktop />
{:else}
	<PhoneOs />
{/if}
