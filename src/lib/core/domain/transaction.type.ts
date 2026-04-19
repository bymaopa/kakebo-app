// src/lib/core/domain/transaction.type

import type { CategoryType } from './category.type';

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category?: CategoryType;
  description?: string;
  tags?: string[];
  learning?: string;
}
