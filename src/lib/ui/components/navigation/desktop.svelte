<script lang="ts">
  import { page } from '$app/state';
  import { APP_LINKS } from '$lib/shared/constants/menu.const.ts';

  let isExpanded = $state(false);

  function toggleSidebar() {
    isExpanded = !isExpanded;
  }
</script>

{#snippet hamburgerIcon()}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
{/snippet}

{#if isExpanded}
  <div class="tablet-overlay" onclick={toggleSidebar} aria-hidden="true"></div>
{/if}

<aside class="desktop-sidebar" class:expanded={isExpanded}>
  <div class="sidebar-header">
    <button class="hamburger-btn" aria-label="Alternar menú" onclick={toggleSidebar}>
      {@render hamburgerIcon()}
    </button>
    <span class="brand-text">Kakebo</span>
  </div>

  <nav class="nav-links">
    {#each APP_LINKS as link, index (index)}
      <a
        href={link.href}
        class="nav-link"
        class:active={page.url.pathname === link.href}
        aria-current={page.url.pathname === link.href ? 'page' : undefined}
      >
        <div class="icon-wrapper">
          {@html link.svg}
        </div>
        <span class="label">{link.label}</span>
      </a>
    {/each}
  </nav>
</aside>

<style lang="scss">
  /* --- ESTILOS DE BASE Y TIPOGRAFÍA --- */
  .brand-text,
  .label {
    opacity: 0;
    max-width: 0;
    overflow: hidden;
    transition:
      opacity 0.2s ease,
      max-width 0.3s ease;
    font-weight: bold;
  }

  .brand-text {
    font-size: 1.5rem;
    color: var(--text-base);
    letter-spacing: -0.05em;
  }

  .label {
    font-size: 1rem;
  }

  /* --- BOTÓN DE HAMBURGUESA ÚNICO Y ALINEADO --- */
  .hamburger-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem; /* 48px, tamaño perfecto */
    height: 3rem; /* 48px, tamaño perfecto */
    border-radius: 8px;
    flex-shrink: 0;
    transition: all 0.2s ease;

    &:hover {
      color: var(--text-base);
      background: var(--border-color);
    }
  }

  /* --- ESTRUCTURA PRINCIPAL DE LA SIDEBAR --- */
  .desktop-sidebar {
    background-color: var(--bg-base);
    height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    white-space: nowrap;
    transition:
      width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.3s ease;
    z-index: 50;

    .sidebar-header {
      display: flex;
      align-items: center;
      padding: 1.5rem 1rem;
      height: 5rem;
      gap: 0;
      transition: gap 0.3s ease;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      padding: 0;
      align-items: center;
    }

    .nav-link {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      padding: 0;
      margin: 0;
      gap: 0;
      border-radius: 50%;
      background: transparent;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.3s ease;

      .icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      :global(svg) {
        width: 1.5rem;
        height: 1.5rem;
        flex-shrink: 0;
        transition:
          stroke-width 0.2s ease,
          color 0.2s ease;
      }

      &:hover {
        color: var(--text-base);
        background-color: var(--border-color);
      }

      &.active {
        /* Solo cambiamos el color al texto principal, sin fondos ni sombras */
        color: var(--text-base);

        :global(svg) {
          /* Aumentamos el grosor a 3 para que el efecto "bold" sea muy evidente */
          stroke-width: 3;
        }

        .label {
          /* Hacemos el texto extra grueso para acompañar al icono */
          font-weight: 900;
        }
      }
    }

    /* --- ESTADO EXPANDIDO (Anidado para limpieza) --- */
    &.expanded {
      .sidebar-header {
        gap: 1.5rem;
      }

      .nav-links {
        align-items: stretch;
        padding: 0 1rem;
      }

      .nav-link {
        width: 100%;
        border-radius: 9999px;
        justify-content: flex-start;
        padding: 0 1.25rem;
        gap: 1.5rem;
      }

      .brand-text,
      .label {
        opacity: 1;
        max-width: 200px;
      }
    }
  }

  /* --- MEDIA QUERIES REORGANIZADAS --- */

  /* --- DESKTOP (>= 1024px) --- */
  @media (min-width: 768px) {
    .tablet-overlay {
      display: none !important;
    }

    .desktop-sidebar {
      position: sticky;
      top: 0;
      width: 80px; /* Colapsado por defecto */

      &.expanded {
        width: 250px; /* Expandido empuja contenido */
      }
    }
  }

  /* Ocultar completamente en móvil */
  @media (max-width: 767px) {
    .desktop-sidebar {
      display: none !important;
    }
  }
</style>
