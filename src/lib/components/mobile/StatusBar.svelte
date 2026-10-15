<script lang="ts">
	import { onMount } from 'svelte';
	import { istTime } from '$lib/format';

	let now = $state(new Date());
	onMount(() => {
		const id = setInterval(() => (now = new Date()), 15000);
		return () => clearInterval(id);
	});
</script>

<div class="status-bar" aria-hidden="true">
	<time class="sb-time tabular" datetime={now.toISOString()}>{istTime(now)}</time>
	<span class="sb-icons">
		<svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
			<rect x="0" y="7" width="3" height="4" rx="0.8" />
			<rect x="4.5" y="5" width="3" height="6" rx="0.8" />
			<rect x="9" y="2.5" width="3" height="8.5" rx="0.8" />
			<rect x="13.5" y="0" width="3" height="11" rx="0.8" />
		</svg>
		<svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
			<path d="M7.5 10.6 0.2 3.5a10.4 10.4 0 0 1 14.6 0z" opacity="0.35" />
			<path d="M7.5 10.6 3 6.2a6.4 6.4 0 0 1 9 0z" />
		</svg>
		<svg width="25" height="12" viewBox="0 0 25 12" fill="none">
			<rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="currentColor" opacity="0.45" />
			<rect x="2.5" y="2.5" width="15" height="7" rx="1.6" fill="currentColor" />
			<path d="M23 4v4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" opacity="0.5" />
		</svg>
	</span>
</div>

<style>
	.status-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 44px;
		padding: env(safe-area-inset-top, 0px) 26px 0;
		color: var(--ink);
		flex: none;
	}
	.sb-time {
		font-size: 16px;
		font-weight: 650;
		letter-spacing: -0.01em;
	}
	.sb-icons {
		display: flex;
		align-items: center;
		gap: 6px;
	}
</style>
