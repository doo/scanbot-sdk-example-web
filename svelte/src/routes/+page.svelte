<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<script>
    import { onMount } from 'svelte';
    onMount(async () => {
		// const sdk = (await import('scanbot-web-sdk')).default;
		// const scanbotSDK = await sdk.initialize({ licenseKey: '' });
        console.log('Hello from onMount!');
	});
</script>