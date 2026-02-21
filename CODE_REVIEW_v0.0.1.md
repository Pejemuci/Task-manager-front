# Code Review - Task Manager Frontend v0.0.1

**Fecha:** 2026-02-21
**Rama revisada:** `claude/review-code-v0.0.1-9TbKy`

---

## 1. Resumen de Funcionalidades

### Stack Tecnológico
- **React 18** + **TypeScript 5.3** con Vite 7
- **Zustand** para estado global
- **React Hook Form** + **Zod** para formularios y validación
- **TailwindCSS** para estilos
- **@dnd-kit** para drag-and-drop en el Kanban
- **Axios** con interceptores globales
- **date-fns** con locale español
- **Framer Motion** + **Lucide React**

### Módulos Principales

| Módulo | Descripción |
|--------|-------------|
| **Autenticación** | Login/Register con JWT almacenado en localStorage. Rutas protegidas y públicas via HOC. Auto-logout en 401. |
| **Dashboard** | Métricas (total, pendientes, en progreso, completadas, alta prioridad). Alertas de tareas vencidas y de alta prioridad. |
| **Gestión de Tareas** | Vista tabla con paginación (10/página), filtros por estado/prioridad/usuario/búsqueda, toggle de completadas, CRUD completo. |
| **Kanban** | Tablero drag-and-drop con 3 columnas (Pendiente, En Progreso, Completado). Filtros por búsqueda, prioridad y asignado. |
| **Organización** | Vista de equipo, invitación de miembros con contraseña temporal, remoción de miembros. Control de acceso ADMIN/MEMBER. |
| **Perfil** | Vista de datos del usuario (nombre, email, rol, organización, fecha de registro). |
| **Configuración** | Tres pestañas: actualizar perfil, renombrar organización (solo ADMIN), cambiar contraseña. |

### Arquitectura
- Separación clara: `pages/` → `components/` → `services/` → `store/`
- Librería de componentes UI reutilizables: Button, Input, Select, Textarea, Card, Badge, Modal, Loading, EmptyState, Pagination
- Servicio API centralizado con interceptores de request/response
- Mensajes de error en español

---

## 2. Bugs Encontrados

### BUG-01 — CRÍTICO: Props incorrectas en `TaskCard` desde `Dashboard`
**Archivo:** `src/pages/Dashboard.tsx` (líneas 148-155, 174-180)

```tsx
// ❌ ACTUAL — props que no existen en TaskCard
<TaskCard
  task={task}
  onView={handleViewTask}   // prop no existe
  onEdit={handleEditTask}   // prop no existe
  onDelete={() => {}}       // prop no existe
/>
```

```tsx
// ✅ CORRECTO — props reales de TaskCard
<TaskCard
  task={task}
  onClick={() => handleViewTask(task)}   // prop requerida
  onQuickEdit={() => handleEditTask(task)}
  onQuickDelete={() => {}}
/>
```

**Impacto:** Las tarjetas del Dashboard no responden a ningún click. El modal de detalle nunca se abre. Los botones de hover (editar, completar, eliminar) no funcionan. TypeScript debería reportar este error en tiempo de compilación.

---

### BUG-02 — CRÍTICO: Variantes de `Badge` inválidas en `TaskCard`
**Archivo:** `src/components/tasks/TaskCard.tsx` (línea 117)

```tsx
// ❌ ACTUAL — 'success' y 'warning' no existen en Badge
<Badge variant={
  task.status === 'COMPLETED' ? 'success' :    // no existe
  task.status === 'IN_PROGRESS' ? 'default' :
  'warning'                                      // no existe
}>
```

```tsx
// ✅ CORRECTO — usar los valores reales del tipo TaskStatus
<Badge variant={task.status}>
```

**Impacto:** `variants['success']` y `variants['warning']` retornan `undefined`. Los badges de tareas COMPLETED y PENDING se renderizan sin ningún estilo de color. Solo el estado IN_PROGRESS (que usa `'default'`) muestra color. El componente Badge define: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `LOW`, `MEDIUM`, `HIGH`, `default`.

---

### BUG-03 — ALTO: `initAuth` no restaura `organization` tras recarga
**Archivo:** `src/store/authStore.ts` (línea 33-39)

```ts
// ❌ ACTUAL — organization queda null tras recargar la página
initAuth: () => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  if (user && isAuthenticated) {
    set({ user, isAuthenticated: true }); // organization no se restaura
  }
},
```

**Impacto:** Tras un F5 o recarga, el campo `organization` del store queda `null` aunque el usuario sigue autenticado. Cualquier componente que lea `useAuthStore().organization` (ej: Settings, Organization) mostrará datos vacíos o lanzará errores de acceso a propiedades de `null`. El token y el usuario se persisten en localStorage pero la organización no.

---

### BUG-04 — ALTO: Kanban acepta IDs de tarea como `status` en drag-and-drop
**Archivo:** `src/pages/Kanban.tsx` (línea 104)

```tsx
// ❌ ACTUAL — over.id puede ser el ID de otra tarea, no un status
const newStatus = over.id as string;
// Si se suelta sobre una tarjeta: over.id = "abc-123-uuid" (ID de tarea)
// Si se suelta sobre una columna: over.id = "PENDING" (correcto)
await taskService.updateTask(taskId, { status: newStatus } as any);
```

**Impacto:** Si el usuario arrastra y suelta una tarea encima de otra tarea (no en el área vacía de la columna), se envía un UUID como valor de `status` a la API. El uso de `as any` suprime el error de TypeScript. La API probablemente rechazará la petición con 400/422.

---

### BUG-05 — ALTO: Página Kanban no usa el componente `Layout`
**Archivo:** `src/pages/Kanban.tsx`

```tsx
// ❌ ACTUAL — sin Layout, sin sidebar ni navbar
return (
  <div className="space-y-6">
    <div>...</div>
  </div>
);
```

```tsx
// ✅ CORRECTO — como Dashboard, Tasks, Organization, etc.
return (
  <Layout title="Kanban">
    <div className="space-y-6">
      ...
    </div>
  </Layout>
);
```

**Impacto:** La vista Kanban no muestra el sidebar de navegación ni la barra superior (navbar). El usuario no tiene forma de navegar a otras secciones desde Kanban sin usar la URL directamente. La pantalla de carga tampoco usa Layout, a diferencia de todas las demás páginas.

---

### BUG-06 — MEDIO: Toast de sesión expirada no se ve (orden de operaciones en 401)
**Archivo:** `src/services/api.ts` (líneas 37-41)

```ts
// ❌ ACTUAL — la redirección ocurre antes de que el toast se muestre
if (status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';          // redirige inmediatamente
  toast.error('Sesión expirada...');        // nunca se ve
}
```

**Impacto:** El toast de "Sesión expirada" nunca es visible para el usuario porque la redirección de página lo interrumpe. El usuario es redirigido al login sin ninguna notificación visible de por qué fue desconectado.

---

### BUG-07 — MEDIO: `handleCreateTask` y `handleUpdateTask` sin try/catch
**Archivo:** `src/pages/Tasks.tsx` (líneas 89-102)

```tsx
// ❌ ACTUAL
const handleCreateTask = async (data: CreateTaskData) => {
  await taskService.createTask(data); // sin try/catch
  toast.success('Tarea creada exitosamente');
  loadData();
};
```

**Impacto:** Si la llamada a la API falla, el error sube al `catch` de `TaskModal.handleFormSubmit` (silenciado), pero `toast.success` y `loadData()` no se ejecutan. El comportamiento final es correcto (el modal no se cierra), pero si en el futuro se refactoriza `TaskModal`, este patrón puede causar que el success toast se muestre aunque haya habido un error.

---

### BUG-08 — BAJO: URL de API hardcodeada
**Archivo:** `src/services/api.ts` (línea 4)

```ts
// ❌ ACTUAL
const API_URL = 'http://localhost:3000/api';
```

```ts
// ✅ CORRECTO
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
```

**Impacto:** No funcional en desarrollo, pero impide desplegar la aplicación a staging o producción sin modificar el código fuente. El archivo `.env` debería definir `VITE_API_URL`.

---

### BUG-09 — BAJO: Componente `TaskForm.tsx` sin uso (código muerto)
**Archivo:** `src/components/tasks/TaskForm.tsx`

El componente existe y no es importado en ningún lugar del proyecto. `TaskModal.tsx` es el componente activo para crear/editar tareas.

**Impacto:** Confusión en el equipo sobre cuál usar. Incrementa el bundle size levemente. Debe eliminarse.

---

## 3. Resumen de Bugs por Severidad

| ID | Severidad | Descripción |
|----|-----------|-------------|
| BUG-01 | 🔴 Crítico | Props incorrectas en TaskCard del Dashboard (clicks no funcionan) |
| BUG-02 | 🔴 Crítico | Variantes inválidas en Badge (badges sin color) |
| BUG-03 | 🟠 Alto | Organization no restaurada en initAuth (null tras recarga) |
| BUG-04 | 🟠 Alto | Kanban acepta task ID como status en drag-and-drop |
| BUG-05 | 🟠 Alto | Kanban sin Layout (sin sidebar ni navbar) |
| BUG-06 | 🟡 Medio | Toast de 401 no visible (orden de operaciones) |
| BUG-07 | 🟡 Medio | handlers de tarea sin try/catch en Tasks.tsx |
| BUG-08 | 🟢 Bajo | URL de API hardcodeada |
| BUG-09 | 🟢 Bajo | TaskForm.tsx es código muerto (no se usa) |

---

## 4. Fortalezas del Código

- Tipado TypeScript consistente en toda la base de código
- Separación de responsabilidades clara (services, components, pages, types)
- Componentes UI reutilizables bien estructurados
- Validación de formularios con Zod + React Hook Form
- Manejo de errores global centralizado en interceptores de Axios
- Estados de carga en todas las operaciones asíncronas
- Diseño responsive con Tailwind
- Localización en español con date-fns/locale/es
- Actualización optimista del UI en el Kanban (drag-and-drop)

---

## 5. Funcionalidades Faltantes / Placeholders

- Campana de notificaciones: ícono presente, sin implementación
- Botón "Help Center" en el sidebar: sin destino
- Sin soporte offline ni WebSockets para actualizaciones en tiempo real
- Sin paginación en el Kanban (carga todas las tareas en memoria)
- Sin búsqueda en la API (toda la búsqueda/filtrado es client-side en Tasks)
- Sin confirmación visual al eliminar (solo `window.confirm` nativo)
