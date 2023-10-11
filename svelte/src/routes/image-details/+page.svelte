<script lang="ts">
	import { page } from '$app/stores';
	import ScanbotSDKService from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';
	import Footer from '../../subviews/Footer.svelte';

	const id = $page.url.searchParams.get('id');
	const document = ScanbotSDKService.instance.getDocument(id);
</script>

<Header title="Image Details" isBackButtonVisible={true} />

<div class="image-container">
	<img class="document-image" src={document?.base64} alt="<document>" />
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
</style>
