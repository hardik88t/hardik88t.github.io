<script lang="ts">
	import { profile } from '$lib/content';
	import Heading, { type HLevel } from './Heading.svelte';

	let { level = 2 }: { level?: HLevel } = $props();
	const sub = $derived((Math.min(level + 1, 4) as HLevel));
</script>

<div class="exp">
	<ol class="timeline" aria-label="Work history">
		{#each profile.experience as e, i (e.company + e.role + e.from)}
			<li class="job">
				<span class="rail" aria-hidden="true"></span>
				<div class="job-head">
					<p class="job-dates mono">{e.from} to {e.to}</p>
					<Heading level={sub} id="job-{i}">{e.role}</Heading>
					<p class="job-company">
						{e.company}
						<span class="job-loc">· {e.location}</span>
					</p>
				</div>
				<ul class="job-points">
					{#each e.highlights as h (h)}
						<li>{h}</li>
					{/each}
				</ul>
				<ul class="chips" aria-label="Stack used">
					{#each e.stack as s (s)}
						<li class="chip">{s}</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ol>

	<section class="edu" aria-labelledby="edu-title">
		<Heading level={sub} id="edu-title">Education</Heading>
		{#each profile.education as ed (ed.institution)}
			<p class="edu-line"><strong>{ed.institution}</strong></p>
			<p class="edu-deg">{ed.degree} · <span class="tabular">{ed.from} to {ed.to}</span></p>
		{/each}
	</section>
</div>

<style>
	.exp {
		display: grid;
		gap: 26px;
	}
	.timeline {
		display: grid;
		gap: 22px;
	}
	.job {
		position: relative;
		display: grid;
		gap: 10px;
		padding-left: 26px;
	}
	.rail {
		position: absolute;
		left: 5px;
		top: 8px;
		bottom: -24px;
		width: 2px;
		background: var(--line);
	}
	.job:last-child .rail {
		display: none;
	}
	.job::before {
		content: '';
		position: absolute;
		left: 0;
		top: 6px;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: var(--win);
		border: 2px solid var(--accent);
		box-sizing: border-box;
	}
	.job-head {
		display: grid;
		gap: 2px;
	}
	.job-dates {
		font-size: 11px;
		color: var(--accent-ink);
		letter-spacing: 0.02em;
	}
	.job-company {
		font-size: 14.5px;
		color: var(--ink-2);
		font-weight: 600;
	}
	.job-loc {
		font-weight: 400;
		color: var(--ink-3);
	}
	.job-points {
		display: grid;
		gap: 6px;
	}
	.job-points li {
		position: relative;
		padding-left: 14px;
		font-size: 14px;
		color: var(--ink-2);
		line-height: 1.55;
	}
	.job-points li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.66em;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--ink-3);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.edu {
		display: grid;
		gap: 4px;
		padding: 16px 18px;
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		background: var(--win-2);
	}
	.edu-line {
		font-size: 15px;
	}
	.edu-deg {
		font-size: 14px;
		color: var(--ink-2);
	}
</style>
