<template>
  <div class="dashboard-nutricionista">
    <!-- Encabezado de Bienvenida -->
    <div class="welcome-banner mb-4">
      <div class="row align-items-center">
        <div class="col-md-8">
          <h1 class="h3 mb-2">
            <i
              class="bi bi-clipboard2-pulse-fill me-2"
            ></i>
            ¡Bienvenido/a,
            {{ nombreNutricionista }}!
          </h1>
          <p class="mb-0 text-white-50">
            Panel de control del nutricionista -
            {{ fechaActual }}
          </p>
        </div>
        <div class="col-md-4 text-end">
          <button
            class="btn btn-light"
            @click="goToMenuSemanal"
          >
            <i
              class="bi bi-calendar-week me-2"
            ></i>
            Gestionar Menú Semanal
          </button>
        </div>
      </div>
    </div>

    <!-- Tarjetas de Estadísticas -->
    <div class="row g-3 mb-4">
      <div class="col-xl-3 col-md-6">
        <div class="stat-card">
          <div class="stat-icon bg-primary">
            <i class="bi bi-people-fill"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{
                estadisticas.estudiantesAsignados
              }}
            </div>
            <div class="stat-label">
              Estudiantes Asignados
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6">
        <div class="stat-card">
          <div class="stat-icon bg-success">
            <i class="bi bi-calendar-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{ estadisticas.menusActivos }}
            </div>
            <div class="stat-label">
              Menús Activos
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-3 col-md-6">
        <div class="stat-card">
          <div
            class="stat-icon bg-warning text-dark"
          >
            <i
              class="bi bi-exclamation-triangle-fill"
            ></i>
          </div>
          <div class="stat-content">
            <div class="stat-value">
              {{
                estadisticas.estudiantesAlergias
              }}
            </div>
            <div class="stat-label">
              Con Alergias
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-4">
      <!-- Columna Principal -->
      <div class="col-lg-8">
        <!-- Menú de Hoy -->
        <div class="card mb-4">
          <div
            class="card-header bg-primary text-white"
          >
            <h5 class="mb-0">
              <i
                class="bi bi-calendar-day me-2"
              ></i>
              Menú del Día - {{ diaActual }}
            </h5>
          </div>
          <div class="card-body">
            <div
              v-if="
                menuHoy &&
                menuHoy.caloriasTotales > 0
              "
              class="menu-hoy"
            >
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="menu-item">
                    <div class="menu-item-icon">
                      <i
                        class="bi bi-sunrise"
                      ></i>
                    </div>
                    <div
                      class="menu-item-content"
                    >
                      <h6>Desayuno</h6>
                      <p class="mb-0">
                        {{ menuHoy.desayuno }}
                      </p>
                      <small class="text-muted"
                        >{{
                          menuHoy.caloriaDesayuno
                        }}
                        kcal</small
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="menu-item">
                    <div class="menu-item-icon">
                      <i class="bi bi-sun"></i>
                    </div>
                    <div
                      class="menu-item-content"
                    >
                      <h6>Almuerzo</h6>
                      <p class="mb-0">
                        {{ menuHoy.almuerzo }}
                      </p>
                      <small class="text-muted"
                        >{{
                          menuHoy.caloriaAlmuerzo
                        }}
                        kcal</small
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="menu-item">
                    <div class="menu-item-icon">
                      <i
                        class="bi bi-cloud-sun"
                      ></i>
                    </div>
                    <div
                      class="menu-item-content"
                    >
                      <h6>Refrigerio</h6>
                      <p class="mb-0">
                        {{ menuHoy.refrigerio }}
                      </p>
                      <small class="text-muted"
                        >{{
                          menuHoy.caloriaRefrigerio
                        }}
                        kcal</small
                      >
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div
                    class="alert alert-info mb-0"
                  >
                    <strong
                      >Total del día:</strong
                    >
                    {{ menuHoy.caloriasTotales }}
                    kcal
                  </div>
                </div>
              </div>
            </div>
            <div
              v-else
              class="text-center text-muted py-4"
            >
              <i
                class="bi bi-calendar-x display-4 mb-3"
              ></i>
              <p>
                No hay menú registrado para hoy
              </p>
              <button
                class="btn btn-primary"
                @click="goToMenuSemanal"
              >
                Crear Menú
              </button>
            </div>
          </div>
        </div>

        <!-- Lista Completa de Estudiantes -->
        <div
          class="card mb-4"
          id="seccion-estudiantes"
        >
          <div class="card-header">
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">
                <i
                  class="bi bi-people-fill me-2"
                ></i>
                Todos los Estudiantes
              </h5>
              <span class="badge bg-primary">{{
                estadisticas.estudiantesAsignados
              }}</span>
            </div>
          </div>
          <div class="card-body">
            <div
              v-if="
                estadisticas.estudiantesAsignados >
                0
              "
              class="table-responsive"
            >
              <table
                class="table table-hover mb-0"
              >
                <thead>
                  <tr>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Grado</th>
                    <th>Sección</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="estudiante in cargarEstudiantes()"
                    :key="estudiante.id"
                  >
                    <td>
                      <strong>{{
                        estudiante.name ||
                        `${
                          estudiante.nombres || ""
                        } ${
                          estudiante.apellidos ||
                          ""
                        }`
                      }}</strong>
                    </td>
                    <td>
                      {{ estudiante.email }}
                    </td>
                    <td>
                      {{
                        estudiante.grado ||
                        "No especificado"
                      }}
                    </td>
                    <td>
                      {{
                        estudiante.seccion ||
                        "No especificado"
                      }}
                    </td>
                    <td>
                      <span
                        v-if="
                          estudiante.alergias &&
                          estudiante.alergias
                            .length > 0
                        "
                        class="badge bg-warning text-dark"
                      >
                        <i
                          class="bi bi-exclamation-triangle me-1"
                        ></i>
                        Con restricciones
                      </span>
                      <span
                        v-else
                        class="badge bg-success"
                      >
                        <i
                          class="bi bi-check-circle me-1"
                        ></i>
                        Normal
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="
                          verDetalleEstudiante({
                            id: estudiante.id,
                            nombres:
                              estudiante.nombres ||
                              estudiante.name?.split(
                                ' '
                              )[0] ||
                              'Sin nombre',
                            apellidos:
                              estudiante.apellidos ||
                              estudiante.name
                                ?.split(' ')
                                .slice(1)
                                .join(' ') ||
                              'Sin apellido',
                            grado:
                              estudiante.grado ||
                              'No especificado',
                            paralelo:
                              estudiante.seccion ||
                              'No especificado',
                          })
                        "
                      >
                        <i class="bi bi-eye"></i>
                        Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-else
              class="text-center text-muted py-4"
            >
              <i
                class="bi bi-people display-4 mb-3"
              ></i>
              <p>
                No hay estudiantes registrados aún
              </p>
              <small
                >Los estudiantes aparecerán aquí
                cuando se registren desde
                administración o cuando creen
                cuenta</small
              >
            </div>
          </div>
        </div>

        <!-- Estudiantes con Restricciones -->
        <div class="card mb-4">
          <div class="card-header">
            <div
              class="d-flex justify-content-between align-items-center"
            >
              <h5 class="mb-0">
                <i
                  class="bi bi-exclamation-triangle me-2 text-warning"
                ></i>
                Estudiantes con Restricciones
                Alimentarias
              </h5>
              <span
                class="badge bg-warning text-dark"
                >{{
                  estudiantesConAlergias.length
                }}</span
              >
            </div>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table
                class="table table-hover mb-0"
              >
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Grado</th>
                    <th>
                      Alergias/Restricciones
                    </th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="estudiante in estudiantesConAlergias"
                    :key="estudiante.id"
                  >
                    <td>
                      <strong
                        >{{ estudiante.nombres }}
                        {{
                          estudiante.apellidos
                        }}</strong
                      >
                    </td>
                    <td>
                      {{ estudiante.grado }}
                      {{ estudiante.paralelo }}
                    </td>
                    <td>
                      <span
                        v-for="(
                          alergia, index
                        ) in estudiante.alergias"
                        :key="index"
                        class="badge bg-warning text-dark me-1"
                      >
                        {{ alergia }}
                      </span>
                    </td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary"
                        @click="
                          verDetalleEstudiante(
                            estudiante
                          )
                        "
                      >
                        <i class="bi bi-eye"></i>
                        Ver
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Actividades Recientes -->
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">
              <i
                class="bi bi-clock-history me-2"
              ></i>
              Actividad Reciente
            </h5>
          </div>
          <div class="card-body">
            <div class="timeline">
              <div
                v-for="(
                  actividad, index
                ) in actividadesRecientes"
                :key="index"
                class="timeline-item"
              >
                <div
                  class="timeline-icon"
                  :class="actividad.iconClass"
                >
                  <i :class="actividad.icon"></i>
                </div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <strong>{{
                      actividad.titulo
                    }}</strong>
                    <span
                      class="text-muted ms-2"
                      >{{ actividad.fecha }}</span
                    >
                  </div>
                  <p class="mb-0">
                    {{ actividad.descripcion }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Columna Lateral -->
      <div class="col-lg-4">
        <!-- Calendario Rápido -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-calendar3 me-2"></i>
              Calendario
            </h5>
          </div>
          <div class="card-body">
            <div class="calendar-quick">
              <div
                class="month-year text-center mb-3"
              >
                <h6 class="mb-0">
                  {{ mesAnio }}
                </h6>
              </div>
              <div
                class="info-text text-center text-muted"
              >
                <small
                  >Vista completa disponible en
                  Menú Semanal</small
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Recordatorios -->
        <div class="card mb-4">
          <div class="card-header">
            <h5 class="mb-0">
              <i class="bi bi-bell me-2"></i>
              Recordatorios
            </h5>
          </div>
          <div class="card-body">
            <div
              v-for="(
                recordatorio, index
              ) in recordatorios"
              :key="index"
              class="recordatorio-item"
              :class="recordatorio.prioridad"
            >
              <div class="d-flex">
                <div class="flex-grow-1">
                  <strong>{{
                    recordatorio.titulo
                  }}</strong>
                  <p class="mb-1 small">
                    {{ recordatorio.descripcion }}
                  </p>
                  <small class="text-muted">
                    <i
                      class="bi bi-calendar3 me-1"
                    ></i>
                    {{ recordatorio.fecha }}
                  </small>
                </div>
                <div>
                  <button
                    class="btn btn-sm btn-link text-muted"
                    @click="
                      marcarCompletado(index)
                    "
                  >
                    <i
                      class="bi bi-check-circle"
                    ></i>
                  </button>
                </div>
              </div>
            </div>
            <div
              v-if="recordatorios.length === 0"
              class="text-center text-muted py-3"
            >
              <i
                class="bi bi-check-circle display-6"
              ></i>
              <p class="mb-0">
                No hay recordatorios pendientes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Detalle del Estudiante -->
    <Teleport to="body">
      <div
        v-if="estudianteSeleccionado"
        class="modal fade show d-block"
        tabindex="-1"
        style="
          background-color: rgba(0, 0, 0, 0.5);
        "
        @click.self="cerrarModal"
      >
        <div
          class="modal-dialog modal-lg modal-dialog-centered"
        >
          <div class="modal-content">
            <div
              class="modal-header bg-primary text-white"
            >
              <h5 class="modal-title">
                <i
                  class="bi bi-person-circle me-2"
                ></i>
                Detalle del Estudiante
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="cerrarModal"
              ></button>
            </div>
            <div class="modal-body">
              <div class="row g-3">
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Nombre Completo:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.name ||
                      `${
                        estudianteSeleccionado.nombres ||
                        ""
                      } ${
                        estudianteSeleccionado.apellidos ||
                        ""
                      }`
                    }}
                  </p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Email:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.email
                    }}
                  </p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Grado:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.grado ||
                      "No especificado"
                    }}
                  </p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Sección:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.seccion ||
                      "No especificado"
                    }}
                  </p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Peso:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.peso
                        ? `${estudianteSeleccionado.peso} kg`
                        : "No registrado"
                    }}
                  </p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Altura:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.altura
                        ? `${estudianteSeleccionado.altura} cm`
                        : "No registrado"
                    }}
                  </p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Grupo Sanguíneo:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.grupoSanguineo ||
                      "No registrado"
                    }}
                  </p>
                </div>
                <div class="col-md-6">
                  <div class="fw-bold mb-1">
                    Teléfono:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.telefono ||
                      "No registrado"
                    }}
                  </p>
                </div>
                <div class="col-12">
                  <div class="fw-bold mb-1">
                    Alergias/Restricciones
                    Alimentarias:
                  </div>
                  <div
                    v-if="
                      estudianteSeleccionado.alergias &&
                      estudianteSeleccionado
                        .alergias.length > 0
                    "
                  >
                    <span
                      v-for="(
                        alergia, index
                      ) in estudianteSeleccionado.alergias"
                      :key="index"
                      class="badge bg-warning text-dark me-2 mb-2"
                    >
                      <i
                        class="bi bi-exclamation-triangle me-1"
                      ></i>
                      {{ alergia }}
                    </span>
                  </div>
                  <p v-else class="text-muted">
                    Sin restricciones registradas
                  </p>
                </div>
                <div
                  v-if="
                    estudianteSeleccionado.condicionesMedicas
                  "
                  class="col-12"
                >
                  <div class="fw-bold mb-1">
                    Condiciones Médicas:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.condicionesMedicas
                    }}
                  </p>
                </div>
                <div
                  v-if="
                    estudianteSeleccionado.medicamentos
                  "
                  class="col-12"
                >
                  <div class="fw-bold mb-1">
                    Medicamentos:
                  </div>
                  <p>
                    {{
                      estudianteSeleccionado.medicamentos
                    }}
                  </p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cerrarModal"
              >
                Cerrar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="asignarMenuPersonalizado"
              >
                <i
                  class="bi bi-calendar-plus me-2"
                ></i>
                Asignar Menú Personalizado
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal de Agregar Recordatorio -->
    <Teleport to="body">
      <div
        v-if="mostrarModalRecordatorio"
        class="modal fade show d-block"
        tabindex="-1"
        style="
          background-color: rgba(0, 0, 0, 0.5);
        "
        @click.self="cerrarModalRecordatorio"
      >
        <div
          class="modal-dialog modal-dialog-centered"
        >
          <div class="modal-content">
            <div
              class="modal-header bg-primary text-white"
            >
              <h5 class="modal-title">
                <i
                  class="bi bi-bell-fill me-2"
                ></i>
                Nuevo Recordatorio
              </h5>
              <button
                type="button"
                class="btn-close btn-close-white"
                @click="cerrarModalRecordatorio"
              ></button>
            </div>
            <div class="modal-body">
              <form
                @submit.prevent="
                  guardarRecordatorio
                "
              >
                <div class="mb-3">
                  <label
                    for="titulo-recordatorio"
                    class="form-label"
                    >Título</label
                  >
                  <input
                    type="text"
                    class="form-control"
                    id="titulo-recordatorio"
                    v-model="
                      nuevoRecordatorio.titulo
                    "
                    required
                    placeholder="Ej: Revisar menú de la próxima semana"
                  />
                </div>
                <div class="mb-3">
                  <label
                    for="descripcion-recordatorio"
                    class="form-label"
                    >Descripción</label
                  >
                  <textarea
                    class="form-control"
                    id="descripcion-recordatorio"
                    v-model="
                      nuevoRecordatorio.descripcion
                    "
                    rows="3"
                    required
                    placeholder="Describe el recordatorio..."
                  ></textarea>
                </div>
                <div class="mb-3">
                  <label
                    for="fecha-recordatorio"
                    class="form-label"
                    >Fecha</label
                  >
                  <input
                    type="date"
                    class="form-control"
                    id="fecha-recordatorio"
                    v-model="
                      nuevoRecordatorio.fecha
                    "
                    required
                  />
                </div>
                <div class="mb-3">
                  <div class="fw-bold mb-2">
                    Prioridad
                  </div>
                  <div class="btn-group w-100">
                    <input
                      type="radio"
                      class="btn-check"
                      name="prioridad"
                      id="prioridad-baja"
                      value="baja"
                      v-model="
                        nuevoRecordatorio.prioridad
                      "
                    />
                    <label
                      class="btn btn-outline-success"
                      for="prioridad-baja"
                    >
                      Baja
                    </label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="prioridad"
                      id="prioridad-media"
                      value="media"
                      v-model="
                        nuevoRecordatorio.prioridad
                      "
                    />
                    <label
                      class="btn btn-outline-warning"
                      for="prioridad-media"
                    >
                      Media
                    </label>

                    <input
                      type="radio"
                      class="btn-check"
                      name="prioridad"
                      id="prioridad-alta"
                      value="alta"
                      v-model="
                        nuevoRecordatorio.prioridad
                      "
                    />
                    <label
                      class="btn btn-outline-danger"
                      for="prioridad-alta"
                    >
                      Alta
                    </label>
                  </div>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                @click="cerrarModalRecordatorio"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="btn btn-primary"
                @click="guardarRecordatorio"
              >
                <i class="bi bi-save me-2"></i>
                Guardar Recordatorio
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

const router = useRouter();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

// Escuchar eventos globales
const handleAbrirRecordatorioEvent = () => {
  abrirModalRecordatorio();
};

const handleVerEstadisticasEvent = () => {
  verEstadisticas();
};

const handleGenerarReportesEvent = () => {
  verReportes();
};

onMounted(() => {
  globalThis.addEventListener(
    "app:abrir-recordatorio",
    handleAbrirRecordatorioEvent
  );
  globalThis.addEventListener(
    "app:ver-estadisticas",
    handleVerEstadisticasEvent
  );
  globalThis.addEventListener(
    "app:generar-reportes",
    handleGenerarReportesEvent
  );
});

onUnmounted(() => {
  globalThis.removeEventListener(
    "app:abrir-recordatorio",
    handleAbrirRecordatorioEvent
  );
  globalThis.removeEventListener(
    "app:ver-estadisticas",
    handleVerEstadisticasEvent
  );
  globalThis.removeEventListener(
    "app:generar-reportes",
    handleGenerarReportesEvent
  );
});

const nombreNutricionista = computed(
  () => authStore.user?.name || "Nutricionista"
);

const fechaActual = computed(() => {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});

const diaActual = computed(() => {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
});

const mesAnio = computed(() => {
  return new Date().toLocaleDateString("es-ES", {
    month: "long",
    year: "numeric",
  });
});

// Cargar estudiantes desde localStorage
const cargarEstudiantes = () => {
  const users = JSON.parse(
    localStorage.getItem("users") || "[]"
  );
  return users.filter(
    (user) => user.role === "usuario"
  );
};

// Cargar menús desde localStorage
const cargarMenus = () => {
  return JSON.parse(
    localStorage.getItem("menus_semanales") ||
      "[]"
  );
};

// Estadísticas (calculadas desde localStorage)
const estadisticas = computed(() => {
  const estudiantes = cargarEstudiantes();
  const menus = cargarMenus();
  const estudiantesConAlergiasCount =
    estudiantes.filter(
      (est) =>
        est.alergias && est.alergias.length > 0
    ).length;

  return {
    estudiantesAsignados: estudiantes.length,
    menusActivos: menus.length,
    estudiantesAlergias:
      estudiantesConAlergiasCount,
  };
});

// Menú de hoy (desde localStorage)
const menuHoy = computed(() => {
  const menus = cargarMenus();
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const diaActualIndex = new Date().getDay();
  const diaActualNombre =
    diasSemana[diaActualIndex];

  const menuActual = menus.find(
    (menu) => menu.dia === diaActualNombre
  );

  if (menuActual) {
    const calcularCalorias = (comida) => {
      // Simulación de calorías basada en longitud del texto
      return Math.floor(comida.length * 8);
    };

    const caloriaDesayuno = calcularCalorias(
      menuActual.desayuno || ""
    );
    const caloriaAlmuerzo = calcularCalorias(
      menuActual.almuerzo || ""
    );
    const caloriaRefrigerio = calcularCalorias(
      menuActual.refrigerio || ""
    );

    return {
      desayuno:
        menuActual.desayuno || "No definido",
      caloriaDesayuno,
      almuerzo:
        menuActual.almuerzo || "No definido",
      caloriaAlmuerzo,
      refrigerio:
        menuActual.refrigerio || "No definido",
      caloriaRefrigerio,
      caloriasTotales:
        caloriaDesayuno +
        caloriaAlmuerzo +
        caloriaRefrigerio,
    };
  }

  return {
    desayuno: "No hay menú definido para hoy",
    caloriaDesayuno: 0,
    almuerzo: "No hay menú definido para hoy",
    caloriaAlmuerzo: 0,
    refrigerio: "No hay menú definido para hoy",
    caloriaRefrigerio: 0,
    caloriasTotales: 0,
  };
});

// Estudiantes con alergias (desde localStorage)
const estudiantesConAlergias = computed(() => {
  const estudiantes = cargarEstudiantes();
  return estudiantes
    .filter(
      (est) =>
        est.alergias && est.alergias.length > 0
    )
    .map((est) => ({
      id: est.id,
      nombres:
        est.nombres ||
        est.name?.split(" ")[0] ||
        "Sin nombre",
      apellidos:
        est.apellidos ||
        est.name?.split(" ").slice(1).join(" ") ||
        "Sin apellido",
      grado: est.grado || "No especificado",
      paralelo: est.seccion || "No especificado",
      alergias: Array.isArray(est.alergias)
        ? est.alergias
        : [est.alergias],
    }));
});

// Cargar actividades desde localStorage
const cargarActividades = () => {
  const actividadesGuardadas =
    localStorage.getItem(
      "actividades_nutricionista"
    );
  return actividadesGuardadas
    ? JSON.parse(actividadesGuardadas)
    : [];
};

// Guardar actividades en localStorage
const guardarActividad = (actividad) => {
  const actividades = cargarActividades();
  actividades.unshift(actividad); // Agregar al inicio
  // Mantener solo las últimas 10 actividades
  if (actividades.length > 10) {
    actividades.pop();
  }
  localStorage.setItem(
    "actividades_nutricionista",
    JSON.stringify(actividades)
  );
};

// Actividades recientes (desde localStorage)
const actividadesRecientes = ref(
  cargarActividades()
);

// Cargar recordatorios desde localStorage
const cargarRecordatorios = () => {
  const recordatoriosGuardados =
    localStorage.getItem(
      "recordatorios_nutricionista"
    );
  return recordatoriosGuardados
    ? JSON.parse(recordatoriosGuardados)
    : [];
};

// Guardar recordatorios en localStorage
const guardarRecordatoriosEnStorage = (
  recordatoriosArray
) => {
  localStorage.setItem(
    "recordatorios_nutricionista",
    JSON.stringify(recordatoriosArray)
  );
};

// Recordatorios (desde localStorage)
const recordatorios = ref(cargarRecordatorios());

// Variable para el modal del estudiante
const estudianteSeleccionado = ref(null);

// Variables para el modal de recordatorios
const mostrarModalRecordatorio = ref(false);
const nuevoRecordatorio = ref({
  titulo: "",
  descripcion: "",
  fecha: "",
  prioridad: "media",
});

// Funciones
function goToMenuSemanal() {
  router.push({ name: "nutricionista-menu" });
}

function crearNuevoMenu() {
  router.push({
    name: "nutricionista-menu",
    query: { crear: "true" },
  });
}

function verEstadisticas() {
  const estudiantes = cargarEstudiantes();
  const menus = cargarMenus();

  // Calcular estadísticas detalladas
  const totalEstudiantes = estudiantes.length;
  const conAlergias = estudiantes.filter(
    (est) =>
      est.alergias && est.alergias.length > 0
  ).length;
  const sinAlergias =
    totalEstudiantes - conAlergias;
  const totalMenus = menus.length;

  // Agrupar por grado
  const porGrado = estudiantes.reduce(
    (acc, est) => {
      const grado =
        est.grado || "Sin especificar";
      acc[grado] = (acc[grado] || 0) + 1;
      return acc;
    },
    {}
  );

  // Alergias más comunes
  const todasAlergias = estudiantes
    .filter(
      (est) =>
        est.alergias && est.alergias.length > 0
    )
    .flatMap((est) => est.alergias);

  const alergiasCount = todasAlergias.reduce(
    (acc, alergia) => {
      acc[alergia] = (acc[alergia] || 0) + 1;
      return acc;
    },
    {}
  );

  const estadisticasDetalladas = {
    fecha: new Date().toLocaleDateString("es-ES"),
    totalEstudiantes,
    conAlergias,
    sinAlergias,
    porcentajeConAlergias:
      totalEstudiantes > 0
        ? (
            (conAlergias / totalEstudiantes) *
            100
          ).toFixed(1)
        : 0,
    totalMenus,
    distribucionPorGrado: porGrado,
    alergiasComunes: alergiasCount,
  };

  // Mostrar estadísticas en consola (para desarrollo)
  console.log(
    "📊 ESTADÍSTICAS DEL SISTEMA:",
    estadisticasDetalladas
  );

  notificationStore.addNotification({
    type: "success",
    message: `Estadísticas: ${totalEstudiantes} estudiantes, ${conAlergias} con alergias (${estadisticasDetalladas.porcentajeConAlergias}%), ${totalMenus} menús activos`,
  });

  // Registrar actividad
  guardarActividad({
    titulo: "Estadísticas consultadas",
    descripcion: `Se consultaron las estadísticas del sistema`,
    fecha: "Ahora mismo",
    icon: "bi bi-graph-up",
    iconClass: "bg-info",
  });
  actividadesRecientes.value =
    cargarActividades();
}

function verReportes() {
  const estudiantes = cargarEstudiantes();
  const menus = cargarMenus();
  const fecha = new Date().toLocaleDateString(
    "es-ES"
  );

  const reporte = {
    titulo: "Reporte de Nutrición Escolar",
    fecha,
    generadoPor: nombreNutricionista.value,
    resumen: {
      totalEstudiantes: estudiantes.length,
      estudiantesConAlergias: estudiantes.filter(
        (est) =>
          est.alergias && est.alergias.length > 0
      ).length,
      menusActivos: menus.length,
    },
    estudiantes: estudiantes.map((est) => ({
      nombre:
        est.name ||
        `${est.nombres} ${est.apellidos}`,
      email: est.email,
      grado: est.grado || "No especificado",
      seccion: est.seccion || "No especificado",
      alergias: est.alergias || [],
      peso: est.peso || "No registrado",
      altura: est.altura || "No registrado",
      grupoSanguineo:
        est.grupoSanguineo || "No registrado",
    })),
    menus: menus.map((menu) => ({
      dia: menu.dia,
      desayuno: menu.desayuno,
      almuerzo: menu.almuerzo,
      refrigerio: menu.refrigerio,
    })),
  };

  // Generar archivo JSON
  const dataStr = JSON.stringify(
    reporte,
    null,
    2
  );
  const dataBlob = new Blob([dataStr], {
    type: "application/json",
  });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `reporte_nutricion_${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);

  notificationStore.addNotification({
    type: "success",
    message:
      "Reporte generado y descargado exitosamente",
  });

  // Registrar actividad
  guardarActividad({
    titulo: "Reporte generado",
    descripcion: `Se generó el reporte de nutrición con ${estudiantes.length} estudiantes`,
    fecha: "Ahora mismo",
    icon: "bi bi-file-earmark-text",
    iconClass: "bg-success",
  });
  actividadesRecientes.value =
    cargarActividades();
}

function verDetalleEstudiante(estudiante) {
  const estudianteCompleto =
    cargarEstudiantes().find(
      (est) => est.id === estudiante.id
    );

  if (estudianteCompleto) {
    estudianteSeleccionado.value =
      estudianteCompleto;
    console.log(
      "👤 DETALLE DEL ESTUDIANTE:",
      estudianteCompleto
    );
  }
}

function cerrarModal() {
  estudianteSeleccionado.value = null;
}

function asignarMenuPersonalizado() {
  if (!estudianteSeleccionado.value) return;

  notificationStore.addNotification({
    type: "info",
    message: `Redirigiendo para asignar menú personalizado a ${
      estudianteSeleccionado.value.name ||
      estudianteSeleccionado.value.nombres
    }`,
  });

  // Guardar el estudiante en localStorage para usarlo en MenuSemanalView
  localStorage.setItem(
    "estudiante_menu_asignacion",
    JSON.stringify(estudianteSeleccionado.value)
  );

  cerrarModal();
  router.push({
    name: "nutricionista-menu",
    query: {
      estudianteId:
        estudianteSeleccionado.value.id,
      personalizar: "true",
    },
  });
}

function marcarCompletado(index) {
  const recordatorio = recordatorios.value[index];
  recordatorios.value.splice(index, 1);
  guardarRecordatoriosEnStorage(
    recordatorios.value
  );
  notificationStore.addNotification({
    type: "success",
    message:
      "Recordatorio marcado como completado",
  });

  // Registrar actividad
  guardarActividad({
    titulo: "Recordatorio completado",
    descripcion: `Se completó: ${recordatorio.titulo}`,
    fecha: "Ahora mismo",
    icon: "bi bi-check-circle",
    iconClass: "bg-success",
  });
  actividadesRecientes.value =
    cargarActividades();
}

function abrirModalRecordatorio() {
  mostrarModalRecordatorio.value = true;
  // Limpiar el formulario
  nuevoRecordatorio.value = {
    titulo: "",
    descripcion: "",
    fecha: "",
    prioridad: "media",
  };
}

function cerrarModalRecordatorio() {
  mostrarModalRecordatorio.value = false;
  nuevoRecordatorio.value = {
    titulo: "",
    descripcion: "",
    fecha: "",
    prioridad: "media",
  };
}

function guardarRecordatorio() {
  // Validar campos
  if (
    !nuevoRecordatorio.value.titulo ||
    !nuevoRecordatorio.value.descripcion ||
    !nuevoRecordatorio.value.fecha
  ) {
    notificationStore.addNotification({
      type: "error",
      message:
        "Por favor completa todos los campos",
    });
    return;
  }

  // Formatear fecha para mostrar
  const fechaFormateada = new Date(
    nuevoRecordatorio.value.fecha
  ).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Agregar nuevo recordatorio
  recordatorios.value.unshift({
    titulo: nuevoRecordatorio.value.titulo,
    descripcion:
      nuevoRecordatorio.value.descripcion,
    fecha: fechaFormateada,
    prioridad: nuevoRecordatorio.value.prioridad,
  });

  // Guardar en localStorage
  guardarRecordatoriosEnStorage(
    recordatorios.value
  );

  notificationStore.addNotification({
    type: "success",
    message: "Recordatorio agregado exitosamente",
  });

  cerrarModalRecordatorio();

  // Registrar actividad
  guardarActividad({
    titulo: "Recordatorio creado",
    descripcion: `Se creó el recordatorio: ${nuevoRecordatorio.value.titulo}`,
    fecha: "Ahora mismo",
    icon: "bi bi-bell-fill",
    iconClass: "bg-success",
  });

  // Actualizar la vista de actividades
  actividadesRecientes.value =
    cargarActividades();
}

function scrollToEstudiantes() {
  const elemento = document.getElementById(
    "seccion-estudiantes"
  );
  if (elemento) {
    elemento.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
}
</script>

<style scoped>
.dashboard-nutricionista {
  padding: 0;
}

.welcome-banner {
  background: linear-gradient(
    135deg,
    #3a4ab3 0%,
    #442660 100%
  );
  padding: 2rem;
  border-radius: 12px;
  color: #f8f9fa;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}

.stat-card {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 1.75rem;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1;
  margin-bottom: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-primary);
  opacity: 0.8;
  font-weight: 500;
}

.menu-hoy {
  padding: 0;
}

.menu-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: 8px;
  align-items: flex-start;
}

.menu-item-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(
    135deg,
    #667eea 0%,
    #764ba2 100%
  );
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
  color: white;
}

.menu-item-content {
  flex: 1;
}

.menu-item-content h6 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 600;
}

.menu-item-content p {
  color: var(--text-primary) !important;
  font-size: 0.9rem;
}

.menu-item-content small {
  color: var(--text-primary) !important;
  opacity: 0.7;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline-item {
  position: relative;
  padding-bottom: 1.5rem;
}

.timeline-item:last-child {
  padding-bottom: 0;
}

.timeline-item::before {
  content: "";
  position: absolute;
  left: -1.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #e9ecef;
}

.timeline-icon {
  position: absolute;
  left: -2rem;
  top: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #212529;
  font-size: 0.875rem;
  text-shadow: none;
}

.timeline-content {
  background: var(--bg-secondary);
  padding: 0.75rem 1rem;
  border-radius: 8px;
}

.timeline-content strong,
.timeline-content p {
  color: var(--text-primary) !important;
}

.timeline-content .text-muted {
  color: var(--text-primary) !important;
  opacity: 0.7;
}

.timeline-header {
  margin-bottom: 0.25rem;
}

.recordatorio-item {
  padding: 0.75rem;
  border-left: 3px solid #dee2e6;
  background: var(--bg-secondary);
  border-radius: 4px;
  margin-bottom: 0.75rem;
}

.recordatorio-item strong,
.recordatorio-item p,
.recordatorio-item small {
  color: var(--text-primary) !important;
}

.recordatorio-item .text-muted {
  opacity: 0.7;
}

.recordatorio-item.alta {
  border-left-color: #dc3545;
}

.recordatorio-item.media {
  border-left-color: #ffc107;
}

.recordatorio-item.baja {
  border-left-color: #17a2b8;
}

.calendar-quick {
  text-align: center;
}

.month-year {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.info-text {
  color: var(--text-primary) !important;
  opacity: 0.7;
}
</style>
