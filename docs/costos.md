# Estimado de Costos Mensuales de Hosting
**Match Point Lima Norte**

Este documento detalla los costos reales proyectados para mantener el sitio web y el panel de administración operando las 24 horas del día, los 365 días del año.

---

## 1. Resumen de Costos Estimados

| Servicio | Proveedor | Nivel de Servicio | Costo Mensual Estimado |
|---|---|---|:---:|
| **Servidor Web (Next.js + Payload CMS)** | Railway | Plan Hobby / Developer (CPU & RAM bajo demanda) | **US$ 4.00 – 6.00** |
| **Base de Datos (PostgreSQL 16)** | Railway | Base de datos administrada con backups automáticos | **US$ 2.00 – 4.00** |
| **Almacenamiento de Fotos y Videos** | Cloudflare R2 | Hasta 10 GB de almacenamiento gratuito, sin cobro por transferencia | **US$ 0.00** |
| **Envío de Correos (Recuperar clave y avisos)** | Resend | Plan gratuito (hasta 3,000 correos al mes) | **US$ 0.00** |
| **Analítica y Métricas Web** | Google Analytics 4 | Gratuito | **US$ 0.00** |
| **Certificado de Seguridad SSL (HTTPS)** | Railway / Cloudflare | Certificado automático Let's Encrypt | **US$ 0.00** |
| **Dominio Propio (`.com` o `.pe`)** | Namecheap / GoDaddy / NIC.pe | Prorrateado anual (aprox. US$ 12 a 25 al año) | **US$ 1.00 – 2.00** |
| **TOTAL MENSUAL ESTIMADO** | | | **≈ US$ 7.00 – 12.00 / mes** |

*(Equivalente aproximado en moneda local: entre S/ 26 y S/ 45 soles al mes).*

---

## 2. Detalle por Servicio y Justificación

### A. Railway (Aplicación + PostgreSQL)
- **Por qué**: Permite correr en un solo entorno aislado la aplicación web, el panel de control y la base de datos PostgreSQL con alta disponibilidad. No requiere administrar Linux ni configurar Nginx manualmente.
- **Facturación**: Railway cobra únicamente por los recursos de CPU y memoria RAM que consume la aplicación (facturación por segundo).
- **Consumo proyectado**: Para una academia con picos de tráfico desde Instagram/TikTok y administración semanal del director, la memoria RAM requerida ronda entre 300MB y 512MB, resultando en un costo de entre US$ 6.00 y US$ 10.00 mensuales.
- **Crédito**: Railway suele incluir créditos de cortesía en el primer mes de uso.

### B. Cloudflare R2 (Imágenes y Afiches)
- **Por qué**: A diferencia de Amazon S3 tradicional, Cloudflare R2 **no cobra comisiones por transferencia de datos (egreso gratuito)**. Esto significa que si un afiche de torneo se hace viral en TikTok y miles de personas lo descargan, no habrá sorpresas en la factura.
- **Plan gratuito**: Incluye 10 Gigabytes de almacenamiento al mes (suficiente para más de 10,000 fotos optimizadas). Costo mensual: **US$ 0.00**.

### C. Resend (Correos Transaccionales)
- **Por qué**: Garantiza que los correos de recuperación de contraseña y las notificaciones del formulario de contacto no caigan en la carpeta de spam.
- **Plan gratuito**: Incluye hasta 3,000 correos electrónicos al mes y 100 correos por día. Para el flujo de contacto de una academia de tenis, el costo se mantendrá en **US$ 0.00**.

### D. Google Analytics 4
- **Por qué**: Mide las fuentes de tráfico (cuántas personas llegaron de Instagram, cuántas de TikTok, cuántas de Google) y contabiliza cuántas personas hicieron clic en el botón de WhatsApp. **100% gratuito sin límite de visitas**.

### E. Dominio Web Propio
- Si eliges un dominio internacional `.com` (ej. `matchpointlimanorte.com`), cuesta aproximadamente **US$ 10 a US$ 14 al año** en registradores como Namecheap o Cloudflare Registrar.
- Si eliges un dominio patrio `.pe` (ej. `matchpoint.pe`), cuesta **S/ 110 al año** en Punto.pe (NIC.pe).
- Ambos se conectan a Railway mediante configuración DNS sin ningún costo adicional.

---

## 3. Comparativa con otras alternativas del mercado

| Proveedor / Opción | Costo Mensual | Ventajas | Desventajas |
|---|:---:|---|---|
| **Arquitectura propuesta (Railway + R2)** | **US$ 7 – 12** | **Todo integrado, base de datos propia, sin comisiones por tráfico, datos 100% bajo control de la academia.** | Requiere configurar variables una sola vez al inicio. |
| **Vercel + Supabase + AWS S3** | US$ 25 – 45 | Fácil configuración inicial. | Servicios dispersos en 3 plataformas distintas, cobro por exceso de funciones y costos de egreso en AWS. |
| **Wix / Squarespace** | US$ 16 – 29 | Constructor visual básico. | No tiene base de datos relacional para torneos con llaves ni cuadro de honor, código propietario, no exportable. |
| **Google Sites (anterior)** | US$ 0 | Gratuito. | Muy limitado visualmente, sin base de datos, sin optimización mobile real, no permite panel dinámico para torneos ni personalización avanzada. |

---

## 4. Estrategia de Control de Gastos en Railway

Para garantizar que nunca se sobrepase el presupuesto:
1. En el panel de Railway, ve a **Account Settings** → **Billing** → **Usage Limits**.
2. Configura un límite estricto de gasto mensual (por ejemplo, **US$ 15.00**).
3. Si el consumo llegara a acercarse a ese monto, Railway te enviará una alerta automática por correo antes de aplicar cualquier cargo no deseado.
