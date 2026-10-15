<script lang="ts">
	import { categoryLabel, type Project } from '$lib/content';
	import Heading, { type HLevel } from './Heading.svelte';
	import Icon from '../Icon.svelte';
	import ProjectArt from '../ProjectArt.svelte';

	let { project, level = 2, art = true }: { project: Project; level?: HLevel; art?: boolean } = $props();
	const hasLinks = $derived(Boolean(project.links.github || project.links.live));
</script>

<article class="detail" aria-labelledby="pd-{project.slug}">
	{#if art}<ProjectArt {project} />{/if}
	<div class="detail-head">
		<p class="eyebrow">
			{project.categories.map(categoryLabel).join(' · ')} · {project.year}
		</p>
		<Heading {level} id="pd-{project.slug}">{project.title}</Heading>
		<p class="one">{project.oneLiner}</p>
	</div>
	<p class="desc">{project.description}</p>

	<dl class="facts">
		<div>
			<dt>Role</dt>
			<dd>{project.role}</dd>
		</div>
		<div>
			<dt>Year</dt>
			<dd class="tabular">{project.year}</dd>
		</div>
	</dl>

	<div class="block">
		<p class="eyebrow">Stack</p>
		<ul class="chips" aria-label="Stack">
			{#each project.stack as s (s)}
				<li class="chip">{s}</li>
			{/each}
		</ul>
	</div>

	<div class="block">
		<p class="eyebrow">Highlights</p>
		<ul class="bullets">
			{#each project.highlights as h (h)}
				<li>{h}</li>
			{/each}
		</ul>
	</div>

	{#if hasLinks}
		<div class="links">
			{#if project.links.github}
				<a class="link-arrow" href={project.links.github} target="_blank" rel="noopener noreferrer">
					GitHub<span class="sr-only"> (opens in a new tab)</span>
					<Icon name="arrow-up-right" size={15} />
				</a>
			{/if}
			{#if project.links.live}
				<a class="link-arrow" href={project.links.live} target="_blank" rel="noopener noreferrer">
					Live site<span class="sr-only"> (opens in a new tab)</span>
					<Icon name="arrow-up-right" size={15} />
				</a>
			{/if}
		</div>
	{/if}

	{#if project.anonymized}
		<p class="note">Anonymised: client names and private details are left out on purpose.</p>
	{/if}
</article>

<style>
	.detail {
		display: grid;
		gap: 16px;
		align-content: start;
	}
	.detail-head {
		display: grid;
		gap: 6px;
	}
	.one {
		font-size: 15px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.desc {
		font-size: 14.5px;
		color: var(--ink-2);
		line-height: 1.65;
	}
	.facts {
		display: flex;
		gap: 28px;
		flex-wrap: wrap;
	}
	.facts dt {
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.facts dd {
		margin: 2px 0 0;
		font-size: 14px;
		font-weight: 600;
	}
	.block {
		display: grid;
		gap: 8px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.bullets {
		display: grid;
		gap: 6px;
	}
	.bullets li {
		position: relative;
		padding-left: 16px;
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.5;
	}
	.bullets li::before {
		content: '';
		position: absolute;
		left: 2px;
		top: 0.62em;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
	}
	.links {
		display: flex;
		gap: 18px;
		flex-wrap: wrap;
	}
	.note {
		font-size: 12.5px;
		color: var(--ink-3);
		line-height: 1.5;
		padding: 10px 12px;
		border-radius: var(--r-sm);
		background: var(--win-2);
		border: 1px dashed var(--win-line);
	}
</style>
