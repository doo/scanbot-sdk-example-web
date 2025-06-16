<script lang="ts">
    import { onMount } from 'svelte';
    import ScanbotSDKService from '../../service/scanbot-sdk-service';
    import Header from '../../subviews/Header.svelte';
    import type { SBStoreCroppedDetectionResult } from "scanbot-web-sdk/@types";

    let images: { base64: string, document: SBStoreCroppedDetectionResult }[] = [];

    onMount(async () => {
        await ScanbotSDKService.instance.initialize();
        const documents = await ScanbotSDKService.instance.getDocuments();
        console.log('Total documents:', documents.length);
        
        images = await Promise.all(documents.map(async (doc) => {
			const base64 = await ScanbotSDKService.instance.toDataUrl(doc);
			return { base64, document: doc };
		}));
    });
</script>

<Header title="Image Results" isBackButtonVisible={true} />

{#if images.length === 0}
    <div style="display: flex; justify-content: center; padding-top: 20%">
        <div>Your scanned documents will be displayed here</div>
    </div>
{/if}

<div class="document-gallery">
    {#each images as image}
        <div class="image-container">
            <a href="image-results/image-details?id={image.document.id}">
                <img class="document-image" src={image.base64} alt="<document>" />
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
