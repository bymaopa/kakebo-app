//

import type { MonthConfiguration } from '../domain/date.type';

export class CalculateAvailableBudgetUseCase {
    execute(configuration: MonthConfiguration): number {
        const reserved = configuration.fixedExpenses + configuration.savings;
        return configuration.income - reserved;
    }
}