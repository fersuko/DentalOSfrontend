# 📖 Manual de Usuario — DentalOS v1.0.0

Bienvenido al manual oficial de **DentalOS**, la plataforma integral de gestión clínica y portal odontológico diseñada para digitalizar, optimizar y potenciar la relación entre dentistas y pacientes.

---

## 🎯 Introducción
DentalOS está diseñado bajo una arquitectura multi-perfil que separa las responsabilidades de administración global (SaaS), gestión clínica cotidiana y el acceso del propio paciente a su información dental.

Este manual detalla las tres consolas principales que componen el sistema, cómo operarlas y cómo sacar el máximo provecho de las herramientas integradas.

---

## 🔑 Credenciales para Pruebas (Demo)
Para explorar las tres caras de la plataforma sin configurar base de datos, utiliza los siguientes accesos:

| Perfil | Correo Electrónico | Contraseña | ¿Qué hace? |
| :--- | :--- | :--- | :--- |
| **Superadministrador** | `superadmin@test.com` | `Test1234!` | Control global de clínicas, suscripciones y métricas del negocio SaaS. |
| **Dentista / Doctor** | `doctor@test.com` | `Test1234!` | Gestión de pacientes, historial clínico y odontogramas interactivos. |
| **Paciente** | `paciente@test.com` | `Test1234!` | Consulta de citas próximas, indicaciones médicas e historial dental en el móvil. |

---

## 🎛️ Consolas y Portales del Sistema

### 1. Panel de Superadministrador (`/superadmin`)
Este panel representa el cerebro comercial del software. Permite a los dueños de la plataforma supervisar el funcionamiento del negocio de suscripción.

#### Características clave:
* **Métricas Globales**: Visualiza ingresos recurrentes mensuales (MRR), total de clínicas activas, tasa de retención y porcentaje de planes cobrados.
* **Control de Clínicas**: Listado de clínicas registradas con estados de pago interactivos. Puedes suspender o reactivar clínicas con un clic.
* **Gestión de Planes**:
  * **Plan Emprendedor**: Para consultorios individuales.
  * **Plan Clínicas (Premium)**: Para sucursales múltiples y soporte avanzado.

---

### 2. Panel del Doctor / Dentista (`/doctor`)
La herramienta de trabajo diario del odontólogo. Diseñada con un entorno oscuro (*dark mode*) de alta gama que reduce la fatiga visual durante largas jornadas en el consultorio.

#### Flujo de Consulta Clínica:
1. **Buscar Paciente**: Ingresa al portal y escribe el nombre del paciente en la barra inteligente.
2. **Abrir Historial**: Haz clic sobre el paciente para cargar su ficha técnica, alergias y notas médicas generales.
3. **El Odontograma Interactivo (FDI)**:
   * **Visualización de Piezas**: Se presenta el mapa completo de 32 dientes numerados bajo la nomenclatura internacional FDI.
   * **Código de Colores Dinámico**:
     * 🟥 **Rojo**: Caries activas.
     * 🟦 **Azul**: Resinas compuestas aplicadas.
     * 🟪 **Morado**: Coronas estéticas de Circonia o Silicato de Litio.
     * 🟨 **Amarillo**: Tratamientos de conducto (Endodoncias).
   * **Agregar un Tratamiento**:
     1. Haz clic sobre cualquier diente en el mapa dental. El diente se iluminará.
     2. Selecciona el **Diagnóstico** (ej. Caries Grado 2) en la lista desplegable.
     3. Selecciona el **Plan de Tratamiento** (ej. Resina Compuesta).
     4. Agrega notas adicionales de la consulta.
     5. Presiona **Registrar Tratamiento**. El color del diente en el mapa se actualizará al instante y se añadirá un punto indicador que representa el tratamiento acumulado.
4. **Repositorio de Radiografías (Nube Fría)**:
   * Arrastra archivos DICOM o imágenes directamente en el panel inferior.
   * Las radiografías quedan asociadas a la ficha para consultas rápidas sin ralentizar el servidor principal.

---

### 3. Portal del Paciente (`/portal`)
Un portal optimizado para dispositivos móviles (*Mobile-First*) que opera como una Aplicación Web Progresiva (PWA).

#### Características clave:
* **Acceso Directo (PWA)**: Si el paciente entra desde su celular, un botón le invitará a "Instalar la aplicación" en su pantalla de inicio de forma directa.
* **Próximas Citas**: Detalle de fecha, hora, consultorio y doctor asignado para su siguiente cita.
* **Indicaciones Médicas Activas**: Recordatorios post-automatizados (ej. evitar colorantes tras profilaxis, instrucciones de enjuague).
* **Mi Mapa Dental**:
  * Versión de consulta del Odontograma del paciente.
  * Permite ver de forma amigable qué dientes han sido tratados y cuáles están saludables.
  * Al hacer clic en un diente tratado, se despliega el historial detallado de lo que le hizo el dentista.
