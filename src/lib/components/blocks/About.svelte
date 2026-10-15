<script lang="ts">
	import { profile } from '$lib/content';
	import Heading, { type HLevel } from './Heading.svelte';
	import Monogram from '../Monogram.svelte';

	let { level = 2, showId = true }: { level?: HLevel; showId?: boolean } = $props();
</script>

<div class="about">
	{#if showId}
		<div class="about-id">
			<Monogram size={64} />
			<div>
				<Heading {level}>{profile.name}</Heading>
				<p class="about-role">{profile.role}</p>
			</div>
		</div>
	{/if}

	<div class="about-text">
		{#each profile.about as para (para)}
			<p>{para}</p>
		{/each}
	</div>

	<dl class="about-facts">
		<div>
			<dt>Based in</dt>
			<dd>{profile.location}</dd>
		</div>
		<div>
			<dt>Timezone</dt>
			<dd class="tabular">{profile.timezone}</dd>
		</div>
		<div>
			<dt>Availability</dt>
			<dd>{profile.availability}</dd>
		</div>
	</dl>
</div>

<style>
	.about {
		display: grid;
		gap: 18px;
	}
	.about-id {
		display: flex;
		align-items: center;
		gap: 16px;
	}
	.about-role {
		color: var(--ink-2);
		font-size: 14.5px;
		margin-top: 2px;
	}
	.about-text {
		display: grid;
		gap: 12px;
		color: var(--ink-2);
		font-size: 15px;
		line-height: 1.65;
		max-width: 66ch;
	}
	.about-facts {
		display: grid;
		gap: 1px;
		background: var(--line);
		border: 1px solid var(--line);
		border-radius: var(--r-md);
		overflow: hidden;
	}
	.about-facts div {
		display: grid;
		grid-template-columns: 120px minmax(0, 1fr);
		gap: 12px;
		padding: 11px 14px;
		background: var(--win);
		font-size: 14px;
	}
	.about-facts dt {
		color: var(--ink-3);
	}
	.about-facts dd {
		margin: 0;
		font-weight: 600;
	}
</style>
