// src/lib/core/domain/recurring-transaction.type.ts

import type { TransactionType } from './transaction.type';
import type { CategoryType } from './category.type';

export interface RecurringTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  category?: CategoryType;
  description: string;
  dayOfMonth: number;
}
