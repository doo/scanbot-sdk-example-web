<script lang="ts">
	import { onMount } from 'svelte';
	import ScanbotSDKService from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';
	onMount(async () => {
		// ScanbotSDKService.instance.initialize();
	});
</script>

<Header title="Barcode Scanner" isBackButtonVisible={true} />
