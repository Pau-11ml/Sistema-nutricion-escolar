import emailjs from '@emailjs/browser'

// ============================================
// CONFIGURACIÓN DE EMAILJS
// ============================================
// 📝 Para activar el envío REAL de emails:
// 1. Crea cuenta gratis en: https://www.emailjs.com/
// 2. Configura un servicio de email (Gmail, Outlook, etc.)
// 3. Crea dos templates (verification y recovery)
// 4. Reemplaza los valores abajo con tus credenciales:
// 5. Ñiñiñiñiñiñiñiñiñiñiñiñiñi

const EMAILJS_SERVICE_ID = 'service_1dc3lzg'          // ✅ Service ID configurado
const EMAILJS_TEMPLATE_ID_VERIFICATION = 'template_fg4fwyp'      // ✅ Template de verificación configurado
const EMAILJS_TEMPLATE_ID_RECOVERY = 'template_6rsi12e'          // ✅ Template de recuperación configurado
const EMAILJS_PUBLIC_KEY = '7bBs29hCWiBUzBNit'       // ✅ Public Key configurado

// ⚠️ MODO ACTUAL: PRODUCCIÓN (emails reales)
// EmailJS está activado y listo para enviar emails
emailjs.init(EMAILJS_PUBLIC_KEY)
// ============================================

/**
 * Genera un código de verificación de 6 dígitos
 */
export function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Envía un código de verificación al email del usuario
 * @param {string} email - Email del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} code - Código de verificación
 * @returns {Promise} - Promesa con el resultado del envío
 */
export async function sendVerificationEmail(email, name, code) {
  try {
    // Validar formato y dominio del email
    const validation = validateEmailFormat(email)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    // Guardar código en localStorage con timestamp
    const verificationData = {
      email,
      code,
      timestamp: Date.now(),
      expiresIn: 10 * 60 * 1000 // 10 minutos
    }
    localStorage.setItem(`verification_${email}`, JSON.stringify(verificationData))

    // ============================================
    // ✅ MODO PRODUCCIÓN ACTIVADO
    // ============================================
    
    const templateParams = {
      to_name: name,
      to_email: email,
      verification_code: code,
      expires_in: '10 minutos'
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_VERIFICATION,
      templateParams,
      EMAILJS_PUBLIC_KEY
    )
    
    console.log('✅ Email de verificación enviado a:', email)
    console.log('📧 Respuesta de EmailJS:', response)
    
    return {
      success: true,
      message: 'Código de verificación enviado correctamente'
    }
  } catch (error) {
    console.error('❌ Error al enviar email de verificación:', error)
    console.error('📋 Detalles del error:', {
      status: error.status,
      text: error.text,
      email,
      name
    })
    
    // Proporcionar mensajes de error más específicos
    if (error.status === 422) {
      throw new Error('Error: Verifica la configuración de tu template en EmailJS. Asegúrate de que los campos {{to_name}}, {{to_email}}, {{verification_code}} y {{expires_in}} estén configurados correctamente.')
    } else if (error.status === 400) {
      throw new Error('Error: Credenciales de EmailJS incorrectas. Verifica tu Service ID, Template ID y Public Key.')
    } else {
      throw new Error(`Error al enviar email: ${error.text || 'Intenta nuevamente'}`)
    }
  }
}

/**
 * Envía un código de recuperación de contraseña
 * @param {string} email - Email del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} code - Código de recuperación
 * @returns {Promise} - Promesa con el resultado del envío
 */
export async function sendRecoveryEmail(email, name, code) {
  try {
    // Validar formato y dominio del email
    const validation = validateEmailFormat(email)
    if (!validation.valid) {
      throw new Error(validation.error)
    }
    
    // Guardar código en localStorage con timestamp
    const recoveryData = {
      email,
      code,
      timestamp: Date.now(),
      expiresIn: 15 * 60 * 1000 // 15 minutos
    }
    localStorage.setItem(`recovery_${email}`, JSON.stringify(recoveryData))

    // ============================================
    // ✅ MODO PRODUCCIÓN ACTIVADO
    // ============================================
    
    const templateParams = {
      to_name: name,
      to_email: email,
      recovery_code: code,
      expires_in: '15 minutos'
    }

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID_RECOVERY,
      templateParams,
      EMAILJS_PUBLIC_KEY
    )
    
    console.log('✅ Email de recuperación enviado a:', email)
    console.log('📧 Respuesta de EmailJS:', response)
    
    return {
      success: true,
      message: 'Código de recuperación enviado correctamente'
    }
  } catch (error) {
    console.error('❌ Error al enviar email de recuperación:', error)
    console.error('📋 Detalles del error:', {
      status: error.status,
      text: error.text,
      email,
      name
    })
    
    // Proporcionar mensajes de error más específicos
    if (error.status === 422) {
      throw new Error('Error: Verifica la configuración de tu template en EmailJS. Asegúrate de que los campos {{to_name}}, {{to_email}}, {{recovery_code}} y {{expires_in}} estén configurados correctamente.')
    } else if (error.status === 400) {
      throw new Error('Error: Credenciales de EmailJS incorrectas. Verifica tu Service ID, Template ID y Public Key.')
    } else {
      throw new Error(`Error al enviar email: ${error.text || 'Intenta nuevamente'}`)
    }
  }
}

/**
 * Verifica si un código de verificación es válido
 * @param {string} email - Email del usuario
 * @param {string} code - Código a verificar
 * @param {string} type - Tipo de verificación ('verification' o 'recovery')
 * @returns {boolean} - true si el código es válido
 */
export function verifyCode(email, code, type = 'verification') {
  const key = `${type}_${email}`
  const data = localStorage.getItem(key)
  
  if (!data) {
    throw new Error('No se encontró un código de verificación para este email')
  }

  const { code: storedCode, timestamp, expiresIn } = JSON.parse(data)
  
  // Verificar si el código ha expirado
  if (Date.now() - timestamp > expiresIn) {
    localStorage.removeItem(key)
    throw new Error('El código de verificación ha expirado')
  }

  // Verificar si el código coincide
  if (storedCode !== code) {
    throw new Error('Código de verificación incorrecto')
  }

  return true
}

/**
 * Limpia el código de verificación después de usarlo
 * @param {string} email - Email del usuario
 * @param {string} type - Tipo de verificación ('verification' o 'recovery')
 */
export function clearVerificationCode(email, type = 'verification') {
  const key = `${type}_${email}`
  localStorage.removeItem(key)
}

/**
 * Lista de dominios de email válidos y conocidos
 */
const VALID_EMAIL_DOMAINS = [
  // Dominios populares internacionales
  'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.es', 'hotmail.com', 
  'hotmail.es', 'outlook.com', 'outlook.es', 'live.com', 'icloud.com',
  'me.com', 'mac.com', 'aol.com', 'protonmail.com', 'zoho.com',
  
  // Dominios educativos
  'edu.ec', 'epn.edu.ec', 'uce.edu.ec', 'espol.edu.ec', 'udla.edu.ec',
  'usfq.edu.ec', 'puce.edu.ec', 'utpl.edu.ec', 'ups.edu.ec',
  
  // Dominios corporativos Ecuador
  'espol.edu.ec', 'udlanet.ec', 'est.ups.edu.ec'
]

/**
 * Valida que un email sea real (formato válido y dominio conocido)
 * @param {string} email - Email a validar
 * @returns {Object} - { valid: boolean, error: string }
 */
export function validateEmailFormat(email) {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'El formato del correo electrónico no es válido'
    }
  }
  
  // Extraer el dominio del email
  const domain = email.split('@')[1].toLowerCase()
  
  // Verificar si el dominio está en la lista de válidos
  const isDomainValid = VALID_EMAIL_DOMAINS.some(validDomain => 
    domain === validDomain || domain.endsWith('.' + validDomain)
  )
  
  if (!isDomainValid) {
    return {
      valid: false,
      error: 'Por favor, usa un correo electrónico de un proveedor válido (Gmail, Yahoo, Hotmail, Outlook, etc.)'
    }
  }
  
  return {
    valid: true,
    error: null
  }
}

/**
 * Reenvía un código de verificación
 * @param {string} email - Email del usuario
 * @param {string} name - Nombre del usuario
 * @param {string} type - Tipo ('verification' o 'recovery')
 * @returns {Promise} - Promesa con el resultado del reenvío
 */
export async function resendCode(email, name, type = 'verification') {
  const newCode = generateVerificationCode()
  
  if (type === 'verification') {
    return await sendVerificationEmail(email, name, newCode)
  } else {
    return await sendRecoveryEmail(email, name, newCode)
  }
}
