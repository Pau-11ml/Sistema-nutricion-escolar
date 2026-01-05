<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h1 class="h3 mb-2">
              <i class="bi bi-bell me-2"></i>Alertas y Notificaciones
            </h1>
            <p class="text-muted mb-0">
              Envía avisos a estudiantes sobre cambios de menú, alertas de alergias y recordatorios
            </p>
          </div>
          <button @click="openNuevaAlerta" class="btn btn-primary" v-if="!showForm && !showDetails">
            <i class="bi bi-plus-circle me-2"></i>Nueva Alerta
          </button>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="row mb-4" v-if="!showForm && !showDetails">
      <div class="col-md-3">
        <div class="quick-action-card" @click="crearAlertaTipo('cambio-menu')">
          <i class="bi bi-calendar-week fs-1 mb-2"></i>
          <h6>Cambio de Menú</h6>
          <small class="text-muted">Notificar modificaciones</small>
        </div>
      </div>
      <div class="col-md-3">
        <div class="quick-action-card" @click="crearAlertaTipo('alergia')">
          <i class="bi bi-exclamation-triangle fs-1 mb-2"></i>
          <h6>Alerta de Alergia</h6>
          <small class="text-muted">Advertir sobre ingredientes</small>
        </div>
      </div>
      <div class="col-md-3">
        <div class="quick-action-card" @click="crearAlertaTipo('recordatorio')">
          <i class="bi bi-clock-history fs-1 mb-2"></i>
          <h6>Recordatorio</h6>
          <small class="text-muted">Enviar recordatorios</small>
        </div>
      </div>
      <div class="col-md-3">
        <div class="quick-action-card" @click="crearAlertaTipo('general')">
          <i class="bi bi-info-circle fs-1 mb-2"></i>
          <h6>Información General</h6>
          <small class="text-muted">Avisos importantes</small>
        </div>
      </div>
    </div>

    <!-- Vista Principal: Lista de Alertas -->
    <div v-if="!showForm && !showDetails">
      <!-- Filters -->
      <div class="row mb-3">
        <div class="col-md-4">
          <select class="form-select" v-model="filterTipo">
            <option value="">Todos los tipos</option>
            <option value="cambio-menu">Cambio de Menú</option>
            <option value="alergia">Alerta de Alergia</option>
            <option value="recordatorio">Recordatorio</option>
            <option value="general">General</option>
          </select>
        </div>
        <div class="col-md-4">
          <select class="form-select" v-model="filterEstado">
            <option value="">Todos los estados</option>
            <option value="enviada">Enviadas</option>
            <option value="programada">Programadas</option>
          </select>
        </div>
      </div>

      <!-- Alertas List -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Historial de Alertas</h5>
            </div>
            <div class="card-body">
              <div v-if="alertasFiltradas.length === 0" class="text-center text-muted py-5">
                <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                <p>No hay alertas registradas</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>Fecha/Hora</th>
                      <th>Tipo</th>
                      <th>Título</th>
                      <th>Destinatarios</th>
                      <th>Prioridad</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="alerta in alertasFiltradas" :key="alerta.id">
                      <td>{{ formatDateTime(alerta.fechaHora) }}</td>
                      <td>
                        <span class="badge" :class="getBadgeClass(alerta.tipo)">
                          {{ getTipoLabel(alerta.tipo) }}
                        </span>
                      </td>
                      <td>{{ alerta.titulo }}</td>
                      <td>
                        <span v-if="alerta.destinatariosTipo === 'todos'">Todos</span>
                        <span v-else-if="alerta.destinatarios && alerta.destinatarios.length">{{ alerta.destinatarios.length }} estudiantes</span>
                        <span v-else>-</span>
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="{
                            'bg-danger': alerta.prioridad === 'alta',
                            'bg-warning text-dark': alerta.prioridad === 'media',
                            'bg-secondary': alerta.prioridad === 'baja',
                          }"
                        >
                          {{ alerta.prioridad }}
                        </span>
                      </td>
                      <td>
                        <span
                          class="badge"
                          :class="{
                            'bg-success': alerta.estado === 'enviada',
                            'bg-info': alerta.estado === 'programada',
                          }"
                        >
                          {{ alerta.estado }}
                        </span>
                      </td>
                      <td>
                        <button
                          @click="verDetalles(alerta)"
                          class="btn btn-sm btn-outline-primary"
                        >
                          <i class="bi bi-eye"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista: Formulario Nueva Alerta -->
    <div class="row" v-if="showForm">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-bell me-2"></i>Nueva Alerta/Notificación
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
            <form @submit.prevent="enviarAlerta">
              <!-- Tipo -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  Tipo de Alerta <span class="text-danger">*</span>
                </label>
                <select class="form-select" v-model="formData.tipo" required>
                  <option value="">Seleccionar...</option>
                  <option value="cambio-menu">Cambio de Menú</option>
                  <option value="alergia">Alerta de Alergia</option>
                  <option value="recordatorio">Recordatorio</option>
                  <option value="general">Información General</option>
                </select>
              </div>

              <!-- Prioridad -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  Prioridad <span class="text-danger">*</span>
                </label>
                <select class="form-select" v-model="formData.prioridad" required>
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta - Urgente</option>
                </select>
              </div>

              <!-- Título -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  Título <span class="text-danger">*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  v-model="formData.titulo"
                  placeholder="Ej: Cambio en el menú del viernes"
                  required
                />
              </div>

              <!-- Mensaje -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  Mensaje <span class="text-danger">*</span>
                </label>
                <textarea
                  class="form-control"
                  rows="4"
                  v-model="formData.mensaje"
                  placeholder="Escribe el mensaje completo..."
                  required
                ></textarea>
              </div>

              <!-- Destinatarios -->
              <div class="mb-3">
                <label class="form-label fw-bold">
                  Destinatarios <span class="text-danger">*</span>
                </label>
                <div class="mb-2">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="todosDestinatarios"
                      value="todos"
                      v-model="formData.destinatariosTipo"
                    />
                    <label class="form-check-label" for="todosDestinatarios">
                      Todos los estudiantes
                    </label>
                  </div>
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      type="radio"
                      id="especificosDestinatarios"
                      value="especificos"
                      v-model="formData.destinatariosTipo"
                    />
                    <label class="form-check-label" for="especificosDestinatarios">
                      Estudiantes específicos
                    </label>
                  </div>
                </div>

                <div v-if="formData.destinatariosTipo === 'especificos'">
                  <select
                    class="form-select"
                    multiple
                    size="5"
                    v-model="formData.destinatarios"
                  >
                    <option
                      v-for="student in allStudents"
                      :key="student.id"
                      :value="student.id"
                    >
                      {{ student.nombres }} {{ student.apellidos }} - {{ student.grado }}
                    </option>
                  </select>
                  <small class="text-muted">
                    Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples
                  </small>
                </div>
              </div>

              <!-- Programar envío -->
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="programarCheck"
                    v-model="formData.programar"
                  />
                  <label class="form-check-label" for="programarCheck">
                    Programar envío para fecha específica
                  </label>
                </div>
              </div>

              <div v-if="formData.programar" class="mb-3">
                <label class="form-label fw-bold">Fecha y Hora de Envío</label>
                <input
                  type="datetime-local"
                  class="form-control"
                  v-model="formData.fechaHoraEnvio"
                  :min="minDateTime"
                />
              </div>

              <!-- Opciones adicionales -->
              <div class="mb-3">
                <div class="form-check">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    id="emailCheck"
                    v-model="formData.enviarEmail"
                  />
                  <label class="form-check-label" for="emailCheck">
                    Enviar también por correo electrónico
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
                  <i class="bi bi-send me-2"></i>
                  {{ formData.programar ? "Programar" : "Enviar" }} Alerta
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista: Detalles de Alerta -->
    <div class="row" v-if="showDetails">
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-info text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              <i class="bi bi-info-circle me-2"></i>Detalles de la Alerta
            </h5>
            <button
              type="button"
              class="btn btn-light btn-sm"
              @click="cerrarDetalles"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          <div class="card-body" v-if="alertaActual">
            <div class="mb-3">
              <strong>Tipo:</strong>
              <span class="badge ms-2" :class="getBadgeClass(alertaActual.tipo)">
                {{ getTipoLabel(alertaActual.tipo) }}
              </span>
            </div>
            <div class="mb-3">
              <strong>Prioridad:</strong>
              <span
                class="badge ms-2"
                :class="{
                  'bg-danger': alertaActual.prioridad === 'alta',
                  'bg-warning text-dark': alertaActual.prioridad === 'media',
                  'bg-secondary': alertaActual.prioridad === 'baja',
                }"
              >
                {{ alertaActual.prioridad }}
              </span>
            </div>
            <div class="mb-3">
              <strong>Título:</strong>
              <p class="mb-0 mt-1">{{ alertaActual.titulo }}</p>
            </div>
            <div class="mb-3">
              <strong>Mensaje:</strong>
              <p class="mb-0 mt-1">{{ alertaActual.mensaje }}</p>
            </div>
            <div class="mb-3">
              <strong>Fecha/Hora:</strong>
              <p class="mb-0 mt-1">{{ formatDateTime(alertaActual.fechaHora) }}</p>
            </div>
            <div class="mb-3">
              <strong>Destinatarios:</strong>
              <p class="mb-0 mt-1">
                <span v-if="alertaActual.destinatariosTipo === 'todos'">
                  Todos los estudiantes
                </span>
                <span v-else>
                  {{ alertaActual.destinatarios.length }} estudiantes seleccionados
                </span>
              </p>
            </div>
            <div class="mb-3">
              <strong>Estado:</strong>
              <span
                class="badge ms-2"
                :class="{
                  'bg-success': alertaActual.estado === 'enviada',
                  'bg-info': alertaActual.estado === 'programada',
                }"
              >
                {{ alertaActual.estado }}
              </span>
            </div>

            <!-- Botón de volver -->
            <div class="d-flex justify-content-start gap-2 mt-4">
              <button @click="cerrarDetalles" class="btn btn-secondary">
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
const showDetails = ref(false);

// Data
const filterTipo = ref("");
const filterEstado = ref("");
const alertas = ref([]);
const alertaActual = ref(null);

const formData = ref({
  tipo: "",
  prioridad: "media",
  titulo: "",
  mensaje: "",
  destinatariosTipo: "todos",
  destinatarios: [],
  programar: false,
  fechaHoraEnvio: "",
  enviarEmail: true,
});

// Computed
const allStudents = computed(() => studentsStore.allStudents);

const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 5);
  return now.toISOString().slice(0, 16);
});

const alertasFiltradas = computed(() => {
  let result = alertas.value;

  if (filterTipo.value) {
    result = result.filter((a) => a.tipo === filterTipo.value);
  }

  if (filterEstado.value) {
    result = result.filter((a) => a.estado === filterEstado.value);
  }

  return result.sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora));
});

// Methods
function getBadgeClass(tipo) {
  const classes = {
    "cambio-menu": "bg-primary",
    alergia: "bg-danger",
    recordatorio: "bg-warning text-dark",
    general: "bg-info",
  };
  return classes[tipo] || "bg-secondary";
}

function getTipoLabel(tipo) {
  const labels = {
    "cambio-menu": "Cambio de Menú",
    alergia: "Alerta de Alergia",
    recordatorio: "Recordatorio",
    general: "General",
  };
  return labels[tipo] || tipo;
}

function formatDateTime(dateTimeString) {
  if (!dateTimeString) return "-";
  const date = new Date(dateTimeString);
  return date.toLocaleString("es-VE");
}

function openNuevaAlerta() {
  resetForm();
  showForm.value = true;
  showDetails.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function crearAlertaTipo(tipo) {
  resetForm();
  formData.value.tipo = tipo;
  showForm.value = true;
  showDetails.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function verDetalles(alerta) {
  alertaActual.value = alerta;
  showDetails.value = true;
  showForm.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function cancelarFormulario() {
  showForm.value = false;
  resetForm();
}

function cerrarDetalles() {
  showDetails.value = false;
  alertaActual.value = null;
}

function resetForm() {
  formData.value = {
    tipo: "",
    prioridad: "media",
    titulo: "",
    mensaje: "",
    destinatariosTipo: "todos",
    destinatarios: [],
    programar: false,
    fechaHoraEnvio: "",
    enviarEmail: true,
  };
}

function enviarAlerta() {
  if (
    !formData.value.tipo ||
    !formData.value.titulo ||
    !formData.value.mensaje
  ) {
    notificationStore.error(
      "Por favor complete todos los campos obligatorios"
    );
    return;
  }

  if (
    formData.value.destinatariosTipo === "especificos" &&
    formData.value.destinatarios.length === 0
  ) {
    notificationStore.error(
      "Seleccione al menos un destinatario"
    );
    return;
  }

  const nuevaAlerta = {
    id: `ALERT-${Date.now()}`,
    ...formData.value,
    fechaHora: formData.value.programar
      ? formData.value.fechaHoraEnvio
      : new Date().toISOString(),
    estado: formData.value.programar ? "programada" : "enviada",
    nutricionistaId: "nutricionista-1",
    fechaCreacion: new Date().toISOString(),
  };

  alertas.value.push(nuevaAlerta);
  saveAlertas();

  const mensaje = formData.value.programar
    ? "Alerta programada exitosamente"
    : "Alerta enviada exitosamente";
  notificationStore.success(mensaje);

  showForm.value = false;
  resetForm();
}

function loadAlertas() {
  try {
    const stored = localStorage.getItem("alertas_notificaciones");
    if (stored) {
      alertas.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error al cargar alertas:", error);
    alertas.value = [];
  }
}

function saveAlertas() {
  try {
    localStorage.setItem("alertas_notificaciones", JSON.stringify(alertas.value));
  } catch (error) {
    console.error("Error al guardar alertas:", error);
  }
}

onMounted(() => {
  loadAlertas();
});
</script>

<style scoped>
.quick-action-card {
  padding: 1.5rem;
  border: 2px solid #dee2e6;
  border-radius: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
}

.quick-action-card:hover {
  border-color: #0d6efd;
  background-color: #f8f9fa;
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.quick-action-card i {
  color: #0d6efd;
  transition: transform 0.3s ease;
}

.quick-action-card:hover i {
  transform: scale(1.1);
}

.quick-action-card h6 {
  margin-bottom: 0.5rem;
  font-weight: 600;
}
</style>