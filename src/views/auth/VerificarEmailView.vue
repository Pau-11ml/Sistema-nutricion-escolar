<template>
  <div class="auth-page min-vh-100 d-flex justify-content-center align-items-center">
    <div class="auth-container">
      <div class="auth-box shadow-lg p-4 p-md-5">
        <div class="text-center mb-4">
          <div class="mb-3">
            <i class="bi bi-envelope-check-fill display-1 text-primary"></i>
          </div>
          <h1 class="h3 mb-2">Verificar Email</h1>
          <p class="text-muted">
            Hemos enviado un código de verificación a<br>
            <strong>{{ email }}</strong>
          </p>
          <p class="text-muted small">
            Por favor, revisa tu bandeja de entrada y spam
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

        <!-- Mensaje de éxito -->
        <div 
          v-if="success" 
          class="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <i class="bi bi-check-circle-fill me-2"></i>
          <span>¡Email verificado correctamente!</span>
        </div>

        <form v-if="!success" @submit.prevent="handleVerify" novalidate>
          <!-- Código de verificación -->
          <div class="mb-4">
            <label for="code" class="form-label">
              Código de Verificación
            </label>
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
                @input="handleInput(index, $event)"
                @keydown="handleKeyDown(index, $event)"
                @paste="handlePaste($event)"
                :disabled="isLoading"
                autocomplete="off"
              />
            </div>
            <div v-if="errors.code" class="invalid-feedback d-block text-center">
              <i class="bi bi-exclamation-circle me-1"></i>
              {{ errors.code }}
            </div>
          </div>

          <!-- Temporizador de reenvío -->
          <div class="text-center mb-3">
            <p class="text-muted small mb-2">¿No recibiste el código?</p>
            <button
              v-if="canResend"
              type="button"
              class="btn btn-link btn-sm"
              @click="handleResend"
              :disabled="isLoading"
            >
              <i class="bi bi-arrow-clockwise me-1"></i>
              Reenviar código
            </button>
            <p v-else class="text-muted small">
              Puedes reenviar el código en {{ resendTimer }}s
            </p>
          </div>

          <!-- Botones -->
          <button
            type="submit"
            class="btn btn-primary w-100 mb-3 py-2"
            :disabled="isLoading || !isCodeComplete"
          >
            <span v-if="isLoading">
              <output class="spinner-border spinner-border-sm me-2" aria-live="polite"></output>
              Verificando...
            </span>
            <span v-else>
              <i class="bi bi-check-circle me-2"></i>
              Verificar Email
            </span>
          </button>

          <!-- Cambiar email -->
          <div class="text-center">
            <button
              type="button"
              class="btn btn-link"
              @click="handleChangeEmail"
              :disabled="isLoading"
            >
              <i class="bi bi-arrow-left me-1"></i>
              Cambiar email
            </button>
          </div>
        </form>

        <div v-else class="text-center">
          <router-link to="/login" class="btn btn-primary">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Ir al login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'
import { verifyCode, clearVerificationCode, resendCode } from '@/services/emailService'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const email = ref(route.query.email || '')
const verificationCode = reactive(['', '', '', '', '', ''])
const codeInputs = ref([])
const errors = reactive({ code: '' })
const errorMessage = ref('')
const isLoading = ref(false)
const success = ref(false)

// Reenvío de código
const canResend = ref(false)
const resendTimer = ref(60)
let resendInterval = null

const isCodeComplete = computed(() => {
  return verificationCode.every(digit => digit !== '')
})

onMounted(() => {
  if (!email.value) {
    router.push('/register')
    return
  }
  
  // Enfocar primer input
  if (codeInputs.value[0]) {
    codeInputs.value[0].focus()
  }
  
  // Iniciar temporizador de reenvío
  startResendTimer()
})

onUnmounted(() => {
  if (resendInterval) {
    clearInterval(resendInterval)
  }
})

function startResendTimer() {
  resendTimer.value = 60
  canResend.value = false
  
  resendInterval = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      canResend.value = true
      clearInterval(resendInterval)
    }
  }, 1000)
}

function handleInput(index, event) {
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

function handleKeyDown(index, event) {
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

function handlePaste(event) {
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

async function handleVerify() {
  if (!isCodeComplete.value) {
    errors.code = 'Por favor, ingresa el código completo'
    return
  }

  isLoading.value = true
  const code = verificationCode.join('')

  try {
    // Verificar el código
    verifyCode(email.value, code, 'verification')
    
    // Marcar email como verificado y completar registro
    await authStore.completeEmailVerification(email.value)
    
    // Limpiar código
    clearVerificationCode(email.value, 'verification')
    
    success.value = true
    notificationStore.success('Email verificado correctamente. Ya puedes iniciar sesión')
    
    // Redirigir al login después de 2 segundos
    setTimeout(() => {
      router.push('/login')
    }, 2000)
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

async function handleResend() {
  if (!canResend.value) return
  
  isLoading.value = true
  errorMessage.value = ''

  try {
    const userData = JSON.parse(sessionStorage.getItem('pendingUser') || '{}')
    const name = userData.nombres || 'Usuario'
    
    await resendCode(email.value, name, 'verification')
    
    notificationStore.success('Código reenviado. Revisa tu email')
    startResendTimer()
  } catch (error) {
    errorMessage.value = error.message
    notificationStore.error(error.message)
  } finally {
    isLoading.value = false
  }
}

function handleChangeEmail() {
  router.push('/register')
}
</script>

<style scoped>
.auth-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;
}

.auth-container {
  width: 100%;
  max-width: 500px;
}

.auth-box {
  background: white;
  border-radius: 1rem;
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
