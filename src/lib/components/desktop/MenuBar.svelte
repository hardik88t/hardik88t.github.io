<script lang="ts">
	import { onMount } from 'svelte';
	import { live } from '$lib/actions/live';
	import { agentic, categoryLabel, content, profile, projects } from '$lib/content';
	import { istDate, istTime } from '$lib/format';
	import { runningCount } from '$lib/state/sim.svelte';
	import { openApp, resetLayout, setView } from '$lib/state/ui.svelte';
	import Icon from '../Icon.svelte';
	import Menu from './Menu.svelte';

	let now = $state(new Date());
	onMount(() => {
		const id = setInterval(() => (now = new Date()), 15000);
		return () => clearInterval(id);
	});

	const running = $derived(runningCount());
</script>

<header class="menubar">
	<nav class="menus" aria-label="Menu bar">
		<Menu label="HardikOS" brand>
			{#snippet children(close)}
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('readme'); }}>
					About this site <span class="hint">README</span>
				</button>
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('about'); }}>
					About Hardik
				</button>
				<hr />
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('settings'); }}>
					Settings… <span class="hint">Theme</span>
				</button>
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); setView('page'); }}>
					Read as a page <span class="hint">linear</span>
				</button>
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); resetLayout(); }}>
					Reset window layout
				</button>
			{/snippet}
		</Menu>

		<Menu label="Work">
			{#snippet children(close)}
				<p class="mh" role="none">Projects, featured first</p>
				{#each projects as p (p.slug)}
					<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('work', { project: p.slug }); }}>
						{p.title}
						<span class="hint">{categoryLabel(p.categories[0])}</span>
					</button>
				{/each}
			{/snippet}
		</Menu>

		<Menu label="Agents">
			{#snippet children(close)}
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('agents'); }}>
					Activity monitor
				</button>
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('agents'); }}>
					Delivery pipeline <span class="hint">8 stages</span>
				</button>
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('terminal'); }}>
					Run a simulated swarm <span class="hint">Terminal</span>
				</button>
				<hr />
				<p class="mh" role="none">{agentic.agents.length} agents in the fleet</p>
			{/snippet}
		</Menu>

		<Menu label="Services">
			{#snippet children(close)}
				{#each content.services as s (s.id)}
					<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('services'); }}>
						{s.title}
					</button>
				{/each}
				<hr />
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('contact'); }}>
					Start a project <span class="hint">Mail</span>
				</button>
			{/snippet}
		</Menu>

		<Menu label="Contact">
			{#snippet children(close)}
				<button class="mi" role="menuitem" type="button" onclick={() => { close(); openApp('contact'); }}>
					Mail <span class="hint">{profile.email}</span>
				</button>
				<a class="mi" role="menuitem" href={profile.links.linkedin} target="_blank" rel="noopener noreferrer" onclick={() => close()}>
					LinkedIn <span class="hint">new tab</span>
				</a>
				<a class="mi" role="menuitem" href={profile.links.github} target="_blank" rel="noopener noreferrer" onclick={() => close()}>
					GitHub <span class="hint">new tab</span>
				</a>
				<a class="mi" role="menuitem" href={profile.links.cv} target="_blank" rel="noopener noreferrer" onclick={() => close()}>
					CV (PDF) <span class="hint">new tab</span>
				</a>
			{/snippet}
		</Menu>
	</nav>

	<div class="right">
		<button
			type="button"
			class="status"
			use:live
			onclick={() => openApp('agents')}
			title="Simulated activity"
			aria-label="{running} agents running in the simulation. Open the activity monitor"
		>
			<span class="dot-live" aria-hidden="true"></span>
			<span>agents: <span class="tabular">{running}</span> running</span>
		</button>
		<button type="button" class="read-link" onclick={() => setView('page')}>
			<Icon name="book" size={14} />
			<span>Read as a page</span>
		</button>
		<time class="clock tabular" datetime={now.toISOString()}>{istDate(now)} {istTime(now)} IST</time>
	</div>
</header>

<style>
	.menubar {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 500;
		height: 28px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		padding: 0 8px 0 6px;
		background: var(--menubar);
		backdrop-filter: saturate(180%) blur(22px);
		-webkit-backdrop-filter: saturate(180%) blur(22px);
		border-bottom: 1px solid color-mix(in srgb, var(--ink) 8%, transparent);
		font-size: 13px;
	}
	.menus {
		display: flex;
		align-items: center;
		gap: 2px;
		min-width: 0;
	}
	.right {
		display: flex;
		align-items: center;
		gap: 4px;
		color: var(--ink-2);
	}
	.status,
	.read-link {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		height: 24px;
		padding: 0 8px;
		border: 0;
		border-radius: 6px;
		background: transparent;
		color: var(--ink-2);
		font-size: 12.5px;
		font-weight: 550;
		white-space: nowrap;
	}
	.status:hover,
	.read-link:hover {
		background: color-mix(in srgb, var(--ink) 9%, transparent);
		color: var(--ink);
	}
	.clock {
		padding: 0 6px 0 4px;
		font-size: 12.5px;
		font-weight: 550;
		color: var(--ink);
		white-space: nowrap;
	}
</style>
