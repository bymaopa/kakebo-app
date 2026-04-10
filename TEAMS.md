# Kakebo App - Estándares de Mantenimiento

> Documento de referencia para todos los desarrolladores del proyecto.

---

## 1. Principios Clean Code

### 1.1 Reglas Fundamentales

| Regla     | Descripción                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| **KISS**  | Keep It Simple, Stupid. Si no es simple, no lo hagas.                         |
| **DRY**   | Don't Repeat Yourself. Cada conocimiento debe tener una única representación. |
| **YAGNI** | You Aren't Gonna Need It. No escribas código que "quizás" necesites.          |
| **SRP**   | Single Responsibility Principle. Un componente, una responsabilidad.          |

### 1.2 Reglas de Código

1. **Código simple primero.** Si no puedes explicarlo en 10 segundos, está mal.
2. **Eliminar código inútil sin miedo.** Comentarios viejo, funciones no usadas, imports muertos.
3. **Si necesitas comentarios, reescribe el código.** El código debe ser auto-explicativo.
4. **No mezclar refactors con fixes.** Cada commit una cosa.
5. **Hazlo funcionar primero, optimiza después.** Premature optimization is the root of all evil.
6. **Commits pequeños o estás ocultando algo.**

---

## 2. Estructura del Proyecto

```
src/
├── lib/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/              # Button, Input, Card, Modal, etc.
│   │   ├── layout/          # Header, Footer, Navigation
│   │   └── features/         # Componentes de dominio
│   ├── stores/              # Estado global (Runes)
│   ├── services/            # Lógica de negocio
│   │   ├── api/             # Llamadas API
│   │   └── tauri.ts         # Comandos Tauri
│   ├── utils/               # Utilidades
│   ├── types/               # TypeScript types
│   ├── constants/           # Constantes
│   └── styles/              # Estilos globales
└── routes/                  # SvelteKit pages
    ├── +layout.svelte
    ├── +page.svelte
    └── feature/
        ├── +page.svelte
        └── [id]/
            └── +page.svelte
```

### 2.1 Reglas de Carpetas

- **Componentes UI:** Elementos abstractos y reutilizables (Button, Modal, Dropdown)
- **Componentes Features:** Componentes específicos de una funcionalidad
- **Stores:** Estado compartido entre componentes
- **Services:** Toda la lógica de negocio. Los componentes solo renderizan.

---

## 3. Componentes Svelte

### 3.1 Reglas de Tamaño

| Límite                              | Razón                                         |
| ----------------------------------- | --------------------------------------------- |
| **Máximo 150 líneas**               | Si es más, divide en componentes más pequeños |
| **Máximo 3 props complejas**        | Si necesita más, considera usar un store      |
| **Máximo 2 niveles de indentación** | Extraer lógica a funciones/helpers            |

### 3.2 Estructura de Componente

```svelte
<script lang="ts">
	// 1. Imports (orden: frameworks > libs > types > components > utils)
	import { someFunction } from '$lib/utils/helpers';
	import type { Expense } from '$lib/types';
	import Button from '$lib/components/ui/Button.svelte';

	// 2. Props con tipos estrictos
	interface Props {
		expense: Expense;
		onEdit?: (id: string) => void;
	}
	let { expense, onEdit }: Props = $props();

	// 3. Estado local (use $state para Svelte 5)
	let isLoading = $state(false);

	// 4. Derived state
	const formattedAmount = $derived(formatCurrency(expense.amount));

	// 5. Effects (mínimo, usar solo cuando sea necesario)
	$effect(() => {
		console.log('Mounted or expense changed');
		return () => console.log('Cleanup');
	});

	// 6. Handlers (funciones de eventos)
	async function handleEdit() {
		isLoading = true;
		await onEdit?.(expense.id);
		isLoading = false;
	}
</script>

<!-- Template: simple y declarativo -->
<div class="expense-card">
	<span class="amount">{formattedAmount}</span>
	<Button onclick={handleEdit} disabled={isLoading}>Editar</Button>
</div>

<!-- Estilos: scoped, usa variables -->
<style>
	.expense-card {
		padding: var(--spacing-md);
		background: var(--color-surface);
	}
</style>
```

### 3.3 NO hacer en componentes

```svelte
<!-- ❌ MAL: Lógica compleja en template -->
{#each expenses.filter(e => e.active).map(e => ({...e, total: e.items.reduce((a,b) => a + b.price, 0)})).sort((a,b) => b.total - a.total) as expense}
    <ExpenseCard {expense} />
{/each}

<!-- ✅ BIEN: Lógica en script, template simple -->
const sortedExpenses = $derived(
    expenses
        .filter(e => e.active)
        .map(e => ({ ...e, total: calculateTotal(e.items) }))
        .sort((a, b) => b.total - a.total)
);
```

---

## 4. TypeScript

### 4.1 Tipos

```typescript
// types/expense.types.ts

// Interfaz principal
export interface Expense {
	id: string;
	amount: number;
	description: string;
	categoryId: string;
	date: Date;
}

// Props de componentes
export type ExpenseCardProps = {
	expense: Expense;
	variant?: 'default' | 'compact';
};

// Estado de store
export type ExpenseState = {
	items: Expense[];
	loading: boolean;
	error: string | null;
};
```

### 4.2 Reglas de Tipado

| Regla                                     | Ejemplo                            |
| ----------------------------------------- | ---------------------------------- |
| Usar `type` sobre `interface`             | `type User = {...}`                |
| Usar `enum` solo si hay few valores fijos | `enum Status { Active, Inactive }` |
| Nunca usar `any`                          | Usar `unknown` + type guards       |
| Tipos opcionales con `?`                  | `name?: string`                    |

---

## 5. Estado (Svelte 5 Runes)

### 5.1 Cuándo usar qué

| Estado     | Uso                                            |
| ---------- | ---------------------------------------------- |
| `$state`   | Estado reactivo mutable                        |
| `$derived` | Valor calculado desde otros estados            |
| `$effect`  | Efectos secundarios (API calls, subscriptions) |
| `$props`   | Props de componente                            |

### 5.2 Stores para Estado Global

```typescript
// stores/expenses.store.ts
class ExpensesStore {
	items = $state<Expense[]>([]);
	loading = $state(false);
	error = $state<string | null>(null);

	total = $derived(this.items.reduce((sum, e) => sum + e.amount, 0));

	byCategory = $derived(
		this.items.reduce(
			(groups, expense) => {
				const cat = expense.categoryId;
				groups[cat] = groups[cat] ?? [];
				groups[cat].push(expense);
				return groups;
			},
			{} as Record<string, Expense[]>
		)
	);

	async load() {
		this.loading = true;
		this.error = null;
		try {
			this.items = await expensesService.getAll();
		} catch (e) {
			this.error = e instanceof Error ? e.message : 'Unknown error';
		} finally {
			this.loading = false;
		}
	}

	async add(expense: Omit<Expense, 'id'>) {
		const created = await expensesService.create(expense);
		this.items = [...this.items, created];
	}
}

export const expensesStore = new ExpensesStore();
```

---

## 6. Servicios y Lógica de Negocio

### 6.1 Reglas

- **Toda lógica de negocio va en `lib/services/`**
- **Los componentes solo renderizan y delegan**
- **Un servicio = una responsabilidad**

### 6.2 Ejemplo

```typescript
// services/expenses.service.ts
import { invoke } from '@tauri-apps/api/core';
import type { Expense } from '$lib/types';

export const expensesService = {
	async getAll(): Promise<Expense[]> {
		return invoke('get_expenses');
	},

	async getById(id: string): Promise<Expense> {
		return invoke('get_expense', { id });
	},

	async create(expense: Omit<Expense, 'id'>): Promise<Expense> {
		return invoke('create_expense', { expense });
	},

	async update(id: string, expense: Partial<Expense>): Promise<Expense> {
		return invoke('update_expense', { id, expense });
	},

	async delete(id: string): Promise<void> {
		return invoke('delete_expense', { id });
	}
};
```

---

## 7. Rutas (SvelteKit)

### 7.1 Estructura

```
routes/
├── +layout.svelte         # Layout principal
├── +page.svelte           # Dashboard
├── +layout.server.ts      # Load global (autenticación)
│
├── expenses/
│   ├── +page.svelte       # Lista
│   ├── +page.server.ts    # Load (SSR/prerender)
│   ├── new/
│   │   └── +page.svelte   # Crear
│   └── [id]/
│       ├── +page.svelte   # Detalle
│       └── +page.server.ts
│
└── (auth)/
    └── login/
        └── +page.svelte
```

### 7.2 Carga de Datos

```typescript
// routes/expenses/+page.server.ts
export const prerender = true;

export async function load() {
	const expenses = await expensesService.getAll();
	return { expenses };
}
```

```svelte
<!-- routes/expenses/+page.svelte -->
<script lang="ts">
	let { data } = $props();

	const { expenses } = data;
	const total = $derived(expenses.reduce((sum, e) => sum + e.amount, 0));
</script>
```

---

## 8. Estilos (Sass)

### 8.1 Variables (obligatorio)

```scss
// lib/styles/_variables.scss
:root {
	// Espaciado
	--spacing-xs: 0.25rem;
	--spacing-sm: 0.5rem;
	--spacing-md: 1rem;
	--spacing-lg: 1.5rem;
	--spacing-xl: 2rem;

	// Colores
	--color-primary: #3b82f6;
	--color-secondary: #64748b;
	--color-success: #22c55e;
	--color-error: #ef4444;
	--color-surface: #ffffff;
	--color-background: #f8fafc;

	// Tipografía
	--font-family: system-ui, sans-serif;
	--font-size-sm: 0.875rem;
	--font-size-base: 1rem;
	--font-size-lg: 1.25rem;

	// Bordes
	--radius-sm: 4px;
	--radius-md: 8px;
	--radius-lg: 12px;
}
```

### 8.2 Convención BEM

```scss
// ✅ BIEN
.expense-card {
	&__header {
	}
	&__title {
	}
	&__amount {
	}
	&--highlighted {
	}
}

// ❌ MAL
.expenseCardHeaderTitle {
}
```

---

## 9. Imports

### 9.1 Orden de Imports

```typescript
// 1. Frameworks (svelte, react, etc.)
// 2. Librerías externas (@tauri-apps, etc.)
// 3. Tipos (lib/types)
// 4. Constantes (lib/constants)
// 5. Componentes locales
// 6. Utilidades locales (lib/utils)
// 7. Assets
```

### 9.2 Usar Alias

```typescript
// ✅ BIEN
import { Button } from '$lib/components/ui';
import type { Expense } from '$lib/types';

// ❌ MAL
import { Button } from '../../../components/ui/Button.svelte';
```

---

## 10. Commits

### 10.1 Formato

```
<tipo>(<scope>): <descripción>

[opcional body]

[opcional footer]
```

### 10.2 Tipos Permitidos

| Tipo       | Uso                                   |
| ---------- | ------------------------------------- |
| `feat`     | Nueva funcionalidad                   |
| `fix`      | Corrección de bug                     |
| `docs`     | Documentación                         |
| `style`    | Formateo, estilo (sin lógica)         |
| `refactor` | Refactoring (sin cambios funcionales) |
| `test`     | Tests                                 |
| `chore`    | Tareas de mantenimiento               |

### 10.3 Ejemplos

```bash
git commit -m "feat(expenses): add expense creation form"
git commit -m "fix(categories): correct category deletion"
git commit -m "docs(readme): update installation steps"
git commit -m "refactor(stores): simplify expense store state"
```

### 10.4 Reglas

- **Un commit = una funcionalidad o un fix**
- **No mezclar cambios de diferentes features**
- **Commits pequeños y frecuentes**
- **Mensaje claro y descriptivo (max 72 caracteres)**

---

## 11. Revisión de Código

### 11.1 Checklist Antes de PR

- [ ] Código compila sin errores
- [ ] Tests pasan
- [ ] Lint pasa (`npm run check`)
- [ ] Sin `console.log` o código de debug
- [ ] Sin código comentado
- [ ] Props tipadas
- [ ] No más de 150 líneas por componente
- [ ] Imports ordenados

### 11.2 Preguntas de Revisión

1. ¿Se puede entender el código en 10 segundos?
2. ¿Hay código duplicado?
3. ¿Hay código que no se usa?
4. ¿Las funciones hacen una sola cosa?
5. ¿Los nombres son descriptivos?

---

## 12. Testing

### 12.1 Reglas

| Tipo            | Propósito          | Cuándo                   |
| --------------- | ------------------ | ------------------------ |
| Unit tests      | Lógica pura, utils | Funciones criticales     |
| Component tests | Comportamiento UI  | Componentes interactivos |
| E2E tests       | Flujos completos   | Features principales     |

### 12.2 Ejemplo

```typescript
// utils/__tests__/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../format';

describe('formatCurrency', () => {
	it('formats positive numbers', () => {
		expect(formatCurrency(1000)).toBe('$1,000.00');
	});

	it('formats zero', () => {
		expect(formatCurrency(0)).toBe('$0.00');
	});
});
```

---

## 13. Performance

### 13.1 Checklist

- [ ] Lazy loading de componentes grandes
- [ ] `$derived` para cálculos costosos
- [ ] `data-sveltekit-preload-data="viewport"`
- [ ] Imágenes con `loading="lazy"`
- [ ] No re-renders innecesarios

### 13.2 Lazy Loading

```svelte
<script>
	let HeavyChart;

	onMount(async () => {
		const module = await import('$lib/components/features/HeavyChart.svelte');
		HeavyChart = module.default;
	});
</script>

{#if HeavyChart}
	<svelte:component this={HeavyChart} data={chartData} />
{/if}
```

---

## 14. Errores Comunes a Evitar

| Error                     | Solución                         |
| ------------------------- | -------------------------------- |
| Props sin tipar           | Siempre tipar con interface/type |
| `$effect` sin cleanup     | Retornar función de cleanup      |
| Lógica en templates       | Mover a `$derived` o funciones   |
| Imports largos            | Usar alias `@/`                  |
| Componentes de 500 líneas | Dividir en sub-componentes       |
| `any` en TypeScript       | Usar `unknown` + type guards     |
| Commits enormes           | Dividir en commits atómicos      |
| Código comentado          | Eliminar, git tiene historial    |

---

## 15. Recursos

- [Svelte 5 Runes](https://svelte.dev/docs/svelte)
- [SvelteKit](https://kit.svelte.dev/docs)
- [Tauri](https://tauri.app/v1/guides/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Sass](https://sass-lang.com/guide)

---

_Última actualización: 2026-04-07_
_Versión: 1.0_
