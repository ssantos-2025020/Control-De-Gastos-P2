# Legatus – Control de Gastos

Aplicación web para la administración personal de finanzas: registro y seguimiento de **ingresos**, control de **gastos**, **presupuestos** por categoría, **categorías**, **reportes** y administración de **usuarios**.

Cuenta con un **backend** de API REST (Express + TypeScript + PostgreSQL) y un **frontend** (Angular 18) con diseño responsivo, autenticación con JWT y carrusel de sesión.

## Credenciales

- **Correo:** `admin@controlgastos.com`
- **Contraseña:** `Admin123!`

## Tecnologías

| Capa | Tecnologías |
| --- | --- |
| Backend | Node.js, Express, TypeScript, PostgreSQL (`pg`), bcrypt, jsonwebtoken |
| Frontend | Angular 18 (standalone, signals), Chart.js (`ng2-charts`), instrucciones de Lucide |
| Monorepo | PNPM workspaces (`frontend/` y `backend/` en la raíz) |

## Estructura

```
backend/   Express + TypeScript + PostgreSQL (puerto 3100)
frontend/  Angular 18 (puerto 4200)
```

## Instalación

Requisitos: Node.js 20+, PNPM 9+ y PostgreSQL con la base `control_gastos` creada.

```bash
# Backend (puerto 3100)
cd backend
pnpm install

# Frontend (puerto 4200)
cd frontend
pnpm install
```

## Ejecución

```bash
# Backend (puerto 3100)
cd backend
pnpm dev

# Frontend (puerto 4200)
cd frontend
pnpm start
```

## Configuración (backend/.env)

El backend requiere las siguientes variables en `backend/.env`:

```
PORT=3100
DATABASE_URL="postgresql://postgres:admin@localhost:5432/control_gastos?schema=public"
JWT_SECRET="..."
JWT_EXPIRES_IN="3h"
ADMIN_EMAIL="admin@controlgastos.com"
ADMIN_PASSWORD="Admin123!"
ADMIN_NOMBRE="Administrador"
```

La sesión expira según `JWT_EXPIRES_IN`. Antes de que caduque, el frontend muestra un aviso para extenderla; si no se responde, cierra la sesión automáticamente.

## Estado actual de los módulos

Funcionales:

- **Login / Autenticación**
- **Dashboard** — resumen de evolución, gastos por categoría, presupuestos y movimientos recientes
- **Ingresos** — registro, edición y paginación de ingresos
- **Configuración** — perfil y moneda

Pendientes (se muestran como "Próximamente"):

- Gastos
- Movimientos
- Presupuestos (detalle)
- Categorías (gestión)
- Reportes
- Usuarios (administración)

## Flujo de trabajo en Git

El proyecto se desarrolla con **Git Flow simplificado**:

- `main` — rama principal, solo recibe el estado inicial del proyecto.
- `develop` — rama de integración; aquí se fusionan las entregas mediante *pull requests*.
- `ssantos-2025020` — rama de trabajo donde se realizan todos los commits de las entregas.

El **commit inicial** (`chore: estado inicial del proyecto`) se sube **directo** a `ssantos-2025020` **sin pull request**: es la base de partida del proyecto, no una entrega de funcionalidad.

A partir del primer commit de tipo **`feat`**, el flujo es estricto y se repite **uno a la vez** para cada commit:

```
commit (feat) → push → pull request (ssantos-2025020 → develop) → merge
```

El siguiente commit solo se crea después de que el `pull request` anterior quedó mergeado. Nunca se agrupan dos o más commits de funcionalidad en un mismo `pull request`, ni se adelantan commits antes de cerrar el anterior.

Commits del proyecto:

1. `chore: estado inicial del proyecto` — subido directo a `ssantos-2025020`, sin pull request.
2. `feat: agrega tarjetas de resumen del dashboard` — Vía pull request.
3. `feat: implementa gráfico de evolución de gastos` — Vía pull request.
4. `feat: agrega paneles de resumen financiero y presupuestos` — Vía pull request.
5. `feat: agrega tarjetas y filtros de ingresos` — Vía pull request.
6. `feat: implementa tabla y modal de ingresos` — Vía pull request.
7. `feat: agrega paginación y ajustes finales de ingresos` — Vía pull request.