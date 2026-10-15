<script lang="ts">
	import type { IconName } from '$lib/icons';

	let {
		name,
		size = 18,
		label
	}: { name: IconName; size?: number; label?: string } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.7"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden={label ? undefined : 'true'}
	role={label ? 'img' : undefined}
	aria-label={label}
	focusable="false"
>
	{#if name === 'terminal'}
		<polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
	{:else if name === 'folder'}
		<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h3.6l2 2H18.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5z" />
	{:else if name === 'activity'}
		<path d="M3 12h4l2.5-6 4 12 2.5-6H21" />
	{:else if name === 'user'}
		<circle cx="12" cy="8.5" r="4" /><path d="M4.5 20.5c.9-3.6 3.9-5.5 7.5-5.5s6.6 1.9 7.5 5.5" />
	{:else if name === 'layers'}
		<path d="M12 3.5 21 8l-9 4.5L3 8z" /><path d="m3 12.5 9 4.5 9-4.5" /><path d="m3 17 9 4.5 9-4.5" />
	{:else if name === 'doc'}
		<path d="M7 3.5h7.5L19 8v12.5H7z" /><path d="M14.5 3.5V8H19" /><path d="M10 12.5h6M10 16h6" />
	{:else if name === 'file'}
		<path d="M7 3.5h7.5L19 8v12.5H7z" /><path d="M14.5 3.5V8H19" /><path d="M10 13h5M10 16.5h3" />
	{:else if name === 'mail'}
		<rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" />
	{:else if name === 'settings'}
		<path d="M3 7h9M16 7h5M3 17h5M12 17h9" />
		<circle cx="14" cy="7" r="2.2" /><circle cx="10" cy="17" r="2.2" />
	{:else if name === 'chevron-left'}
		<path d="m14.5 6-6 6 6 6" />
	{:else if name === 'chevron-right'}
		<path d="m9.5 6 6 6-6 6" />
	{:else if name === 'close'}
		<path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
	{:else if name === 'minus'}
		<path d="M5.5 12h13" />
	{:else if name === 'expand'}
		<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
	{:else if name === 'arrow-up-right'}
		<path d="M7 17 17 7M8.5 7H17v8.5" />
	{:else if name === 'copy'}
		<rect x="8.5" y="8.5" width="11.5" height="11.5" rx="2.5" /><path d="M5.5 15.5V6a2.5 2.5 0 0 1 2.5-2.5h9.5" />
	{:else if name === 'check'}
		<path d="m5 12.5 4.5 4.5L19 7.5" />
	{:else if name === 'github'}
		<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65S8.93 17.38 9 18v4" /><path d="M9 18c-4.51 2-5-2-7-2" />
	{:else if name === 'linkedin'}
		<rect x="3" y="9" width="4" height="11.5" rx="1" /><circle cx="5" cy="5" r="2" /><path d="M10.5 9.5h3.8v1.8c.6-1.1 2-2.1 4-2.1 3.8 0 4.5 2.4 4.5 5.6v6.2h-4v-5.5c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.6h-4z" />
	{:else if name === 'book'}
		<path d="M3.5 5.5A2 2 0 0 1 5.5 4H11v15H5.5a2 2 0 0 0-2 1.5z" /><path d="M20.5 5.5A2 2 0 0 0 18.5 4H13v15h5.5a2 2 0 0 1 2 1.5z" />
	{:else if name === 'sun'}
		<circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
	{:else if name === 'moon'}
		<path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z" />
	{:else if name === 'display'}
		<rect x="2.5" y="3.5" width="19" height="13" rx="2.5" /><path d="M8.5 20.5h7M12 16.5v4" />
	{:else if name === 'cpu'}
		<rect x="6.5" y="6.5" width="11" height="11" rx="2" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9.5 2.5v4M14.5 2.5v4M9.5 17.5v4M14.5 17.5v4M2.5 9.5h4M2.5 14.5h4M17.5 9.5h4M17.5 14.5h4" />
	{:else if name === 'home'}
		<path d="M3.5 11 12 4l8.5 7v8.5a1 1 0 0 1-1 1h-4.5v-5.5h-6V20.5H4.5a1 1 0 0 1-1-1z" />
	{:else if name === 'grid'}
		<rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
	{:else if name === 'send'}
		<path d="M21 3 10.5 13.5M21 3l-6.5 18-4-7.5-7.5-4z" />
	{/if}
</svg>
