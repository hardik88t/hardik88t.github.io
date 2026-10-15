<script lang="ts">
	import { content, pad2 } from '$lib/content';
	import { revealOnScroll } from '$lib/reveal';

	const { steps } = content.studio;
</script>

<section id="process" class="section" aria-labelledby="process-title" use:revealOnScroll>
	<div class="wrap">
		<header class="section-head">
			<p class="label">Process</p>
			<h2 id="process-title">From first call to handover</h2>
		</header>

		<ol class="steps">
			{#each steps as step, i (step.title)}
				<li>
					<span class="num" aria-hidden="true">{pad2(i + 1)}</span>
					<div class="copy">
						<h3>{step.title}</h3>
						<p>{step.body}</p>
					</div>
				</li>
			{/each}
		</ol>
	</div>
</section>

<style>
	.steps {
		display: grid;
		counter-reset: none;
	}

	.steps li {
		display: grid;
		grid-template-columns: 62px 1fr;
		gap: 16px;
		align-items: start;
		padding-block: 20px;
		border-top: 1px solid var(--line);
		align-content: start;
	}

	.steps li:last-child {
		border-bottom: 1px solid var(--line);
	}

	.num {
		font-size: 2.75rem;
		line-height: 0.9;
		font-weight: 700;
		letter-spacing: -0.05em;
		color: var(--accent);
		font-variant-numeric: tabular-nums;
	}

	.copy {
		display: grid;
		gap: 8px;
	}

	.copy p {
		color: var(--ink-2);
		line-height: 1.6;
	}

	@media (min-width: 760px) {
		.steps {
			grid-template-columns: repeat(2, 1fr);
			column-gap: 48px;
		}

		.steps li {
			grid-template-columns: 1fr;
			gap: 20px;
			padding-block: 34px;
		}

		.steps li:nth-child(n + 3) {
			border-bottom: 1px solid var(--line);
		}

		.num {
			font-size: 4.5rem;
		}
	}

	@media (min-width: 1000px) {
		.steps {
			grid-template-columns: repeat(4, 1fr);
			column-gap: 32px;
		}

		.steps li {
			padding-block: 34px 0;
			border-bottom: 0;
		}

		.steps li:last-child {
			border-bottom: 0;
		}

		.steps li:nth-child(n + 3) {
			border-bottom: 0;
		}

		.steps li {
			border-top-width: 1px;
		}

		.num {
			font-size: 4.75rem;
		}
	}
</style>
