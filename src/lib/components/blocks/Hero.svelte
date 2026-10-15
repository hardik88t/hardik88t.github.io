<script lang="ts">
	import { content, profile } from '$lib/content';
	import { openApp } from '$lib/state/ui.svelte';
	import Icon from '../Icon.svelte';
	import Monogram from '../Monogram.svelte';
	import PipelineRing from './PipelineRing.svelte';

	let { variant = 'window' }: { variant?: 'window' | 'page' } = $props();
	const isPage = $derived(variant === 'page');
	const stats = content.agentic.metrics.slice(0, 4);
</script>

<section class="hero" class:page={isPage} aria-labelledby="hero-title" id={isPage ? 'top' : undefined}>
	<div class="hero-copy">
	<div class="hero-id">
		<Monogram size={isPage ? 56 : 46} />
		<div class="hero-id-text">
			<p class="hero-name">{profile.name}</p>
			<p class="eyebrow">{profile.role}</p>
		</div>
	</div>

	{#if isPage}
		<h1 id="hero-title" class="hero-title">{profile.headline}</h1>
	{:else}
		<h2 id="hero-title" class="hero-title">{profile.headline}</h2>
	{/if}

	<p class="hero-sub">{profile.sub}</p>

	<div class="hero-actions">
		{#if isPage}
			<a class="btn btn-primary" href="#contact">Start a project</a>
			<a class="btn" href="#workflow">See the agent workflow</a>
		{:else}
			<button class="btn btn-primary" type="button" onclick={() => openApp('contact')}>
				Start a project
			</button>
			<button class="btn" type="button" onclick={() => openApp('agents')}>
				See the agent workflow
			</button>
		{/if}
		<a class="link-arrow" href={profile.links.cv} target="_blank" rel="noopener noreferrer">
			Read the CV
			<span class="sr-only">(PDF, opens in a new tab)</span>
			<Icon name="arrow-up-right" size={16} />
		</a>
	</div>

	<div class="avail">
		<p class="avail-line">
			<span class="dot-live" aria-hidden="true"></span>
			<span>{profile.availability}</span>
		</p>
		<p class="avail-loc">{profile.location} · {profile.timezone}</p>
	</div>

	<ul class="stat-strip" aria-label="Headline numbers">
		{#each stats as s (s.label)}
			<li>
				<span class="stat-v tabular">{s.value.toLocaleString('en-US')}</span>
				<span class="stat-l">{s.label}</span>
			</li>
		{/each}
	</ul>
	</div>
	{#if isPage}
		<div class="hero-visual">
			<PipelineRing />
		</div>
	{/if}
</section>

<style>
	.hero {
		display: grid;
		gap: 40px;
		align-items: center;
		container-type: inline-size;
	}
	.hero-copy {
		display: grid;
		gap: 18px;
		align-content: start;
		min-width: 0;
	}
	.hero-visual {
		display: none;
	}
	.hero-visual :global(svg) {
		max-width: 420px;
	}
	@media (min-width: 960px) {
		.hero.page {
			grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
			gap: 56px;
		}
		.hero.page .hero-visual {
			display: block;
		}
	}
	.hero-id {
		display: flex;
		align-items: center;
		gap: 12px;
	}
	.hero-name {
		font-weight: 700;
		font-size: 16px;
		letter-spacing: -0.01em;
		line-height: 1.2;
	}
	.hero-id-text .eyebrow {
		margin-top: 2px;
	}
	.hero-title {
		font-size: clamp(1.7rem, 3.1vw, 2.15rem);
		line-height: 1.08;
		letter-spacing: -0.03em;
		font-weight: 700;
		max-width: 22ch;
		text-wrap: balance;
	}
	.hero.page .hero-title {
		font-size: clamp(2.5rem, 6.4vw, 4.6rem);
		line-height: 1.02;
		letter-spacing: -0.045em;
		max-width: 16ch;
	}
	.hero-sub {
		color: var(--ink-2);
		font-size: 15.5px;
		line-height: 1.6;
		max-width: 62ch;
	}
	.hero.page .hero-sub {
		font-size: clamp(1.02rem, 1.6vw, 1.2rem);
		max-width: 56ch;
	}
	.hero-actions {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 10px 14px;
	}
	.avail {
		display: grid;
		gap: 4px;
		font-size: 13.5px;
		color: var(--ink-2);
	}
	.avail-line {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.avail-loc {
		padding-left: 16px;
		color: var(--ink-3);
	}
	.stat-strip {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 1px;
		margin-top: 4px;
		background: var(--line);
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		overflow: hidden;
	}
	.stat-strip li {
		display: grid;
		gap: 2px;
		padding: 10px 12px;
		background: var(--win-2);
	}
	.stat-v {
		font-size: 1.3rem;
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.1;
	}
	.stat-l {
		font-size: 12px;
		color: var(--ink-3);
		line-height: 1.3;
	}
	@container (max-width: 440px) {
		.stat-strip {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
