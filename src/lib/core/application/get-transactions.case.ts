//

import type { Transaction } from '../domain/transaction.type';
import type { TransactionRepository } from '../infrastructure/ports/transaction.repository';

export class GetTransactionsUseCase {
  constructor(private repository: TransactionRepository) {}

  async execute(month: string): Promise<Transaction[]> {
    return this.repository.getByMonth(month);
  }
}
