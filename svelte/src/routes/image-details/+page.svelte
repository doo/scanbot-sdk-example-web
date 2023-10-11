<script lang="ts">
	let isCroppingViewVisible = false;

	import { page } from '$app/stores';
	import ScanbotSDKService from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';
	import Crop from '../../subviews/toast/icon/Crop.svelte';

	const id = $page.url.searchParams.get('id');
	const document = ScanbotSDKService.instance.getDocument(id);
</script>

<Header title="Image Details" isBackButtonVisible={true} />

<div class="image-container">
	{#if isCroppingViewVisible}
		<div id="cropping-view" style="width: 100%; height: calc(100vh - 50px); border-radius: 5px" />
	{/if}
	{#if !isCroppingViewVisible}
		<img class="document-image" src={document?.base64} alt="<document>" />
	{/if}
</div>

<div class="action-item-container">
	<button
		class="no-style crop-button"
		on:click={() => {
            isCroppingViewVisible = true;
			ScanbotSDKService.instance.openCroppingView('cropping-view', id);
		}}><Crop /></button
	>
</div>

<style>
	.image-container {
		display: flex;
		padding: 10px;
	}
	.document-image {
		height: auto;
		object-fit: contain;
		border-radius: 5px;
		max-width: 100%;
		vertical-align: middle;
	}
	.action-item-container {
		margin-top: 20px;
		display: flex;
		justify-content: center;
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
