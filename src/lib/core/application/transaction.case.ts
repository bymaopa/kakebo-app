//

import type { Transaction } from '../domain/transaction.type';
import type { TransactionRepository } from '../infrastructure/ports/transaction.repository';

export class AddTransactionUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(transaction: Transaction): Promise<void> {
    await this.repository.save(transaction);
  }
}
