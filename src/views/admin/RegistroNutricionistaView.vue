<template>
  <div class="registro-nutricionista-view">
    <!-- Encabezado -->
    <div
      class="d-flex justify-content-between align-items-center mb-4"
    >
      <div>
        <h1 class="h3 mb-1">
          <i
            class="bi bi-clipboard2-pulse-fill me-2"
          ></i>
          {{
            modoEdicion
              ? "Editar Nutricionista"
              : "Nuevo Nutricionista"
          }}
        </h1>
        <p class="text-muted mb-0">
          {{
            modoEdicion
              ? "Actualizar información del nutricionista"
              : "Registrar un nuevo nutricionista en el sistema"
          }}
        </p>
      </div>
      <button
        class="btn btn-outline-secondary"
        @click="volver"
      >
        <i class="bi bi-arrow-left me-2"></i>
        Volver
      </button>
    </div>

    <!-- Formulario -->
    <form @submit.prevent="handleSubmit">
      <!-- Información Personal -->
      <div class="card mb-4">
        <div
          class="card-header bg-primary text-white"
        >
          <h5 class="mb-0">
            <i class="bi bi-person me-2"></i>
            Información Personal
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label
                for="nombres"
                class="form-label required"
              >
                Nombres
              </label>
              <input
                id="nombres"
                v-model="formData.nombres"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.nombres,
                }"
                required
                @input="clearError('nombres')"
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
                class="form-label required"
              >
                Apellidos
              </label>
              <input
                id="apellidos"
                v-model="formData.apellidos"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.apellidos,
                }"
                required
                @input="clearError('apellidos')"
              />
              <div
                v-if="errors.apellidos"
                class="invalid-feedback"
              >
                {{ errors.apellidos }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="cedula"
                class="form-label required"
              >
                Cédula
              </label>
              <input
                id="cedula"
                v-model="formData.cedula"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.cedula,
                }"
                maxlength="10"
                required
                @input="clearError('cedula')"
              />
              <div
                v-if="errors.cedula"
                class="invalid-feedback"
              >
                {{ errors.cedula }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="telefono"
                class="form-label required"
              >
                Teléfono
              </label>
              <input
                id="telefono"
                v-model="formData.telefono"
                type="tel"
                class="form-control"
                :class="{
                  'is-invalid': errors.telefono,
                }"
                maxlength="10"
                required
                @input="clearError('telefono')"
              />
              <div
                v-if="errors.telefono"
                class="invalid-feedback"
              >
                {{ errors.telefono }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="email"
                class="form-label required"
              >
                Email
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                class="form-control"
                :class="{
                  'is-invalid': errors.email,
                }"
                required
                @input="clearError('email')"
              />
              <div
                v-if="errors.email"
                class="invalid-feedback"
              >
                {{ errors.email }}
              </div>
            </div>

            <div class="col-md-12">
              <label
                for="direccion"
                class="form-label"
              >
                Dirección
              </label>
              <textarea
                id="direccion"
                v-model="formData.direccion"
                class="form-control"
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Información Profesional -->
      <div class="card mb-4">
        <div
          class="card-header bg-success text-white"
        >
          <h5 class="mb-0">
            <i class="bi bi-mortarboard me-2"></i>
            Información Profesional
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label
                for="titulo"
                class="form-label required"
              >
                Título Profesional
              </label>
              <select
                id="titulo"
                v-model="formData.titulo"
                class="form-select"
                :class="{
                  'is-invalid': errors.titulo,
                }"
                required
                @change="clearError('titulo')"
              >
                <option value="">
                  Seleccione...
                </option>
                <option
                  value="Licenciado/a en Nutrición"
                >
                  Licenciado/a en Nutrición
                </option>
                <option
                  value="Licenciado/a en Nutrición y Dietética"
                >
                  Licenciado/a en Nutrición y
                  Dietética
                </option>
                <option
                  value="Magíster en Nutrición Clínica"
                >
                  Magíster en Nutrición Clínica
                </option>
                <option
                  value="Magíster en Nutrición Pública"
                >
                  Magíster en Nutrición Pública
                </option>
                <option
                  value="Doctor/a en Nutrición"
                >
                  Doctor/a en Nutrición
                </option>
              </select>
              <div
                v-if="errors.titulo"
                class="invalid-feedback"
              >
                {{ errors.titulo }}
              </div>
            </div>

            <div class="col-md-6">
              <label
                for="registroProfesional"
                class="form-label required"
              >
                Registro Profesional (MSP)
              </label>
              <input
                id="registroProfesional"
                v-model="
                  formData.registroProfesional
                "
                type="text"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.registroProfesional,
                }"
                placeholder="MSP-YYYY-XXXXX"
                required
                @input="
                  clearError(
                    'registroProfesional'
                  )
                "
              />
              <div
                v-if="errors.registroProfesional"
                class="invalid-feedback"
              >
                {{ errors.registroProfesional }}
              </div>
              <small class="form-text text-muted">
                Ejemplo: MSP-2023-12345
              </small>
            </div>

            <div class="col-md-4">
              <label
                for="aniosExperiencia"
                class="form-label required"
              >
                Años de Experiencia
              </label>
              <input
                id="aniosExperiencia"
                v-model.number="
                  formData.aniosExperiencia
                "
                type="number"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.aniosExperiencia,
                }"
                min="0"
                max="50"
                required
                @input="
                  clearError('aniosExperiencia')
                "
              />
              <div
                v-if="errors.aniosExperiencia"
                class="invalid-feedback"
              >
                {{ errors.aniosExperiencia }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="fechaIngreso"
                class="form-label required"
              >
                Fecha de Ingreso
              </label>
              <input
                id="fechaIngreso"
                v-model="formData.fechaIngreso"
                type="date"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.fechaIngreso,
                }"
                :max="fechaMaxima"
                required
                @input="
                  clearError('fechaIngreso')
                "
              />
              <div
                v-if="errors.fechaIngreso"
                class="invalid-feedback"
              >
                {{ errors.fechaIngreso }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="estado"
                class="form-label required"
              >
                Estado
              </label>
              <select
                id="estado"
                v-model="formData.estado"
                class="form-select"
                :class="{
                  'is-invalid': errors.estado,
                }"
                required
                @change="clearError('estado')"
              >
                <option value="activo">
                  Activo
                </option>
                <option value="inactivo">
                  Inactivo
                </option>
                <option value="vacaciones">
                  Vacaciones
                </option>
              </select>
              <div
                v-if="errors.estado"
                class="invalid-feedback"
              >
                {{ errors.estado }}
              </div>
            </div>

            <div class="col-md-12">
              <label for="especialidades-select" class="form-label">
                <i
                  class="bi bi-star-fill me-1 text-warning"
                ></i>
                Especialidades
              </label>
              <div class="mb-2">
                <div
                  v-for="(
                    especialidad, index
                  ) in formData.especialidades"
                  :key="index"
                  class="badge bg-success me-2 mb-2"
                >
                  {{ especialidad }}
                  <button
                    type="button"
                    class="btn-close btn-close-white btn-close-sm ms-2"
                    @click="
                      eliminarEspecialidad(index)
                    "
                  ></button>
                </div>
              </div>
              <div class="input-group">
                <select
                  id="especialidades-select"
                  v-model="nuevaEspecialidad"
                  class="form-select"
                >
                  <option value="">
                    Seleccione una especialidad...
                  </option>
                  <option
                    value="Nutrición Infantil"
                  >
                    Nutrición Infantil
                  </option>
                  <option
                    value="Nutrición Deportiva"
                  >
                    Nutrición Deportiva
                  </option>
                  <option
                    value="Nutrición Clínica"
                  >
                    Nutrición Clínica
                  </option>
                  <option
                    value="Nutrición Comunitaria"
                  >
                    Nutrición Comunitaria
                  </option>
                  <option value="Dietoterapia">
                    Dietoterapia
                  </option>
                  <option
                    value="Educación Nutricional"
                  >
                    Educación Nutricional
                  </option>
                </select>
                <button
                  type="button"
                  class="btn btn-outline-success"
                  @click="agregarEspecialidad"
                >
                  <i
                    class="bi bi-plus-circle"
                  ></i>
                  Agregar
                </button>
              </div>
              <small class="form-text text-muted">
                Seleccione las especialidades del
                nutricionista
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Credenciales de Acceso -->
      <div v-if="!modoEdicion" class="card mb-4">
        <div
          class="card-header bg-info text-white"
        >
          <h5 class="mb-0">
            <i class="bi bi-shield-lock me-2"></i>
            Credenciales de Acceso
          </h5>
        </div>
        <div class="card-body">
          <div class="alert alert-info">
            <i class="bi bi-info-circle me-2"></i>
            Estas credenciales se usarán para el
            acceso al sistema
          </div>
          <div class="row g-3">
            <div class="col-md-4">
              <label
                for="username"
                class="form-label required"
              >
                Usuario
              </label>
              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.username,
                }"
                required
                @input="clearError('username')"
              />
              <div
                v-if="errors.username"
                class="invalid-feedback"
              >
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="password"
                class="form-label required"
              >
                Contraseña
              </label>
              <div class="input-group">
                <input
                  id="password"
                  v-model="formData.password"
                  :type="
                    mostrarPassword
                      ? 'text'
                      : 'password'
                  "
                  class="form-control"
                  :class="{
                    'is-invalid': errors.password,
                  }"
                  required
                  @input="clearError('password')"
                />
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  @click="
                    mostrarPassword =
                      !mostrarPassword
                  "
                >
                  <i
                    :class="
                      mostrarPassword
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
                {{ errors.password }}
              </div>
              <small class="form-text text-muted">
                Mínimo 8 caracteres, incluya
                mayúsculas, minúsculas y números
              </small>
            </div>

            <div class="col-md-4">
              <label
                for="passwordConfirm"
                class="form-label required"
              >
                Confirmar Contraseña
              </label>
              <input
                id="passwordConfirm"
                v-model="formData.passwordConfirm"
                :type="
                  mostrarPassword
                    ? 'text'
                    : 'password'
                "
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.passwordConfirm,
                }"
                required
                @input="
                  clearError('passwordConfirm')
                "
              />
              <div
                v-if="errors.passwordConfirm"
                class="invalid-feedback"
              >
                {{ errors.passwordConfirm }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información Adicional -->
      <div class="card mb-4">
        <div
          class="card-header bg-warning text-dark"
        >
          <h5 class="mb-0">
            <i
              class="bi bi-journal-text me-2"
            ></i>
            Información Adicional
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-12">
              <label
                for="biografia"
                class="form-label"
              >
                Biografía Profesional
              </label>
              <textarea
                id="biografia"
                v-model="formData.biografia"
                class="form-control"
                rows="4"
                placeholder="Breve descripción de la experiencia y logros profesionales..."
              ></textarea>
            </div>

            <div class="col-md-12">
              <label
                for="observaciones"
                class="form-label"
              >
                Observaciones
              </label>
              <textarea
                id="observaciones"
                v-model="formData.observaciones"
                class="form-control"
                rows="3"
                placeholder="Notas adicionales o información relevante..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="card">
        <div class="card-body">
          <div
            class="d-flex justify-content-between"
          >
            <button
              type="button"
              class="btn btn-outline-secondary"
              @click="volver"
            >
              <i class="bi bi-x-circle me-2"></i>
              Cancelar
            </button>
            <div class="d-flex gap-2">
              <button
                v-if="!modoEdicion"
                type="button"
                class="btn btn-outline-primary"
                @click="limpiarFormulario"
              >
                <i
                  class="bi bi-arrow-clockwise me-2"
                ></i>
                Limpiar
              </button>
              <button
                type="submit"
                class="btn btn-primary"
                :disabled="isLoading"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                ></span>
                <i
                  v-else
                  class="bi bi-save me-2"
                ></i>
                {{
                  modoEdicion
                    ? "Actualizar"
                    : "Registrar"
                }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotificationStore } from "@/stores/notification";

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();

const modoEdicion = computed(
  () => !!route.params.id
);
const isLoading = ref(false);
const mostrarPassword = ref(false);

// Datos del formulario
const formData = ref({
  nombres: "",
  apellidos: "",
  cedula: "",
  telefono: "",
  email: "",
  direccion: "",
  titulo: "",
  registroProfesional: "",
  aniosExperiencia: 0,
  fechaIngreso: "",
  estado: "activo",
  especialidades: [],
  biografia: "",
  observaciones: "",
  username: "",
  password: "",
  passwordConfirm: "",
});

const errors = ref({});
const nuevaEspecialidad = ref("");

const fechaMaxima = computed(() => {
  return new Date().toISOString().split("T")[0];
});

// Funciones
function agregarEspecialidad() {
  if (
    nuevaEspecialidad.value &&
    !formData.value.especialidades.includes(
      nuevaEspecialidad.value
    )
  ) {
    formData.value.especialidades.push(
      nuevaEspecialidad.value
    );
    nuevaEspecialidad.value = "";
  }
}

function eliminarEspecialidad(index) {
  formData.value.especialidades.splice(index, 1);
}

function clearError(field) {
  if (errors.value[field]) {
    delete errors.value[field];
  }
}

function validarDatosPersonales() {
  if (!formData.value.nombres.trim()) {
    errors.value.nombres = "Los nombres son requeridos";
  }

  if (!formData.value.apellidos.trim()) {
    errors.value.apellidos = "Los apellidos son requeridos";
  }

  if (!formData.value.cedula) {
    errors.value.cedula = "La cédula es requerida";
  } else if (formData.value.cedula.length !== 10) {
    errors.value.cedula = "La cédula debe tener 10 dígitos";
  }

  if (!formData.value.telefono) {
    errors.value.telefono = "El teléfono es requerido";
  } else if (formData.value.telefono.length < 9) {
    errors.value.telefono = "El teléfono debe tener al menos 9 dígitos";
  }

  if (!formData.value.email) {
    errors.value.email = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    errors.value.email = "El email no es válido";
  }
}

function validarDatosProfesionales() {
  if (!formData.value.titulo) {
    errors.value.titulo = "El título profesional es requerido";
  }

  if (!formData.value.registroProfesional) {
    errors.value.registroProfesional = "El registro profesional es requerido";
  }

  if (formData.value.aniosExperiencia < 0) {
    errors.value.aniosExperiencia = "Los años de experiencia no pueden ser negativos";
  }

  if (!formData.value.fechaIngreso) {
    errors.value.fechaIngreso = "La fecha de ingreso es requerida";
  }
}

function validarCredenciales() {
  if (!formData.value.username) {
    errors.value.username = "El usuario es requerido";
  } else if (formData.value.username.length < 4) {
    errors.value.username = "El usuario debe tener al menos 4 caracteres";
  }

  if (!formData.value.password) {
    errors.value.password = "La contraseña es requerida";
  } else if (formData.value.password.length < 8) {
    errors.value.password = "La contraseña debe tener al menos 8 caracteres";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.value.password)) {
    errors.value.password = "La contraseña debe incluir mayúsculas, minúsculas y números";
  }

  if (!formData.value.passwordConfirm) {
    errors.value.passwordConfirm = "Debe confirmar la contraseña";
  } else if (formData.value.password !== formData.value.passwordConfirm) {
    errors.value.passwordConfirm = "Las contraseñas no coinciden";
  }
}

function validarFormulario() {
  errors.value = {};

  validarDatosPersonales();
  validarDatosProfesionales();

  if (!modoEdicion.value) {
    validarCredenciales();
  }

  return Object.keys(errors.value).length === 0;
}

async function handleSubmit() {
  if (!validarFormulario()) {
    notificationStore.addNotification({
      type: "error",
      message:
        "Por favor corrija los errores en el formulario",
    });
    return;
  }

  isLoading.value = true;

  try {
    // Simular llamada a API
    await new Promise((resolve) =>
      setTimeout(resolve, 1500)
    );

    if (modoEdicion.value) {
      notificationStore.addNotification({
        type: "success",
        message:
          "Nutricionista actualizado correctamente",
      });
    } else {
      notificationStore.addNotification({
        type: "success",
        message:
          "Nutricionista registrado correctamente",
      });
    }

    router.push({ name: "admin-nutricionistas" });
  } catch (error) {
    console.error("Error al guardar el nutricionista:", error);
    notificationStore.addNotification({
      type: "error",
      message:
        "Error al guardar el nutricionista",
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
    direccion: "",
    titulo: "",
    registroProfesional: "",
    aniosExperiencia: 0,
    fechaIngreso: "",
    estado: "activo",
    especialidades: [],
    biografia: "",
    observaciones: "",
    username: "",
    password: "",
    passwordConfirm: "",
  };
  errors.value = {};
}

function volver() {
  router.push({ name: "admin-nutricionistas" });
}

// Cargar datos si es modo edición
if (modoEdicion.value) {
  formData.value = {
    nombres: "Patricia Elena",
    apellidos: "Morales Sánchez",
    cedula: "0912345678",
    telefono: "0998765432",
    email: "patricia.morales@nutricion.com",
    direccion: "Av. Principal 456",
    titulo: "Licenciado/a en Nutrición",
    registroProfesional: "MSP-2023-12345",
    aniosExperiencia: 8,
    fechaIngreso: "2023-01-15",
    estado: "activo",
    especialidades: [
      "Nutrición Infantil",
      "Educación Nutricional",
    ],
    biografia:
      "Nutricionista con amplia experiencia en el área de nutrición infantil y educación nutricional.",
    observaciones:
      "Especializada en menús escolares",
    username: "",
    password: "",
    passwordConfirm: "",
  };
}
</script>

<style scoped>
.registro-nutricionista-view {
  padding: 0;
}

.required::after {
  content: " *";
  color: #dc3545;
}

.card-header {
  font-weight: 600;
}

.badge {
  font-size: 0.875rem;
  padding: 0.5em 0.75em;
}

.btn-close-sm {
  padding: 0;
  width: 0.5em;
  height: 0.5em;
  background-size: 0.5em;
  opacity: 0.7;
}

.btn-close-sm:hover {
  opacity: 1;
}

.form-text {
  display: block;
  margin-top: 0.25rem;
}
</style>
