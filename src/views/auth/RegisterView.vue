<template>
  <div
    class="register-view min-vh-100 d-flex align-items-center justify-content-center"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-10 col-lg-8">
          <div class="card shadow-lg border-0">
            <div class="card-body p-4 p-md-5">
              <!-- Header -->
              <div class="text-center mb-4">
                <div class="mb-3">
                  <i
                    class="bi bi-person-plus-fill display-4 text-primary"
                  ></i>
                </div>
                <h2 class="fw-bold">
                  {{ $t("Registrate") }}
                </h2>
                <p class="text-muted">
                  {{ $t("auth.createAccount") }}
                </p>
              </div>

              <!-- Formulario de Registro -->
              <form
                @submit.prevent="handleRegister"
                novalidate
              >
                <!-- Selección de Rol -->
                <div class="mb-4">
                  <div
                    class="form-label fw-bold"
                  >
                    <i
                      class="bi bi-person-badge me-2"
                    ></i>
                    {{ $t("Selecciona tu Rol") }}
                  </div>
                  <div class="row g-3">
                    <div
                      v-for="role in roles"
                      :key="role.value"
                      class="col-md-4"
                    >
                      <div
                        class="role-card p-3 border rounded text-center cursor-pointer"
                        :class="{
                          active:
                            formData.role ===
                            role.value,
                        }"
                        @click="
                          formData.role =
                            role.value
                        "
                      >
                        <i
                          :class="role.icon"
                          class="display-6 mb-2"
                        ></i>
                        <h6 class="mb-1">
                          {{ $t(role.label) }}
                        </h6>
                        <small
                          class="text-muted"
                          >{{
                            $t(role.description)
                          }}</small
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="errors.role"
                    class="invalid-feedback d-block"
                  >
                    {{ errors.role }}
                  </div>
                </div>

                <!-- Información Personal -->
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label
                      for="nombres"
                      class="form-label"
                    >
                      {{ $t("auth.firstName") }}
                      <span class="text-danger"
                        >*</span
                      >
                    </label>
                    <input
                      id="nombres"
                      v-model="formData.nombres"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          errors.nombres,
                      }"
                      :placeholder="
                        $t(
                          'Ej: Santiago José'
                        )
                      "
                      required
                    />
                    <div
                      v-if="errors.nombres"
                      class="invalid-feedback"
                    >
                      {{ errors.nombres }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label
                      for="apellidos"
                      class="form-label"
                    >
                      {{ $t("auth.lastName") }}
                      <span class="text-danger"
                        >*</span
                      >
                    </label>
                    <input
                      id="apellidos"
                      v-model="formData.apellidos"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          errors.apellidos,
                      }"
                      :placeholder="
                        $t(
                          'Ej: Santana Pacheco'
                        )
                      "
                      required
                    />
                    <div
                      v-if="errors.apellidos"
                      class="invalid-feedback"
                    >
                      {{ errors.apellidos }}
                    </div>
                  </div>
                </div>

                <!-- Identificación -->
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label
                      for="cedula"
                      class="form-label"
                    >
                      {{ $t("auth.idNumber") }}
                      <span class="text-danger"
                        >*</span
                      >
                    </label>
                    <input
                      id="cedula"
                      v-model="formData.cedula"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          errors.cedula,
                      }"
                      placeholder="0000000000"
                      maxlength="10"
                      required
                    />
                    <div
                      v-if="errors.cedula"
                      class="invalid-feedback"
                    >
                      {{ errors.cedula }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label
                      for="telefono"
                      class="form-label"
                    >
                      {{ $t("auth.phone") }}
                      <span class="text-danger"
                        >*</span
                      >
                    </label>
                    <input
                      id="telefono"
                      v-model="formData.telefono"
                      type="tel"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          errors.telefono,
                      }"
                      placeholder="0999999999"
                      maxlength="10"
                      required
                    />
                    <div
                      v-if="errors.telefono"
                      class="invalid-feedback"
                    >
                      {{ errors.telefono }}
                    </div>
                  </div>
                </div>

                <!-- Email -->
                <div class="mb-3">
                  <label
                    for="email"
                    class="form-label"
                  >
                    {{ $t("auth.email") }}
                    <span class="text-danger"
                      >*</span
                    >
                  </label>
                  <input
                    id="email"
                    v-model="formData.email"
                    type="email"
                    class="form-control"
                    :class="{
                      'is-invalid': errors.email,
                    }"
                    :placeholder="
                      $t('Ej: jose_pacheco@gmail.com')
                    "
                    required
                  />
                  <div
                    v-if="errors.email"
                    class="invalid-feedback"
                  >
                    {{ errors.email }}
                  </div>
                </div>

                <!-- Usuario y Contraseña -->
                <div class="row g-3 mb-3">
                  <div class="col-md-6">
                    <label
                      for="username"
                      class="form-label"
                    >
                      {{ $t("auth.username") }}
                      <span class="text-danger"
                        >*</span
                      >
                    </label>
                    <input
                      id="username"
                      v-model="formData.username"
                      type="text"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          errors.username,
                      }"
                      :placeholder="
                        $t(
                          'PachecoJ'
                        )
                      "
                      required
                    />
                    <div
                      v-if="errors.username"
                      class="invalid-feedback"
                    >
                      {{ errors.username }}
                    </div>
                  </div>

                  <div class="col-md-6">
                    <label
                      for="password"
                      class="form-label"
                    >
                      {{ $t("auth.password") }}
                      <span class="text-danger"
                        >*</span
                      >
                    </label>
                    <div class="input-group">
                      <input
                        id="password"
                        v-model="
                          formData.password
                        "
                        :type="
                          showPassword
                            ? 'text'
                            : 'password'
                        "
                        class="form-control"
                        :class="{
                          'is-invalid':
                            errors.password,
                        }"
                        :placeholder="
                          $t(
                            'Ingrese contraseña'
                          )
                        "
                        required
                      />
                      <button
                        class="btn btn-outline-secondary"
                        type="button"
                        @click="
                          showPassword =
                            !showPassword
                        "
                      >
                        <i
                          :class="
                            showPassword
                              ? 'bi bi-eye-slash'
                              : 'bi bi-eye'
                          "
                        ></i>
                      </button>
                    </div>
                    <div
                      v-if="errors.password"
                      class="invalid-feedback d-block"
                    >
                      {{ errors.password }}
                    </div>
                    <small
                      class="form-text text-muted"
                    >
                      {{
                        $t(
                          "auth.passwordRequirements"
                        )
                      }}
                    </small>
                  </div>
                </div>

                <!-- Confirmar Contraseña -->
                <div class="mb-3">
                  <label
                    for="confirmPassword"
                    class="form-label"
                  >
                    {{
                      $t("Confirmar contraseña")
                    }}
                    <span class="text-danger"
                      >*</span
                    >
                  </label>
                  <input
                    id="confirmPassword"
                    v-model="
                      formData.confirmPassword
                    "
                    :type="
                      showPassword
                        ? 'text'
                        : 'password'
                    "
                    class="form-control"
                    :class="{
                      'is-invalid':
                        errors.confirmPassword,
                    }"
                    :placeholder="
                      $t(
                        'Confirme contraseña'
                      )
                    "
                    required
                  />
                  <div
                    v-if="errors.confirmPassword"
                    class="invalid-feedback"
                  >
                    {{ errors.confirmPassword }}
                  </div>
                </div>

                <!-- Términos y Condiciones -->
                <div class="mb-4">
                  <div class="form-check">
                    <input
                      id="acceptTerms"
                      v-model="
                        formData.acceptTerms
                      "
                      type="checkbox"
                      class="form-check-input"
                      :class="{
                        'is-invalid':
                          errors.acceptTerms,
                      }"
                    />
                    <label
                      class="form-check-label"
                      for="acceptTerms"
                    >
                      {{ $t("Aceptar nuestros") }}
                      <router-link
                        to="/terminos"
                        target="_blank"
                      >
                        {{ $t("Terminos y condiciones") }}
                      </router-link>
                      {{ $t("y nuestra") }}
                      <router-link
                        to="/politica-privacidad"
                        target="_blank"
                      >
                        {{
                          $t("Politica de privacidad")
                        }}
                      </router-link>
                    </label>
                    <div
                      v-if="errors.acceptTerms"
                      class="invalid-feedback d-block"
                    >
                      {{ errors.acceptTerms }}
                    </div>
                  </div>
                </div>

                <!-- Error General -->
                <div
                  v-if="generalError"
                  class="alert alert-danger"
                  role="alert"
                >
                  <i
                    class="bi bi-exclamation-triangle-fill me-2"
                  ></i>
                  {{ generalError }}
                </div>

                <!-- Botones -->
                <div class="d-grid gap-2">
                  <button
                    type="submit"
                    class="btn btn-primary btn-lg"
                    :disabled="isLoading"
                  >
                    <span v-if="isLoading">
                      <span
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      {{ $t("common.loading") }}
                    </span>
                    <span v-else>
                      <i
                        class="bi bi-person-check me-2"
                      ></i>
                      {{
                        $t("auth.createAccount")
                      }}
                    </span>
                  </button>

                  <router-link
                    to="/login"
                    class="btn btn-outline-secondary"
                  >
                    <i
                      class="bi bi-arrow-left me-2"
                    ></i>
                    {{ $t("Regresar al Inicio") }}
                  </router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { stringifyQuery, useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Roles disponibles
const roles = [
  {
    value: "representante",
    label: "auth.roleParent",
    description: "Rol de representante estudiantil",
    icon: "bi bi-person-fill",
  },
  {
    value: "nutricionista",
    label: "Nutricionista",
    description: "Rol de nutricionista escolar",
    icon: "bi bi-clipboard2-pulse-fill",
  },
  {
    value: "admin",
    label: "Administrador",
    description: "Rol de administrador",
    icon: "bi bi-shield-fill-check",
  },
];

// Estado del formulario
const formData = reactive({
  role: "",
  nombres: "",
  apellidos: "",
  cedula: "",
  telefono: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
});

const errors = ref({});
const generalError = ref("");
const isLoading = ref(false);
const showPassword = ref(false);

// Validaciones
function validateRole() {
  if (!formData.role) {
    errors.value.role = t("Se requiere seleccionar un rol");
  }
}

function validatePersonalInfo() {
  if (!formData.nombres.trim()) {
    errors.value.nombres = t("Se requiere nombres");
  } else if (formData.nombres.length < 2) {
    errors.value.nombres = t("validation.firstNameMin");
  }

  if (!formData.apellidos.trim()) {
    errors.value.apellidos = t("Se requiere apellidos");
  } else if (formData.apellidos.length < 2) {
    errors.value.apellidos = t("validation.lastNameMin");
  }
}

function validateIdentification() {
  if (!formData.cedula) {
    errors.value.cedula = t("Se requiere cédula");
  } else if (!/^\d{10}$/.test(formData.cedula)) {
    errors.value.cedula = t("validation.idInvalid");
  }
}

function validateContact() {
  if (!formData.telefono) {
    errors.value.telefono = t("Se requiere telefóno");
  } else if (!/^\d{9,10}$/.test(formData.telefono)) {
    errors.value.telefono = t("validation.phoneInvalid");
  }

  if (!formData.email) {
    errors.value.email = t("Se requiere correo");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.value.email = t("validation.emailInvalid");
  }
}

function validateCredentials() {
  if (!formData.username) {
    errors.value.username = t("Se requiere nombre de usuario");
  } else if (formData.username.length < 4) {
    errors.value.username = t("validation.usernameMin");
  }

  if (!formData.password) {
    errors.value.password = t("Se requiere contraseña");
  } else if (formData.password.length < 8) {
    errors.value.password = t("validation.passwordMin");
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    errors.value.password = t("validation.passwordStrength");
  }

  if (!formData.confirmPassword) {
    errors.value.confirmPassword = t("Se requiere confirmar contraseña");
  } else if (formData.password !== formData.confirmPassword) {
    errors.value.confirmPassword = t("validation.passwordMismatch");
  }
}

function validateTerms() {
  if (!formData.acceptTerms) {
    errors.value.acceptTerms = t("Se requiere aceptar los terminos, condiciones y politicas de privacidad");
  }
}

function validateForm() {
  errors.value = {};
  
  validateRole();
  validatePersonalInfo();
  validateIdentification();
  validateContact();
  validateCredentials();
  validateTerms();

  return Object.keys(errors.value).length === 0;
}

// Manejar registro
async function handleRegister() {
  generalError.value = "";

  if (!validateForm()) {
    notificationStore.error(
      t("Error al crear cuenta")
    );
    return;
  }

  isLoading.value = true;

  try {
    // Simular registro (reemplazar con API real)
    await new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );

    const userData = {
      username: formData.username,
      email: formData.email,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      cedula: formData.cedula,
      telefono: formData.telefono,
      role: formData.role,
      password: formData.password
    };

    await authStore.register(userData);

    localStorage.setItem("user", JSON.stringify(userData))

    notificationStore.success(
      t("auth.registerSuccess")
    );

    // Redirigir según el rol
    setTimeout(() => {
      if (formData.role === "admin") {
        router.push("/admin");
      } else if (
        formData.role === "nutricionista"
      ) {
        router.push("/nutricionista");
      } else {
        router.push("/usuario");
      }
    }, 1000);
  } catch (error) {
    generalError.value =
      error.message || t("auth.registerError");
    notificationStore.error(generalError.value);
  } finally {
    isLoading.value = false;
  }

  onMounted(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      authStore.user = user; // Si tienes una variable 'user' en tu Pinia store
      console.log("Usuario recuperado del localStorage:", user);
    }
  });

}
</script>

<style scoped>
.register-view {
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
}

.card {
  border-radius: 1rem;
}

.role-card {
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f8f9fa;
}

.role-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.role-card.active {
  background: #0d6efd;
  color: white;
  border-color: #0d6efd !important;
  transform: scale(1.05);
}

.role-card.active i,
.role-card.active h6,
.role-card.active small {
  color: white !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
