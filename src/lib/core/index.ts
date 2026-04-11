//

// Adapters
import { StorageAdapter } from "./infrastructure/adapters/storage.adapter";

// Uses Cases
import { AddTransactionUseCase } from "./application/transaction.case";

// Instance Repository
const repository = new StorageAdapter();

/** Instance Use Cases */

// Transactions
export const addTransaction = new AddTransactionUseCase(repository);
