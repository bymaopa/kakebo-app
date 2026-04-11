<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

<section class="dashboard">
  <h1>Añadir Gasto Kakebo</h1>

  <form onsubmit={handleSubmit} class="kakebo-form">
    <label>
      Importe (€):
      <input type="number" step="0.01" bind:value={amount} required />
    </label>

    <label>
      Concepto:
      <input type="text" bind:value={description} required />
    </label>

    <label>
      Categoría:
      <select bind:value={category}>
        <option value="Supervivencia">Supervivencia</option>
        <option value="Ocio/Vicio">Ocio/Vicio</option>
        <option value="Cultura">Cultura</option>
        <option value="Extras">Extras</option>
      </select>
    </label>

    <button type="submit">Guardar Gasto</button>
  </form>
</section>

<script lang="ts">

  // Importamos el Caso de Uso que ya instanciamos en el core
  import { addTransaction } from '$lib/core';
  import type { TransactionType } from '$lib/core/domain/types/transaction.type';
  import type { CategoryType } from '$lib/core/domain/category.type';

  // ESTADO REACTIVO CON RUNAS (Svelte 5)
  let amount = $state('');
  let description = $state('');
  let category = $state<CategoryType>('Supervivencia');

  // ACCIÓN
  async function handleSubmit(event: Event) {
    event.preventDefault();

    // 1. Preparamos el objeto con la interfaz pura
    const newTransaction: TransactionType = {
      id: crypto.randomUUID(), // Genera un ID único nativo
      type: 'expense',
      amount: Number(amount),
      description,
      category,
      date: new Date().toISOString()
    };

    // 👉 AÑADE ESTO:
    console.log("Intentando guardar esto:", newTransaction);

    try {
      // 2. Llamamos al cerebro (Core), él se encarga de Tauri
      await addTransaction.execute(newTransaction);
      
      alert('¡Gasto guardado en tu disco duro!');
      
      // 3. Limpiamos el formulario
      amount = '';
      description = '';
    } catch (error) {
      // Magia negra: Si es un objeto Error leemos el mensaje, si es un texto de Tauri, lo imprimimos tal cual
      const mensaje = error instanceof Error ? error.message : String(error);
      
      alert(`Error al guardar: ${mensaje}`);
      console.error("El error crudo de Tauri es:", error);
    }
  }
</script>

<style lang="scss">
  /* Aquí puedes usar SASS directamente si configuraste vite-plugin-svelte */
  .dashboard {
    padding: 2rem;
  }
  .kakebo-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
  }
</style>


