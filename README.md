# Match Point Lima Norte — Sitio Web & CMS

Sitio web moderno, rápido y mobile-first para la academia de tenis **Match Point Lima Norte** (Lima, Perú), con panel de administración integrado (**Payload CMS 3**) para que el director pueda editar todo el contenido sin depender de un desarrollador.

---

## 🚀 Stack Tecnológico

- **Frontend & Backend**: [Next.js 15](https://nextjs.org/) (App Router, React 19, TypeScript).
- **CMS Headless**: [Payload CMS 3](https://payloadcms.com/) integrado como monolito en la misma aplicación bajo `/admin`.
- **Base de Datos**: [PostgreSQL 16](https://www.postgresql.org/) con adaptador `@payloadcms/db-postgres`.
- **Almacenamiento de Imágenes**: [Cloudflare R2](https://www.cloudflare.com/products/r2/) (API compatible con S3) con `@payloadcms/storage-s3` y optimización con `next/image` (WebP/AVIF).
- **Estilos & Diseño**: Tailwind CSS v4, tipografía deportiva *Outfit* + *Inter*, diseño mobile-first y paleta oficial derivada del logo (`#0E2F55` azul marino y `#DBDB11` amarillo pelota).
- **Despliegue**: [Railway](https://railway.com/) (Next.js + Postgres administrado).

---

## 📁 Estructura del Proyecto

```
matchpoint-lima-norte/
├── docs/
│   ├── guia-director.md          # Manual de uso para el director (sin tecnicismos)
│   └── costos.md                 # Desglose de costos mensuales de hosting
├── public/                       # Favicons, logo oficial, imágenes fallback
├── scripts/
│   └── prepare-logo.ts           # Script para optimizar y derivar recursos del logo
├── src/
│   ├── access/                   # Control de acceso y roles (admin vs editor)
│   ├── app/
│   │   ├── (frontend)/           # Web pública (landing, /torneos, /torneos/[slug])
│   │   │   ├── layout.tsx        # Layout con fonts, metadata SEO y JSON-LD
│   │   │   ├── page.tsx          # Landing dinámica según el orden del CMS
│   │   │   ├── torneos/          # Página general de torneos y slug individual
│   │   │   └── styles.css        # Sistema de estilos y tokens Tailwind v4
│   │   ├── (payload)/            # Panel administrativo (/admin) y rutas de Payload
│   │   ├── api/
│   │   │   ├── contacto/         # Receptor de formulario con honeypot y aviso por correo
│   │   │   ├── preview/          # Activador de modo borrador (Live Preview)
│   │   │   ├── exit-preview/     # Desactivador de Live Preview
│   │   │   └── salud/            # Healthcheck para Railway
│   │   ├── robots.ts             # robots.txt (bloquea /admin)
│   │   └── sitemap.ts            # sitemap.xml dinámico con torneos
│   ├── collections/              # Colecciones de Payload (Torneos, Niveles, etc.)
│   ├── components/               # Componentes UI y secciones de la landing
│   ├── globals/                  # Configuracion del sitio y orden de Landing
│   ├── hooks/                    # Revalidación de caché bajo demanda
│   ├── lib/                      # Cliente Payload, tipos y funciones auxiliares
│   └── seed/                     # Script de seed con contenido inicial
├── docker-compose.yml            # Postgres local para desarrollo
├── next.config.ts
├── package.json
├── payload.config.ts             # Configuración central de Payload CMS
└── railway.json                  # Configuración de despliegue en Railway
```

---

## 💻 Instalación y Desarrollo Local

### Prerrequisitos
- **Node.js** v20.9+ o v22+
- **Docker Desktop** (opcional, para levantar PostgreSQL en un comando) o una base de datos Postgres local

### 1. Clonar e instalar dependencias
```bash
git clone <url-del-repositorio>
cd matchpoint-lima-norte
npm install
```

### 2. Configurar variables de entorno
Copia el archivo de ejemplo:
```bash
cp .env.example .env
```
Genera un secreto aleatorio para `PAYLOAD_SECRET`:
```bash
# En PowerShell:
-join ((1..48) | % { '{0:x}' -f (Get-Random -Max 16) })
```

### 3. Levantar PostgreSQL
Si tienes Docker:
```bash
docker compose up -d
```
O configura tu Postgres propio en `DATABASE_URL=postgresql://usuario:clave@localhost:5432/nombre_bd`.

### 4. Sembrar el contenido inicial (Seed)
Ejecuta el script para crear el usuario administrador (`adriansalazar2497@gmail.com`), las fotos de muestra, los niveles (Principiantes e Intermedios), los torneos y la configuración global:
```bash
npm run seed
```
> **Credenciales iniciales**:
> - **Email**: `adriansalazar2497@gmail.com`
> - **Contraseña**: `MatchPoint2026!` (cámbiala al iniciar sesión en `/admin`)

### 5. Iniciar servidor de desarrollo
```bash
npm run dev
```
- **Web pública**: [http://localhost:3000](http://localhost:3000)
- **Panel de control**: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## ☁️ Despliegue en Railway

Railway permite desplegar la app Next.js y la base de datos PostgreSQL en una sola plataforma con alta disponibilidad y HTTPS automático.

### Paso 1: Crear proyecto en Railway
1. Entra a [railway.com](https://railway.com/) e inicia sesión con GitHub.
2. Haz clic en **"New Project"** → **"Provision PostgreSQL"**.
3. En el mismo proyecto, haz clic en **"+ New"** → **"GitHub Repo"** y selecciona el repositorio de `matchpoint-lima-norte`.

### Paso 2: Configurar Variables de Entorno en el servicio Web
En la pestaña **Variables** del servicio de Next.js, añade:

| Variable | Valor recomendado / Referencia |
|---|---|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` *(referencia automática de Railway)* |
| `PAYLOAD_SECRET` | *(cadena aleatoria de 32+ caracteres)* |
| `NEXT_PUBLIC_SITE_URL` | `https://${{RAILWAY_PUBLIC_DOMAIN}}` *(actualizar cuando conectes dominio)* |
| `CONTACT_EMAIL_TO` | `adriansalazar2497@gmail.com` |
| `RESEND_API_KEY` | *(tu API key de resend.com para correos)* |
| `EMAIL_FROM` | `onboarding@resend.dev` *(o tu correo con dominio verificado)* |
| `EMAIL_FROM_NAME` | `Match Point Lima Norte` |
| `SEED_ADMIN_EMAIL` | `adriansalazar2497@gmail.com` |
| `SEED_ADMIN_PASSWORD`| *(tu contraseña segura inicial)* |
| `PAYLOAD_DB_PUSH` | `true` *(sincroniza y crea automáticamente las tablas en la BD)* |

#### Almacenamiento Cloudflare R2 (recomendado para producción):
Crea un bucket en Cloudflare R2 y agrega:
- `S3_BUCKET` = `nombre-de-tu-bucket`
- `S3_ENDPOINT` = `https://<account-id>.r2.cloudflarestorage.com`
- `S3_ACCESS_KEY_ID` = `...`
- `S3_SECRET_ACCESS_KEY` = `...`
- `S3_REGION` = `auto`
- `S3_PUBLIC_URL` = `https://pub-xxxx.r2.dev` *(o tu subdominio r2 personalizado)*

### Paso 3: Generar Dominio y Sembrar
1. En **Settings** → **Networking** → genera un dominio público de Railway (ej. `matchpoint.up.railway.app`).
2. Conéctate a la terminal del servicio en Railway y corre una única vez:
   ```bash
   npm run seed
   ```

---

## 🌐 Conexión de Dominio Propio

Cuando adquieras tu dominio (ej. `matchpointlimanorte.com` o `.pe`):

1. En el dashboard de **Railway**, entra a tu servicio web → **Settings** → **Networking** → **Custom Domains**.
2. Escribe tu dominio (ej. `www.matchpointlimanorte.com`).
3. Railway te indicará un registro **CNAME** o **A** para configurar en tu registrador de dominio (Cloudflare, GoDaddy, Namecheap o NIC.pe):
   - **Tipo**: `CNAME`
   - **Nombre**: `www` (o `@` si es en Cloudflare)
   - **Valor**: el proporcionado por Railway (ej. `xxxx.up.railway.app`)
4. Una vez validado el SSL por Railway, actualiza en las variables de entorno de Railway:
   - `NEXT_PUBLIC_SITE_URL` = `https://www.matchpointlimanorte.com`
5. ¡Listo! Todo el SEO, Open Graph y cookies se adaptarán automáticamente al nuevo dominio.

---

## 💾 Backups de la Base de Datos

### 1. Backups automáticos de Railway
Railway realiza respaldos automáticos diarios de la base de datos PostgreSQL accesibles en la pestaña **Backups** del servicio Postgres. Puedes restaurar cualquier punto anterior con un solo clic.

### 2. Backup manual por terminal (`pg_dump`)
Puedes exportar una copia completa en cualquier momento desde tu máquina:
```bash
# Exportar base de datos a archivo .sql:
pg_dump "postgresql://postgres:password@host:port/railway" -F c -b -v -f backup_matchpoint_$(date +%Y%m%d).dump

# Restaurar base de datos desde el archivo:
pg_restore -d "postgresql://postgres:password@host:port/railway" -v backup_matchpoint_20261024.dump
```

---

## 🛠️ Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `localhost:3000`.
- `npm run build`: Compila la aplicación Next.js y el bundle de Payload para producción.
- `npm run start`: Inicia el servidor de producción.
- `npm run seed`: Siembra el contenido inicial e imágenes en la base de datos.
- `npm run typecheck`: Valida tipos de TypeScript en todo el proyecto.
- `npm run generate:types`: Regenera los tipos de TypeScript de Payload (`src/payload-types.ts`).
- `npm run generate:importmap`: Regenera el mapa de componentes del panel de administración.
- `npm run assets:logo`: Optimiza el logo original, deriva transparencias y calcula la paleta.
