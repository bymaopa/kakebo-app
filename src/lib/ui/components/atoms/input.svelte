<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    value?: string;
  }

  let { value = $bindable(''), class: className = '', ...props }: Props = $props();
</script>

<input class="input {className}" {...props} />

<style>
  .input {
    display: flex;
    height: 3rem;
    width: 100%;
    border-radius: 9999px;
    background: rgb(231 229 228);
    border: 0;
    padding: 0.5rem 1.25rem;
    font-size: 0.875rem;
    transition: colors 0.2s;
  }

  .input::placeholder {
    color: rgb(120 113 108);
  }

  .input:focus {
    outline: 2px solid rgb(6 78 59);
    outline-offset: 2px;
    background: white;
  }
</style>
