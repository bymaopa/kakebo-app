<script lang="ts">
  import type { Transaction } from '$lib/core';
  import { Button } from '$lib/ui';

  interface Props {
    transactions: Transaction[];
    onDelete: (id: string) => void;
  }

  let { transactions, onDelete }: Props = $props();

  const getCategoryColor = (category?: string, type?: string) => {
    if (type === 'income') return 'bg-emerald-100 text-emerald-700';
    switch (category) {
      case 'Supervivencia':
        return 'bg-blue-100 text-blue-700';
      case 'Ocio/Vicio':
        return 'bg-orange-100 text-orange-700';
      case 'Cultura':
        return 'bg-purple-100 text-purple-700';
      case 'Extras':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  const getCategoryLabel = (category?: string, type?: string) => {
    if (type === 'income') return 'INGRESO';
    switch (category) {
      case 'Supervivencia':
        return 'SUPERVIVENCIA';
      case 'Ocio/Vicio':
        return 'OCIO';
      case 'Cultura':
        return 'CULTURA';
      case 'Extras':
        return 'EXTRAS';
      default:
        return 'OTROS';
    }
  };

  const sorted = $derived(
    [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  );
</script>

<div class="transaction-list">
  <h3 class="title">Todos los movimientos</h3>

  {#if sorted.length === 0}
    <div class="empty">
      <p>No hay movimientos registrados.</p>
    </div>
  {:else}
    <div class="list">
      {#each sorted as t (t.id)}
        <div class="item">
          <div class="info">
            <span class="badge {getCategoryColor(t.category, t.type)}">
              {getCategoryLabel(t.category, t.type)}
            </span>
            <p class="description">{t.description}</p>
            <p class="date">
              {new Date(t.date).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })}
            </p>
            {#if t.learning}
              <div class="learning">
                💡 {t.learning}
              </div>
            {/if}
          </div>
          <div class="actions">
            <p class="amount" class:income={t.type === 'income'}>
              {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}€
            </p>
            <Button variant="ghost" onclick={() => onDelete(t.id)} title="Eliminar">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                ><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path
                  d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                /></svg
              >
            </Button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .transaction-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .title {
    font-size: 1.25rem;
    font-weight: 500;
    color: rgb(6 78 59);
  }

  .empty {
    text-align: center;
    padding: 4rem 0;
    background: #f8f9fa;
    border-radius: 32px;
    border: 1px solid rgb(231 229 228);
  }

  .empty p {
    color: rgb(120 113 108);
    font-weight: 500;
  }

  .list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .item {
    background: #f8f9fa;
    padding: 1.25rem;
    border-radius: 28px;
    border: 1px solid rgb(231 229 228);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .badge {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    display: inline-block;
  }

  .description {
    font-weight: 500;
    color: rgb(6 78 59);
    font-size: 1.125rem;
  }

  .date {
    font-size: 0.875rem;
    color: rgb(120 113 108);
    margin-top: 0.125rem;
  }

  .learning {
    font-size: 0.75rem;
    color: rgb(4 120 87);
    background: rgb(236 253 245);
    padding: 0.375rem 0.75rem;
    border-radius: 12px;
    border: 1px solid rgb(209 250 229);
    display: inline-block;
    margin-top: 0.5rem;
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .amount {
    font-size: 1.25rem;
    font-weight: 500;
    color: rgb(6 78 59);
  }

  .amount.income {
    color: rgb(5 150 105);
  }
</style>
