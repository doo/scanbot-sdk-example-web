<script lang="ts">
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import ScanbotSDKService from '../../../service/scanbot-sdk-service';
	import Header from '../../../subviews/Header.svelte';
	import Crop from '../../../subviews/toast/icon/Crop.svelte';
	import type { ScanbotDocument } from '../../../service/scanbot-sdk-service';

	let id: string | undefined;
	let document: ScanbotDocument | undefined;

	onMount(async () => {
		id = $page.url.searchParams.get('id') ?? undefined;
		document = await ScanbotSDKService.instance.getDocument(id);
	});
</script>

<Header title="Image Details" isBackButtonVisible={true} />

<div class="image-container">
	<img class="document-image" src={document?.base64} alt="<document>" />
</div>

<div class="action-item-container">
	<a href="image-details/cropping?id={id}" class="no-style crop-button"><Crop /> </a>
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
