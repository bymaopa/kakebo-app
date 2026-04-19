<script lang="ts">
  import { kakebo } from '$lib/core';
  import { TransactionList } from '$lib/ui';

  async function handleDelete(id: string) {
    kakebo.deleteTransaction(id);
  }
</script>

<TransactionList transactions={kakebo.transactions} onDelete={handleDelete} />
