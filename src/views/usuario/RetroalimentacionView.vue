<template>
  <div class="container-fluid py-4">
    <!-- Header -->
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-3">
          <i class="bi bi-chat-square-text me-2"></i>Retroalimentación de Comidas
        </h1>
        <p class="text-muted">
          Evalúa los platos del menú escolar, reporta problemas o comparte tus sugerencias
        </p>
      </div>
    </div>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4" role="tablist">
      <li class="nav-item" role="presentation">
        <button
          class="nav-link active"
          data-bs-toggle="tab"
          data-bs-target="#evaluar-tab"
          type="button"
          role="tab"
        >
          <i class="bi bi-star me-2"></i>Evaluar Comida
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#reportar-tab"
          type="button"
          role="tab"
        >
          <i class="bi bi-exclamation-circle me-2"></i>Reportar Problema
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#sugerencias-tab"
          type="button"
          role="tab"
        >
          <i class="bi bi-lightbulb me-2"></i>Sugerencias
        </button>
      </li>
      <li class="nav-item" role="presentation">
        <button
          class="nav-link"
          data-bs-toggle="tab"
          data-bs-target="#historial-tab"
          type="button"
          role="tab"
        >
          <i class="bi bi-clock-history me-2"></i>Mi Historial
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- Tab: Evaluar Comida -->
      <div
        class="tab-pane fade show active"
        id="evaluar-tab"
        role="tabpanel"
      >
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                  <i class="bi bi-star me-2"></i>Evaluar Comida del Día
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="enviarEvaluacion">
                  <!-- Seleccionar estudiante -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Estudiante <span class="text-danger">*</span>
                    </label>
                    <select
                      class="form-select"
                      v-model="evalForm.estudianteId"
                      required
                    >
                      <option value="">Seleccionar estudiante...</option>
                      <option
                        v-for="student in students"
                        :key="student.id"
                        :value="student.id"
                      >
                        {{ student.nombres }} {{ student.apellidos }}
                      </option>
                    </select>
                  </div>

                  <!-- Tipo de comida -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Tipo de Comida <span class="text-danger">*</span>
                    </label>
                    <select
                      class="form-select"
                      v-model="evalForm.tipoComida"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="desayuno">Desayuno</option>
                      <option value="almuerzo">Almuerzo</option>
                      <option value="merienda">Merienda</option>
                    </select>
                  </div>

                  <!-- Fecha -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Fecha <span class="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="evalForm.fecha"
                      :max="today"
                      required
                    />
                  </div>

                  <!-- Calificación -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Calificación <span class="text-danger">*</span>
                    </label>
                    <div class="star-rating">
                      <i
                        v-for="n in 5"
                        :key="n"
                        class="bi"
                        :class="n <= evalForm.calificacion ? 'bi-star-fill' : 'bi-star'"
                        @click="evalForm.calificacion = n"
                      ></i>
                    </div>
                    <small class="text-muted d-block mt-1">
                      {{ getRatingText(evalForm.calificacion) }}
                    </small>
                  </div>

                  <!-- Aspectos a evaluar -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Aspectos</label>
                    <div class="row">
                      <div class="col-md-4 mb-2">
                        <div class="aspect-item">
                          <label class="form-label">Sabor</label>
                          <select class="form-select form-select-sm" v-model="evalForm.aspectos.sabor">
                            <option value="excelente">Excelente</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="malo">Malo</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="aspect-item">
                          <label class="form-label">Temperatura</label>
                          <select class="form-select form-select-sm" v-model="evalForm.aspectos.temperatura">
                            <option value="excelente">Excelente</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="malo">Malo</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="aspect-item">
                          <label class="form-label">Presentación</label>
                          <select class="form-select form-select-sm" v-model="evalForm.aspectos.presentacion">
                            <option value="excelente">Excelente</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="malo">Malo</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="aspect-item">
                          <label class="form-label">Porción</label>
                          <select class="form-select form-select-sm" v-model="evalForm.aspectos.porcion">
                            <option value="excelente">Adecuada</option>
                            <option value="bueno">Aceptable</option>
                            <option value="regular">Pequeña</option>
                            <option value="malo">Muy pequeña</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="aspect-item">
                          <label class="form-label">Frescura</label>
                          <select class="form-select form-select-sm" v-model="evalForm.aspectos.frescura">
                            <option value="excelente">Excelente</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="malo">Malo</option>
                          </select>
                        </div>
                      </div>
                      <div class="col-md-4 mb-2">
                        <div class="aspect-item">
                          <label class="form-label">Variedad</label>
                          <select class="form-select form-select-sm" v-model="evalForm.aspectos.variedad">
                            <option value="excelente">Excelente</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="malo">Malo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Comentarios -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">Comentarios</label>
                    <textarea
                      class="form-control"
                      rows="3"
                      v-model="evalForm.comentarios"
                      placeholder="Comparte tu experiencia detallada..."
                    ></textarea>
                  </div>

                  <button type="submit" class="btn btn-primary w-100">
                    <i class="bi bi-send me-2"></i>Enviar Evaluación
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Reportar Problema -->
      <div class="tab-pane fade" id="reportar-tab" role="tabpanel">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card">
              <div class="card-header bg-danger text-white">
                <h5 class="mb-0">
                  <i class="bi bi-exclamation-circle me-2"></i>Reportar Problema
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="enviarReporte">
                  <!-- Seleccionar estudiante -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Estudiante <span class="text-danger">*</span>
                    </label>
                    <select
                      class="form-select"
                      v-model="reporteForm.estudianteId"
                      required
                    >
                      <option value="">Seleccionar estudiante...</option>
                      <option
                        v-for="student in students"
                        :key="student.id"
                        :value="student.id"
                      >
                        {{ student.nombres }} {{ student.apellidos }}
                      </option>
                    </select>
                  </div>

                  <!-- Tipo de problema -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Tipo de Problema <span class="text-danger">*</span>
                    </label>
                    <select
                      class="form-select"
                      v-model="reporteForm.tipoProblema"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="calidad">Problema de Calidad</option>
                      <option value="higiene">Problema de Higiene</option>
                      <option value="salud">Reacción de Salud</option>
                      <option value="cantidad">Cantidad Insuficiente</option>
                      <option value="sabor">Sabor Desagradable</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <!-- Fecha del incidente -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Fecha del Incidente <span class="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      class="form-control"
                      v-model="reporteForm.fecha"
                      :max="today"
                      required
                    />
                  </div>

                  <!-- Urgencia -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Nivel de Urgencia <span class="text-danger">*</span>
                    </label>
                    <select class="form-select" v-model="reporteForm.urgencia" required>
                      <option value="baja">Baja - Mejora recomendada</option>
                      <option value="media">Media - Requiere atención</option>
                      <option value="alta">Alta - Problema serio</option>
                    </select>
                  </div>

                  <!-- Descripción -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Descripción del Problema <span class="text-danger">*</span>
                    </label>
                    <textarea
                      class="form-control"
                      rows="4"
                      v-model="reporteForm.descripcion"
                      placeholder="Describe detalladamente el problema..."
                      required
                    ></textarea>
                  </div>

                  <div class="alert alert-warning">
                    <i class="bi bi-info-circle me-2"></i>
                    Tu reporte será enviado al nutricionista y al administrador del sistema
                  </div>

                  <button type="submit" class="btn btn-danger w-100">
                    <i class="bi bi-send me-2"></i>Enviar Reporte
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Sugerencias -->
      <div class="tab-pane fade" id="sugerencias-tab" role="tabpanel">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card">
              <div class="card-header bg-success text-white">
                <h5 class="mb-0">
                  <i class="bi bi-lightbulb me-2"></i>Comparte tu Sugerencia
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="enviarSugerencia">
                  <!-- Categoría -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Categoría <span class="text-danger">*</span>
                    </label>
                    <select
                      class="form-select"
                      v-model="sugerenciaForm.categoria"
                      required
                    >
                      <option value="">Seleccionar...</option>
                      <option value="plato-nuevo">Nuevo Plato</option>
                      <option value="mejora-receta">Mejora de Receta Existente</option>
                      <option value="variedad">Más Variedad</option>
                      <option value="opciones-saludables">Opciones Más Saludables</option>
                      <option value="servicio">Mejora del Servicio</option>
                      <option value="otro">Otro</option>
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
                      v-model="sugerenciaForm.titulo"
                      placeholder="Ej: Agregar más frutas en el desayuno"
                      required
                    />
                  </div>

                  <!-- Descripción -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Descripción <span class="text-danger">*</span>
                    </label>
                    <textarea
                      class="form-control"
                      rows="4"
                      v-model="sugerenciaForm.descripcion"
                      placeholder="Describe tu sugerencia..."
                      required
                    ></textarea>
                  </div>

                  <!-- Beneficio esperado -->
                  <div class="mb-3">
                    <label class="form-label fw-bold">
                      Beneficio Esperado
                    </label>
                    <textarea
                      class="form-control"
                      rows="2"
                      v-model="sugerenciaForm.beneficio"
                      placeholder="¿Cómo mejoraría esto el servicio?"
                    ></textarea>
                  </div>

                  <button type="submit" class="btn btn-success w-100">
                    <i class="bi bi-send me-2"></i>Enviar Sugerencia
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab: Historial -->
      <div class="tab-pane fade" id="historial-tab" role="tabpanel">
        <div class="row">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-clock-history me-2"></i>Mi Historial
                </h5>
              </div>
              <div class="card-body">
                <div v-if="miHistorial.length === 0" class="text-center text-muted py-5">
                  <i class="bi bi-inbox fs-1 d-block mb-3"></i>
                  <p>No tienes evaluaciones o reportes registrados</p>
                </div>
                <div v-else class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Estudiante</th>
                        <th>Detalles</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in miHistorial" :key="item.id">
                        <td>{{ formatDate(item.fecha) }}</td>
                        <td>
                          <span
                            class="badge"
                            :class="{
                              'bg-primary': item.tipo === 'evaluacion',
                              'bg-danger': item.tipo === 'reporte',
                              'bg-success': item.tipo === 'sugerencia',
                            }"
                          >
                            {{ getTipoLabel(item.tipo) }}
                          </span>
                        </td>
                        <td>{{ item.estudianteNombre }}</td>
                        <td>
                          <span v-if="item.tipo === 'evaluacion'">
                            {{ item.tipoComida }} - {{ item.calificacion }}⭐
                          </span>
                          <span v-else-if="item.tipo === 'reporte'">
                            {{ item.tipoProblema }}
                          </span>
                          <span v-else>
                            {{ item.categoria }}
                          </span>
                        </td>
                        <td>
                          <span class="badge bg-info">Enviado</span>
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useStudentsStore } from "@/stores/students";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

const studentsStore = useStudentsStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Data
const students = computed(() => studentsStore.studentsByRepresentante);

const evalForm = ref({
  estudianteId: "",
  tipoComida: "",
  fecha: "",
  calificacion: 0,
  aspectos: {
    sabor: "bueno",
    temperatura: "bueno",
    presentacion: "bueno",
    porcion: "bueno",
    frescura: "bueno",
    variedad: "bueno",
  },
  comentarios: "",
});

const reporteForm = ref({
  estudianteId: "",
  tipoProblema: "",
  fecha: "",
  urgencia: "media",
  descripcion: "",
});

const sugerenciaForm = ref({
  categoria: "",
  titulo: "",
  descripcion: "",
  beneficio: "",
});

const retroalimentaciones = ref([]);

// Computed
const today = computed(() => new Date().toISOString().split("T")[0]);

const miHistorial = computed(() => {
  return retroalimentaciones.value
    .filter((r) => r.representanteId === authStore.user?.id)
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
});

// Methods
function getRatingText(rating) {
  const texts = {
    0: "Sin calificar",
    1: "Muy malo",
    2: "Malo",
    3: "Regular",
    4: "Bueno",
    5: "Excelente",
  };
  return texts[rating] || "";
}

function getTipoLabel(tipo) {
  const labels = {
    evaluacion: "Evaluación",
    reporte: "Reporte",
    sugerencia: "Sugerencia",
  };
  return labels[tipo] || tipo;
}

function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-VE");
}

function enviarEvaluacion() {
  if (!evalForm.value.estudianteId || !evalForm.value.tipoComida || !evalForm.value.fecha || evalForm.value.calificacion === 0) {
    notificationStore.error("Por favor complete todos los campos obligatorios");
    return;
  }

  const estudiante = students.value.find((s) => s.id === evalForm.value.estudianteId);
  const nuevaEvaluacion = {
    id: `EVAL-${Date.now()}`,
    tipo: "evaluacion",
    representanteId: authStore.user?.id,
    estudianteId: evalForm.value.estudianteId,
    estudianteNombre: `${estudiante.nombres} ${estudiante.apellidos}`,
    ...evalForm.value,
    fechaRegistro: new Date().toISOString(),
    vistaPorNutricionista: false,
  };

  retroalimentaciones.value.push(nuevaEvaluacion);
  saveRetroalimentaciones();

  notificationStore.success("✅ Solicitud enviada - El nutricionista revisará tu evaluación");
  resetEvalForm();
}

function enviarReporte() {
  if (!reporteForm.value.estudianteId || !reporteForm.value.tipoProblema || !reporteForm.value.fecha || !reporteForm.value.descripcion) {
    notificationStore.error("Por favor complete todos los campos obligatorios");
    return;
  }

  const estudiante = students.value.find((s) => s.id === reporteForm.value.estudianteId);
  const nuevoReporte = {
    id: `REP-${Date.now()}`,
    tipo: "reporte",
    representanteId: authStore.user?.id,
    estudianteId: reporteForm.value.estudianteId,
    estudianteNombre: `${estudiante.nombres} ${estudiante.apellidos}`,
    ...reporteForm.value,
    fechaRegistro: new Date().toISOString(),
    vistaPorNutricionista: false,
  };

  retroalimentaciones.value.push(nuevoReporte);
  saveRetroalimentaciones();

  notificationStore.success("✅ Solicitud enviada - El nutricionista atenderá tu reporte");
  resetReporteForm();
}

function enviarSugerencia() {
  if (!sugerenciaForm.value.categoria || !sugerenciaForm.value.titulo || !sugerenciaForm.value.descripcion) {
    notificationStore.error("Por favor complete todos los campos obligatorios");
    return;
  }

  const nuevaSugerencia = {
    id: `SUG-${Date.now()}`,
    tipo: "sugerencia",
    representanteId: authStore.user?.id,
    ...sugerenciaForm.value,
    fecha: new Date().toISOString().split("T")[0],
    fechaRegistro: new Date().toISOString(),
    vistaPorNutricionista: false,
  };

  retroalimentaciones.value.push(nuevaSugerencia);
  saveRetroalimentaciones();

  notificationStore.success("✅ Solicitud enviada - El nutricionista revisará tu sugerencia");
  resetSugerenciaForm();
}

function resetEvalForm() {
  evalForm.value = {
    estudianteId: "",
    tipoComida: "",
    fecha: "",
    calificacion: 0,
    aspectos: {
      sabor: "bueno",
      temperatura: "bueno",
      presentacion: "bueno",
      porcion: "bueno",
      frescura: "bueno",
      variedad: "bueno",
    },
    comentarios: "",
  };
}

function resetReporteForm() {
  reporteForm.value = {
    estudianteId: "",
    tipoProblema: "",
    fecha: "",
    urgencia: "media",
    descripcion: "",
  };
}

function resetSugerenciaForm() {
  sugerenciaForm.value = {
    categoria: "",
    titulo: "",
    descripcion: "",
    beneficio: "",
  };
}

function loadRetroalimentaciones() {
  try {
    const stored = localStorage.getItem("retroalimentaciones_comidas");
    if (stored) {
      retroalimentaciones.value = JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error al cargar retroalimentaciones:", error);
    retroalimentaciones.value = [];
  }
}

function saveRetroalimentaciones() {
  try {
    localStorage.setItem("retroalimentaciones_comidas", JSON.stringify(retroalimentaciones.value));
  } catch (error) {
    console.error("Error al guardar retroalimentaciones:", error);
  }
}

onMounted(() => {
  loadRetroalimentaciones();
});
</script>

<style scoped>
.star-rating {
  font-size: 2rem;
  cursor: pointer;
}

.star-rating i {
  color: #ffc107;
  transition: transform 0.2s ease;
}

.star-rating i:hover {
  transform: scale(1.2);
}

.aspect-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 0.5rem;
}

.aspect-item label {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}
</style>
