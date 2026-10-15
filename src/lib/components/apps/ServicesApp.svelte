<script lang="ts">
	import Services from '../blocks/Services.svelte';
</script>

<div class="app">
	<div class="intro">
		<h2 class="h">What I build for clients</h2>
		<p>Four kinds of work, built with the same gated, agent-driven pipeline.</p>
	</div>
	<Services level={2} cta="window" />
</div>

<style>
	.intro {
		display: grid;
		gap: 6px;
	}
	.intro p {
		font-size: 14.5px;
		color: var(--ink-2);
	}
</style>
