<script lang="ts">
	import { onMount } from 'svelte';
	import ScanbotSDKService from '../service/scanbot-sdk-service';
	import Header from '../subviews/Header.svelte';
	onMount(async () => {
		ScanbotSDKService.instance.initialize();
	});

	function onFeatureClick(sender: any) {
		const text = (sender.target as HTMLButtonElement).innerText;
		if (text === 'Document scanner') {
			window.location.href = '/document-scanner';
		} else if (text === 'Barcode scanner') {
			window.location.href = '/barcode-scanner';
		}
	}
</script>

<svelte:head>
	<title>Scanbot-Svelte</title>
	<meta name="description" content="Svelte demo app for ScanbotSDK implementation" />
</svelte:head>

<Header title="Svelte Example" />

<div class="list">
	<button on:click={onFeatureClick} class="no-style list-item">Document scanner</button>
	<button on:click={onFeatureClick} class="no-style list-item">Barcode scanner</button>
</div>

<style>
	.no-style {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		text-align: start;
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

		font-family: Inter, sans-serif;
		font-weight: 200;
		font-size: 15px;
		cursor: pointer;
	}
</style>
