// src/lib/core/infrastructure/ports/transaction.repository

import { Transaction } from '$lib/core/domain/transaction.type';

export interface TransactionRepository {
    save(transaction: Transaction): Promise<void>;
    update(transaction: Transaction): Promise<void>;
    delete(id: string): Promise<void>;
    // Selects
    getByMonth(month: string): Promise<Transaction[]>;
}