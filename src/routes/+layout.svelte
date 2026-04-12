<script lang="ts">
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

  // Components
  import MobileNav from '$lib/ui/components/navigation/mobile.svelte';
  import DesktopNav from '$lib/ui/components/navigation/desktop.svelte';
  import Background from '$lib/ui/components/animated.background.svelte';

  // Styles

  let { children } = $props();
  let ready = $state(false);

  onMount(() => {
    ready = true;
  });
</script>

<svelte:head>
  <title>Añadir Gasto | Kakebo App</title>
  <meta
    name="description"
    content="Registra un nuevo gasto en tu Kakebo personal de forma rápida y visual. Mantén tus finanzas bajo control."
  />
</svelte:head>

<div class="kakebo-layout">
  <DesktopNav />

  <main class="content-wrapper">
    <div class="app-frame">
      <Background />

      {#if ready}
        <div class="inner-content" in:fade={{ duration: 800, delay: 150 }}>
          {@render children()}
        </div>
      {/if}
    </div>
  </main>

  <div class="mobile-nav-container">
    <MobileNav />
  </div>
</div>

<style lang="scss">
  @use '$lib/ui/styles/app.style.scss';

  .kakebo-layout {
    height: 100svh;
    display: flex;
    flex-direction: column;

    /* Desktop/Tablet */
    @media (min-width: 768px) {
      flex-direction: row;
    }
  }

  .content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;
    min-height: 0;

    @media (min-width: 768px) {
      padding: 1rem;
    }
  }

  .app-frame {
    position: relative;
    z-index: 0;
    width: 100%;
    flex: 1;
    overflow: hidden;
    border-radius: 24px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
    will-change: transform;
    transition: all 0.3s ease;

    .inner-content {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 1rem;

      @media (min-width: 768px) {
        padding: 1.5rem;
      }
    }
  }

  .mobile-nav-container {
    display: block;
    flex-shrink: 0;
    padding-top: 0.5rem;
    padding-bottom: 1.5rem;

    @media (min-width: 768px) {
      display: none;
    }
  }
</style>
