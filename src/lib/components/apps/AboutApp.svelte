<script lang="ts">
	import About from '../blocks/About.svelte';
	import Stack from '../blocks/Stack.svelte';
</script>

<div class="app about-app">
	<About level={2} />
	<div class="rule"></div>
	<section class="stack-sec" aria-labelledby="about-stack">
		<h2 id="about-stack" class="h">Stack and skills</h2>
		<Stack level={2} />
	</section>
</div>

<style>
	.rule {
		height: 1px;
		background: var(--line);
	}
	.stack-sec {
		display: grid;
		gap: 16px;
	}
</style>
