<script lang="ts">
  import type { Transaction, MonthConfig } from '$lib/core';
  import { Card, Button } from '$lib/ui';

  interface Props {
    transactions: Transaction[];
    config?: MonthConfig;
    onClose?: () => void;
  }

  let { transactions, config, onClose }: Props = $props();

  const currentMonth = new Date().toISOString().slice(0, 7);

  const monthTransactions = $derived(transactions.filter((t) => t.date.startsWith(currentMonth)));

  const totalIncome = $derived(
    monthTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0) +
      (config?.income || 0)
  );
  const totalExpenses = $derived(
    monthTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  );
  const savings = $derived(totalIncome - totalExpenses);

  const categories = $derived({
    Supervivencia: monthTransactions
      .filter((t) => t.category === 'Supervivencia' && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0),
    'Ocio/Vicio': monthTransactions
      .filter((t) => t.category === 'Ocio/Vicio' && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0),
    Cultura: monthTransactions
      .filter((t) => t.category === 'Cultura' && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0),
    Extras: monthTransactions
      .filter((t) => t.category === 'Extras' && t.type === 'expense')
      .reduce((s, t) => s + t.amount, 0)
  });

  const totalExpensesByCategory = $derived(Object.values(categories).reduce((s, v) => s + v, 0));

  const achievements = $derived({
    hasBudget: (config?.income || 0) > 0,
    savingsGoalMet: savings >= (config?.savingsGoal || 0),
    controlTotal:
      totalExpensesByCategory > 0 &&
      (categories['Ocio/Vicio'] + categories['Extras']) / totalExpensesByCategory <= 0.2
  });

  const monthName = $derived(
    new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  );
</script>

<div class="month-summary">
  <Card>
    <h2>Resumen de {monthName}</h2>

    <div class="main-stats">
      <div class="stat">
        <span>Ingresos</span>
        <p>{totalIncome.toFixed(2)}€</p>
      </div>
      <div class="stat">
        <span>Gastos</span>
        <p class="expense">{totalExpenses.toFixed(2)}€</p>
      </div>
      <div class="stat highlight">
        <span>Ahorro</span>
        <p class:negative={savings < 0}>{savings.toFixed(2)}€</p>
      </div>
    </div>
  </Card>

  <Card>
    <h3>Gastos por Categoría</h3>
    <div class="categories">
      {#each Object.entries(categories) as [cat, amount]}
        {@const pct = totalExpensesByCategory > 0 ? (amount / totalExpensesByCategory) * 100 : 0}
        <div class="category">
          <div class="header">
            <span>{cat}</span>
            <span>{amount.toFixed(2)}€ ({pct.toFixed(0)}%)</span>
          </div>
          <div class="bar">
            <div class="fill" style="width: {pct}%"></div>
          </div>
        </div>
      {/each}
    </div>
  </Card>

  <Card>
    <h3>Logros del Mes</h3>
    <div class="achievements">
      <div class="achievement" class:done={achievements.hasBudget}>
        <span class="icon">✓</span>
        <span>Presupuesto creado</span>
      </div>
      <div class="achievement" class:done={achievements.savingsGoalMet}>
        <span class="icon">✓</span>
        <span>Objetivo de ahorro</span>
      </div>
      <div class="achievement" class:done={achievements.controlTotal}>
        <span class="icon">✓</span>
        <span>Control (&lt;20% en Ocio/Extras)</span>
      </div>
    </div>
  </Card>

  <Card>
    <h3>Reflexión Final</h3>
    <textarea placeholder="¿Cómo ha ido el mes? ¿Qué has aprendido?"></textarea>
  </Card>

  {#if onClose}
    <Button onclick={onClose}>Cerrar</Button>
  {/if}
</div>

<style>
  .month-summary {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 2.5rem;
  }

  .month-summary h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: rgb(6 78 59);
    text-align: center;
    margin-bottom: 1.5rem;
    text-transform: capitalize;
  }

  .month-summary h3 {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .main-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .stat span {
    font-size: 0.75rem;
    color: rgb(120 113 108);
    text-transform: uppercase;
  }

  .stat p {
    font-size: 1.25rem;
    font-weight: 700;
    color: rgb(6 78 59);
  }

  .stat p.expense {
    color: rgb(249 115 22);
  }
  .stat p.negative {
    color: rgb(239 68 68);
  }

  .stat.highlight p {
    font-size: 1.5rem;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category .header {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .category .bar {
    height: 0.75rem;
    background: rgb(231 229 228);
    border-radius: 9999px;
    overflow: hidden;
  }

  .category .fill {
    height: 100%;
    background: rgb(6 78 59);
    border-radius: 9999px;
  }

  .achievements {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
  }

  .achievement {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-radius: 1rem;
    background: rgb(250 250 249);
    opacity: 0.5;
  }

  .achievement.done {
    background: rgb(220 252 231);
    opacity: 1;
  }

  .achievement .icon {
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 9999px;
    background: rgb(168 162 158);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
  }

  .achievement.done .icon {
    background: rgb(34 197 94);
  }

  .month-summary textarea {
    width: 100%;
    min-height: 120px;
    border-radius: 1rem;
    background: rgb(250 250 249);
    border: 1px solid rgb(228 228 216);
    padding: 0.75rem;
    font-size: 0.875rem;
    resize: none;
  }
</style>
