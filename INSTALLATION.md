# 🚀 Instalación Rápida - Frontend

## ⚡ 3 Minutos para Arrancar

### Paso 1: Instalar Dependencias (2 min)

```bash
npm install
```

Esto instalará:
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Zustand
- Y todas las dependencias necesarias (~241 paquetes)

### Paso 2: Verificar Backend (30 seg)

El frontend necesita que el backend esté corriendo.

**Abrir nueva terminal y ejecutar:**

```bash
cd ../task-manager-api-FINAL
npm run dev
```

Deberías ver:
```
╔═══════════════════════════════╗
║  🚀 Task Manager API          ║
║  Status: Running              ║
║  Port: 3000                   ║
╚═══════════════════════════════╝
```

### Paso 3: Iniciar Frontend (30 seg)

**Volver a la terminal del frontend:**

```bash
npm run dev
```

Deberías ver:
```
VITE v5.0.11  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### ✅ ¡Listo!

Abre tu navegador en: **http://localhost:5173**

---

## 🎯 Primeros Pasos

### 1. Registrarse

1. Click en "Regístrate"
2. Completa el formulario:
   - Nombre
   - Email
   - Contraseña
   - Nombre de tu Organización
3. Click en "Crear Cuenta"
4. ✅ Serás redirigido al Dashboard

### 2. Crear Primera Tarea

1. Ve a "Tasks" en el sidebar
2. Click en "Nueva Tarea"
3. Completa:
   - Título
   - Descripción (opcional)
   - Estado
   - Prioridad
   - Fecha límite (opcional)
4. Click en "Crear Tarea"
5. ✅ Tu primera tarea aparecerá en el grid

### 3. Invitar Miembros (Solo ADMIN)

1. Ve a "Organization" en el sidebar
2. Click en "Invitar Miembro"
3. Completa:
   - Nombre
   - Email
   - Rol (ADMIN o MEMBER)
4. Click en "Invitar"
5. ✅ Se generará una contraseña temporal
6. Compártela con el nuevo miembro

---

## 🐛 Problemas Comunes

### ❌ "Cannot connect to backend"

**Solución**: Asegúrate de que el backend está corriendo en puerto 3000

```bash
# En otra terminal
cd ../task-manager-api-FINAL
npm run dev
```

### ❌ "Error de instalación de npm"

**Solución**: Limpia cache y reinstala

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### ❌ "Puerto 5173 ocupado"

**Solución**: Cambia el puerto en `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    port: 5174, // Cambiar aquí
  },
})
```

---

## 📝 Estructura Rápida

```
task-manager-frontend/
├── src/
│   ├── components/    # Componentes reutilizables
│   ├── pages/         # Páginas de la app
│   ├── services/      # Llamadas API
│   ├── store/         # Estado global
│   └── types/         # Tipos TypeScript
├── .env               # Configuración
└── package.json       # Dependencias
```

---

## 🎨 Lo Que Verás

### Login/Register
- Card blanco centrado
- Logo de Task Manager
- Formularios validados

### Dashboard
- 4 cards con métricas
- Tareas recientes
- Tareas de alta prioridad

### Tasks
- Grid de 3 columnas
- Filtros por estado/prioridad
- Búsqueda por texto
- Progress bars en cada card

### Organization
- Info de organización
- Lista de miembros con roles
- Botón para invitar (solo ADMIN)

### Profile
- Info del usuario
- Badge de rol
- Permisos (si es ADMIN)

---

## 🔄 Flujo Típico de Uso

1. **Login** → Dashboard (métricas)
2. **Dashboard** → Tasks (crear tarea)
3. **Tasks** → Filtrar y buscar
4. **Organization** → Invitar miembro
5. **Profile** → Ver tu información

---

## ✅ Checklist Post-Instalación

- [ ] npm install completado sin errores
- [ ] Backend corriendo en puerto 3000
- [ ] Frontend corriendo en puerto 5173
- [ ] Navegador abre en http://localhost:5173
- [ ] Puedes ver la página de Login
- [ ] Puedes registrarte sin errores
- [ ] Ves el Dashboard tras registrarte
- [ ] Puedes crear una tarea
- [ ] Los estilos se ven correctos (colores azules/lavanda)

---

**¡Disfruta tu Task Manager!** 🎉

Si todo funciona, ¡ya puedes empezar a gestionar tus tareas!
