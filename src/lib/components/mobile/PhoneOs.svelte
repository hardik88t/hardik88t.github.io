<script lang="ts">
	import { HOME_APPS, PHONE_DOCK, APPS, type AppId } from '$lib/state/apps';
	import { profile, content } from '$lib/content';
	import { istLongDate } from '$lib/format';
	import { live } from '$lib/actions/live';
	import { runningCount } from '$lib/state/sim.svelte';
	import { openApp, setView, ui } from '$lib/state/ui.svelte';
	import { onMount } from 'svelte';
	import Icon from '../Icon.svelte';
	import Monogram from '../Monogram.svelte';
	import Wallpaper from '../Wallpaper.svelte';
	import AppSheet from './AppSheet.svelte';
	import StatusBar from './StatusBar.svelte';
	import PipeStrip from './PipeStrip.svelte';

	let today = $state(new Date());
	onMount(() => {
		const id = setInterval(() => (today = new Date()), 60000);
		return () => clearInterval(id);
	});

	const running = $derived(runningCount());
	const merged = content.agentic.metrics.find((m) => m.label === 'squash-merged PRs')?.value ?? 0;
</script>

<div class="phone-os">
	<Wallpaper />
	<div class="screen">
		<StatusBar />
		<main id="main" class="home">
		<div class="home-in">
			<p class="date">{istLongDate(today)}</p>

			<section class="widget" aria-labelledby="widget-title" use:live>
				<div class="w-top">
					<Monogram size={48} />
					<div class="w-id">
						<h1 id="widget-title" class="w-name">{profile.name}</h1>
						<p class="w-role">{profile.role}</p>
					</div>
				</div>
				<p class="w-stats">
					<span class="w-stat">
						<span class="dot-live" aria-hidden="true"></span>
						<span class="tabular">{running}</span> agents running
					</span>
					<span class="w-stat"><span class="tabular">{merged}</span> PRs merged</span>
				</p>
				<div class="w-foot">
					<button class="btn btn-sm btn-primary" type="button" onclick={() => openApp('readme')}>
						Read the README
					</button>
					<button class="btn btn-sm" type="button" onclick={() => openApp('work')}>Work</button>
				</div>
				<p class="w-note">Fleet status is simulated. Counts and names come from the real pipeline.</p>
			</section>

			<PipeStrip />

			<nav class="apps" aria-label="Apps">
				<ul>
					{#each HOME_APPS as id (id)}
						{@const def = APPS[id]}
						<li>
							<button type="button" class="app" onclick={() => openApp(id as AppId)}>
								<span class="app-ico" style:--tint={def.tint} style:--glyph={def.glyph}>
									<Icon name={def.icon} size={28} />
								</span>
								<span class="app-label">{def.name}</span>
							</button>
						</li>
					{/each}
				</ul>
			</nav>

			<p class="page-link">
				<button type="button" class="read-link" onclick={() => setView('page')}>
					<Icon name="book" size={15} />
					Read as a page
				</button>
			</p>
		</div>
		</main>

		<nav class="phone-dock" aria-label="Dock">
			<ul>
				{#each PHONE_DOCK as id (id)}
					{@const def = APPS[id]}
					<li>
						<button type="button" class="dock-app" onclick={() => openApp(id)} aria-label={def.name}>
							<span class="app-ico small" style:--tint={def.tint} style:--glyph={def.glyph}>
								<Icon name={def.icon} size={24} />
							</span>
						</button>
					</li>
				{/each}
			</ul>
		</nav>
		<div class="home-bar" aria-hidden="true"></div>
	</div>

	{#if ui.sheet}
		<AppSheet app={ui.sheet} />
	{/if}
</div>

<style>
	.phone-os {
		position: fixed;
		inset: 0;
		overflow: hidden;
		background: var(--desk);
	}
	.screen {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		height: 100%;
		min-height: 0;
	}
	.home {
		flex: 1;
		min-height: 0;
		width: 100%;
		overflow-y: auto;
		overscroll-behavior: contain;
	}
	.home-in {
		display: flex;
		flex-direction: column;
		gap: 18px;
		padding: 6px var(--gutter) 12px;
		max-width: 720px;
		min-height: 100%;
		margin: 0 auto;
	}
	.date {
		font-family: var(--font-mono);
		font-size: 11.5px;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--ink-3);
		padding-left: 2px;
	}
	.widget {
		display: grid;
		gap: 14px;
		padding: 16px;
		border-radius: 22px;
		background: color-mix(in srgb, var(--win) 86%, transparent);
		border: 1px solid var(--win-line);
		box-shadow: var(--shadow-win);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
	}
	.w-top {
		display: flex;
		align-items: center;
		gap: 14px;
	}
	.w-name {
		font-size: 1.35rem;
		font-weight: 750;
		letter-spacing: -0.025em;
		line-height: 1.15;
	}
	.w-role {
		font-size: 13.5px;
		color: var(--ink-2);
		margin-top: 2px;
		line-height: 1.35;
	}
	.w-stats {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 10px;
		padding: 12px 14px;
		border-radius: 14px;
		background: var(--win-2);
		border: 1px solid var(--line);
		font-size: 13px;
		font-weight: 600;
		color: var(--ink-2);
	}
	.w-stat {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
		line-height: 1.3;
	}
	.w-stat .tabular {
		font-size: 1.25rem;
		font-weight: 750;
		color: var(--ink);
		letter-spacing: -0.02em;
	}
	.w-foot {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.w-note {
		font-size: 11.5px;
		color: var(--ink-3);
		line-height: 1.4;
		margin-top: -4px;
	}
	.apps ul {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 16px 8px;
		justify-items: center;
	}
	@media (min-width: 600px) {
		.apps ul {
			grid-template-columns: repeat(6, minmax(0, 1fr));
		}
	}
	.app {
		display: grid;
		justify-items: center;
		gap: 6px;
		width: 100%;
		min-height: 88px;
		padding: 4px 0;
		border: 0;
		background: transparent;
		color: var(--ink);
		border-radius: var(--r-md);
	}
	.app:active .app-ico {
		transform: scale(0.94);
	}
	.app-ico {
		display: grid;
		place-items: center;
		width: 60px;
		height: 60px;
		border-radius: 16px;
		background: linear-gradient(160deg, color-mix(in srgb, var(--tint) 84%, var(--white)) 0%, var(--tint) 100%);
		color: var(--glyph);
		box-shadow:
			inset 0 1px 0 color-mix(in srgb, var(--white) 35%, transparent),
			0 4px 12px rgba(0, 0, 0, 0.14);
		transition: transform 120ms var(--ease-out);
	}
	.app-ico.small {
		width: 52px;
		height: 52px;
		border-radius: 14px;
	}
	.app-label {
		font-size: 12.5px;
		font-weight: 600;
		line-height: 1.2;
		color: var(--ink);
		text-shadow: 0 1px 2px color-mix(in srgb, var(--desk) 70%, transparent);
	}
	.page-link {
		display: flex;
		justify-content: center;
	}
	.read-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		min-height: var(--touch);
		padding: 0 14px;
		border: 0;
		border-radius: 999px;
		background: transparent;
		color: var(--accent-ink);
		font-weight: 600;
		font-size: 14px;
	}
	.phone-dock {
		flex: none;
		margin: 0 auto 6px;
		padding: 8px 12px;
		width: min(calc(100% - 24px), 480px);
		border-radius: 26px;
		background: var(--dock);
		backdrop-filter: saturate(180%) blur(24px);
		-webkit-backdrop-filter: saturate(180%) blur(24px);
		border: 1px solid var(--dock-line);
		box-shadow: var(--shadow-dock);
	}
	.phone-dock ul {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		justify-items: center;
	}
	.dock-app {
		display: grid;
		place-items: center;
		width: 64px;
		height: 60px;
		padding: 0;
		border: 0;
		background: transparent;
	}
	.home-bar {
		flex: none;
		width: 134px;
		height: 5px;
		margin: 0 auto 8px;
		border-radius: 999px;
		background: color-mix(in srgb, var(--ink) 80%, transparent);
	}
	@media (max-height: 700px) {
		.widget {
			padding: 12px;
			gap: 10px;
		}
		.app {
			min-height: 80px;
		}
	}
</style>
