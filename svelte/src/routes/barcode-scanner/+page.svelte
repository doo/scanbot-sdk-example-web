<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import ScanbotSDKService from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';
	onMount(async () => {
		ScanbotSDKService.instance.createBarcodeScanner('barcode-scanner');
	});
	onDestroy(() => {
		ScanbotSDKService.instance.disposeBarcodeScanner();
	});
</script>

<Header title="Barcode Scanner" isBackButtonVisible={true} />

<div id="barcode-scanner" style="width: 100%; height: calc(100vh - 50px)" />
