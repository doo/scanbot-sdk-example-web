<script lang="ts">
	import { onMount } from 'svelte';
	import ScanbotSDKService from '../../service/scanbot-sdk-service';
	import Header from '../../subviews/Header.svelte';
	onMount(async () => {
		// ScanbotSDKService.instance.initialize();
	});

	console.log('document-scanner +page.svelte');
</script>

<Header title="Document Scanner" isBackButtonVisible={true} />
