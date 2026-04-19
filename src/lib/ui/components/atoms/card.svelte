<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: import('svelte').Snippet;
  }

  let { children, class: className = '', ...props }: Props = $props();
</script>

<div class="card {className}" {...props}>
  {@render children?.()}
</div>

<style>
  .card {
    border-radius: 32px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(24px);
    color: rgb(12 10 9);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.6);
    overflow: hidden;
  }
</style>
