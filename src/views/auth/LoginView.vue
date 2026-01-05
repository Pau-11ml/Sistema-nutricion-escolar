<template>
  <div
    class="auth-page min-vh-100 d-flex justify-content-center align-items-center"
  >
    <div class="auth-container">
      <div class="auth-box shadow-lg p-4 p-md-5">
        <div class="text-center mb-4">
          <img
            src="@/assets/images/logo.png"
            alt="Logo Sistema Nutrición Escolar"
            class="auth-logo mb-3"
          />
          <h1 class="h3 mb-2">
            {{ $t("common.welcome") }}
          </h1>
          <p class="text-muted">
            {{ $t("common.appName") }}
          </p>
        </div>

        <!-- Mensaje de error general -->
        <div
          v-if="errorMessage"
          class="alert alert-danger d-flex align-items-center"
          role="alert"
        >
          <i
            class="bi bi-exclamation-triangle-fill me-2"
          ></i>
          <span>{{ errorMessage }}</span>
        </div>

        <!-- Mensaje de bloqueo -->
        <div
          v-if="authStore.isBlocked && authStore.secondsUntilUnblock > 0"
          class="alert alert-warning d-flex align-items-center justify-content-between"
          role="alert"
        >
          <div>
            <i class="bi bi-lock-fill me-2"></i>
            <span>Cuenta bloqueada por seguridad.</span>
          </div>
          <div class="countdown-timer">
            <i class="bi bi-clock me-2"></i>
            <strong>{{ authStore.secondsUntilUnblock }}s</strong>
          </div>
        </div>

        <!-- Formulario -->
        <form
          @submit.prevent="handleLogin"
          novalidate
        >
          <!-- Usuario -->
          <div class="mb-3">
            <label
              for="username"
              class="form-label"
            >
              {{ $t("auth.username") }}
            </label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person"></i>
              </span>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.username,
                }"
                :placeholder="$t('auth.username')"
                autocomplete="username"
                required
                :disabled="
                  isLoading || authStore.isBlocked
                "
              />
            </div>
            <div
              v-if="errors.username"
              class="invalid-feedback d-block"
            >
              <i
                class="bi bi-exclamation-circle me-1"
              ></i>
              {{ errors.username }}
            </div>
          </div>

          <!-- Contraseña -->
          <div class="mb-3">
            <label
              for="password"
              class="form-label"
            >
              {{ $t("auth.password") }}
            </label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock"></i>
              </span>
              <input
                id="password"
                v-model="formData.password"
                :type="
                  showPassword
                    ? 'text'
                    : 'password'
                "
                class="form-control"
                :class="{
                  'is-invalid': errors.password,
                }"
                :placeholder="$t('auth.password')"
                :autocomplete="
                  showPassword
                    ? 'off'
                    : 'current-password'
                "
                required
                :disabled="
                  isLoading || authStore.isBlocked
                "
              />
              <button
                type="button"
                class="btn btn-outline-secondary"
                @click="
                  showPassword = !showPassword
                "
                :aria-label="
                  showPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                "
              >
                <i
                  class="bi"
                  :class="
                    showPassword
                      ? 'bi-eye-slash'
                      : 'bi-eye'
                  "
                ></i>
              </button>
            </div>
            <div
              v-if="errors.password"
              class="invalid-feedback d-block"
            >
              <i
                class="bi bi-exclamation-circle me-1"
              ></i>
              {{ errors.password }}
            </div>
          </div>

          <!-- Recordar sesión -->
          <div class="mb-3 form-check">
            <input
              id="rememberMe"
              v-model="formData.rememberMe"
              type="checkbox"
              class="form-check-input"
              :disabled="isLoading"
            />
            <label
              class="form-check-label"
              for="rememberMe"
            >
              {{ $t("auth.rememberMe") }}
            </label>
          </div>

          <!-- Botón de login -->
          <button
            type="submit"
            class="btn btn-primary w-100 mb-3 py-2"
            :disabled="
              isLoading || authStore.isBlocked
            "
          >
            <span v-if="isLoading">
              <output
                class="spinner-border spinner-border-sm me-2"
                aria-live="polite"
              ></output>
              {{ $t("common.loading") }}
            </span>
            <span v-else>
              <i
                class="bi bi-box-arrow-in-right me-2"
              ></i>
              {{ $t("common.login") }}
            </span>
          </button>

          <!-- Divider -->
          <div class="auth-divider mb-3">
            <span>o</span>
          </div>

          <!-- Enlaces -->
          <div
            class="d-flex flex-column align-items-center gap-2"
          >
            <router-link
              to="/recuperar-contrasena"
              class="auth-link"
            >
              <i class="bi bi-key me-1"></i>
              {{ $t("auth.forgotPassword") }}
            </router-link>
            <router-link
              to="/register"
              class="auth-link"
            >
              <i
                class="bi bi-person-plus me-1"
              ></i>
              {{ $t("auth.createAccount") }}
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const formData = reactive({
  username: "",
  password: "",
  rememberMe: false,
});

const errors = reactive({
  username: "",
  password: "",
});

const errorMessage = ref("");
const isLoading = ref(false);
const showPassword = ref(false);
let blockCheckInterval = null;

function validateForm() {
  errors.username = "";
  errors.password = "";
  errorMessage.value = "";

  if (!formData.username.trim()) {
    errors.username = t("validation.required");
    return false;
  }

  if (!formData.password.trim()) {
    errors.password = t("validation.required");
    return false;
  }

  if (formData.password.length < 6) {
    errors.password = t("validation.minLength", {
      min: 6,
    });
    return false;
  }

  return true;
}

async function handleLogin() {
  if (!validateForm()) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    authStore.setRememberMe(formData.rememberMe);
    await authStore.login({
      username: formData.username,
      password: formData.password,
    });

    notificationStore.success(
      t("auth.loginSuccess")
    );

    // Esperar un momento para que el estado se actualice
    await new Promise((resolve) =>
      setTimeout(resolve, 100)
    );

    // Redirigir según el rol
    const role = authStore.user?.role;
    if (role === "admin") {
      await router.push("/admin");
    } else if (role === "nutricionista") {
      await router.push("/nutricionista");
    } else {
      await router.push("/usuario");
    }
  } catch (error) {
    errorMessage.value = error.message || t("auth.loginError");
    
    // Mostrar intentos restantes si hay información disponible
    if (error.attemptsRemaining !== undefined && error.attemptsRemaining > 0) {
      errorMessage.value += ` Te quedan ${error.attemptsRemaining} intento${error.attemptsRemaining !== 1 ? 's' : ''}.`;
    }
    
    notificationStore.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
}

function handleImageError(e) {
  e.target.src =
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"%3E%3Crect fill="%230d6efd" width="80" height="80"/%3E%3Ctext x="50%25" y="50%25" fill="white" text-anchor="middle" dy=".3em" font-size="30" font-weight="bold"%3ESNE%3C/text%3E%3C/svg%3E';
}

onMounted(() => {
  formData.rememberMe = authStore.rememberMe;
  
  // Verificar estado de bloqueo cada segundo
  blockCheckInterval = setInterval(() => {
    authStore.checkBlockStatus();
  }, 1000);
});

onUnmounted(() => {
  if (blockCheckInterval) {
    clearInterval(blockCheckInterval);
  }
});
</script>

<style scoped>
.auth-page {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  position: relative;
  overflow: hidden;
}

.auth-page::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: radial-gradient(
      circle at 20% 50%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 80%,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 50%
    );
  pointer-events: none;
}

.auth-container {
  max-width: 480px;
  width: 100%;
  padding: 1rem;
  position: relative;
  z-index: 1;
}

.auth-box {
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  border-radius: 1.5rem;
  animation: fadeInUp 0.6s ease-out;
  color: #212529 !important;
}

.auth-box h1,
.auth-box h2,
.auth-box h3,
.auth-box h4,
.auth-box h5,
.auth-box h6 {
  color: #212529 !important;
  font-weight: 600;
}

.auth-box p {
  color: #212529 !important;
}

.auth-box .text-muted {
  color: #495057 !important;
}

.auth-box .form-label {
  color: #212529 !important;
  font-weight: 500;
}

.auth-box .form-control {
  color: #212529 !important;
}

.auth-box .form-control::placeholder {
  color: #6c757d !important;
}

.auth-box .form-check-label {
  color: #212529 !important;
}

.auth-box .alert {
  color: #212529 !important;
}

.auth-logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.auth-divider {
  text-align: center;
  position: relative;
  color: #495057 !important;
  margin: 1.5rem 0;
  font-weight: 500;
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #dee2e6;
}

.auth-divider::before {
  left: 0;
}

.auth-divider::after {
  right: 0;
}

.auth-link {
  color: #0056b3;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.auth-link:hover {
  color: #003d82;
  text-decoration: underline;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
  color: #212529;
}

.input-group .form-control {
  border-left: none;
}

.input-group .form-control:focus {
  box-shadow: none;
  border-color: #86b7fe;
}

.input-group .btn {
  color: #212529 !important;
  border-color: #ced4da;
}

.input-group .btn:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

.input-group .btn i {
  color: #495057;
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

.countdown-timer {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: #856404;
  animation: pulse 1s infinite;
}

.countdown-timer strong {
  font-size: 1.3rem;
  color: #856404;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
