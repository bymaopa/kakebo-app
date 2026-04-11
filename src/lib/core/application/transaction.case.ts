//

import type { Transaction } from '$lib/core/domain/transaction.type';
import type { TransactionRepository } from '$lib/core/infrastructure/ports/transaction.repository';

export class AddTransactionUseCase {
    constructor (private repository: TransactionRepository) {}

    async execute(transaction: Transaction): Promise<void> {
        await this.repository.save(transaction);
    }
}