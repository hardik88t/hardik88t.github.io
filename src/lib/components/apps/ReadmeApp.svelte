<script lang="ts">
	import { openApp } from '$lib/state/ui.svelte';
	import Hero from '../blocks/Hero.svelte';
	import Icon from '../Icon.svelte';
</script>

<div class="app readme">
	<Hero variant="window" />
	<nav class="explore" aria-label="Explore the desktop">
		<p class="eyebrow">Explore</p>
		<ul>
			<li><button class="btn btn-sm" type="button" onclick={() => openApp('work')}><Icon name="folder" size={15} />Work</button></li>
			<li><button class="btn btn-sm" type="button" onclick={() => openApp('services')}><Icon name="layers" size={15} />Services</button></li>
			<li><button class="btn btn-sm" type="button" onclick={() => openApp('about')}><Icon name="user" size={15} />About</button></li>
			<li><button class="btn btn-sm" type="button" onclick={() => openApp('resume')}><Icon name="file" size={15} />Résumé</button></li>
		</ul>
	</nav>
</div>

<style>
	.explore {
		display: grid;
		gap: 10px;
		padding-top: 18px;
		border-top: 1px solid var(--line);
	}
	.explore ul {
		display: flex;
		flex-wrap: wrap;
		gap: 8px;
	}
	.explore .btn-sm {
		min-height: 40px;
		padding: 8px 14px;
		font-size: 14px;
	}
</style>
