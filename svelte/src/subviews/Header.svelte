<script>
	export let title = '';
	export let isBackButtonVisible = false;

	import { ChevronLeftSolid } from 'svelte-awesome-icons';
</script>

<div class="navigation">
	<button
		class="no-style back-button"
		style="display: {isBackButtonVisible ? 'block' : 'none'}; color: white;"
		on:click={() => window.history.back()}><ChevronLeftSolid size={16} /></button
	>
	<div class="navigation-text {isBackButtonVisible && 'no-left-pad'}">Scanbot SDK | {title}</div>
</div>

<style>
	.no-style {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
		text-align: start;
	}
	.back-button {
		font-family: Inter, sans-serif;
		font-weight: 200;
		width: 40px;
		text-align: center;
		padding-top: 3px;
	}
	.navigation {
		display: flex;
		background-color: #c8193c;
		height: 50px;
	}
	.navigation-text {
		color: white;
		font-size: 15x;
		margin: auto 20px;
		font-family: Inter, sans-serif;
		font-weight: 200;
	}
	.no-left-pad {
		margin-left: 0;
	}
</style>
