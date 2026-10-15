<script lang="ts">
	import { profile } from '$lib/content';
	import Heading, { type HLevel } from './Heading.svelte';

	let { level = 2 }: { level?: HLevel } = $props();
	const groups = Object.entries(profile.skills);
	const sub = $derived((Math.min(level + 1, 4) as HLevel));
</script>

<div class="stack">
	{#each groups as [group, items] (group)}
		<section class="grp" aria-labelledby="skill-{group.replace(/\W+/g, '-')}">
			<Heading level={sub} id="skill-{group.replace(/\W+/g, '-')}">{group}</Heading>
			<ul class="chips">
				{#each items as item (item)}
					<li class="chip">{item}</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>

<style>
	.stack {
		display: grid;
		gap: 18px;
	}
	.grp {
		display: grid;
		gap: 8px;
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
</style>
