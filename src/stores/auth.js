import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  
  // Actions
  async function login(credentials) {
    // Verificar bloqueo temporal
    if (isBlocked.value && blockUntil.value > Date.now()) {
      const minutesLeft = Math.ceil((blockUntil.value - Date.now()) / 60000)
      throw new Error(`Cuenta bloqueada temporalmente. Intente nuevamente en ${minutesLeft} minutos.`)
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
        blockUntil.value = Date.now() + (15 * 60 * 1000) // 15 minutos
        localStorage.setItem('blockUntil', blockUntil.value)
        throw new Error('Demasiados intentos fallidos. Cuenta bloqueada por 15 minutos.')
      }
      
      throw error
    }
  }

  async function register(userData) {
    try {
      // Simulación de API - Reemplazar con llamada real
      const response = await mockRegister(userData)
      return response
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    sessionStorage.removeItem('user')
  }

  async function recoverPassword(email) {
    try {
      // Simulación de API
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true, message: 'Se ha enviado un correo de recuperación' }
    } catch (error) {
      throw error
    }
  }

  function setRememberMe(value) {
    rememberMe.value = value
    localStorage.setItem('rememberMe', value.toString())
  }

  function initializeAuth() {
    const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (storedUser && token.value) {
      user.value = JSON.parse(storedUser)
    }
    
    const storedBlockUntil = localStorage.getItem('blockUntil')
    if (storedBlockUntil) {
      blockUntil.value = parseInt(storedBlockUntil)
      if (blockUntil.value > Date.now()) {
        isBlocked.value = true
      } else {
        isBlocked.value = false
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
    login,
    register,
    logout,
    recoverPassword,
    setRememberMe,
    initializeAuth
  }
})

// Funciones mock - reemplazar con API real
async function mockLogin(credentials) {
  await new Promise(resolve => setTimeout(resolve, 800));

  // Intentar recuperar usuario registrado
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (storedUser) {
    const isUsernameOrEmailMatch =
      storedUser.username === credentials.username ||
      storedUser.email === credentials.username;
    
    const isPasswordMatch = storedUser.password === credentials.password;

    if (isUsernameOrEmailMatch && isPasswordMatch) {
      return {
        token: 'mock-token-' + Date.now(),
        user: {
          id: Date.now(),
          username: storedUser.username,
          email: storedUser.email,
          role: storedUser.role,
          name: `${storedUser.nombres} ${storedUser.apellidos}`
        }
      };
    }
  }

  // Usuarios de prueba (fallback)
  const users = {
    admin: { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    representante: { username: 'representante', password: 'rep123', role: 'representante', name: 'Juan Pérez' },
    nutricionista: { username: 'nutricionista', password: 'nutri123', role: 'nutricionista', name: 'María García' }
  };

  const user = users[credentials.username];
  if (user && user.password === credentials.password) {
    return {
      token: 'mock-token-' + Date.now(),
      user: {
        id: Date.now(),
        username: user.username,
        role: user.role,
        name: user.name
      }
    };
  }

  throw new Error('Credenciales inválidas');
}

async function mockRegister(userData) {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return { success: true, message: 'Usuario registrado exitosamente' }
}
