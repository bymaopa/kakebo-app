<script lang="ts">
  import { kakebo } from '$lib/core';
  import { Dashboard } from '$lib/ui';

  const currentDate = $state(new Date());

  function handleDateChange(date: Date) {
    currentDate.setTime(date.getTime());
  }
</script>

<Dashboard
  transactions={kakebo.transactions}
  config={kakebo.getMonthConfig(currentDate.toISOString().slice(0, 7))}
  {currentDate}
  onDateChange={handleDateChange}
/>
