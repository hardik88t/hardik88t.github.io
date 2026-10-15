<script lang="ts">
	import { content } from '$lib/content';
	import { revealOnScroll } from '$lib/reveal';

	const { principles } = content;
</script>

<section class="section" aria-labelledby="how-title" use:revealOnScroll>
	<div class="wrap">
		<header class="section-head">
			<p class="label">How I work</p>
			<h2 id="how-title">One person, end to end</h2>
		</header>

		<ul class="principles">
			{#each principles as item (item.title)}
				<li>
					<h3>{item.title}</h3>
					<p>{item.body}</p>
				</li>
			{/each}
		</ul>
	</div>
</section>

<style>
	.principles {
		display: grid;
		gap: 26px;
	}

	.principles li {
		padding-top: 20px;
		border-top: 1px solid var(--line);
		display: grid;
		gap: 10px;
		align-content: start;
	}

	.principles p {
		color: var(--ink-2);
		font-size: 1rem;
		line-height: 1.6;
	}

	@media (min-width: 760px) {
		.principles {
			grid-template-columns: repeat(3, 1fr);
			gap: 40px;
		}
	}
</style>
