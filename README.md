# Project Decameron App(frontend)

Interfaz web para el sistema de gestión hotelera Decameron. Consume la API REST `api-decameron` y permite realizar el CRUD completo de hoteles y la gestión de configuraciones de habitación, aplicando en el cliente las mismas reglas de negocio que el backend.

---

#Link
https://decameronapp.vercel.app/

## Stack tecnologico

| Capa | Tecnologia | Version |
|---|---|---|
| Lenguaje | TypeScript | ^5.8.3 |
| Framework UI | React | ^18.3.1 |
| Bundler | Vite (plugin React SWC) | ^5.4.19 |
| Estilos | Tailwind CSS | ^3.4.17 |
| Componentes base | shadcn/ui (Radix UI) | varias |
| Iconos | Lucide React | ^0.462.0 |
| Routing | React Router DOM | ^6.30.1 |
| Estado servidor | TanStack Query | ^5.83.0 |
| Formularios | React Hook Form | ^7.61.1 |
| Validacion de esquemas | Zod | ^3.25.76 |
| Notificaciones | Sonner + shadcn/ui Toast | ^1.7.4 |
| Temas | next-themes | ^0.3.0 |
| Testing | Vitest + Testing Library | ^3.2.4 / ^16.0.0 |
| Linter | ESLint + typescript-eslint | ^9.32.0 |
| Fuentes tipograficas | Outfit (display), DM Sans (body) | — |

---

## Estructura del proyecto

```
src/
  App.tsx                      # Raiz: providers globales y declaracion de rutas
  main.tsx                     # Punto de entrada, monta la app en el DOM
  index.css                    # Variables CSS / tokens de diseno (modo claro)
  App.css                      # Animaciones y estilos globales adicionales
  vite-env.d.ts                # Tipos de variables de entorno Vite

  pages/
    Index.tsx                  # Pagina principal — maquina de estados de vistas
    NotFound.tsx               # Pagina 404

  components/
    Layout.tsx                 # Header con branding + contenedor principal
    HotelTable.tsx             # Tabla de hoteles con acciones
    HotelForm.tsx              # Formulario crear/editar hotel
    RoomConfigPanel.tsx        # Panel de configuracion de habitaciones
    ui/                        # Componentes shadcn/ui (Radix + Tailwind)

  services/
    api.ts                     # Capa de acceso a la API REST

  types/
    hotel.ts                   # Interfaces TypeScript + constantes de dominio

  hooks/
    use-toast.ts               # Hook de notificaciones
    use-mobile.tsx             # Hook de deteccion de viewport movil

  lib/
    utils.ts                   # Utilidad cn() para clases Tailwind

  test/
    setup.ts                   # Configuracion global de Testing Library
    example.test.ts            # Test de ejemplo
```

---

## Arquitectura de vistas

La aplicacion es una SPA de una sola ruta (`/`). La navegacion entre pantallas se gestiona mediante una maquina de estados local en `Index.tsx` con tres vistas posibles:

| Estado (`View`) | Descripcion |
|---|---|
| `list` | Tabla con todos los hoteles registrados |
| `form` | Formulario para crear o editar un hotel |
| `rooms` | Panel de configuracion de habitaciones del hotel seleccionado |

No se usa routing adicional para las sub-vistas. El estado `selectedHotel` determina si el formulario opera en modo creacion o edicion.

---

## Capa de servicio (`src/services/api.ts`)

Toda la comunicacion con el backend pasa por una funcion generica `request<T>` basada en `fetch`. Esta funcion lee la URL base desde `VITE_API_BASE_URL`, agrega el header `Content-Type: application/json` y lanza una excepcion si la respuesta HTTP no es exitosa, extrayendo el mensaje de error del cuerpo JSON.

Funciones exportadas:

| Funcion | Metodo | Endpoint |
|---|---|---|
| `getHotels()` | GET | `/hotels` |
| `getHotel(id)` | GET | `/hotels/:id` |
| `createHotel(data)` | POST | `/hotels` |
| `updateHotel(id, data)` | PUT | `/hotels/:id` |
| `deleteHotel(id)` | DELETE | `/hotels/:id` |
| `getRoomConfigurations(hotelId)` | GET | `/hotels/:id/rooms` |
| `addRoomConfiguration(hotelId, data)` | POST | `/hotels/:id/rooms` |
| `deleteRoomConfiguration(hotelId, roomId)` | DELETE | `/hotels/:id/rooms/:roomId` |
| `getRoomTypes()` | GET | `/catalogs/room-types` |
| `getAccommodations()` | GET | `/catalogs/accommodations` |

---

## Tipos de dominio (`src/types/hotel.ts`)

El archivo centraliza los contratos de datos y las constantes de negocio que el frontend replica del backend.

```typescript
// Combinaciones validas tipo -> acomodaciones
export const VALID_ACCOMMODATIONS: Record<RoomType, AccommodationType[]> = {
  'Estandar': ['Sencilla', 'Doble'],
  'Junior':   ['Triple', 'Cuadruple'],
  'Suite':    ['Sencilla', 'Doble', 'Triple'],
};
```

Interfaces principales: `Hotel`, `HotelPayload`, `RoomConfiguration`, `RoomConfigurationPayload`, `Room`, `Accommodation`, `ApiResponse<T>`.

---

## Reglas de negocio aplicadas en el cliente

Aunque el backend valida todas las reglas, el frontend las aplica de forma preventiva para evitar llamadas innecesarias a la API:

1. Validacion de campos obligatorios y tipos en `HotelForm` antes de enviar.
2. Deteccion de hotel duplicado (mismo nombre + ciudad) comparando contra la lista en memoria antes de hacer `POST` o `PUT`.
3. En `RoomConfigPanel`, el selector de acomodacion se filtra segun el tipo de habitacion elegido, usando `VALID_ACCOMMODATIONS`.
4. Verificacion de que la cantidad no supere las habitaciones disponibles del hotel.
5. Verificacion de combinacion duplicada (tipo + acomodacion) antes de agregar una nueva configuracion.

---

## Sistema de diseno

El proyecto usa shadcn/ui como capa de componentes, lo que implica que los componentes de `src/components/ui/` son codigo fuente propio (no una dependencia instalada), estilizados con Tailwind y primitivas de Radix UI.

Los tokens de diseno se definen como variables CSS en `src/index.css` siguiendo la convencion HSL de shadcn. Tailwind los consume mediante el alias de colores configurado en `tailwind.config.ts`:

| Token | Proposito |
|---|---|
| `background` / `foreground` | Fondo y texto principal |
| `card` | Fondo de tarjetas y tablas |
| `primary` | Color de accion principal |
| `destructive` | Acciones de eliminacion y errores |
| `success` | Indicadores positivos |
| `muted` | Texto secundario |
| `border` / `input` / `ring` | Bordes e indicadores de foco |

Tipografia: `font-display` usa **Outfit** para titulos y encabezados; `font-body` usa **DM Sans** para el cuerpo del texto.

Animacion global: `animate-fade-in` (opacidad + desplazamiento vertical de 8px, 0.3s ease-out) se aplica en las vistas al montarse.

---

## Variables de entorno

| Variable | Descripcion | Ejemplo |
|---|---|---|
| `VITE_API_BASE_URL` | URL base de la API sin barra final | `http://localhost:8000/api` |

Crear un archivo `.env` en la raiz del proyecto:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Para produccion, usar `.env.production` o configurar la variable en la plataforma de despliegue.

---

## Configuracion y puesta en marcha

### Requisitos previos

- Node.js 20 LTS o superior
- npm 10+ (o bun, ya que el repositorio incluye `bun.lockb`)
- La API `api-decameron` corriendo y accesible

### Instalacion

```bash
# 1. Instalar dependencias
npm install
# o con bun:
bun install

# 2. Crear variables de entorno
cp .env.example .env   # si existe, o crear .env manualmente

# 3. Ajustar VITE_API_BASE_URL en .env

# 4. Levantar servidor de desarrollo (puerto 8080)
npm run dev
```

La aplicacion queda disponible en `http://localhost:8080`.

### Otros comandos

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor de desarrollo con HMR |
| `npm run build` | Compilacion de produccion en `dist/` |
| `npm run build:dev` | Compilacion en modo development (sin optimizacion) |
| `npm run preview` | Vista previa del build de produccion |
| `npm run lint` | Analisis estatico con ESLint |
| `npm run test` | Ejecucion de tests con Vitest (modo run) |
| `npm run test:watch` | Ejecucion de tests en modo vigilancia |

---

## Configuracion de Vite

El servidor de desarrollo escucha en el host `::` (IPv4 e IPv6) en el puerto `8080`. El overlay de errores de HMR esta desactivado. El alias `@` apunta a `src/`, lo que permite importaciones absolutas como `@/components/HotelForm`.

Se configura `dedupe` para React y TanStack Query a fin de evitar instancias multiples cuando se comparten dependencias entre modulos.

---

## Testing

Se usa Vitest como runner de tests y Testing Library como utilidad de renderizado de componentes React. La configuracion se encuentra en `vitest.config.ts` y el setup global en `src/test/setup.ts`.

```bash
npm run test
```

---

## Consideraciones de produccion

- Definir `VITE_API_BASE_URL` con la URL de la API en produccion.
- Configurar el servidor web (Nginx, Caddy, etc.) para servir `index.html` en todas las rutas, ya que la aplicacion usa client-side routing.
- El build de produccion genera artefactos estaticos en `dist/` listos para despliegue en cualquier CDN o servidor de archivos estaticos.
- Revisar la politica de CORS en el backend para restringir `allowed_origins` a la URL real del frontend antes de publicar.
