<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { addToast } from '../../subviews/toast/store';

	import ScanbotSDKService from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';
	import type { BarcodeResult } from 'scanbot-web-sdk/@types/model/barcode/barcode-result';
	import Toasts from '../../subviews/toast/Toasts.svelte';

	// Optionally set default options here
	const options = {};

	onMount(async () => {
		ScanbotSDKService.instance.createBarcodeScanner('barcode-scanner', (result: BarcodeResult) => {
			console.log('found barcode', result);
			const code = result.barcodes.length > 0 ? result.barcodes[0] : undefined;
			console.log('code', code);
			if (code) {
				const message = `${code.format} - ${code.text}`;
				const timeout = 3000;
				const dismissible = false;
				const type = 'success';

				addToast({ message, type, dismissible, timeout });
			}
		});
	});
	onDestroy(() => {
		ScanbotSDKService.instance.disposeBarcodeScanner();
	});
</script>

<Header title="Barcode Scanner" isBackButtonVisible={true} />

<Toasts />

<div id="barcode-scanner" style="width: 100%; height: calc(100vh - 50px)" />
