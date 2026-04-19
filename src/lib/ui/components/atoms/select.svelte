<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';

  interface Props extends HTMLSelectAttributes {
    value?: string;
  }

  let { value = $bindable(''), class: className = '', ...props }: Props = $props();
</script>

<select class="select {className}" {...props}>
  <slot />
</select>

<style>
  .select {
    display: flex;
    height: 3rem;
    width: 100%;
    border-radius: 9999px;
    background: rgb(231 229 228);
    border: 0;
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
    transition: colors 0.2s;
    appearance: none;
  }

  .select:focus {
    outline: 2px solid rgb(6 78 59);
    outline-offset: 2px;
    background: white;
  }

  .select:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
</style>
