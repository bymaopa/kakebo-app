//

import { BaseDirectory, readTextFile, writeTextFile, exists, mkdir } from "@tauri-apps/plugin-fs";

//
import type { TransactionRepository } from "../ports/transaction.repository";
import type { Transaction } from "../../domain/transaction.type";

const FILE_NAME = 'kakebo_transactions.json';

export class StorageAdapter implements TransactionRepository {

    async save(transaction: Transaction): Promise<void> {
        const transactions = await this.readAll();
        const index = transactions.findIndex(t => t.id === transaction.id);
        if (index >= 0) {
            transactions[index] = transaction;
        } else {
            transactions.push(transaction);
        }

        await this.writeAll(transactions); 
    }

    async update(transaction: Transaction): Promise<void> {
        console.log(transaction);
        throw new Error("Method not implemented.");
    }

    async delete(id: string): Promise<void> {
        const transactions = await this.readAll();
        const filtered = transactions.filter(t => t.id !== id);
        await this.writeAll(filtered);
    }

    async getByMonth(month: string): Promise<Transaction[]> {
        const transactions = await this.readAll();
        return transactions.filter(t => t.date.startsWith(month));
    }

    // 1. Prepara el archivo en caso de no existir
    private async ensureStorageReady(): Promise<void> {
        try {
            // 1. Primero, creamos la carpeta base de AppData (ignoramos si ya existe)
            await mkdir('', { baseDir: BaseDirectory.AppData, recursive: true }).catch(() => {});
            // 2. Luego, comprobamos si el archivo de gastos existe
            const fileExists = await exists(FILE_NAME, { baseDir: BaseDirectory.AppData });
            // 3. Si no existe, creamos el archivo con un array JSON vacío
            if (!fileExists) {
                await writeTextFile(FILE_NAME, '[]', { baseDir: BaseDirectory.AppData });
            }
        } catch (error) {
            console.error('Error al preparar el disco:', error);
        }
    }

    private async readAll(): Promise<Transaction[]> {
        await this.ensureStorageReady();
        const content = await readTextFile(FILE_NAME, { baseDir: BaseDirectory.AppData });
        return JSON.parse(content || '[]');
    }

    private async writeAll(transactions: Transaction[]): Promise<void> {
        await writeTextFile(FILE_NAME, JSON.stringify(transactions, null, 2), { 
        baseDir: BaseDirectory.AppData 
        });
    }
}
