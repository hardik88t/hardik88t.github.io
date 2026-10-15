<script lang="ts">
	import type { AppId } from '$lib/state/apps';
	import AboutApp from './AboutApp.svelte';
	import AgentsApp from './AgentsApp.svelte';
	import ContactApp from './ContactApp.svelte';
	import ReadmeApp from './ReadmeApp.svelte';
	import ResumeApp from './ResumeApp.svelte';
	import ServicesApp from './ServicesApp.svelte';
	import SettingsApp from './SettingsApp.svelte';
	import TerminalApp from './TerminalApp.svelte';
	import WorkApp from './WorkApp.svelte';

	let { app, variant = 'window' }: { app: AppId; variant?: 'window' | 'sheet' } = $props();
	const flush = $derived(app === 'terminal');
</script>

<div class="app-root" class:flush data-app={app}>
	{#if app === 'readme'}
		<ReadmeApp />
	{:else if app === 'agents'}
		<AgentsApp />
	{:else if app === 'terminal'}
		<TerminalApp compact={variant === 'sheet'} />
	{:else if app === 'work'}
		<WorkApp {variant} />
	{:else if app === 'about'}
		<AboutApp />
	{:else if app === 'services'}
		<ServicesApp />
	{:else if app === 'resume'}
		<ResumeApp />
	{:else if app === 'contact'}
		<ContactApp />
	{:else if app === 'settings'}
		<SettingsApp />
	{/if}
</div>

<style>
	.app-root {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		overscroll-behavior: contain;
		container-type: inline-size;
		display: flex;
		flex-direction: column;
	}
	.app-root.flush {
		overflow: hidden;
	}
	.app-root > :global(.app) {
		--pad: 22px;
		padding: var(--pad);
		display: grid;
		gap: 22px;
		align-content: start;
		min-height: 100%;
	}
	:global(.sheet-body) .app-root > :global(.app) {
		--pad: 16px;
	}
</style>
