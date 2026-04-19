<script lang="ts">
  import { Button } from '$lib/ui';

  interface Props {
    onComplete: (result: string) => void;
    onCancel: () => void;
  }

  let { onComplete, onCancel }: Props = $props();

  let currentStep = $state(0);

  const steps = [
    {
      question: '¿Es necesario?',
      options: [
        { label: 'Sí', next: 1 },
        { label: 'No', next: 'result-no' }
      ]
    },
    {
      question: '¿Ya tienes algo similar?',
      options: [
        { label: 'Sí', next: 'result-no' },
        { label: 'No', next: 2 }
      ]
    },
    {
      question: '¿Lo pagarías con lo que has ahorrado este mes?',
      options: [
        { label: 'Sí', next: 3 },
        { label: 'No', next: 'result-no' }
      ]
    },
    {
      question: '¿Te durará más de 6 meses?',
      options: [
        { label: 'Sí', next: 'result-yes' },
        { label: 'No', next: 'result-no' }
      ]
    }
  ];

  const results: Record<string, string> = {
    'result-yes': '¡Adquirirlo! Es una compra consciente y necesaria.',
    'result-no': 'Mejor no comprarlo. ¿Por qué no loguardas en tu lista de deseos?'
  };

  function handleOption(next: string | number) {
    if (typeof next === 'string' && next.startsWith('result')) {
      onComplete(results[next]);
    } else if (typeof next === 'number') {
      currentStep = next;
    }
  }
</script>

<div class="decision-flow">
  <div class="progress">
    {#each steps as _, i}
      <div class="dot" class:active={i === currentStep} class:completed={i < currentStep}></div>
    {/each}
  </div>

  <div class="question">
    <h3>{steps[currentStep].question}</h3>
  </div>

  <div class="options">
    {#each steps[currentStep].options as opt}
      <Button onclick={() => handleOption(opt.next)}>{opt.label}</Button>
    {/each}
  </div>

  <Button variant="ghost" onclick={onCancel}>Cancelar</Button>
</div>

<style>
  .decision-flow {
    background: white;
    padding: 3rem;
    border-radius: 40px;
    max-width: 500px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .progress {
    display: flex;
    gap: 0.5rem;
  }

  .dot {
    width: 12px;
    height: 12px;
    border-radius: 9999px;
    background: rgb(231 229 228);
    transition: all 0.3s;
  }

  .dot.active {
    background: rgb(6 78 59);
    transform: scale(1.2);
  }

  .dot.completed {
    background: rgb(34 197 94);
  }

  .question h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: rgb(6 78 59);
    text-align: center;
  }

  .options {
    display: flex;
    gap: 1rem;
    width: 100%;
  }

  .options :global(button) {
    flex: 1;
  }
</style>
