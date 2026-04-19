# Kakebo App

**Gestión de finanzas personales método Kakebo**

---

## ¿Qué es Kakebo?

Kakebo es un método japonés de gestión de finanzas personales. Se basa en registrar cada gasto y reflexionar sobre él,分为四个 categorías:

- **Supervivencia**: Alimentación, vivienda, transporte, salud
- **Ocio/Vicio**: Restaurantes, ropa no esencial, salidas
- **Cultura**: Libros, cine, cursos, educación
- **Extras**: Regalos, reparaciones, imprevistos

---

## Características

- 📝 **Registro rápido** de ingresos y gastos
- 📊 **Resumen mensual** con estadísticas
- 📅 **Calendario visual** de gastos diarios
- 📋 **Lista de movimientos** completa
- 👤 **Perfil** con objetivos de ahorro
- 💾 **Datos guardados** en tu ordenador

---

## Instalación

### Desde código fuente

```bash
# Clonar el repositorio
git clone https://github.com/bymaopa/kakebo-app.git
cd kakebo-app

# Instalar dependencias
pnpm install

# Ejecutar en desarrollo
pnpm dev
```

### Construir aplicación de escritorio

```bash
# Requiere Rust instalado
pnpm tauri build
```

El ejecutable se generará en `src-tauri/target/release/`

---

## Uso

1. **Añadir transacción**: Selecciona tipo (gasto/ingreso), introduce cantidad, descripción y categoría
2. **Ver resumen**: Estadísticas del mes en curso
3. **Calendario**: Visualización diaria de gastos
4. **Movimientos**: Historial completo de transacciones
5. **Perfil**: Configura tu objetivo de ahorro mensual

---

## Tecnologías

- Svelte 5 + SvelteKit
- Tauri 2 (Rust)
- TypeScript

---

## Licencia

MIT
