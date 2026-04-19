//

import type { Transaction } from '../domain/transaction.type';
import type { TransactionRepository } from '../infrastructure/ports/transaction.repository';

export class UpdateTransactionUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(transaction: Transaction): Promise<void> {
    await this.repository.update(transaction);
  }
}
