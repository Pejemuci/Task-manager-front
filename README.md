# 🎨 Task Manager Frontend

Frontend moderno para la aplicación de gestión de tareas, construido con React, TypeScript y Tailwind CSS.

---

## ✨ Características

- ✅ **Diseño Moderno** - Interfaz limpia y profesional inspirada en herramientas como Asana y Linear
- ✅ **Autenticación JWT** - Sistema completo de login y registro
- ✅ **Dashboard Interactivo** - Métricas y estadísticas en tiempo real
- ✅ **Gestión de Tareas** - CRUD completo con filtros avanzados
- ✅ **Multitenancy** - Organizaciones completamente aisladas
- ✅ **Roles y Permisos** - Sistema ADMIN/MEMBER
- ✅ **Responsive** - Diseño adaptativo para móviles y tablets
- ✅ **TypeScript** - Código completamente tipado

---

## 🛠️ Stack Tecnológico

- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultra rápido
- **Tailwind CSS** - Estilos utility-first
- **React Router v6** - Navegación
- **Axios** - Cliente HTTP
- **Zustand** - Gestión de estado
- **React Hook Form** - Formularios
- **Zod** - Validación de esquemas
- **React Hot Toast** - Notificaciones
- **Lucide Icons** - Iconos modernos
- **date-fns** - Manejo de fechas

---

## 📋 Requisitos Previos

- **Node.js** 18+ ([Descargar](https://nodejs.org/))
- **npm** 9+ (incluido con Node.js)
- **Backend** corriendo en `http://localhost:3000`

---

## ⚡ Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

El archivo `.env` ya está configurado con los valores correctos:

```env
VITE_API_URL=http://localhost:3000/api
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build            # Compila para producción
npm run preview          # Previsualiza build de producción

# Linting
npm run lint             # Ejecuta ESLint
```

---

## 📱 Páginas Disponibles

### Públicas (sin autenticación)
- `/login` - Iniciar sesión
- `/register` - Registrar usuario y organización

### Privadas (requieren autenticación)
- `/dashboard` - Vista principal con estadísticas
- `/tasks` - Gestión completa de tareas
- `/organization` - Información y miembros de la organización
- `/profile` - Perfil del usuario

---

## 🎨 Colores del Diseño

```css
Azul Principal: #5B5FED
Azul Hover: #4A4DD4
Lavanda Claro: #E8E9FF
Lavanda Suave: #C7CBFF
Fondo: #F7F8FC
Cards: #FFFFFF
Texto Oscuro: #1A1D1F
Texto Medio: #6F767E
Bordes: #E6E8EC
```

---

## 📂 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/              # Sidebar, Navbar, Layout
│   ├── tasks/               # TaskCard, TaskModal, TaskFilters
│   ├── dashboard/           # MetricCard
│   ├── organization/        # (futuro)
│   └── ui/                  # Button, Card, Badge, Input, etc.
├── pages/
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Organization.tsx
│   └── Profile.tsx
├── services/
│   ├── api.ts               # Configuración Axios
│   ├── auth.service.ts
│   ├── task.service.ts
│   └── organization.service.ts
├── store/
│   └── authStore.ts         # Estado global (Zustand)
├── types/
│   └── index.ts             # Tipos TypeScript
├── App.tsx                  # Routing principal
└── main.tsx                 # Punto de entrada
```

---

## 🔌 Conexión con el Backend

El frontend se conecta al backend mediante Axios con las siguientes configuraciones:

### URL Base
```typescript
const API_URL = 'http://localhost:3000/api';
```

### Headers Automáticos
- `Content-Type: application/json`
- `Authorization: Bearer {token}` (añadido automáticamente si existe)

### Interceptores

**Request**: Añade automáticamente el token JWT desde localStorage

**Response**: Maneja errores globalmente:
- 401 → Redirige a login
- 403 → Muestra error de permisos
- 404 → Muestra error de recurso no encontrado
- 500 → Muestra error de servidor

---

## 🔐 Autenticación

### Flujo de Login/Register

1. Usuario envía credenciales
2. Backend devuelve `{ token, user, organization }`
3. Frontend guarda en `localStorage`:
   - `token` → JWT
   - `user` → Información del usuario
4. Zustand actualiza estado global
5. Axios añade token a requests automáticamente

### Protección de Rutas

- Rutas públicas: `/login`, `/register`
- Rutas protegidas: Requieren token válido
- Redirección automática si no autenticado

---

## 🎯 Componentes Principales

### UI Components

| Componente | Descripción |
|------------|-------------|
| `Button` | Botón con variantes (primary, secondary, outline, ghost, danger) |
| `Card` | Contenedor con sombra y bordes redondeados |
| `Badge` | Etiqueta de estado/prioridad con colores |
| `Input` | Input con label y manejo de errores |
| `Textarea` | Textarea con label y manejo de errores |
| `Select` | Dropdown con opciones |
| `Modal` | Modal overlay para formularios |
| `Loading` | Indicador de carga con spinner |
| `EmptyState` | Estado vacío con icono y acción |

### Task Components

| Componente | Descripción |
|------------|-------------|
| `TaskCard` | Card de tarea con progress bar |
| `TaskModal` | Modal para crear/editar tareas |
| `TaskFilters` | Barra de filtros (estado, prioridad, búsqueda) |

### Layout Components

| Componente | Descripción |
|------------|-------------|
| `Sidebar` | Navegación lateral con Help Center widget |
| `Navbar` | Barra superior con notificaciones y usuario |
| `Layout` | Wrapper que combina Sidebar + Navbar |

---

## 🔍 Características Avanzadas

### Filtros de Tareas

- **Por estado**: PENDING, IN_PROGRESS, COMPLETED
- **Por prioridad**: LOW, MEDIUM, HIGH
- **Por usuario asignado**: Dropdown de miembros
- **Por texto**: Búsqueda en título y descripción

### Progress Bar Inteligente

Calcula automáticamente el progreso según el estado:
- PENDING → 20%
- IN_PROGRESS → 60%
- COMPLETED → 100%

### Toast Notifications

Feedback visual automático para:
- ✅ Operaciones exitosas
- ❌ Errores de validación
- ⚠️ Errores de servidor
- ℹ️ Información general

---

## 🐛 Troubleshooting

### Error: Cannot connect to backend

**Causa**: Backend no está corriendo

**Solución**:
```bash
# Ir a carpeta del backend
cd ../task-manager-api-FINAL
npm run dev
```

### Error: CORS

**Causa**: Backend no permite requests desde `http://localhost:5173`

**Solución**: Verificar que el backend tenga en `.env`:
```env
FRONTEND_URL=http://localhost:5173
```

### Error: 401 Unauthorized

**Causa**: Token expirado o inválido

**Solución**: Logout y login de nuevo

### Estilos no se aplican

**Causa**: Tailwind CSS no compiló

**Solución**:
```bash
# Reinstalar y rebuild
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 📦 Build para Producción

```bash
# 1. Compilar
npm run build

# 2. Archivos compilados en: /dist

# 3. Previsualizar
npm run preview
```

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Importar repositorio
3. Configurar variables de entorno:
   - `VITE_API_URL=https://tu-backend.com/api`
4. Deploy automático

### Netlify

1. Crear cuenta en [Netlify](https://netlify.com)
2. Conectar repositorio
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Environment variables:
   - `VITE_API_URL=https://tu-backend.com/api`

---

## 🎯 Próximas Mejoras

- [ ] Vista Kanban (drag & drop)
- [ ] Dark mode
- [ ] Búsqueda avanzada con filtros múltiples
- [ ] Comentarios en tareas
- [ ] Adjuntos en tareas
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Exportar tareas a CSV/PDF
- [ ] Calendario de tareas
- [ ] Gráficos avanzados en dashboard
- [ ] Modo offline con PWA

---

## 📝 Licencia

MIT

---

## 👥 Autor

Proyecto creado para gestión de tareas en pequeñas empresas y equipos.

---

## 📞 Soporte

Si encuentras algún problema:

1. Revisa la sección de Troubleshooting
2. Verifica que el backend esté corriendo
3. Revisa la consola del navegador para errores

---

**¡Frontend listo para usar!** 🎉

Inicia sesión con una cuenta nueva o registra tu primera organización.
