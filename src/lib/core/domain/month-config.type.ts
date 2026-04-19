// src/lib/core/domain/month-config.type.ts

import type { CreditCardExpense } from './credit-card-expense.type';

export interface MonthConfig {
  month: string;
  income: number;
  fixedExpenses: number;
  savingsGoal: number;
  promises?: string;
  objectives?: string;
  scheduledExpenses?: string;
  freeText?: string;
  weeklyLearnings?: Record<number, string>;
  creditCardExpenses?: CreditCardExpense[];
  objectivesAchieved?: 'SI' | 'NO' | 'CASI';
  promisesKept?: 'SI' | 'NO' | 'CASI';
  savingsKept?: 'SI' | 'NO';
  monthReflection?: string;
  isReflectionCompleted?: boolean;
}
