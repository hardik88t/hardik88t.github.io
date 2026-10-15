<script lang="ts">
	import AgentMonitor from '../blocks/AgentMonitor.svelte';
	import Workflow from '../blocks/Workflow.svelte';
</script>

<div class="app agents">
	<AgentMonitor />
	<div class="rule"></div>
	<Workflow live />
</div>

<style>
	.rule {
		height: 1px;
		background: var(--line);
	}
</style>
