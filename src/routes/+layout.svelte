<script lang="ts">
	import { favicon } from '$lib';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<main id="" class="">
	{@render children()}
</main>
