<template>
  <div class="auth-page min-vh-100 d-flex justify-content-center align-items-center">
    <div class="auth-container">
      <div class="auth-box shadow-lg p-4 p-md-5">
        <div class="text-center mb-4">
          <div class="mb-3">
            <i class="bi bi-key-fill display-1 text-primary"></i>
          </div>
          <h1 class="h3 mb-2">{{ $t('auth.recoverPassword') }}</h1>
          <p class="text-muted">{{ $t('auth.recoverPasswordInfo') }}</p>
        </div>

        <!-- Mensaje de éxito -->
        <div 
          v-if="success" 
          class="alert alert-success d-flex align-items-center"
          role="alert"
        >
          <i class="bi bi-check-circle-fill me-2"></i>
          <span>{{ $t('auth.passwordRecoverySent') }}</span>
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

        <form v-if="!success" @submit.prevent="handleSubmit" novalidate>
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
              {{ $t('common.submit') }}
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
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useNotificationStore } from '@/stores/notification'

const { t } = useI18n()
const authStore = useAuthStore()
const notificationStore = useNotificationStore()

const email = ref('')
const errors = reactive({ email: '' })
const errorMessage = ref('')
const isLoading = ref(false)
const success = ref(false)

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function validateForm() {
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

async function handleSubmit() {
  if (!validateForm()) return

  isLoading.value = true

  try {
    await authStore.recoverPassword(email.value)
    success.value = true
    notificationStore.success(t('auth.passwordRecoverySent'))
  } catch (error) {
    errorMessage.value = error.message || 'Error al enviar correo de recuperación'
    notificationStore.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  max-width: 480px;
  width: 100%;
  padding: 1rem;
}

.auth-box {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
