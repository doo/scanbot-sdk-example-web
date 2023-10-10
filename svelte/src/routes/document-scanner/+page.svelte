<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import ScanbotSDKService from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';
	onMount(async () => {
		ScanbotSDKService.instance.createDocumentScanner('document-scanner');
	});
	onDestroy(() => {
		ScanbotSDKService.instance.disposeDocumentScanner();
	});
</script>

<Header title="Document Scanner" isBackButtonVisible={true} />

<div id="document-scanner" style="width: 100%; height: calc(100vh - 50px); background-color: black" />
