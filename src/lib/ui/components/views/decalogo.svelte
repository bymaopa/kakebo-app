<script lang="ts">
  import { Button } from '$lib/ui';

  interface Props {
    onAccept: (name: string) => void;
    initialName?: string;
    readOnly?: boolean;
    onClose?: () => void;
  }

  let { onAccept, initialName = '', readOnly = false, onClose }: Props = $props();

  let name = $state(initialName);
  const today = new Date();

  const DECALOGO_ITEMS = [
    'No ahorres mañana lo que puedas ahorrar hoy.',
    'Si la paciencia es la madre del ahorro, la constancia es su mejor amiga.',
    'De poco sirve tener por tener. De nada sirve gastar por gastar.',
    'Ante la tentación, reflexión.',
    'La avaricia es el peor enemigo del ahorro.',
    'Hay cosas que no se compran con dinero. Son las más importantes.',
    'Nunca pierdas de vista tu objetivo.',
    'Compartir es una de las mejores maneras de ahorrar.',
    'No dejes que un mal mes te desvíe del camino.',
    'Si te asalta las dudas, recuerda este decálogo.'
  ];

  const formattedDate = $derived(
    today.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
  );
</script>

<div class="decalogo">
  <div class="modal">
    <div class="header">
      <h1>El Decálogo del Ahorro</h1>
    </div>

    <div class="content">
      <p class="intro">
        Yo, <span class="signature">{name || '_________________'}</span> me declaro «kakebista» y prometo
        seguir y recordar este decálogo en pos de la causa del ahorro:
      </p>

      <div class="items">
        {#each DECALOGO_ITEMS as item, index}
          <div class="item">
            <span class="number">{index + 1}</span>
            <p>{item}</p>
          </div>
        {/each}
      </div>

      <div class="footer">
        {#if !readOnly}
          <div class="field">
            <label>Firma (Tu Nombre)</label>
            <input type="text" bind:value={name} placeholder="Escribe tu nombre aquí..." />
          </div>
          <p class="date">En Kakebo, a {formattedDate}.</p>
          <Button onclick={() => onAccept(name)} disabled={!name.trim()}>Firmar y Aceptar</Button>
        {:else}
          <div class="signature-readonly">
            <p class="label">Firma</p>
            <p class="name">{name}</p>
          </div>
          <Button onclick={onClose}>Cerrar</Button>
        {/if}
      </div>
    </div>
  </div>
</div>

<style>
  .decalogo {
    position: fixed;
    inset: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f2f2f7;
    padding: 1rem;
  }

  .modal {
    background: white;
    max-width: 42rem;
    width: 100%;
    border-radius: 40px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    border: 1px solid rgb(231 229 228);
  }

  .header {
    background: rgb(6 78 59);
    padding: 2rem;
    text-align: center;
  }

  .header h1 {
    font-size: 1.875rem;
    font-weight: 800;
    color: white;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .content {
    padding: 2rem 3rem;
  }

  .intro {
    font-size: 1.125rem;
    color: rgb(120 113 108);
    margin-bottom: 2rem;
    line-height: 1.625;
    text-align: center;
    font-family: Georgia, serif;
  }

  .signature {
    display: inline-block;
    border-bottom: 2px solid rgb(168 162 158);
    min-width: 150px;
    padding: 0 0.5rem;
    text-align: center;
    font-weight: 700;
    color: rgb(6 78 59);
  }

  .items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
  }

  .number {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    background: rgb(220 252 231);
    color: rgb(6 78 59);
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
  }

  .item p {
    color: rgb(63 55 48);
    font-weight: 500;
    padding-top: 0.25rem;
  }

  .footer {
    border-top: 1px solid rgb(228 228 216);
    padding-top: 2rem;
  }

  .field {
    margin-bottom: 1.5rem;
  }

  .field label {
    display: block;
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .field input {
    width: 100%;
    padding: 1rem 1rem 1rem 3rem;
    background: rgb(250 250 249);
    border: 1px solid rgb(228 228 216);
    border-radius: 1rem;
    font-size: 1.125rem;
    font-weight: 500;
  }

  .field input:focus {
    outline: none;
    ring: 2px;
    ring-color: rgb(16 185 129 / 0.2);
    background: white;
  }

  .date {
    text-align: center;
    color: rgb(120 113 108);
    font-size: 0.875rem;
    margin-bottom: 1.5rem;
  }

  .signature-readonly {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .signature-readonly .label {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    margin-bottom: 0.5rem;
  }

  .signature-readonly .name {
    font-size: 1.875rem;
    font-family: Georgia, serif;
    font-style: italic;
    color: rgb(6 78 59);
    border-bottom: 1px solid rgb(168 162 158);
    padding-bottom: 0.5rem;
    display: inline-block;
    padding-left: 2rem;
    padding-right: 2rem;
  }
</style>
