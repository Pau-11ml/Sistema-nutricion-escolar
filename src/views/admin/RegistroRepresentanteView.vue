<template>
  <div class="registro-representante-view">
    <!-- Encabezado -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="h3 mb-1">
          <i class="bi bi-person-badge-fill me-2"></i>
          {{ isEditing ? 'Editar Representante' : 'Nuevo Representante' }}
        </h1>
        <p class="text-muted mb-0">
          {{ isEditing ? 'Actualizar información del representante' : 'Registrar un nuevo representante en el sistema' }}
        </p>
      </div>
      <button class="btn btn-outline-secondary" @click="volver">
        <i class="bi bi-arrow-left me-2"></i>
        Volver
      </button>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit">
      <!-- Información Personal -->
      <div class="card mb-4">
        <div class="card-header bg-primary text-white">
          <h5 class="mb-0">
            <i class="bi bi-person me-2"></i>
            Información Personal
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label for="nombres" class="form-label required">
                Nombres
              </label>
              <input
                id="nombres"
                v-model="formData.nombres"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.nombres }"
                placeholder="Ingrese los nombres"
                required
                @input="clearError('nombres')"
              />
              <div v-if="errors.nombres" class="invalid-feedback">
                {{ errors.nombres }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="apellidos" class="form-label required">
                Apellidos
              </label>
              <input
                id="apellidos"
                v-model="formData.apellidos"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.apellidos }"
                placeholder="Ingrese los apellidos"
                required
                @input="clearError('apellidos')"
              />
              <div v-if="errors.apellidos" class="invalid-feedback">
                {{ errors.apellidos }}
              </div>
            </div>

            <div class="col-md-4">
              <label for="cedula" class="form-label required">
                Cédula
              </label>
              <input
                id="cedula"
                v-model="formData.cedula"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.cedula }"
                placeholder="1234567890"
                maxlength="10"
                required
                @input="clearError('cedula')"
              />
              <div v-if="errors.cedula" class="invalid-feedback">
                {{ errors.cedula }}
              </div>
            </div>

            <div class="col-md-4">
              <label for="telefono" class="form-label required">
                Teléfono
              </label>
              <input
                id="telefono"
                v-model="formData.telefono"
                type="tel"
                class="form-control"
                :class="{ 'is-invalid': errors.telefono }"
                placeholder="0999999999"
                maxlength="10"
                required
                @input="clearError('telefono')"
              />
              <div v-if="errors.telefono" class="invalid-feedback">
                {{ errors.telefono }}
              </div>
            </div>

            <div class="col-md-4">
              <label for="email" class="form-label required">
                Email
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                placeholder="ej: jose_pacheco@gmail.com"
                required
                @input="clearError('email')"
              />
              <div v-if="errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Credenciales de Acceso -->
      <div class="card mb-4">
        <div class="card-header bg-info text-white">
          <h5 class="mb-0">
            <i class="bi bi-shield-lock me-2"></i>
            Credenciales de Acceso
          </h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Estas credenciales se usarán para el acceso al sistema
          </div>
          <div class="row g-3">
            <div class="col-md-12">
              <label for="username" class="form-label required">
                Usuario
              </label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.username }"
                placeholder="PachecoJ"
                required
                @input="clearError('username')"
              />
              <div v-if="errors.username" class="invalid-feedback">
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6">
              <label for="password" class="form-label required">
                Contraseña
              </label>
              <div class="input-group">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="mostrarPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="Ingrese contraseña"
                  required
                  @input="clearError('password')"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="mostrarPassword = !mostrarPassword"
                >
                  <i :class="mostrarPassword ? 'bi-eye-slash' : 'bi-eye'"></i>
                </button>
              </div>
              <div v-if="errors.password" class="invalid-feedback d-block">
                {{ errors.password }}
              </div>
              <small class="form-text text-muted">
                Mínimo 8 caracteres, incluya mayúsculas, minúsculas y números
              </small>
            </div>

            <div class="col-md-6">
              <label for="confirmPassword" class="form-label required">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                v-model="formData.confirmPassword"
                :type="mostrarPassword ? 'text' : 'password'"
                class="form-control"
                :class="{ 'is-invalid': errors.confirmPassword }"
                placeholder="Confirme contraseña"
                required
                @input="clearError('confirmPassword')"
              />
              <div v-if="errors.confirmPassword" class="invalid-feedback">
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="card">
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <button type="button" class="btn btn-outline-secondary" @click="volver">
              <i class="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
            <div class="d-flex gap-2">
              <button type="button" class="btn btn-outline-primary" @click="limpiarFormulario">
                <i class="bi bi-arrow-clockwise me-2"></i>
                Limpiar
              </button>
              <button type="submit" class="btn btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                <i v-else class="bi bi-save me-2"></i>
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotificationStore } from "@/stores/notification";
import { useRepresentativesStore } from "@/stores/representatives";

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();
const representativesStore = useRepresentativesStore();

const isLoading = ref(false);
const mostrarPassword = ref(false);
const isEditing = ref(false);
const representanteId = ref(null);

// Datos del formulario
const formData = ref({
  nombres: "",
  apellidos: "",
  cedula: "",
  telefono: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
  estado: "activo"
});

const errors = ref({});

// Cargar datos si es edición
onMounted(() => {
  if (route.params.id) {
    isEditing.value = true;
    representanteId.value = route.params.id;
    cargarRepresentante();
  }
});

function cargarRepresentante() {
  const representante = representativesStore.getRepresentativeById(representanteId.value);
  if (representante) {
    formData.value = {
      nombres: representante.nombres,
      apellidos: representante.apellidos,
      cedula: representante.cedula,
      telefono: representante.telefono,
      email: representante.email,
      username: representante.username,
      password: "",
      confirmPassword: "",
      estado: representante.estado || "activo"
    };
  }
}

// Funciones
function clearError(field) {
  if (errors.value[field]) {
    delete errors.value[field];
  }
}

function validarFormulario() {
  errors.value = {};

  // Validar nombres
  if (!formData.value.nombres.trim()) {
    errors.value.nombres = "Los nombres son requeridos";
  }

  // Validar apellidos
  if (!formData.value.apellidos.trim()) {
    errors.value.apellidos = "Los apellidos son requeridos";
  }

  // Validar cédula
  if (!formData.value.cedula) {
    errors.value.cedula = "La cédula es requerida";
  } else if (formData.value.cedula.length !== 10) {
    errors.value.cedula = "La cédula debe tener exactamente 10 dígitos";
  }

  // Validar teléfono
  if (!formData.value.telefono) {
    errors.value.telefono = "El teléfono es requerido";
  } else if (formData.value.telefono.length < 9) {
    errors.value.telefono = "El teléfono debe tener al menos 9 dígitos";
  }

  // Validar email
  if (!formData.value.email) {
    errors.value.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = "El email no es válido";
  }

  // Validar username
  if (!formData.value.username) {
    errors.value.username = "El usuario es requerido";
  } else if (formData.value.username.length < 4) {
    errors.value.username = "El usuario debe tener al menos 4 caracteres";
  }

  // Validar contraseña (solo si es nuevo o si se ingresó algo)
  if (!isEditing.value || formData.value.password) {
    if (!formData.value.password) {
      errors.value.password = "La contraseña es requerida";
    } else if (formData.value.password.length < 8) {
      errors.value.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.value.password)) {
      errors.value.password = "La contraseña debe incluir mayúsculas, minúsculas y números";
    }
  }

  // Validar confirmación de contraseña
  if (!isEditing.value || formData.value.password) {
    if (!formData.value.confirmPassword) {
      errors.value.confirmPassword = "Debe confirmar la contraseña";
    } else if (formData.value.password !== formData.value.confirmPassword) {
      errors.value.confirmPassword = "Las contraseñas no coinciden";
    }
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validarFormulario()) {
    notificationStore.addNotification({
      type: "error",
      message: "Por favor corrija los errores en el formulario"
    });
    return;
  }

  isLoading.value = true;

  try {
    // Preparar datos del representante
    const representanteData = {
      nombres: formData.value.nombres,
      apellidos: formData.value.apellidos,
      cedula: formData.value.cedula,
      telefono: formData.value.telefono,
      email: formData.value.email,
      username: formData.value.username,
      estado: formData.value.estado
    };

    // Solo incluir password si se ingresó (nuevo o cambio)
    if (formData.value.password) {
      representanteData.password = formData.value.password;
    }

    if (isEditing.value) {
      // Actualizar representante existente
      representativesStore.updateRepresentative(representanteId.value, representanteData);
      notificationStore.addNotification({
        type: "success",
        message: "Representante actualizado correctamente"
      });
    } else {
      // Crear nuevo representante
      representativesStore.addRepresentative(representanteData);
      notificationStore.addNotification({
        type: "success",
        message: "Representante registrado correctamente"
      });
    }

    router.push({ name: "admin-representantes" });
  } catch (error) {
    console.error("Error al guardar el representante:", error);
    notificationStore.addNotification({
      type: "error",
      message: "Error al guardar el representante"
    });
  } finally {
    isLoading.value = false;
  }
}

function limpiarFormulario() {
  formData.value = {
    nombres: "",
    apellidos: "",
    cedula: "",
    telefono: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    estado: "activo"
  };
  errors.value = {};
}

function volver() {
  router.push({ name: "admin-representantes" });
}
</script>

<style scoped>
.registro-representante-view {
  padding: 0;
}

.required::after {
  content: " *";
  color: #dc3545;
}

.card-header {
  font-weight: 600;
}

.form-text {
  display: block;
  margin-top: 0.25rem;
}
</style>
