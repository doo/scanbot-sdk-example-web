<script lang="ts">
	let loading = true;
    
	import { onMount } from 'svelte';
	import ScanbotSDKService from '../service/scanbot-sdk-service';
	import Header from '../subviews/Header.svelte';
	import Loader from '../subviews/Loader.svelte';

	onMount(async () => {
		await ScanbotSDKService.instance.initialize();
		loading = false;
	});
</script>

<svelte:head>
	<title>Scanbot-Svelte</title>
	<meta name="description" content="Svelte demo app for ScanbotSDK implementation" />
</svelte:head>

<Header title="Svelte Example" />
<Loader {loading} />

<div class="list">
	<a class="no-style list-item" href="document-scanner"><div>Document scanner</div></a>
	<a class="no-style list-item" href="barcode-scanner"><div>Barcode scanner</div></a>
	<a class="no-style list-item" href="image-results"><div>Image Results</div></a>
</div>

<style>
	/** List styling */
	.no-style {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		text-align: start;
		text-decoration: none;
	}
	.list {
		display: flex;
		flex-direction: column;
		margin: 20px;
	}
	.list-item {
		margin: 10px;
		padding-bottom: 10px;
		border-bottom: 1px solid lightgray;
		font-size: 15px;
		cursor: pointer;
	}

	/** Global styles */
	:global(body) {
		margin: 0;
		font-family: Inter, sans-serif;
		font-weight: 200;
	}

	:global(.no-style) {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		text-align: start;
	}
</style>
