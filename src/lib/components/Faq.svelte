<script lang="ts">
	import { content } from '$lib/content';
	import { revealOnScroll } from '$lib/reveal';

	const { faq } = content.studio;

	// One open at a time. All closed by default to keep the phone page short.
	let open = $state<number | null>(null);

	function toggle(index: number) {
		open = open === index ? null : index;
	}
</script>

<section id="faq" class="section" aria-labelledby="faq-title" use:revealOnScroll>
	<div class="wrap">
		<header class="section-head">
			<p class="label">FAQ</p>
			<h2 id="faq-title">Questions, answered</h2>
		</header>

		<ul class="faq">
			{#each faq as item, i (item.q)}
				<li class="qa">
					<h3>
						<button
							type="button"
							class="q"
							id="faq-q-{i}"
							aria-expanded={open === i}
							aria-controls="faq-a-{i}"
							onclick={() => toggle(i)}
						>
							<span>{item.q}</span>
							<span class="plus" aria-hidden="true"></span>
						</button>
					</h3>
					<div id="faq-a-{i}" class="panel" class:is-open={open === i} inert={open !== i}>
						<div class="panel-inner">
							<p>{item.a}</p>
						</div>
					</div>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.faq {
		border-bottom: 1px solid var(--line);
	}

	.qa {
		border-top: 1px solid var(--line);
	}

	.q {
		width: 100%;
		min-height: 60px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 18px;
		padding: 16px 0;
		background: transparent;
		border: 0;
		text-align: left;
		cursor: pointer;
		font: 600 1.0625rem/1.35 var(--font-sans);
		letter-spacing: -0.01em;
		color: var(--ink);
	}

	.q:hover span:first-child {
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-underline-offset: 4px;
	}

	.plus {
		position: relative;
		flex: none;
		width: 14px;
		height: 14px;
	}

	.plus::before,
	.plus::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		top: 50%;
		height: 2px;
		margin-top: -1px;
		border-radius: 1px;
		background: var(--ink);
		transition:
			transform 0.3s ease,
			opacity 0.3s ease;
	}

	.plus::after {
		transform: rotate(90deg);
	}

	.q[aria-expanded='true'] .plus::after {
		transform: rotate(0deg);
		opacity: 0;
	}

	.panel {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.35s ease;
	}

	.panel.is-open {
		grid-template-rows: 1fr;
	}

	.panel-inner {
		overflow: hidden;
		min-height: 0;
	}

	.panel p {
		max-width: 62ch;
		padding: 0 40px 22px 0;
		color: var(--ink-2);
		line-height: 1.6;
	}

	@media (min-width: 760px) {
		.q {
			font-size: 1.1875rem;
		}
	}
</style>
