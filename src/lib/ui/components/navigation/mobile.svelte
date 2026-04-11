<!-- -->
 
<nav class="nav-wrapper">
  <div class="kakebo-nav">
    <button class="nav-btn active">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
      <span class="label">Resumen</span>
    </button>

    <button class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>
    </button>

    <button class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
    </button>

    <button class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>
    </button>

    <button class="nav-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    </button>
  </div>
</nav>

<style lang="scss">
  /* Contenedor flotante invisible que posiciona el menú */
  .nav-wrapper {
    display: flex;
    justify-content: center;
    width: 100%;
	padding: 0;
	margin: 0;
    /* Hemos eliminado position: fixed, bottom, left, right y z-index */
  }

  /* La píldora negra del menú */
  .kakebo-nav {
    background-color: #121212;
    border-radius: 32px;
    display: flex;
    align-items: center;
    padding: 0.5rem;
	margin: 0;
    gap: 0.5rem;
    border: 1px solid #292524; /* border-stone-800 */
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    pointer-events: auto; /* Reactiva los clics solo en la píldora */
  }

  /* Botones inactivos (estado base) */
  .nav-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9999px;
    background-color: #282828;
    color: #d6d3d1; /* text-stone-300 */
    width: 3rem;  /* w-12 */
    height: 3rem; /* h-12 */
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    svg {
      width: 1.25rem; /* w-5 */
      height: 1.25rem; /* h-5 */
      flex-shrink: 0;
    }

    &:hover {
      background-color: #333333;
    }

    /* Ocultamos el texto en los botones inactivos por defecto */
    .label {
      display: none;
    }

    /* MODIFICADOR: Botón Activo */
    &.active {
      background-color: #1DB954; /* El verde estilo Spotify */
      color: #000000;
      width: auto; /* Deja que el botón crezca para acomodar el texto */
      padding: 0.75rem 1.25rem; /* px-5 py-3 */

      .label {
        display: inline-block;
        font-weight: 600;
        font-size: 0.875rem; /* text-sm */
        white-space: nowrap;
        margin-left: 0.5rem;
      }

      &:hover {
        background-color: #1ed760; /* Un verde un poco más claro al pasar el ratón */
      }
    }
  }
</style>
