<script>
	export let title = '';
	export let isBackButtonVisible = false;

	import { ChevronLeftSolid } from 'svelte-awesome-icons';

	function onBackPress() {
		window.history.back();
	}
</script>

<div class="container">
	<button class="no-style back-button {isBackButtonVisible && 'visible'}" on:click={onBackPress}>
		<ChevronLeftSolid size={16} />
	</button>
	<div class="text {isBackButtonVisible && 'no-left-pad'}">Scanbot SDK | {title}</div>
</div>

<style>
	.back-button {
		width: 40px;
		text-align: center;
		padding-top: 3px;
		color: white;
		display: none;
	}
	.container {
		display: flex;
		background-color: #c8193c;
		height: 50px;
	}
	.text {
		color: white;
		font-size: 15x;
		margin: auto 20px;
	}
	.no-left-pad {
		margin-left: 0;
	}
	.visible {
		display: block;
	}
</style>
