<script lang="ts">
	export let loading = true;

	import { Jumper } from 'svelte-loading-spinners';
</script>

{#if loading}
	<div
		style="width: 100vw; height: 100vh; position: fixed; display: flex; justify-content: center; padding-top: 30%"
	>
		<Jumper size="60" color="#c8193c" unit="px" duration="1s" />
	</div>
{/if}
