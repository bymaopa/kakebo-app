<script lang="ts">
  // Estado reactivo (Svelte 5) para saber si el menú está abierto
  let isExpanded = $state(false);

  function toggleSidebar() {
    isExpanded = !isExpanded;
  }
</script>

{#if isExpanded}
  <div class="tablet-overlay" onclick={toggleSidebar}></div>
{/if}

{#if !isExpanded}
  <button class="tablet-hamburger" aria-label="Abrir menú" onclick={toggleSidebar}>
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
  </button>
{/if}

<aside class="desktop-sidebar" class:expanded={isExpanded}>
  <div class="sidebar-header">
    <button class="hamburger-btn" aria-label="Alternar menú" onclick={toggleSidebar}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
    </button>
    <span class="brand-text">Kakebo</span>
  </div>

  <nav class="nav-links">
    <button class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>
      <span class="label">Calendario</span>
    </button>

    <button class="nav-btn active">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      <span class="label">Resumen</span>
    </button>

    <button class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
      <span class="label">Añadir</span>
    </button>
  </nav>
</aside>

<style lang="scss">
  /* --- ESTILOS COMUNES --- */
  .desktop-sidebar {
    background-color: #000000;
    border-right: 1px solid #292524;
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 50;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    padding: 1.5rem 1rem;
    height: 5rem;
    gap: 1.5rem;
  }

  .brand-text, .label {
    opacity: 0; /* Oculto por defecto */
    transition: opacity 0.2s ease;
    font-weight: bold;
  }

  .brand-text { font-size: 1.5rem; color: #ffffff; letter-spacing: -0.05em; }
  .label { font-size: 1rem; }

  .hamburger-btn, .tablet-hamburger {
    background: transparent;
    border: none;
    color: #b3b3b3;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 8px;
    flex-shrink: 0;
    &:hover { color: #fff; background: #282828; }
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    color: #b3b3b3;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    svg { width: 1.5rem; height: 1.5rem; flex-shrink: 0; }
    &:hover { color: #ffffff; }
    &.active { background-color: #121212; color: #1DB954; }
  }

  /* Textos visibles cuando está expandido */
  .expanded .brand-text, .expanded .label { opacity: 1; }

  /* --- TABLET (768px - 1023px) --- */
  @media (min-width: 768px) and (max-width: 1023px) {
    .tablet-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 40;
    }
    
    .tablet-hamburger {
      position: fixed; top: 1.25rem; left: 1.25rem; z-index: 30; background: #000; border: 1px solid #292524;
    }

    .desktop-sidebar {
      position: fixed; top: 0; left: 0;
      width: 250px;
      transform: translateX(-100%); /* Oculto por defecto */
    }

    .desktop-sidebar.expanded {
      transform: translateX(0); /* Entra en pantalla */
    }
  }

  /* --- DESKTOP (>= 1024px) --- */
  @media (min-width: 1024px) {
    .tablet-overlay, .tablet-hamburger { display: none !important; }

    .desktop-sidebar {
      position: sticky; top: 0;
      width: 80px; /* Colapsado: Solo iconos */
    }

    .desktop-sidebar.expanded {
      width: 250px; /* Expandido: Empuja el contenido */
    }
  }

  /* Ocultar en móvil */
  @media (max-width: 767px) {
    .desktop-sidebar, .tablet-hamburger { display: none !important; }
  }
</style>