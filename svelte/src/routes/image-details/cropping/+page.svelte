<script lang="ts">
	import { page } from '$app/stores';
	import ScanbotSDKService from '../../../service/scanbot-sdk-service';
	import Apply from '../../../subviews/toast/icon/Apply.svelte';
	import Cancel from '../../../subviews/toast/icon/Cancel.svelte';
	import Header from '../../../subviews/Header.svelte';
	import { onMount } from 'svelte';

	const id = $page.url.searchParams.get('id');
	const document = ScanbotSDKService.instance.getDocument(id);

	onMount(async () => {
		await ScanbotSDKService.instance.openCroppingView('cropping-view', id);
	});
</script>

<Header title="Crop" isBackButtonVisible={true} />

<div class="image-container">
	<div id="cropping-view" />
</div>

<div class="action-item-container">
	<button
		class="no-style crop-button"
		on:click={() => {
			window.history.back();
		}}><Cancel /></button
	>
	<button
		class="no-style crop-button"
		on:click={async () => {
			await ScanbotSDKService.instance.applyCrop(id);
			window.history.back();
		}}><Apply /></button
	>
</div>

<style>
	.image-container {
		display: flex;
		padding: 10px;
	}
	#cropping-view {
		width: 100%;
		height: calc(100vh - 200px);
		border-radius: 5px;
	}
	.action-item-container {
		display: flex;
		justify-content: space-between;
		position: fixed;
		bottom: 0;
		width: 94%;
		margin: 3%;
	}
	.crop-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 60px;
		height: 60px;
		border-radius: 50%;
		border: none;
		outline: none;
		cursor: pointer;
		background-color: #c8193c;
		box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
	}
</style>
