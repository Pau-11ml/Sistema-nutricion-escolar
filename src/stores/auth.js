import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  sendVerificationEmail, 
  sendRecoveryEmail, 
  generateVerificationCode,
  verifyCode,
  clearVerificationCode 
} from '@/services/emailService'

export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const rememberMe = ref(localStorage.getItem('rememberMe') === 'true')
  const loginAttempts = ref(0)
  const isBlocked = ref(false)
  const blockUntil = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!token.value && !!user.value)
  const userRole = computed(() => user.value?.role || null)
  
  // Computed
  const attemptsRemaining = computed(() => Math.max(0, 5 - loginAttempts.value))
  const secondsUntilUnblock = computed(() => {
    if (!isBlocked.value || !blockUntil.value) return 0
    return Math.max(0, Math.ceil((blockUntil.value - Date.now()) / 1000))
  })
  
  // Actions
  async function login(credentials) {
    // Verificar bloqueo temporal
    if (isBlocked.value && blockUntil.value > Date.now()) {
      const secondsLeft = Math.ceil((blockUntil.value - Date.now()) / 1000)
      throw new Error(`Cuenta bloqueada temporalmente. Intente nuevamente en ${secondsLeft} segundos.`)
    }
    
    try {
      // Simulación de API - Reemplazar con llamada real
      const response = await mockLogin(credentials)
      
      user.value = response.user
      token.value = response.token
      loginAttempts.value = 0
      isBlocked.value = false
      
      localStorage.setItem('token', response.token)
      
      if (rememberMe.value) {
        localStorage.setItem('user', JSON.stringify(response.user))
        localStorage.setItem('rememberMe', 'true')
      } else {
        sessionStorage.setItem('user', JSON.stringify(response.user))
      }
      
      return response
    } catch (error) {
      loginAttempts.value++
      
      // Bloquear después de 5 intentos fallidos
      if (loginAttempts.value >= 5) {
        isBlocked.value = true
        blockUntil.value = Date.now() + (15 * 1000) // 15 segundos
        localStorage.setItem('blockUntil', blockUntil.value)
        throw new Error('Demasiados intentos fallidos. Cuenta bloqueada por 15 segundos.')
      }
      
      const remaining = 5 - loginAttempts.value
      const attemptError = new Error(error.message)
      attemptError.attemptsRemaining = remaining
      throw attemptError
    }
  }

  async function register(userData) {
    try {
      // Validar que el email no esté registrado
      const existingUsers = JSON.parse(localStorage.getItem('users')) || []
      const emailExists = existingUsers.some(u => u.email === userData.email)
      
      if (emailExists) {
        throw new Error('El correo electrónico ya está registrado')
      }

      // Generar código de verificación
      const verificationCode = generateVerificationCode()
      
      // Enviar código al email
      const emailResponse = await sendVerificationEmail(
        userData.email,
        `${userData.nombres} ${userData.apellidos}`,
        verificationCode
      )
      
      // Guardar datos del usuario temporalmente (sin verificar)
      const pendingUser = {
        ...userData,
        emailVerified: false,
        createdAt: Date.now()
      }
      sessionStorage.setItem('pendingUser', JSON.stringify(pendingUser))
      
      return {
        success: true,
        message: 'Código de verificación enviado',
        email: userData.email,
        devCode: emailResponse.devCode // Solo para desarrollo
      }
    } catch (error) {
      throw error
    }
  }

  async function completeEmailVerification(email) {
    try {
      // Obtener usuario pendiente
      const pendingUser = JSON.parse(sessionStorage.getItem('pendingUser') || '{}')
      
      if (pendingUser.email !== email) {
        throw new Error('Email no coincide con el registro pendiente')
      }
      
      // Marcar como verificado y guardar en localStorage
      const verifiedUser = {
        ...pendingUser,
        emailVerified: true
      }
      
      // Registrar usuario
      const response = await mockRegister(verifiedUser)
      
      // Limpiar sesión temporal
      sessionStorage.removeItem('pendingUser')
      
      return response
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    
    // Limpiar localStorage y sessionStorage
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('pendingUser')
  }

  async function recoverPassword(email) {
    try {
      // Verificar que el email esté registrado
      const users = JSON.parse(localStorage.getItem('users')) || []
      const user = users.find(u => u.email === email)
      
      if (!user) {
        throw new Error('No existe una cuenta con este correo electrónico')
      }
      
      // Generar código de recuperación
      const recoveryCode = generateVerificationCode()
      
      // Enviar código al email
      const emailResponse = await sendRecoveryEmail(
        email,
        `${user.nombres} ${user.apellidos}`,
        recoveryCode
      )
      
      return {
        success: true,
        message: 'Código de recuperación enviado',
        email: email,
        devCode: emailResponse.devCode // Solo para desarrollo
      }
    } catch (error) {
      throw error
    }
  }

  async function resetPassword(email, code, newPassword) {
    try {
      // Verificar código
      verifyCode(email, code, 'recovery')
      
      // Actualizar contraseña
      const users = JSON.parse(localStorage.getItem('users')) || []
      const userIndex = users.findIndex(u => u.email === email)
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado')
      }
      
      users[userIndex].password = newPassword
      localStorage.setItem('users', JSON.stringify(users))
      
      // Limpiar código de recuperación
      clearVerificationCode(email, 'recovery')
      
      return {
        success: true,
        message: 'Contraseña actualizada correctamente'
      }
    } catch (error) {
      throw error
    }
  }

  function setRememberMe(value) {
    rememberMe.value = value
    localStorage.setItem('rememberMe', value.toString())
  }

  function checkBlockStatus() {
    if (isBlocked.value && blockUntil.value && blockUntil.value <= Date.now()) {
      isBlocked.value = false
      loginAttempts.value = 0
      blockUntil.value = null
      localStorage.removeItem('blockUntil')
    }
  }

  function initializeAuth() {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (storedUser && token.value) {
      try {
        user.value = JSON.parse(storedUser)
      } catch (error) {
        console.error('Error al parsear usuario almacenado:', error)
        // Limpiar datos corruptos
        localStorage.removeItem('user')
        sessionStorage.removeItem('user')
        localStorage.removeItem('token')
        user.value = null
        token.value = null
      }
    } else if (storedUser || token.value) {
      // Si hay user sin token o token sin user, limpiar todo
      localStorage.removeItem('user')
      sessionStorage.removeItem('user')
      localStorage.removeItem('token')
      user.value = null
      token.value = null
    }
    
    const storedBlockUntil = localStorage.getItem('blockUntil')
    if (storedBlockUntil) {
      blockUntil.value = parseInt(storedBlockUntil)
      if (blockUntil.value > Date.now()) {
        isBlocked.value = true
      } else {
        isBlocked.value = false
        loginAttempts.value = 0
        localStorage.removeItem('blockUntil')
      }
    }
  }

  return {
    user,
    token,
    rememberMe,
    isAuthenticated,
    userRole,
    isBlocked,
    blockUntil,
    loginAttempts,
    attemptsRemaining,
    secondsUntilUnblock,
    login,
    register,
    completeEmailVerification,
    logout,
    recoverPassword,
    resetPassword,
    setRememberMe,
    initializeAuth,
    checkBlockStatus
  }
})

// Funciones mock - reemplazar con API real
async function mockLogin(credentials) {
  await new Promise(resolve => setTimeout(resolve, 800));

  // Recuperar lista de usuarios registrados
  const users = JSON.parse(localStorage.getItem('users')) || [];

  // Buscar usuario que coincida por username o email
  const foundUser = users.find(u =>
    (u.username === credentials.username || u.email === credentials.username) &&
    u.password === credentials.password
  );

  if (foundUser) {
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: foundUser.username,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
        name: `${foundUser.nombres} ${foundUser.apellidos}`
      }
    };
  }

  // Usuarios de prueba (por si no hay usuarios registrados aún)
  const testUsers = {
    admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    representante: { username: 'representante', password: 'rep123', role: 'representante', name: 'Juan Pérez' },
    nutricionista: { username: 'nutricionista', password: 'nutri123', role: 'nutricionista', name: 'María García' }
  };

  const testUser = testUsers[credentials.username];
  if (testUser && testUser.password === credentials.password) {
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: testUser.username,
        username: testUser.username,
        role: testUser.role,
        name: testUser.name
      }
    };
  }

  throw new Error('Credenciales inválidas');
}


async function mockRegister(userData) {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Leer usuarios existentes o crear lista nueva
  let existingUsers = [];
  try {
    const stored = localStorage.getItem('users');
    if (stored) {
      existingUsers = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error al leer usuarios:', error);
    existingUsers = [];
  }

  // Verificar si ya existe un usuario con mismo username o email
  const userExists = existingUsers.some(
    u => u.username === userData.username || u.email === userData.email
  );
  if (userExists) {
    throw new Error('El nombre de usuario o correo ya están registrados');
  }

  // Agregar nuevo usuario con datos completos
  const newUser = {
    ...userData,
    id: userData.username,
    createdAt: new Date().toISOString(),
    emailVerified: true,
    estado: 'activo'
  };
  
  existingUsers.push(newUser);

  // Guardar lista actualizada en localStorage
  try {
    localStorage.setItem('users', JSON.stringify(existingUsers));
    console.log('✅ Usuario guardado:', newUser.username, '| Role:', newUser.role);
  } catch (error) {
    console.error('❌ Error al guardar usuario:', error);
    throw new Error('Error al guardar usuario');
  }

  return { success: true, message: 'Usuario registrado exitosamente' };
}

