<script lang="ts">
  import type { Transaction, MonthConfig } from '$lib/core';
  import { Card, Button } from '$lib/ui';

  interface Props {
    currentDate: Date;
    transactions: Transaction[];
    config?: MonthConfig;
    onSaveConfig?: (config: MonthConfig) => void;
    onClose?: () => void;
  }

  let { currentDate, transactions, config, onSaveConfig, onClose }: Props = $props();

  let learning = $state(config?.weeklyLearnings?.[1] || '');

  const weekStart = $derived(() => {
    const d = new Date(currentDate);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  });

  const weekExpenses = $derived(
    transactions.filter((t) => {
      if (t.type !== 'expense') return false;
      const tDate = new Date(t.date);
      return tDate >= weekStart() && tDate <= currentDate;
    })
  );

  const totalThisWeek = $derived(weekExpenses.reduce((s, t) => s + t.amount, 0));

  const categories = $derived({
    Supervivencia: weekExpenses
      .filter((t) => t.category === 'Supervivencia')
      .reduce((s, t) => s + t.amount, 0),
    'Ocio/Vicio': weekExpenses
      .filter((t) => t.category === 'Ocio/Vicio')
      .reduce((s, t) => s + t.amount, 0),
    Cultura: weekExpenses.filter((t) => t.category === 'Cultura').reduce((s, t) => s + t.amount, 0),
    Extras: weekExpenses.filter((t) => t.category === 'Extras').reduce((s, t) => s + t.amount, 0)
  });

  const initialBudget = $derived(
    (config?.income || 0) - (config?.fixedExpenses || 0) - (config?.savingsGoal || 0)
  );
  const remaining = $derived(initialBudget - totalThisWeek);

  const weekRange = $derived(
    `${weekStart().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} - ${currentDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}`
  );

  function handleSave() {
    if (config && onSaveConfig) {
      onSaveConfig({
        ...config,
        weeklyLearnings: { ...config.weeklyLearnings, [1]: learning }
      });
    }
  }
</script>

<div class="weekly-summary">
  <Card>
    <h3>Resumen Semanal</h3>
    <p class="week-range">{weekRange}</p>

    <div class="stats">
      <div class="stat">
        <span>Esta semana</span>
        <p class="expense">{totalThisWeek.toFixed(2)}€</p>
      </div>
      <div class="stat">
        <span>Restante</span>
        <p class:negative={remaining < 0}>{remaining.toFixed(2)}€</p>
      </div>
    </div>
  </Card>

  <Card>
    <h3>Por Categoría</h3>
    <div class="categories">
      {#each Object.entries(categories) as [cat, amount]}
        <div class="category">
          <span class="name">{cat}</span>
          <span class="amount">{amount.toFixed(2)}€</span>
        </div>
      {/each}
    </div>
  </Card>

  <Card>
    <h3>Aprendizaje</h3>
    <textarea bind:value={learning} placeholder="¿Qué has aprendido esta semana?"></textarea>
    <Button onclick={handleSave}>Guardar Reflexión</Button>
  </Card>

  {#if onClose}
    <Button variant="ghost" onclick={onClose}>Cerrar</Button>
  {/if}
</div>

<style>
  .weekly-summary {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 2.5rem;
  }

  .weekly-summary h3 {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .week-range {
    font-size: 1.25rem;
    font-weight: 600;
    color: rgb(6 78 59);
    margin-bottom: 1.5rem;
  }

  .stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .stat span {
    font-size: 0.75rem;
    color: rgb(120 113 108);
  }

  .stat p {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .stat p.expense {
    color: rgb(249 115 22);
  }

  .stat p.negative {
    color: rgb(239 68 68);
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .category {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: rgb(250 250 249);
    border-radius: 1rem;
  }

  .category .name {
    font-size: 0.875rem;
    color: rgb(63 55 48);
  }

  .category .amount {
    font-size: 0.875rem;
    font-weight: 600;
    color: rgb(28 25 23);
  }

  .weekly-summary textarea {
    width: 100%;
    min-height: 100px;
    border-radius: 1rem;
    background: rgb(250 250 249);
    border: 1px solid rgb(228 228 216);
    padding: 0.75rem;
    font-size: 0.875rem;
    resize: none;
    margin-bottom: 1rem;
  }

  .weekly-summary textarea:focus {
    outline: none;
    ring: 2px;
    ring-color: rgb(16 185 129 / 0.2);
  }
</style>
