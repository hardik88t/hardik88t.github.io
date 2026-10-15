<script lang="ts">
	import { content } from '$lib/content';

	const { person } = content;
</script>

<footer class="site-footer">
	<div class="wrap foot">
		<p class="name">
			<span class="mark" aria-hidden="true">{person.monogram}</span>
			{person.name}
		</p>
		<p class="meta">{person.location} <span aria-hidden="true">·</span> {person.timezone}</p>
	</div>
</footer>

<style>
	.site-footer {
		border-top: 1px solid var(--line);
		padding-block: 32px 40px;
	}

	.foot {
		display: grid;
		gap: 14px;
	}

	.name {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-weight: 700;
		letter-spacing: -0.01em;
	}

	.mark {
		width: 28px;
		height: 28px;
		border-radius: 8px;
		background: var(--ink);
		color: #ffffff;
		display: grid;
		place-items: center;
		font: 700 0.7rem/1 var(--font-sans);
	}

	.meta {
		color: var(--ink-2);
		font-size: 1rem;
	}

	@media (min-width: 760px) {
		.foot {
			grid-template-columns: 1fr auto;
			align-items: center;
		}
	}
</style>
