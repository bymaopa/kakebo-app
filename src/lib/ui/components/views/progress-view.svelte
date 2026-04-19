<script lang="ts">
  import type { Transaction, MonthConfig } from '$lib/core';
  import { Card } from '$lib/ui';

  interface Props {
    transactions: Transaction[];
    config?: MonthConfig;
    currentMonth: string;
  }

  let { transactions, config, currentMonth }: Props = $props();

  const monthlyData = $derived(() => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthStr = d.toISOString().slice(0, 7);
      const monthLabel = d.toLocaleDateString('es-ES', { month: 'short' });

      const monthTxs = transactions.filter((t) => t.date.startsWith(monthStr));
      const income = monthTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expenses = monthTxs
        .filter((t) => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      const savings = Math.max(0, income - expenses);

      data.push({ month: monthLabel, income, expenses, savings });
    }
    return data;
  });

  const maxAmount = $derived(
    Math.max(...monthlyData().map((d) => Math.max(d.income, d.expenses, d.savings)), 1)
  );

  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay() + 1);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const weekTransactions = $derived(
    transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= weekStart && tDate <= weekEnd;
    })
  );

  const weeklySpending = $derived(
    weekTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  );
  const dailyAverage = $derived(weeklySpending / 7);
</script>

<div class="progress-view">
  <Card>
    <h3>Este Mes</h3>
    <div class="month-stats">
      <div class="stat">
        <span>Ingresos</span>
        <p>
          {transactions
            .filter((t) => t.type === 'income' && t.date.startsWith(currentMonth))
            .reduce((s, t) => s + t.amount, 0)
            .toFixed(2)}€
        </p>
      </div>
      <div class="stat">
        <span>Gastos</span>
        <p>
          {transactions
            .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
            .reduce((s, t) => s + t.amount, 0)
            .toFixed(2)}€
        </p>
      </div>
      <div class="stat">
        <span>Ahorro</span>
        <p class="savings">
          {(config?.income || 0) -
            (config?.fixedExpenses || 0) -
            transactions
              .filter((t) => t.type === 'expense' && t.date.startsWith(currentMonth))
              .reduce((s, t) => s + t.amount, 0)
              .toFixed(2)}€
        </p>
      </div>
    </div>
  </Card>

  <Card>
    <h3>Historial (6 meses)</h3>
    <div class="chart">
      {#each monthlyData() as d}
        <div class="bar-group">
          <div class="bars">
            <div class="bar income" style="height: {(d.income / maxAmount) * 100}%"></div>
            <div class="bar expenses" style="height: {(d.expenses / maxAmount) * 100}%"></div>
            <div class="bar savings" style="height: {(d.savings / maxAmount) * 100}%"></div>
          </div>
          <span class="label">{d.month}</span>
        </div>
      {/each}
    </div>
    <div class="legend">
      <span><i class="income"></i> Ingresos</span>
      <span><i class="expenses"></i> Gastos</span>
      <span><i class="savings"></i> Ahorro</span>
    </div>
  </Card>

  <Card>
    <h3>Esta Semana</h3>
    <div class="week-stats">
      <p>Gastado: <strong>{weeklySpending.toFixed(2)}€</strong></p>
      <p>Media diaria: <strong>{dailyAverage.toFixed(2)}€</strong></p>
    </div>
  </Card>
</div>

<style>
  .progress-view {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    padding-bottom: 2.5rem;
  }

  :global(.progress-view h3) {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(120 113 108);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }

  .month-stats {
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
    font-size: 1.5rem;
    font-weight: 800;
    color: rgb(6 78 59);
  }

  .stat p.savings {
    color: rgb(34 197 94);
  }

  .chart {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 200px;
    gap: 0.5rem;
  }

  .bar-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .bars {
    display: flex;
    gap: 2px;
    height: 150px;
    align-items: flex-end;
  }

  .bar {
    width: 8px;
    border-radius: 4px 4px 0 0;
    min-height: 4px;
  }

  .bar.income {
    background: rgb(34 197 94);
  }
  .bar.expenses {
    background: rgb(249 115 22);
  }
  .bar.savings {
    background: rgb(59 130 246);
  }

  .label {
    font-size: 0.625rem;
    color: rgb(120 113 108);
    margin-top: 0.5rem;
    text-transform: capitalize;
  }

  .legend {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    margin-top: 1rem;
  }

  .legend span {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    color: rgb(120 113 108);
  }

  .legend i {
    width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  .legend i.income {
    background: rgb(34 197 94);
  }
  .legend i.expenses {
    background: rgb(249 115 22);
  }
  .legend i.savings {
    background: rgb(59 130 246);
  }

  .week-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .week-stats p {
    font-size: 0.875rem;
    color: rgb(120 113 108);
  }

  .week-stats strong {
    color: rgb(6 78 59);
    font-weight: 700;
  }
</style>
