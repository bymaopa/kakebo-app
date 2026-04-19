<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  }

  let { variant = 'default', class: className = '', children, ...props }: Props = $props();

  const variants = {
    default: 'bg-emerald-900 text-stone-50 hover:bg-emerald-800',
    primary: 'bg-emerald-800 text-white hover:bg-emerald-900',
    secondary: 'bg-stone-200 text-emerald-900 hover:bg-stone-300',
    outline: 'border-2 border-stone-200 bg-transparent hover:bg-stone-100 text-emerald-900',
    ghost: 'hover:bg-stone-100 text-emerald-900',
    destructive: 'bg-red-500 text-white hover:bg-red-600'
  };
</script>

<button class="btn {variants[variant]} {className}" {...props}>
  {@render children?.()}
</button>

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    transition: colors 0.2s;
    height: 3rem;
    padding: 0.5rem 1.5rem;
  }
</style>
