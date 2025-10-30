<template>
  <div class="registro-estudiante-view">
    <!-- Encabezado -->
    <div
      class="d-flex justify-content-between align-items-center mb-4"
    >
      <div>
        <h1 class="h3 mb-1">
          <i
            class="bi bi-person-plus-fill me-2"
          ></i>
          {{
            modoEdicion
              ? "Editar Estudiante"
              : "Nuevo Estudiante"
          }}
        </h1>
        <p class="text-muted mb-0">
          {{
            modoEdicion
              ? "Actualizar información del estudiante"
              : "Registrar un nuevo estudiante en el sistema"
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
                for="fechaNacimiento"
                class="form-label required"
              >
                Fecha de Nacimiento
              </label>
              <input
                id="fechaNacimiento"
                v-model="formData.fechaNacimiento"
                type="date"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.fechaNacimiento,
                }"
                :max="fechaMaxima"
                required
                @input="
                  clearError('fechaNacimiento')
                "
              />
              <div
                v-if="errors.fechaNacimiento"
                class="invalid-feedback"
              >
                {{ errors.fechaNacimiento }}
              </div>
              <small
                v-if="formData.fechaNacimiento"
                class="form-text text-muted"
              >
                Edad:
                {{
                  calcularEdad(
                    formData.fechaNacimiento
                  )
                }}
                años
              </small>
            </div>

            <div class="col-md-4">
              <label
                for="genero"
                class="form-label required"
              >
                Género
              </label>
              <select
                id="genero"
                v-model="formData.genero"
                class="form-select"
                :class="{
                  'is-invalid': errors.genero,
                }"
                required
                @change="clearError('genero')"
              >
                <option value="">
                  Seleccione...
                </option>
                <option value="Masculino">
                  Masculino
                </option>
                <option value="Femenino">
                  Femenino
                </option>
              </select>
              <div
                v-if="errors.genero"
                class="invalid-feedback"
              >
                {{ errors.genero }}
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

      <!-- Información Académica -->
      <div class="card mb-4">
        <div
          class="card-header bg-success text-white"
        >
          <h5 class="mb-0">
            <i class="bi bi-mortarboard me-2"></i>
            Información Académica
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <label
                for="grado"
                class="form-label required"
              >
                Grado
              </label>
              <select
                id="grado"
                v-model="formData.grado"
                class="form-select"
                :class="{
                  'is-invalid': errors.grado,
                }"
                required
                @change="clearError('grado')"
              >
                <option value="">
                  Seleccione...
                </option>
                <option
                  v-for="grado in grados"
                  :key="grado"
                  :value="grado"
                >
                  {{ grado }}
                </option>
              </select>
              <div
                v-if="errors.grado"
                class="invalid-feedback"
              >
                {{ errors.grado }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="paralelo"
                class="form-label required"
              >
                Paralelo
              </label>
              <select
                id="paralelo"
                v-model="formData.paralelo"
                class="form-select"
                :class="{
                  'is-invalid': errors.paralelo,
                }"
                required
                @change="clearError('paralelo')"
              >
                <option value="">
                  Seleccione...
                </option>
                <option
                  v-for="paralelo in paralelos"
                  :key="paralelo"
                  :value="paralelo"
                >
                  {{ paralelo }}
                </option>
              </select>
              <div
                v-if="errors.paralelo"
                class="invalid-feedback"
              >
                {{ errors.paralelo }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="anioLectivo"
                class="form-label required"
              >
                Año Lectivo
              </label>
              <select
                id="anioLectivo"
                v-model="formData.anioLectivo"
                class="form-select"
                :class="{
                  'is-invalid':
                    errors.anioLectivo,
                }"
                required
                @change="
                  clearError('anioLectivo')
                "
              >
                <option value="">
                  Seleccione...
                </option>
                <option
                  v-for="anio in aniosLectivos"
                  :key="anio"
                  :value="anio"
                >
                  {{ anio }}
                </option>
              </select>
              <div
                v-if="errors.anioLectivo"
                class="invalid-feedback"
              >
                {{ errors.anioLectivo }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Información de Salud -->
      <div class="card mb-4">
        <div
          class="card-header bg-warning text-dark"
        >
          <h5 class="mb-0">
            <i class="bi bi-heart-pulse me-2"></i>
            Información de Salud
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-12">
              <label for="alergias" class="form-label">
                <i
                  class="bi bi-exclamation-triangle me-1"
                ></i>
                Alergias Alimentarias
              </label>
              <div class="mb-2">
                <div
                  v-for="(
                    alergia, index
                  ) in formData.alergias"
                  :key="index"
                  class="badge bg-warning text-dark me-2 mb-2"
                >
                  {{ alergia }}
                  <button
                    type="button"
                    class="btn-close btn-close-sm ms-2"
                    @click="
                      eliminarAlergia(index)
                    "
                  ></button>
                </div>
              </div>
              <div class="input-group">
                <input
                  id="alergias"
                  v-model="nuevaAlergia"
                  type="text"
                  class="form-control"
                  placeholder="Agregar alergia..."
                  @keyup.enter="agregarAlergia"
                />
                <button
                  type="button"
                  class="btn btn-outline-warning"
                  @click="agregarAlergia"
                >
                  <i
                    class="bi bi-plus-circle"
                  ></i>
                  Agregar
                </button>
              </div>
              <small class="form-text text-muted">
                Presione Enter o haga clic en
                Agregar para añadir una alergia
              </small>
            </div>

            <div class="col-md-12">
              <label
                for="observaciones"
                class="form-label"
              >
                Observaciones Médicas
              </label>
              <textarea
                id="observaciones"
                v-model="formData.observaciones"
                class="form-control"
                rows="3"
                placeholder="Ingrese cualquier observación médica relevante..."
              ></textarea>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del Representante -->
      <div class="card mb-4">
        <div
          class="card-header bg-info text-white"
        >
          <h5 class="mb-0">
            <i
              class="bi bi-person-badge me-2"
            ></i>
            Información del Representante
          </h5>
        </div>
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-6">
              <label
                for="representanteNombre"
                class="form-label required"
              >
                Nombre Completo
              </label>
              <input
                id="representanteNombre"
                v-model="
                  formData.representante.nombre
                "
                type="text"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.representanteNombre,
                }"
                required
                @input="
                  clearError(
                    'representanteNombre'
                  )
                "
              />
              <div
                v-if="errors.representanteNombre"
                class="invalid-feedback"
              >
                {{ errors.representanteNombre }}
              </div>
            </div>

            <div class="col-md-6">
              <label
                for="representanteCedula"
                class="form-label required"
              >
                Cédula
              </label>
              <input
                id="representanteCedula"
                v-model="
                  formData.representante.cedula
                "
                type="text"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.representanteCedula,
                }"
                maxlength="10"
                required
                @input="
                  clearError(
                    'representanteCedula'
                  )
                "
              />
              <div
                v-if="errors.representanteCedula"
                class="invalid-feedback"
              >
                {{ errors.representanteCedula }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="representanteTelefono"
                class="form-label required"
              >
                Teléfono
              </label>
              <input
                id="representanteTelefono"
                v-model="
                  formData.representante.telefono
                "
                type="tel"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.representanteTelefono,
                }"
                maxlength="10"
                required
                @input="
                  clearError(
                    'representanteTelefono'
                  )
                "
              />
              <div
                v-if="
                  errors.representanteTelefono
                "
                class="invalid-feedback"
              >
                {{ errors.representanteTelefono }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="representanteEmail"
                class="form-label required"
              >
                Email
              </label>
              <input
                id="representanteEmail"
                v-model="
                  formData.representante.email
                "
                type="email"
                class="form-control"
                :class="{
                  'is-invalid':
                    errors.representanteEmail,
                }"
                required
                @input="
                  clearError('representanteEmail')
                "
              />
              <div
                v-if="errors.representanteEmail"
                class="invalid-feedback"
              >
                {{ errors.representanteEmail }}
              </div>
            </div>

            <div class="col-md-4">
              <label
                for="representanteParentesco"
                class="form-label required"
              >
                Parentesco
              </label>
              <select
                id="representanteParentesco"
                v-model="
                  formData.representante
                    .parentesco
                "
                class="form-select"
                :class="{
                  'is-invalid':
                    errors.representanteParentesco,
                }"
                required
                @change="
                  clearError(
                    'representanteParentesco'
                  )
                "
              >
                <option value="">
                  Seleccione...
                </option>
                <option value="Padre">
                  Padre
                </option>
                <option value="Madre">
                  Madre
                </option>
                <option value="Abuelo/a">
                  Abuelo/a
                </option>
                <option value="Tío/a">
                  Tío/a
                </option>
                <option value="Hermano/a">
                  Hermano/a
                </option>
                <option value="Tutor legal">
                  Tutor legal
                </option>
                <option value="Otro">Otro</option>
              </select>
              <div
                v-if="
                  errors.representanteParentesco
                "
                class="invalid-feedback"
              >
                {{
                  errors.representanteParentesco
                }}
              </div>
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

// Datos del formulario
const formData = ref({
  nombres: "",
  apellidos: "",
  cedula: "",
  fechaNacimiento: "",
  genero: "",
  direccion: "",
  grado: "",
  paralelo: "",
  anioLectivo: "",
  alergias: [],
  observaciones: "",
  representante: {
    nombre: "",
    cedula: "",
    telefono: "",
    email: "",
    parentesco: "",
  },
  estado: "activo",
});

const errors = ref({});
const nuevaAlergia = ref("");

// Datos para selects
const grados = [
  "1ro EGB",
  "2do EGB",
  "3ro EGB",
  "4to EGB",
  "5to EGB",
  "6to EGB",
  "7mo EGB",
  "8vo EGB",
  "9no EGB",
  "10mo EGB",
];

const paralelos = ["A", "B", "C", "D", "E"];

const aniosLectivos = computed(() => {
  const anioActual = new Date().getFullYear();
  const anios = [];
  for (let i = -1; i <= 1; i++) {
    const anio = anioActual + i;
    anios.push(`${anio}-${anio + 1}`);
  }
  return anios;
});

const fechaMaxima = computed(() => {
  const hoy = new Date();
  hoy.setFullYear(hoy.getFullYear() - 5); // Mínimo 5 años
  return hoy.toISOString().split("T")[0];
});

// Funciones
function calcularEdad(fechaNacimiento) {
  if (!fechaNacimiento) {
    return 0;
  }
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad =
    hoy.getFullYear() - nacimiento.getFullYear();
  const mes =
    hoy.getMonth() - nacimiento.getMonth();

  if (
    mes < 0 ||
    (mes === 0 &&
      hoy.getDate() < nacimiento.getDate())
  ) {
    edad--;
  }

  return edad;
}

function agregarAlergia() {
  if (nuevaAlergia.value.trim()) {
    if (
      !formData.value.alergias.includes(
        nuevaAlergia.value.trim()
      )
    ) {
      formData.value.alergias.push(
        nuevaAlergia.value.trim()
      );
      nuevaAlergia.value = "";
    }
  }
}

function eliminarAlergia(index) {
  formData.value.alergias.splice(index, 1);
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
  if (formData.value.fechaNacimiento) {
    const edad = calcularEdad(formData.value.fechaNacimiento);
    if (edad < 5 || edad > 18) {
      errors.value.fechaNacimiento = "La edad debe estar entre 5 y 18 años";
    }
  } else {
    errors.value.fechaNacimiento = "La fecha de nacimiento es requerida";
  }
  if (!formData.value.genero) {
    errors.value.genero = "El género es requerido";
  }
}

function validarDatosAcademicos() {
  if (!formData.value.grado) {
    errors.value.grado = "El grado es requerido";
  }
  if (!formData.value.paralelo) {
    errors.value.paralelo = "El paralelo es requerido";
  }
  if (!formData.value.anioLectivo) {
    errors.value.anioLectivo = "El año lectivo es requerido";
  }
}

function validarRepresentante() {
  if (!formData.value.representante.nombre.trim()) {
    errors.value.representanteNombre = "El nombre del representante es requerido";
  }
  if (!formData.value.representante.cedula) {
    errors.value.representanteCedula = "La cédula del representante es requerida";
  } else if (formData.value.representante.cedula.length !== 10) {
    errors.value.representanteCedula = "La cédula debe tener 10 dígitos";
  }
  if (!formData.value.representante.telefono) {
    errors.value.representanteTelefono = "El teléfono es requerido";
  } else if (formData.value.representante.telefono.length < 9) {
    errors.value.representanteTelefono = "El teléfono debe tener al menos 9 dígitos";
  }
  if (!formData.value.representante.email) {
    errors.value.representanteEmail = "El email es requerido";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.representante.email)) {
    errors.value.representanteEmail = "El email no es válido";
  }
  if (!formData.value.representante.parentesco) {
    errors.value.representanteParentesco = "El parentesco es requerido";
  }
}

function validarFormulario() {
  errors.value = {};
  validarDatosPersonales();
  validarDatosAcademicos();
  validarRepresentante();
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
          "Estudiante actualizado correctamente",
      });
    } else {
      notificationStore.addNotification({
        type: "success",
        message:
          "Estudiante registrado correctamente",
      });
    }

    router.push({ name: "admin-estudiantes" });
  } catch (error) {
    console.error("Error al guardar el estudiante:", error);
    notificationStore.addNotification({
      type: "error",
      message: "Error al guardar el estudiante",
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
    fechaNacimiento: "",
    genero: "",
    direccion: "",
    grado: "",
    paralelo: "",
    anioLectivo: "",
    alergias: [],
    observaciones: "",
    representante: {
      nombre: "",
      cedula: "",
      telefono: "",
      email: "",
      parentesco: "",
    },
    estado: "activo",
  };
  errors.value = {};
}

function volver() {
  router.push({ name: "admin-estudiantes" });
}

// Cargar datos si es modo edición
if (modoEdicion.value) {
  // Simular carga de datos
  formData.value = {
    nombres: "Juan Carlos",
    apellidos: "Pérez García",
    cedula: "0123456789",
    fechaNacimiento: "2015-05-15",
    genero: "Masculino",
    direccion: "Av. Principal 123",
    grado: "3ro EGB",
    paralelo: "A",
    anioLectivo: "2024-2025",
    alergias: ["Maní", "Lactosa"],
    observaciones:
      "Requiere atención especial en el comedor",
    representante: {
      nombre: "María García",
      cedula: "0987654321",
      telefono: "0987654321",
      email: "maria.garcia@example.com",
      parentesco: "Madre",
    },
    estado: "activo",
  };
}
</script>

<style scoped>
.registro-estudiante-view {
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
