<script lang="ts">
  import { kakebo } from '$lib/core';
  import { MonthCover } from '$lib/ui';

  const currentMonth = $derived(new Date().toISOString().slice(0, 7));
</script>

<MonthCover
  {currentMonth}
  transactions={kakebo.transactions}
  config={kakebo.getMonthConfig(currentMonth)}
  onSaveConfig={(config) => kakebo.saveMonthConfig(config)}
/>
