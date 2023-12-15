<script lang="ts">
	export let color = 'white';
	export let size = 32;

	const fullSize = 54;
	const scale = size / fullSize;
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	height={fullSize}
	width={fullSize}
	style="transform: scale({scale})"
>
	<path
		stroke-linejoin="round"
		stroke={color}
		stroke-linecap="round"
		stroke-width="5"
		fill="none"
		d="m13.2 39 35-34.6m-45 8.1h36.6v38m-27-47v36.6h38"
	/>
</svg>
