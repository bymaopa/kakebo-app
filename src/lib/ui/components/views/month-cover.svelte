<script lang="ts">
  import type { Transaction, MonthConfig } from '$lib/core';
  import { Card } from '$lib/ui';

  interface Props {
    currentMonth: string;
    transactions: Transaction[];
    config?: MonthConfig;
    onSaveConfig?: (c: MonthConfig) => void;
  }

  let { currentMonth, transactions, config, onSaveConfig }: Props = $props();

  let scheduledExpenses = $state(config?.scheduledExpenses || '');
  let freeText = $state(config?.freeText || '');

  const monthDate = $derived(new Date(`${currentMonth}-01`));

  const daysInMonth = $derived(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  });

  const dailySpending = $derived(() => {
    const spending: Record<string, number> = {};
    transactions.forEach((t) => {
      if (t.type === 'expense' && t.date.startsWith(currentMonth)) {
        spending[t.date] = (spending[t.date] || 0) + t.amount;
      }
    });
    return spending;
  });

  const getDayColor = (day: number) => {
    const dateStr = `${currentMonth}-${day.toString().padStart(2, '0')}`;
    const spend = dailySpending()[dateStr] || 0;
    if (spend === 0) return 'zero';
    if (spend < 20) return 'medium';
    return 'high';
  };

  const monthName = $derived(monthDate.toLocaleDateString('es-ES', { month: 'long' }));

  const handleSave = () => {
    if (config && onSaveConfig) {
      onSaveConfig({ ...config, scheduledExpenses, freeText });
    }
  };
</script>

<div class="month-cover">
  <div class="header">
    <h2 class="title">Portada de {monthName}</h2>
    <p class="subtitle">Tu visión general del mes según el método Kakebo.</p>
  </div>

  <Card>
    <div class="calendar-header">
      <h3>Calendario de Gastos</h3>
    </div>
    <div class="weekdays">
      {#each ['L', 'M', 'X', 'J', 'V', 'S', 'D'] as day}
        <span class="weekday">{day}</span>
      {/each}
    </div>
    <div class="days">
      {#each Array(daysInMonth()) as _, i}
        {@const day = i + 1}
        {@const color = getDayColor(day)}
        <div
          class="day {color}"
          title="{dailySpending()[`${currentMonth}-${day.toString().padStart(2, '0')}`] || 0}€"
        >
          <span>{day}</span>
        </div>
      {/each}
    </div>
  </Card>

  <div class="notes">
    <Card>
      <h3>Gastos Programados</h3>
      <p>Apunta renovaciones, cumpleaños, suscripciones...</p>
      <textarea bind:value={scheduledExpenses} onblur={handleSave} placeholder="Ej. 15 - Cumpleaños"
      ></textarea>
    </Card>
    <Card>
      <h3>Página Libre</h3>
      <p>Ejercicios de cálculo, reflexiones, notas...</p>
      <textarea bind:value={freeText} onblur={handleSave} placeholder="Escribe aquí..."></textarea>
    </Card>
  </div>
</div>

<style>
  .month-cover {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 2.5rem;
  }

  .header {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 1.875rem;
    font-weight: 500;
    color: rgb(6 78 59);
    text-transform: capitalize;
  }

  .subtitle {
    color: rgb(120 113 108);
  }

  .calendar-header h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: rgb(28 25 23);
    margin-bottom: 1.5rem;
  }

  .weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .weekday {
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: rgb(168 162 158);
    text-transform: uppercase;
  }

  .days {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 0.5rem;
  }

  .day {
    aspect-ratio: 1;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 700;
    cursor: default;
    transition: transform 0.2s;
  }

  .day:hover {
    transform: scale(1.05);
  }

  .day.zero {
    background: rgb(220 252 231);
    color: rgb(22 101 52);
    border: 1px solid rgb(34 197 94);
  }

  .day.medium {
    background: rgb(254 249 195);
    color: rgb(161 98 7);
    border: 1px solid rgb(234 179 8);
  }

  .day.high {
    background: rgb(254 226 226);
    color: rgb(185 28 28);
    border: 1px solid rgb(239 68 68);
  }

  .notes {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 768px) {
    .notes {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .notes :global(.card) {
    display: flex;
    flex-direction: column;
  }

  .notes h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: rgb(28 25 23);
    margin-bottom: 0.5rem;
  }

  .notes p {
    font-size: 0.75rem;
    color: rgb(120 113 108);
    margin-bottom: 1rem;
  }

  .notes textarea {
    flex: 1;
    width: 100%;
    min-height: 150px;
    border-radius: 1rem;
    background: #f8f9fa;
    border: 1px solid rgb(228 228 216);
    padding: 1rem;
    font-size: 0.875rem;
    resize: none;
  }

  .notes textarea:focus {
    outline: none;
    ring: 2px;
    ring-color: rgb(34 197 94 / 0.2);
  }
</style>
