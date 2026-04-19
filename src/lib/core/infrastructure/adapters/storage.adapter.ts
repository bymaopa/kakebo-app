/* src/lib/core/infrastructure/adapters/storage.adapter.ts */

import type { TransactionRepository } from '../ports/transaction.repository';
import type { Transaction } from '../../domain/transaction.type';

const STORAGE_KEY = 'kakebo_transactions';

const isTauri = typeof window !== 'undefined' && '__TAURI__' in window;

let tauriFs: typeof import('@tauri-apps/plugin-fs') | null = null;

async function getTauriFs() {
  if (!isTauri) return null;
  if (tauriFs) return tauriFs;
  try {
    tauriFs = await import('@tauri-apps/plugin-fs');
    return tauriFs;
  } catch {
    return null;
  }
}

export class StorageAdapter implements TransactionRepository {
  async save(transaction: Transaction): Promise<void> {
    const transactions = await this.readAll();
    const index = transactions.findIndex((t) => t.id === transaction.id);
    if (index >= 0) {
      transactions[index] = transaction;
    } else {
      transactions.push(transaction);
    }
    await this.writeAll(transactions);
  }

  async update(transaction: Transaction): Promise<void> {
    const transactions = await this.readAll();
    const index = transactions.findIndex((t) => t.id === transaction.id);
    if (index >= 0) {
      transactions[index] = transaction;
      await this.writeAll(transactions);
    }
  }

  async delete(id: string): Promise<void> {
    const transactions = await this.readAll();
    const filtered = transactions.filter((t) => t.id !== id);
    await this.writeAll(filtered);
  }

  async getByMonth(month: string): Promise<Transaction[]> {
    const transactions = await this.readAll();
    return transactions.filter((t) => t.date.startsWith(month));
  }

  private async readAll(): Promise<Transaction[]> {
    const fs = await getTauriFs();

    if (fs) {
      try {
        const { BaseDirectory, readTextFile, writeTextFile, exists, mkdir } = fs;

        await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true }).catch(() => {});

        const fileExists = await exists('kakebo_transactions.json', {
          baseDir: BaseDirectory.AppData
        });
        if (!fileExists) {
          await writeTextFile('kakebo_transactions.json', '[]', { baseDir: BaseDirectory.AppData });
        }

        const content = await readTextFile('kakebo_transactions.json', {
          baseDir: BaseDirectory.AppData
        });
        return JSON.parse(content || '[]');
      } catch (error) {
        console.warn('Tauri FS falló, usando localStorage:', error);
      }
    }

    return this.readFromLocalStorage();
  }

  private async writeAll(transactions: Transaction[]): Promise<void> {
    const fs = await getTauriFs();

    if (fs) {
      try {
        const { BaseDirectory, writeTextFile } = fs;
        await writeTextFile('kakebo_transactions.json', JSON.stringify(transactions, null, 2), {
          baseDir: BaseDirectory.AppData
        });
        return;
      } catch (error) {
        console.warn('Tauri FS falló, usando localStorage:', error);
      }
    }

    this.writeToLocalStorage(transactions);
  }

  private readFromLocalStorage(): Transaction[] {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  private writeToLocalStorage(transactions: Transaction[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }
}
