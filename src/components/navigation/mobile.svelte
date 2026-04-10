<!-- -->
 
<div class="bottom-nav-wrapper">
	<nav class="bottom-nav">
		{#each LIST_MENU_NAVIGATION_MOBILE as item (item.id)}
			<!-- {@const Icon = item.icon} -->
			{@const isActive = activeTab === item.id}
			
			<button
				onclick={() => navigateTo(item.id)}
				class="nav-button {isActive ? 'active' : 'inactive'}"
			>
				<div class="icon-container">
					<!--<Icon class="icon" strokeWidth={isActive ? 2.5 : 2} /> -->
				</div>

				{#if isActive}
					<span
						transition:slide={{ axis: 'x', duration: 400, easing: quintOut }}
						class="nav-label"
					>
						{item.label}
					</span>
				{/if}
			</button>
		{/each}
	</nav>
</div>


<script lang="ts">
	// @ts-expect-error: SVG imports are handled by Vite but lack type definitions
	import { LIST_MENU_NAVIGATION_MOBILE } from '$lib/constants/menu.const.ts';
	import { quintOut } from 'svelte/easing';

    import { slide } from 'svelte/transition';

    // Activa la opcion del menu
    let { activeTab, navigateTo } = $props<{
		activeTab: string;
		navigateTo: (id: string) => void;
	}>();

</script>

<!-- Estilos -->
<style src='$lib/styles/navigation.style.scss' lang="scss"></style>
