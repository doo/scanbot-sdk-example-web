<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script>
    import { onMount } from 'svelte';
	import ScanbotSDKService from '../service/scanbot-sdk-service';
    onMount(async () => {
        ScanbotSDKService.instance.initialize();
        
	});
</script>