//

import type { Transaction } from '../domain/transaction.type';

export interface BalanceResult {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  byCategory: Record<string, number>;
}

export class CalculateBalanceUseCase {
  execute(transactions: Transaction[]): BalanceResult {
    const byCategory: Record<string, number> = {};

    let totalIncome = 0;
    let totalExpenses = 0;

    for (const t of transactions) {
      if (t.type === 'income') {
        totalIncome += t.amount;
      } else {
        totalExpenses += t.amount;
        const cat = t.category || 'Extras';
        byCategory[cat] = (byCategory[cat] || 0) + t.amount;
      }
    }

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses,
      byCategory
    };
  }
}
