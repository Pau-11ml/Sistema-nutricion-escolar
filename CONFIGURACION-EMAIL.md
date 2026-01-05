# Configuración de Email para Verificación

Este sistema implementa verificación de email mediante códigos de 6 dígitos enviados por correo electrónico.

## Funcionalidades Implementadas

### 1. Verificación de Email al Registrarse
- Al crear una cuenta, se envía un código de verificación de 6 dígitos al email
- El usuario debe ingresar el código para completar el registro
- El código expira en 10 minutos
- Se puede reenviar el código después de 60 segundos

### 2. Recuperación de Contraseña con Código
- El usuario solicita recuperar su contraseña ingresando su email
- Se envía un código de verificación de 6 dígitos
- Debe ingresar el código junto con la nueva contraseña
- El código expira en 15 minutos
- Se puede reenviar el código después de 60 segundos

## Modo Desarrollo (Actual)

En este momento, el sistema funciona en **modo simulado**:
- ✅ **Solo acepta correos de dominios válidos** (Gmail, Yahoo, Hotmail, Outlook, etc.)
- 🔒 Los códigos NO se muestran en la interfaz (seguridad)
- 📋 Los códigos se muestran en la **consola del navegador** (F12)
- 💾 Los códigos se guardan en `localStorage` para validación
- ⏱️ Los códigos expiran automáticamente
- 🚫 No se aceptan correos falsos o de dominios desconocidos

## Configuración para Producción (EmailJS)

Para enviar emails reales en producción, sigue estos pasos:

### 1. Crear Cuenta en EmailJS

1. Ve a [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea una cuenta gratuita (hasta 200 emails/mes)
3. Verifica tu email

### 2. Configurar Servicio de Email

1. En el dashboard de EmailJS, ve a **Email Services**
2. Haz clic en **Add New Service**
3. Selecciona tu proveedor de email (Gmail, Outlook, etc.)
4. Sigue las instrucciones para conectar tu cuenta
5. Copia el **Service ID** (ejemplo: `service_xxxxxxx`)

### 3. Crear Templates de Email

#### Template de Verificación de Email

1. Ve a **Email Templates** → **Create New Template**
2. Nombre: `Verificación de Email`
3. Template ID: `template_verification`
4. Contenido del template:

```html
Hola {{to_name}},

Gracias por registrarte en Sistema de Nutrición Escolar.

Tu código de verificación es:

{{verification_code}}

Este código expira en {{expires_in}}.

Si no solicitaste este código, puedes ignorar este mensaje.

Saludos,
Sistema de Nutrición Escolar
```

#### Template de Recuperación de Contraseña

1. Crea otro template nuevo
2. Nombre: `Recuperación de Contraseña`
3. Template ID: `template_recovery`
4. Contenido del template:

```html
Hola {{to_name}},

Recibimos una solicitud para restablecer tu contraseña.

Tu código de recuperación es:

{{recovery_code}}

Este código expira en {{expires_in}}.

Si no solicitaste este cambio, ignora este mensaje.

Saludos,
Sistema de Nutrición Escolar
```

### 4. Obtener Public Key

1. En el dashboard, ve a **Account** → **General**
2. Copia tu **Public Key** (ejemplo: `your_public_key`)

### 5. Actualizar Código

Abre el archivo `src/services/emailService.js` y actualiza las constantes:

```javascript
// Reemplazar con tus credenciales reales
const EMAILJS_SERVICE_ID = 'service_xxxxxxx'  // Tu Service ID
const EMAILJS_TEMPLATE_ID_VERIFICATION = 'template_verification'
const EMAILJS_TEMPLATE_ID_RECOVERY = 'template_recovery'
const EMAILJS_PUBLIC_KEY = 'your_public_key'  // Tu Public Key
```

### 6. Activar Envío Real de Emails

En las funciones `sendVerificationEmail` y `sendRecoveryEmail`, descomenta el código de producción y comenta el código de simulación:

```javascript
// Descomentar esto (PRODUCCIÓN):
const templateParams = {
  to_email: email,
  to_name: name,
  verification_code: code,
  expires_in: '10 minutos'
}

const response = await emailjs.send(
  EMAILJS_SERVICE_ID,
  EMAILJS_TEMPLATE_ID_VERIFICATION,
  templateParams
)
return response

// Comentar o eliminar esto (DESARROLLO):
// console.log('📧 Código de verificación enviado:')
// ...código de simulación...
```

## Seguridad

### Variables de Entorno (Recomendado)

Para mayor seguridad, usa variables de entorno en producción:

1. Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_VERIFICATION=template_verification
VITE_EMAILJS_TEMPLATE_RECOVERY=template_recovery
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

2. Actualiza `emailService.js`:

```javascript
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID_VERIFICATION = import.meta.env.VITE_EMAILJS_TEMPLATE_VERIFICATION
const EMAILJS_TEMPLATE_ID_RECOVERY = import.meta.env.VITE_EMAILJS_TEMPLATE_RECOVERY
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY
```

3. Añade `.env` a `.gitignore`

## Validación de Emails

El sistema valida:
- ✅ Formato de email correcto (usuario@dominio.com)
- ✅ Emails únicos (no duplicados en el registro)
- ✅ Códigos de 6 dígitos numéricos
- ✅ Expiración de códigos (10-15 minutos)
- ✅ Límite de reenvíos (60 segundos entre intentos)

## Flujo de Usuario

### Registro:
1. Usuario completa formulario de registro
2. Sistema envía código al email
3. Usuario ingresa código de 6 dígitos
4. Si es correcto, se completa el registro
5. Usuario puede iniciar sesión

### Recuperación de Contraseña:
1. Usuario ingresa su email
2. Sistema envía código al email
3. Usuario ingresa código + nueva contraseña
4. Si es correcto, se actualiza la contraseña
5. Usuario puede iniciar sesión con la nueva contraseña

## Pruebas en Desarrollo

Para probar en desarrollo sin configurar EmailJS:

### ✅ Usar Correos Válidos

**Debes usar un correo de un dominio válido:**
- ✅ Gmail: `usuario@gmail.com`
- ✅ Yahoo: `usuario@yahoo.com`, `usuario@yahoo.es`
- ✅ Hotmail: `usuario@hotmail.com`, `usuario@hotmail.es`
- ✅ Outlook: `usuario@outlook.com`, `usuario@outlook.es`
- ✅ Otros: iCloud, Live, AOL, ProtonMail, Zoho

**NO se aceptan:**
- ❌ `usuario@correofalso.com`
- ❌ `test@test.com`
- ❌ Dominios inventados o desconocidos

### 📋 Ver el Código de Verificación

1. Completa el formulario de registro con un email válido
2. **Abre la consola del navegador** (presiona F12)
3. Busca el mensaje destacado con el código:
   ```
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📧 CÓDIGO DE VERIFICACIÓN
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   📨 Email: usuario@gmail.com
   🔢 Código: 123456
   ⏱️  Expira en: 10 minutos
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   ```
4. Copia el código de 6 dígitos
5. Pégalo en los campos de verificación
6. ¡Listo!

## Troubleshooting

### Los emails no llegan
- Verifica las credenciales de EmailJS
- Revisa la carpeta de spam
- Confirma que el servicio de email está activo
- Verifica los límites de tu plan de EmailJS

### Errores de código inválido
- Verifica que no haya expirado (10-15 minutos)
- Asegúrate de ingresar los 6 dígitos
- Prueba reenviar el código

### Emails duplicados
- El sistema valida emails únicos
- Usa otro email para registrarte
- O recupera la contraseña de la cuenta existente

### Dominio de email no válido
- Solo se aceptan dominios conocidos y válidos
- Si necesitas agregar un dominio personalizado (ej: dominio de tu escuela)
- Edita el archivo `src/services/emailService.js`
- Busca el array `VALID_EMAIL_DOMAINS`
- Agrega tu dominio: `'tuescuela.edu.ec'`

## Alternativas a EmailJS

Si prefieres usar otro servicio:

- **SendGrid**: hasta 100 emails/día gratis
- **Mailgun**: hasta 5,000 emails/mes gratis (primeros 3 meses)
- **AWS SES**: muy económico, requiere backend
- **Nodemailer**: requiere backend Node.js

## Soporte

Si tienes problemas o preguntas, revisa:
- Documentación de EmailJS: https://www.emailjs.com/docs/
- Consola del navegador para ver logs de desarrollo
- Archivo `src/services/emailService.js` para ver la implementación
