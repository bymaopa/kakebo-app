// src/lib/core/domain/credit-card-expense.type.ts

export interface CreditCardExpense {
  id: string;
  useDate: string;
  card: string;
  concept: string;
  payDate: string;
  interest: number;
  amount: number;
}
