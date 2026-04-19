<script lang="ts">
  import type { Transaction, MonthConfig } from '$lib/core';
  import { Card, Button } from '$lib/ui';

  interface Props {
    transactions: Transaction[];
    config?: MonthConfig;
    onNavigate?: (tab: string) => void;
    dateFilterType?: 'week' | 'month';
    currentDate?: Date;
    onDateChange?: (date: Date) => void;
  }

  let {
    transactions = [],
    config,
    onNavigate,
    dateFilterType = 'month',
    currentDate = new Date(),
    onDateChange
  }: Props = $props();

  const currentMonth = $derived(currentDate.toISOString().slice(0, 7));

  const filteredTransactions = $derived(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);

    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= start && tDate <= end;
    });
  });

  const stats = $derived(() => {
    const totalIncome =
      filteredTransactions()
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0) + (config?.income || 0);

    const totalExpenses = filteredTransactions()
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const fixedExpenses = config?.fixedExpenses || 0;
    const savingsGoal = config?.savingsGoal || 0;
    const remainingBudget = totalIncome - fixedExpenses - savingsGoal - totalExpenses;

    return { totalIncome, totalExpenses, fixedExpenses, savingsGoal, remainingBudget };
  });

  const recentTransactions = $derived(
    [...filteredTransactions()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  );

  const categoryStats = $derived(() => {
    const expenses = filteredTransactions().filter((t) => t.type === 'expense');
    const total = expenses.reduce((sum, t) => sum + t.amount, 0);

    const categories = ['Supervivencia', 'Ocio/Vicio', 'Cultura', 'Extras'];
    return categories.map((cat) => {
      const amount = expenses
        .filter((t) => t.category === cat)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      };
    });
  });

  const monthName = $derived(
    currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
  );

  function handlePrev() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange?.(newDate);
  }

  function handleNext() {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange?.(newDate);
  }

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Supervivencia':
        return 'bg-blue-500';
      case 'Ocio/Vicio':
        return 'bg-orange-500';
      case 'Cultura':
        return 'bg-purple-500';
      case 'Extras':
        return 'bg-yellow-500';
      default:
        return 'bg-stone-500';
    }
  };
</script>

<div class="dashboard">
  <div class="date-nav">
    <button onclick={handlePrev}>←</button>
    <h3>{monthName}</h3>
    <button onclick={handleNext}>→</button>
  </div>

  <Card class="hero">
    <h2>Presupuesto<br />Restante</h2>
    <p>Controla tu energía financiera</p>
    <div class="remaining">{stats().remainingBudget.toFixed(2)}€</div>
  </Card>

  <div class="quick-stats">
    <Card>
      <span>Ingresos</span>
      <p>{stats().totalIncome.toFixed(2)}€</p>
    </Card>
    <Card>
      <span>Gastado</span>
      <p>{stats().totalExpenses.toFixed(2)}€</p>
    </Card>
  </div>

  <Card>
    <h3>Gastos por Categoría</h3>
    <div class="categories">
      {#each categoryStats() as cat}
        <div class="category">
          <div class="category-header">
            <span>{cat.name}</span>
            <span>{cat.amount.toFixed(2)}€</span>
          </div>
          <div class="bar">
            <div class="fill {getCategoryColor(cat.name)}" style="width: {cat.percentage}%"></div>
          </div>
        </div>
      {/each}
    </div>
  </Card>

  <Card>
    <h3>Últimos Movimientos</h3>
    {#if recentTransactions.length === 0}
      <p class="empty">No hay movimientos recientes</p>
    {:else}
      <div class="recent-list">
        {#each recentTransactions as t}
          <div class="recent-item">
            <div>
              <span class="badge">{t.category || 'OTROS'}</span>
              <p>{t.description}</p>
              <span class="date"
                >{new Date(t.date).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short'
                })}</span
              >
            </div>
            <span class="amount" class:income={t.type === 'income'}>
              {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}€
            </span>
          </div>
        {/each}
      </div>
    {/if}
    {#if onNavigate}
      <Button variant="ghost" onclick={() => onNavigate('history')}>Ver todos</Button>
    {/if}
  </Card>
</div>

<style>
  .dashboard {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 2.5rem;
  }

  .date-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: white;
    border: 1px solid rgb(231 229 228);
    padding: 0.75rem 1rem;
    border-radius: 24px;
  }

  .date-nav button {
    padding: 0.5rem;
    background: rgb(231 229 228);
    border: none;
    border-radius: 9999px;
    cursor: pointer;
  }

  .date-nav h3 {
    font-weight: 800;
    color: black;
    text-transform: capitalize;
  }

  .hero {
    min-height: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
  }

  .hero h2 {
    font-size: 2.5rem;
    font-weight: 800;
    color: black;
    line-height: 1.1;
  }

  .hero p {
    font-family: Georgia, serif;
    color: rgb(120 113 108);
    margin: 1rem 0 2rem;
  }

  .remaining {
    font-size: 4rem;
    font-weight: 800;
    color: white;
  }

  .quick-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .quick-stats :global(.card) {
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .quick-stats span {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .quick-stats p {
    font-size: 2rem;
    font-weight: 800;
    color: black;
  }

  .dashboard :global(h3) {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }

  .category-header span:first-child {
    font-weight: 500;
    color: rgb(63 55 48);
  }

  .category-header span:last-child {
    font-weight: 700;
    color: rgb(28 25 23);
  }

  .bar {
    height: 0.75rem;
    background: rgb(231 229 228);
    border-radius: 9999px;
    overflow: hidden;
  }

  .fill {
    height: 100%;
    border-radius: 9999px;
  }

  .empty {
    text-align: center;
    padding: 2.5rem;
    background: #f8f9fa;
    border-radius: 32px;
    color: rgb(120 113 108);
  }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .recent-item {
    background: #f8f9fa;
    padding: 1.25rem;
    border-radius: 28px;
    border: 1px solid rgb(231 229 228);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    font-size: 0.625rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background: rgb(231 229 228);
    color: rgb(63 55 48);
  }

  .recent-item p {
    font-weight: 500;
    color: rgb(6 78 59);
    font-size: 1.125rem;
    margin: 0.5rem 0;
  }

  .date {
    font-size: 0.875rem;
    color: rgb(120 113 108);
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
