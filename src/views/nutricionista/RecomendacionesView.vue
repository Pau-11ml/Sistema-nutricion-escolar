<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-3">
          <i class="bi bi-heart-pulse me-2"></i>Recomendaciones Nutricionales
        </h1>
        <p class="text-muted">
          Redacta y envía consejos personalizados a cada estudiante según su perfil nutricional
        </p>
      </div>
    </div>

    <!-- Filters -->
    <div class="row mb-4" v-if="!showForm && !showHistorial">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text">
            <i class="bi bi-search"></i>
          </span>
          <input
            type="text"
            class="form-control"
            placeholder="Buscar estudiante..."
            v-model="searchQuery"
          />
        </div>
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="filterGrado">
          <option value="">Todos los grados</option>
          <option value="1ro">1ro</option>
          <option value="2do">2do</option>
          <option value="3ro">3ro</option>
          <option value="4to">4to</option>
          <option value="5to">5to</option>
          <option value="6to">6to</option>
        </select>
      </div>
      <div class="col-md-3">
        <select class="form-select" v-model="filterCondicion">
          <option value="">Todas las condiciones</option>
          <option value="con-alergias">Con alergias</option>
          <option value="con-condiciones">Con condiciones médicas</option>
          <option value="sin-condiciones">Sin condiciones especiales</option>
        </select>
      </div>
    </div>

    <!-- Vista Principal: Students Grid -->
    <div class="row" v-if="!showForm && !showHistorial">
      <div
        v-for="estudiante in filteredEstudiantes"
        :key="estudiante.id"
        class="col-md-6 col-lg-4 mb-4"
      >
        <div class="student-card h-100">
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div
                class="avatar-circle me-3"
                :style="{ backgroundColor: getAvatarColor(estudiante.id) }"
              >
                {{ getInitials(estudiante) }}
              </div>
              <div class="flex-grow-1">
                <h5 class="mb-0">
                  {{ estudiante.nombres }} {{ estudiante.apellidos }}
                </h5>
                <small class="text-muted">{{ estudiante.grado }}</small>
              </div>
            </div>

            <!-- Información del estudiante -->
            <div class="student-info mb-3">
              <div class="info-item" v-if="estudiante.alergias">
                <i class="bi bi-exclamation-triangle-fill text-warning me-1"></i>
                <small><strong>Alergias:</strong> {{ estudiante.alergias }}</small>
              </div>
              <div class="info-item" v-if="estudiante.condicionesMedicas">
                <i class="bi bi-heart-pulse-fill text-danger me-1"></i>
                <small><strong>Condiciones:</strong> {{ estudiante.condicionesMedicas }}</small>
              </div>
            </div>

            <!-- Última recomendación -->
            <div v-if="getUltimaRecomendacion(estudiante.id)" class="alert alert-info py-2 px-3 mb-3">
              <small class="d-block mb-1">
                <i class="bi bi-clock-history me-1"></i>
                <strong>Última recomendación:</strong>
              </small>
              <small class="text-muted">
                {{ formatDateShort(getUltimaRecomendacion(estudiante.id).fecha) }}
              </small>
            </div>

            <!-- Acciones -->
            <div class="d-grid gap-2">
              <button
                @click="crearRecomendacion(estudiante)"
                class="btn btn-primary"
              >
                <i class="bi bi-plus-circle me-1"></i>
                Nueva Recomendación
              </button>
              <button
                @click="verHistorial(estudiante)"
                class="btn btn-outline-secondary"
              >
                <i class="bi bi-clock-history me-1"></i>
                Ver Historial
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredEstudiantes.length === 0" class="col-12">
        <div class="text-center text-muted py-5">
          <i class="bi bi-inbox fs-1 d-block mb-3"></i>
          <p>No se encontraron estudiantes</p>
        </div>
      </div>
    </div>

    <!-- Vista: Crear Recomendación -->
    <div class="row" v-if="showForm">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-heart-pulse me-2"></i>
              Nueva Recomendación - {{ currentEstudiante?.nombres }} {{ currentEstudiante?.apellidos }}
            </h5>
            <button
              type="button"
              class="btn btn-light btn-sm"
              @click="cancelarFormulario"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="card-body">
            <!-- Información del estudiante -->
            <div class="alert alert-info mb-4">
              <h6 class="mb-2">
                <i class="bi bi-info-circle me-2"></i>Perfil del Estudiante
              </h6>
              <div class="row">
                <div class="col-md-6">
                  <strong>Grado:</strong> {{ currentEstudiante?.grado }}
                </div>
                <div class="col-md-6" v-if="currentEstudiante?.alergias">
                  <strong>Alergias:</strong> {{ currentEstudiante.alergias }}
                </div>
                <div class="col-md-12" v-if="currentEstudiante?.condicionesMedicas">
                  <strong>Condiciones Médicas:</strong>
                  {{ currentEstudiante.condicionesMedicas }}
                </div>
              </div>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="guardarRecomendacion">
              <div class="mb-3">
                <label class="form-label fw-bold">
                  Tipo de Recomendación <span class="text-danger">*</span>
                </label>
                <select class="form-select" v-model="formData.tipo" required>
                  <option value="">Seleccionar tipo...</option>
                  <option value="dieta">Dieta y Alimentación</option>
                  <option value="hidratacion">Hidratación</option>
                  <option value="ejercicio">Actividad Física</option>
                  <option value="habitos">Hábitos Saludables</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">
                  Título <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.titulo"
                  placeholder="Ej: Aumentar consumo de frutas y verduras"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">
                  Descripción <span class="text-danger">*</span>
                </label>
                <textarea
                  class="form-control"
                  rows="5"
                  v-model="formData.descripcion"
                  placeholder="Escribe aquí tus recomendaciones detalladas..."
                  required
                ></textarea>
                <small class="text-muted">
                  Sé específico y claro en tus recomendaciones
                </small>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">
                  Prioridad
                </label>
                <select class="form-select" v-model="formData.prioridad">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label fw-bold">
                  Fecha de Seguimiento
                </label>
                <input
                  type="date"
                  class="form-control"
                  v-model="formData.fechaSeguimiento"
                  :min="today"
                />
                <small class="text-muted">
                  Fecha para verificar el cumplimiento
                </small>
              </div>

              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="notificarCheck"
                    v-model="formData.notificar"
                  />
                  <label class="form-check-label" for="notificarCheck">
                    Enviar notificación al estudiante/representante
                  </label>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="cancelarFormulario"
                >
                  Cancelar
                </button>
                <button type="submit" class="btn btn-primary">
                  <i class="bi bi-check-circle me-2"></i>
                  Guardar Recomendación
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista: Historial -->
    <div class="row" v-if="showHistorial">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-clock-history me-2"></i>
              Historial de Recomendaciones - {{ currentEstudiante?.nombres }} {{ currentEstudiante?.apellidos }}
            </h5>
            <button
              type="button"
              class="btn btn-light btn-sm"
              @click="cerrarHistorial"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="card-body">
            <div v-if="historialRecomendaciones.length === 0" class="text-center text-muted py-4">
              <i class="bi bi-inbox fs-1 d-block mb-2"></i>
              <p>No hay recomendaciones registradas</p>
            </div>
            <div v-else>
              <div
                v-for="rec in historialRecomendaciones"
                :key="rec.id"
                class="recomendacion-item mb-3"
              >
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <h6 class="mb-1">
                      <span
                        class="badge me-2"
                        :class="{
                          'bg-danger': rec.prioridad === 'alta',
                          'bg-warning': rec.prioridad === 'media',
                          'bg-secondary': rec.prioridad === 'baja',
                        }"
                      >
                        {{ rec.prioridad }}
                      </span>
                      {{ rec.titulo }}
                    </h6>
                    <small class="text-muted">
                      <i class="bi bi-calendar me-1"></i>
                      {{ formatDate(rec.fecha) }}
                    </small>
                  </div>
                  <span class="badge bg-info">{{ rec.tipo }}</span>
                </div>
                <p class="mb-2">{{ rec.descripcion }}</p>
                <div v-if="rec.fechaSeguimiento">
                  <small class="text-muted">
                    <i class="bi bi-clock me-1"></i>
                    Seguimiento: {{ formatDate(rec.fechaSeguimiento) }}
                  </small>
                </div>
              </div>
            </div>

            <!-- Botón de volver -->
            <div class="d-flex justify-content-start gap-2 mt-4">
              <button @click="cerrarHistorial" class="btn btn-secondary">
                <i class="bi bi-arrow-left me-2"></i>Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStudentsStore } from "@/stores/students";
import { useNotificationStore } from "@/stores/notification";

const studentsStore = useStudentsStore();
const notificationStore = useNotificationStore();

// Control de vistas
const showForm = ref(false);
const showHistorial = ref(false);

// Data
const searchQuery = ref("");
const filterGrado = ref("");
const filterCondicion = ref("");
const currentEstudiante = ref(null);
const recomendaciones = ref([]);

const formData = ref({
  tipo: "",
  titulo: "",
  descripcion: "",
  prioridad: "media",
  fechaSeguimiento: "",
  notificar: true,
});

// Computed
const today = computed(() => {
  return new Date().toISOString().split("T")[0];
});

const filteredEstudiantes = computed(() => {
  let result = studentsStore.allStudents;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (e) =>
        e.nombres.toLowerCase().includes(query) ||
        e.apellidos.toLowerCase().includes(query) ||
        e.cedula.includes(query)
    );
  }

  if (filterGrado.value) {
    result = result.filter((e) => e.grado === filterGrado.value);
  }

  if (filterCondicion.value === "con-alergias") {
    result = result.filter((e) => e.alergias);
  } else if (filterCondicion.value === "con-condiciones") {
    result = result.filter((e) => e.condicionesMedicas);
  } else if (filterCondicion.value === "sin-condiciones") {
    result = result.filter((e) => !e.alergias && !e.condicionesMedicas);
  }

  return result;
});

const historialRecomendaciones = computed(() => {
  if (!currentEstudiante.value) return [];
  return recomendaciones.value
    .filter((r) => r.estudianteId === currentEstudiante.value.id)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

// Methods
function getInitials(estudiante) {
  const firstInitial = estudiante.nombres.charAt(0).toUpperCase();
  const lastInitial = estudiante.apellidos.charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

function getAvatarColor(id) {
  const colors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#FFD93D",
  ];
  const index = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
}

function getUltimaRecomendacion(estudianteId) {
  const recs = recomendaciones.value.filter((r) => r.estudianteId === estudianteId);
  if (recs.length === 0) return null;
  return recs.sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-VE");
}

function formatDateShort(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-VE", { day: "2-digit", month: "short" });
}

function crearRecomendacion(estudiante) {
  currentEstudiante.value = estudiante;
  resetForm();
  showForm.value = true;
  showHistorial.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function verHistorial(estudiante) {
  currentEstudiante.value = estudiante;
  showHistorial.value = true;
  showForm.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarFormulario() {
  showForm.value = false;
  resetForm();
  currentEstudiante.value = null;
}

function cerrarHistorial() {
  showHistorial.value = false;
  currentEstudiante.value = null;
}

function resetForm() {
  formData.value = {
    tipo: "",
    titulo: "",
    descripcion: "",
    prioridad: "media",
    fechaSeguimiento: "",
    notificar: true,
  };
}

function guardarRecomendacion() {
  if (!formData.value.tipo || !formData.value.titulo || !formData.value.descripcion) {
    notificationStore.showNotification("Por favor complete todos los campos obligatorios", "error");
    return;
  }

  const nuevaRecomendacion = {
    id: `REC-${Date.now()}`,
    estudianteId: currentEstudiante.value.id,
    estudianteNombre: `${currentEstudiante.value.nombres} ${currentEstudiante.value.apellidos}`,
    ...formData.value,
    fecha: new Date().toISOString(),
    nutricionistaId: "nutricionista-1", // En producción usar el ID real del nutricionista logueado
  };

  recomendaciones.value.push(nuevaRecomendacion);
  saveRecomendaciones();

  if (formData.value.notificar) {
    notificationStore.showNotification(
      "Recomendación enviada y notificación programada",
      "success"
    );
  } else {
    notificationStore.showNotification("Recomendación guardada exitosamente", "success");
  }

  showForm.value = false;
  resetForm();
}

function loadRecomendaciones() {
  try {
    const stored = localStorage.getItem("recomendaciones_nutricionales");
    if (stored) {
      recomendaciones.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error al cargar recomendaciones:", error);
    recomendaciones.value = [];
  }
}

function saveRecomendaciones() {
  try {
    localStorage.setItem("recomendaciones_nutricionales", JSON.stringify(recomendaciones.value));
  } catch (error) {
    console.error("Error al guardar recomendaciones:", error);
  }
}

onMounted(() => {
  loadRecomendaciones();
});
</script>

<style scoped>
.student-card {
  border: 1px solid #dee2e6;
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  background: white;
}

.student-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
}

.student-info {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.info-item {
  margin-bottom: 0.5rem;
}

.info-item:last-child {
  margin-bottom: 0;
}

.recomendacion-item {
  padding: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  background: #f8f9fa;
}
</style>