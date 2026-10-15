<script lang="ts">
	import { profile } from '$lib/content';
	import Experience from '../blocks/Experience.svelte';
	import Icon from '../Icon.svelte';
</script>

<div class="app">
	<div class="head">
		<h2 class="h">Résumé</h2>
		<a class="btn btn-sm" href={profile.links.cv} target="_blank" rel="noopener noreferrer">
			<Icon name="file" size={15} />
			Open the CV (PDF)
			<span class="sr-only">(opens in a new tab)</span>
		</a>
	</div>
	<Experience level={2} />
</div>

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
	}
</style>
