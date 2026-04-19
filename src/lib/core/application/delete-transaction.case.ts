//

import type { Transaction } from '../domain/transaction.type';
import type { TransactionRepository } from '../infrastructure/ports/transaction.repository';

export class DeleteTransactionUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
