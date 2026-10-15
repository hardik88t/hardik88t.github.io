<script lang="ts">
	import { applyTheme, resetLayout, setView, ui, type Theme } from '$lib/state/ui.svelte';
	import Icon from '../Icon.svelte';

	const themes: { id: Theme; label: string; icon: 'display' | 'sun' | 'moon' }[] = [
		{ id: 'system', label: 'System', icon: 'display' },
		{ id: 'light', label: 'Light', icon: 'sun' },
		{ id: 'dark', label: 'Dark', icon: 'moon' }
	];

	const reading = $derived(ui.view === 'page');
</script>

<div class="app settings">
	<section class="group" aria-labelledby="set-appearance">
		<h2 id="set-appearance" class="h">Appearance</h2>
		<div class="seg" role="group" aria-labelledby="set-appearance">
			{#each themes as t (t.id)}
				<button type="button" class="seg-btn" aria-pressed={ui.theme === t.id} onclick={() => applyTheme(t.id)}>
					<Icon name={t.icon} size={16} />
					{t.label}
				</button>
			{/each}
		</div>
	</section>

	<section class="group" aria-labelledby="set-reading">
		<h2 id="set-reading" class="h">Reading</h2>
		<div class="row">
			<div class="row-text">
				<p class="row-title" id="set-read-label">Read as a page</p>
				<p class="row-sub">
					A plain, linear document with every section in order. Screen readers and reduced-motion users
					start here by default.
				</p>
			</div>
			<button
				type="button"
				class="switch"
				role="switch"
				aria-checked={reading}
				aria-labelledby="set-read-label"
				onclick={() => setView(reading ? 'os' : 'page')}
			>
				<span class="knob" aria-hidden="true"></span>
			</button>
		</div>
	</section>

	<section class="group" aria-labelledby="set-layout">
		<h2 id="set-layout" class="h">Windows</h2>
		<div class="row">
			<div class="row-text">
				<p class="row-title">Default arrangement</p>
				<p class="row-sub">Put README, Agents and Terminal back where they started.</p>
			</div>
			<button type="button" class="btn btn-sm" onclick={resetLayout} disabled={ui.layout !== 'desktop'}>
				Reset layout
			</button>
		</div>
	</section>

	<section class="group" aria-labelledby="set-motion">
		<h2 id="set-motion" class="h">Motion</h2>
		<p class="row-sub">
			Motion follows your system setting. With reduced motion on, the site opens in Read as a page and live
			widgets hold a still frame.
		</p>
	</section>
</div>

<style>
	.settings {
		--pad: 22px;
	}
	.group {
		display: grid;
		gap: 12px;
		align-content: start;
	}
	.seg {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 4px;
		padding: 4px;
		border-radius: var(--r-md);
		background: var(--chip);
		border: 1px solid var(--chip-line);
	}
	.seg-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		min-height: var(--touch);
		padding: 6px 10px;
		border: 0;
		border-radius: var(--r-sm);
		background: transparent;
		color: var(--ink-2);
		font-weight: 600;
		font-size: 14px;
	}
	.seg-btn[aria-pressed='true'] {
		background: var(--win);
		color: var(--ink);
		box-shadow: var(--shadow-soft);
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: 14px 16px;
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		background: var(--win-2);
	}
	.row-text {
		display: grid;
		gap: 4px;
		min-width: 0;
	}
	.row-title {
		font-weight: 650;
	}
	.row-sub {
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.switch {
		position: relative;
		flex: none;
		width: 60px;
		height: var(--touch);
		padding: 0;
		border: 0;
		background: transparent;
	}
	.switch::before {
		content: '';
		position: absolute;
		left: 4px;
		top: 50%;
		width: 52px;
		height: 32px;
		margin-top: -16px;
		border-radius: 999px;
		border: 1px solid var(--win-line);
		background: var(--chip);
		transition: background-color 180ms ease;
	}
	.switch[aria-checked='true']::before {
		background: var(--accent);
		border-color: var(--accent);
	}
	.knob {
		position: absolute;
		top: 50%;
		left: 8px;
		margin-top: -12px;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--win);
		box-shadow: var(--shadow-soft);
		transition: transform 200ms var(--ease-out);
	}
	.switch[aria-checked='true'] .knob {
		transform: translateX(20px);
	}
	.settings :global(.btn:disabled) {
		opacity: 0.5;
		cursor: not-allowed;
	}
</style>
