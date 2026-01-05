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
                for="representanteUsuario"
                class="form-label required"
              >
                Usuario del Representante
              </label>
              <input
                id="representanteUsuario"
                v-model="formData.representanteUsuario"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.representanteUsuario,
                }"
                required
                placeholder="ej: representante"
                @input="clearError('representanteUsuario')"
              />
              <div
                v-if="errors.representanteUsuario"
                class="invalid-feedback"
              >
                {{ errors.representanteUsuario }}
              </div>
              <small class="form-text text-muted">
                Debe coincidir con el usuario de un representante registrado
              </small>
            </div>

            <div class="col-md-6">
              <label
                for="representanteNombre"
                class="form-label required"
              >
                Nombre del Representante
              </label>
              <input
                id="representanteNombre"
                v-model="formData.representanteNombre"
                type="text"
                class="form-control"
                :class="{
                  'is-invalid': errors.representanteNombre,
                }"
                required
                placeholder="ej: María García"
                @input="clearError('representanteNombre')"
              />
              <div
                v-if="errors.representanteNombre"
                class="invalid-feedback"
              >
                {{ errors.representanteNombre }}
              </div>
              <small class="form-text text-muted">
                Nombre completo del representante
              </small>
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
            <i class="bi bi-book me-2"></i>
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
                <option
                  value=""
                  disabled
                  selected
                >
                  Seleccione el grado
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
                for="seccion"
                class="form-label required"
              >
                Sección
              </label>
              <select
                id="seccion"
                v-model="formData.seccion"
                class="form-select"
                :class="{
                  'is-invalid': errors.seccion,
                }"
                required
                @change="clearError('seccion')"
              >
                <option
                  value=""
                  disabled
                  selected
                >
                  Seleccione la sección
                </option>
                <option
                  v-for="seccion in paralelos"
                  :key="seccion"
                  :value="seccion"
                >
                  {{ seccion }}
                </option>
              </select>
              <div
                v-if="errors.seccion"
                class="invalid-feedback"
              >
                {{ errors.seccion }}
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
            <div class="col-md-3">
              <label
                for="peso"
                class="form-label required"
              >
                Peso (kg)
              </label>
              <input
                id="peso"
                v-model.number="formData.peso"
                type="number"
                step="0.1"
                class="form-control"
                :class="{
                  'is-invalid': errors.peso,
                }"
                required
                @input="clearError('peso')"
              />
              <div
                v-if="errors.peso"
                class="invalid-feedback"
              >
                {{ errors.peso }}
              </div>
            </div>

            <div class="col-md-3">
              <label
                for="altura"
                class="form-label required"
              >
                Altura (cm)
              </label>
              <input
                id="altura"
                v-model.number="formData.altura"
                type="number"
                step="0.1"
                class="form-control"
                :class="{
                  'is-invalid': errors.altura,
                }"
                required
                @input="clearError('altura')"
              />
              <div
                v-if="errors.altura"
                class="invalid-feedback"
              >
                {{ errors.altura }}
              </div>
            </div>

            <div class="col-md-3">
              <label
                for="grupoSanguineo"
                class="form-label required"
              >
                Grupo Sanguíneo
              </label>
              <select
                id="grupoSanguineo"
                v-model="formData.grupoSanguineo"
                class="form-select"
                :class="{
                  'is-invalid': errors.grupoSanguineo,
                }"
                required
                @change="clearError('grupoSanguineo')"
              >
                <option value="" disabled selected>
                  Seleccione
                </option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
              <div
                v-if="errors.grupoSanguineo"
                class="invalid-feedback"
              >
                {{ errors.grupoSanguineo }}
              </div>
            </div>

            <div class="col-md-12">
              <label
                for="alergias"
                class="form-label"
              >
                Alergias
              </label>
              <input
                id="alergias"
                v-model="formData.alergias"
                type="text"
                class="form-control"
                placeholder="ej: Maní, Lactosa, Gluten (separadas por comas)"
              />
              <small class="form-text text-muted">
                Ingrese las alergias separadas por comas
              </small>
            </div>

            <div class="col-md-12">
              <label
                for="condicionesMedicas"
                class="form-label"
              >
                Condiciones Médicas
              </label>
              <textarea
                id="condicionesMedicas"
                v-model="formData.condicionesMedicas"
                class="form-control"
                rows="3"
                placeholder="Ingrese cualquier condición médica relevante..."
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
import { useStudentsStore } from "@/stores/students";

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();
const studentsStore = useStudentsStore();

const modoEdicion = computed(
  () => !!route.params.id
);
const isLoading = ref(false);

// Datos del formulario (igual al de representante + campos de representante)
const formData = ref({
  representanteUsuario: "",
  representanteNombre: "",
  nombres: "",
  apellidos: "",
  cedula: "",
  fechaNacimiento: "",
  grado: "",
  seccion: "",
  peso: "",
  altura: "",
  grupoSanguineo: "",
  alergias: "",
  condicionesMedicas: "",
  estado: "activo",
});

const errors = ref({});

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

function clearError(field) {
  if (errors.value[field]) {
    delete errors.value[field];
  }
}

function validarFormulario() {
  errors.value = {};
  
  // Validar representante
  if (!formData.value.representanteUsuario?.trim()) {
    errors.value.representanteUsuario = "El usuario del representante es requerido";
  }
  if (!formData.value.representanteNombre?.trim()) {
    errors.value.representanteNombre = "El nombre del representante es requerido";
  }
  
  // Validar datos personales
  if (!formData.value.nombres?.trim()) {
    errors.value.nombres = "Los nombres son requeridos";
  }
  if (!formData.value.apellidos?.trim()) {
    errors.value.apellidos = "Los apellidos son requeridos";
  }
  if (!formData.value.cedula) {
    errors.value.cedula = "La cédula es requerida";
  } else if (formData.value.cedula.length !== 10) {
    errors.value.cedula = "La cédula debe tener 10 dígitos";
  }
  if (formData.value.fechaNacimiento) {
    const edad = calcularEdad(formData.value.fechaNacimiento);
    if (edad < 4 || edad > 15) {
      errors.value.fechaNacimiento = "El estudiante debe tener entre 4 y 15 años para el programa de nutrición escolar";
    }
  } else {
    errors.value.fechaNacimiento = "La fecha de nacimiento es requerida";
  }
  
  // Validar datos académicos
  if (!formData.value.grado) {
    errors.value.grado = "El grado es requerido";
  }
  if (!formData.value.seccion) {
    errors.value.seccion = "La sección es requerida";
  }
  
  // Validar datos de salud
  if (!formData.value.peso) {
    errors.value.peso = "El peso es requerido";
  }
  if (!formData.value.altura) {
    errors.value.altura = "La altura es requerida";
  }
  if (!formData.value.grupoSanguineo) {
    errors.value.grupoSanguineo = "El grupo sanguíneo es requerido";
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
    // Extraer datos del representante
    const { representanteUsuario, representanteNombre, ...datosEstudiante } = formData.value;
    
    if (!representanteUsuario || !representanteNombre) {
      notificationStore.addNotification({
        type: "error",
        message: "Debe especificar el representante del estudiante",
      });
      isLoading.value = false;
      return;
    }

    // Agregar estudiante con el representante especificado
    studentsStore.addStudent(
      datosEstudiante,
      representanteUsuario,
      representanteNombre
    );

    notificationStore.addNotification({
      type: "success",
      message: `Estudiante registrado correctamente y asignado a ${representanteNombre}`,
    });

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
    representanteUsuario: "",
    representanteNombre: "",
    nombres: "",
    apellidos: "",
    cedula: "",
    fechaNacimiento: "",
    grado: "",
    seccion: "",
    peso: "",
    altura: "",
    grupoSanguineo: "",
    alergias: "",
    condicionesMedicas: "",
    estado: "activo",
  };
  errors.value = {};
}

function volver() {
  router.push({ name: "admin-estudiantes" });
}

// Cargar datos si es modo edición
if (modoEdicion.value) {
  // TODO: Cargar datos reales desde el store cuando se implemente la edición
  console.log("Modo edición - ID:", route.params.id);
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
