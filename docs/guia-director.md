# Guía para el Director — Panel de Administración
**Match Point Lima Norte**

Bienvenido/a al manual de uso de tu nueva página web. Este documento está escrito en un lenguaje sencillo y directo, pensado para que administres todo el contenido de la academia sin depender de programadores.

---

## 1. Cómo ingresar al Panel de Administración

1. Abre tu navegador (Google Chrome, Safari, etc.) e ingresa a:  
   👉 **`https://tudominio.com/admin`** (o `http://localhost:3000/admin` en desarrollo).
2. Escribe tu correo y contraseña:
   - **Usuario**: `adriansalazar2497@gmail.com`
   - **Contraseña inicial**: `MatchPoint2026!`
3. Haz clic en **"Iniciar sesión"**.

> 💡 **Recomendación de seguridad**: Apenas ingreses por primera vez, ve a **Usuarios**, haz clic en tu nombre y cambia tu contraseña por una personal y segura.

### ¿Olvidaste tu contraseña?
En la pantalla de ingreso encontrarás el enlace **"¿Olvidaste tu contraseña?"**. Escribe tu correo y el sistema te enviará un enlace seguro con validez de 1 hora para crear una nueva clave.

---

## 2. Visión General del Menú

Al entrar, verás una barra lateral dividida en secciones claras:

- **Sitio**:
  - ⚙️ **Configuración del sitio**: Textos de portada, teléfonos, números de WhatsApp, dirección, redes sociales, logo y colores.
  - 📐 **Orden y visibilidad de secciones**: Qué bloques se muestran en la página y en qué orden.
- **Contenido**:
  - 🎾 **Niveles y horarios**: Clases (Principiantes, Intermedios) y días/horas.
  - 🏆 **Torneos**: Próximas competencias, inscripciones y resultados anteriores.
  - 👟 **Entrenadores**: Fotos, nombres y trayectoria del equipo técnico.
  - 📸 **Galería**: Fotos de entrenamientos, comunidad e instalaciones.
  - 💬 **Testimonios**: Opiniones de alumnos y padres de familia.
  - 🏷️ **Planes y precios**: Tarifas de clases (opcional).
  - ❓ **Preguntas frecuentes**: Respuestas a dudas típicas de nuevos alumnos.
  - 📁 **Archivos (fotos y videos)**: Biblioteca con todas las imágenes subidas.
- **Administración**:
  - 👤 **Usuarios**: Crear cuentas para otros profesores o administradores.
  - ✉️ **Mensajes de contacto**: Bandeja con las consultas enviadas desde el formulario web.

---

## 3. Cómo editar los Datos Principales (Teléfonos, WhatsApp, Textos)

1. En el menú izquierdo, haz clic en **"Configuración del sitio"** (dentro del grupo *Sitio*).
2. Verás pestañas ordenadas:
   - **Inicio (portada)**:
     - *Título principal*: Texto llamativo del Hero. Puedes colocar palabras entre `[[dobles corchetes]]` (ejemplo: `Impulsa tu tenis en [[Lima Norte]]`) para que aparezcan automáticamente resaltadas con el color amarillo deportivo.
     - *Foto de fondo*: Haz clic en la foto para cambiarla por una nueva de la academia.
   - **Quiénes somos**:
     - Edita la historia y misión de la academia. Puedes modificar o agregar los puntos destacados (*Talento*, *Disciplina*, *Pasión*).
   - **Contacto y ubicación**:
     - *Teléfonos*: Agrega o actualiza los números de llamada directa.
     - *WhatsApp*: Número en formato internacional sin espacios (ejemplo: `51916727470`).
     - *Mensaje prellenado*: El texto que le aparecerá al alumno listo para enviar cuando toque el botón de WhatsApp.
     - *Dirección y referencia*: Especifica cómo llegar a Fuertes Hoyos.
   - **Redes sociales**:
     - Enlaces a tus perfiles de TikTok, Instagram, Facebook y YouTube.
   - **Marca (logo y colores)**:
     - Cambia el logo o el color principal (azul marino) y de acento (amarillo pelota).
3. Haz clic en **"Guardar"** y luego en **"Publicar"** arriba a la derecha. Los cambios se reflejarán de inmediato en la web.

---

## 4. Cómo actualizar Horarios y Niveles de Clase

1. En el menú izquierdo, entra a **"Niveles y horarios"**.
2. Haz clic sobre el nivel que deseas modificar (ej. **Principiantes**).
3. En la sección **Horarios**:
   - Puedes cambiar los días (Sábados, Domingos, etc.).
   - Puedes ajustar las horas en formato 24 horas (ej. `09:00` a `10:30`).
   - Puedes presionar **"Añadir Horario"** si abres un nuevo turno.
4. En **Aviso de cupos**, puedes escribir textos como *"¡Últimos 3 cupos!"* para incentivar que las personas se inscriban rápido.
5. Haz clic en **"Publicar"**.

---

## 5. Cómo publicar un Torneo nuevo o registrar Ganadores

### Para publicar un nuevo torneo:
1. Ve a **"Torneos"** → haz clic en **"Crear nuevo"**.
2. Llena los datos básicos:
   - **Nombre**: ej. *Torneo Primavera 2026*.
   - **Estado**: selecciona **Próximo**.
   - **Fecha**: selecciona la fecha de inicio o escribe un texto como *"Próximamente"*.
   - **Categorías**: ej. *Principiantes, Intermedios*.
   - **Afiche o foto**: sube el afiche promocional.
   - **Costo**: ej. *S/ 50 por jugador*.
   - **Inscripción**: elige **"Por WhatsApp"** (creará un enlace directo con mensaje personalizado) o **"Enlace externo"**.
3. Haz clic en **"Publicar"**. Aparecerá de inmediato tanto en la página principal como en la sección `/torneos`.

### Cuando el torneo finalice (subir resultados):
1. Entra al torneo que ya se jugó.
2. Cambia el **Estado** a **"Finalizado (mostrar en resultados)"**.
3. Abre la sección desplegable **"Resultados"**:
   - Agrega por cada categoría el **Campeón**, **Subcampeón** y **Tercer lugar**.
4. En **Fotos del torneo**, puedes subir fotos de la premiación.
5. Haz clic en **"Publicar"**. El torneo se moverá automáticamente al historial de resultados con sus medallas correspondientes.

---

## 6. Cómo subir Fotos a la Galería

1. Entra a **"Galería"** → **"Crear nuevo"**.
2. Sube la foto (intenta que pese menos de 3 MB para que cargue rápido).
3. Escribe un título corto (ej. *Entrenamiento de saques en cancha de arcilla*).
4. Elige una categoría (*Clases*, *Torneos*, *Instalaciones* o *Comunidad*).
5. Guarda los cambios.
6. **Para cambiar el orden de las fotos**: en el listado de Galería, simplemente arrastra la fila de la foto hacia arriba o hacia abajo.

---

## 7. Cómo Ocultar, Mostrar o Reordenar Secciones de la Página Principal

Esta función te da control total sobre qué ve el visitante:

1. Ve a **"Orden y visibilidad de secciones"** (en el grupo *Sitio*).
2. Verás la lista de todas las secciones de la página (*Quiénes somos*, *Niveles*, *Entrenadores*, *Torneos*, *Planes*, etc.).
3. **Para ocultar una sección**: desmarca la casilla **"Mostrar"**. Por ejemplo, la sección **Planes y precios** viene oculta por defecto; si en el futuro deseas publicar tus tarifas, solo marca la casilla "Mostrar" y se activará.
4. **Para reordenar**: arrastra cualquier fila hacia arriba o hacia abajo usando el ícono de los puntos a la izquierda de cada fila.
5. Haz clic en **"Publicar"**. La página principal reorganizará todo instantáneamente.

---

## 8. Vista Previa en Vivo (Live Preview)

Cuando estés editando un Torneo, un Nivel o la Configuración, verás un botón de **"Vista previa"** en la parte superior. Al pulsarlo:
- Se abrirá una ventana dividida con el sitio web a la derecha.
- Podrás ver en tiempo real cómo lucirá tu cambio antes de que los visitantes lo vean en internet.
- Una vez que estés satisfecho, pulsa **"Publicar"**.

---

## 9. Consejos para que la Web siga convirtiendo visitas en alumnos

1. **Atención rápida en WhatsApp**: Los botones de la web llevan directo a tu chat con el mensaje listo. Responder en los primeros 10 minutos duplica la probabilidad de que la persona asista a su clase de prueba.
2. **Fotos reales de alumnos**: Las fotos reales en la cancha de Fuertes Hoyos generan muchísima más confianza que fotos genéricas de internet. Mantén la galería actualizada con fotos de los entrenamientos de los sábados y domingos.
3. **Mantén los horarios al día**: Si cambias la hora de un nivel, actualízala de inmediato en el panel para evitar confusiones con personas que llegan por primera vez.
