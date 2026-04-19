// src/lib/core/index.ts

import { StorageAdapter } from './infrastructure/adapters/storage.adapter';

import { AddTransactionUseCase } from './application/transaction.case';
import { DeleteTransactionUseCase } from './application/delete-transaction.case';
import { UpdateTransactionUseCase } from './application/update-transaction.case';
import { GetTransactionsUseCase } from './application/get-transactions.case';
import { CalculateBalanceUseCase } from './application/calculate-balance.case';

import { kakebo } from './stores/kakebo.svelte';

const repository = new StorageAdapter();

export const addTransaction = new AddTransactionUseCase(repository);
export const deleteTransaction = new DeleteTransactionUseCase(repository);
export const updateTransaction = new UpdateTransactionUseCase(repository);
export const getTransactions = new GetTransactionsUseCase(repository);
export const calculateBalance = new CalculateBalanceUseCase();

export { kakebo };

export type { Transaction } from './domain/transaction.type';
export type { RecurringTransaction } from './domain/recurring-transaction.type';
export type { MonthConfig } from './domain/month-config.type';
export type { UserProfile } from './domain/user-profile.type';
export type { CategoryType } from './domain/category.type';
export type { TransactionType } from './domain/transaction.type';
