<script lang="ts">
	import { profile } from '$lib/content';

	let { size = 40, label = true }: { size?: number; label?: boolean } = $props();
</script>

<span
	class="monogram"
	style:width="{size}px"
	style:height="{size}px"
	style:font-size="{Math.round(size * 0.36)}px"
	aria-hidden={label ? undefined : 'true'}
	role={label ? 'img' : undefined}
	aria-label={label ? `${profile.name} monogram` : undefined}
>
	{profile.monogram}
</span>

<style>
	.monogram {
		position: relative;
		display: inline-grid;
		place-items: center;
		flex: none;
		border-radius: 28%;
		background: linear-gradient(150deg, var(--ink) 0%, color-mix(in srgb, var(--ink) 80%, var(--accent)) 100%);
		color: var(--desk);
		font-family: var(--font-ui);
		font-weight: 800;
		letter-spacing: -0.04em;
		line-height: 1;
		user-select: none;
	}
	.monogram::after {
		content: '';
		position: absolute;
		right: 3%;
		top: 3%;
		width: 20%;
		height: 20%;
		border-radius: 50%;
		background: var(--accent);
	}
</style>
