<script lang="ts">
  import type { MonthConfig } from '$lib/core';
  import { Card, Input, Button } from '$lib/ui';

  interface Props {
    currentMonth: string;
    config?: MonthConfig;
    onSave: (config: MonthConfig) => void;
    onComplete?: () => void;
  }

  let { currentMonth, config, onSave, onComplete }: Props = $props();

  let income = $state(config?.income?.toString() || '');
  let fixedExpenses = $state(config?.fixedExpenses?.toString() || '');
  let savingsGoal = $state(config?.savingsGoal?.toString() || '');
  let objectives = $state(config?.objectives || '');
  let promises = $state(config?.promises || '');

  const numIncome = $derived(parseFloat(income) || 0);
  const numFixed = $derived(parseFloat(fixedExpenses) || 0);
  const numSavings = $derived(parseFloat(savingsGoal) || 0);

  const budgetOptionA = $derived(numIncome - numFixed);
  const budgetOptionB = $derived(numIncome - numFixed - numSavings);

  const monthName = $derived(
    new Date(`${currentMonth}-01`).toLocaleDateString('es-ES', { month: 'long' })
  );

  function handleSave() {
    onSave({
      month: currentMonth,
      income: numIncome,
      fixedExpenses: numFixed,
      savingsGoal: numSavings,
      objectives,
      promises,
      scheduledExpenses: config?.scheduledExpenses || '',
      freeText: config?.freeText || ''
    });
    if (onComplete) onComplete();
  }
</script>

<div class="month-setup">
  <div class="header">
    <h2>Inicio de Mes · {monthName}</h2>
    <p>Establece tu presupuesto y objetivos para empezar con buen pie.</p>
  </div>

  <div class="grid">
    <Card>
      <label>
        <span>Ingresos</span>
        <p>Tu sueldo, ventas, ingresos extra...</p>
      </label>
      <Input type="number" bind:value={income} placeholder="0.00" />
    </Card>

    <Card>
      <label>
        <span>Gastos Fijos</span>
        <p>Alquiler, hipoteca, préstamos, seguros...</p>
      </label>
      <Input type="number" bind:value={fixedExpenses} placeholder="0.00" />
    </Card>

    <Card>
      <label>
        <span>Objetivo de Ahorro</span>
        <p>Cantidad que quieres ahorrar este mes</p>
      </label>
      <Input type="number" bind:value={savingsGoal} placeholder="0.00" />
    </Card>

    <Card>
      <label>
        <span>Objetivos del Mes</span>
        <p>¿Qué quieres conseguir?</p>
      </label>
      <textarea bind:value={objectives} placeholder="Ej. Terminar de pagar la reforma..."
      ></textarea>
    </Card>

    <Card>
      <label>
        <span>Mis Promesas</span>
        <p>¿Qué vas a hacer para ahorrar?</p>
      </label>
      <textarea bind:value={promises} placeholder="Ej. Comer en casa 3 días por semana..."
      ></textarea>
    </Card>
  </div>

  <div class="budget-summary">
    <h3>Tu Presupuesto Disponible</h3>
    <div class="options">
      <div class="option">
        <span>Sin ahorro</span>
        <span class="amount">{budgetOptionA.toFixed(2)}€</span>
      </div>
      <div class="option highlight">
        <span>Con ahorro</span>
        <span class="amount">{budgetOptionB.toFixed(2)}€</span>
      </div>
    </div>
  </div>

  <Button onclick={handleSave}>Guardar Presupuesto</Button>
</div>

<style>
  .month-setup {
    max-width: 56rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding-bottom: 6rem;
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .header h2 {
    font-size: 1.875rem;
    font-weight: 500;
    color: rgb(6 78 59);
    text-transform: capitalize;
  }

  .header p {
    color: rgb(120 113 108);
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    .grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .grid :global(.card) {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .grid label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .grid label span {
    font-size: 0.875rem;
    font-weight: 700;
    color: rgb(6 78 59);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .grid label p {
    font-size: 0.75rem;
    color: rgb(120 113 108);
  }

  .grid textarea {
    width: 100%;
    min-height: 100px;
    border-radius: 1rem;
    background: rgb(250 250 249);
    border: 1px solid rgb(228 228 216);
    padding: 0.75rem;
    font-size: 0.875rem;
    resize: none;
  }

  .grid textarea:focus {
    outline: none;
    ring: 2px;
    ring-color: rgb(16 185 129 / 0.2);
  }

  .budget-summary {
    background: white;
    padding: 2rem;
    border-radius: 40px;
    border: 1px solid rgb(228 228 216);
  }

  .budget-summary h3 {
    font-size: 1rem;
    font-weight: 700;
    color: rgb(28 25 23);
    margin-bottom: 1rem;
    text-align: center;
  }

  .options {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .option {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
  }

  .option span:first-child {
    font-size: 0.75rem;
    color: rgb(120 113 108);
  }

  .option .amount {
    font-size: 1.5rem;
    font-weight: 800;
    color: rgb(6 78 59);
  }

  .option.highlight .amount {
    font-size: 2rem;
  }
</style>
