<script lang="ts">
  import type { Transaction, CategoryType } from '$lib/core';
  import { Input, Select, Button, Card } from '$lib/ui';
  import type { RecurringTransaction } from '$lib/core/domain/recurring-transaction.type';

  interface Props {
    onAdd: (t: Omit<Transaction, 'id'>) => void;
    onAddRecurring?: (t: Omit<RecurringTransaction, 'id'>) => void;
  }

  let { onAdd, onAddRecurring }: Props = $props();

  let type = $state<'income' | 'expense'>('expense');
  let amount = $state('');
  let description = $state('');
  let learning = $state('');
  let date = $state(new Date().toISOString().split('T')[0]);
  let category = $state<CategoryType>('Supervivencia');
  let isRecurring = $state(false);

  const categories = [
    { value: 'Supervivencia', label: 'Supervivencia (Necesidades)' },
    { value: 'Ocio/Vicio', label: 'Ocio/Vicio (Deseos)' },
    { value: 'Cultura', label: 'Cultura (Enriquecimiento)' },
    { value: 'Extras', label: 'Extras (Imprevistos)' }
  ];

  const categoryHint = {
    Supervivencia: '💡 Alimentación, vivienda, transporte, salud, higiene.',
    'Ocio/Vicio': '💡 Restaurantes, ropa no esencial, cosméticos, tabaco, salidas.',
    Cultura: '💡 Libros, música, cine, museos, cursos, educación.',
    Extras: '💡 Regalos, reparaciones, viajes, gastos imprevistos médicos.'
  };

  function handleSubmit(e: Event) {
    e.preventDefault();
    if (!amount || !description) return;

    const transactionData = {
      type,
      amount: Number(amount),
      description,
      category: type === 'expense' ? category : undefined,
      learning: learning || undefined
    };

    onAdd({ ...transactionData, date });

    if (isRecurring && onAddRecurring) {
      const dayOfMonth = parseInt(date.split('-')[2], 10);
      onAddRecurring({ ...transactionData, dayOfMonth });
    }

    amount = '';
    description = '';
    learning = '';
    isRecurring = false;
  }
</script>

<Card>
  <h3 class="title">Añadir Movimiento</h3>

  <form onsubmit={handleSubmit} class="form">
    <div class="type-toggle">
      <button type="button" class:active={type === 'expense'} onclick={() => (type = 'expense')}>
        Gasto
      </button>
      <button type="button" class:active={type === 'income'} onclick={() => (type = 'income')}>
        Ingreso Extra
      </button>
    </div>

    <div class="field">
      <label for="amount">Cantidad (€)</label>
      <Input type="number" step="0.01" bind:value={amount} required placeholder="0.00" />
    </div>

    <div class="field">
      <label for="description">Descripción</label>
      <Input bind:value={description} required placeholder="Ej. Compra supermercado" />
    </div>

    <div class="field">
      <label for="date">Fecha</label>
      <Input type="date" bind:value={date} required />
    </div>

    {#if type === 'expense'}
      <div class="field">
        <label for="category">Categoría Kakebo</label>
        <Select bind:value={category}>
          {#each categories as cat}
            <option value={cat.value}>{cat.label}</option>
          {/each}
        </Select>
        <p class="hint">{categoryHint[category]}</p>
      </div>

      <div class="field">
        <label for="learning">Aprendizaje (Opcional)</label>
        <Input bind:value={learning} placeholder="Ej. Llevar paraguas para no comprar otro" />
      </div>
    {/if}

    <label class="recurring">
      <input type="checkbox" bind:checked={isRecurring} />
      <span>Hacer recurrente</span>
      {#if isRecurring}
        <span class="recurring-hint">Se añadirá cada mes el día {date.split('-')[2]}</span>
      {/if}
    </label>

    <Button type="submit">Guardar Movimiento</Button>
  </form>
</Card>

<style>
  .title {
    font-size: 1.25rem;
    font-weight: 500;
    color: rgb(6 78 59);
    margin-bottom: 1.5rem;
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  .type-toggle {
    display: flex;
    background: rgb(231 229 228);
    padding: 0.375rem;
    border-radius: 9999px;
  }

  .type-toggle button {
    flex: 1;
    padding: 0.625rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: all 0.2s;
    background: transparent;
    color: rgb(120 113 108);
    border: none;
    cursor: pointer;
  }

  .type-toggle button.active {
    background: white;
    color: rgb(6 78 59);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .field label {
    font-size: 0.75rem;
    font-weight: 500;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding-left: 0.5rem;
  }

  .hint {
    font-size: 0.6875rem;
    color: rgb(6 78 59);
    background: rgb(236 253 245);
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid rgb(209 250 229);
    margin-top: 0.25rem;
  }

  .recurring {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    padding: 0.25rem 0;
  }

  .recurring input {
    width: 1.25rem;
    height: 1.25rem;
    accent-color: rgb(6 78 59);
  }

  .recurring span {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgb(63 55 48);
  }

  .recurring-hint {
    font-size: 0.625rem !important;
    color: rgb(120 113 108) !important;
    font-weight: 400 !important;
  }
</style>
