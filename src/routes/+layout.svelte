<script lang="ts">
  import MobileNav from '$lib/ui/components/navigation/mobile.svelte';
  import DesktopNav from '$lib/ui/components/navigation/desktop.svelte';
  import Background from '$lib/ui/components/animated.background.svelte'; // <-- Asegúrate de la ruta correcta
  import { fade } from 'svelte/transition'; // <-- Importamos la animación nativa de Svelte
  import { onMount } from 'svelte';
  
  let { children } = $props();

  // Estado para la animación de entrada
  let ready = $state(false);

  // Activamos el renderizado una vez que la app está montada
  onMount(() => {
    ready = true;
  });
</script>

<div class="kakebo-layout">
  <DesktopNav />

  <main class="content-wrapper">
    <div class="app-frame">
      
      <Background />

      {#if ready}
        <div 
          class="inner-content"
          in:fade={{ duration: 800, delay: 150 }}
        >
          {@render children()}
        </div>
      {/if}

    </div>
  </main>

  <div class="mobile-nav-container">
    <MobileNav />
  </div>
</div>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    background-color: #000; 
    color: #ffffff;
    font-family: system-ui, -apple-system, sans-serif;
    overflow: hidden; 
  }

  .kakebo-layout {
    height: 100svh; 
    display: flex;
    flex-direction: column;
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5rem; 
    min-height: 0; 
  }

  .app-frame {
    position: relative;
    z-index: 0;
    width: 100%;
    flex: 1;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.6); 
    border-radius: 24px;
    will-change: transform;
    transition: all 0.3s ease;

    /* ✅ BIEN: Usamos solo la sombra tradicional de caja */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); 
    }

  /* Tu nuevo if.content traducido a SCSS */
  .inner-content {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    width: 100%;
    height: 100%;
    
    /* Manejo del scroll */
    overflow-x: hidden;
    overflow-y: auto; 
    
    /* Espaciado interior */
    padding: 1rem; 
  }

  .mobile-nav-container { 
    display: block; 
    flex-shrink: 0; 
    padding-top: 0.5rem;
    padding-bottom: 1.5rem; 
  }

  @media (min-width: 768px) {
    .kakebo-layout {
      flex-direction: row; 
    }
    .mobile-nav-container { 
      display: none; 
    }
    .content-wrapper {
      padding: 1rem; 
    }
    .inner-content {
      padding: 1.5rem; 
    }
  }
</style>