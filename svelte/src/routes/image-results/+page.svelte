<script lang="ts">
	import { onMount } from 'svelte';
	import ScanbotSDKService, { ScanbotDocument } from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';

	let documents: ScanbotDocument[] = [];
	
	onMount(async () => {
		documents = ScanbotSDKService.instance.getDocuments();
		console.log('Total documents:', documents.length);
	});
</script>

<Header title="Image Results" isBackButtonVisible={true} />

{#if documents.length === 0}
	<div style="display: flex; justify-content: center; padding-top: 20%">
		<div>Your scanned documents will be displayed here</div>
	</div>
{/if}

<div class="document-gallery">
	{#each documents as document}
		<div class="image-container">
			<a href="image-results/image-details?id={document.id}">
				<img class="document-image" src={document.base64} alt="<document>" />
			</a>
		</div>
	{/each}
</div>

<style>
	.document-gallery {
		margin-top: 10%;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
	.image-container {
		flex-basis: 30%;
	}
	.document-image {
		height: auto;
		object-fit: contain;
		border-radius: 5px;
		max-width: 100%;
		vertical-align: middle;
	}
</style>
