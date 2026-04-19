// src/lib/core/stores/kakebo.svelte.ts

import type { Transaction } from '../domain/transaction.type';
import type { RecurringTransaction } from '../domain/recurring-transaction.type';
import type { MonthConfig } from '../domain/month-config.type';
import type { UserProfile } from '../domain/user-profile.type';

const TRANSACTIONS_KEY = 'kakebo_transactions';
const RECURRING_KEY = 'kakebo_recurring';
const CONFIGS_KEY = 'kakebo_configs';
const PROFILE_KEY = 'kakebo_profile';

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId(): string {
  return crypto.randomUUID();
}

function getDefaultProfile(): UserProfile {
  return {
    name: 'Usuario',
    avatarSeed: Math.random().toString(36).substring(7),
    age: '',
    financialGoal: '',
    riskTolerance: 'medium'
  };
}

export class KakeboStore {
  private _transactions: Transaction[] = [];
  private _recurring: RecurringTransaction[] = [];
  private _configs: MonthConfig[] = [];
  private _profile: UserProfile = getDefaultProfile();
  private _listeners: Array<() => void> = [];

  constructor() {
    this._transactions = loadFromStorage(TRANSACTIONS_KEY, []);
    this._recurring = loadFromStorage(RECURRING_KEY, []);
    this._configs = loadFromStorage(CONFIGS_KEY, []);
    this._profile = loadFromStorage(PROFILE_KEY, getDefaultProfile());
  }

  get transactions(): Transaction[] {
    return this._transactions;
  }
  get recurringTransactions(): RecurringTransaction[] {
    return this._recurring;
  }
  get monthConfigs(): MonthConfig[] {
    return this._configs;
  }
  get userProfile(): UserProfile {
    return this._profile;
  }

  subscribe(fn: () => void) {
    this._listeners.push(fn);
    return () => {
      this._listeners = this._listeners.filter((f) => f !== fn);
    };
  }

  private notify() {
    this._listeners.forEach((fn) => fn());
  }

  addTransaction(t: Omit<Transaction, 'id'>) {
    const newT = { ...t, id: generateId() };
    this._transactions = [...this._transactions, newT];
    saveToStorage(TRANSACTIONS_KEY, this._transactions);
    this.notify();
  }

  deleteTransaction(id: string) {
    this._transactions = this._transactions.filter((t) => t.id !== id);
    saveToStorage(TRANSACTIONS_KEY, this._transactions);
    this.notify();
  }

  addRecurringTransaction(t: Omit<RecurringTransaction, 'id'>) {
    const newT = { ...t, id: generateId() };
    this._recurring = [...this._recurring, newT];
    saveToStorage(RECURRING_KEY, this._recurring);
    this.notify();
  }

  deleteRecurringTransaction(id: string) {
    this._recurring = this._recurring.filter((t) => t.id !== id);
    saveToStorage(RECURRING_KEY, this._recurring);
    this.notify();
  }

  applyRecurringTransactions(monthStr: string): number {
    const existing = this._transactions.filter((t) => t.date.startsWith(monthStr));
    const newTransactions: Transaction[] = [];

    for (const rt of this._recurring) {
      const dateStr = `${monthStr}-${rt.dayOfMonth.toString().padStart(2, '0')}`;
      const alreadyApplied = existing.some(
        (t) => t.description === rt.description && t.amount === rt.amount && t.date === dateStr
      );

      if (!alreadyApplied) {
        newTransactions.push({
          id: generateId(),
          type: rt.type,
          amount: rt.amount,
          category: rt.category,
          description: rt.description,
          date: dateStr
        });
      }
    }

    if (newTransactions.length > 0) {
      this._transactions = [...this._transactions, ...newTransactions];
      saveToStorage(TRANSACTIONS_KEY, this._transactions);
      this.notify();
      return newTransactions.length;
    }
    return 0;
  }

  saveMonthConfig(config: MonthConfig) {
    const idx = this._configs.findIndex((c) => c.month === config.month);
    if (idx >= 0) {
      this._configs[idx] = config;
      this._configs = [...this._configs];
    } else {
      this._configs = [...this._configs, config];
    }
    saveToStorage(CONFIGS_KEY, this._configs);
    this.notify();
  }

  getMonthConfig(monthStr: string): MonthConfig {
    return (
      this._configs.find((c) => c.month === monthStr) || {
        month: monthStr,
        income: 0,
        fixedExpenses: 0,
        savingsGoal: 0
      }
    );
  }

  saveUserProfile(profile: UserProfile) {
    this._profile = profile;
    saveToStorage(PROFILE_KEY, this._profile);
    this.notify();
  }

  exportData(): string {
    return JSON.stringify(
      {
        transactions: this._transactions,
        monthConfigs: this._configs,
        userProfile: this._profile
      },
      null,
      2
    );
  }

  importData(jsonString: string): void {
    const data = JSON.parse(jsonString);
    if (data.transactions) {
      this._transactions = data.transactions;
      saveToStorage(TRANSACTIONS_KEY, this._transactions);
    }
    if (data.monthConfigs) {
      this._configs = data.monthConfigs;
      saveToStorage(CONFIGS_KEY, this._configs);
    }
    if (data.userProfile) {
      this._profile = data.userProfile;
      saveToStorage(PROFILE_KEY, this._profile);
    }
    this.notify();
  }

  clearAllData() {
    this._transactions = [];
    this._configs = [];
    this._profile = getDefaultProfile();
    this._recurring = [];
    localStorage.removeItem(TRANSACTIONS_KEY);
    localStorage.removeItem(RECURRING_KEY);
    localStorage.removeItem(CONFIGS_KEY);
    localStorage.removeItem(PROFILE_KEY);
    this.notify();
  }
}

export const kakebo = new KakeboStore();
