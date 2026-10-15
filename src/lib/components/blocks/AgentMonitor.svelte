<script lang="ts">
	import { live } from '$lib/actions/live';
	import { agentic, pipeline } from '$lib/content';
	import { runningCount, sim, stageOf } from '$lib/state/sim.svelte';
</script>

<section class="monitor" aria-labelledby="monitor-title" use:live>
	<div class="mon-head">
		<h2 id="monitor-title" class="h">Agent activity</h2>
		<p class="mon-sum" role="status">
			<span class="dot-live" aria-hidden="true"></span>
			<span><span class="tabular">{runningCount()}</span> running</span>
		</p>
	</div>

	<div class="proc-head" aria-hidden="true">
		<span>Agent</span><span>Task</span><span>Stage</span><span>Progress</span>
	</div>
	<ul class="procs" aria-label="Simulated agent processes">
		{#each sim.rows as r (r.agent)}
			{@const s = stageOf(r.progress)}
			<li class="proc" class:late={s >= 5}>
				<span class="proc-name">{r.agent}</span>
				<span class="proc-task">{r.task}</span>
				<span class="proc-stage"><span class="proc-stage-n tabular">{s + 1}/{pipeline.length}</span> {pipeline[s].title}</span>
				<span
					class="bar"
					role="progressbar"
					aria-label="{r.agent} progress"
					aria-valuemin="0"
					aria-valuemax="100"
					aria-valuenow={Math.round(r.progress)}
				>
					<span class="bar-fill" style:width="{Math.min(100, r.progress)}%"></span>
				</span>
			</li>
		{/each}
	</ul>
	<p class="mon-note">
		Simulated, looping activity. The agent names, sample tasks and pipeline stages are real. The
		progress is illustrative. ({agentic.agents.length} agents in the fleet.)
	</p>
</section>

<style>
	.monitor {
		display: grid;
		gap: 10px;
	}
	.mon-head {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
	.mon-sum {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 13px;
		color: var(--ink-2);
		font-weight: 600;
	}
	.proc-head,
	.proc {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.5fr) minmax(0, 1.05fr) minmax(0, 0.9fr);
		gap: 12px;
		align-items: center;
	}
	.proc-head {
		padding: 0 12px;
		font-family: var(--font-mono);
		font-size: 10.5px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-3);
	}
	.procs {
		display: grid;
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		overflow: hidden;
		background: var(--win);
	}
	.proc {
		padding: 10px 12px;
		font-size: 13px;
		border-top: 1px solid var(--line);
	}
	.procs > .proc:first-child {
		border-top: 0;
	}
	.proc-name {
		font-weight: 700;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.proc-task {
		color: var(--ink-2);
		font-size: 12.5px;
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-family: var(--font-mono);
	}
	.proc-stage {
		color: var(--ink-2);
		font-size: 12.5px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.proc-stage-n {
		display: inline-block;
		min-width: 2.6em;
		font-family: var(--font-mono);
		font-size: 11px;
		color: var(--ink-3);
	}
	.bar {
		position: relative;
		height: 8px;
		border-radius: 999px;
		background: var(--chip);
		overflow: hidden;
	}
	.bar-fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: inherit;
		background: var(--accent);
		transition: width 1000ms linear;
	}
	.late .bar-fill {
		background: var(--ok-dot);
	}
	.mon-note {
		font-size: 12.5px;
		color: var(--ink-3);
		line-height: 1.5;
	}

	/* Narrow containers (phone sheet): each process becomes a two-line card. */
	@container (max-width: 560px) {
		.proc-head {
			display: none;
		}
		.proc {
			grid-template-columns: minmax(0, 1fr) auto;
			grid-template-areas:
				'name stage'
				'task task'
				'bar bar';
			row-gap: 6px;
		}
		.proc-name {
			grid-area: name;
		}
		.proc-task {
			grid-area: task;
			white-space: normal;
		}
		.proc-stage {
			grid-area: stage;
			justify-self: end;
		}
		.bar {
			grid-area: bar;
		}
	}
</style>
