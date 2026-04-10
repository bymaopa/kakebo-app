<script lang="ts">
	import { favicon } from '$lib';
	// Importamos el SASS global. Al estar en el layout principal, 
	// aplicará a toda la aplicación.
	import '$lib/ui/styles/global.style.scss';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
