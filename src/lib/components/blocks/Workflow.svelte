<script lang="ts">
	import { agentic } from '$lib/content';
	import Heading, { type HLevel } from './Heading.svelte';
	import Icon from '../Icon.svelte';
	import Metrics from './Metrics.svelte';
	import Pipeline from './Pipeline.svelte';

	let { level = 2, live = false }: { level?: HLevel; live?: boolean } = $props();
	const sub = $derived((Math.min(level + 1, 4) as HLevel));
</script>

<div class="workflow">
	<p class="thesis">{agentic.thesis}</p>
	<p class="summary">{agentic.summary}</p>

	<section class="wf-block" aria-labelledby="wf-pipeline">
		<Heading level={sub} id="wf-pipeline">The pipeline</Heading>
		<p class="wf-note">Every change moves through these stages. Expand a stage to see what happens.</p>
		<div class="pipe-wrap">
			<Pipeline {live} />
		</div>
	</section>

	<section class="wf-block" aria-labelledby="wf-numbers">
		<Heading level={sub} id="wf-numbers">The numbers</Heading>
		<Metrics />
	</section>

	<div class="wf-two">
		<section class="wf-block" aria-labelledby="wf-guard">
			<Heading level={sub} id="wf-guard">Guardrails</Heading>
			<ul class="check-list">
				{#each agentic.guardrails as g (g)}
					<li><Icon name="check" size={16} />{g}</li>
				{/each}
			</ul>
		</section>

		<section class="wf-block" aria-labelledby="wf-tools">
			<Heading level={sub} id="wf-tools">Tools I built</Heading>
			<ul class="tools">
				{#each agentic.tooling as t (t.name)}
					<li>
						<p class="tool-name mono">{t.name}</p>
						<p class="tool-detail">{t.detail}</p>
					</li>
				{/each}
			</ul>
		</section>
	</div>

	<section class="wf-block" aria-labelledby="wf-backlog">
		<Heading level={sub} id="wf-backlog">Sample backlog</Heading>
		<p class="wf-note">Example tasks written in the Conventional Commits style the monorepo uses. Each one goes through the same pipeline.</p>
		<ul class="backlog">
			{#each agentic.sampleTasks as t (t)}
				<li class="mono">{t}</li>
			{/each}
		</ul>
	</section>
</div>

<style>
	.workflow {
		display: grid;
		gap: 22px;
	}
	.thesis {
		font-size: clamp(1.15rem, 2vw, 1.4rem);
		font-weight: 650;
		letter-spacing: -0.02em;
		line-height: 1.3;
		max-width: 40ch;
		text-wrap: balance;
	}
	.summary {
		color: var(--ink-2);
		font-size: 15px;
		line-height: 1.65;
		max-width: 70ch;
	}
	.wf-block {
		display: grid;
		gap: 12px;
		min-width: 0;
		align-content: start;
	}
	.wf-note {
		font-size: 13px;
		color: var(--ink-3);
		line-height: 1.5;
		margin-top: -6px;
	}
	.pipe-wrap {
		container-type: inline-size;
	}
	.wf-two {
		display: grid;
		gap: 22px;
		grid-template-columns: minmax(0, 1fr);
	}
	.tools {
		display: grid;
		gap: 12px;
	}
	.tools li {
		padding: 12px 14px;
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		background: var(--win-2);
	}
	.tool-name {
		font-size: 12.5px;
		font-weight: 600;
		color: var(--ink);
	}
	.tool-detail {
		font-size: 13.5px;
		color: var(--ink-2);
		line-height: 1.5;
		margin-top: 2px;
	}
	.backlog {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.backlog li {
		padding: 6px 10px;
		border-radius: var(--r-xs);
		background: var(--chip);
		border: 1px solid var(--chip-line);
		font-size: 12px;
		color: var(--ink-2);
		overflow-wrap: anywhere;
	}
	@media (min-width: 640px) {
		.wf-two {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
