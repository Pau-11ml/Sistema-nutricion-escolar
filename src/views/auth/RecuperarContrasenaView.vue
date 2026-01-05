<template>
  <div class="auth-page min-vh-100 d-flex justify-content-center align-items-center">
    <div class="auth-container">
      <div class="auth-box shadow-lg p-4 p-md-5">
        <!-- Paso 1: Solicitar email -->
        <div v-if="step === 1">
          <div class="text-center mb-4">
            <div class="mb-3">
              <i class="bi bi-key-fill display-1 text-primary"></i>
            </div>
            <h1 class="h3 mb-2">{{ $t('auth.recoverPassword') }}</h1>
            <p class="text-muted">Ingresa tu correo para recibir un código de verificación</p>
          </div>

          <!-- Mensaje de error -->
          <div 
            v-if="errorMessage" 
            class="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="handleRequestCode" novalidate>
            <!-- Email -->
            <div class="mb-4">
              <label for="email" class="form-label">
                {{ $t('auth.email') }}
              </label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-envelope"></i>
                </span>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  :placeholder="$t('auth.email')"
                  autocomplete="email"
                  required
                  :disabled="isLoading"
                />
              </div>
              <div v-if="errors.email" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>
                {{ errors.email }}
              </div>
            </div>

            <!-- Botón -->
            <button
              type="submit"
              class="btn btn-primary w-100 mb-3 py-2"
              :disabled="isLoading"
            >
              <span v-if="isLoading">
                <output class="spinner-border spinner-border-sm me-2" aria-live="polite"></output>
                {{ $t('common.loading') }}
              </span>
              <span v-else>
                <i class="bi bi-send me-2"></i>
                Enviar código
              </span>
            </button>

            <!-- Volver al login -->
            <div class="text-center">
              <router-link to="/login" class="auth-link">
                <i class="bi bi-arrow-left me-1"></i>
                {{ $t('common.back') }} al login
              </router-link>
            </div>
          </form>
        </div>

        <!-- Paso 2: Ingresar código y nueva contraseña -->
        <div v-else-if="step === 2">
          <div class="text-center mb-4">
            <div class="mb-3">
              <i class="bi bi-shield-check display-1 text-primary"></i>
            </div>
            <h1 class="h3 mb-2">Verificar Código</h1>
            <p class="text-muted">
              Código enviado a<br>
              <strong>{{ email }}</strong>
            </p>
          </div>

          <!-- Información -->
          <div class="alert alert-success text-center mb-3">
            <i class="bi bi-envelope-check me-2"></i>
            <strong>¡Email enviado!</strong> Revisa tu bandeja de entrada y spam
          </div>

          <!-- Mensaje de error -->
          <div 
            v-if="errorMessage" 
            class="alert alert-danger d-flex align-items-center"
            role="alert"
          >
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <form @submit.prevent="handleResetPassword" novalidate>
            <!-- Código de verificación -->
            <div class="mb-4">
              <label class="form-label">Código de Verificación</label>
              <div class="verification-code-input">
                <input
                  v-for="(digit, index) in 6"
                  :key="index"
                  :ref="el => codeInputs[index] = el"
                  v-model="verificationCode[index]"
                  type="text"
                  maxlength="1"
                  class="form-control text-center code-digit"
                  :class="{ 'is-invalid': errors.code }"
                  @input="handleCodeInput(index, $event)"
                  @keydown="handleCodeKeyDown(index, $event)"
                  @paste="handleCodePaste($event)"
                  :disabled="isLoading"
                  autocomplete="off"
                />
              </div>
              <div v-if="errors.code" class="invalid-feedback d-block text-center">
                <i class="bi bi-exclamation-circle me-1"></i>
                {{ errors.code }}
              </div>
            </div>

            <!-- Nueva contraseña -->
            <div class="mb-3">
              <label for="newPassword" class="form-label">
                Nueva Contraseña
              </label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-lock"></i>
                </span>
                <input
                  id="newPassword"
                  v-model="newPassword"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.newPassword }"
                  placeholder="••••••••"
                  required
                  :disabled="isLoading"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="showPassword = !showPassword"
                  :disabled="isLoading"
                >
                  <i :class="showPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div v-if="errors.newPassword" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>
                {{ errors.newPassword }}
              </div>
            </div>

            <!-- Confirmar contraseña -->
            <div class="mb-4">
              <label for="confirmPassword" class="form-label">
                Confirmar Contraseña
              </label>
              <div class="input-group">
                <span class="input-group-text">
                  <i class="bi bi-lock-fill"></i>
                </span>
                <input
                  id="confirmPassword"
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  placeholder="••••••••"
                  required
                  :disabled="isLoading"
                />
                <button
                  class="btn btn-outline-secondary"
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  :disabled="isLoading"
                >
                  <i :class="showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="invalid-feedback d-block">
                <i class="bi bi-exclamation-circle me-1"></i>
                {{ errors.confirmPassword }}
              </div>
            </div>

            <!-- Temporizador de reenvío -->
            <div class="text-center mb-3">
              <p class="text-muted small mb-2">¿No recibiste el código?</p>
              <button
                v-if="canResend"
                type="button"
                class="btn btn-link btn-sm"
                @click="handleResendCode"
                :disabled="isLoading"
              >
                <i class="bi bi-arrow-clockwise me-1"></i>
                Reenviar código
              </button>
              <p v-else class="text-muted small">
                Puedes reenviar el código en {{ resendTimer }}s
              </p>
            </div>

            <!-- Botón -->
            <button
              type="submit"
              class="btn btn-primary w-100 mb-3 py-2"
              :disabled="isLoading || !isFormValid"
            >
              <span v-if="isLoading">
                <output class="spinner-border spinner-border-sm me-2" aria-live="polite"></output>
                Actualizando...
              </span>
              <span v-else>
                <i class="bi bi-check-circle me-2"></i>
                Restablecer Contraseña
              </span>
            </button>

            <!-- Volver atrás -->
            <div class="text-center">
              <button
                type="button"
                class="btn btn-link"
                @click="step = 1"
                :disabled="isLoading"
              >
                <i class="bi bi-arrow-left me-1"></i>
                Cambiar email
              </button>
            </div>
          </form>
        </div>

        <!-- Paso 3: Éxito -->
        <div v-else-if="step === 3">
          <div class="text-center">
            <div class="mb-4">
              <i class="bi bi-check-circle-fill display-1 text-success"></i>
            </div>
            <h1 class="h3 mb-2">¡Contraseña Actualizada!</h1>
            <p class="text-muted mb-4">
              Tu contraseña ha sido actualizada correctamente
            </p>
            <router-link to="/login" class="btn btn-primary">
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Ir al login
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { resendCode } from '@/services/emailService'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

// Estado
const step = ref(1) // 1: email, 2: código y contraseña, 3: éxito
const email = ref('')
const verificationCode = reactive(['', '', '', '', '', ''])
const codeInputs = ref([])
const newPassword = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const errors = reactive({
  email: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})
const errorMessage = ref('')
const isLoading = ref(false)

// Reenvío de código
const canResend = ref(false)
const resendTimer = ref(60)
let resendInterval = null

const isCodeComplete = computed(() => {
  return verificationCode.every(digit => digit !== '')
})

const isFormValid = computed(() => {
  return isCodeComplete.value && 
         newPassword.value.length >= 8 && 
         confirmPassword.value === newPassword.value
})

onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval)
  }
})

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validateEmailForm() {
  errors.email = ''
  errorMessage.value = ''

  if (!email.value.trim()) {
    errors.email = t('validation.required')
    return false
  }

  if (!validateEmail(email.value)) {
    errors.email = t('validation.invalidEmail')
    return false
  }

  return true
}

function validatePasswordForm() {
  errors.code = ''
  errors.newPassword = ''
  errors.confirmPassword = ''
  errorMessage.value = ''

  if (!isCodeComplete.value) {
    errors.code = 'Por favor, ingresa el código completo'
    return false
  }

  if (!newPassword.value) {
    errors.newPassword = 'La contraseña es requerida'
    return false
  }

  if (newPassword.value.length < 8) {
    errors.newPassword = 'La contraseña debe tener al menos 8 caracteres'
    return false
  }

  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword.value)) {
    errors.newPassword = 'La contraseña debe contener mayúsculas, minúsculas y números'
    return false
  }

  if (!confirmPassword.value) {
    errors.confirmPassword = 'Debes confirmar la contraseña'
    return false
  }

  if (newPassword.value !== confirmPassword.value) {
    errors.confirmPassword = 'Las contraseñas no coinciden'
    return false
  }

  return true
}

async function handleRequestCode() {
  if (!validateEmailForm()) return

  isLoading.value = true

  try {
    await authStore.recoverPassword(email.value)
    
    step.value = 2
    notificationStore.success('Código enviado. Revisa tu email')
    
    // Iniciar temporizador de reenvío
    startResendTimer()
    
    // Enfocar primer input de código en el siguiente tick
    setTimeout(() => {
      if (codeInputs.value[0]) {
        codeInputs.value[0].focus()
      }
    }, 100)
  } catch (error) {
    errorMessage.value = error.message || 'Error al enviar código de recuperación'
    notificationStore.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

function startResendTimer() {
  resendTimer.value = 60
  canResend.value = false
  
  if (resendInterval) {
    clearInterval(resendInterval)
  }
  
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      canResend.value = true
      clearInterval(resendInterval)
    }
  }, 1000)
}

function handleCodeInput(index, event) {
  const value = event.target.value
  
  // Solo permitir números
  if (value && !/^\d$/.test(value)) {
    verificationCode[index] = ''
    return
  }
  
  verificationCode[index] = value
  errors.code = ''
  errorMessage.value = ''
  
  // Mover al siguiente input
  if (value && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

function handleCodeKeyDown(index, event) {
  // Retroceso
  if (event.key === 'Backspace' && !verificationCode[index] && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
  
  // Flechas
  if (event.key === 'ArrowLeft' && index > 0) {
    codeInputs.value[index - 1]?.focus()
  }
  if (event.key === 'ArrowRight' && index < 5) {
    codeInputs.value[index + 1]?.focus()
  }
}

function handleCodePaste(event) {
  event.preventDefault()
  const pastedData = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
  
  for (let i = 0; i < pastedData.length; i++) {
    verificationCode[i] = pastedData[i]
  }
  
  // Enfocar último input con valor o el primero vacío
  const nextEmptyIndex = verificationCode.findIndex(digit => digit === '')
  if (nextEmptyIndex !== -1) {
    codeInputs.value[nextEmptyIndex]?.focus()
  } else {
    codeInputs.value[5]?.focus()
  }
}

async function handleResetPassword() {
  if (!validatePasswordForm()) return

  isLoading.value = true
  const code = verificationCode.join('')

  try {
    await authStore.resetPassword(email.value, code, newPassword.value)
    
    step.value = 3
    notificationStore.success('Contraseña actualizada correctamente')
    
    // Redirigir al login después de 3 segundos
    setTimeout(() => {
      router.push('/login')
    }, 3000)
  } catch (error) {
    errorMessage.value = error.message
    errors.code = error.message
    notificationStore.error(error.message)
    
    // Limpiar código
    verificationCode.forEach((_, i) => {
      verificationCode[i] = ''
    })
    codeInputs.value[0]?.focus()
  } finally {
    isLoading.value = false
  }
}

async function handleResendCode() {
  if (!canResend.value) return
  
  isLoading.value = true
  errorMessage.value = ''

  try {
    const users = JSON.parse(localStorage.getItem('users')) || []
    const user = users.find(u => u.email === email.value)
    const name = user ? `${user.nombres} ${user.apellidos}` : 'Usuario'
    
    await resendCode(email.value, name, 'recovery')
    
    notificationStore.success('Código reenviado. Revisa tu email')
    startResendTimer()
  } catch (error) {
    errorMessage.value = error.message
    notificationStore.error(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.auth-container {
  max-width: 500px;
  width: 100%;
}

.auth-box {
  background: white;
  border-radius: 1rem;
}

.auth-link {
  color: #0d6efd;
  text-decoration: none;
  transition: all 0.2s ease;
}

.auth-link:hover {
  color: #0056b3;
  text-decoration: underline;
}

.verification-code-input {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.code-digit {
  width: 3rem;
  height: 3.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 0;
}

.code-digit:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
}

.btn-link {
  text-decoration: none;
}

.btn-link:hover {
  text-decoration: underline;
}

@media (max-width: 576px) {
  .code-digit {
    width: 2.5rem;
    height: 3rem;
    font-size: 1.25rem;
  }
  
  .verification-code-input {
    gap: 0.25rem;
  }
}
</style>
